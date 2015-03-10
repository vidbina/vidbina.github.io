---
layout: post
title:  Burrowing Your Way Through the Web
date:   2015-03-10 19:29:14
type: tools
tags:
 - ssh
 - tunnel
 - secure
 - routing
 - web
mathjax: true
description: The magic of tunneling
---

```bash
ssh -f -L 80:target.com:80 -N user@intermediate
```

```bash
ps aux | grep ssh
```

```bash
lsof -i -n | egrep ssh
```
[ssh-tunneling-intro]: http://www.revsys.com/writings/quicktips/ssh-tunnel.html
[list-open-tunnels]: http://superuser.com/questions/248389/list-open-ssh-tunnels:w
