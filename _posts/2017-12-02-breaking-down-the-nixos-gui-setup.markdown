---
layout: post
title: Breaking down the NixOS GUI setup
description: |
  In an attemp to get the ibus-daemon to play ball I needed to understand
  how NixOS :snowflake: handles the entire GUI :eyes: dance so here goes a brief
  commentary on the NixOS :snowflake: xsession setup.
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
emojify: true
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

```
# /nix/store/*-unit-display-manager.service/display-manager.service
[Unit]
After=systemd-udev-settle.service local-fs.target acpid.service systemd-logind.service
Description=X11 Server
Wants=systemd-udev-settle.service

[Service]
Environment="LD_LIBRARY_PATH=/nix/store/*-libX11-1.6.5/lib:/nix/store/*-libXext-1.3.3/lib:/run/opengl-driver/lib"
Environment="LOCALE_ARCHIVE=/nix/store/*-glibc-locales-2.25-49/lib/locale/locale-archive"
Environment="PATH=/nix/store/*-coreutils-8.28/bin:/nix/store/*-findutils-4.6.0/bin:/nix/store/*-gnugrep-3.1/bin:/nix/store/*-gnused-4.4/bin:/nix/store/*-systemd-234/bin:/nix/store/*-coreutils-8.28/sbin:/nix/store/*-findutils-4.6.0/sbin:/nix/store/*-gnugrep-3.1/sbin:/nix/store/*-gnused-4.4/sbin:/nix/store/*-systemd-234/sbin"
Environment="SLIM_CFGFILE=/nix/store/*-slim.cfg"
Environment="SLIM_THEMESDIR=/nix/store/*-slim-theme"
Environment="TZDIR=/nix/store/*-tzdata-2016j/share/zoneinfo"
Environment="XORG_DRI_DRIVER_PATH=/run/opengl-driver/lib/dri"

X-RestartIfChanged=false


ExecStart=/nix/store/*-unit-script/bin/display-manager-start
ExecStartPre=/nix/store/*-unit-script/bin/display-manager-pre-start
Restart=always
RestartSec=200ms
StartLimitBurst=3
StartLimitInterval=30s
SyslogIdentifier=display-manager
```

The `ExecStartPre` stage of the service takes care of clearing a lock if one
peeks into the scripts that is fired

```bash
#! /nix/store*-bash-*/bin/bash -e
rm -f /tmp/.X0-lock
```

whereas the script called in `ExecStart` unsurprisingly fires up the display
manager

```bash
#! /nix/store/*-bash-*/bin/bash -e
exec /nix/store/*-slim-*/bin/slim
```

to get this train rolling.

I have mentioned display, desktop and window managers in the last few sentences
without explaining what the different roles of these components are, so here
follows an attempt of my simple brain to list the functions of these components
along with some examples:

  - display managers: tools that present login interfaces and provide methods
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

Within [NixOS's display-managers/default.nix](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L31-L174)
file, an `xsession` function is defined which is quite interesting to dissect.

## Dissecting `xsession`

After successfully getting past the display manager by providing the correct
login credentials and selecting a valid window or desktop manager, X server
is fired up. The [`xsession`](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L31-L174) function provides some insights into the steps taken in setting up
this X server session.

<div class="element">
For simplicity's sake, the creative license is taken to display bash snippets
instead of the nix snippets wherever "sensible"[^sensible]. The `xsession`
function discussed, basically produces a bash script by means of the
`writeScript` function. In several cases, wherever the nix code is crucial to
the understanding of the snippet, the entire nix snippet is presented but in
any case the octocat :octocat: emoji's are links to the original nix code for
reference's sake :wink:.
</div>

[^sensible]: Just a personal call. Since the xsession script happens to be a bash script it felt reasonable to focus on the bash code to understand the purpose and behavior rather than tunnel-visioning on the nix part, however enticing :stuck_out_tongue_closed_eyes:.

{% if false %}
:point_right: hashbang
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L33)
{% endif %}

:point_right: When called with the args `$1` and `$2` where `$1` constitutes an
absolute path (i.e.: starts with the character `/`), execute `$1` with `$2` as
an argument
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L35-L57).

```bash
# Expected parameters:
#   $1 = <desktop-manager>+<window-manager>
# Actual parameters (FIXME):
# SDDM is calling this script like the following:
#   $1 = /nix/store/xxx-xsession (= $0)
#   $2 = <desktop-manager>+<window-manager>
# SLiM is using the following parameter:
#   $1 = /nix/store/xxx-xsession <desktop-manager>+<window-manager>
# LightDM keeps the double quotes:
#   $1 = /nix/store/xxx-xsession "<desktop-manager>+<window-manager>"
# The fake/auto display manager doesn't use any parameters and GDM is
# broken.
# If you want to "debug" this script don't print the parameters to stdout
# or stderr because this script will be executed multiple times and the
# output won't be visible in the log when the script is executed for the
# first time (e.g. append them to a file instead)!
# All of the above cases are handled by the following hack (FIXME).
# Since this line is *very important* for *all display managers* it is
# very important to test changes to the following line with all display
# managers:
if [ "${1:0:1}" = "/" ]; then eval exec "$1" "$2" ; fi
```

<div class="element note">
:snowflake: Note when looking at the Nix code
([:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L35-L57)),
that `${` is a special sequence in Nix and has to be escaped by prefixing it
with `''` to become `''${` as pointed out in [the thread to the commit that
introduced this
change](https://github.com/NixOS/nixpkgs/commit/1273f414a784af87363ac440af2ce948b6a656b1)
and the [documentation][escape-nix][^escape-nix].
</div>

:point_right: Optionally log to journal using `systemd-cat` provided that
`displayManager.logToJournal` is set
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L62-L66).

```bash
if [ -z "$_DID_SYSTEMD_CAT" ]; then
  _DID_SYSTEMD_CAT=1 \
    exec $SYSTEMD_PATH/bin/systemd-cat -t xsession -- \
    "$0" "$@"
fi
```

:point_right: Source `/etc/profile` and change directory into `$HOME`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L68-L69).

```bash
. /etc/profile
cd "$HOME"
```

:point_right: Ensure `sessionType` is an empty string if the first argument
`$1` is `default`, otherwise `sessionType` is set to the value of `$1`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L71-L73).

```bash
# The first argument of this script is the session type.
sessionType="$1"
if [ "$sessionType" = default ]; then sessionType=""; fi
```

:point_right: Log errors to `~/.xsession-errors` if the NixOS
[`displayManager`](https://nixos.org/nixos/options.html#displaymanager) options
[`logXsession`](https://nixos.org/nixos/options.html#logsxsession) and
[`logToJournal`](https://nixos.org/nixos/options.html#logtojournal) are not set
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L75-L77).

```bash
exec > ~/.xsession-errors 2>&1
```

:point_right: Start a DBus session provided that the NixOS option
[`services.xserver.startDbusSession`](https://nixos.org/nixos/options.html#startdbussession)
is set to `true`.
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L79-L83).

```bash
if test -z "$DBUS_SESSION_BUS_ADDRESS"; then
  exec ${pkgs.dbus.dbus-launch} --exit-with-session "$0" "$sessionType"
fi
```

:point_right: Start pulseaudio
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L85-L93)

```nix
# Start PulseAudio if enabled.
optionalString (config.hardware.pulseaudio.enable) ''
  ${optionalString (!config.hardware.pulseaudio.systemWide)
    "${config.hardware.pulseaudio.package.out}/bin/pulseaudio --start"
  }

  # Publish access credentials in the root window.
  ${config.hardware.pulseaudio.package.out}/bin/pactl load-module module-x11-publish "display=$DISPLAY"
''
```

:point_right: Inform systemd about `$DISPLAY` and `$XAUTHORITY`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L95-L97).

```bash
# Tell systemd about our $DISPLAY and $XAUTHORITY.
# This is needed by the ssh-agent unit.
#
# Also tell systemd about the dbus session bus address.
# This is required by user units using the session bus.
$SYSTEMCTL_PATH/bin/systemctl --user import-environment DISPLAY XAUTHORITY DBUS_SESSION_BUS_ADDRESS
```

:point_right: Load Xdefaults from `~/.Xresources` and `~/.Xdefaults`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L99-L105).

```nix
# Load X defaults.
${xorg.xrdb}/bin/xrdb -merge ${xresourcesXft}
if test -e ~/.Xresources; then
    ${xorg.xrdb}/bin/xrdb -merge ~/.Xresources
elif test -e ~/.Xdefaults; then
    ${xorg.xrdb}/bin/xrdb -merge ~/.Xdefaults
fi
```

:point_right: Handle KDE voodoo :see_no_evil:
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L107-L114)

```bash
# Speed up application start by 50-150ms according to
# http://kdemonkey.blogspot.nl/2008/04/magic-trick.html
rm -rf "$HOME/.compose-cache"
mkdir "$HOME/.compose-cache"

# Work around KDE errors when a user first logs in and
# .local/share doesn't exist yet.
mkdir -p "$HOME/.local/share"
```

:point_right: Release `logToJournal` lock
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L116).

```bash
unset _DID_SYSTEMD_CAT
```

:point_right: Run `displayManager.sessionCommands`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L118).

{% if false %}
```nix
${cfg.displayManager.sessionCommands}
```
{% endif %}

:point_right: Load `~/.xprofile`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L120-L123).

```bash
# Allow the user to execute commands at the beginning of the X session.
if test -f ~/.xprofile; then
    source ~/.xprofile
fi
```

:point_right: Start graphical-session systemd target
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L125-L126).

```bash
# Start systemd user services for graphical sessions
$SYSTEMD_PATH/bin/systemctl --user start graphical-session.target
```

<div class="element note">
Note that `$SYSTEMD_PATH` is just a substitution for the real `systemd.package`
path which is expanded into this string by Nix :wink:.
</div>

:point_right: Honor `~/.xsession`
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L128-L135).

```bash
# Allow the user to setup a custom session type.
if test -x ~/.xsession; then
    exec ~/.xsession
else
    if test "$sessionType" = "custom"; then
        sessionType="" # fall-thru if there is no ~/.xsession
    fi
fi
```

:point_right: Set `desktopManager` and `windowManager` where `windowManager` is set to the phrase
contained by `sessionType` without the all characters from the beginning
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

:point_right: Start the window- and desktop manager
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L145-L163).

```nix
''# Start the window manager.
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
''
```

:point_right: Update DBus environment
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L165-L167).

```nix
${optionalString cfg.updateDbusEnvironment ''
  ${lib.getBin pkgs.dbus}/bin/dbus-update-activation-environment --systemd --all
''}
```

:point_right: Wait for the X session process to terminate, then stop stop
graphical-session systemd target and exit
[:octocat:](https://github.com/NixOS/nixpkgs/blob/17.09/nixos/modules/services/x11/display-managers/default.nix#L169-L173).

```bash
test -n "$waitPID" && wait "$waitPID"

$SYSTEMD_PATH/bin/systemctl --user stop graphical-session.target

exit 0
```

## Where to handle daemon spawning

In our case there seem to exist several places where one could potentially
start the ibus daemon.

 - `displayManager.sessionCommands`
 - `~/.xprofile`
 - a systemd unit that starts after `graphic-session.target`
 - `~/.xsession`
 - XMonad configuration

In my case, I opted for a systemd unit, which I defined in my nixos
configuration as follows:

```nix
systemd.user.services.ibus-daemon = {
  enable = true;
  wantedBy = [
    "multi-user.target"
    "graphical-session.target"
  ];
  description = "IBus daemon";
  script = "${pkgs.ibus-with-plugins}/bin/ibus-daemon";
  serviceConfig = {
    Restart = "always";
    StandardOutput = "syslog";
  };
};
```

[escape-nix]:https://nixos.org/nix/manual/#idm140737318136176

[^escape-nix]: Since `${` and `''` have special meaning in indented strings, you need a way to quote them. `${` can be escaped by prefixing it with `''` (that is, two single quotes), i.e., `''${`. `''` can be escaped by prefixing it with `'`, i.e., `'''`. Finally, linefeed, carriage-return and tab characters can be written as `''\n`, `''\r`, `''\t`.
