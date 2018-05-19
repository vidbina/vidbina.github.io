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
 - bluetoothctl
 - nixos
 - pacmd
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
    pactl list sinks

Set sink `N` as default sink

    pacmd set-default-sink N
    pactl set-default-sink N

Suspend sink `N`

    pacmd suspend-sink N true
    pactl suspend-sink N true

Resume sink `N`

    pacmd suspend-sink N false
    pactl suspend-sink N false

Move a sink input from one sink to another :wink:

    pacmd move-sink-input X Y
    pactl move-sink-input X Y

So...

    pacmd list cards
    pactl list cards


    bluetoothctl
    list
    devices

```
[bluetooth]# connect 00:00:00:0A:0B:F0
Attempting to connect to 00:00:00:0A:0B:F0
[CHG] Device 00:00:00:0A:0B:F0 Connected: yes
Failed to connect: org.bluez.Error.Failed
[CHG] Device 00:00:00:0A:0B:F0 Connected: no
```

```
[bluetooth]# info 00:00:00:0A:0B:F0
Device 00:00:00:0A:0B:F0
	Name: PXC 550
	Alias: PXC 550
	Class: 0x00240404
	Icon: audio-card
	Paired: yes
	Trusted: yes
	Blocked: no
	Connected: no
	LegacyPairing: no
	UUID: Headset                   (00000000-0000-0000-0000-00000f0b00fb)
	UUID: Audio Sink                (0000000b-0000-0000-0000-00000f0b00fb)
	UUID: A/V Remote Control Target (0000000c-0000-0000-0000-00000f0b00fb)
	UUID: Advanced Audio Distribu.. (0000000d-0000-0000-0000-00000f0b00fb)
	UUID: A/V Remote Control        (0000000e-0000-0000-0000-00000f0b00fb)
	UUID: Handsfree                 (0000000e-0000-0000-0000-00000f0b00fb)
	UUID: PnP Information           (00000000-0000-0000-0000-00000f0b00fb)
	UUID: Generic Access Profile    (00000000-0000-0000-0000-00000f0b00fb)
	UUID: Generic Attribute Profile (00000000-0000-0000-0000-00000f0b00fb)
	UUID: Battery Service           (0000000f-0000-0000-0000-00000f0b00fb)
	UUID: Vendor specific           (0ddce00a-ecb0-0000-0000-0000c00aec0f)
	UUID: Vendor specific           (00000000-00c0-00e0-b000-feff000cdc0f)
	Modalias: bluetooth:v0000p0000d0000
```

```
[bluetooth]# register-application 0000000b-0000-0000-0000-00000f0b00fb
Application registered
[CHG] Device 00:00:00:0A:0B:F0 Connected: yes
[NEW] Primary Service
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service0000
	00000000-0000-0000-0000-00000f0b00fb
	Generic Attribute Profile
[NEW] Primary Service
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service0000
	0000000f-0000-0000-0000-00000f0b00fb
	Battery Service
[NEW] Characteristic
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service0000/char0000
	00000a00-0000-0000-0000-00000f0b00fb
	Battery Level
[NEW] Descriptor
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service0000/char0000/desc000a
	00000000-0000-0000-0000-00000f0b00fb
	Client Characteristic Configuration
[NEW] Primary Service
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service000b
	00000000-00c0-00e0-b000-feff000cdc0f
	Vendor specific
[NEW] Characteristic
	/org/bluez/hci0/dev_00_00_00_0A_0B_F0/service000b/char000c
	000000e0-00c0-00e0-b000-feff000cdc0f
	Vendor specific
[CHG] Device 00:00:00:0A:0B:F0 ServicesResolved: yes
```

## Links

- [ArchLinux: PulseAudio/Examples][arch-pa]
- [AskUbuntu: How to change pulseaudio sink with “pacmd set-default-sink” during playback?][so-71863]
- [die.net: pactl(1) Linux manpage][pactl-man]
- [StackExchange: Change volume on bluetooth speaker with amixer][se-340766]

[so-71863]: https://askubuntu.com/questions/71863/how-to-change-pulseaudio-sink-with-pacmd-set-default-sink-during-playback#72076
[arch-pa]: https://wiki.archlinux.org/index.php/PulseAudio/Examples
[pactl-man]: https://linux.die.net/man/1/pactl
[se-340766]:https://unix.stackexchange.com/questions/340766/change-volume-on-bluetooth-speaker-with-amixer/340794
[x]:https://askubuntu.com/questions/765233/pulseaudio-fails-to-set-card-profile-to-a2dp-sink-how-can-i-see-the-logs-and#773391
