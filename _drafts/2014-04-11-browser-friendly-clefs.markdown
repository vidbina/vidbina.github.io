---
layout: post
title:  Browser Friendly Notation At Last
date:   2014-04-11 09:28:89
type: music
tags:
 - music
 - software 
 - internet
description: "I almost started looking for a way to generate images from lilypond for use on the web when I bumped into something much cooler... Music notation in the HTML5 canvas."
vexflow: true
---
I have [Mohit Muthanna Cheppudira][muthanna] to thank for this, but yes there 
is finally a cool way to embed music notation into web documents.

For a few weeks now I was considering writing up a little script to generate 
pngs from Lilypond files. Eventually I would want to get to the point were I 
would generate SVGs and subsequently even draw on the canvas. Yes, this would 
have been quite awesome if I could create the time to get on that, but somehow 
[someone else did it][simpsons-did-it-wiki] and I'm quite sure my version would 
not have been as cool as Muthanna&rsquo;s own.

# Test
<div class="element music">
  <div class="vex-tabdiv" width=450 scale=1.0 editor="true" editor_height=100>
  tabstave notation=true tablature=false
  notes Cn-D-E/4 F#/5
  </div>
</div>

Learned a lot today {{ ":smirk:" | emojify }}

[muthanna]: muthanna.com
[simpsons-did-it-wiki]: http://en.wikipedia.org/wiki/Simpsons_Already_Did_It
[simpsons-did-it-episode]: http://beta.southparkstudios.com/full-episodes/s06e07-the-simpsons-already-did-it
