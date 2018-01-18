---
layout: post
title: Turning up those Bluetooth headphones in NixOS
description: |
  Just figuring out how to get my PXC 550 Sennheiser :headphones: up and running
  with my NixOS :snowflake: rig using tools such as `pactl`.
date:  2017-08-14 09:22:00 +0000
type: nixos # for icon
category: nixos # for url
tags:
 - audio
 - bluetooth
 - nixos
 - pactl
 - pulseaudio
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

List all sinks

    pacmd list-sinks

Set sink `N` as default sink

    pacmd set-default-sink N

Suspend sink `N`

    pacmd suspend-sink N 1

Resume sink `N`

    pacmd suspend-sink N 0

## Links

- [ArchLinux: PulseAudio/Examples][arch-pa]
- [AskUbuntu: How to change pulseaudio sink with “pacmd set-default-sink” during playback?][so-71863]
- [die.net: pactl(1) Linux manpage][pactl-man]
- [StackExchange: Change volume on bluetooth speaker with amixer][se-340766]

[so-71863]: https://askubuntu.com/questions/71863/how-to-change-pulseaudio-sink-with-pacmd-set-default-sink-during-playback#72076
[arch-pa]: https://wiki.archlinux.org/index.php/PulseAudio/Examples
[pactl-man]: https://linux.die.net/man/1/pactl
[se-340766]:https://unix.stackexchange.com/questions/340766/change-volume-on-bluetooth-speaker-with-amixer/340794
