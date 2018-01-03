---
layout: post
title: Using OpenVPN with NetworkManager
description: |
  Add a description to this article here. Keep it short and sweet.
date:  2018-01-03 12:07:25 +0000
type: # for icon
 - networking
 - internet
 - cloud
category: networking # for url
tags:
 - networking
 - networkmanager
 - nmcli
 - openvpn
 - vpn
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
One may start OpenVPN connections by simply calling the OpenVPN executable
with the appropriate .ovpn file and supplying the username and password on
the fly. The problem with this approach, however; is that one would most
likely have to run the openvpn command as sudo since OpenVPN needs the
clearance to create tun network interfaces.

```
sudo openvpn $PATH_TO/ch-de-nl-ru.ovpn
```

A much healthier approach is to start OpenVPN through the NetworkManager.
For this one would need to install the OpenVPN plugin for NetworkManager
([git][nm-ovpn-git] and [releases][nm-ovpn-rel]) which in Nix, requires us to
add the `networkmanager_openvpn` package to `networking.networkmanager.packages`
as in

```nix
  networking = {
    networkmanager.enable = true;
    networkmanager.packages = with pkgs; [
      networkmanager_openvpn
    ];
  };
```

One may use the openvpn plugin to import configurations defined in .ovpn files
by means of

```
nmcli con import type openvpn file $PATH_TO/ch-de-nl-ru.ovpn
```

after which one may run

```
nmcli con show
```

to list all connections known to the NetworkManager.


After connections have been added, one may examine their configurations by
running

```
nmcli con show ch-de-nl-ru
```

and subsequently modify available keys by using the `modify` command
followed by the connection name, the key name and the value as in

```
nmcli con modify ch-de-nl-ru vpn.user-name mysecrethandle
```

which sets the `vpn.user-name` key for the `ch-de-nl-ru` connection to
`mysecrethandle` :wink:.


Finally, one may bring up the connection in question by simply executing

```
nmcli con up ch-de-nl-ru
```

without even thinking about sudo along the way.

I don't add passwords to my VPN configurations because it is a minor hassle to
enter the password upon starting the connection. I'm pretty sure that there is
clever way to GPG to encrypt the passwords and just request the GPG secret or
perhaps leverage the gpg-agent to simplify the process but my needs didn't
drive me towards that solution yet.

## Links

- https://unix.stackexchange.com/questions/140163/import-vpn-config-files-to-networkmanager-from-command-line

[nm-ovpn]: https://launchpad.net/network-manager-openvpn
[nm-ovpn-git]:https://git.gnome.org/browse/network-manager-openvpn
[nm-ovpn-rel]:https://download.gnome.org/sources/NetworkManager-openvpn
[ovpn]: https://wiki.gnome.org/Projects/NetworkManager
[nm-vpn]: https://wiki.gnome.org/Projects/NetworkManager/VPN
