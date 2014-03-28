---
layout: post
title: Another Auth Article
description: My take on different auth strategies available in what I consider to be Layman&rsquo;s terms. Mind you, I have never met the man.
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

As far as authentication options different flavors are available for those
wo want to be picky, and as always there is no single right answer for many
problems. Based on you requirements, required time-to-market you may want to 
choose one option over the other.

## The Thing About Auth

For the sake of keeping things complete I need to point out the difference 
between _authentication_ and _authorization_.

Authentication has to deal with the _is this agent realy who it says it is?_
question, while authorization seeks to answer _is this agent allowed to do
what it is trying to do?_.

A real-life analogy could be found on airports. Airports have authentication 
procedures in place to confirm that the passport is not forged and that the 
person at the counter is really the feller or gal on the passport. 
After authentication you are allowed to enter the terminal en route
to your flight. Authorization takes place at multiple points. First of all
the passenger is not walking around with a employee badge which effectively
denies the passenger access to certain areas in the airport. Furthermore, 
the passenger has to be authorized to board an airplane after presenting the 
ground steward or stewardess the proper documents (boarding pass and passport).

As you see _who am I_ and _what may I do_ are the two different questions which 
authentication and authorization should be able to answer.

## Keeping it Simple &dash; Basic
As far as authentication goes, Basic is the simplest way to a quick victory.
We supply the system a handle and a secret (username and password) and it 
grants or denies us access with the given credentials.

The steps in Basic auth as as follows:

 - the client requests the handle and secret (credentials)
 - the client prepares a request including the auth details
 - the client sends the request to the server
 - the server receives the request
 - the server searches for a match for the given credentials
 - the server executes the request if the credentials are matched and places the results into a prepared response
 - the server sends the response to the client

<div class="element game" id="basic-auth-game">
  <div class="server"></div>
  <div class="cable"></div>
  <div class="client"></div>
  <div class="login_dialog">
    <input class="handle" placeholder="handle"></input>
    <input class="secret" type="password" placeholder="secret"></input>
    <span class="login_button">Login</span>
  </div>
  <script type="text/javascript" src="/play/auth/deps/require.js" data-main="/play/auth/basic.js"></script>
</div>

## Dancing for Hackers (OAuth)

OAuth might be somewhat complex, but it is not difficult to understand.
The complexity is in the different steps.

###

 - get authorization grant from resource owner
 - obtain access token with authorization grant
   - scope
   - duration

[rfc-basic-base64]: https://tools.ietf.org/html/rfc2617#page-19
[oauth-rfc]: http://tools.ietf.org/html/rfc5849
[ascii-art]: http://www.geocities.com/spunk1111/small.htm
[oauth-bearer]: http://tools.ietf.org/html/rfc6750
[stripe-auth]: https://stripe.com/docs/api/curl#authentication
