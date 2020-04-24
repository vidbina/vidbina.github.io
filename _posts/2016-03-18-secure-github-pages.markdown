---
layout: post
title: Secure github-pages
description: |
  Noticed an e-mail from Kloudsec this morning. A few minutes after setting out
  to try the service my github page was CDN'ed, SSL'ed and shadowed.
date:  2016-03-18 16:29:15 +0100
type: web # for icon
category: web # for url
tags:
 - web
 - hosting
 - CDN
 - TLS
 - backup
 - cloud
#og:
#  type: article # http://ogp.me/#types
#  article: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value

#image:
#twitter:
#  card: summary_large_image
#  image: http://example.com
emojify: true
---
This morning I learned about Kloudsec, a service that offers a CDN, HTTPS
encryption and shadowing in case Github pages are unavailable[^1]
:stuck_out_tongue:.

<div class="element note">
**UPDATE (September 22, 2016)**: Kloudsec is down :sob:, but Steve left [a few
notes](https://www.reddit.com/r/webdev/comments/4s3kmf/got_an_email_saying_that_kloudsec_will_be/)
for his follower and clients. Do yourself a favor and ignore this post from now
on.
</div>

[^1]: Hell does freeze over [occasionally](https://news.ycombinator.com/item?id=7130624), so don't think you would never need it :wink:

## Update DNS

In order to setup Kloudsec the user is required to update `A` and `TXT`
DNS records for the domain of interest. The `A` record in my case points the
domain `vid.bina.me` to a Kloudsec proxy. Quang Huynh discusses in
[this post][kloudsec-proxy] how one may configure a Nginx proxy server with
a certificate obtained from [Let's Encrypt CA](https://letsencrypt.org/) to
provide a similar self-managed solution.

The `TXT` records is there for Kloudsec to verify control of the domain. It
is quite common for service providers to request the addition of `TXT` records
from their clients in order to allow the client to demonstrate some control
over the domain in question.

{% if false %}
<div class="element image">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/dns-for-kloudsec.png" alt="Updating DNS records through Route53 to get started with Kloudsec" />
</div>
{% endif %}

## Update CORS Policies

I serve some assets through S3 buckets. In order to ensure that my assets
are retrievable by the browser, it is important to properly configure CORS
on the buckets of interest. In my case, I rather explicitly state the domain
which is allowed to access the bucket cross domain which. Since
`http://vid.bina.me` is different to `https://vid.bina.me` I will need to
reflect that in my CORS policy.

<div class="element image">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/cors-aws-s3.gif" alt="CORS needs to be setup on S3 in order to access resources from the web page" />
</div>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>https://vid.bina.me</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
    </CORSRule>
</CORSConfiguration>
```

<div class="element note">
If you choose a wildcard `*` as the allowed origin, be aware that anyone out
there will be allowed to embed resources from your bucket into their pages.
If you want to keep your S3 bills to a minimum, perhaps anyone who needs some
resources that you serve should consider mirroring them instead of serving them
directly from your bucket :wink:.
</div>

## Update URL's

Another point of interest is rewriting all URL's to secured endpoints which
could be as easy as replacing every occurrence of `http://` with `https://`,
provided that the host in question offers supports HTTPS.

Retrieving unsecured resources from a secured site defeats the purpose of going
secure. Man in the middle attacks are still easily possible if anyone can
present itself as a mirror of some resource (.e.g: stylesheets, scripts,
images, etc). Every non-HTTPS resource requested travels over the wire
unencrypted and is sourced by a host who's identity we can not properly verify.

Secure connections, besides simply providing encryption, therefore also
provide some assurance regarding the authenticity of the endpoints in the
conversation. With TSL encryption between the endpoints, one could at least be
justified in assuming that the content is from an authentic source and no
impostor.

Rewriting all links is quite a chore, I'm in the middle of grepping through my
corpus to rewrite links. Some hosts do not serve their resources over HTTPS
which means that I will have to serve those resources from my S3 bucket, for
example, or find some other alternative. Be mindful of licenses and copyrights
whenever you consider mirroring resources.

Point is... if you serve a HTTPS page which embeds content from non-HTTPS
sources, you might as well not even have bothered serving the thing over
HTTPS. In my book, even if it is HTTPS served. It's unsecure! :unlock:

## CDN

Kloudsec offers a few tricks for optimizing page load. At the mere click of a
button any github page can be served through their CDN which leverages smart
routing schemes (instead of just relying on DNS) to provide a more reliable
means of finding the closest mirror for content. The tools of use at Kloudsec
include [`BIRD` (recursive acronym for _Bird Internet Routing Daemon_)][bird] which as
the name implies deals with routing, while
[`pf` is used for packet filtering][pf]
in combination with [`relayd`][relayd] which aids in dynamically changing the `pf`
configuration, but don't take it from me,
read the inside scoop from [Bach Le at Kloudsec][kloudsec-anycast].

## Friendly Defacing

Another thing to consider is that Kloudsec mutates the page with some
additional logic. The goodfellas and gals at Kloudsec need to record some
performance metrics for the dashboard, and just to get an impression of
whatever they add take a look at the source for [a simple HTML page](/blank)
that originally just contained the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>untitled</title>
    <script>console.log("here we go");</script>
  </head>
  <body>
    Move along. Nothing to see here!
  </body>
</html>
```

Essentially whatever happens here is that Kloudsec simply adds script tags to
your pages. Some service providers require you to do it yourself, but the
Kloudsec team just wanted to be helpful and take another worry off your
shoulders. Somewhere it kind of creeps me out that they do it for me, but I get
why they did it.

## CA Housekeeping

Another thing to consider is that using the Kloudsec service requires you to
**trust** Kloudsec. Kloudsec holds the certificates and they provide the first
front for your page on the web. They could provide resources that aren't yours
but are hardly indistinguishable from the resources you intended to provide.

In short, if there would be anything somewhere in the middle, it could be them.
To be fair, if Github were to offer HTTPS pages for custom domains, they
would have that power too, so what am I really bitching about here?!?
:stuck_out_tongue_closed_eyes: It's just a trust issue, but I felt I needed to
point it out clearly.

# Conclusion

In conclusion: The TLS, CDN and mirroring features that are offered are pretty
cool, a few topics raise minor concerns but I needed to invest less than 5
minutes of my live to see it work -- that is, if I
ignore all the work I still have left to do in removing all non-HTTPS links
throughout my repository :stuck_out_tongue:. It's pretty dope :metal:.

For now I've got some work to do :sweat:

<div class="element note">
**UPDATE (September 22, 2016)**: You could setup
[Cloudflare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)
if you still want serve secured github pages.
</div>

[kloudsec-proxy]: https://blog.kloudsec.com/how-to-setup-github-custom-domain-with-https/
[kloudsec-anycast]: https://blog.kloudsec.com/building-an-anycast-network/
[bird]: http://bird.network.cz/
[pf]: http://www.openbsd.org/faq/pf/
[relayd]: http://bsd.plumbing/
