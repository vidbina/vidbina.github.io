---
layout: post
title: Enabling Dell XPS's Mediabuttons on NixOS+XMonad
description: |
  Learning from others how to get the mediabuttons on the Dell 9560 (XPS)
  to play ball with NixOS+XMonad
date:  2017-08-12 21:12:35 +0000
type: tools
category: config
tags:
 - tools
 - xmonad
 - nixos
 - mediabuttons
 - audio
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
Bare with me, this posts covers a solution that may partially work for some
but will probably cause some trouble down the road. I'll get to it in a minute.
I'm a XMonad user, so I ended up relying on a solution that

## Trying actkbd

<div class="element note">
**TL;DR** Skip the actkbd part and head directly to the [XMonad part](#xmonad) :down:.
</div>

Inside your configuration.nix, or whichever file you import from your
configuration.nix with the purpose of containing audio-related settings, add
the following snippet:

```nixos
services.actkbd = with pkgs; {
  enable = true;
  bindings = [
    # "Mute" media key
    {
      keys = [ 113 ];
      events = [ "key" ];
      command = "${alsaUtils}/bin/amixer -q set Master toggle";
    }

    # "Lower Volume" media key
    {
      keys = [ 114 ];
      events = [ "key" "rep" ];
      command = "${alsaUtils}/bin/amixer -q set Master 1- unmute";
    }

    # "Raise Volume" media key
    {
      keys = [ 115 ];
      events = [ "key" "rep" ];
      command = "${alsaUtils}/bin/amixer -q set Master 1+ unmute";
    }
  ];
};
```

The keycodes for the snippet have been acquired by switching to a virtual
terminal and running
`showkey`. The showkey application displays the keycodes for the pressed keys
and exits after 10 seconds without input. In my case the keycodes for mute,
volume down and volume up represented the keycodes 113, 114 and 115
respectively.

<div class="element note">
Be careful whenever you end up with keycodes 59, 60 and 61 for the mute, volume
down and volume up keys as these are actually the keycodes for the function
keys `F1`, `F2` and `F3`. If you end up with these keycodes, you may have to
press `Fn` along with the intended function key to evoke the alternate behavior
:wink:.
</div>

Since my function keys have been configured in my [BIOS][dell-bios-fn] to
behave as function keys instead of multimedia keys, I can switch between
virtual terminals by simultaneously pressing `Ctrl`, `Alt` and any of my
function keys ranging from `F1` through `F12`.

<div class="element note">
Note that NixOS reserves the seventh virtual terminal for the window manager
and the [eight terminal for its manual][nixos-altf8].
</div>


Triggering the multimedia behavior for mute, which is set
up on the `F1` key, will require me to simultaneously press `Fn` and `F1`. Note
that `Fn` indicates to the system that I intent to trigger the alternate
behavior for the given key.

<div class="element note">
When the BIOS is configured to treat function keys as multimedia keys, one will
have to prefix the function key with the `Fn` key within the keystroke sequence
necessary to switch to the virtual terminals. Switching to virtual terminal 1
would, in that case, require the simultaneous pressing of `Ctrl`, `Alt`, `Fn`
and `F1`. The mute button, however; would be accessible through a simple press
of just the `F1` button. It's obviously up to you to determine which
configuration makes sense for you as long as you are aware of the differences
in use that this may entail.
</div>

The [problem with this approach][github-issue] is that the actkbd daemon
executes commands as `root`. Since the PulseAudio server imposes restrictions
on who may connect to it, we need to connect as the same user as the one
running the server.

```
XDG_RUNTIME_DIR (/run/user/1988) is not owned by us (uid 0), but by uid 1988! (This could e g happen if you try to connect to a non-root PulseAudio as a root user, over the native protocol. Don't do that.)

ALSA lib pulse.c:243:(pulse_connect) PulseAudio: Unable to connect: Connection refused

amixer: Mixer attach default error: Connection refused
```
## XMonad

Retrieve the keysym for the required buttons in `xev` (`0x1008ff12`,
`0x1008ff11` and `0x1008ff13` in my case) and add these to the xmonad.hs.

I've chosen to define my audio keys as a seperate list

```haskell
audioKeys = [
    ((0, 0x1008ff12), spawn "amixer -q set Master toggle")
  , ((0, 0x1008ff11), spawn "amixer -q set Master 10%-")
  , ((0, 0x1008ff13), spawn "amixer -q set Master 10%+")
  ]
```

and concatenate them to the other bindings in order to produce `myKeys` :wink:

```haskell
myKeys = [
-- some other keybindings
] ++ audioKeys
```

but you should do whatever works best for your setup. Check out the
[XMonad config tips][xmonad-config-tips] for some interesting ideas regarding
the structuring of your configuration.

[dell-bios-fn]: https://www.howtogeek.com/235351/how-to-choose-whether-your-function-keys-are-f1-f12-keys-or-special-keys/
[nixos-altf8]: https://nixos.org/nixos/manual/#sec-installation
[github-issue]: https://github.com/NixOS/nixpkgs/issues/24297
[xmonad-config-tips]: https://wiki.haskell.org/Xmonad/General_xmonad.hs_config_tips
