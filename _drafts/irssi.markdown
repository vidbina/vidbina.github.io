---
layout: post
title: Irssi Primer
since: 2015-02-28 13:43
date: 2015-02-28 21:20
type: tools
category: tools
tags:
 - irssi
 - irc
 - chat
description: "Reminding myself how to use irssi again..."
---

> `Meta` is generally configured to the `Alt` key :wink:.

|Shortcut|Description|
`Meta`+`n`|scroll up
`Meta`+`p`|scroll down
`Meta`+left<br/>`Ctrl`+`p`|previous window
`Meta`+right<br/>`Ctrl`+`n`|previous window
`Meta`+`N`|goto window `N`

Windows

[irssi-win-split]: http://quadpoint.org/articles/irssisplit/
An excerpt from the [doc][basic-ui-usage] may be helpful for reference's sake
:wink:.

```
Meta-1, Meta-2, .. Meta-0 - Jump directly between windows 1-10
Meta-q .. Meta-o          - Jump directly between windows 11-19
/WINDOW <number>          - Jump to any window with specified number
Ctrl-P, Ctrl-N            - Jump to previous / next window
```

[basic-ui-usage]: https://irssi.org/documentation/startup/#basic-user-interface-usage

# Freenode

Testing

{% highlight bash %}
wget http://crt.gandi.net/GandiStandardSSLCA.crt
{% endhighlight %}

{% highlight bash %}
openssl x509 -inform der -outform pem < /usr/share/ca-certificates/gandi.net/GandiStandardSSLCA.crt > GandiStandardSSLCA.pem
{% endhighlight %}

{% highlight bash %}
/server add \
  -auto \
  -ssl \
  -ssl_cacert /etc/ssl/certs/GandiStandardSSLCA.pem \
  -network freenode irc.freenode.net 6697 \
  -autosendcmd "/msg NickServ IDENTIFY $NICK $PASSWORD; wait 2000;"
{% endhighlight %}


    /join $CHANNELNAME

## Selecting Window

    /window 1



    /window new split

## Change Window 
Ctl-p Ctl-n Atl-ARROW 

    /window next
    /window prev


[irssi-guide]: http://quadpoint.org/articles/irssi/
[irssi-arch]: https://wiki.archlinux.org/index.php/Irssi
[irssi-commands]: http://www.geekshed.net/commands/user/
[irssi-screen]: http://carina.org.uk/screenirssi.shtml#10
[irssi-window]: https://quadpoint.org/articles/irssi/#hilight-window
[irssi-ssl]: https://pthree.org/2010/01/31/freenode-ssl-and-sasl-authentication-with-irssi/
[irc-hidejoin]: http://wiki.xkcd.com/irc/Hide_join_part_messages
