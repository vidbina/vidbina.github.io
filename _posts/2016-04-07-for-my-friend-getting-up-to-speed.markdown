---
layout: post
title: For my Friend Getting up to Speed
description: |
  
date:  2016-04-07 16:14:42 -0400
type: web # for icon
category: web # for url
tags:
 - TAGA
 - TAGB
#og:
#  type: OG:TYPE # http://ogp.me/#types
#  og:type: # 
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: http://example.com
#twitter:
#  card: summary_large_image
#  image: http://example.com
---

This post is a work in progress... I'll keep editing it in the next couple of
days :construction:.

## The Right Environment

become a proficient Linux user (why: I need you to understand how to deploy
software to Linux servers, and how to maintain them). I think you already used
Linux a lot. Let's just assume from this point on that you do everything I
recommend in the points below in Linux or OSX (any nix-based OS will work).

> It may even make sense to stick to command-line tools like vim for text
editing, tmux or screen for terminal multiplexing -- basically all non-gui
tools. Why?!? Well, mostly servers don't run elaborate GUI's. Most of the work
is done from the command line so you better get comfortable. Whenever I log
into my Macbook, I open a tmux session and generally do all of my work from
there. I browse the web with Chrome and Safari, but every line of code written
happens in vim, every time I need to jump between windows or interfaces I do
that within or between my tmux session. When someone drops me on a server, I
know how to find my way around :wink:.

## Monoliths and Microservices

Understand the difference between monolithic vs microservice. Normally speaking
people would write complete applications in Python, Ruby, PHP or any other
language for the web but the problem is that, as applications grow, they become
harder to maintain. The latest trend is to develop microservices which
subdivide work into smaller tasks which are managed by a single application.

Instead of a complete netflix-like application (that handles catalogueing,
authentication, permission management, streaming, etc), one could build seperate
video-decoding/encoding services that just translate video from one format to
another, authentication services that just look at user credentials and
determine if they get permission for a certain action yes or no, cataloging
services that simply look at a user and figure out which items should be
available. 


[Learn Rails from Hartl's tutorial](https://www.railstutorial.org) which will
give you a great understanding of building applications that do everything).
You will write a simple microblogging application, but that is good enough to
understand how an application works that does multiple things. For an
application this small it doesn't even make sense to try the microservices
approach because that approach comes with a price, too. They're harder to
write, generally, because there are a lot of separate moving parts :wink:.

Now read why [microservices matter](https://blog.heroku.com/archives/2015/1/20/why_microservices_matterhttps://blog.heroku.com/archives/2015/1/20/why_microservices_matter). At this stage you have probably
already played with Heroku (from the Hartl's tutorial) so we're just
connecting dots.

## To the cloud

Heroku is a great service to deploy application. Sometimes, however; you need
more control. Perhaps you want to manage your own stack, perhaps there are some
requirements to the infrastructure, perhaps you don't want to lock yourself
into Heroku. If you're a startup, I don't get why you'd have a problem with
Heroku. I think Heroku is a wonderful solution to get applications live. Just
focus on figuring out if the assumptions your company is based on are valid.
Until you've validated or invalidated them and are serving people to the point
that you get phonecalls of overjoyed clients, you have no reason to worry too
much about "where" your application is running and "how" it is deployed.

However; if you want to understand what the big fuss is about in application 
development, lately you need to familiarize yourself with the following...
configuration management (ansible, puppet, chef), containerization (docker,
rkt), orchestration (docker-swarm, mesos, kubernetes).
kubernetes). Basically I just listed a topic and a few solutions within the
parenthesis. It is unlikely you'll be able to get a in-depth look at all of
the listed options, but let's get at least a birds-eye view of what's possible.

With configuration management we basically simplify how we provision and
configure resources. Think about starting a new virtual machine at your
provider, installing a base OS and some of the needed tools to get started.

To be continued
