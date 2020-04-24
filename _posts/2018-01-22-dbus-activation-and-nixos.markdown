---
layout: post
title: Notifications, D-Bus Activation and NixOS
description: |
  A walkthrough of my noob-ish attempt to understand how notifications
  :speech_balloon: work on my system running NixOS :snowflake:, before
  improving the setup altogether with some new eyecandy. :eyes::candy:
since:  2018-01-19 14:03:52 +0000
date:  2018-01-22 01:49:37 +0200
type: tools # for icon
category: tools # for url
tags:
 - dbus
 - d-bus
 - libnotify
 - notify-osd
 - org.freedesktop.DBus
 - org.freedesktop.Notifications
og:
  type: article # http://ogp.me/#types
head: mugshot
emojify: true
---
Yesterday, a bit of config hacking with Lassulus at c-base, resulted to a bunch
of new ideas that I would like to implement. In short, I would like to mimick
one specific feature that I remember from my Alfred usage days on OSX on
my Linux setup. Think about typing mathmatical expressions and getting the
answers presented through popups or notifications, for starters. Perhaps even
copying it to the clipboard right away, or at least allowing the user to click
the notification or a button on a notification to perform the copy operation.

This post documents my journey and learnings in my attempts ~~to solve this
issue~~ figure out how D-Bus plays ball in NixOS.

At this stage I had already installed notify-osd on my NixOS :snowflake: mech
before. Puzzled by notify-osd automatically starting after me logging in,
without any reference to it in any of the services or dotfiles I wrote led me
down a little investigation into the suspected culprits. :confused:.

A grep on the Nixpkgs codebase indicates that there is merely a package defined
for notify-osd, that provides a "wrapped" binary and nothing more -- no
services or additions to startup scripts or dotfiles.

Furthermore, I found no services mentioning notify-osd and not a single
reference in any of my existing dotfiles.

WTF is starting notify-osd? :confused:

The output of `pstree` after a fresh reboot displays `notify-osd` just one
level under the init system (`systemd`), which would leave one to assume
that either systemd sparked the process (and perhaps manages it too) or
something else triggered a start of notify-osd. Since it isn't forked under
another application that could provide clues as to what started it, I still
have to look elsewhere for answers.

```
vid@localhost> pstree -g 2                                                                                                                                                      ~
─┬◆ 00001 root systemd
 ├──◆ 01615 rtkit /.../libexec/rtkit-daemon
 ├──◆ 01575 vid /run/current-system/sw/bin/dbus-daemon --fork --print-pid 5 --print-address 7 --session
 ├─── 01560 vid /.../bin/dbus-launch --exit-with-session /.../xsession none+xmonad
 ├─┬◆ 01443 vid /.../lib/systemd/systemd --user
 │ ├─┬◆ 01631 vid /.../bin/pulseaudio --daemonize=no
 │ │ └─── 01635 vid /.../libexec/pulse/gconf-helper
 │ ├──◆ 01507 vid /.../bin/gpg-agent --supervised
 │ ├─── 01448 vid (sd-pam)
 │ └─┬◆ 01649 vid /.../bin/bash -e /.../bin/ibus-daemon-start
 │   └─┬◆ 01650 vid /.../bin/.ibus-daemon-wrapped_ --cache=refresh
 │     ├─── 01676 vid /.../libexec/ibus-engine-simple
 │     ├─── 01661 vid /.../libexec/ibus-ui-gtk3
 │     └─── 01659 vid /.../libexec/ibus-dconf
 ├──◆ 01394 root /..._supplicant-2.6/sbin//wpa_supplicant -u
 ├──◆ 01385 polkituser /.../lib/polkit-1/polkitd --no-debug
 ├──◆ 01275 dnsmasq /.../bin/dnsmasq -k --enable-dbus --user=dnsmasq -C /...
 ├──◆ 01263 root agetty --login-program /.../bin/login --noclear --keep-baud tty1 115200,38400,9600 linux
 ├──◆ 01259 privoxy /.../bin/privoxy --no-daemon --user privoxy /...
 ├─┬◆ 01163 root /.../bin/slim
 │ ├─┬─ 01490 vid /store/vidbina.home/.xmonad/xmonad-x86_64-linux
 │ │ ├─┬◆ 01683 vid /run/current-system/sw/bin/termite
 │ │ │ └─┬◆ 01704 vid /run/current-system/sw/bin/zsh
 │ │ │   └──◆ 04224 vid pstree -g 2
 │ │ ├──◆ 01667 vid xmobar -x0
 │ │ ├─── 01657 vid /.../bin/python /.../bin/..blueman-applet-wrapped-w
 │ │ ├─── 01656 vid /run/current-system/sw/bin/nm-applet --sm-disable
 │ │ └─── 01655 vid trayer --blahblah
 │ └──◆ 01244 root /.../bin/X -config /... -xkbdir /...
 ├──◆ 01128 root /.../lib/systemd/systemd-logind
 ├──◆ 01030 messagebus /.../bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation
 ├──◆ 01024 dictd dictd 1.12.1: 0/0
 ├─┬◆ 01017 root /.../sbin/NetworkManager --no-daemon
 │ └──◆ 01747 root /.../bin/dhclient -d -q -sf /.../libexec/nm-dhc
 ├──◆ 01015 root /.../bin/illum-d
 ├──◆ 01012 root /.../libexec/bluetooth/bluetoothd
 ├──◆ 01011 root /.../sbin/rngd -f -v
 ├──◆ 01008 root acpid --confdir /...
 ├──◆ 00995 root /...+git20161120/bin/w3m /.../share/doc/nixos/index.html
 ├──◆ 00955 systemd-timesync /.../lib/systemd/systemd-timesyncd
 ├──◆ 00692 root /.../lib/systemd/systemd-udevd
 ├──◆ 00686 root /.../lib/systemd/systemd-journald
 ├─┬─ 02915 vid /run/current-system/sw/bin/zsh
 │ └─── 02924 vid /.../bin/.firefox-wrapped
 ├──◆ 01837 nscd nscd
 ├─── 01829 vid /.../bin/notify-osd
 └─── 01699 vid /.../libexec/bluetooth/obexd
```

At this stage I recalled noticing a notify-osd popup every time I connected to
a network leading me to assume that NetworkManager may have something to do with
starting notify-osd. Since PID's tend increase with time as new processes are
started, the pstree listing suggests that the network manager (PID: 1017) along
with my bluetooth daemons (PID: 1699) and some other junk were started before
notify-osd.

In order to explore the hunch that NetworkManager may be involved, I kill
notify-osd and reconnect to a network and voilà... notify-osd is ressurected.

Recalling reading something about D-Bus in conjunction NetworkManager far in
the past, I decide to finally dive into a long overdue encounter with D-Bus to
get to the bottom of this.

To get started, the tree indicates that two daemons are running for D-Bus, of
which the second daemon seems to have been triggered by some launcher as
evident in the following excerpt from my pstree output:

 1. dbus-daemon --system (PID: 1030)
 1. dbus-launch --exit-with-session /.../xsession blah (PID: 1560)
 1. dbus-daemon --session (PID: 1575)

Time to take a closer look...

## D-Bus

It's Saturday and the [D-Bus][dbus] homepage, under the section __What is D-Bus__,
reads:

> D-Bus is a message bus system, a simple way for applications to talk to one
> another. In addition to interprocess communication, D-Bus helps coordinate
> process lifecycle; it makes it simple and reliable to code a "single
> instance" application or daemon, and to **launch applications and daemons on
> demand** when their services are needed.

The D-Bus (Desktop bus) ecosystem introduces the concept of busses,
connections, objects, interfaces and members.

<div class="element svg light">
  <img src="/svg/diagrams/dbus-ecosystem-overview.svg" alt="D-Bus facilitates connections that host objects that expose methods. A user of D-Bus connects to the bus, and a specific connection in order to interact with an object through its methods.">
</div>

A bus is the actual medium that serves as a carrier of all messages.
Generally, a machine will have at least a `system` and `session` bus which, for
example, would be accessible through a unix-domain socket expressed as a
unix-domain path or a TCP connection expressed by hostname and port. :bus:

A connection is addressed by a _bus name_. The naming is slightly confusing but
bear with me for a moment as I attempt to clarify. A _bus name_ is the
_connection's bus name_ (i.e.: name of the connection on the bus) and not the
connection _bus's name_. :name_badge:

Within a connection one may expect to find objects that contain members.
Interfaces, as in OOP, specify members and can, as a whole, be implemented by an
object. :package::wink:

To illustrate, the [D-Bus Specification][dbus-spec], documents an
`org.freedesktop.DBus.ListNames` [member][dbus-spec-listnames] for the
`org.freedesktop.DBus` object, which lists the names currently registered on
the bus. We could [run][dbus-list]

```bash
dbus-send \
  --session \
  --dest=org.freedesktop.DBus \
  --type=method_call \
  --print-reply \
  /org/freedesktop/DBus \
  org.freedesktop.DBus.ListNames
```

to get a listing of names on the session bus. The command is
pretty self-explanatory but humor me for a moment. The `--session` flag
indicates that we intent to communicate with the session bus, whereas the
`--system` would indicate that we intent to communicate with the system bus.
The `--dest` argument specifies the __bus name__, therefore specifying which
connection on the bus we are targeting. With `--type` we specify we are issuing
a `method_call` -- another valid type is that of a `signal`. In our case we
need a reply printed, hence the `--print-reply`. The object we are interacting
with and the member of that object or the message name are the next two
arguments respectively.

<div class="element note">
:bulb: Installing `dbus-map` and executing the command `dbus-map --session
--dump-methods` gives an overview of all methods for the different connections
on the session bus.
</div>

A quick read of the [Introduction to D-Bus][dbus-intro] article, mentions
[activations][dbus-activation] as a mechanism for triggering an executable.
Basically activations allow for a service to subscribe to a given type of
message in order to trigger an executable (if it isn't already running) upon
the delivery of a message.

In order to explore whether activations were indeed the cause of the notify-osd
resurrection, I decided to try my hand at invoking a method call to the member
named `org.freedesktop.DBus.StartServiceByName`.

Killing notify-osd and sending the [StartServiceByName][dbus-startservicebyname]
message with the name of the service, being "org.freedesktop.Notifications", and
an empty 32-bit integer as arguments, by running:

```bash
kill `pidof notify-osd`
dbus-send \
  --session \
  --dest=org.freedesktop.DBus \
  --type=method_call \
  --print-reply \
  /org/freedesktop/DBus \
  org.freedesktop.DBus.StartServiceByName string:org.freedesktop.Notifications uint32:0
```

seems to do the trick and produces a reply indicating that the service was
succesfully started. :trophy:

```
method return time=1516484477.248379 sender=org.freedesktop.DBus -> destination=:1.163 serial=3 reply_serial=2 uint32 1
```

The remaining question is now, where the .service is defined. As far as I can
tell from the documentation this should be recorded in a file somewhere on my
filesystem.

> :book: On Unix systems, the system bus should default to searching for
> .service files in `/usr/local/share/dbus-1/system-services`,
> `/usr/share/dbus-1/system-services` and `/lib/dbus-1/system-services`, with
> that order of precedence. It may also search other implementation-specific
> locations, but should not vary these locations based on environment
> variables.

> :book: On Unix systems, the session bus should search for .service files in
> `$XDG_DATA_DIRS/dbus-1/services` as defined by the XDG Base Directory
> Specification. Implementations may also search additional locations, with a
> higher or lower priority than the XDG directories.

Since I haven't yet found it, I'm afraid that perhaps D-Bus allows an
application to register for service activation on first boot, but haven't
found anything in the documentation to support this theory. :confused:

After a while of sleuthing on the web and poking around my file system, I
remember[^where] that NixOS :snowflake: allows a package to provide
complementary files by placing them in the  `$out/doc`, `$out/lib` and
`$out/share` directories, for example.

The notify-osd package does exactly that: producing a service file in
`share/dbus-1/services`. Problem solved! Now I know that uninstalling
notify-osd will also remove the service for activation.

Just not sure if NixOS will restart the D-Bus daemon once notify-osd is
uninstalled or perhaps D-Bus keeps an eye on the dbus-1/services directory
to appropriately respond to file changes.

I'll check it out later... I had a b-day bash to attend at nine and it's
quarter to midnight. :stuck_out_tongue_closed_eyes::confetti_ball:

[^where]: If you manage to figure out where this is documented, please let me know. As with many things NixOS :snowflake: related, the documentation is continually improving but as of yet still hard to search sometimes.

## Conclusion

It's Sunday and this post is already too long, so I'll work on the features I
wanted on another occassion.

I removed the `notify-osd` package and installed `dunst` instead, but D-Bus
didn't take notice of the change. For the entire duration of my session,
notify-osd would pop up to any relevant message sent to the
`org.freedekstop.Notifications` connection.

Since the D-Bus session bus lasts for the duration of the user session, I
basically had to log out and log back in to get dunst to pick up my
notifications.

Actually, I even tried killing the D-Bus session daemon in order to observe if
that would trigger a restart. It didn't :laughing: but it did take down all of
my windows rather spectacularly. :boom: I had a good laugh.

Someday I will have to figure out what the point of `dbus-launch` is.

Someday... :rainbow:

## Links

 - [D-Bus Activation Tutorial][dbus-tut-activation] by Raphaël Slinckx
 - [D-Bus Specification][dbus-spec]
 - [D-Bus Tutorial][dbus-tut] by Havoc Pennington
 - [Introduction to D-Bus][dbus-intro] by Jeroen Vermeulen
 - [Wikipedia: D-Bus][wiki-dbus]

[dbus]: https://www.freedesktop.org/wiki/Software/dbus/
[dbus-intro]: https://www.freedesktop.org/wiki/IntroductionToDBus/
[dbus-activation]: https://dbus.freedesktop.org/doc/dbus-specification.html#message-bus-starting-services
[dbus-tut-activation]: http://raphael.slinckx.net/blog/documents/dbus-tutorial
[dbus-tut]: https://dbus.freedesktop.org/doc/dbus-tutorial.html
[wiki-dbus]: https://en.wikipedia.org/wiki/D-Bus
[dbus-spec]: https://dbus.freedesktop.org/doc/dbus-specification.html
[dbus-spec-listnames]: https://dbus.freedesktop.org/doc/dbus-specification.html#bus-messages-list-names
[dbus-cli]: http://www.kaizou.org/2014/06/dbus-command-line/
[dbus-list]: https://unix.stackexchange.com/questions/46301/a-list-of-available-dbus-services
[dbus-startservicebyname]: https://dbus.freedesktop.org/doc/dbus-specification.html#bus-messages-start-service-by-name
