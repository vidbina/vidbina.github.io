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
When working with Docker {{ ":whale:" | emojify }}, just getting different 
containers to play ball together demands the configuration of discovery 
services among other things.  Within the docker scenario this is necessary 
between containers on the same (virtual) machine. Now we need to set up an 
application over a cluster of multiple (virtual) machines. Every machine added 
to the cluster needs to know how to deal with discovery and if at all possible 
we rather would not spend our energy on focussing on the individual (virtual) 
machines.

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
Blah blah

### The Simple Way
Google has made it incredibly easy to setup a Kubernetes cluster at the press 
of a button.

<pre>
gcloud preview container clusters create CLUSTER \
  --machine-type MECH \
  --zone ZONE \
  --project PROJECT
</pre>

This spawns a cluster named `CLUSTER` (choose [abell-2744][abell2744] to test) with 
machines of type `MECH` (which could be `fi-micro` boxes for testing purposes)
located within the `ZONE` zone (I generally enter `europe-west1-c` because 
it is close to home {{ ":wink:" | emojify }}).

For an oveview of the available zones run `gcloud compute zones list` and
for an overview of the machine types within the zone of choice run `gcloud
compute machine-types list --zones ZONE`.

It may be necessary to specify the number of nodes in the cluster using the 
`--num-nodes X` (where `X` obviously represents the number of nodes wanted) 
CLI argument, but by default the gcloud CLI tool will create a cluster of 
three nodes.

### The Rather More Involved Way
It helps to gain a deeper understanding in the way Kubernetes really works.
The [GCE util.sh][kubern-gce-util] file describes the manner in which 
Kubernetes goes about executing the different tasks needed to do its work. It
helps to read through this file to get an idea of how Kubernetes takes care of
its housekeeping. It will help you answer how it determines the project and 
zone, what `kube-up` really does and some other curious questions that you may
ask {{ ":wink: | emojify }}.

For this example we will set up a master and different minions. Instead of
asking Google Cloud to just spawn a cluster for us, we will add these machines
one by one (this should also make it a bit easier to expand the nodepool later
on).

#### Kubernetes Master
Create a Kubernetes master using the [`master.yaml`](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/cloud-configs/master.yaml)
file contributed [Kelsey Hightower][khightower]. This will setup the
Kubernetes API service on port 8080. Just to make things a bit easier, tag the 
machine to allow more flexibility in defining the firewall rules later on.

<pre>
gcloud compute instances create NAME \
  --zone ZONE \
  --image coreos \
  --machine-type MECH \
  --metadata-from-file user-data=master.yaml \
  --tags CLUSTER master
</pre>

I believe it is needless to say that `ZONE`, `MECH` and `CLUSTER` need to be 
filled it by you, but there I said it. For a list of available zones query
`gcloud compute zones list`. Do yourself a favor while you read through this
article and keep all the machines you create within the same zone (it makes 
things easier for now, but you can spread your clusters over multiple zones 
once you understand how things work {{ ":wink:" | emojify }}). For a list of 
available machine types within your selected zone query 
`gcloud compute machine-types list --zone ZONE` and replace `MECH`. Yet again,
do yourself a favor and pick a mech that has more guts then the `f1-micro` 
mech. Be creative with `CLUSTER`. I called mine [Abell 2744][abell2744].

<div class="element">
  <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pandora%27s_Cluster_%E2%80%93_Abell_2744.jpg/600px-Pandora%27s_Cluster_%E2%80%93_Abell_2744.jpg" alt="A picture of Pandora's cluster (cataloged in the Abell index as number 2744) as captured by the Hubble Space Telescope">
</div>

If all is well the previous command should spawn a Kubernetes master. Confirm
that the master machine is up by reviewing the list of running instances 
presented when `gcloud compute instances list --zone ZONE` is queried.

Assuming that the actual ip address of the master machine is substituted 
wherever `IP` is mentioned, one may attempt to execute a call to the Kubernetes
master.

{% highlight bash %}
wget IP:8080 -O-
{% endhighlight %}

If wget hangs on this request, it most likely means that there are no firewall
rules in place to allow your call to hit the actual master server.

Enable traffic to master machines within the infrastructure over port 8080 by
creating a firewall rules.
{% highlight bash %}
gcloud compute firewall-rules create expose-kubernetest-master-api \
  --allow tcp:8080 \
  --target-tags CLUSTER,master
{% endhighlight %}

Note that the target tag enables one to describe firewall rules that apply to
multiple machines without having to specify each machine explicitly. This is 
one of the sweet cons of machine tagging {{ ":smile:" | emojify }}.

After adding the necessary firewall rule one should be able to perform the
previous `wget` call without any problems.

Now that the master is accessible from the internet, one may try to use the
Kubernetes Controller interface to query the amount of nodes on the cluster.

{% highlight bash %}
kubectl get nodes --server=IP:8080
{% endhighlight %}

Some may not have the `kubectl` command available on their machines. It is 
shipped as part of the google-cloud-sdk bundle. If for some reason, this does
not apply use the kubectl.sh which is located in the clusters directory of th
[kubernetes project][kubernetes-git].

#### Kubernetes Minion
A Kubernetes cluster becomes very interesting once we start adding nodes 
(formerly known as minions) to it.

Before creating these nodes we need to replace every occurence of the string
`<master-private-ip>` for the real private ip address of the master.

Using the following command one may simply perform the replacement provided
that `IP` is substituted for the ip address.

{% highlight bash %}
sed -e "s:<master-private-ip>:IP:" node.yaml > /tmp/node.yml
{% endhighlight %}

<pre>
gcloud compute firewall-rules create allow-service-discovery \
  --allow tcp:4001 \
  --target-tags testcluster \
  --source-ranges 10.X/16
</pre>

Now it is time to create the nodes (or minions).
<pre>
gcloud compute instances create NAME \
  --zone ZONE \
  --image coreos \
  --machine-type MECH \
  --metadata-from-file user-data=master.yaml \
  --tags CLUSTER node
</pre>


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

[khightower]: https://github.com/kelseyhightower
[kubernetes-git]: https://github.com/GoogleCloudPlatform/kubernetes
[clusters-list]: http://en.wikipedia.org/wiki/List_of_galaxy_groups_and_clusters
[kubernetes]: http://kubernetes.io/
[abell2744]: http://en.wikipedia.org/wiki/Abell_2744
[kubern-gce-util]: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/cluster/gce/util.sh
[kubern-what-howto]: http://www.centurylinklabs.com/what-is-kubernetes-and-how-to-use-it/
[debian-docker]: https://docs.docker.com/installation/debian/
[kubernetes-coreos]: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos.md
[minions]: http://despicableme.wikia.com/wiki/Minions
[notable-minions]: http://despicableme.wikia.com/wiki/Category:Minions
