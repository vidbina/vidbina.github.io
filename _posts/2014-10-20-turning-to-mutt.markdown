---
layout: post
title:  Training the Mutt
since:   2014-10-20 13:01:23
date:   2014-10-23 10:10:34
category: tools
type: tools
tags:
 - mail
 - messaging
 - tools
 - communications
description: |
  A return to the most versatile mail client I have ever had the pleasure of
  using after many frustration hours with Google Mail, Apple Mail, Sparrow and
  Airmail
emojify: true
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
working `~/.muttrc` that would be of any use to me:

```bash
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
```

Consult [Andrew&rsquo;s Mutt tutorial][andrew-mutt] in order to get colors set
up on your configuration.

The passwords have not been entered into my `muttrc` in plain text but are
decrypted using my private key setup on my box. This requires you to get GPG-ed
up. I have dedicated another post to explaining the GPG basics (the internet
already has plenty of wonderful resources regarding this too).

Set created `~/.mbox`

## Speed Things Up by Caching
The problem with the simple setup described above is that it requires a
connection to the IMAP server in order to be of much use to you. Mutt, being
the powerhouse she is, obviously knows a trick or two to resolve that.

With [caching enabled][mutt-caching] we will be able to cache the headers
and/or messages on our local box by simply setting the `header_cache` and
`message_cache` variables.

```bash
set header_cache=~/.mutt/hdrs
set message_cachedir=~/.mutt/msgs
```

Although caching speeds things up it&rsquo;s is not really the solution for the
travelling hacker. We need to be able to use Mutt while offline too.

## Offline Mailing
Now that there is a working mutt setup one could finetune stuff. For one
Mutt&rsquo;s native IMAP implementation performs IO somewhat in a blocking
fashion which freezes up the pup when the connection dissapears. This means
that it may be time to use something like `msmtp` and `fetchmail` to
avoid the Mutt quicks.

### Sending mail with `msmtp`
For sending emails one may use msmtp, ssmtp, sendmail but based on the one the
frustration it just caused me I have decided to listen and go for something
[simple first][msmtp-mutt]. Mind you that `msmtp` does not offer offline
mailing out of the box, we will have to setup a queue for `msmtp` if we
would like this privilege, but having `msmtp` running is a start.

`brew install msmtp`

In order to get `msmtp` ready to roll we will need to point it to the CA
bundle on our mech. I have used [Adrew&rsquo;s instructions to build my own
pack of certificates][andrews-ssl] stored into the path
`~/.mutt/ca-bundle.crt`.

```bash
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
```

We could call msmtp with the `--serverinfo` flag to confirm the settings
make a bit of sense. In my case a prompt appears for my passphrase while GPG
attempts to decrypt my SMTP password, subsequently followed by some of the
server details of the Google server that manages my mail.

```bash
msmtp --serverinfo -a $ACCOUNT
```

Mutt does not allow us to run any tools that demand terminal input from the
user. Which means that the passphrase prompt will not bode well with the
canine. In order to mitigate this issue we could use `gpg-agent` to cache
the token for later use. The agent would then make sure that the `gpg`
call is provided the proper passphrase and carries on its simple chore.

Lets first ensure that the `~/.msmtprc` `passwordeval` line no longer
hooks up to a terminal for possible input by changing the last line to

```bash
passwordeval "gpg --quiet --no-tty --for-your-eyes-only --decrypt ~/.mutt/vidbina.gpg"
```

In order to [remember the passphrase][gnugpg] we should see to it that the
`~/.gnupg/gpg.conf` file contains the `use-agent` setting.

```bash
# Some line in the gpg conf file
use-agent
```

Furthermore we will need to ensure that our box knows how to fire up the
gpg-agent when necessary. The agent needs to know which terminal to work with
and furthermore it will need the `GPG_AGENT_INFO` variable to be set.

By appending the following lines to our shell&rsquo;s `*rc` file or
`~/.*_profile` we can set the `GPG_TTY` (terminal), export it and
also set the `GPG_AGENT_INFO` and `SSH_AUTH_SOCK` variables if this
information is available.

```bash
GPG_TTY=$(tty)
export GPG_TTY

if [ -f "/tmp/.gpg-agent-info" ]; then
  . "/tmp/.gpg-agent-info"
  export GPG_AGENT_INFO
  export SSH_AUTH_SOCK
fi
```

The previous addition to our shell&rsquo;s configuration depends on the
`/tmp/.gpg-agent-info` file. When [starting the `gpg-agent` it is also
possible to instruct the agent to create the needed file][gnu-agent-start] by
telling the gpg agent to fire up using the following command:

```bash
gpg-agent --daemon --enable-ssh-support \
  --write-env-file "/tmp/.gpg-agent-info"
```

With this setup we will be able to have `msmtp` handle our mailing while
keeping passwords very secret. There will be no need to enter the passphrase
every time gpg gets going. If you do need to enter the passphrase, because
maybe the cache has expired, you will be prompted by a nifty fron-end to
enter the passphrase. This does not interfere with Mutt. The only requirement
is that `gpg-agent` is running.

Note that the terminal used by the gpg-agent stays the same untill the agent
is setup to use another terminal session. This means that you would have to
return to the terminal session within which the agent was setup.

#### Queing outgoing e-mail
Now that `msmtp` and mutt play ball :ball: it becomes
time to consider how to deal with outgoing messages when the connection is not
playing along.

## Receiving mail

Mutt has some ability to retrieve mail but since it wasn't quite designed to
work in a multi-threaded manner large mail-retrieval jobs may render Mutt
unresponsive until retrieval is completed. Tools such as offlineimap allow for
the retrieval of e-mail through cronjobs or manual terminal runs that have no
impact on the responsiveness of Mutt.

<div class="element note">
For Linux distros, one should refer to the relevant package indexes to
determine how to retrieve and install offlineimap for their distribution of
choice. On OSX, one can run `brew install offlineimap` in order to install
offlineimap.
</div>

With offlineimap installed, retrieval becomes as simple as running
`offlineimap` from a terminal.


## Keybindings

As knowing how to operate Mutt is generally down to knowning the
keybindings, I have listed some of the most important bindings in the
sections below. The command to the help page should be listed as the last
property in the topbar when Mutt is open which happens to be `?` in a
default Mutt setup.

### Basic Navigation (from Index)

| keybinding | description                   |
|------------|-------------------------------|
| `k`        | up (vim-like)                 |
| `j`        | down (vim-like)               |
| `]`        | half page down                |
| `[`        | half page up                  |
| `z`        | next page                     |
| `Z`        | previous page                 |
| `*`        | first entry                   |
| `=`        | last entry                    |
| `o` (`O`)  | **o**rder/s**o**rt (reversed) |

### Basic Actions (from Index)

| keybinding | description                    |
|------------|--------------------------------|
| `r`        | **r**eply                      |
| `g`        | **g**roup reply/reply to all   |
| `s`        | **s**ave                       |
| `f`        | **f**orward higlighted message |
| `y`        | send message                   |
| `m`        | new **m**essage                |

### Compose Mode

| keybinding | description          |
|------------|----------------------|
| `^r`       | d**r**afts           |
| `t`        | thread               |
| `h`        | toggle **h**eader    |
| `a`        | **a**ttach           |
| `v`        | **v**iew attachments |
| `d`        | **d**elete file      |
| `u`        | **u**ndelete         |
| `T`        | `T`oggle quoted text |
| `$`        | sync                 |
| `!`        | inbox/spool          |
| `<`        | sent folder          |
| `C`        | **C**opy to folder   |

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
of the feature) :wink:.
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

Mutt's save actualy writes a message to the destination and removes it from
the source location. In that regards _save_ is [more like a typical _move_
command while Mutt's _copy_ command actually writes to the destination and
keeps the original in its source location][mutt-actions-faq].

Since we do not only wish to save the message upon which the cursor
rests but all tagged messages I prepend the archive command with the
_tag-prefix_ operator (which is bound to `;` in the default Mutt setup)

    ;s=Archive

in order to have the command apply to all tagged messages.


Up next I
demonstrate the usage of different patterns in tagging messages. Perhaps you
will choose to archive, perhaps you just want to delete, or maybe even forward.
Mutt can do it all :email:

#### Tagging messages older than 60days
The [_tag-pattern_][pattern] command (default `T`) allows us to tag multiple
messages using a pattern in comparison to _tag-entry_ command (default `t`)
that only allows us to tag the message at the cursor.

The `~d` pattern allows us to specify date conditions and in the next example
I use these features to tag all messages with their date greater than 60 days.

    T\~d\>60d

Obviously I could perform some operation on all these tagged messages as
demonstrated in the previous example :wink:.

    ;s=Archive

#### Tagging all messages from facebook
The `~f` pattern allows us to define a pattern for the sender. If we simply
want to tag all messages coming from Facebook we could use the following
command

    T~ffacebook.com

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

### Forward Messages with Attachments
Pressing the `<Esc>e` combination triggers the `resend-message`
command. There is probably a better way to do this, but it works well enough in
my situation.

## mbox to Maildir conversion

One can use the [`mb2md` tool][mb2md] to convert mbox files to Maildir files in
case this is necessary. Upon tagging multiple messages and writing them to a
given directory that didn't exist e.g.: `;s=Archive.2016`, I happened to find
all tagged emails written to a single mbox file with the name "Archive.2016".
In this case, I had to convert mbox files back into a maildir in order to allow
offlineimap to properly sync them.

```bash
mb2md -s /tmp/new/Archive.2016 -d /tmp/newmail/
```

> Remember to use full paths for source file in order to avoid running into
> `Fatal: Source is not an mbox file or a directory!` errors as documented in
> this [thread][mb2md-err]

## Maildir basics

A **Maildir**[^1] contains:
 - `new` for messages not yet seen by the mail client
 - `cur` for messages already seen by the mail client (messages are moved here
   from "new")
 - `tmp` for temporary messages (that are being drafted, for example)

[^1]: [Maildir][muttmua-maildir] and [MaildirFormat][MaildirFormat]

**Subfolders** in Mailbox terminology are the organizational structures within
a respective mailbox such as "Drafts" and "Sent".

## Links

- [neomuttrc][neomuttrc]
- [The Homely Mutt, Steve Losh][stevelosh]
- [Replacing offlineimap with mbsync][mcgrof]
- [A Quick Guide to Mutt][srobb]
- [Using msmtp with Mutt][msmtp-mutt]


[fwd-attachments]: http://linuxmafia.com/faq/Mail/mutt-forwarding-attachments.html
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
[mutt-patterns]: http://www.mutt.org/doc/manual/manual.html#patterns
[mutt-actions-faq]: http://dev.mutt.org/trac/wiki/MuttFaq/Action
[stevelosh]: https://stevelosh.com/blog/2012/10/the-homely-mutt/#getting-email
[mcgrof]: https://people.kernel.org/mcgrof/replacing-offlineimap-with-mbsync
[neomuttrc]: https://neomutt.org/man/neomuttrc
[srobb]: http://srobb.net/mutt.html
[msmtp-mutt]: https://marlam.de/msmtp/msmtp.html#Using-msmtp-with-Mutt
[gideon-wolfe]: https://gideonwolfe.com/posts/workflow/neomutt/intro/
[bascht]: https://bascht.com/blog/2014/05/28/einstieg-in-mutt-notmuch-offlineimap/
[webgefrickel]: https://www.webgefrickel.de/blog/a-modern-mutt-setup-part-two
[mb2md]: http://batleth.sapienti-sat.org/projects/mb2md/
[mb2md-err]: https://www.linuxquestions.org/questions/linux-server-73/mb2md-problem-891502/
[elho-mutt-md]: http://www.elho.net/mutt/maildir/
[muttmua-maildir]: https://gitlab.com/muttmua/mutt/-/wikis/MuttFaq/Maildir
[muttmua-maildirformat]: https://gitlab.com/muttmua/mutt/-/wikis/MaildirFormat
[maildir]: https://cr.yp.to/proto/maildir.html
[mutt-action]: https://gitlab.com/muttmua/mutt/-/wikis/MuttFaq/Action
[pattern]: https://neomutt.org/guide/advancedusage#3-1-%C2%A0pattern-modifier
