---
layout: post
title: For my Friend Getting up to Speed
description: |
  After a while of project management work, a friend is yearning to in on the
  action again. Things change fast so as of April 2016 I'll try to list a few
  things that I deem instrumental in understanding and building modern system
  for the web.
date:  2016-04-07 16:14:42 -0400
type: web # for icon
category: web # for url
tags:
 - web
 - patterns
 - trends
 - development
 - cloud
 - engineering
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
head: mugshot
emojify: true
---

This post is a work in progress... I'll keep editing it in the next couple of
days :construction:.

## The Right Environment

Become a proficient Linux user (why: I need you to understand how to deploy
software to Linux servers, and how to maintain them). I think you already used
Linux a lot. Let's just assume from this point on that you do everything I
recommend in the points below in Linux or OSX (any nix-based OS will work).

<div class="element note">
It may even make sense to stick to command line tools like vim for text
editing, tmux or screen for terminal multiplexing -- basically all non-GUI
tools. Why?!? Well, mostly servers don't run elaborate GUI's. Most of the work
is done from the command line so you better get comfortable. Whenever I log
into my Macbook, I open a tmux session and generally do all of my work from
there. I browse the web with Chrome and Safari, but every line of code written
happens in vim, every time I need to jump between windows or interfaces I do
that within or between my tmux session. When someone drops me on a server, I
know how to find my way around :wink:.
</div>

### Git Started! :checkered_flag:

Check your feelings at the door for this one :door:. If you're not using
[git][git-guide] you don't really matter -- sorry, but everyone is using git.
It's simple and works well in teams. Run through the [git tutorial][git-guide]
and make sure you understand what you just did.

Also make sure you have a [Github][github] account. Pretty much every project
that matters is on [Github][github] and many developers are sharing code there
and collaborating on projects. Chances are that you will have to get an account
just to get cracking. Get one now :octocat:.

<div class="element">
  <div class="github-card" data-github="vidbina" data-width="400" data-height="150" data-theme="default"></div>
  <script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
</div>


## Monoliths and Microservices

Understand the difference between monolithic vs microservice. Normally speaking
people would write complete applications in Python, Ruby, PHP or any other
language for the web but the problem is that, as applications grow, they become
harder to maintain. The latest trend is to develop microservices which
subdivide work into smaller tasks which are managed by a single application.

Instead of a complete Netflix-like application (that handles cataloging,
authentication, permission management, streaming, etc), one could build separate
video decoding/encoding services that just translate video from one format to
another, authentication services that just look at user credentials and
determine if they get permission for a certain action yes or no, cataloging
services that simply look at a user and figure out which items should be
available.


[Learn Rails from Hartl's tutorial](https://www.railstutorial.org) which will
give you a great understanding of building applications that do everything).
You will write a simple micro blogging application, but that is good enough to
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
that you get phone calls of overjoyed clients, you have no reason to worry too
much about _where_ your application is running and _how_ it is deployed.

However; if you want to understand what the big fuss is about in application
development, lately you need to familiarize yourself with the following...
configuration management ([ansible][ansible], [puppet][puppet], [chef][chef]),
containerization ([docker][docker], [rkt][rkt]), orchestration
([docker-swarm][docker-swarm], [mesos][mesos], [kubernetes][kubernetes]).
Basically I just listed a topic and a few solutions within the parenthesis. It
is unlikely you'll be able to get a in-depth look at all of the listed options,
but let's get at least a birds-eye view of what's possible.

With configuration management we basically simplify how we provision and
configure resources. Think about

 - starting a new virtual machines at your provider,
 - installing base OS-es and some of the needed tools to get started and
 - setting up networking between the machines.

After the machines are running you need to deploy applications to these boxes.
I have used [capistrano][capistrano] a lot to do this. With
[capistrano][capistrano], I would basically just install the necessary tools
on the VM and set up the application, however; the problem with this occurs
when one starts to run multiple applications on a single machine. Somehow the
applications share libraries. If application A needs an updated version of
some libs while application B wasn't yet updated to be compatible with the
newer library we have problems :fire:. Containerization provides a solution by
allowing us to run our applications in sandboxed environments. Every
application runs in its own container. The only thing the applications share
is the kernel (pretty low level). The libraries and all the other junk that is
specific to the application is contained within... the container. Solutions
like [docker][docker] and [rkt][rkt] make running containers quite easy.

Whenever you have enough containers floating around, management of these
suckers becomes rather tricky. Some containers you rather have running on the
same machine for simplicity's sake. Having the database and the application
that relies on that database running in different containers in different
machines incurs extra networking overhead, running them on the same machines
makes more sense. On the other end, ramping up the number of webservices,
because there is more traffic on the site sometimes requires some finesse.
Perhaps you want to equally distribute the workload over all virtual machines,
instead of cracking down on a single VM to the limit. [Mesos][mesos],
[kubernetes][kubernetes] and [docker-swarm][docker-swarm] are a few tools
that make this a bit easier. You could tell these tools, to ramp up certain
containers on some VM's with specific hardware by using labels (e.g.: only ramp
up database containers on machines that have very fast SSD storage instead of
cheaper and slower magnetic disks).

[Try you hand at kubernetes](http://kubernetes.io/docs/hellonode/) and after
that take a look at a wonderful example of [how things can be done in
docker-swarm](https://blog.docker.com/2016/03/swarmweek-advanced-orchestration-docker-swarm/).

To be continued :construction:

[ansible]: https://en.wikipedia.org/wiki/Ansible_(software)
[puppet]: https://en.wikipedia.org/wiki/Puppet_(software)
[chef]: https://en.wikipedia.org/wiki/Chef_(software)

[capistrano]: https://en.wikipedia.org/wiki/Capistrano_(software)

[docker]: https://en.wikipedia.org/wiki/Docker_(software)
[rkt]: https://coreos.com/rkt/

[docker-swarm]: https://docs.docker.com/swarm/
[kubernetes]: https://en.wikipedia.org/wiki/Kubernetes
[mesos]: https://en.wikipedia.org/wiki/Apache_Mesos

[git-guide]: https://git-scm.com/book/en/v1/Getting-Started
[github]: https://github.com
