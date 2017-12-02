---
layout: post
title: Breaking down the NixOS GUI setup
description: |
  Add a description to this article here. Keep it short and sweet.
date:  2017-12-02 05:05:20 +0000
type: tools
category:
 - tools
 - nixos
tags:
 - NixOS
 - tools
 - desktop-manager
 - xserver
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
---
I am using Xmonad on my NixOS setup and somehow, configuring ibus doesn't
result to the daemon being spawned on boot automatically. This sparked a little
investigation into how NixOS handles display-, window- and desktop managers
:wink: with the hope that a better understanding could provide me with some
insights on how to pragmatically tackle the issue I'm dealing with.

Nixos defines a `display-manager.service` (view by running
`systemctl cat display-manager.service`) which handles the entire dance of
firing up the login interface, in which the user is allowed to login and select
the environment of choice, up to keeping the desktop- or window manager alive.

The `ExecPreStart` stage of the service takes care of clearing a lock

```bash
#! /nix/store*-bash-*/bin/bash -e
rm -f /tmp/.X0-lock
```

whereas the `ExecStart` unsurprisingly fires up the display manager

```bash
#! /nix/store/*-bash-*/bin/bash -e
exec /nix/store/*-slim-*/bin/slim
```

to get this train rolling.

I have mentioned display, desktop and window managers in the last few sentences
without explaining what the different roles of these components are, so here
follows an attempt of my simple brain to list the functions of these components
along with some examples:

  - display managers: tools that present login interfaces and provide methodsa
  to select the wanted environment such as
    - lightdm
    - sddm
    - slim
  - window managers: tools that just handle windows such as
    - XMonad
    - i3
    - wmii
  - desktop managers: tools that handle entire full-blown desktop environments
  such as
    - gnome
    - KDE
    - XFCE

Within [NixOS's display-managers/default.nix](https://github.com/NixOS/nixpkgs/blob/1273f414a784af87363ac440af2ce948b6a656b1/nixos/modules/services/x11/display-managers/default.nix#L31-L168)
file, an `xsession` function is defined which is quite interesting to dissect.

## `xsession` dissection

:point_right: if called with the args `$1` and `$2` where `$1` starts with `/`, execute
 `$1` with `$2` as an argument
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L57)
```nix
if [ "''${1:0:1}" = "/" ];
then eval exec "$1" "$2";
fi
```

> Note that the double single quote `''` is merely there to escape the phrase
`${` which happens to bear special meaning in nix as pointed out in [the
thread to the commit that introduced this change](https://github.com/NixOS/nixpkgs/commit/1273f414a784af87363ac440af2ce948b6a656b1) and the [documentation][escape-nix][^escape-nix].

:point_right: optionally log to journal using `systemd-cat` if
 `displayManager.logToJournal` is set
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L62-L66)
```nix
${optionalString cfg.displayManager.logToJournal ''
  if [ -z "$_DID_SYSTEMD_CAT" ]; then
    _DID_SYSTEMD_CAT=1 exec ${config.systemd.package}/bin/systemd-cat -t xsession -- "$0" "$@"
  fi
''}
```

:point_right: source `/etc/profile` and change directory into `$HOME`
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L68-L69)
```nix
. /etc/profile
cd "$HOME"
```

:point_right: `sessionType` is an empty string if the first argument `$1` is `default`,
 otherwise `sessionType` is set to the value of `$1`
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L71-L73)
```nix
# The first argument of this script is the session type.
sessionType="$1"
if [ "$sessionType" = default ]; then sessionType=""; fi
```

:point_right: optionally log errors to `~/.xsession-errors` if
 `displayManager.logXsession` and `displayManager.logToJournal` are not set
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L75-L77)
```nix
${optionalString (!cfg.displayManager.job.logsXsession && !cfg.displayManager.logToJournal) ''
  exec > ~/.xsession-errors 2>&1
''}
```

:point_right: start DBus session
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L79-L83)
```nix
${optionalString cfg.startDbusSession ''
  if test -z "$DBUS_SESSION_BUS_ADDRESS"; then
    exec ${pkgs.dbus.dbus-launch} --exit-with-session "$0" "$sessionType"
  fi
''}
```
:point_right: Start pulseaudio, if enabled
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L85-L93)

```nix
# Start PulseAudio if enabled.
${optionalString (config.hardware.pulseaudio.enable) ''
  ${optionalString (!config.hardware.pulseaudio.systemWide)
    "${config.hardware.pulseaudio.package.out}/bin/pulseaudio --start"
  }

  # Publish access credentials in the root window.
  ${config.hardware.pulseaudio.package.out}/bin/pactl load-module module-x11-publish "display=$DISPLAY"
''}
```


:point_right: tell systemd about `$DISPLAY` (needed by ssh-agent)
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L95-L97)
```nix
# Tell systemd about our $DISPLAY and $XAUTHORITY.
# This is needed by the ssh-agent unit.
#
# Also tell systemd about the dbus session bus address.
# This is required by user units using the session bus.
${config.systemd.package}/bin/systemctl --user import-environment DISPLAY XAUTHORITY DBUS_SESSION_BUS_ADDRESS
```

:point_right: load Xdefaults
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L99-L105)
```nix
# Load X defaults.
${xorg.xrdb}/bin/xrdb -merge ${xresourcesXft}
if test -e ~/.Xresources; then
    ${xorg.xrdb}/bin/xrdb -merge ~/.Xresources
elif test -e ~/.Xdefaults; then
    ${xorg.xrdb}/bin/xrdb -merge ~/.Xdefaults
fi
```

:point_right: handle KDE voodoo
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L107-L114)
```nix
# Speed up application start by 50-150ms according to
# http://kdemonkey.blogspot.nl/2008/04/magic-trick.html
rm -rf "$HOME/.compose-cache"
mkdir "$HOME/.compose-cache"

# Work around KDE errors when a user first logs in and
# .local/share doesn't exist yet.
mkdir -p "$HOME/.local/share"
```

:point_right: release logToJournal lock
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L116)
```nix
unset _DID_SYSTEMD_CAT
```

:point_right: load `displayManager.sessionCommands`
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L118)
```nix
${cfg.displayManager.sessionCommands}
```

:point_right: load `~/.xprofile`
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L120-L123)
```nix
# Allow the user to execute commands at the beginning of the X session.
if test -f ~/.xprofile; then
    source ~/.xprofile
fi
```

:point_right: start graphical-session systemd target
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L125-L126)
```nix
# Start systemd user services for graphical sessions
${config.systemd.package}/bin/systemctl --user start graphical-session.target
```nix

:point_right: `exec ~/.xsession`
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L128-L135)
```nix
# Allow the user to setup a custom session type.
if test -x ~/.xsession; then
    exec ~/.xsession
else
    if test "$sessionType" = "custom"; then
        sessionType="" # fall-thru if there is no ~/.xsession
    fi
fi
```

:point_right: set `desktopManager` and `windowManager` where `windowManager` is set to the
 phrase container `sessionType` without the all characters from the beginning
 up to the plus sign while `desktopManager` is set to `sessionType` excluding
 all characters from the end of the phrase up to the plus sign :wink:
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L137-L143)
```nix
# The session type is "<desktop-manager>+<window-manager>", so
# extract those (see:
# http://wiki.bash-hackers.org/syntax/pe#substring_removal).
windowManager="''${sessionType##*+}"
: ''${windowManager:=${cfg.windowManager.default}}
desktopManager="''${sessionType%%+*}"
: ''${desktopManager:=${cfg.desktopManager.default}}
```

:point_right: start the window- and desktop manager
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L145-L163)
```nix
# Start the window manager.
case "$windowManager" in
  ${concatMapStrings (s: ''
    (${s.name})
      ${s.start}
      ;;
  '') wm}
  (*) echo "$0: Window manager '$windowManager' not found.";;
esac

# Start the desktop manager.
case "$desktopManager" in
  ${concatMapStrings (s: ''
    (${s.name})
      ${s.start}
      ;;
  '') dm}
  (*) echo "$0: Desktop manager '$desktopManager' not found.";;
esac
```

:point_right: update DBus environment
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L165-L167)
```nix
${optionalString cfg.updateDbusEnvironment ''
  ${lib.getBin pkgs.dbus}/bin/dbus-update-activation-environment --systemd --all
''}
```

:point_right: wait for process to terminate, then stop stop graphical-session systemd
 target and exit
 [:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L169-L173)
```nix
test -n "$waitPID" && wait "$waitPID"

${config.systemd.package}/bin/systemctl --user stop graphical-session.target

exit 0
```

[escape-nix]:https://nixos.org/nix/manual/#idm140737318136176 

[^escape-nix]: Since `${` and `''` have special meaning in indented strings, you need a way to quote them. `${` can be escaped by prefixing it with `''` (that is, two single quotes), i.e., `''${`. `''` can be escaped by prefixing it with `'`, i.e., `'''`. Finally, linefeed, carriage-return and tab characters can be written as `''\n`, `''\r`, `''\t`.
