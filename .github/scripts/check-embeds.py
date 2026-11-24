#!/usr/bin/env python3
"""Fail when a built page can load a third party without the visitor's consent.

Usage: check-embeds.py SITE_DIR [EMBEDS_DATA_DIR]

A page passes when every third-party load outside a <template> is blocked
by the page's own Content-Security-Policy, and every gate names a provider
that has a data file. Loads inside a <template> only happen after a click.
"""
import os
import re
import sys
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


def check(site, data_dir):
    known = {f[:-4] for f in os.listdir(data_dir) if f.endswith('.yml')} if data_dir else None
    problems, blocked, pages = [], 0, 0
    for root, dirs, files in os.walk(site):
        dirs[:] = [d for d in dirs if os.path.relpath(os.path.join(root, d), site) != os.path.join('js', 'MathJax')]
        for name in files:
            if not name.endswith('.html'):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, site)
            page = Page()
            page.feed(open(path, encoding='utf-8', errors='replace').read())
            pages += 1
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
    for p in problems:
        print(p)
    print(f'{pages} pages checked, {blocked} ungated third-party loads blocked by policy, {len(problems)} problems')
    return not problems


if __name__ == '__main__':
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    sys.exit(0 if check(sys.argv[1], sys.argv[2] if len(sys.argv) == 3 else None) else 1)
