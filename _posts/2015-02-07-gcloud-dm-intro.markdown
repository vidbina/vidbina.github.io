---
layout: post
title:  Spawning Google Cloud Infrastructures with Deployment Manager
since:  2015-01-27 17:37
date:   2015-02-07 21:36
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
description: "How to automate the creation of Google Cloud infrastructures with
the Deployment Manager."
---
Like Amazon's CloudFormation, Google has a solution for the devops fellas and
gals that need to spawn cloud infrastructures at the press of a button.

The beauty of AWS's CloudFormation is that it allows one to treat a
infrastructure setup as a deliverable pretty much in a similar way we consider
source-code a deliverable. Heck, it even allows one to keep track of
infrastructure by checking in templates into your version management tool of
choice (probably git) and managing changes to infrastructures.

## Installing the CLI Tool
The gcloud tool installs some components by default, but as Google Cloud
Deployment Manager is still in alpha, as of Jebruari 2015, one will need to
explicitly install the `preview` component.

Get a proper overview of all components by listing them:

```
gcloud components list
```

Install the developer preview by running the following command and following
the instructions.

```
gcloud components update preview
````

## The Basics
The API of the Deployment Manager is currently at version 2 as of the 27th of
Januari 2015. So instead of the `deployment-manager` command group, the `dm-v2`
group will be used in this post.

The deployment manager knows [configuration files, templates, manifests and
deployments][fundamentals].

A deployment is a collection of resources that one uses to spawn an
infrastructure. Which means, all machines, buckets, databases, networks, load
balancers&hellip; the whole shebang of possible resources that you need.

Deployments are only possible if we there is a configuration. The
configuration basically contains a description of that goodness one needs
spawned. To allow one to structure configurations in a manner that is more
pleasant to the DRY writers, one could use templates within configurations by
simply importing and referencing them.

Manifests are expansions of configurations, and the templates imported within,
that represent the configuration with all variables expanded exactly as it
will be executed.

[fundamentals]: https://cloud.google.com/deployment-manager/fundamentals
[conf-file]: https://cloud.google.com/deployment-manager/configuration-files

### Configuration
Imagine the `example-conf.yaml` file looking like this:

{%highlight yaml %}
resources:
- name: genesis
  type: compute.v1.instance
  properties:
    zone: europe-west1-c
    machineType: zones/europe-west1-c/f1-micro
    disks:
    - deviceName: boot
      type: PERSISTENT
      boot: true
      autoDelete: true
      initializeParams:
        diskName: genesis-bootdisk
        sourceImage: https://www.googleapis.com/compute/v1/projects/coreos-cloud/global/images/coreos-stable-522-5-0-v20150114
      networkInterfaces:
      - network: global/networks/default
- name: bina-docker-images
  type: storage.v1.bucket
{%endhighlight%}

Basically we have a file containing two resources, a `f1-micro` VM instance and
a storage bucket. As a result we can spawn this setup by simply submitting the
configuration description to the deployment manager:

```
gcloud preview dm-v2 deployments list \
  --config example-conf.yaml \
  --deployment blog_post_demo \
  --project bina
```

### Templates
The former example may already simplify workflows enough as is, but somehow
complex infrastructures would be quite an exercise in repeating oneself unless
there is a way to reuse predefined components.

The former resource set could be extracted into a template which will be named
`simple_vm.jinja` for the sake of demonstration. This file will simply
describe a VM instance with pretty much the same properties as the `genesis`
machine demonstrated in our previous example.

{%highlight yaml %}
resources:
- name: {{ env["name"] }}
  type: compute.v1.instance
  properties:
    zone: europe-west1-c
    machineType: zones/europe-west1-c/{{ properties["machineType"] }}
    disks:
    - deviceName: boot
      type: PERSISTENT
      boot: true
      autoDelete: true
      initializeParams:
        diskName: {{ env["name"] }}-bootdisk
        sourceImage: https://www.googleapis.com/compute/v1/projects/coreos-cloud/global/images/coreos-stable-522-5-0-v20150114
      networkInterfaces:
      - network: global/networks/default
{%endhighlight%}

Observe how we use `env["name"]` and `properties["machineType"]` to allow
reuse of the same template whilst providing the flexibility of specifying
just the `machineType` and `name`.

The `env["name"]` attribute refers to the name of the resource as specified in
the configuration file. In the following example this attribute will change as
such to provide the VM's with names held by some remarkable bot specimen
including Optimus Prime, Ultra Magnus, Sentinel Prime and Megatron.

The created disk assigned to the different machines will also be named to bear
the name of the VM it belongs to followed by the appropriate suffix
(`-bootdisk`) which will leave us with the bootdisk `optimus-bootdisk` for the
VM named `optimus`.

The previously described template may be reused by referencing it in the
configuration file.

```yaml
imports: ["simple_vm.jinja"]
resources:
- name: optimus
  type: simple_vm_template.jinja
  properties:
    machineType: n1-highmem-16
- name: megatron
  type: simple_vm_template.jinja
  properties:
    machineType: n1-highcpu-16
- name: ultra
  type: simple_vm_template.jinja
  properties:
    machineType: f1-micro
- name: sentinel
  type: simple_vm_template.jinja
  properties:
    machineType: f1-micro
- name: bina-store
  type: storage.v1.bucket
```

For the sake of demonstration, the bucket has been left in the configuration
file just to demonstrate that our template is used as just another type in our
configuration file. One can use Google Cloud's types and out template types
interchangeably.

Notice that the zone can easily be specified in the configuration file as a
property and referred to from the template as could many other properties.

# Sidenotes

- When using templates ensure the filename ends with a clear extension `.jinja`
  or `.py`. I have tried filenames ending in `.jinja.yaml` in order to help vi
  in determining the syntax for highlighting, but that only confused the
  deployment manager.

[gcloud-dm-conf]: https://cloud.google.com/deployment-manager/configuration-files#listing_available_resource_types
[gcloud-dmconf]: https://cloud.google.com/deployment-manager/configuration-files
