---
layout: post
title:  Digging for Answers
date:   2015-06-03 17:36:33
type:   tools
category: tools
tags:
 - DNS
 - devops
 - tools
 - cli
 - unix
 - linux
mathjax: true
description: "Some things to remember whenever using `dig` to find
DNS-related answers."
---
Just updated my AWS Route 53 records, but they haven not propagated yet. How
do I review the results of a DNS lookup?

Perform a `dig` lookup while specifying the DNS server to query.

```bash
dig @SERVER_TO_ASK DOMAIN_TO_LOOKUP [options]
```

The following snippet displays the `dig` request I issued in order to discover
what Amazon's Route 53 was serving right after I edited some records. Yes, it
will take some time for this information to propagate, but you can always ask
the authoritative DNS servers directly, which saves the wait.

```bash
dig @ns-1245.awsdns-27.org something.bina.me ANY
```

[q10]: http://anouar.adlani.com/2011/12/useful-dig-command-to-troubleshot-your-domains.html
[dig-rackspace]: http://www.rackspace.com/knowledge_center/article/using-dig-to-query-nameservers
