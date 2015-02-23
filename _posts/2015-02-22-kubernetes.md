---
layout: post
title:  Kubernetes on Google Cloud 101
since:  2015-02-22 11:49
date:   2015-03-07 21:36
type: cloud
category: web
tags:
 - infrastructure
 - cloud
 - paas
 - google
 - web
 - devops
 - tools
 - orchestration
mathjax: true
description: "First encounters in setting up and using a Kubernetes cluster on Google Cloud"
---
Kubernetes allows one to orchestrate a cluster of containers in an elegant 
fashion, specifically... by allowing one to talking to the cluster and 
instructing it how to allocate the different containers it needs to run. 

Things like ensuring that 5 instances of a worker remain operational at all 
times are some of the things that Kubernetes makes possible. This post serves
as a Note-to-Self to the future me, fighting to get a nice setup of my services
online.

At the time of writing (Februari 2015) the Google Cloud container API is still
in alpha. So {{ ":shit:" | emojify }} will most likely change, but I have a 
hunch that underlying ideas and principles will remain somewhat the same.

#Introduction
Kubernetes introduces a layer or more of abstraction to devops hackers. The 
idea is to address the entire infrastructure as a unit. Kubernetes allows us
to talk to our cloud.

There is quite a bit of housekeeping required to get a cluster up and running.
When working with Docker {{ ":whale:" | emojify }}, just getting different containers to play ball 
together demands the configuration of discovery services among other things.
Within the docker scenario this is necessary between containers on the same
(virtual) machine. Now we need to set up an application over a cluster of 
multiple (virtual) machines. Every machine added to the cluster needs to know
how to deal with discovery and if at all possible we rather would not spend our
energy on focussing on the individual (virtual) machines.

With a master and several nodes, Kubernetes offers us a control panel into the
black box we call our cloud. Scattered accross the nodes, the actual (virtual)
machines, Kubernetes spawns, monitors and kills the specified pods which are 
the atoms in the Kubernetes universe.

Pods, being the smallest deployable units in the Kubernetosphere, are 
collections of containers. There may be multiple containers operating in a pod,
all these containers are spawned from the same image, share the
same volumes and share the networking namespace, ip- and port space (to 
simplify communication between containers within the pod).

## Create Cluster
Google has made it incredibly easy to setup a Kubernetes cluster at the press 
of a button.

{% highlight bash %}
gcloud preview container clusters create CLUSTER -m MECH -z ZONE --project PROJECT
{% endhighlight %}

This spawns a cluster named `CLUSTER` (choose [`abell-2744`](abell2744) to test) with 
machines of type `MECH` (which could be `fi-micro` boxes for testing purposes)
located within the `ZONE` zone (I generally enter `europe-west1-c` because 
it is close to home {{ ":wink:" | emojify }}).

For an oveview of the available zones run `gcloud compute zones list` and
for an overview of the machine types within the zone of choice run ```gcloud
compute machine-types list --zones ZONE```.

It may be necessary to specify the number of nodes in the cluster using the 
`--num-nodes X` (where `X` obviously represents the number of nodes wanted) 
CLI argument, but by default the gcloud CLI tool will create a cluster of 
three nodes.

## View Cluster
At the moment one can quickly obtain a list of Kubernetes clusters in Google 
Cloud by listing all the known clusters in a given project.

{% highlight bash %}
gcloud preview container clusters list --project PROJECT
{% endhighlight %}

## Start Pod
Kubernetes introduces the notion of pods as a unit for describing services that
may require replication over the cluster.
One can easily start a pod in Kubernetes 
{% highlight bash %}
gcloud preview container pods create --name NAME --zone ZONE --image=IMAGE --replicas=N
{% endhighlight %}

## Start Services
In order to create a nginx server one could run:
{% highlight bash %}
gcloud preview container kubectl --zone ZONE run-container NAME --image=IMAGE --replicas=2
gcloud preview container pods create --name my-nginx --zone ZONE --image=IMAGE --replicas=N
{% endhighlight %}

Basically this spawns a replication controller, which manages the docker 
service(s) it is instructed to run. In the current example a simple nginx 
server is setup. The replication controller just keeps an eye out over the 
containers and ensures that the two services run. Upon failure necessary steps
will be taken.

The cool thing about Kubernetes is that we can specify the amount of replicas
to keep alive. A replication controller is setup by Kubernetes to ensure that
the two replicas are running at all times. If any service suffers from a 
health failure, the replication controller will see to it that another instance
is spawned.

Google has made exposed some `kubectl` features to be accessible through other
calls such as ```gcloud preview container pods create --help```.

## Stop Services
{% highlight bash %}
gcloud preview container kubectl --zone ZONE get pods
gcloud preview container pods list --zone ZONE
{% endhighlight %}

## Create a Private Docker Registry
In order to run a a private docker registry within the Kubernetes cluster, I 
will need to define the containers which will serve the registry requests and 
the storage bucket which will host the images.

Creating the storage bucket is as simple as

[clusters-list]: http://en.wikipedia.org/wiki/List_of_galaxy_groups_and_clusters
[kubernetes]: http://kubernetes.io/
[abell2744]: http://en.wikipedia.org/wiki/Abell_2744
