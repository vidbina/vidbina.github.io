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
track of this information in hidden etcd keys (there is actually a world of 
CoreOS-related `etcd` secrets if you run `etcdctl ls --recursive /\_coreos.com`).

[fleet-arch]: https://github.com/coreos/fleet/blob/master/Documentation/architecture.md
[fleet-units-etcd]: https://serverfault.com/questions/646053/where-coreoses-fleet-stores-submited-unit-files/646058#646058?newreg=82d76b94973c44df9ab17e3a195f51c2

# Update
`/etc/coreos/update.conf`

```bash
GROUP=alpha
REBOOT_STRATEGY=off
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
