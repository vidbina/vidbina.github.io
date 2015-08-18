---
layout: post
title:  Let's Go
date:   2015-08-18 14:08:89
type: tools
tags:
 - go
 - golang
 - tools
 - code
 - software
 - back-end
description: "Just working with Go"
---
In order to work with Go packages, one will need to setup a `GOPATH` 
environment variable which contains the path to the directory one intents to 
use with Go.

After specifying the `GOPATH` variable, don't forget to append `$GOPATH/bin`
to `PATH`.

For my different go projects, I often specify a `GOPATH` directory within my 
project's working directory. This way I can keep my `GOPATH`'s for different
projects separated.

{% highlight yaml %}
project_directory
 - src
 - gopath
{% endhighlight %}

[gopath]: http://golang.org/cmd/go/#hdr-GOPATH_environment_variable
