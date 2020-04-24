---
layout: post
title:  Wifi Zones
date:   2015-10-17 17:02:51
type: networking
category: networking
tags:
 - wifi
 - wi-fi
 - WLAN
 - wireless
 - 802.11
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const_thumb.png
twitter:
  card: summary_large_image
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const1.png
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    section: Wireless Networking
description: |
  Just an idea to tackle the wireless networking problem in the
  radio-congested areas many of us call home.
---

I have spend the better part of the last months hanging around different
neighborhoods in Berlin (mostly Kreuzberg) and have been suffering from a lot
of network related problems.

Lately we've seen more devices rely on the 2.4 and 5 GHz bands for all sorts of
traffic which subsequently led to the overpopulation of users on this medium.

This morning I ran a `airport -s` scan, I noticed the excessive use of channels
1, 6 and 11. Everyone seems to be using the three non overlapping channels,
especially if routers are just used out-of-the-box.

```bash
System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport
```

<div class="element image animate">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/wlanscankreuzberg1.png" alt="WLAN scan in Kreuzberg" >
</div>

<div class="element image">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/wlanscankreuzberg2.png" alt="WLAN scan in Kreuzberg" >
</div>

<div class="element image">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/wlanscanguikreuzberg.png" alt="WLAN scan in Kreuzberg" >
</div>


<div class="element image light">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/2.4_GHz_Wi-Fi_channels_%28802.11b%2Cg_WLAN%29.svg/720px-2.4_GHz_Wi-Fi_channels_%28802.11b%2Cg_WLAN%29.svg.png" alt="Graphical representation of 2.4 GHz band channels">
</div>

Considering that Zigbee, Bluetooth, Handsets, and a plethora of other devices
are also riding the 2.4 GHz waves I have been thinking about ways to keep one's
radio space clear.

With older buildings I can imagine that retrofitting to shield against radio
pollution is a costly ordeal, but I feel like we can't afford to not think
about this in newer buildings. At some stage I could even imagine us installing
repeaters for GSM communications and set up work and office spaces as
completely shielded environments.

This would provide some added security on the physical level, since networks
are more bound by geometric constraints of the apartment blocks. Furthermore it
would provide increased network performance since the RSSI of neighboring
signals would be negligible due to the shielding methods employed. :wink:


## Read


 - [How to find the best Wi-fi Channel for your Router on Any Operating System (Howtogeek.com)](http://www.howtogeek.com/197268/how-to-find-the-best-wi-fi-channel-for-your-router-on-any-operating-system/)
 - [](http://www.letstalk-tech.com/how-to-access-the-wifi-scanner-in-mac-os-x-yosemite/)
 - [Mathematics of the Faraday Cage](https://people.maths.ox.ac.uk/trefethen/chapman_hewett_trefethen.pdf)
