---
layout: post
title: Marathon Dreamin'
since: 2015-06-29 20:11
date: 2015-09-19 21:10
category: cloud
type: cloud
tags:
 - cloud
 - computing
 - infrastructure
 - PaaS
 - orchestration
 - devops
 - tools
#mathjax: true
description: "Like Inception, devops land is just a matter of setting up and
controlling dreams within dreams, environments within environments and here is
my silly analogy."
emojify: true
---
It's weekend... so I allow myself this silly post. Every time, I play around
with Mesos, Marathon and/or Kubernetes I feel like I'm the star in my very own
Inception adventure[^1].

**Disclaimer**: Only continue if you can stand bull:shit:ing at this
moment. The music should get you in the mood while reading :wink:.

<div class="element giphy">
<iframe src="//giphy.com/embed/jJlxbQAAe52YU" width="480" height="172" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>

[^1]: Before 2010 (premiere of Inception) it happened to be The Matrix :sunglasses:

<div class="element spotify">
<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A6s543KncTsc2rJtMd6kJ8v" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
</div>

## Level 0
<div class="element giphy">
<iframe src="//giphy.com/embed/oVgysSNiyJhFm" width="480" height="172" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>

Some call this reality. Some believe this is also just dream. If that were
true I figure we'd probably call the dreamer god. Anyways, I just turn on my
computer at this level. Nothing fancy yet.

## Level 1
<div class="element giphy">
<iframe src="//giphy.com/embed/WhaiKgvZvsypW" width="480" height="235" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>
Computer is on. I'm plugged in (sorry for the Matrix reference, don't want to
confuse).

## Level 2
<div class="element giphy">
<iframe src="//giphy.com/embed/P8kSizJGuPwfm" width="480" height="235" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>
<!--<iframe src="//giphy.com/embed/Ad6e8Zt89thq8" width="480" height="172" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>-->
At this level, I enter my VM, being an instance in the cloud or the kitten
purring in Virtualbox (`vagrant up; vagrant ssh`).

## Level 3
<div class="element giphy">
<!--<iframe src="//giphy.com/embed/ufNsKPi0a8b60" width="480" height="172" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>-->
<iframe src="//giphy.com/embed/n2hJQFhZZ7RTy" width="480" height="235" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>

Mesos, the place where the frameworks are fired up, drops us one notch deeper
down the dream pipeline.

One could start a task that lasts at least 10 seconds in Mesos.

```bash
mesos-execute --master=$MASTER --name="envie" --command="echo env; sleep 10"
```

This task would run as a framework (a short-lived one at that).

By visiting the Marathon portal (most likely running on port 5050 on the Mesos
master), navigating to the frameworks view and selecting the most recently
terminated framework (provided that the 10 seconds have already expired :wink:)
one can enter the job's sandbox o observe the output to `stderr` and `stdout`.

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/mesos-frameworks-envo.png" alt="The Mesos frameworks view allows one to observe running and terminated frameworks">
</div>

Mesos jobs are executed from the directory and environment in which the
`mesos-execute` command is called. In `stdout` we expect to see something that
resembles `env` on the Mesos slave.

## Level 4

Marathon is started as a Mesos framework, which drops us down another level.
Upon adding another Marathon job, the framework (being Marathon) manages the
environment in which the call is executed.

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/mesos-marathon-add-envo.png" alt="Adding a Marathon job">
</div>

By adding a Marathon job that echoes `env` and observing the `stdout`
from the task's sandbox one can verify that the `env` differs from the host's.

Selecting the task's sandbox and opening the task's `stdout` (both screens
portrayed in the following figures) allows us to introspect `stdout` for the
task of interest.

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/mesos-jobs-envo.png" alt="The mesos portal allows one to get into the job's sandbox">
</div>

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/mesos-sandbox-envo.png" alt="A look inside the Mesos sandbox allows one to view the job's stderr and stdout">
</div>

[marathon-rest]: https://mesosphere.github.io/marathon/docs/rest-api.html

Marathon provides us with extra management functionality as in easily scaling,
suspending and resuming of jobs. That is why it makes sense to start jobs from
Marathon instead of firing them directly into Mesos. We run frameworks in
Mesos, we run jobs in Marathon (which is a framework)... that simple.

## Limbo
<div class="element giphy">
<iframe src="//giphy.com/embed/ZAv0VrzFL29k4" width="480" height="235" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
<!--<iframe src="//giphy.com/embed/FQJVySekdnR4s" width="480" height="172" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>-->
</div>
If you made it this far, thank you so much for your time.

Enough of the Inception :shit: (err junk or analogy), you may say at this stage.
I don't even fully remember what Inception was all about other than some
convoluted mess involving nested dreams; after all 2010 is a lifetime ago (for
a toddler it actually is).

All I wanted to say is: Mesos rocks, Marathon rocks and life is good.

For now... more [Inception junk][inception-info] for the weekend.
Have a good one :tropical_drink:

<div class="element image">
  <a href="https://www.cinemablend.com/new/An-Illustrated-Guide-To-The-5-Levels-Of-Inception-19643.html">
    <img src="https://www.cinemablend.com/images/news/19643/_1280109452.jpg" alt="Illustrated guide to the 5 levels of inception">
  </a>
</div>

<div class="element video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/ginQNMiRu2w" frameborder="0" allowfullscreen></iframe>
</div>

<!--<div class="element giphy">
  <iframe src="//giphy.com/embed/rI6cEnQqGILIs" width="480" height="274" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>-->

[inception-info]: http://neomam.com/blog/10-mind-blowing-inception-infographics/
[hindman]: https://www.cs.berkeley.edu/~alig/papers/mesos.pdf
