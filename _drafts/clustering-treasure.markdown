---
layout: post
title:  Clustering Treasure
date:   2015-03-25 23:31:51
type:   tools
tags:
 - database
 - store
 - k/v store
 - key value
 - redis
 - nosql
mathjax: true
description: "Setting up Redis clusters in Kubernetes."
---
So, I need a key-value store, I want to able to run it on top
of Kubernetes and I want to be able to resize my cluster without
having to worry much about slaves and nodes. Basically I want
Kubernetes to manage this stuff, and provide me some service
endpoint allowing me to never worry about which box is what.
