---
layout: post
title:  Trekking Through The Amazon Like a Commando
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
description: AWS rocks but
---
Because I am somewhat of a termrat, I prefer to have CLI's to do everything
because it makes scripting so much easier.

Amazon offers control over the AWS through their [CLI][installing-awscli].

## Setup
This section will cover some of the steps I took to get the AWS CLI running on
my box. I also motivate some of the decisions in the general housekeeping 
regiment that I enforce.

I use ```virtualenv``` to contain my python environments so with the target 
environment created `virtualenv ~/env/aws-first-encounter`and selected using 
`source ~/env/aws-first-encounter/bin/activate` I can proceed to install the
CLI `pip install awscli`.

Mind you that AWS&rsquo;s CLI expects the ``LANG`` and ``LC_ALL`` env vars to
be set you can basically take care of that by manually exporting the necessary
variables or adding the following snippet to whatever loads whenever you start
your session (.bashrc, .zshrc, .bash_profile or something else&hellip; you 
should know).

{% highlight bash %}
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
{% endhighlight %}

After installing the CLI you could confirm that the executable is present
```which aws``` and check which version you are rocking with 
```aws --version```.

### Virtualenv
In order to keep my experiments and project tools contained I use solutions as
rvm (Ruby), virtualenv (Python) or nodeenv (JS). These tools basically prevent
me from installing tools globally when I really only need them on a project
level.

<blockquote>
Note that these solutions are quite different to package managers like bundler,
pip or npm. Package managers usually take care of installing the right 
dependencies, based on a manifest (Gemfile, package.json, etc), into whatever 
may be the default installation path. Determining that default installation 
path and the version of the runtime is generally managed by a run-time
enviroment management tool like rvm, rbenv, virtualenv or nodeenv.
</blockquote>

It may very well be that some projects may need different versions of a
command-line tool. This is where something like *virtualenv* comes in handy. In
the best situation you would basically just have to reload another "virtualenv"
and voilla&hellip; all Python CLI&srquo;s (because virtualenv is used to manage Python
environments) in that env will be up and running like you had them on your last
encounter. Good luck!

## Configuration
Prior to configuring the CLI you will need your user credentials to access AWS.
In case you already have created a user with the proper privileges you could
use the credentials belonging to that user. You could choose to skip step 2 and
3 in the sequence below as long as your do realize that a user without 
permissions is basically a ghost in that it can not do anything, really. Make 
sure to set some permissions for the user you want to sign in to AWS as.

 1. create user in IAM (remember the credentials presented after creation of the
 user as these cannot be presented to you by AWS again)
 2. create an admin group in IAM
 3. add your user to the admin group in IAM
 4. configure your CLI with the user credentials you have received by running 
 ```aws config```

## Usage
After configuring the AWS CLI you are set to configure the services. It makes
little sense to go through the entire feature set in this post (was never my
intention), but just to get you started quickly I have highlighter a few cool
features that may safe you a few clicks.

The CLI syntax is basically

{% highlight bash %}
aws SERVICE COMMAND [ARGS]
{% endhighlight %}

As simple as that {{ ":wink:" | emojify }}.

### S3
{% highlight bash %}
aws s3 ls
{% endhighlight %}
### EC2
### IAM
{% highlight bash %}
aws iam list-users
{% endhighlight %}

[installing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[confing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
