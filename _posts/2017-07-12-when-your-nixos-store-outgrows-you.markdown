---
layout: post
title: When your NixOS store outgrows you...
description: |
  Limbo! Filled up the partition :floppy_disk: containing
  <code>/nix/store</code> to the brim.  y computer :computer: froze up and I'm
  at a conference. Need to grow some partitions to give NixOS :snowflake: some
  space. :free:
date:  2017-07-12 12:13:46 +0000
type: tools # for icon
category: tools # for url
tags:
 - nixos
 - nix
 - os
 - linux
 - operating system
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
emojify: true
---
I'm running around on [TOA2017](https://toa.berlin) and I just did something stupid.
It all started with me being in the process of installing all of the tooling
necessary to deal with the Estonian digital bureaucracy from my NixOS :snowflake:
machine...

<div class="element tweet">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Psyched! 😝😆 That moment you decide light may be a good idea and find out the lamps 🛋️ have no bulbs💡<a href="https://twitter.com/TOABerlin">@TOABerlin</a> <a href="https://twitter.com/99chairs">@99chairs</a> <a href="https://twitter.com/hashtag/TOA17?src=hash">#TOA17</a> <a href="https://t.co/sTXs5O81cJ">pic.twitter.com/sTXs5O81cJ</a></p>&mdash; David Asabina (@vidbina) <a href="https://twitter.com/vidbina/status/885517003947036672">July 13, 2017</a></blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

After noticing that I could build chrome with WideVine support, which I needed
anyways for Netflix :unamused: I managed to trigger the most rigorous build on
my nix setup to date. DAMN.

Apparently, WideVine support on Nix requires a lot of shit to be pulled and
compiled from scratch. So much so that a 40 gig partition with about 20
percent of free space will not suffice to pull you through the experience.

So what happens when NixOS runs on a box without any storage left on the
`/` partition? It chokes :angry:. Getting past the display manager has been
one of my failings over the past hours. Good thing that I always walk with
a bootable NixOS stick for exactly these occassions.

Fortunately enough, I had anticipated the potential need to do something rather
rigorous to my machine, which prompted me to keep the user directory safely on
a seperate partition allowing me to change my OS without risking my files
:wink:.

Let's run through the circus :snowflake:

The instructions on the NixOS page are pretty straightforward when it comes
to partitioning. I will not provide any real help here since gparted makes
creating, removing and modifying partitions a breeze.

```
nix-shell -p gparted
gparted
```

<div class="element note">
In case you are out of luck in enlarging the existing partition due to lack of
a consecutive partition, you could consider stitching two partitions together
in LVM and using them as a larger logical volume, but that is beyond the scope
of this little note-to-self.
</div>

It's my LVM and LUKS setup that required a bit more thought. I had formerly
created a volume group with two logical volumes -- a 40 gig btrfs volume and
a 10 gig swap volume. With both volumes mounted into the system I had to

 - reconfigure Nix to boot without the swap volume
 - reboot to system such that the swap volume is not utilised
 - remove the swap volume
 - resize the root volume to fill the entire drive
 - resize the btrfs partition to utilize the full size of the volume

## TL;DR

So Tech Open Air has been pretty cool so far, I've
 - played around with tools for building chatbots (wasn't really impressive, anyways I learned
 something there)
 - witnessed a classical mini concert mixed with a perfume experience that was quite meditative,
 - learned about another innovation in mobility that rises from inventive minds in Karlsruhe
 - got some inside scoop and lessons from a bunch of cool people including
   - [Gadi from
NewDealDesign](https://newdealdesign.com/studio) (one of the bright minds behind Fitbit),
   - [Ryan from Floodgate Fund](http://floodgate.com/ryan-walsh/) (one of the bright minds
   behind Beats by Dre),
   - a couple of professors working on some cool interactive work-out setups backed by the
   Max-Planck Institute and
   - a plethora of AI-heads working on a number of different problems.

Meanwhile I'm dealing with my little machine fuck-up :rage:

<div class="element video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/OazFiIhwAEs" frameborder="0" allowfullscreen></iframe>
</div>

<div class="element tweet">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Great talks from the makers of Fitbit and Beats by Dre, cool art experiences, chats about politics, AI and an army of cool folks. 🤘 <a href="https://twitter.com/hashtag/TOA17?src=hash">#TOA17</a> <a href="https://t.co/ALWkjZNQbh">pic.twitter.com/ALWkjZNQbh</a></p>&mdash; David Asabina (@vidbina) <a href="https://twitter.com/vidbina/status/885496635219955713">July 13, 2017</a></blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Basically /etc/nixos/hardware-configuration.nix contains a listing of the disk
configuration that is currently in effect. Since I had another swap partition taking up
the space that I needed to expand my logical volume to accomodate my growing needs, I
I needed to remove the line referencing the device that bears the uuid to the LVM mapping
for my swap drive in order to avoid mounting it at boot :wink:.

In my case `realpath /dev/disk/by-uuid/UUID_OF_SWAP_B` pointed to `/dev/dm-N`
which is the path for a mapped device so out it went.


```
swapDevices = [
  { device = "/dev/disk/by-uuid/UUID_OF SWAP_A"; }
  # { device = "/dev/disk/by-uuid/UUID_OF_SWAP_B"; }
];
```

After a reboot, I was able to remove the swap partition with

```
sudo lvremove /dev/vg/swap
```

and subsequently extend the logical volume using

```
sudo lvextend -l 100%FREE /dev/vg/root
```

That is all :wink: and all done within a few minutes.

After that I proceeded to `nixos-rebuild test`. The `google-chrome` package with
WideVine is still building. A full day of occassionally plugging in to build has
not been enough :hourglass_flowing_sand:.

It's about time to leave the premises. Something with a raft is next :rowboat: :metal:.

So I'll `sudo systemctl hibernate` and continue this busy work later... Well busy-work
for the machine... I basically just read papers, chat with cool people including my
Startupbus family and of course... chill :grin:

<div class="element note">
The day after the build
[failed](https://github.com/NixOS/nixpkgs/issues/26299). :shit:
</div>
Debugging :frown:

<div class="element tweet">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">🛳<a href="https://twitter.com/TOABerlin">@TOABerlin</a> in a 🌰shell : <a href="https://twitter.com/hashtag/deeplearning?src=hash">#deeplearning</a> for <a href="https://twitter.com/hashtag/bots?src=hash">#bots</a>, <a href="https://twitter.com/Google">@Google</a> <a href="https://twitter.com/hashtag/coffee?src=hash">#coffee</a> <a href="https://twitter.com/ClubMate_UK">@ClubMate_UK</a> <a href="https://twitter.com/hashtag/tech?src=hash">#tech</a> <a href="https://twitter.com/hashtag/android?src=hash">#android</a> 👓<a href="https://twitter.com/hashtag/AI?src=hash">#AI</a> <a href="https://twitter.com/hashtag/building?src=hash">#building</a> <a href="https://twitter.com/Crowdcube">@Crowdcube</a> <a href="https://twitter.com/hashtag/product?src=hash">#product</a> ON A BOAT <a href="https://t.co/a9j9dSRYzQ">pic.twitter.com/a9j9dSRYzQ</a></p>&mdash; mahoney turnbull 马甜甜 (@mahoneyjkt) <a href="https://twitter.com/mahoneyjkt/status/885435818445332482">July 13, 2017</a></blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

<div class="element note">
The [Nix manual](https://nixos.org/nixos/manual/index.html#sec-nix-gc) mentions
the use of the `nix-store --optimise` command which, also in my case cleaned up
20 gigs of 50 so yeah... do yourself a favor. :wink:
</div>

## Learnings

 - install your home directory to a seperate partition... you'll be glad you did someday
 - do encrypt your :shit: (just because...)
 - use LVM... It's convenient to be able to stitch LV's together if you ever run out of space :wink:
 - read up on [how to clean your Nix store](https://nixos.org/nixos/manual/index.html#sec-nix-gc)

## Links

- [Installing NixOS by Chris Martin](https://chris-martin.org/2015/installing-nixos)
- [Resizing a Btrfs File System](https://docs.oracle.com/cd/E37670_01/E37355/html/ol_use_case2_btrfs.html)
- [Cleaning the Nix store](https://nixos.org/nixos/manual/index.html#sec-nix-gc)
