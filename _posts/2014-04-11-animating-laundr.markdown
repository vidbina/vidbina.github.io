---
layout: post
title:  Animating Mr. Washee Washee (My Version of the Laundr Story)
date:   2014-04-11 09:28:09
type: start-up
category: entrepreneurship
tags:
 - engineering
 - start-up
 - entrepreneurship
 - experiment
 - mobile
 - back-end
redirect_from:
  - /2014/04/11/animating-laundr.html
  - /animating-laundr/
description: "Laundr picks up, cleans and delivers your suits when you want it, where you want it. This article chronicles the events as I experienced them. Conception, first app shipment and first actual delivery."
emojify: true
---

I believe it has been a month and a half since this idea has been floating
around in the [Port][port]&hellip; a month and a half ago
:ghost: (I just undusted this post from my drafts
collection so we have time travelled further into the future since then
:stuck_out_tongue_closed_eyes:). Orgeon came up with the
bit, got the [Saddl][saddl] fellers all too much excited about the concept
and that is how the ball started rolling.

The idea: Offer a qualitative suit dry cleaning service to white collar workers
allowing user-specified pickup and delivery times and locations. Qualitative
as in, people should dare entrust us their expensive suits.
:necktie: :package:

The advantage: Don&rsquo;t ever worry about heading to the [dry cleaners][washee]
yourself again. Now you can spend even more time stuck in your (awesome) office
(in the summer), having one less excuse to head out to catch a fresh whiff
of air :innocent:.

<div class="element image">
  <img src="/resources/startup/laundr/landing_page_20140309.png" alt="Laundr Landing Page">
</div>

## The short version

<ol class="timeline">
<li class="label">Week 1<!-- week 3 of 2014 --></li>
<li>Orgeon starts getting people excited about the idea</li>
<li>Saddle digs the idea and jumps in</li>
<li class="label">Week 2<!-- week 4 of 2014 --></li>
<li>The fellers start talking with people (local high-end tailors, laundromats and businessmen) about the idea</li>
<li>The Saddl team gets some UI ideas going :iphone:</li>
<li>I start working on a simple Node.js back-end :construction:</li>
<li class="label">Week 3</li>
<li>Get at much work done for Laundr in between the other gigs I eloquently (or probably chaotically) juggling</li>
<li>Jump on the plane at the beginning of the weekend for a two week break. I&rsquo;m seeing pa and ma in Suriname again after 5 years away from home. :sunrise:</li>
<li class="label">Week 6<!-- week 8 --></li>
<li>Break is over :rage:, I start working on the mobile app (Cordova and Angular are my tools of choice for this mission)</li>
<li class="label">Week 7<!-- week 9 --></li>
<li>The Saddl fellers join the development effort to help :muscle: out with front-end issues leaving us with a development team at last</li>
<li>First version of the app is ready for shipment (some issues still pending, but it works well enough to get started)</li>
<li class="label">Week 10<!-- week 12 --></li>
<li>Bumped the version to 0.0.2, we have been testing the app for a while now. Fuck it, we should just ship it! :shipit:</li>
<li class="label">Week 11</li>
<li>First pickup and delivery :gift:</li>
<li class="label">Week 12<!-- week 14x --></li>
<li>Submit app to the Apple app store</li>
</ol>

## Lessons Learned
The following points are things I consider learned lessons for the next
experiment. Most of the lessons learned during this experiment should assist
me in being even _lean-er_.

### Do Not Lose Sight of the Primary Objective (Avoid Bullshit Excuses)
We are setting up a pickup-and-delivery service with a plus -- we are adding
a extra service between the pickup and delivery. As such the service is
already elaborate enough to be tested apart from the form we intended to use in
communicating with our end-user. After all, the app is just a small cog in the
machine.

After a lot of poking we have finally gotten to the point where we have
executed a first order. This, however; was an order we received through a
simple Google form we dropped online.
*Often the best solutions are the simple low-tech solutions* and I cannot say
that is surprising. I&rsquo;m quite sure that the rest of the team wasn&rsquo;t
either yet we waited much too long to accept orders through simple
low-tech channels using bullshit excuses.

<div class="element image">
  <img alt="A few mood shots of the Laundr operation" src="/resources/startup/laundr/ops-collage-042014.jpg">
</div>

Quick analysis attributed the higests riscs to the the third-party service
(the washing) and the logistics (pick-up and delivery). Because the good
fellers from [Saddl][saddl] are involved, the logistics part is pretty much
covered, making our only real risk the laundromats we are planning to work
with and the deals we will be making with them.

We still have not processed more orders, so the operation is still an
invalidated experiment project in my books. Until we're consistently pulling in
orders, I will maintain my stance, but the last team huddle got some balls
rolling and we have set some new targets that should steer us in the right
directions.

### Fuck it, Ship it
Another thing I apparently have a hard time learning is to ship fast
:shipit:. The first version submitted to the app store was
version `0.0.3`. We have iterated through 3 versions **that no customer had
seen** that included feature additions and a UI overhaul. How riddiculous
is that?!? :unamused:, just because we were chasing
perfection... yeah right? Perfection for who... ourselves?

<div class="element image">
  <img alt="A few mood shots of the Laundr operation" src="/resources/startup/laundr/orgeon-home-042014.jpg">
</div>

George, Max and I have made some nice tweaks and there are too many issues we
still want to tackle in the app, but many people don&rsquo;t see those yet. As
a musician I often experienced gigs which I judged to be suboptimal. I either
made many mistakes or the band synergy just seemed to be off. The audience
usually seemed totally oblivious to these obvious blunders which goes to show
that builders look through different sets of lenses in comparison to the
common folk (everybody else) and are very aware of all the blemishes and often
unsuccesful in relating these blemishes to the actual impact they will end up
having.

Who are you building for?  Yup... not for yourself. Remember that! Build the
product for your customers. Screw what you want. The product will never be
finished anyways, at best it will be good enough to _solve the problem within
acceptable measure_.

_As long as humanity exists, finished solutions are
nonexistent. Everything is a work in progress_. Our economic models need
constant revision, our legal system gets ammended in time, engineering marvels
demand maintenance, works require constant revision. Even the arts are
subjected to this statement to some extent. Art of any form does not succeed in
perpetually fulfilling the recreational needs of any one human being. Although
every experience of a piece may unearth new treasures, sometimes a complete
replenishing of one&rsquo;s art supply is necessary. Just try enjoying the same
song everytime you need music and keep it up for a year &dash;&dash; Just one
song :scream:. It will probably drive you nuts. Why is that?!?
Well, I guess humans constantly change/evolve/adapt and with this, demands and
problems change as well which calls for altered solutions.

<!--
The only timeless invention was death and as far as I know that was not invented by a human.
-->

### Introducing Risks During Development
Playing with new ideas and toys is best left to be done in the experimental
projects executed by the R&D deparmtments of the world, but then again all
cool startups are basically R&D departments executing experiments. Yet there is
a difference in building something new with the tools you master and building
something new with the tools you have just discovered :wrench:.

Somehow we still managed to do the later and utilize a pre-alpha
framework in the mobile webapp being developed. Due to major updates during
the course of development, documentation inconsistencies and some minor bugs,
we were set back quite an amount of time in development as we sought to
resolve these issues (with hacks :dizzy_face:).

We were using [Ionic][ionic] and honestly, I love it. My only regret is that
I didn't adequately account for the risks involved in getting acquianted with
a new framework, especially something as volatile as a alpha release product,
in our time-to-market estimations. Somewhere during the project I seriously
considered pulling the plug on the Ionic branch (after many hours spend on
fixing shit), but realized that

 - I had already spend too much time in "making things work"
 - I had come too far and
 - Ionic was already doing too much cool things I didn't wan't to rebuild myself

It would provide little resolve to venture down that road&hellip; so onwards
we went.


## Wrap Up
Our situation got us to the point where we had an app running before
we started to actually discover the pains in morphing the service into a
well-oiled machine -- before we picked up our first suit. Not to say that
isn't a solution, but my 2 cents say it would have been even better if we had
made a couple of pickups and deliveries while still having the app in the oven.


<div class="element cta">
  <a href="http://thesummit.co/kilimanjaro/nominees-alpha#entry-199">Vote to get Laundr to Kilimanjaro :mount_fuji:</a>
</div>

Anyways, we&rsquo;ve applied for the Kilimanjaro climb (we still need to figure
out which one of us would get to go if we get selected), but there is progress
and this team was absolutely great in helping me obtain these experiences and
learn these lessons, so I owe the wonderful experience to Max, George and
Orgeon. We are a long way from somewhere which means that this quest continues,
and the gates of Mordor are still a few challenges and orc encounters away.

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/NJCupS7bDbQ" frameborder="0" allowfullscreen></iframe>
</div>

Lessons learnt, moving on a bit smarter and wiser.

[Do not forget to vote for us][kilimanjaro] we really appreciate any
**[votes][kilimanjaro]** we can muster. Ask your folks and friends to vote and
if grandma does not get it, help her out, but really for the love of mother
Earth, **[vote][kilimanjaro]** and help Laundr out :trophy:.

<div class="element cta">
  <a href="http://thesummit.co/kilimanjaro/nominees-alpha#entry-199">Vote for Laundr :mount_fuji:</a>
</div>

<!--
I learned never to mistake an app for the product again, if it isn't. Even if
team members aren&rsquo;t convinced of the plausibility of testing without a channel
that actually is of lesser importance to the general service. I believe the
biggest issue began with thinking of the app as a irreplaceable part of the service while it is
simply a medium. We could have been able to claim with certainty how the
entire flow worked by the time the app was available. We didn't, but bet
your ass that I will make sure of it that things work differently the next
time. Perhaps I should just work on my persuation skills. Another lesson is
to ship ASAP. I&rsquo;m not sure how much times this needs to be said, but I
got it wrong this time again and this is not the first thing I&rsquo;m
building. Furthermore, I will stick to the tools I master next time I try doing
something quick. Only after having shipped something to customers, will I
consider playing around with new tools and toys.
-->


[kilimanjaro]: http://thesummit.co/kilimanjaro/nominees-alpha#entry-199
[laundr]: www.laundr.co
[port]: http://startupfoundation.co/rotterdam-startup-port/
[saddl]: www.saddl.nl
[ionic]: http://ionicframework.com
[washee]: http://familyguy.wikia.com/wiki/Mr._Washee_Washee
