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
---
I'm on a bus from Amsterdam to Berlin again. I just finished watching the
_The Good Shepherd_ and wasn't in the mood to watch anything else, read some
papers or sleep although it's 2am. It was initially the plan, but sometimes
flexibility isn't too bad so I'll start writing about OSX's packet filter
instead.

The packet filter in OSX can be used to control incoming and outgoing traffic
into a machine. Nowadays, with all the hip coffee joints and coworking
spaces one needs to be especially mindful of its networking etiquette.

The packet filter works by enforcing _rules_ to be applied to _tables_ which
are basically sets of IP addresses or networks.

For illustrative purpose we could describe a _table_ named everything that
contains a CIDR of `0/0` which basically means `0.0.0.0` submasked `0.0.0.0`,
which covers the addresses `0.0.0.0` till `255.255.255.255`... yeah, everything
one can find in the IP4 constellation.

{% highlight bash %}
table <everything> const { 0/0 }
{% endhighlight %}

Here is how we can get `pfctl` to _show all_ it knows:

{% highlight bash %}
sudo pfctrl -s all
{% endhighlight %}

Add a new rule to the flixbus table which allows:

{% highlight bash %}
sudo pfctl -t flixbus -T add 1.2.3.4 5.6.7.8
{% endhighlight %}

Be extremely verbose in showing the existing tables in the main anchor.

{% highlight bash %}
sudo pfctl -vvsTables
{% endhighlight %}


{% highlight bash %}
usage: pfctl [-AdeghmNnOqRrvz] [-a anchor] [-D macro=value] [-F modifier]
        [-f file] [-i interface] [-K host | network] [-k host | network]
        [-o level] [-p device] [-s modifier] [-w interval]
        [-t table -T command [address ...]] [-x level]
{% endhighlight %}

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

{% highlight bash %}
set optimization satellite
{% endhighlight %}


### Traffic Normalization
Buffer fragments until the complete packet is available and then pass it on to
the filter which means that the filter works less frequently but consumes
larger batches of content whenever it does.

{% highlight bash %}
scrub in on if all fragment reassemble
{% endhighlight %}

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

{% highlight bash %}
queue streamers bandwidth 90% priority 1 cbq(borrow)
queue readers bandwidth 10% priority 4 cbq(borrow)
block return out on eth0 inet all
pass out on eth0 inet proto tcp from $everyone to any port $stream queue streamers
pass out on eth0 inet proto tcp from $everyone to any port $web queue readers
{% endhighlight %}

## Read

 - `man pfctl`
 - `man pf.conf`
