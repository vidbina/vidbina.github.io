---
layout: post
title: Estonia's e-Residency & NixOS
description: |
  Safe yourself some trouble with the qesteidutil tool and just get the update
  if you are running into some certificate-related issues.
date:  2017-07-23 22:39:24 +0000
type: tools # for icon
category: tools # for url
tags:
 - tools
 - security
 - crypto
 - estonia
 - e-residency
 - bureaucracy
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
#twitter:
#  card: summary
#  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
head: mugshot
---
On my setup, the qesteidutil tool keeps throwing "empty certificates" errors
dialogs whenever I click on certificates.

<div class="element image">
  <img src="/img/qesteidutil-before.png" alt="The qesteidutil tool without the footer when certificate info isn't available.">
</div>

The utility's dialog displays no summary of the certificate details in the
footer which doesn't correspond with the depictions of the tools that I stumbled
accross on the internet. In that case don't even bother. Do yourself a favor
and install a new version of the qesteidutil tool. For NixOS, the available
package happened to be outdated, so here's what a recent qesteidutil is supposed
to look like.

<div class="element image">
  <img src="/img/qesteidutil-after-scaleddown.png" alt="The qesteidutil tool with the footer providing valuable information about the certificates.">
</div>

I've submitted a patch for NixOS that should be part of [17.03-small](https://github.com/NixOS/nixpkgs-channels/tree/nixos-17.03-small)
soon enough, if it gets accepted. If not, override the qesteidutil package in
your custom setup or perform the changes in the [qesteidutil: 3.12.2.1206 -> 3.12.5.1233](https://github.com/NixOS/nixpkgs/pull/27599)
PR to quickly move past this issue.

## Links

- [nixpkgs: Making patches](https://nixos.org/nixpkgs/manual/#idm140737316753264)
- [NixOS Manual: Adding custom packages](https://nixos.org/nixos/manual/index.html#sec-custom-packages)
- [qesteidutil source](https://installer.id.ee/media/ubuntu/pool/main/q/qesteidutil/)
