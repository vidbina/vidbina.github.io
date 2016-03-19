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
---
This morning I learned about Kloudsec, a service that offers a CDN, HTTP/SSL
encryption and shadowing in case Github pages becomes unavailable
:stuck_out_tongue:. 

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

<!--
<div class="element img">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/dns-for-kloudsec.png" alt="Updating DNS records through Route53 to get started with Kloudsec" />
</div>
-->

## Update CORS Policies

I serve some assets through S3 buckets. In order to ensure that my assets
are retrievable by the browser, it is important to properly configure CORS
on the buckets of interest. In my case, I rather explicitly state the domain
which is allowed to access the bucket cross domain which. Since
`http://vid.bina.me` is different to `https://vid.bina.me` I will need to
reflect that in my CORS policy.

<div class="element img">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/cors-aws-s3.png" alt="CORS needs to be setup on S3 in order to access resources from the web page" />
</div>

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>https://vid.bina.me</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
    </CORSRule>
</CORSConfiguration>
{% endhighlight %}

> If you choose a wildcard `*` as the allowed origin, be aware that anyone out
there will be allowed to embed resources from your bucket into their pages.
If you want to keep your S3 bills to a minimum, perhaps anyone who needs some
resources that you serve should consider mirroring them instead of serving them
directly from your bucket :wink:.

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
include BIND (recursive acronym for _Bird Internet Routing Daemon_) which as
the name implies deals with routing, while `pf` is used for packet filtering
in combination with `relayd` which aids in dynamically changing the `pf`
configuration, but don't take it from me.
[Read all about it on the Kloudsec site.][kloudsec-anycast].

<!--
## Shadowing

In order to provide some redundancy, Kloudsec offers a mirroring service that
basically
-->

[kloudsec-proxy]: https://blog.kloudsec.com/how-to-setup-github-custom-domain-with-https/
[kloudsec-anycast]: https://blog.kloudsec.com/building-an-anycast-network/
