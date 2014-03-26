---
layout: post
title: Another OAuth Article
description: OAuth explained in what I understand to be Layman&rsquo;s terms. Mind you, I have never met the man.
type: web
tags:
  - web
  - security
  - software
  - engineering
  - computer
  - networking
stylesheets:
  - /play/auth/basic.css
  - /css/animate.css
---
Whilst acting as tech-lead on several web-related projects I find myself 
explaining OAuth ever too often to fellow team members who can read perfectly 
well. 

As far as authentication options go OAuth might be somewhat complex, but it
is not difficult to understand. The complexity is in the different steps.

## Dancing for Hackers
<div class="element game" id="basic-auth-game">
  <div class="client">
    <pre>/ o\  simple demo of Basic auth</pre>
    <pre>\_ /  in a somewhat cheesy way :D</pre>
    <pre>&nbsp;&lt;|</pre>
    <pre>&nbsp;&lt;|</pre>
    <pre>&nbsp;&lt;|</pre>
    <pre>&nbsp;`</pre>
  </div>
  <div class="cable">
  </div>
  <div class="server">
  </div>
  <div class="login_dialog">
    <input class="handle" placeholder="handle"></input>
    <input class="secret" type="password" placeholder="secret"></input>
    <span class="login_button">Login</span>
  </div>
  <script type="text/javascript" src="/play/auth/deps/require.js" data-main="/play/auth/basic.js"></script>
</div>

[rfc-basic-base64]: https://tools.ietf.org/html/rfc2617#page-19
[oauth-rfc]: http://tools.ietf.org/html/rfc5849
[ascii-art]: http://www.geocities.com/spunk1111/small.htm
