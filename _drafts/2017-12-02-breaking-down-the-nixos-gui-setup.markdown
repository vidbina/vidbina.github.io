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

Within `nixos/modules/services/x11/display-managers/default.nix` a `xsession`
function is defined which is quite interesting to dissect.

```nix
      #! ${pkgs.bash}/bin/bash

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
      if [ "''${1:0:1}" = "/" ]; then eval exec "$1" "$2" ; fi

      # Now it should be safe to assume that the script was called with the
      # expected parameters.

      ${optionalString cfg.displayManager.logToJournal ''
        if [ -z "$_DID_SYSTEMD_CAT" ]; then
          _DID_SYSTEMD_CAT=1 exec ${config.systemd.package}/bin/systemd-cat -t xsession -- "$0" "$@"
        fi
      ''}

      . /etc/profile
      cd "$HOME"

      # The first argument of this script is the session type.
      sessionType="$1"
      if [ "$sessionType" = default ]; then sessionType=""; fi

      ${optionalString (!cfg.displayManager.job.logsXsession && !cfg.displayManager.logToJournal) ''
        exec > ~/.xsession-errors 2>&1
      ''}

      ${optionalString cfg.startDbusSession ''
        if test -z "$DBUS_SESSION_BUS_ADDRESS"; then
          exec ${pkgs.dbus.dbus-launch} --exit-with-session "$0" "$sessionType"
        fi
      ''}

      # Start PulseAudio if enabled.
      ${optionalString (config.hardware.pulseaudio.enable) ''
        ${optionalString (!config.hardware.pulseaudio.systemWide)
          "${config.hardware.pulseaudio.package.out}/bin/pulseaudio --start"
        }

        # Publish access credentials in the root window.
        ${config.hardware.pulseaudio.package.out}/bin/pactl load-module module-x11-publish "display=$DISPLAY"
      ''}

      # Tell systemd about our $DISPLAY and $XAUTHORITY.
      # This is needed by the ssh-agent unit.
      #
      # Also tell systemd about the dbus session bus address.
      # This is required by user units using the session bus.
      ${config.systemd.package}/bin/systemctl --user import-environment DISPLAY XAUTHORITY DBUS_SESSION_BUS_ADDRESS

      # Load X defaults.
      ${xorg.xrdb}/bin/xrdb -merge ${xresourcesXft}
      if test -e ~/.Xresources; then
          ${xorg.xrdb}/bin/xrdb -merge ~/.Xresources
      elif test -e ~/.Xdefaults; then
          ${xorg.xrdb}/bin/xrdb -merge ~/.Xdefaults
      fi

      # Speed up application start by 50-150ms according to
      # http://kdemonkey.blogspot.nl/2008/04/magic-trick.html
      rm -rf "$HOME/.compose-cache"
      mkdir "$HOME/.compose-cache"

      # Work around KDE errors when a user first logs in and
      # .local/share doesn't exist yet.
      mkdir -p "$HOME/.local/share"

      unset _DID_SYSTEMD_CAT

      ${cfg.displayManager.sessionCommands}

      # Allow the user to execute commands at the beginning of the X session.
      if test -f ~/.xprofile; then
          source ~/.xprofile
      fi

      # Start systemd user services for graphical sessions
      ${config.systemd.package}/bin/systemctl --user start graphical-session.target

      # Allow the user to setup a custom session type.
      if test -x ~/.xsession; then
          exec ~/.xsession
      else
          if test "$sessionType" = "custom"; then
              sessionType="" # fall-thru if there is no ~/.xsession
          fi
      fi

      # The session type is "<desktop-manager>+<window-manager>", so
      # extract those (see:
      # http://wiki.bash-hackers.org/syntax/pe#substring_removal).
      windowManager="''${sessionType##*+}"
      : ''${windowManager:=${cfg.windowManager.default}}
      desktopManager="''${sessionType%%+*}"
      : ''${desktopManager:=${cfg.desktopManager.default}}

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

      ${optionalString cfg.updateDbusEnvironment ''
        ${lib.getBin pkgs.dbus}/bin/dbus-update-activation-environment --systemd --all
      ''}

      test -n "$waitPID" && wait "$waitPID"

      ${config.systemd.package}/bin/systemctl --user stop graphical-session.target

      exit 0
```
