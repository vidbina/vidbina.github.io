---
layout: post
title:  Heads in the GCloud
since:  2014-11-26 20:03
date:   2014-10-14 11:46
type: cloud
category: web
tags:
 - infrastructure
 - cloud
 - paas
 - google
 - web
 - devops
 - tools
mathjax: true
description: 
---
# Installation
I installed ```gcloud``` by cloning the google-cloud-sdk project and running
the install script

```./install.sh```

After the installation I completed my setup by sourcing the ```*.zsh``` (or 
```*.bash``` if you're still on that {{":wink:" | emojify }}) scripts at 
startup.

## Authentication
Google made authentication too easy. By simply running ```gcloud auth login```
you can get your box authenticated by following a link and following a 
surprisingly usage flow. I don't recall having done anything at all -- that is
how easy I felt it was.

# Projects
Google allows you to access multiple projects from the same account. The only
requirement is that you configure the name of your project which should specify
the context. This makes collaboration dead-simple as you only need to set which
project you are working on. Accomplishing something similar on AWS would 
require one to set up IAM credentials for such a user which makes it a bit less
straight-forward.

```gcloud config set project experiment42```

## Compute Instances
In order to get going you can simply install your boxes through the [instances 
create CLI command][gcloud-create].

```gcloud compute instances create box1 --image coreos --zone europe-west1-c```

The name of my instance is `box1`, the image is the CoreOS image and the zone 
is somewhere in Western Europe {{ ":wink:" | emojify }}. The command 
```gcloud compute images list``` displays all image flavors available, while
```gcloud compute zones list``` displays all zones available. Just a quick note,
zones exist within regions. On the 10th of december 2014, the `europe-west1`
region contains two zones which are available to host instances (specifically
`europe-west1-b` and `europe-west1-c`) I don't exactly know where in Europe 
these zones are located, but I'm pretty sure that I'll ping those units a bit
quicker from Amsterdam than I will the Asian or American units.

## Security
Google has taken taken the libery of setting up a baseline system that happens
to be quite secure. When firing up a service on one of your instances (let's 
say a webservice listening on port 80) you must explicitly allow acccess to
this port from the outside world. Just an example of the firewall rules by
default obtained through ```gcloud compute firewall-rules list``` states:

```
NAME                   NETWORK SRC_RANGES    RULES                        SRC_TAGS TARGET_TAGS
default-allow-icmp     default 0.0.0.0/0     icmp
default-allow-internal default A.B.0.0/16 tcp:1-65535,udp:1-65535,icmp
default-allow-rdp      default 0.0.0.0/0     tcp:3389
default-allow-ssh      default 0.0.0.0/0     tcp:22
```

In the `default-allow-icmp` rule we allow the internet to communicate with the
instances within your project using ICMP messages which allows the internet to
ping your boxes.

In the `default-allow-internal` rule we allow all TCP, UDP and ICMP traffic
from `A.B.0.0/16` which basically means the entire range of addresses masked
by the last 16 bits being `A.B.0.0` through `A.B.255.255`. The `A` and `B`
represent the first two octets of your internal IP addresses within your 
private address space where `A` will probably be `10` and `B` could be anything
between `0` and `255`.

The `default-allow-rdp` and `default-allow-ssh` rules allow RDP and SSH access
respectively by allowing traffic on the ports used for these services. I 
usually run tux boxes and will have no need for RDP so I could disable the RDP
rule.

```gcloud compute firewall-rules delete default-allow-rdp```

I do want to open up port 80 which is used by HTTP services serving webpages
whomever requests them.

```gcloud compute firewall-rules create allow-http --description --allow tcp:80 ```

[installing-gcloud]: https://cloud.google.com/sdk/
[gcloud-quickstart]: https://cloud.google.com/compute/docs/quickstart
[gcloud-create]: https://cloud.google.com/sdk/gcloud/reference/compute/instances/create
