---
layout: post
title: Python and Qt Development in Nix
description: |
  This post is a 15 mins write-up because I just fucked up :bomb: and overwrote
  a draft post that I had thoughtfully put together. So here is a sloppy quick
  note-to-self for my future stoopid :facepalm: self in the "done is better
  than perfect" spirit.
date:  2020-12-31 16:57:50 +0000
type: tooling # for icon
category: tooling # for url
tags:
 - Python
 - Python3
 - Qt5
 - PyQt5
 - Qt
 - NixOS
 - Nix
 - poetry2nix
 - Poetry
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
mugshot: y2019
emojify: true
---

> :bomb: I just spend a good amount of time drafting what I considered was a
> thoughtful post just to find myself facepalming a few minutes ago when I
> noticed I `mv SOME_UNRELATED_STUB CURRENT_DRAFT`-ed, effectively overwriting
> my work. So this is a pivot -- a note-to-self to future me dealing with dev
> issues that may touch upon Python3, Poetry, Qt5, PyQt5 and nix shells.

I won't go into why Poetry is a nice package manager to use, but here is the
`shell.nix` that I have been using recently to play with some cute Qt code.

```nix
{ pkgs ? import <nixpkgs> { } }:
let
  qt = pkgs.qt514;
in
pkgs.mkShell {

  buildInputs = with pkgs; [
    poetry
    python3
    qt.full
    qtcreator
  ];

  # Keep Poetry cache within development directory
  POETRY_CACHE_DIR = "./.cache/poetry";

  # Just for some extra debug-useful visibility
  QT_DEBUG_PLUGINS = 1;

  LD_LIBRARY_PATH = with pkgs; stdenv.lib.makeLibraryPath [
    stdenv.cc.cc
    libGL
    zlib
    glib # libgthread-2.0.so
    xorg.libX11 # libX11-xcb.so
    xorg.libxcb # libxcb-shm.so
    xorg.xcbutilwm # libxcb-icccm.so
    xorg.xcbutil # libxcb-util.so
    xorg.xcbutilimage # libxcb-image.so
    xorg.xcbutilkeysyms # libxcb-keysyms.so
    xorg.xcbutilrenderutil # libxcb-renderutil.so
    xorg.xcbutilrenderutil # libxcb-renderutil.so
    dbus # libdbus-1.so
    libxkbcommon # libxkbcommon-x11.so
    fontconfig
    freetype
  ];
}
```

Start your nix-shell using `nix-shell -I nixpkgs=/path/to/nixpkgs` where
`/path/to/nixpkgs` is replaced for the path to the nixpkgs that you really
intend to use. Remember that versions of nix packages are pinned to the nixpkgs
that you are using, so in order to keep your nix use reproducible, always
mention which nixpkgs you build against.

> Please don't be me and forget to specficy the `-I` command line argument when
> using nix-shell. :facepalm: I spent a good amount of time feeling like a
> proper noob until [DigitalKiwi][kiwi] in the #nixos freenode chan pointed
> this out. Long live IRC rooms! :bow:

This environment will provide you the Qt Creator (accessible through the
`qtcreator` command), Qt Designer (accessible through the `designer` command)
as well as the `pyrcc5` and `pyuic5` command line utils that you'll use for
generating resource and ui code respectively.

I tend to design containers for the projects that I develop (even for
buildchains for firmware development) but when dealing with GUI projects,
containers become a bit of a hassle[^hassle]. This is why I turn to **nix**
which allows for [nifty developer environments][adhocdev]. Since I really hate
fiddling with tooling, the ability of nix to declaratively define environments
is a real joy with regards to portability (you can move between machines with
confidence) and reproducibility (you can onboard new folks to a project with
relative ease and considerably less "well it worked for me" problems :shrug:).

[^hassle]: In order to get GUI to work in containers, you will have to mount
  X11 sockets into your containers and some other jazz.

The good folks at tweag.io have already provided a better [write-up on
poetry2nix][tweag] than I can, which provides some additional perspectives on
the whole Poetry on NixOS stuff, so please go read that if you'd like to know
more.

[tweag]: https://www.tweag.io/blog/2020-08-12-poetry2nix/
[adhocdev]: https://nixos.org/guides/ad-hoc-developer-environments.html
[kiwi]: https://mostlyabsurd.github.io/about/
