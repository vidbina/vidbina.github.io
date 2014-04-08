---
layout: post
title:  Animating Mr. Washee Washee (My Version of the Laundr Story)
date:   2014-03-08 13:11:89
type: start-up
tags:
 - engineering
 - start-up
 - entrepreneurship
 - experiment
 - mobile
 - back-end
description: "Laundr picks up, cleans and delivers your suits when you want it, where you want it. This article chronicles the events as I experienced them. Conception, first app shipment and first actual delivery."
---

I believe it has been a month and a half since this idea has been floating 
around in the [Port][port]&hellip; a month ago {{":ghost:" | emojify }} (I just 
undusted this post from my dusty drafts collection). Orgeon came up with the 
bit, got the [Saddl][saddl] fellers all too much excited about the concept 
and that is how the ball started rolling.

The idea: Offer a qualitative suit dry cleaning service to blue collar workers 
allowing user-specified pickup and delivery times and locations. Qualitative 
as in, people should dare entrust us their expensive suits.
{{ ":necktie:" | emojify }} {{ ":package:" | emojify }}

The advantage: Don&rsquo;t ever worry about heading to the dry cleaners 
yourself again. Now you can spend even more time stuck in your (awesome) office 
(in the summer), having one less excuse to head out to catch a fresh whiff 
of air {{ ":innocent:" | emojify }}.

<div class="element">
  <img 
    src="/resources/startup/laundr/landing_page_20140309.png" 
    alt="Laundr Landing Page">
</div>

## The short version

<ol class="timeline">
<li class="label">Week 1<!-- week 3 of 2014 --></li>
<li>Orgeon starts getting people excited about the idea</li>
<li>Saddle digs the idea and jumps in</li>
<li class="label">Week 2<!-- week 4 of 2014 --></li>
<li>The fellers start talking with people (local high-end tailors, laundromats and businessmen) about the idea</li>
<li>The Saddl team gets some UI ideas going {{ ":iphone:" | emojify }}</li>
<li>I start working on a simple Node.js back-end {{ ":construction:" | emojify }}</li>
<li class="label">Week 3</li>
<li>Get at much work done for Laundr in between the other gigs I&rsquo;s eloquently juggling</li>
<li>Jump on the plane at the beginning of the weekend for a two week break {{ ":sunrise:" | emojify }}</li>
<li class="label">Week 6<!-- week 8 --></li>
<li>Break is over {{ ":rage:" |emojify }}, I start working on the web app (Cordova and Angular are my tools of choice for this mission)</li>
<li class="label">Week 7<!-- week 9 --></li>
<li>The Saddl fellers join the development effort to help {{ ":muscle:" | emojify }} out with front-end issues leaving us with a development team at last</li>
<li>First version of the app is ready for shipment (some issues still pending, but it works well enough to get started)</li>
<li class="label">Week 10<!-- week 12 --></li>
<li>Bumped the version to 0.0.2, we have testing the app for a while now. Fuck it, we should just ship it! {{ ":shipit:" | emojify }}</li>
<li class="label">Week 11</li>
<li>First pickup and delivery {{ ":gift:" | emojify }}</li>
<li class="label">Week 12<!-- week 14x --></li>
<li>Submit app to the Apple app store</li>
</ol>

## Lessons Learned
The following points are things I consider learned lessons for the next 
experiment. Most of the lessons learned during this experiment should assist
me in being even _lean-er_ the next time I attempt another one such experiment.

### Waiting for a Minor Cog
We were setting up a pickup-and-delivery service with a plus -- we were adding
a extra service between the pickup and delivery. As such the service is 
already elaborate enough to be tested apart from the form intended to use in 
communicating with our end-user. After all, the app is just a small cog in the
machine.

We spend at least 2 weeks waiting for an app. Two weeks within which we could
have taken orders by phone {{ ":phone:" | emojify }} or e-mail 
{{ ":computer:" | emojify }}, heck we even could have used plain ol' text 
messages to get the ball rolling.

Quick analysis attributed the higests riscs to the the third-party service 
(the washing) and the logistics (pick-up and delivery). Because we've partnered
up with the good fellers from [Saddl][saddl] the logistics part is pretty much
covered, making our only real risc the laundromats we're planning to work with.
Our situation got us to the point where we had an app running before
we started to actually discover the pains in morphing the service into a 
well-oiled machine -- before we picked up our first suit. Not to say that 
isn't a solution, but my 2 cents say it would have been even better if we had
made a couple of pickups and deliveries while still having the app in the oven.

I learned never to mistake an app for the product again, if it isn't. Even if
team members aren't convinced of the plausibility of testing without a channel
of lesser importance to the general service. I believe the biggest issue began
with thinking of the app as a irreplaceable part of the service while it is
simply a medium. We could have been able to claim with certainty how the 
entire flow worked by the time the app was available. We didn't, but bet 
your ass that I will make sure of it that things work differently the next 
time.

### Experimenting During Production
Playing with new ideas and toys is best left to be done in the experimental 
projects executed by the R&D dept's of the world. Somehow we still managed to 
utilize a pre-alpha framework in the mobile webapp being developed. Due to 
major updates during the course of development, documentation inconsistencies 
and some minor bugs, we were set back quite an amount of time in development as 
we sought to resolve these issues.

We were using [Ionic][ionic] and honestly, I love it. My only regret is that
I didn't adequately account for the riscs in getting acquianted with a new
framework, especially something as volatile as a alpha release product, in our 
time-to-market estimations. Somewhere during the project I seriously considered
pulling the plug on the Ionic branch (after many hours spend on fixing 
{{ "shit" | emojify }}), but realized that 

 - I had already spend too much time in "making things work"
 - I had come too far and
 - Ionic was already doing too much cool things I didn't wan't to rebuild myself 

that it would provide little resolve to venture down that road&hellip; so 
onwards we went.

We made it, but it was a hell of a gamble.

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/NJCupS7bDbQ" frameborder="0" allowfullscreen></iframe>
</div>

[laundr]: www.laundr.co
[port]: http://startupfoundation.co/rotterdam-startup-port/
[saddl]: www.saddl.nl
[ionic]: http://ionicframework.com
