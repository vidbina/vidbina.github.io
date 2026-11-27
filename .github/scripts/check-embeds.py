#!/usr/bin/env python3
"""Fail when a built page or the feed can load a third party without the visitor's consent.

Usage: check-embeds.py SITE_DIR [EMBEDS_DATA_DIR]

A page passes when every third-party load outside a <template> is blocked
by the page's own Content-Security-Policy, and every gate names a provider
that has a data file. Loads inside a <template> only happen after a click.

The feed (SITE_DIR/feed.xml, when present) passes when no entry carries
<content>, every <summary> is plain text with no markup and no URL to
another host, and no url/href/src attribute (such as media:thumbnail) or
<icon>/<logo> points at another host. Feed readers never run the consent
script, so the feed must not carry anything a reader could load.

.github/scripts/domcheck runs the same checks against the local preview.
"""
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlparse

# Which directive governs each kind of load.
LOADS = {
    ('iframe', 'src'): 'frame-src',
    ('script', 'src'): 'script-src',
    ('img', 'src'): 'img-src',
    ('img', 'srcset'): 'img-src',
    ('source', 'src'): 'media-src',
    ('source', 'srcset'): 'img-src',
    ('video', 'src'): 'media-src',
    ('video', 'poster'): 'img-src',
    ('audio', 'src'): 'media-src',
    ('track', 'src'): 'media-src',
    ('embed', 'src'): 'object-src',
    ('object', 'data'): 'object-src',
    ('input', 'src'): 'img-src',
}
LINK_RELS = {'stylesheet': 'style-src', 'icon': 'img-src', 'preload': 'default-src',
             'prefetch': 'default-src', 'modulepreload': 'script-src', 'manifest': 'manifest-src'}

ATOM = '{http://www.w3.org/2005/Atom}'
MARKUP = re.compile(r'<\s*[/!?]?\s*[A-Za-z]')
URL = re.compile(r'(?:https?:)?//[^\s"\'<>()]+', re.I)
# Attributes a feed reader may fetch, such as media:thumbnail url= and
# media:content url=, which jekyll-feed writes for a post's image:.
FEED_URL_ATTRS = ('url', 'href', 'src')
# Elements whose text is an image URL that readers show.
FEED_URL_TEXT = (f'{ATOM}icon', f'{ATOM}logo')


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.policy = None
        self.loads = []
        self.providers = set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'template':
            self.depth += 1
        if tag == 'meta' and (a.get('http-equiv') or '').lower() == 'content-security-policy':
            self.policy = parse_policy(a.get('content') or '')
        if a.get('data-provider') and 'consent' in (a.get('class') or '').split():
            self.providers.add(a['data-provider'])
        if self.depth:
            return
        for (t, attr), directive in LOADS.items():
            if tag == t and a.get(attr):
                urls = [u.strip().split(' ')[0] for u in a[attr].split(',')] if attr == 'srcset' else [a[attr]]
                self.loads += [(directive, u, self.getpos()[0]) for u in urls]
        if tag == 'link' and a.get('href'):
            for rel in (a.get('rel') or '').split():
                if rel in LINK_RELS:
                    self.loads.append((LINK_RELS[rel], a['href'], self.getpos()[0]))
        for u in re.findall(r'url\(["\']?([^)"\']+)', a.get('style') or ''):
            self.loads.append(('img-src', u, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag == 'template':
            self.depth -= 1


def parse_policy(text):
    policy = {}
    for part in text.split(';'):
        words = part.split()
        if words:
            policy[words[0].lower()] = words[1:]
    return policy


def third_party(url):
    if url.startswith('//'):
        url = 'https:' + url
    parsed = urlparse(url)
    return parsed if parsed.scheme in ('http', 'https') and parsed.hostname else None


def allowed(policy, directive, url):
    sources = policy.get(directive, policy.get('default-src', ['*']))
    for source in sources:
        if source == '*':
            return True
        if source.startswith("'") or source.endswith(':'):
            continue
        s = urlparse(source if '://' in source else 'https://' + source)
        if s.scheme and s.scheme != url.scheme:
            continue
        host = s.hostname or ''
        if host == url.hostname or (host.startswith('*.') and url.hostname.endswith(host[1:])):
            return True
    return False


def known_providers(data_dir):
    return {f[:-4] for f in os.listdir(data_dir) if f.endswith('.yml')} if data_dir else None


def check_page(rel, html, known):
    """Return (problems, blocked) for one page's HTML."""
    page = Page()
    page.feed(html)
    problems, blocked = [], 0
    for provider in sorted(page.providers - known if known is not None else set()):
        problems.append(f'{rel}: gate for "{provider}" has no _data/embeds/{provider}.yml')
    for directive, raw, line in page.loads:
        url = third_party(raw)
        if not url:
            continue
        if page.policy is None:
            problems.append(f'{rel}:{line}: no Content-Security-Policy, so {raw} loads on open')
        elif allowed(page.policy, directive, url):
            problems.append(f'{rel}:{line}: {raw} is outside a gate and {directive} allows it')
        else:
            blocked += 1
    return problems, blocked


def check_feed(rel, text):
    """Return (problems, entries) for an Atom feed's XML."""
    try:
        root = ET.fromstring(text)
    except ET.ParseError as e:
        return [f'{rel}: not well-formed XML ({e})'], 0
    own = {third_party(link.get('href') or '').hostname
           for link in root.findall(f'{ATOM}link') if third_party(link.get('href') or '')}
    problems = []

    def foreign_urls(where, elements):
        for el in elements:
            raws = [el.get(a) for a in FEED_URL_ATTRS if el.get(a)]
            if el.tag in FEED_URL_TEXT and el.text:
                raws.append(el.text.strip())
            for raw in raws:
                url = third_party(raw)
                if url and url.hostname not in own:
                    tag = el.tag.split('}')[-1]
                    problems.append(f'{rel}: {where} has <{tag}> pointing at {raw}, which a reader can load')

    entries = root.findall(f'{ATOM}entry')
    foreign_urls('the feed', [el for child in root if child.tag != f'{ATOM}entry' for el in child.iter()])
    for entry in entries:
        name = (entry.findtext(f'{ATOM}id') or entry.findtext(f'{ATOM}title') or '?').strip()
        foreign_urls(f'entry {name}', entry.iter())
        if entry.find(f'{ATOM}content') is not None:
            problems.append(f'{rel}: entry {name} carries <content>, which can hold embeds')
        for summary in entry.findall(f'{ATOM}summary'):
            text = ''.join(summary.itertext())
            if MARKUP.search(text):
                problems.append(f'{rel}: entry {name} has markup in its <summary>')
            for raw in URL.findall(text):
                url = third_party(raw)
                if url and url.hostname not in own:
                    problems.append(f'{rel}: entry {name} links {raw} in its <summary>')
    return problems, len(entries)


def check(site, data_dir):
    known = known_providers(data_dir)
    problems, blocked, pages = [], 0, 0
    for root, dirs, files in os.walk(site):
        dirs[:] = [d for d in dirs if os.path.relpath(os.path.join(root, d), site) != os.path.join('js', 'MathJax')]
        for name in files:
            if not name.endswith('.html'):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, site)
            found, n = check_page(rel, open(path, encoding='utf-8', errors='replace').read(), known)
            problems += found
            blocked += n
            pages += 1
    feed_note = 'no feed.xml'
    feed = os.path.join(site, 'feed.xml')
    if os.path.isfile(feed):
        found, entries = check_feed('feed.xml', open(feed, encoding='utf-8', errors='replace').read())
        problems += found
        feed_note = f'{entries} feed entries checked'
    for p in problems:
        print(p)
    print(f'{pages} pages checked, {blocked} ungated third-party loads blocked by policy, '
          f'{feed_note}, {len(problems)} problems')
    return not problems


if __name__ == '__main__':
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    sys.exit(0 if check(sys.argv[1], sys.argv[2] if len(sys.argv) == 3 else None) else 1)
