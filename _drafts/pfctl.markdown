---
layout: post
title:  Bulletproofing Mac
date:   2015-11-4 01:02:51
type: tools
category: tools
tags:
 - security
 - firewall
 - hacking
 - macbook
 - osx
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const_thumb.png
twitter:
  card: summary_large_image
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const1.png
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    section: Securiity
description: Discussing some steps in setting up the OSX firewall.
# TODO: Fix syntax-highlighting on the code currently highlighted as bash while it isn't bash
---

I'm on a bus from Amsterdam to Berlin again. I just finished watching the
_The Good Shepherd_ and wasn't in the mood to watch anything else, read some
papers or sleep although it's 2am. It was initially the plan, but sometimes
flexibility isn't too bad so I'll start writing about OSX's packet filter
instead.

<div class="element note">
**DISCLAIMER**: I don't believe that any system will ever be bulletproof.
We'll just keep designing stronger, faster and more destructive bullets... or
bigger guns. I do, however; believe that securing yourself is infinitely less
stupid than ignoring it altogether and just logging on to every damn network
you can find.
</div>

The packet filter in OSX can be used to control incoming and outgoing traffic
into a machine. Nowadays, with all the hip coffee joints and coworking
spaces one needs to be especially mindful of its networking etiquette.

The packet filter works by enforcing _rules_ to be applied to _tables_ which
are basically sets of IP addresses or networks.

For illustrative purpose we could describe a _table_ named everything that
contains a CIDR of `0/0` which basically means `0.0.0.0` submasked `0.0.0.0`,
which covers the addresses `0.0.0.0` till `255.255.255.255`... yeah, everything
one can find in the IP4 constellation.

```bash
table <everything> const { 0/0 }
```

Here is how we can get `pfctl` to _show all_ it knows:

```bash
sudo pfctrl -s all
```

Add a new rule to the flixbus table which allows:

```bash
sudo pfctl -t flixbus -T add 1.2.3.4 5.6.7.8
```

Be extremely verbose in showing the existing tables in the main anchor.

```bash
sudo pfctl -vvsTables
```


```bash
usage: pfctl [-AdeghmNnOqRrvz] [-a anchor] [-D macro=value] [-F modifier]
        [-f file] [-i interface] [-K host | network] [-k host | network]
        [-o level] [-p device] [-s modifier] [-w interval]
        [-t table -T command [address ...]] [-x level]
```

## The Seven
Just for a full understanding there are 7 types of statements in

 - macros: user defined variables
 - tables: collections of addresses and/or networks
 - options: pf engine behavior tweaking
 - traffic normalization: protect innards against IP inconsistencies
 - queuing: rules for bandwidth control
 - translation: map (redirect) addresses
 - packet filtering: block or pass packets

### Options
With options, one can specify some options such as timeouts, optimization
strategies, memory consumption limits and a plethora of other useful stuff that
may enhance (positively or negatively) the performance of the setup.

One could even set the optimization level to `satellite` mode which is a
pretty cool alias for `high-latency` (which really makes a lot of sense if you
plan to be talking to satellites far away).

```bash
set optimization satellite
```


### Traffic Normalization
Buffer fragments until the complete packet is available and then pass it on to
the filter which means that the filter works less frequently but consumes
larger batches of content whenever it does.

```bash
scrub in on if all fragment reassemble
```

### Queuing
Three queues are described in the following example. One is assigned for
streamers (probably applications like Netflix, Fox, Hulu, UitzendingGemist,
Youtube and whatever else you can imagine) that have a quite a lot of
bandwidth. The readers queue is reserved for anything text-based, perhaps
everything I would generally describe as regular web-browsing. The priority on
this queue is higher in order to minimize the latency for such packets. We don't
care as much about the streaming. With the current bandwidth they should be
fine and most streaming protocols just drop packets that aren't there in time
anyways.

```bash
queue streamers bandwidth 90% priority 1 cbq(borrow)
queue readers bandwidth 10% priority 4 cbq(borrow)
block return out on eth0 inet all
pass out on eth0 inet proto tcp from $everyone to any port $stream queue streamers
pass out on eth0 inet proto tcp from $everyone to any port $web queue readers
```

### Translation
With translation one can mutate the IP addresses in the packets before they
hit the filter. In the case one needs to map incoming traffic from one address
or targeted to a specific machine address to another address and/or port, the
translator is the one to put to work. In the next example all incoming traffic
on port `80` for the `$public` address will be proxied to the loopback address
on port `4000`.

```bash
rdr on eth0 proto { tcp, udp } from any to $public port 80 -> 127.0.0.1 port 4000
```

### PF

## Read

 - `man pfctl`
 - `man pf.conf`
