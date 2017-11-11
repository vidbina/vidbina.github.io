---
layout: post
title: Provisioning a VirtualBox workbench for ML use
description: |
  A brief account on building a Ubuntu desktop based work environment
  utilizing tools such as Packer, Vagrant and VirtualBox.
date:  2017-11-10 01:55:05 +0000
type: ml # for icon
category: ml # for url
tags:
 - ml
 - machine learning
 - machinelearning
 - virtualization
 - provisioning
 - vagrant
 - packer
 - virtualbox
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
For a course I helped co-write, a need has emerged for a work environment as
part of the course material in order to eliminate the complications the
educators and students face in their attempts to install the required tools
over a host of different platforms with different configurations.

Considering that the workbench will contain a host of GUI applications, it
makes sense to provide a graphical work environment. With VirtualBox being
available on the 3 most dominant platforms (Windows, macOS and Linux) it
became a rather easy choice.

To start off, a base image will be needed into which the neccessary
applications and configurations can be installed. Using vagrant to manage the
creation and management of the environment on the user's setup simplified both
distribution of image updates and information exchange between the user's host
and the work environment.

## Base image

> An attempt was made to start of with Ubuntu 17.10 Desktop edition, but since it is too new and documentation is not complete at the time of writing it seemed wise to resort to using a LTS version of Ubuntu. For example, at the time of writing, `openssh-server` was not yet part of the default apt repository of Ubuntu Artful Aardvark (17.10) which would require jumping through a few loops (e.g.: modifying the sources list with the sources for older distributions) to get this entire setup to work.

## Provisioning

The [Ubiquity Automation][ubiquity-auto] wiki at the time of writing, mentioned
that they keys `netcfg`, LVM and RAID, `base-installer`, `pkgsel`, `tasksel`
and `finish-install` are not used by Ubiquity. This leaves us to find another
way to provision a few basic packages such as `openssh-server` which is part of
the server distribution, but has to be installed explicitly on a desktop
release.

```
d-i preseed/early_command in-target touch /path/to/file.txt
```

Examine /var/log/installer/casper.log

## Vagrant

With the image ready, users still need a convenient method of exchanging
information between the environment and their host system. Explaining the
process of mounting shared volumes should not be a big problem, but 

## Links

- [Ubiquity Automation][ubiquity-auto]
- [Appendix B. Automating the installation using preseeding][lts-apb]
- [Debugging Ubiquity][ubiquity-debug]
- [B.5. Advanced options][lts-apb-5-advanced]

[ubiquity-auto]: https://web.archive.org/web/20171025150033/https://wiki.ubuntu.com/UbiquityAutomation
[lts-apb]: https://web.archive.org/web/20170213144306/https://help.ubuntu.com/lts/installation-guide/i386/apb.html
[ubiquity-debug]: https://web.archive.org/web/20170912022644/https://wiki.ubuntu.com/DebuggingUbiquity
[lts-apb-5-advanced]: https://web.archive.org/web/20161224142631/https://www.debian.org/releases/stable/i386/apbs05.html.en
