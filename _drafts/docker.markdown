---
layout: post
title: Dock(erize) those Containers
since: 2015-02-16 14:19:23
type: tools
category: cloud
tags:
 - infrastructure
 - containerization
 - lxc
 - docker
 - container
emojify: true
description: ""
---
```bash
docker run -i -t busybox /bin/sh env
```
LXC
- virtual memory
- kernel sharing


lvcreate -n test1 -L3G work
 - volume group: work
 - volume name: test1

```
lxc-start -n test1
```

no go

```
screen -S test1 lxc-start -n test1
```

```
systemctl list-unit-files
```

# Debugging
Somewhere along the line a unit/service breaks and needs to be debugged.
CoreOS logs everything into ```/var/log/journal/*``` and `journalctl` allows
one to view the content of the binary logs.

```bash
sudo journalctl --file=/var/log/journal/REF/FILE.log
```

I ran into the "Failed units: 1" notification. After reviewing which services
were up ```sudo systemctl list-units``` I discovered that the 
`gce-coreos-cloudinit.service` had failed. Running `journalctl` doesn't return
anything meaningful, but if I specify which journal file to use I get much better
results

```bash
sudo journalctl -u gce-coreos-cloudinit.service --file=JOURNAL_FILE.log
```
