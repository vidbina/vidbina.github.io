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
 - SSL
 - backup
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

## DNS

In order to setup Klouddns the user is required to update a `A` and `TXT`
DNS record for the domain of interest.

<div class="element img">
  <img src="http://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/dns-for-kloudsec.png" alt="Updating DNS records through Route53 to get started with Kloudsec" />
</div>

## Notes

Keep CORS in mind, whenever moving to HTTPS as sane browsers refrain from
requesting assets over a non-secured connections. Per AWS S3 bucket, one can
configure CORS settings through the _Edit CORS Configuration_ control.

<div class="element img">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/cors-aws-s3.png" alt="CORS needs to be setup on S3 in order to access resources from the web page" />
</div>

<!--
## CDN

Kloudsec offers a few tricks for optimizing page load. One thing to 

## Shadowing

In order to provide some redundancy, Kloudsec offers a mirroring service that
basically
-->
