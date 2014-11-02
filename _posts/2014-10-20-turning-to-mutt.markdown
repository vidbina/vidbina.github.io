---
layout: post
title:  Training the Mutt
since:   2014-10-20 13:01:23
date:   2014-10-23 10:10:34
type: tools
tags:
 - mail
 - messaging 
 - tools
 - tool
 - communications
description: "A return to the most versatile mail client I have ever had the 
pleasure of using after many frustration hours with Google Mail, Apple Mail, 
Sparrow and Airmail"
---
I have tried Mail, Sparrow, Airmail and have now returned back to Mutt
with my tail wagging between my legs, because they all sucked.

I first spend some time cursing and fighting with postfix mail transfer agents.
So fuck it... I am going try simpler alternatives first and work it up from 
there.

## Just Mutt
The build of Mutt that I am playing with at the moment offers support for 
sending and receiving mail without having to set up any other tools. In order 
to quickly get moving let&rsquo;s first examine how we can get a Mutt setup
running without any extra bells and whistles. Without further ado; the simplest
working ```~/.muttrc``` that would be of any use to me:

{% highlight bash %}
set from="vid@bina.me"
set realname="David Asabina"

#set sendmail="/path/to/msmtp"
set use_from=yes
set envelope_from=yes

set imap_user="vid@bina.me"
set imap_pass="`gpg --quiet --for-your-eyes-only -d ~/.mutt/vidbina.gpg`"

set smtp_url="smtp://vid@bina.me@smtp.gmail.com:587/"
set smtp_pass="`gpg --quiet --for-your-eyes-only -d ~/.mutt/vidbina.gpg`"


set folder="imaps://imap.gmail.com:993"
set spoolfile="+INBOX"
set postponed="+[Gmail]/Drafts"

set sort=threads
set editor=vi

source ~/.mutt/colors
{% endhighlight %}

Consult [Andrew&rsquo;s Mutt tutorial][andrew-mutt] in order to get colors set
up on your configuration.

The passwords have not been entered into my ```muttrc``` in plain text but are
decrypted using my private key setup on my box. This requires you to get GPG-ed
up. I have dedicated another post to explaining the GPG basics (the internet
already has plenty of wonderful resources regarding this too).

Set created ```~/.mbox```

## Speed Things Up by Caching
The problem with the simple setup described above is that it requires a 
connection to the IMAP server in order to be of much use to you. Mutt, being
the powerhouse she is, obviously knows a trick or two to resolve that.

With [caching enabled][mutt-caching] we will be able to cache the headers 
and/or messages on our local box by simply setting the ```header_cache``` and 
```message_cache``` variables.

{% highlight bash %}
set header_cache=~/.mutt/hdrs
set message_cachedir=~/.mutt/msgs
{% endhighlight %}

Although caching speeds things up it&rsquo;s is not really the solution for the
travelling hacker. We need to be able to use Mutt while offline too.

## Offline Mailing
Now that there is a working mutt setup one could finetune stuff. For one 
Mutt&rsquo;s native IMAP implementation performs IO somewhat in a blocking 
fashion which freezes up the pup when the connection dissapears. This means 
that it may be time to use something like ```msmtp``` and ```fetchmail``` to
avoid the Mutt quicks.

### Sending mail with ```msmtp```
For sending emails one may use msmtp, ssmtp, sendmail but based on the one the
frustration it just caused me I have decided to listen and go for something 
[simple first][msmtp-mutt]. Mind you that ```msmtp``` does not offer offline
mailing out of the box, we will have to setup a queue for ```msmtp``` if we 
would like this privilege, but having ```msmtp``` running is a start.

```brew install msmtp```

In order to get ```msmtp``` ready to roll we will need to point it to the CA
bundle on our mech. I have used [Adrew&rsquo;s instructions to build my own
pack of certificates][andrews-ssl] stored into the path 
```~/.mutt/ca-bundle.crt```.

{% highlight bash %}
defaults
tls on
tls_starttls on
tls_trust_file ~/.certs/ca-bundle.crt
logfile ~/.mutt/msmtp.log

account vidbina
host smtp.gmail.com
port 587
protocol smtp
auth on
from "vid@bina.me"
user "vid@bina.me"
passwordeval "gpg --quiet --for-your-eyes-only --decrypt ~/.mutt/vidbina.gpg"
{% endhighlight %}

We could call msmtp with the ```--serverinfo``` flag to confirm the settings
make a bit of sense. In my case a prompt appears for my passphrase while GPG
attempts to decrypt my SMTP password, subsequently followed by some of the
server details of the Google server that manages my mail.

{% highlight bash %}
msmtp --serverinfo -a $ACCOUNT
{% endhighlight %}

Mutt does not allow us to run any tools that demand terminal input from the 
user. Which means that the passphrase prompt will not bode well with the 
canine. In order to mitigate this issue we could use ```gpg-agent``` to cache
the token for later use. The agent would then make sure that the ```gpg```
call is provided the proper passphrase and carries on its simple chore.

Lets first ensure that the ```~/.msmtprc``` ```passwordeval``` line no longer
hooks up to a terminal for possible input by changing the last line to
{% highlight bash %}
passwordeval "gpg --quiet --no-tty --for-your-eyes-only --decrypt ~/.mutt/vidbina.gpg"
{% endhighlight %}

In order to [remember the passphrase][gnugpg] we should see to it that the 
```~/.gnupg/gpg.conf``` file contains the ```use-agent``` setting.

Furthermore we will need to ensure that our box knows how to fire up the 
gpg-agent when necessary. The agent needs to know which terminal to work with
and furthermore it will need the ```GPG_AGENT_INFO``` variable to be set.

By appending the following lines to our shell&rsquo;s ```*rc``` file or 
```~/.bash_profile``` we can set the ```GPG_TTY``` (terminal), export it and 
also set the ```GPG_AGENT_INFO``` and ```SSH_AUTH_SOCK``` variables if this 
information is available.
{% highlight bash %}
GPG_TTY=$(tty)
export GPG_TTY

if [ -f "$/tmp/.gpg-agent-info" ]; then
  . "$/tmp/.gpg-agent-info"
  export GPG_AGENT_INFO
  export SSH_AUTH_SOCK
fi
{% endhighlight %}

The previous addition to our shell&rsquo;s configuration depends on the 
```~/.gpg-agent-info``` file. When [starting the ```gpg-agent``` it is also 
possible to instruct the agent to create the needed file][gnu-agent-start].
{% highlight bash %}
gpg-agent --daemon --enable-ssh-support \
  --write-env-file "/tmp/.gpg-agent-info"
{% endhighlight %}

With this setup we will be able to have ```msmtp``` handle our mailing while
keeping our passwords very secret. The only requirement is that we have 
```gpg-agent``` running.

#### Queing outgoing e-mail
Now that ```msmtp``` and mutt play ball {{ ":ball:" | emojify }} it becomes 
time to consider how to deal with outgoing messages when the connection is not 
playing along.

## Receiving mail
```brew install offlineimap```

[msmtp-mutt]: http://www.serverwatch.com/tutorials/article.php/3923871/Using-msmtp-as-a-Lightweight-SMTP-Client.htm
[gmail-mutt]: http://www.bartbania.com/raspberry_pi/consolify-your-gmail-with-mutt/
[mutt-gmail]: https://help.ubuntu.com/community/MuttAndGmail
[andrew-mutt]: http://www.andrews-corner.org/mutt.html#sending
[err-sending-mutt]: http://forum.tinycorelinux.net/index.php?topic=12784.0
[mutt-manual-conf]: http://www.mutt.org/doc/manual/manual-3.html
[archive-mutt]: http://grantlucas.com/posts/2014/01/note-archiving-gmail-messages-mutt
[mutt-caching]: http://dev.mutt.org/doc/manual.html#caching
[mutt-msmtp-password]: https://wiki.archlinux.org/index.php/msmtp
[andrews-ssl]: http://www.andrews-corner.org/mutt.html#ssl
[gnugpg]: https://wiki.archlinux.org/index.php/GPG#gpg-agent
[gnu-agent-start]: https://www.gnupg.org/documentation/manuals/gnupg/Invoking-GPG_002dAGENT.html
