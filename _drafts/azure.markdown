---
layout: post
title: Azure Skies
since: 2015-06-02 18:10
date: 2015-06-02 18:10
type: cloud
tags:
 - cloud
 - computing
 - infrastructure
 - PaaS
 - IaaS
 - Microsoft
 - devops
 - tools
mathjax: true
description: "A glance into the world of cloud computing from the Microsoft
aisle"
---
For a client, I recently had to setup a cluster on Microsoft's Azure. This post
discusses some of the steps I took in setting up my environment and spawning
resources. Almost in a similar to the manner in which I once discussed
[Trekking Through the Amazon Like a Commando][aws-post] (AWS) and [Heads in
the Gcloud][gce-post] (Google Cloud). It's always interesting to know how to
get things done on different platforms.

[aws-post]: http://vid.bina.me/web/trekking-through-the-aws-jungle/
[gce-post]: http://vid.bina.me/web/heads-in-the-gcloud/

# Installation
Azure has a [repository on Github][git-azure-cli] which contains the codebase
for the npm package one may install. The [installation instructions] for
different platforms are covered on Azure site, but basically running an
`npm install` should do the job.

```bash
npm install -g azure-cli
```
[git-azure-cli]: https://github.com/azure/azure-xplat-cli
[azure-cli]: https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/

# Setup
The easy way to get setup is by downloading a _publishsetting file_ from
Microsoft.

```bash
azure account download
```

This will direct you to Microsoft's portal where you will need to supply the
live credentials that are subscribed to some Azure service.

This Azure site (or [Microsoft's Open Tech site][mso-azure-cli]) provides some
instructions necessary to continue, but basically upon downloading the
_publishsettings file_, one may import it into the Azure setup using the
following command:
```bash
azure account import FILENAME
```
After importing the file observe that the output of the `azure account list`
command now reflects the presence of a subscription that corresponds  to
whatever you just downloaded.

More information on connecting the Azure CLI with your subscriptions are
available from the [Azure documentation site][cli-connect].
[cli-connect]: https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-connect/
# Creating Resources

## Creating VM's
### ASM Mode
The best way to figure out what the options here are is by taking a look at
the possibilities presented after querrying `azure vm --help`.

By running `azure vm image list` I'm presented with a list of available images
to install in a VM. By running `azure vm image show IMAGENAME` I'm presented the
details regarding the image of interest which exposes details such as the
available regions for this image, its size and the recommended VM, among other
properties.

You could run the following command in order to study the details of that
specific CoreOS stable release:

```bash
azure vm image show 2b171e93f07c4903bcad35bda10acf22__CoreOS-Stable-647.2.0
```
Hopefully after running `azure vm --help` you already have some idea of the
commands used to create and delete instances. We use `azure vm create` to spawn
new instances in Azure.

```bash
azure vm create $NAME $IMAGE \
 -l "West Europe" \
 --vm-size "Small" \
 --ssh 22 \
 -g yoda -p "The force 1 use must."
```
Azure will put some elves and gnomes to work to setup your machine under the
URL `$NAME.cloudapp.net`, substituting `$NAME` for whatever the real name was.

### In ARM Mode
VM's may also be provisioned in _arm_ mode, which exposes more functionality.
In _arm_ mode it is much easier to setup NIC's, virtual networks and the
contained subnets.

```bash
vm sizes --location "West Europe"
```

which gives a detailed overview of all available [sizes][vm-sizes] within a
given region ("West Europe" in my case).

In the following scenario a VM is created that uses a NIC that has been created
before.

```bash
azure vm create --resource-group $GROUP \
  --name $NAME \
  --location "$REGION" \
  --os-type Linux \
  --image-name $IMAGE \
  --ssh-publickey-pem-file $CERT_FILE \
  --admin-username $USER \
  --vm-size $SIZE \
  --nic-name $NAME-nic-a \
  --vnet-name "$VNET" \
  --vnet-subnet-name "$SUBNET" \
  $EXTRA
```

> Within the _manage.windowsazure.com_ portal, my machines, created in _arm_
mode don't appear while they are visible when I use the new portal
_portal.azure.com_. It may probably have something to do with me not reading
the documentation properly, but in the very least it isn't too obvious what is
actually going on here.

[vm-sizes]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-size-specs/

## Exposing Stuff
After creating a VM one will need to expose the machine through endpoints

Explore the current endpoints by running

```bash
azure vm endpoint list VM_DNS_NAME
```

If `ssh` has been specified during the creation of the machine, a ssh endpoint
will be present in the returned output.

Connect to your box using

```bash
ssh yoda@VM_DNS_NAME.cloudapp.net
```
.

> One may ssh into VM by using [keys][vm-keys] instead of passwords. Which
requires the `-t CERTIFICATE` option to be set when creating the VM (`azure vm
create`).

> Create a certificate using the following commands:

> ```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out cert.pem
chmod go-rwx private.key
```

> Running `chmod` removes read and execute permissions for other users on the
key, because we are the only ones who have any business owning access to the
key.

> Once the VM has been provisioned with the generated certificate, ssh into
the box using the generated key. The combination of the certificate on the
other side and the key on the user side will take care of authentication.

> ```bash
ssh yoda@VM_DNS_NAME.cloudapp.net -i private.key
```

[vm-keys]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-ssh-key/
[vm-pwdless]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-use-root-privileges/

[cli-overview]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-command-line-tools/
[vm-connect]: https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-how-to-log-on/


As of late, I have been doing moving a lot of my cloud-related weights with
CoreOS. Getting CoreOS setup on Azure is
[azure-coreos]: https://coreos.com/docs/running-coreos/cloud-providers/azure/
[mesos-docker]: https://medium.com/@gargar454/deploy-a-mesos-cluster-with-7-commands-using-docker-57951e020586

## Using Custom Domains
Most likely it will not suffice using the `*.cloudapp.net` domain for your
production setup, so let us set up the fictional custom domain `jedi.order` as
we're running devops for the Jedi Order and we need to do things right. If we
want Yoda to scold us not.

It must be noted prior to starting that the domain is registered somewhere and
most likely the registrar has already provided its DNS servers to allow the
look-up of `jedi.order` endpoints.

### CNAME
The simplest way out with a DNS server already in existence for the domain of
interest is to [setup CNAME records][dns-fwd-azure] for the apps. CNAME records
basically work like aliases, allowing you to instruct your DNS server to
return `that-app-on-azure.cloudapp.net` whenever someone requests
`freshman-trials.jedi.order` everytime someone.
<blockquote>
You don't need to understand the nitty gritty of DNS name resolution, but
basically whenever a lookup call is places, DNS servers keep querying their
peers within whichever hierarchy they are subjected to until someone returns a
sensible answer. At the end of the entire circus, all DNS servers listen to the
authoritative DNS server for the `jedi.order` domain which will have to be your
DNS server, whether you host it yourself or have it hosted by your registrar.
</blockquote>

### Azure DNS
The use of Azure DNS requires a subscription to use the _Microsoft.Network_
resource provider. We need to switch the Azure Resoruce Management mode in order
to get this done by running

```bash
azure config mode arm
```

The [Azure documentation covers how to get started with Azure DNS][azure-dns]
and the CLI help pages are
[azure-dns]: https://azure.microsoft.com/en-us/documentation/articles/dns-getstarted-create-dnszone/


Many of the following commands require a resource group. One can view the
available resource groups using:

```bash
azure group list
```

If it is necessary to create a resource group use the following command,
replacing `GROUP` and `LOCATION` for your chosen resource group name and your
wanted location (run `azure location list` for a list of the valid locations
for a given service).

```bash
azure group create \
  --name GROUP \
  --location LOCATION
```

After creating the resource group, create a dns zone in the newly created
group. Use a valid domain name you manage for `DOMAIN`. If you manage the
`yoda.order` domain, try using `experiment.yoda.order` or some other subdomain
for this example. Use the tags as a grouping mechanism as resources are
selectable by tags which makes things as bulk deletion of created resources
simple.

```bash
azure network dns-zone create \
  --resource-group GROUP \
  --name DOMAIN \
  --tags "setup"
```

> In order to create DNS zones on Azure, the subscription must be registered
to the _Microsoft.Network_ namespace.

> ```bash
azure provider register Microsoft.Network
```

> When running `azure vm create` in _arm_ mode, one has different options
available. This is something to be mindful of.

For example, the _asm_ `azure vm create` command

> ```bash

```

becomes the following in _arm_ mode

> ```bash
azure vm create -g mesos-sandbox -n ruben -l "West Europe" -y Linux -q 2b171e93f07c4903bcad35bda10acf22__CoreOS-Stable-647.2.0 -M resources/ssh/try.pem -u yoda -z Small
```

> ```bash
azure provider register Microsoft.Storage
```
After creating the DNS zone, Azure will setup the NS records for the newly
created resource set. You can confirm this by running
`azure network dns-record-set list` which will report `NS` records with the
name `@` (which basically serves as an alias for whatever you entered as
`DOMAIN`). The following command will display the actual nameservers assigned
by Microsoft to serve DNS requests for the newly created dns zone.

```bash
azure network dns-record-set show \
  --resource-group GROUP \
  --dns-zone DOMAIN \
  --name @ \
  --type NS
```

In order to get properly setup, setup your NS records at your registrar to
reflect the output listed by the `dns-record-set show` command previously
executed. Generally there will be about 4 DNS servers from microsoft that will
serve DNS calls for you zone.

# Problems
## Authentication Failed

```bash
error:   Authentication failed. The 'Authorization' header is not present or provided in an invalid format.
info:    Error information has been recorded to /Users/david/.azure/azure.err
error:   resource list command failed
```
This problem basically has to do with some features only being available to
organization ids as explained on [this thread on Github][github-xplat-liveid].

[github-xplat-liveid]: https://github.com/Azure/azure-xplat-cli/issues/1231
[xplat-cli]: https://azure.microsoft.com/en-us/documentation/articles/xplat-cli/

[mso-azure-cli]: https://msopentech.com/blog/2014/08/07/azure-cross-platform-cli-tools/
[mso-freebsd-vm]: https://msopentech.com/blog/2014/05/14/deploy-customize-freebsd-virtual-machine-image-microsoft-azure/
[dns-fwd-azure]: https://support.microsoft.com/en-us/kb/2990804

[azure-arm]: https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-azure-resource-manager/

# Mesos

```bash
sudo docker run -d \
  -e SERVER_ID=1 \
  -e ADDITIONAL_ZOOKEEPER_1=server.1=1.1.1.1:2888:3888 \
  -e ADDITIONAL_ZOOKEEPER_2=server.2=1.1.1.1:2888:3888 \
  -e ADDITIONAL_ZOOKEEPER_3=server.3=1.1.1.1:2888:3888 \
  -p 2181:2181 \
  -p 2888:2888 \
  -p 3888:3888 \
  garland/zookeeper
sudo docker run --net="host" \
  -p 5050:5050 \
  -e "MESOS_HOSTNAME=${HOST_IP}" \
  -e "MESOS_IP=${HOST_IP}" \
  -e "MESOS_ZK=zk://${HOST_IP}:2181/mesos" \
  -e "MESOS_PORT=5050" \
  -e "MESOS_LOG_DIR=/var/log/mesos" \
  -e "MESOS_QUORUM=1" \
  -e "MESOS_REGISTRY=in_memory" \
  -e "MESOS_WORK_DIR=/var/lib/mesos" \
  -d \
  garland/mesosphere-docker-mesos-master
sudo docker run \
  -d \
  -p 8080:8080 \
  garland/mesosphere-docker-marathon --master zk://${HOST_IP}:2181/mesos --zk zk://${HOST_IP}:2181/marathon
sudo docker run -d \
  --entrypoint="mesos-slave" \
  -e "MESOS_MASTER=zk://${HOST_IP}:2181/mesos" \
  -e "MESOS_LOG_DIR=/var/log/mesos" \
  -e "MESOS_LOGGING_LEVEL=INFO" \
  garland/mesosphere-docker-mesos-master:latest
```
[azure-dns]: https://channel9.msdn.com/Events/Ignite/2015/BRK3473
