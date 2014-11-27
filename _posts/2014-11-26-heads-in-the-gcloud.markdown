---
layout: post
title:  Heads in the GCloud
since:  2014-11-26 20:03
date:   2014-10-14 11:46
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
mathjax: true
description: 
---
# Installation
I installed ```gcloud``` by cloning the google-cloud-sdk project and running
the install script

```./install.sh```

After the installation I completed my setup by sourcing the ```*.zsh``` (or 
```*.bash``` if you're still on that {{":wink:" | emojify }}) scripts at 
startup.

## Authentication
Google made authentication too easy. By simply running ```gcloud auth login```
you can get your box authenticated by following a link and following a 
surprisingly usage flow. I don't recall having done anything at all -- that is
how easy I felt it was.

## Projects
Google allows you to access multiple projects from the same account. The only
requirement is that you configure the name of your project which should specify
the context.

```gcloud config set project suprstack```

# First machine

 - add link to install gcloud
[installing-gcloud]: http://
