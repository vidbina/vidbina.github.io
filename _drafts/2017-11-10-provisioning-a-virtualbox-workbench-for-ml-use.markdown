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

> An attempt was made to start of with Ubuntu 17.10 Desktop edition, but since it is too new and documentation is not complete at the time of writing it seemed wise to resort to using a LTS version of the OS. For example, at the time of writing, `openssh-server` was not yet part of the default apt repositorie of Ubuntu Artful Aardvark (17.10) which would require jumping through a few loops to get this entire setup to work.

## Provisioning

## Vagrant

With the image ready, users still need a convenient method of exchanging
information between the environment and their host system. Explaining the
process of mounting shared volumes should not be a big problem, but 

## Links

- http://web.mit.edu/~cocosci/Papers/statistics-and-the-Bayesian-mind.pdf
