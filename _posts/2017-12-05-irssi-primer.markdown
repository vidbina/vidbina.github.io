---
layout: post
title: Irssi Primer
since: 2015-02-28 13:43
date: 2017-12-05 16:22
type: tools
category:
 - tools
 - irc
tags:
 - irssi
 - irc
 - chat
description: |
  Reminding myself how to use Irssi  :speech_balloon: again after a while of
  dormancy. Hopefully this primer :memo: will help me get back on track fast
  enough, next time I need to brush up on my irssi usage skills :wink:.
emojify: true
---
Somehow it seems too easy for me to forget how to use Irssi. With this primer
I hope to provide my future-self a decent reference to get up and going within
an acceptable timeframe.

## Basic Shortcuts

<div class="element note">
`Meta` is generally configured to the `Alt` key :wink:.
</div>

|Shortcut|Description|
|--------|-----------|
|`Meta`+`n`|scroll up|
|`Meta`+`p`|scroll down|
|`Meta`+left<br/>`Ctrl`+`p`|previous window|
|`Meta`+right<br/>`Ctrl`+`n`|previous window|
|`Meta`+`N`|goto window `N`|

## Window Selection
Besides using the shortcuts, one may use commands such as

 - `/window N`, where `N` represents the number of the window,
 - `/window next` and
 - `/window previous`

to navigate one's way through the windows.

The number of a window may be changed through the `/window number #` command,
where one enters the actual number instead of `#`. In case the provided number
is already linked to another window, Irssi will simply perform a swap of
window numbers to ensure that the active window has the number specified by the
user.

## Splits and Stickiness

[An Illustrated Guide to Split Windows in Irssi][irssi-win-split] gives a good
explanation on window handling and the mechanics of splitting windows and
window stickiness.

<div class="element screencast">
<script type="text/javascript" src="https://asciinema.org/a/GeTFKrw008VoF8IZxqJQXItsw.js" id="asciicast-GeTFKrw008VoF8IZxqJQXItsw" async></script>
</div>

Basically sticky windows are limited in mobility. This is a convenient feature
since it prevents windows from jumping between containers when stepping through
them. Simply put, the container represents the entity that hosts a window.

Sticking a window to a container results to the container gaining focus every
time the window is focussed.

Running `window show #` will create a new container on top and stick window `#`
to that container unless the default setting for `autostick_split_windows` has
been altered no not exhibit this behavior.

The `window show #` trick will not work in case window `#` is already stuck to
a container. In the case you still want to create a split and attach an
already-stuck window to the new container, one may run `window new split` which
should create a new container with a blank window stuck to it, and then run
`/window stick #` which will unstick the window from its former container and
subsequently stick it to the focussed container :wink:.

<div class="element note">
To avoid stickiness confusion, I would recommend creating splits with `window
split new` and manually sticking windows to the new container using `window
stick #` until one is comfortable with the concept of stickiness in Irssi.
</div>

[^hash]: Replace `#` for a valid window number :wink:

## Window Size

The following commands are pretty self explanatory but immensely useful in
order to effectively manage the utilisation of screen real-estate.

 - `/window balance` equalizes the line count for all windows
 - `/window grow N` increases the active window's line count by `N` lines
 - `/window shrink N` decreases the active window's line count by `N` lines
 - `/window size N` sets the line count for the active window to `N` lines

## Modes

Whilst using IRC, it may be convenient to be aware of channel and user modes.

In the case of FreeNode, the [user modes][freenode-usermodes] are specified to
indicate that the user is

 - `g`, ignoring private messages
 - `i`, invisible
 - `Z`, connected securely

whereas [channel modes][freenode-chanmodes] are specified to indicate that a
channel is

 - `c`, stripping color and formatting
 - `C`, blocking CTCP commands
 - `f`, a forward channel
 - `i`, invite only
 - `k`, password protected
 - `l`, limited
 - `m`, moderated
 - `n`, not allowing outsiders (to the channel) to send to the channel
 - `p`, private, outsiders can't KNOCK to get in.
 - `r`, blocking unidentified users
 - `s`, secret
 - `S`, SSL-only
 - `t`, ops topic

among many other options of course, that would distract from the point I'm trying
to make if I listed them all out in this text :wink:.

[freenode-usermodes]: https://freenode.net/kb/answer/usermodes
[freenode-chanmodes]: https://freenode.net/kb/answer/channelmodes
[irssi-win-split]: http://quadpoint.org/articles/irssisplit/

{% if false %}
An excerpt from the [doc][basic-ui-usage] may be helpful for reference's sake
:wink:.

```
Meta-1, Meta-2, .. Meta-0 - Jump directly between windows 1-10
Meta-q .. Meta-o          - Jump directly between windows 11-19
/WINDOW <number>          - Jump to any window with specified number
Ctrl-P, Ctrl-N            - Jump to previous / next window
```

{% endif %}

[basic-ui-usage]: https://irssi.org/documentation/startup/#basic-user-interface-usage
[split-win]: https://irssi.org/documentation/startup/#split-windows-and-window-items

{% if false %}
# Freenode

Testing

```bash
wget http://crt.gandi.net/GandiStandardSSLCA.crt
```

```bash
openssl x509 -inform der -outform pem < /usr/share/ca-certificates/gandi.net/GandiStandardSSLCA.crt > GandiStandardSSLCA.pem
```

bash
/server add \
  -auto \
  -ssl \
  -ssl_cacert /etc/ssl/certs/GandiStandardSSLCA.pem \
  -network freenode irc.freenode.net 6697 \
  -autosendcmd "/msg NickServ IDENTIFY $NICK $PASSWORD; wait 2000;"
```


    /join $CHANNELNAME

# Basics

## Selecting Window

    /window 1



    /window new split

## Change Window
Ctl-p Ctl-n Atl-ARROW

    /window next
    /window prev
{% endif %}


[irssi-guide]: http://quadpoint.org/articles/irssi/
[irssi-arch]: https://wiki.archlinux.org/index.php/Irssi
[irssi-commands]: http://www.geekshed.net/commands/user/
[irssi-screen]: http://carina.org.uk/screenirssi.shtml#10
[irssi-window]: https://quadpoint.org/articles/irssi/#hilight-window
[irssi-ssl]: https://pthree.org/2010/01/31/freenode-ssl-and-sasl-authentication-with-irssi/
[irc-hidejoin]: http://wiki.xkcd.com/irc/Hide_join_part_messages
