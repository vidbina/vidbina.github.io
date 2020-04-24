---
layout: post
title:  Heads in the GCloud
since:  2014-11-26 20:03
date:   2014-12-10 11:46
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
description: "Just a quick glance into running compute instances in the Google
Cloud using the CLI."
emojify: true
---
I've been playing around with the cloud for a while now (specifically AWS and
Google Cloud) and deemed it useful to publish a thing or two about the GCloud
CLI that I may use as a cheatsheet in the future.

# Installation
I installed `gcloud` by cloning the google-cloud-sdk project and running
the install script

{%highlight bash %}
./install.sh
{%endhighlight%}

After the installation I completed my setup by sourcing the `*.zsh` (or
`*.bash` if you're still on that :wink:) scripts at
startup.

Updating the `gcloud` CLI tool is as simple as running
`gcloud components update`.

## Authentication
Google made authentication too easy. By simply running

{%highlight bash %}
gcloud auth login
{%endhighlight%}

you can get your box authenticated by following a link and from that moment on
I pretty much forgot what happened -- that is how easy I felt it was.

# Projects
Google allows you to access multiple projects from the same account. The only
requirement is that you configure the name of your project which should specify
the context. This makes collaboration simple as I can easily add members to
a project and they would be able to access the project without any additional
effort. I could eventually transfer an entire infrastructure to a client if
necessary while still operational.

Accomplishing something similar on the collaboration part with AWS would
require one to set up IAM credentials for such a user which makes it a bit
less straight-forward for a simple guy like myself. You have to keep track of
multiple credential sets when working on multiple projects by multiple owners.
I understand the advantage from a security perspective, but on the usability
end it is quite a hassle (nothing that a few scripts can't solve though).

Anyways... You can choose to set the project for all subsequent gcloud commands
by configuring your gcloud setup

{%highlight bash %}
gcloud config set project experiment42
{%endhighlight%}

or choose to add the `--project` parameter option to every gcloud command you
are executing. In case you decide to script a lot of your gcloud stuff you may
want to consider using the `--project` option. Obviously, while experimenting,
the `config set` method will save me some keystrokes every time I execute a
gcloud call.

## Compute Instances
In order to get going you can simply install your boxes through the [instances
create CLI command][gcloud-create].

{%highlight bash %}
gcloud compute instances create box1 --image coreos --zone europe-west1-c
{%endhighlight%}

The name of my instance is `box1`, the image is the CoreOS image and the zone
is somewhere in Western Europe :wink:. The command

{%highlight bash %}
gcloud compute images list
{%endhighlight%} displays all image flavors available, while

{%highlight bash %}
gcloud compute zones list
{%endhighlight%} displays all zones available.

Zones and regions, you ask?
Well, zones exist within regions. On the 10th of december 2014, the `europe-west1`
region had two zones available to host instances (specifically
`europe-west1-b` and `europe-west1-c`). Zone `europe-west1-a` happened to be
deprecated at that time. I don't know how the zones relate to the
[individual datacenters][datacenters]; just didn't bother figuring it out yet
but I do know they are [building a new center in our dutch front garden][eemshaven].
Point is... latency between Amsterdam and my european units will be less
than the latency to Asian or American units.

## Security
Google has taken taken the libery of setting up a baseline system that happens
to be quite secure. When firing up a service on one of your instances (let's
say a webservice listening on port 80) you must explicitly allow acccess to
this port from the outside world. Just an example of the firewall rules by
default obtained through

{%highlight bash %}
gcloud compute firewall-rules list
{%endhighlight%} states:

{%highlight bash %}
NAME                   NETWORK SRC\_RANGES    RULES                        SRC_TAGS TARGET_TAGS
default-allow-icmp     default 0.0.0.0/0     icmp
default-allow-internal default A.B.0.0/16 tcp:1-65535,udp:1-65535,icmp
default-allow-rdp      default 0.0.0.0/0     tcp:3389
default-allow-ssh      default 0.0.0.0/0     tcp:22
{%endhighlight%}

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

{%highlight bash %}
gcloud compute firewall-rules delete default-allow-rdp
{%endhighlight%}

I do want to open up port 80 which is used by HTTP services serving webpages
whomever requests them.

{%highlight bash %}
gcloud compute firewall-rules create allow-http --description --allow tcp:80
{%endhighlight%}

Now my Google Cloud compute instance is ready to serve the world.

[eemshaven]: http://www.google.com/about/datacenters/inside/locations/eemshaven/
[datacenters]: http://www.google.com/about/datacenters/inside/locations/
[installing-gcloud]: https://cloud.google.com/sdk/
[gcloud-quickstart]: https://cloud.google.com/compute/docs/quickstart
[gcloud-create]: https://cloud.google.com/sdk/gcloud/reference/compute/instances/create
