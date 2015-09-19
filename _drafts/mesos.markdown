---
layout: post
title: Marathon
since: 2015-06-29 20:11
date: 2015-09-19 21:10
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
description: "Mesos"
---
It's only during flights that I really have time to read some papers that have
been on my to-read list for a while. This time I'm reading the Mesos paper, 
just to get up to speed on the design philosophy before I set out to design a Mesos infrastructure for one of my clients.

# What Is It?
Is It A Bird, Is It A Plane... Enough of the cheesy references, just to get to
business... Mesos is a task scheduler for clusters.

It's imaginable that you may have a Mongo cluster doing some magic, a Hadoop cluster running some logging jobs, a Cassandra cluster running some MapReduce jobs and maybe a Kubernetes cluster to park webservices packaged into cute 
little containers -- It's a hypothetical use-case so what the hell 
{{ ":fire" | emojify }}. The problem with the use-case is that every cluster
requires exactly that... A cluster of its own. From a utilization and 
localization perspective this is often far from ideal.

# Running jobs in Mesos

Running a 100 seconds job in Mesos:

{% highlight bash %}
mesos-execute \
  --master=$MASTER \
  --name="a_mesos_job" \
  --command="sleep 100"
{% endhighlight %}

Runs without a framework. After execution the job is considered finished and we're done.

Running the same job through marathon, however; provides us with extra management functionality as in easily scaling, suspending and resuming the task.

In fact, Marathon is started as a task in Mesos. Starting a job in marathon drops you down a dream level (to use Inception vernacular)

https://giphy.com/gifs/inception-WhaiKgvZvsypW
Your machine

http://giphy.com/gifs/inception-P8kSizJGuPwfm
Your VM. You connected to your instance in the cloud or the kitten purring in virtualbox)

http://giphy.com/gifs/inception-n2hJQFhZZ7RTy
Mesos. Where the Mesos tasks are fired up. This is where the Marathon starts.

<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A6s543KncTsc2rJtMd6kJ8v" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>

<a href=http://www.cinemablend.com/new/An-Illustrated-Guide-To-The-5-Levels-Of-Inception-19643.html><img src=http://www.cinemablend.com/images/news/19643/_1280109452.jpg></a>

https://www.youtube.com/watch?v=ginQNMiRu2w

[hindman]: https://www.cs.berkeley.edu/~alig/papers/mesos.pdf
