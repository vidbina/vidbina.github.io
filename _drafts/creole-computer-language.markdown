---
layout: post
title: Creole Script
type: code
tags:
 - computer science
 - code
description: An interesting experiment in developing a computer language based on a creole language
---

I just thought of an interesting weekend project. Build a compiler for a 
computer language that utilzed terms from creole language and uses the grammer
of the spoken language as much as possible.

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/_VFXoqfoi6I" frameborder="0" allowfullscreen></iframe>
</div>

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/A-3Z1KbYUj4" frameborder="0" allowfullscreen></iframe>
</div>

## Constructs
Basically I'll have to determine the basic constructs the language should 
support.

### Conditional Statements
Starting with the basic ```if```'s &dash; I will need a proper way to describe
such logic. The language allows for the following grammer, which very similar
to the grammatical structure utilized in the English language.

    efu disi dan dati # if this then that

I am trying to minimize punctuation to keep the language readable for the 
biggest computer noobs out there.

Ruby is one of those language that is quite light on punctuation mark usage so
let's learn from them how we could describe the 
_if music is available, play it_ logic.

{% highlight ruby %}
# music = poku
# available/exists = de
if (music.available?)
  # play = prei
  music.play()
end
{% endhighlight %}

Presenting the _if music is available, play music_ sentence to the Surinamese
language would give us `efu poku de, prei poku` (`if x, y`),
`efu poku de dan prei poku` (`if x then y`)
but also `prei poku efu poku de` (`y if x`).

The `prei poku` phrase presents another set of challenges, if we try to 
approximate the natural language as much as possible, because in many cases 
one would throw in an article causing one to naturally tend to type 
`prei a poku` (`play the song`) or `prei den poku` (`play the songs`). As 
evident the language does not employ plurals, but simply indicates number by
means of the article preceding the noun. This challenge will be dealt with when
we think of the mechanism in calling functions.

Back to the if's&hellip;

### While
    di disi, dati

### Sort
    //piki

### Boolean Logic

or if `efu noso`
or `noso`
only `sosrefi`

[crenshaw]: http://compilers.iecc.com/crenshaw/
[gnu-tut]: http://gnuu.org/2009/09/18/writing-your-own-toy-compiler/
