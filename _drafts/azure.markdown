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
azure vm create VM_DNS_NAME 2b171e93f07c4903bcad35bda10acf22__CoreOS-Stable-647.2.0 \
 -l "West Europe" \
 -vm-size "Small" \
 --ssh 22 \
 -g yoda -p "The force 1 use must."
```
Azure will put some elves and gnomes to work to setup your machine under the 
endpoint `SOME_FUNKY_NAME.cloudapp.net`.

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
