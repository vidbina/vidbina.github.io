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

This Azure site will provide the instructions necessary to continue, but 
basically upon downloading the _publishsettings file_, one may import it into 
the Azure setup using the following command:

```bash
azure account import FILENAME
```
After importing the file observe that the output of the `azure account list`
command now reflects the presence of a subscription that corresponds  to 
whatever you just downloaded.
