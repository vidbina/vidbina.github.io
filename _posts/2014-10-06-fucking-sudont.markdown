---
layout: post
title:  Freaking Sudon&rsquo;t
#since:  2014-10-06 08:52
date:   2014-10-06 10:40
published: true
type: tools
category: tools
tags:
 - cli
 - terminal
 - unix
 - tools
description: When shit goes down it is often because noobs or lazy bozos decide to slap sudo in front of every seemingly failing command. For the love of the FSM, stop excessive sudoing!
redirect_from:
  - /web/fucking-sudont/
emojify: true
---

In the design of unix and unix-based OS-es a clear distinction is quite visibly
present with regards to privileges.

I think it has been stressed with sufficient urgency that the root user is not
who you want to be while going about your merry way computing the maximum
number of clowns that would fit into your Prius or other vehicle.

Superuser privilege is something that is to be respected and there is a good
reason for this.

## Sudoes and Sudon&rsquo;ts
In the short time that I have been involved with computers and specifically
unix-based OS-es I&rsquo;ve had too much encounters with seriously screwed up
systems because someone disrespectfully smacked a `sudo` in front of a command
that was not doing what the user expected.

<div class="element image">
  <img src="http://imgs.xkcd.com/comics/sandwich.png" alt="Sudo make me a sandwich">
</div>

The problem with this approach is that many do not have a freaking clue what
they are actually doing. The fact is that superuser is god on your machine.
Anything goes, meaning anything can be screwed if not careful and there is no
undo function in case things go awry.

When sudoeing remember this:

 - The superuser can touch anything and modify anything (possibly breaking your
 system)
 - You should always know what is happening if you choose to `sudo` something.
 Installing a script from someone with superuser privileges is not a good idea
 :thumbsdown:, unless you have read the code and are
 certain it is not downloading another script you haven't read to be executed
 as well. Otherwise you have no idea what is being done under the umbrella of
 superuser clearance.
 - Performing actions as superuser may create files that are only accessible
 by superusers, inadvertently requiring you to have superuser privilege
 everytime you will need to access these resources. It a nasty side effect of
 going the `sudo` route on things that weren&rsquo;t meant to be sudoed.

Linux users using RPM or Aptitude generally have to install packages with
superuser privileges because these applications are being installed into
directories which are only writeable to the superuser (e.g.: `/lib/bin`,
`/etc/bin`). The rule here is to only `sudo` commands that you trust. If the
packages of interest are from trusted repositories go right ahead, otherwise
proceed with caution.

OSX users trying to `brew install` something generally should not resort to
prefixing `sudo` to their `brew install` command. Brew symlinks installed
executables into `/usr/local`. On my own mech I happen to be a member of the
`admins` group and `admin`-members have write permission on `/usr/local`. No
reason to `sudo` here being the simple me is enough.

Installing gems, node packages or any other packages for whatever env you
are using with `sudo` :rage: is generally bad news. Generally
if you have rvm, virtualenv or nodeenv set up properly you should not need to
sudo something ever. The big problem here is that all the code is generally
pulled from repositories somewhere on the web. You probably have no idea what
is in there. It could be wiping your home directory or installing some other
nastiness you don't even want to think about.

Bottomline be more conservative in superuser usage. If you frequently end up
`sudo`-ing commands it is probably a signal that your system is seriously
screwed up and it might be due for a fresh install -- the right way
:wink:.
