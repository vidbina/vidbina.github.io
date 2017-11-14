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
available for the 3 most dominant platforms (Windows, macOS and Linux) it
is a rather pragmatic choice for a virtualization solution.

To start off, a base image will be needed into which the neccessary
applications and configurations can be installed. Using vagrant to manage the
creation and management of the environment on the user's setup simplified both
distribution of image updates and information exchange between the user's host
and the work environment.

## Base image

> *NOTE* Use server images. The Ubiquity installer on desktop images doesn't facilitate complete automation in a practical manner.

An attempt was made to start off with a Ubuntu 17.10 Desktop ISO, but after a
long time of messing around it became clear that this is an impractical route
because
 - the desktop image uses Ubiquity as an installer, which only honors a subset
 of the debian-installer directives effectively leaving some parameters
 unconfigurable without the use of awkward scripts through the
 `preseed/early_command`, `preseed/late_command`, `ubiquity/failure_command`
 and `ubiquity/success_command` directives.
 - the desktop image does not come with openssh-server preinstalled for good
 reasons[^no_ssh_server_on_desktop], however; since some provisioning needs to
 be done over ssh[^provisioning_over_ssh], using the
 [ssh communicator][packer_ssh_communicator], another means of installing
 ssh[^install_ssh_server_aardvark] is necessary, yet again leaving one with the
 awkward directives as mentioned before :wink:.
 - the current 17.10 release isn't yet completely documented whereas the LTS
 releases provide at least [documentation for the server releases and an
 installation guide][ubuntu_doc].

Given the points listed above the following decisions make sense
 - use an LTS release which offers more comprehensive documentation in
 comparison to bleeding edge releases and
 - use a server release which
   - allows the use of the full feature spectrum of the debian-installer
   - bundles openssh-server by default.

### Issues

The following sections cover possible issues one may encounter and proposes
steps that may lead to each issue's resolution.

#### Incorrect password attempt for sudo

```
==> x: Gracefully halting virtual machine...
    x: [sudo] password for vagrant: Sorry, try again.
    x: [sudo] password for vagrant:
    x: sudo: 1 incorrect password attempt
==> x: Timeout while waiting for machine to shut down.
==> x: Step "StepShutdown" failed
==> x: [c] Clean up and exit, [a] abort without cleanup, or [r] retry step (build may fail even if retry succeeds)? c
```

After completing the installation, packer will attempt to establish an SSH
connection before continuing the installation process. Prior to shutdown,
however; one should add the user to the sudoers group otherwise sudo attempts
will fail as demonstrated in the console excerpt above where the `vagrant` user
is unable to sudo.

The following console commands should be provided in one of the provisioning
scripts or as seperate commands in order to set up the machine for ssh login
before converting it to a static image.

```bash
# Add no-password sudo config for vagrant user
echo "%vagrant ALL=NOPASSWD:ALL" > /etc/sudoers.d/vagrant
# Set permissions
chmod 0440 /etc/sudoers.d/vagrant
# Add vagrant to sudo group
usermod -a -G sudo vagrant
```

## Provisioning

The [Ubiquity Automation][ubiquity_auto] wiki at the time of writing, mentioned
that they keys `netcfg`, LVM and RAID, `base-installer`, `pkgsel`, `tasksel`
and `finish-install` are not used by Ubiquity. This leaves us to find another
way to provision a few basic packages such as `openssh-server` which is part of
the server distribution, but has to be installed explicitly on a desktop
release.

Since something like 

```
d-i pkgsel/include string openssh-server ntp
```

will not work with the Ubiquity installer as it is not mentioned in the
[available preseeding keys][ubiquity_preseeding_keys], one will
have to resort to using `preseed/early_command` and `preseed/late_command` keys
to manage addidional needed packages.

```
d-i preseed/late_command in-target touch /path/to/file.txt
```

Examine /var/log/installer/casper.log

## Vagrant

With the image ready, users still need a convenient method of exchanging
information between the environment and their host system. Explaining the
process of mounting shared volumes should not be a big problem, but 

## Links

- [Ubiquity Automation][ubiquity_auto]
- [Appendix B. Automating the installation using preseeding][lts_apb]
- [Debugging Ubiquity][ubiquity_debug]
- [B.5. Advanced options][lts_apb-5-advanced]

[ubuntu_doc]: https://web.archive.org/web/20171108025157/https://help.ubuntu.com/
[ubiquity_auto]: https://web.archive.org/web/20171025150033/https://wiki.ubuntu.com/UbiquityAutomation
[lts_apb]: https://web.archive.org/web/20170213144306/https://help.ubuntu.com/lts/installation-guide/i386/apb.html
[ubiquity_debug]: https://web.archive.org/web/20170912022644/https://wiki.ubuntu.com/DebuggingUbiquity
[lts_apb-5-advanced]: https://web.archive.org/web/20161224142631/https://www.debian.org/releases/stable/i386/apbs05.html.en
[]: https://help.ubuntu.com/lts/installation-guide/armhf/apbs02.html
[ubiquity_preseeding_keys]:https://web.archive.org/web/20171025150033/https://wiki.ubuntu.com/UbiquityAutomation#Available_preseeding_keys
[packer_ssh_communicator]: https://www.packer.io/docs/templates/communicator.html#ssh

[^no_ssh_server_on_desktop]: For security reasons one should not want to have an SSH server running on a machine meant for desktop use as that leaves another port (22) open and exposed for possible attackers.
[^provisioning_over_ssh]: After generating a base image, a tool like Vagrant will facilitate the provisioning of an environment which entails installing of needed tools and applying of configurations. This isn't done in the base image, because it makes sense to keep those domains seperated. One could perhaps apply the provisioning scripts on a different environment (e.g.: the host computer) in other to setup another system in a manner somewhat similar to th
[^install_ssh_server_aardvark]: With the `openssh-server` package not being part of the sources for the desktop image for Ubuntu Artful Aardvark (17.10) one has to jump through a few loops (e.g.: modifying the sources list with the sources for older distributions) to get this entire setup to work since regular debian-installer directives such as `pkgsel/include` don't work when using the Ubiquity installer.
