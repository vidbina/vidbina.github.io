---
layout: post
title:  Oh GPG
since:   2014-10-20 13:01:23
date:   2014-10-22 10:10:34
type: tools
tags:
 - encryption
 - decryption
 - cryptography
 - security
 - tool
description: "Some GPG tricks everyone should know and master, because 
crypting is something that you should take serious"
---
To encrypt and decrypt my secret messages on my box I use GPG. This post is
hopefully going to jog the memory of senile future me (or just future me on a
day on which I happen to be hammered and need to perform this trick). Perhaps
there is something here that may be of any use to other folks as well 
{{ ":beer:" | emojify }}.

## Encrypt it
In order to lock up a certain piece of information we can simply pipe it into
the ```gpg``` tool and instruct it how to encrypt it and where to store the 
ciphertext. The following command basically encrypts the string ```secret```
and stores the ciphertext into the file ```cipher.gpg```. The recipient 
```vid@bina.me``` as been specified in order to instruct whom is to be able 
to decrypt the ciphertext. For my config files I will be the only person who 
will ever need to know the secret tokens so&hellip; yeah&hellip; secrets should
be encrypted not just `chown`ed.

{% highlight sh %}
sh << EOF
  echo "secret" | gpg -e -r vid@bina.me -o cipher.gpg```
EOF
{% endhighlight %}

## Decrypt it
{% highlight sh %}
gpg -d cipher.pgp
{% endhighlight %}

## The Agent
Sometimes one may fire up an application that may need to make multiple calls
to encrypted resources. Decrypting all the data every time would present a most
annoying passphrase prompt every darn time.

The agent allows you to enter the passphrase once within a session and will
remember and handle the passphrase dance for as long as the passphrase happens
to persist in the cache. In the case of mutt that might mean happy mailing for
two hours straight and entering a passwords only once. Pretty sweet 
{{ ":smile:" | emojify }}.

The entire agent business works in the following manner:

  - invoke the agent daemon (which runs in the background, presents the 
  passphrases for keys it has stored in cache and prompting you for the 
  passphrase it hasn't yet stored)
  - set up a terminal to act as the front-end

### Simplified
In order to simplify this entire process I have written a small shell script
to handle all of the daemon summoning and front-end spawning work.

Running ```start-gpg-agent``` checks if the info file doesn't yet exist and 
then spawns the daemon.

Basically I use the helper ```make-gpg-tty``` to configure my current terminal
as the GPG-Agent front-end. Mind you that you should only configure one 
terminal as the front-end in order to avoid weird {{ ":shit:" | emojify }}. 
That is why ```make-gpg-tty``` stores the agent terminal number to a file and
only links the current terminal as the front-end if there has not already been
another terminal linked for this chore.

In order to disconnect my current terminal I can use ```unmake-gpg-tty``` and
if I want to stop the GPG-Agent I could run ```stop-gpg-agent```.

<script src="https://gist.github.com/vidbina/bde1495a6d2a047ada09.js"></script>


[invoke-gpg-agent]: https://www.gnupg.org/documentation/manuals/gnupg/Invoking-GPG_002dAGENT.html
