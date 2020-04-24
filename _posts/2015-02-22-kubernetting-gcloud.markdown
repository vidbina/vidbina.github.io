---
layout: post
title:  Kubernetting Google's Cloud
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
 - kubernetes
mathjax: true
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    section: Dev-Ops
description: "First encounters in setting up and using a Kubernetes cluster on Google Cloud"
redirect_from:
  - /web/kubernetes/
emojify: true
---
Kubernetes allows one to orchestrate cloud resources in an elegant fashion,
specifically... by allowing one to interact with a single point of entry to the
cluster and instructing through this interface how to allocate the different
resource within. Basically, talk to your cloud and have it manage your compute
containers.

<blockquote>
Things like ensuring that 5 instances of a worker remain operational at all
times are some of the things that Kubernetes makes easy. This post serves
as a Note-to-Self to the future me fiddling to get a nice setup of my services
online.
</blockquote>

At the time of writing (Februari 2015) the Google Cloud container API is still
in alpha. So :shit: will most likely change, but I have a
hunch that underlying principles will remain largely the same.

#Introduction
Kubernetes introduces a layer or more of abstraction to devops hackers. The
idea is to address the entire infrastructure as a single unit. Kubernetes
helps us in orchestrating our cloud.

There is quite a bit of housekeeping required to get a cluster up and running.
When working with Docker :whale:, just getting different
containers to play ball together demands the configuration of discovery
services among other things.  Within the docker scenario this is already
a bit of a hassle between containers on the same (virtual) machine. Setting up
an application over a cluster of multiple (virtual) machines will require a bit
more work obviously.

Every machine added to the cluster needs to know how to deal with discovery
and if at all possible we rather would not spend our energy on focussing on
the individual (virtual) machines, because you don't want to have to remember
what every machine does. Let the cluster take care of its own housekeeping
:house:.

<div class="element image">
  <img src="/resources/devops/kubernetes/basic-setup.svg" alt="The components involved in a basic Kubernetes setup">
</div>

With a master, Kubernetes offers us a entry point into the black box we call
our cloud.

The master runs the _interface_ service (`kube-apiserver`) which accepts all
commands we issue. The _discovery_ service, `etcd`
specifically, enables the services to fetch necessary configurations from
a central location.
The _scheduling_ service assigns work to different nodes in the cluster (e.g.:
determining on which machines which workload is to be executed based on current
workload and other properties).
The _management_ service (which is in fact the Kubernetes replication
controller) enforces that the specified requirements for workunits are honored
(.e.g.: when one have requested N instances of a worker and some become
unhealthy, the replication-controller sees to it that these workers are killed
and new instances are spawned to keep the requested count of services up).
The _registration_ service deals with registering Kubelets with the Kubernetes
master.

<blockquote>
In the traditional CoreOS setup, for instance, one sets up `etcd` to replicate
the store content among the different machines in the cluster, but the
Kubernetes case simply uses a single box for the store. Yes, this does mean that the
Kubernetes benefits disappear with the master going offline.
</blockquote>

I could dive into the ins and outs of every service in the diagram above, but
the good fellas and gals at DigitalOcean have a [clear writeup on the different
Kubernetes components][kubern-intro].

The nodes run a _management_ service (`kubelet`) which stays in touch with the
master and maintains the workload to be executed on the node. The _networking_
service provides the necessary plumbing to handle network in a
Kubernetes-friendly manner (basically every node on a Kubernetes network
requires its own subnet, `flannel` sees to it that Kubernetes has the impression
that this is the case). The _proxy_ service takes care of ensuring that
requests are mapped to corresponding container endpoints. Last, but definitely
not least the _containerization_ service takes care of facilitating the running
of containers on our node(s).


Scattered across the nodes, the actual (virtual)
machines, Kubernetes spawns, monitors and kills the specified pods which are
the atoms in the Kubernetes universe. Pods, being the smallest deployable units
in the Kubernetosphere, are collections of containers so there may be multiple
containers operating in a pod. All the containers within a pod share the same
volumes, the networking namespace, ip- and port space (to simplify
communication between containers within the pod). In
[the section on pods](#pods), I discuss a use-case which describes how one may
utilize such pods.

## Create Cluster
For this example we will set up a master and different minions. Instead of
asking Google Cloud to just spawn a cluster for us, we will add these machines
one by one (this should also make it a bit easier to expand the nodepool later
on).

<!--
### All-in-one Google Solution
Although still in alpha, Google has a nifty way of setting up a cluster. I'll
mention it here for the sake of keeping stuff complete, but I find the old
fashion way of spawning a cluster more useful anyways because it is a universal
approach.

```bash
gcloud preview container clusters create CLUSTER \
  --machine-type  MECH \
  --zone ZONE \
  --project PROJECT \
  --num-nodes N
```
-->

### Spawn a Master
Create a Kubernetes master using the [`master.yaml`](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos/cloud-configs/master.yaml)
file contributed [Kelsey Hightower][khightower]. This will setup the
Kubernetes API service on port 8080. Just to make things a bit easier, tag the
machine to allow more flexibility in defining the firewall rules later on.

```bash
gcloud compute instances create NAME \
  --zone ZONE \
  --image coreos \
  --machine-type MECH \
  --metadata-from-file user-data=master.yaml \
  --tags CLUSTER master
```

I believe it is needless to say that `ZONE`, `MECH` and `CLUSTER` need to be
filled it by you, but there I said it. For a list of available zones query
`gcloud compute zones list`. Do yourself a favor while you read through this
article and keep all the machines you create within the same zone (it makes
things easier for now, but you can spread your clusters over multiple zones
once you understand how things work :wink:). For a list of
available machine types within your selected zone query
`gcloud compute machine-types list --zone ZONE` and replace `MECH`. Yet again,
do yourself a favor and pick a mech that has more guts then the `f1-micro`
mech. Be creative with `CLUSTER`. I called mine [Abell 2744][abell2744].

<div class="element image">
  <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pandora%27s_Cluster_%E2%80%93_Abell_2744.jpg/600px-Pandora%27s_Cluster_%E2%80%93_Abell_2744.jpg" alt="A picture of Pandora's cluster (cataloged in the Abell index as number 2744) as captured by the Hubble Space Telescope">
</div>

If all is well the previous command should spawn a Kubernetes master. Confirm
that the master machine is up by reviewing the list of running instances
presented when `gcloud compute instances list --zone ZONE` is queried.

Assuming that the actual ip address of the master machine is substituted
wherever `IP` is mentioned, one may attempt to execute a call to the Kubernetes
master.

```bash
wget IP:8080 -O-
```

If `wget` hangs on this request, it most likely means that there are no firewall
rules in place to allow your call to hit the actual master server.

Enable traffic to master machines within the infrastructure over port 8080 by
creating a firewall rules.

```bash
gcloud compute firewall-rules create expose-kubernetest-master-api \
  --allow tcp:8080 \
  --target-tags CLUSTER,master
```

Note that the target tag enables one to describe firewall rules that apply to
multiple machines without having to specify each machine explicitly. This is
one of the sweet cons of machine tagging :smile:.

After adding the necessary firewall rule one should be able to perform the
previous `wget` call without any problems.

Now that the master is accessible from the internet, one may try to use the
Kubernetes Controller interface to query the amount of nodes on the cluster.

```bash
clusters/kubectl.sh get nodes --server=IP:8080
```

Some may not have the `kubectl` command available on their machines which may
be used as a replacement for `clusters/kubectl.sh` in the previous example. It
is shipped as part of the google-cloud-sdk bundle. If for some reason, this
does not apply use the kubectl.sh which is located in the clusters directory of
the [kubernetes project][kubernetes-git] you may have to modify your path a
bit depending on your working directory.

### Spawn a Minion
A Kubernetes cluster becomes very interesting once we start adding nodes
(formerly known as minions) to it.

Before creating these nodes we need to replace every occurence of the string
`<master-private-ip>` for the real private ip address of the master.

Using the following command one may simply perform the replacement provided
that `IP` is substituted for the ip address.

By using `sed` to replace the token for the IP address in mind, we ensure that
we have every occurence of the phrase substituted.

```bash
sed -e "s:<master-private-ip>:IP:" node.yaml > /tmp/node.yml
```

In order to allow our cluster machines to communicate through etcd (all minions
need to communicate with the master in order) one can set up a firewall rule
that applies to machines bearing the given target tag (this is why I love
tagging my machines).

```bash
gcloud compute firewall-rules create allow-service-discovery \
  --allow tcp:4001 \
  --target-tags CLUSTER \
  --source-ranges 10.X/16
```

Now it is time to create the nodes (or minions).

```bash
gcloud compute instances create NAME \
  --image coreos \
  --machine-type MECH \
  --zone ZONE \
  --metadata-from-file user-data=/tmp/node.yaml \
  --tags CLUSTER node
```

For `NAME` one may enter one or multple machine names (I chose the names of
three Minion resulting to `NAME` being substituted with `dave kevin stuart`).
For testing purposes one may select a `f1-micro` or `g1-small` mech, while
picking a zone close to home :wink:.

{% if false %}
## View Cluster
At the moment one can quickly obtain a list of Kubernetes clusters in Google
Cloud by listing all the known clusters in a given project.

```bash
gcloud preview container clusters list --project PROJECT
```
{% endif %}

## <a href="#pods"></a>Pods
Kubernetes performs work in pods. Pods are collections of containers may be
bundled together for several reasons.

Imagine a web worker, that receives content and performs some operation on it.
You could seperate that into a web worker, which focusses on merely handling
the incoming request, and a processor which focusses on performing that
operation that we want to execute.

 - The web worker receives text while the processor scans the text to
 determine the sentiment of the submittor or whether the text has been
 plagiarized.
 - The web worker receives an audio sample while the processor filters the
 sample to flag it whether the secret phrase ("open sesame") is used, or
 simply just filter to eliminate non-vocal sound.
 - The web worker receives a video while the processor filter the fragment to
 blur out faces, license plates and nudity.

For several reasons we could decide to run
both on the same computation unit as the web worker could fetch and store the
data for processing upon which the processor picks up the data and does its
magic. Gosh, would it be great if these services could share their storage
volumes? Within a pod they do :wink:.

## Service with A Smile
Now that we have the plumbing in place we need to start pumping some fluids
through the pipelines. Kubernetes allows us to define pods which execute the
work we need done.

## Start Pod

Kubernetes introduces the notion of pods as a unit for describing services that
may require replication over the cluster.
One can easily start a pod in Kubernetes

```bash
gcloud preview container pods create --name NAME --zone ZONE --image=IMAGE --replicas=N
```

## Start Services

In order to create a nginx server one could run:

```bash
gcloud preview container kubectl --zone ZONE run-container NAME --image=IMAGE --replicas=2
gcloud preview container pods create --name my-nginx --zone ZONE --image=IMAGE --replicas=N
```

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
calls such as `gcloud preview container pods create --help`.

## Stop Services

```bash
gcloud preview container kubectl --zone ZONE get pods
gcloud preview container pods list --zone ZONE
```

{% if false %}
## Create a Private Docker Registry

In order to run a a private docker registry within the Kubernetes cluster, I
will need to define the containers which will serve the registry requests and
the storage bucket which will host the images.

Creating the storage bucket is as simple as
{% endif %}

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
[kubern-intro]: https://www.digitalocean.com/community/tutorials/an-introduction-to-kubernetes
[kubern-workshop]: https://github.com/kelseyhightower/intro-to-kubernetes-workshop
