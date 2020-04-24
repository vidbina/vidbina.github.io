---
layout: post
title: Virtualbox on NixOS
description: |
  A quick run-down of installing VirtualBox with the Extention Pack on a NixOS
  setup.
date:  2017-07-14 18:04:20 +0000
type: tools # for icon
category: tools # for url
tags:
 - nixos
 - virtualization
 - virtualbox
 - tools
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

The [gist](https://gist.github.com/vidbina/7bfa3f6a1621e86c5f14e833d40ae402)
demonstrates that installing virtualbox is as simple as just adding the
`virtualbox` derrivation to the systemPackages list and configure it to enable
the host and extension pack.


<div class="item">
  <script src="https://gist.github.com/vidbina/7bfa3f6a1621e86c5f14e833d40ae402.js"></script>
</div>

Executing `sudo nixos-rebuild test` would fail because of licensing issues.

The VirtualBox Personal Use and Evaluation License needs to be accepted prior
to completing the installation of the extension pack, therefore one needs to
review the license and explicitly execute the `nix-prefetch-url` command
displayed in the console upon the installation failure.

The following excerpt should be somewhere in the console output since the last
`nixos-rebuild` attempt and contains the full `nix-prefetch-url` command that
one should execute to accept the licensing terms.

```
In order to use the extension pack, you need to comply with the VirtualBox Personal Use
and Evaluation License (PUEL) available at:

https://www.virtualbox.org/wiki/VirtualBox_PUEL

Once you have read and if you agree with the license, please use the
following command and re-run the installation:

nix-prefetch-url http://download.virtualbox.org/virtualbox/5.1.18/Oracle_VM_VirtualBox_Extension_Pack-5.1.18-114002.vbox-extpack

```

After this, one may want to add the current user to the virtualbox users
group in order to allow USB pass-through.

In my case I have to add the `vboxusers` group to the user object.

```nix
users = {
  defaultUserShell = "/run/current-system/sw/bin/zsh";

  users.vidbina = {
    isNormalUser = true;
    description = "David Asabina <vid@bina>";
    createHome = true;
    cryptHomeLuks = "/dev/store/vid";
    home = "/home";
    extraGroups = [
      "docker"
      "networkmanager"
      "wheel"
      "vboxusers"
    ];
    initialPassword = "WatchingRayDonovan";
  };
};
```

```nix
boot.kernelModules = [
  "af_packet"
  "virtio" "virtio_pci" "virtio_ring" "virtio_net"
  "vboxguest" "vboxsf"
];
```

After these changes `sudo nixos-rebuild test` should work. Make the switch to
eternalise the changes by running `sudo nixos-rebuild switch`.

Simple as that :wink:

## Links

- [Installing VirtualBox on NixOS](https://github.com/deepfire/nixos-wiki/blob/master/Installing%20VirtualBox%20on%20NixOS.page)
- [gist: VirtualBox with Extention Pack on NixOS](https://gist.github.com/vidbina/7bfa3f6a1621e86c5f14e833d40ae402)
