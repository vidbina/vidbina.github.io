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

if [ -f "/tmp/.gpg-agent-info" ]; then
  . "/tmp/.gpg-agent-info"
  export GPG_AGENT_INFO
  export SSH_AUTH_SOCK
fi
{% endhighlight %}

The previous addition to our shell&rsquo;s configuration depends on the 
```/tmp/.gpg-agent-info``` file. When [starting the ```gpg-agent``` it is also 
possible to instruct the agent to create the needed file][gnu-agent-start]. By
telling the gpg agent to fire up.

{% highlight bash %}
gpg-agent --daemon --enable-ssh-support \
  --write-env-file "/tmp/.gpg-agent-info"
{% endhighlight %}

With this setup we will be able to have ```msmtp``` handle our mailing while
keeping our passwords very secret. The only requirement is that we have 
```gpg-agent``` running.

Note that the terminal used by the gpg-agent is fixed, meaning that you would
have to return to the buffer (when in tmux), tab or terminal window within 
which this call was first made.

#### Queing outgoing e-mail
Now that ```msmtp``` and mutt play ball {{ ":ball:" | emojify }} it becomes 
time to consider how to deal with outgoing messages when the connection is not 
playing along.

## Receiving mail
```brew install offlineimap```

## Navigation
One important thing about tools like mutt is knowing how to work the controls.

Below I have listed some of the default controls for Mutt. I would recommend
looking through the help page of Mutt. The command to the help page should be
listed as the last property in the topbar when Mutt is open which happens to be
`?` in a default Mutt setup.

 - `k` up
 - `j` down
 - `r` **r**e
 - `g` **g**roup reply/reply to all
 - `s` **s**ave
 - `f` **f**wd
 - `y` send message
 - `^r` d**r**afts
 - `m` new **m**essage
 - `o` s**o**rt/**o**rder (`O` reversed version)
 - `t` thread
 - `h` toggle **h**eader
 - `a` **a**ttach
 - `v` **v**iew attachments
 - `d` **d**elete file
 - `u` **u**ndelete
 - `z` next page
 - `Z` previous page
 - `T` `T`oggle quoted text
 - `\]` half down
 - `\[` half up
 - ```$``` sync
 - ```*``` first
 - ```=``` last
 - ```!``` inbox/spool
 - ```<``` sent folder
 - ```C``` **C**opy to folder

At some places I will refer to Mutt functions in
_italics_ in which case one should be able to find that entry as a literal 
string in the second column of the help page. Let's assume that I refer to the
Mutt command _search_ which is printed in italics. You can

 1. type `/` to start searching (by default `/` should be bound to the _search_ 
 command) then
 2. type the italicized string (`search` in this case) followed by 
 3. enter

and Mutt should get you to the line that explains it all (1st column is the
keystroke, 2nd column the command name and 3rd column represents a description
of the feature) {{ ":wink:" |emojify }}.
You could repeat this search by pressing `n` which is bound to _search-next_ by
default.

## Tricks
Mutt allows you to quickly perform some operations on batches of emails that
would have required multiple clicks with other clients. In order to get this
trick it is absolutely convenient to be aware of the different 
[patterns][mutt-patterns] and the tagging functionality of mutt.

### Archiving tagged messages
One could tag messages by stepping through the list page and tagging individual
messages using the _tag-entry_ function (bound to the `t` key, if you sport a 
default Mutt setup).

One can save a message to the archive by entering 

    s=Archive
    
where `s` is bound to the _save-message_ command in the default configuration 
of mutt.

Since we do not only wish to save the message upon which the cursor 
rests but all tagged messages I prepend the archive command with the 
_tag-prefix_ operator (which is bound to `;` in the default Mutt setup)

    ;s=Archive

in order to have the command apply to all tagged messages.


Up next I 
demonstrate the usage of different patterns in tagging messages. Perhaps you
will choose to archive, perhaps you just want to delete, or maybe even forward.
Mutt can do it all {{ ":email:" | emojify }}

#### Tagging messages older than 60days
The _tag-pattern_ command (default `T`) allows us to tag multiple 
messages using a pattern in comparison to _tag-entry_ command (default `t`) 
that only allows us to tag the message at the cursor. 

The `~d` pattern allows us to specify date conditions and in the next example 
I use these features to tag all messages with their date greater than 60 days.

    T\~d\>60d

Obviously I could perform some operation on all these tagged messages as 
demonstrated in the previous example {{ ":wink:" | emojify }}.

    ;s=Archive

#### Tagging all messages from facebook
The `~f` pattern allows us to define a pattern for the sender. If we simply
want to tag all messages coming from Facebook we could use the following
command

    T~f Facebook

#### Tagging all messages with certain keywords
In this example I check for message content and want all messages that contain
any of the following keywords _facebook_, _twitter_, _instagram_, _vimeo_ or 
_youtube_ to be tagged.

    Tfacebook|twitter|instagram|vimeo|youtube

### View open message in browser
Many of the messages that I receive are formatted in HTML. Mutt fortunately
can pipe your messages into any viewer/pager/browser of your choice (provided
you can pipe data into it).

By default Mutt has `|` bound to the _pipe-message_ command which would allow 
me to pipe my email into w3m for easier viewing

    |w3m -T text/html

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
[mutt-patterns]: http://www.mutt.org/doc/manual/manual.html#toc4.2
