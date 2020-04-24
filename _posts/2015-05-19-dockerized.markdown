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
 - CoreOS
emojify: true
description: "Some notes that end up saving my ass once I start playing around
with containers again after small sabbaticals. That happens with spongy brains&hellip;
a lot soaks in, but somehow details seep out in time."
---
I do a thing or two with containers from time to time, that involves building
Mesosphere or Kubernetes setups. Often enough my OS of choice happens to be
CoreOS, but as ashamed as I am I should mention that I often end up scratching
my head and wondering what the hell that command was again
:pensive:?!? Hope this helps me recall.

<iframe src="//giphy.com/embed/OP7kIfBat5sGY?html5=true" width="480" height="270" frameBorder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

<!--
```bash
docker run -i -t busybox /bin/sh env
```

LXC

 - virtual memory
 - kernel sharing


```bash
lvcreate -n test1 -L3G work
```

 - volume group: work
 - volume name: test1

```bash
lxc-start -n test1
```

no go

```
screen -S test1 lxc-start -n test1
```
-->

# Services
Provided, that you are using CoreOS as your VM OS, you may configure your boxes
through the so-called `cloud-config` files. In several setups you will provide
`etcd` details in the cloud config file. This section will just give you a
general idea of where to look for your resources when introspecting CoreOS
boxes.

One may query the unit-files known to a CoreOS box by running the followng
command

```bash
systemctl list-unit-files
```

I, for one, often end up looking at the the service files of my `etcd.service`
which happen to be somewhere in `/run/systemd/system/etcd.service.d`. A
cloud-config containing

```yaml
#cloud-config
coreos:
  etcd:
    name: etcd
    addr: $private_ipv4:4001
    bind-addr: 0.0.0.0
    peer-addr: $private_ipv4:7001
    cluster-active-size: 1
    etcd-http-read-timeout: 86400
    snapshot: true
  units:
    - name: etcd.service
      command: start
```

May result to the following conf in the `etcd.service.d` directory:

```yaml
[Service]
Environment="ETCD_ADDR=10.220.4.81:4001"
Environment="ETCD_BIND_ADDR=0.0.0.0"
Environment="ETCD_CLUSTER_ACTIVE_SIZE=1"
Environment="ETCD_NAME=etcd"
Environment="ETCD_PEER_ADDR=10.220.4.81:7001"
Environment="ETCD_SNAPSHOT=true"
```

Some observation leads one to assume that there happens to be a one-to-one
correspondence between the `cloud-config` content and the eventual
configuration with the key names capitalized and prefixed with `ETCD\_` and
the `$private\_ipv4` token substituted for the machines private IP address.

According to the [CoreOS documentation][unit-file] one should find unit files
in the `/etc/systemd/system` directory.

[unit-file]: https://coreos.com/docs/launching-containers/launching/getting-started-with-systemd#unit-file

# Orchestration
Fleet handles orchestration on CoreOS clusters. Somewhere I once read to "think
of it as systemd for the cloud" and darn... that is spot on.

As you start daemons on your box with `systemctl` (controlling `systemd`) one
may start services on the cluster with `fleetctl` (controlling `fleetd`).

The beautiful thing, I came to learn about fleet is that it stores the settings
in `etcd`. I discovered it after, destroying some VM's, creating them anew and
discovering that somehow my services were magically spawned on the fresh boxes
without my intervention. Introspecting the `etcd` store left me clueless but
some [basic sleuthing][fleet-units-etcd] uncovered that fleet actually keeps
track of this information in hidden etcd keys. There is actually a world of
CoreOS-related `etcd` secrets to behold if you run
`etcdctl ls --recursive _coreos.com`).

[fleet-arch]: https://github.com/coreos/fleet/blob/master/Documentation/architecture.md
[fleet-units-etcd]: https://serverfault.com/questions/646053/where-coreoses-fleet-stores-submited-unit-files/646058#646058?newreg=82d76b94973c44df9ab17e3a195f51c2

<!--
# Update
`/etc/coreos/update.conf`

```bash
GROUP=alpha
REBOOT_STRATEGY=off
```
-->

# Discovery
The entire concept of clustering on CoreOS seems to require clustered machines
to share a discovery repository. This is the way clustered machines seem to
share information in the CoreOS world and [etcd][etcd-clustering] seems to be
one of the popular solutions for making this happen.

[etcd-clustering]: https://github.com/coreos/etcd/blob/master/Documentation/clustering.md

# Debugging
Somewhere along the line a unit/service breaks and needs to be debugged.

<iframe src="//giphy.com/embed/achBohanYCPPG?html5=true" width="480" height="464" frameBorder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

CoreOS logs everything into `/var/log/journal/*` and `journalctl` allows
one to view the content of these binary logs.

```bash
sudo journalctl --file=/var/log/journal/REF/FILE.log
```

I ran into the `"Failed units: 1"` notification which is presented at login.
After reviewing which services were up with `sudo systemctl list-units`, I
discovered that the `gce-coreos-cloudinit.service` had failed. Running
`journalctl` and filtering for the logs regarding a specific service using
the `-u SERVICENAME` parameters makes for much easier reading:

```bash
sudo journalctl -u gce-coreos-cloudinit.service --file=JOURNAL_FILE.log
```
