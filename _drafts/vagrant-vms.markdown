---
layout: post
title:  Vagrant Machines
since:  2014-10-14 16:58
date:   2014-10-14 11:46
type: tools
category: tools
tags:
 - infrastructure
 - cloud
 - web
 - devops
 - tools
mathjax: true
description: Setting up dev infrastructures on the fly with Vagrant
---

I have been playing around with different solutions for running code in 
contained environments. In order to simplify the workflow between 
more-than-one-head-strong developing units one may find these convenient.
Currently I am working on the toolbox that [Suprnovae][supr] will use in the
development of all upcoming products.

AWS and Google Cloud are among the many options that I am playing around with, however;
in some cases I just need local boxes to test situations.

<a name="users"></a>
{% highlight bash %}
ssh-add ~/.vagrant.d/insecure_private_key
{% endhighlight %}

[vagrant-coreos]: https://coreos.com/docs/running-coreos/platforms/vagrant/
[vagrant-boxes]: http://docs-v1.vagrantup.com/v1/docs/boxes.html
[supr]: http://supr.nu
