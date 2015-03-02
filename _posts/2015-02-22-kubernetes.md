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
### The Simple Way
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

<!--
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

{% highlight bash %}
gcloud compute instances create kubergenesis --machine-type MECH --project PROJECT --zone ZONE
{% endhighlight %}

Do yourself a favor and do not pick the `f1-micro` machine type. If you need to
build the Kubernetes release on this box you will run into memory allocation 
problems. Not surprisingly so, we only have about 0.60 GB available on that 
box.

After getting the box spawned connect to it using the following command:
{% highlight bash %}
gcloud compute ssh kubergenesis --zone ZONE
{% endhighlight %}

Once inside the machine, it will be necessary to get the kubernetes source in
order to build the controller project.
{% highlight bash %}
git clone https://github.com/GoogleCloudPlatform/kubernetes.git
{% endhighlight %}

On Ubuntu 14:14
{% highlight bash %}
sudo apt-get install git docker.io
# visit https://golang.org/dl/ and wget one of the latest stable gzipped tarballs
wget LATEST_STABLE_GO_FOR_LINUX.tar.gz
tar -C /usr/local -vzf LATEST_STABLE_GO_FOR_LINUX.tar.gz
git clone https://github.com/GoogleCloudPlatform/kubernetes.git
sudo usermod -a -G docker USER
# log out and in again
cd kubernetes; ./build/release.sh
{% endhighlight %}

blah



{% highlight bash %}
sudo apt-get update
sudo apt-get install git-core
sudo apt-get install build-essential
git clone https://github.com/GoogleCloudPlatform/kubernetes.git

cd kubernetes

wget https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz
sudo tar -C /usr/local -xvf go1.4.2.linux-amd64.tar.gz
sudo sh -c 'echo "export PATH=$PATH:/usr/local/go/bin" >> /etc/profile'

sudo sh -c 'echo "deb http://http.debian.net/debian wheezy-backports main" >> /etc/apt/sources.list'
curl -sSL https://get.docker.com/ | sh

sudo gpasswd -a $USER docker
sudo service docker restart

cd kubernetes
make release
{% endhighlight %}
Setting up [Docker on Debian][debian-docker]...

#### CoreOS
{% highlight bash %}
gcloud compute instances create NAME --zone ZONE --image coreos --machine-type MECH --metadata-from-file user-data=master.yaml

sed -e "s:<master-private-ip>:10.240.235.105:" kubernetes_cloud/node.yaml > /tmp/1.yml
{% endhighlight %}

{% highlight bash %}
cd kubernetes
./build/run.sh hack/build-cross.sh
{% endhighlight %}
-->

#### Another Attempt
Create a Kubernetes master using the `master.yaml` file. This will setup the
Kubernetes API service on port 8080. Furthermore, the machine may be tagged to 
allow more flexibility in defining the firewall rules later on.
{% highlight bash %}
gcloud compute instances create NAME \
  --zone ZONE \
  --image coreos \
  --machine-type MECH \
  --metadata-from-file user-data=master.yaml
  --tags CLUSTER,master
{% endhighlight %}

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
  --allow tcp:8080
  --target-tags CLUSTER,master
{% endhighlight %}

Note that the target tag enables one to describe firewall rules that apply to
multiple machines without having to specify each machine explicitly. This is 
one of the sweet cons of machine tagging {{ ":smile:" | emojify }}.

After adding the necessary firewall rule one should be able to perform the
previous `wget` call without any problems.

Now that the master is accessible from the internet, one may try to use the
Kubernetes Controller interface to query the amount of pods on the cluster.

{% highlight bash %}
kubectl get pods --server=IP:8080
{% endhighlight %}

Some may not have the `kubectl` command available on their machines. It is 
shipped as part of the google-cloud-sdk bundle. If for some reason, this does
not apply use the kubectl.sh which is located in the clusters directory of th
[kubernetes project][kubernetes-git].

sed -e "s:<master-private-ip>:IP:" kubernetes_cloud/node.yaml > /tmp/node.yml

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

[kubernetes-git]: https://github.com/GoogleCloudPlatform/kubernetes
[clusters-list]: http://en.wikipedia.org/wiki/List_of_galaxy_groups_and_clusters
[kubernetes]: http://kubernetes.io/
[abell2744]: http://en.wikipedia.org/wiki/Abell_2744
[kubern-gce-util]: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/cluster/gce/util.sh
[kubern-what-howto]: http://www.centurylinklabs.com/what-is-kubernetes-and-how-to-use-it/
[debian-docker]: https://docs.docker.com/installation/debian/
[kubernetes-coreos]: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/coreos.md
[minions]: http://despicableme.wikia.com/wiki/Minions
