---
layout: post
title: Choosing an init system for containers
description: |
  An exploration of init systems for containers that may need one.
date:  2018-11-08 19:48:11 +0000
type: tools # for icon
category: tools # for url
tags:
 - tools
 - init systems
 - linux
 - runit
 - openrc
 - systemd
 - s6
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

While trying to run Postfix :e-mail: inside a Docker :whale: container it
seemed sensible to explore which init system would be well-suited for the
use-case.

> **DISCLAIMER** :warning:  I'm by no means an expert in init systems. So be
> extremely sceptical about anything in this post
> :stuck_out_tongue_closed_eyes:.

I understand that idiomatic container usage conforms to the single
service-per-container paradigm, but in the case of postfix, it becomes a bit
trickier to isolate the constituent services in separate containers.

## Problem

The [Postfix documentation][postfix-syslog] mentions syslogd being used for
logging. This means that we have to start the syslogd daemon and the postfix
server.

So the lame way to run things is by creating the postfix group and user and
installing the postfix package with a Dockerfile that resembles the following:

```dockerfile
FROM alpine:3.8

RUN addgroup -g 12345 -S postfix
RUN adduser \
  -h /var/empty \
  -g "postfix" \
  -s /sbin/nologin \
  -G postfix \
  -D \
  -H \
  -u 12345 \
  postfix

RUN apk add --no-cache postfix
```

Provided that the configuration files are `ADD`'ed, `COPY`'d or mounted into
the resulting container, one can start the entire circus :circus: by starting
the logging daemon and then starting postfix.

```sh
syslogd && postfix start
```

The problem with this approach is that syslogd runs in the background and could
possibly die while the postfix services keep churning on. Bad for business.

Termination of the postfix server, should trigger an exit of the container, but
failure of the syslogd daemon should trigger a restart of the daemon by
whichever supervisor we choose.

## OpenRC

<!-- not a init system, a supervisor -->

OpenRC is the init system used by Gentoo and I considered it might be worth a
try in order to determine how well it fits the use-case I have in mind.

Bear with me... the following Dockerfile is a very sloppy example of a basic
environment that uses OpenRC as an init system and starts rsyslog as a daemon
:see_no_evil:.

```dockerfile
FROM alpine:3.8 AS base

RUN apk add --no-cache \
  openrc \
  rsyslog

# https://github.com/dockage/alpine/blob/master/3.8/openrc/Dockerfile
# https://github.com/neeravkumar/dockerfiles/blob/master/alpine-openrc/Dockerfile

# Too verbose, but you get the point...
# Much configuration going on
RUN sed -i \
  -e 's/^\(tty\d\:\:\)/#\1/g' \
  /etc/inittab
RUN sed -i \
  -e 's/^#rc_sys=".*"/rc_sys="docker"/g' \
  -e 's/^#rc_env_allow=".*"/rc_env_allow="\*"/g' \
  -e 's/^#rc_crashed_stop=.*/rc_crashed_stop=NO/g' \
  -e 's/^#rc_crashed_start=.*/rc_crashed_start=YES/g' \
  -e 's/^#rc_provide=.*/rc_provide="loopback net"/g' \
  /etc/rc.conf
RUN sed -i \
  -e 's/VSERVER/DOCKER/Ig' \
  /lib/rc/sh/init.sh
RUN sed -i \
  -e 's/\tcgroup_add_service/\t#cgroup_add_service/g' \
  /lib/rc/sh/openrc-run.sh
RUN sed -i \
  -e 's/hostname $opts/# hostname $opts/g' \
  /etc/init.d/hostname
RUN rm -f \
  /etc/init.d/hwclock \
  /etc/init.d/hwdrivers \
  /etc/init.d/modloop \
  /etc/init.d/modules \
  /etc/init.d/modules-load

# Disable kernel logging
# Disable all default logging rules to use /etc/rsyslog.d/*
RUN sed -i \
  -e "s/^\(\$ModLoad imklog.so\)/#\1/g" \
  -e 's/^\(\*\..*\)/#\1/g' \
  -e 's/^\(\w.*\)/#\1/g' \
  /etc/rsyslog.conf

RUN rc-update add rsyslog boot

# Copy a syslog file that conforms to that which I found in the Postfix docs
# Just leave this empty if you want to test it
COPY config/syslog.conf /etc/rsyslog.d/syslog.conf

FROM base

RUN addgroup -g 12345 -S postfix
RUN adduser \
  -h /var/empty \
  -g "postfix" \
  -s /sbin/nologin \
  -G postfix \
  -D \
  -H \
  -u 12345 \
  postfix

RUN apk add --no-cache \
  postfix
CMD postfix start-fg
```

From a cursory glance of the Dockerfile snippet, it becomes clear that some
modification of the configuration is required in order to get OpenRC to work in
a restricted environment like a Docker container. Thanks to the work from the
few links within the snippet, I managed to produce an environment that would
simply start.

> rsyslog was selected over syslog-ng, since rsyslog allows us to use the
> syslog configuration syntax which is mentioned in the Postfix documentation
> and I simply didn't have the patience to introduce anything new that wasn't
> strictly necessary.

Since OpenRC doesn't support supervision out of the box a couple of points of
note:

 - Modification needed to OpenRC configuration to run inside a container
 - Superviser not included
 - Extra work required to exit container once it runs an init system

## runit

<!-- provides /sbin/init and PID 1, no service management tooling -->

## supervisord

## s6-overlay

<!-- s6 provides pid 1, and hooks for service manager integration -->
<!-- anopa and s6-rc are service managers designed to work with s6 -->
<!-- openrc starts service serially, s6-rc is parallel ->
<!-- s6 uses notification statt polling -->

There is an excellent write-up on [s6's right to existence][s6-why] which
basically boils down to
 - s6 doesn't poll its children buts gets messaged/notified
 - .

## Links

- [Comparison of init systems][cmp-init]
- [Alpine Syslog][alpine-syslog]
- [Gentoo Process Supervision][gentoo-proc-supervision]
- [runit][runit] a [thread on the exit problem][runit-exit-discourse] and a [commit to tackle that][runit-exit-github]

<!--
- [runit-docker][runit-docker]
-->

[alpine-syslog]: https://wiki.alpinelinux.org/wiki/Syslog
[cmp-init]: https://wiki.gentoo.org/wiki/Comparison_of_init_systems
[docker-multiple-svcs]: https://docs.docker.com/config/containers/multi-service_container/
[docker-systemctl-replacement]: https://github.com/gdraheim/docker-systemctl-replacement/blob/master/notes/NOTES.md
[dumb-init]:  https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
[gentoo-proc-supervision]: https://wiki.gentoo.org/wiki/Process-Supervision
[peterbourgon-runsvinit]: https://peter.bourgon.org/blog/2015/09/24/docker-runit-and-graceful-termination.html
[postfix-syslog]: http://www.postfix.org/BASIC_CONFIGURATION_README.html#syslog_howto
[runit-docker]: https://github.com/pixers/runit-docker
[runit-exit-discourse]: https://github.com/discourse/discourse_docker/commit/d821539c6a63d1fbeaf9f56811aaf9b2be11185d
[runit-exit-github]: https://meta.discourse.org/t/runsv-hanging-on-docker-container-shutdown/36844/53
[runit]: http://smarden.org/runit/index.html
[runsvdir-start]: https://serverfault.com/questions/818266/runit-does-not-start-a-service
[s6-overlay]: https://github.com/just-containers/s6-overlay
[s6-why]: http://skarnet.org/software/s6/why.html
[supervisord]: http://supervisord.org/
[yelp-dumb-init]:  https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
[fosdem17-s6]:
