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
such logic. The language allows for the following grammer, which bears striking
similarity to the grammatical structure utilized in the English language &dash;
There is a reason they call it _neger-engels_ (Negro-English).

    efu disi dan dati # if this then that

I am trying to minimize punctuation to keep the language readable for the 
biggest computer noobs out there. If there is any punctuation utilized, it
should be almost in the same way we utilize punctuation in the written form
of the language. I reckon this would make the code most readable.

Ruby is one of those languages that is quite light on punctuation usage so I'm
stealing a few ideas from Matz and his team to learn how we could describe the 
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


### Calling
Previously I mentioned how the `prei poku` phrase presented a challenge that
would fit best in the function calling mechanism.

In the `prei poku` phrase `prei` is the action (_play_) and `poku` is the 
object being acted upon (_music_). As the action may be specific to the 
object, I would assume that would fit the object-method design pattern. The
challenge, however; is that the object-method pattern is often designed as such
to state the object first and the action second.

But wait&hellip; there should be a subject, and in the case of the 
_if music is available, play music_ bit, the subject is most likely the second
person _you_ resulting to the phrase being understood as 
_if music is available, you play music_ or 
_Hey you, If music is available play it!_ However you prefer to phrase it we
clearly have to account for the subject, action/verb and an object being acted
upon.

{% highlight ruby %}
MusicPlayer.play(song) # subject.action(verb)
song.play # object.verb
{% endhighlight %}

During a half-hour stroll I just figured that we could introduce the concept
of contexts in our language. Within the implementation of a object the implicit
subject is always ```self``` unless one specified one explicitly.

    as a cop
      upon meeting a robber, arrest him
      upon witnessing a felony in progress, request backup
      upon arrest, recite the rights to the perp 
        then take the perp into custody
      upon shots fired, draw weapon
      upon shot at, shoot back
      upon confrontation, greet
      upon being greeted, greet

    as a superhero
      upon meeting a villain, kick ass
      upon witnessing a felony in progress, kick ass
      upon arrest, get out
      upon shots fired, defend civilians
      upon shot at, defend civilians and self
      upon confrontation with psuedonym, greet
      upon confrontation with real name, ignore
      upon being greeted anonymously, greet
      upon being greeted as superhero, greet
      upon being greeted as person, ignore or act confused if it is obviously the greeter meant me

    agent12 is like a cop
    agent12 meets smartthief # a robber changes into a detainee once caught

### Sort
    //piki

### Boolean Logic

or if `efu noso`
or `noso`
only `sosrefi`

[crenshaw]: http://compilers.iecc.com/crenshaw/
[gnu-tut]: http://gnuu.org/2009/09/18/writing-your-own-toy-compiler/
[sil-dict]: http://www-01.sil.org/americas/suriname/sranan/English/SrananEngDictIndex.html
