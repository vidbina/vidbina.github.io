---
layout: post
title: Python and Qt Development in Nix
description: |
  This post is a 15mins write-up because I just fucked up and overwrote a draft
  post that I had thoughtfully put together. Done is better than perfect.
date:  2020-12-31 16:57:50 +0000
type: tooling # for icon
category: tooling # for url
tags:
 - Python
 - Python3
 - Qt5
 - PyQt5
 - Qt
 - NixOS
 - Nix
 - poetry2nix
 - Poetry
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

# Background

Long story short, when it comes to Qt application development in Python, there
are two leading bindings *PyQt*, by Riverbank Computing, and *PySide*, by the
Qt authors themselves. PyQt has beat the punch to PySide from time to time,
resulting to it being a widely used Qt-to-python binding lib. Refer to the
[CodersLegacy article][vs] write-up on some differences between the frameworks
in case you need some additional details. :wink:

> :bulb: Just use PyQt5 to keep your live simple. The API's are very similar.
> Even if you're shipping commercial software, it would be a good practice ship
> the source code to the client upon purchasing a copy so don't let the use of
> the GPL license by PyQt5 frighten you.

[vs]: https://coderslegacy.com/pyside-vs-pyqt-difference/
