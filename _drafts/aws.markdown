---
layout: post
title:  Trekking Through The Amazon
since:  2014-10-06 07:54
date:   2014-10-06
type: tools
category: web
tags:
 - infrastructure
 - paas
 - aws
 - web
 - devops
mathjax: true
description: "Living in AWS"
---
## AWS CLI
Because I am somewhat of a termrat, I prefer to have CLI interfaces to control
the different services that I need/use on a regular basis.

Amazon offers control over the AWS through their CLI.

### Setup
This section will cover some of the steps I took to get the AWS CLI running on
my box. I also motivate some of the decisions in the general housekeeping 
regiment that I enforce.

I use ```virtualenv``` to contain my python environments so with the target 
environment created `virtualenv ~/env/aws-first-encounter`and selected using 
`source ~/env/aws-first-encounter/bin/activate` I can proceed to install the
CLI `pip install awscli`.

Mind you that
{% highlight bash %}
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
{% endhighlight %}

#### Virtualenv
In order to keep my experiments and project tools contained I use solutions as
rvm (Ruby), virtualenv (Python) or nodeenv (JS). These tools basically prevent
me from installing tools globally when I really only need them on a project
level.

<blockquote>
Note that these solutions are quite different to package managers like bundler,
pipi or npm. Package managers usually take care of installing the right 
dependencies, based on a manifest (Gemfile, package.json, etc), into whatever 
may be the default installation path. Determining that default installation 
path and the version of the runtime is generally managed by a run-time
enviroment management tool like rvm, rbenv, virtualenv or nodeenv.
</blockquote>

It may very well be that some projects may need different versions of a
command-line tool. This is where something like *virtualenv* comes in handy. In
the best situation you would basically just have to reload another "virtualenv"
and voilla&hellip; all Python CLI tools installed under that env will be up and
running like you have them on your last encounter. Worst case is of course 
where some other variables in your system changed and things break as miserably
as our current economic model, but that is something you will have to figure 
out on your own. Good luck!

[installing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[confing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

