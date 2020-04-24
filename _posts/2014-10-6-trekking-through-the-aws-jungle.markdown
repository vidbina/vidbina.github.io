---
layout: post
title:  Trekking Through The Amazon Like a Commando
since:  2014-10-06 07:54
date:   2014-10-14 11:46
type: cloud
category: web
tags:
 - infrastructure
 - cloud
 - paas
 - aws
 - web
 - devops
 - tools
mathjax: true
description: AWS rocks but because of the many services being offered it may feel like a impenetrable jungle at a first glance. This is my take on navigating that jungle using the CLI as my machete.
emojify: true
---
Because I am somewhat of a term hermit, I prefer to have CLI's to do everything
because it makes scripting so much easier.

Amazon offers control over AWS :cloud: through their
[CLI][installing-awscli] that is what this post is all about.

## Setup
This section will cover some of the steps I took to get the AWS CLI running on
my box. I also motivate some of the decisions in the general housekeeping
regiment that I enforce.

I use `virtualenv` to contain my python environments so with the target
environment created `virtualenv ~/env/aws-first-encounter`and selected using
`source ~/env/aws-first-encounter/bin/activate` I can proceed to install the
CLI `pip install awscli`.

Mind you that AWS&rsquo;s CLI expects the ``LANG`` and ``LC_ALL`` env vars to
be set you can basically take care of that by manually exporting the necessary
variables or adding the following snippet to whatever loads whenever you start
your session (.bashrc, .zshrc, .bash_profile or something else&hellip; you
should know).

```bash
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```

After installing the CLI you could confirm that the executable is present
`which aws` and check which version you are rocking with
`aws --version`.

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
 `aws configure`
 5. export your access keys to your env. The AWS CLI tool expects to find the
 `AWS_ACCESS_KEY` and `AWS_SECRET_KEY` variables.

## Usage
After configuring the AWS CLI you are set to configure the services. It makes
little sense to go through the entire feature set in this post (was never my
intention), but just to get you started quickly I have highlighter a few cool
features that may safe you a few clicks.

The CLI syntax is basically

```bash
aws SERVICE COMMAND [ARGS]
```

As simple as that :wink:.

<a name="storage"></a>
### S3
```bash
aws s3 ls
```

<a name="vm"></a>
### EC2
In order to get an overview of all EC2 instances running in your account run
the following command:
```bash
aws ec2 describe-instances
```

#### VPC
You can configure all of your machines to reside within a private cloud which
may expose some of its resources to the web through assigned gateways.
```bash
aws ec2 describe-vpcs
```

<a name="dns"></a>
### Route53
In order to get started a zone needs to be created. In case I would want to
set up a zone for my `bina.me` domain I would execute the following:

```bash
aws route53 create-hosted-zone --name bina.me. --caller-reference DemoDNSZoneSetup
```

After creating the zone, AWS will respond with an identifier for the command.
Most likely the status of our command will be pending at the time the response
is reported through the terminal, but we we can always request a list of all
zones.
```bash
aws route53 list-hosted-zones
```

After creating a zone, we still need to set the records. AWS is friendly enough
to set up SOA and NS records for us. An overview of all resource records for a
zone are acquired by executing the following where `X` is replaced with the
zone id of you want to lookup.
```bash
aws route53 list-resource-record-sets --hosted-zone-id X
```

After creating a zone one might want to [setup `MX`, `CNAME`, `TXT` and other
DNS records][create-record-sets]. The creation or modification of these records
may be done through the use of JSON batch files in the following manner.
```bash
aws route53 change-resource-record-sets --hosted-zone-id X --change-batch file://~/path/to/file.json
```

<a name="dns.mx"></a>
Just to give an example of the structure of the JSON files fed to the CLI I
have published a version of the files I have used on [Github][route53-json-gist]
{% gist vidbina/8322c299faab15477e1c dns.mx.json %}

<a name="dns.txt"></a>
In case you need to verify the ownership of a domain at Google you might want
to setup a text record. AWS Route53 happens to be very picky about the syntax
of the `TXT` strings (the string received by AWS itself needs to be enclosed in
double quotes).
{% gist vidbina/8322c299faab15477e1c dns.txt.json %}

<a name="users"></a>
### IAM
```bash
aws iam list-users
```

[installing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/installing.html
[confing-awscli]: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html
[migrate-dns]: http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html
[create-record-sets]: http://docs.aws.amazon.com/cli/latest/reference/route53/change-resource-record-sets.html
[route53-json-gist]: https://gist.github.com/vidbina/8322c299faab15477e1c
