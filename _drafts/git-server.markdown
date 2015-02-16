---
layout: post
title: Go Git Em!
description: Reiterating and finally documenting my simple git server setup strategy
type: tools
date: 2014-01-13 18:27
tags:
 - code
 - tools
 - servers
 - cloud
 - storage
---

I use git for keeping track of all my code-related junk. Gradual changes,
experiment branches, etc&hellip; everything is gitted. From time to time, I
need to deploy a codebase. Sometimes I use Github, sometimes Bitbucket and
sometimes I just need a bare git repository on a the client&rsquo;s private
cluster. Wherever the repository ends up, I will need the luxury of pulling 
from it, pushing to it and beating it to my heart&rsquo;s desire. This posts
is my attempt at summarizing what I do to set up my git repository on a 
private infrastructure.

## Messy Bugs
Some stuff that you may run into while setting up your git server, at least
some issues that I ran into have been named and solved beneath. Hopefully it
solves your {{ ":shit:" | emojify }}, if not&hellip; godspeed on your
quest for answers.

### Upon push to the remote you get Connection refused
{% highlight bash %}
ssh: connect to host  port 22: Connection refused
fatal: The remote end hung up unexpectedly
{% endhighlight %}

This has to do with the URI being supplied in the incorrect format, as 
mentioned in [a answer on StackOverflow][con-ref-so]. Correct URI syntax for 
git is either ```user@host:/path/to/file``` or 
```ssh://user@host/path/to/file.git```. Mind you that these paths are absolute 
paths. I generally set up friendly paths by placing a symlink at the root of 
the filesystem, pointing to something in the user&rsquo;s home directory. 

### Git-upload-pack not found
Make sure that ```git``` is installed on the server prior to looking for 
culprits elsewhere.

<!--
Yet again StackOverflow succeeds in providing a [fast answer][git-upload-pack-so].
We're basically setting up a ssh connection to the host and expect the host to
pick up the git-related magic from that moment onward, however; not going into
ssh-interactive mode by default does not load all the env vars that the system
needs to resolve for command paths.


If you ensure that ```/etc/ssh/sshd_config``` has been configured to allow
user environments by setting&hellip;

```
PermitUserEnvironment yes
```

&hellip;we can proceed to dump the result of ```env``` into ```~/.ssh/environment```.
-->


[con-ref-so]: http://stackoverflow.com/questions/7425455/git-ssh-connection-refused-with-the-following-format
[git-upload-pack-so]: http://stackoverflow.com/questions/11128464/git-upload-pack-command-not-found
