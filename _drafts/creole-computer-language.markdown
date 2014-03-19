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

### Classes
During a half-hour stroll I decided that we could introduce the concept
of contexts in our language which isn't much different from the concept of a
class. Within the implementation of a object the implicit subject of the 
methods, which we will discuss next, is always 
```self``` unless specified otherwise.

    as a cop
      upon meeting a robber,
        arrest!
      upon meeting a civilian,
        greet!
      upon arrest,
        recite the rights to the perp
        then take the perp into custody.

Let's look at the cop context from the perspective of traditional OOP 
programming.

{% highlight ruby %}
class Cop
  def meet(person)
    greet! if person.is_a? Civilian
    arrest! if person.is_a? Robber
  end

  def arrest
    recite_rights and take_into_custody
  end
end
{% endhighlight %}

In the listed Ruby-ish snippet, I've taken the liberty to express the formerly 
listed cop context as a Ruby class. It now becomes quite clear that ```as``` or
```as a``` phrases are used to indicate the description of a _class_ where 
```as``` indicates the implementation of a class, while ```as a``` denotes the
implementation for an instance of the class.

    as a god
      upon receiving a prayer
        listen!
      upon being blasphemed by Cartman
        strike!

The above snippet declared the ```God``` class and the necessary class methods.
Although the context within which I've chosen to declare the class methods is
not ideal I figure the message comes accross.

#### Inheritance
    as a god
      when I answer
        start thunder,
        start lighting and
        speak it, in a low voice

    Zeus as a god
      upon a request for name
        answer "Krishna"

    FSM as a god
      upon a request for name
        answer "Flying Spaghetti Monster"
      when I answer,
        answer and rain pastasauce

### Methods
The ```upon``` keyword is used to express a _method_. As formerly stated the
subject is implicitly given, through the class.

    as a cop # subject: a cop
      upon meeting a robber, # event: meeting a robber
        arrest! # action: I, being the cop, arrest!

The robber is the object in the statement and the arrest action is performed
on this object (the cop arrests the robber). The language should automatically
apply the action to the object listed as a parameter in the method definition
```upon meeting a robber``` (```meeting``` is the action, ```a robber``` is the
first parameter). For the sake of readability we might want to introduce a few
keywords (```it```, ```him``` and ```her```) as pointers to the object. In 
case one would prefer not to use the ```arrest!``` statement (using the 
implicit referral to the robber), one could opt for ```arrest it```, 
```arrest him```  or ```arrest her```.

The probem with ```upon``` is that we express lines as ```upon meeting x```,
but somewhere in the code we might want to initiate a meeting between the cop
and something/someone else using syntax like ```cop meet x```, 
```cop do meet x```  or ```cop meets x```. If I want to use the 
```cop meet x``` syntax I will need to teach the language how to conjugate 
verbs {{ ":shit:" | emojify }}. We could use the ```when``` or ```when I``` 
keywords to make things even prettier, or uglier. {{ ":bulb:" | emojify }}.
Basically looking at the ```arrest``` action will already give us some possible
solutions.

    as a cop
      when I arrest a robber
        state its rights and
        cuff him
#### Extension
How do we merge two method declarations into a single method (the 
```meeting a robber``` and ```meeting a cilivian``` situations all pertain
to the ```meeting``` action)

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
      upon being greeted as a person, 
        ignore or 
        act confused if the greeter obviously meant me


In the superhero example, for instance, we decide that the ```kick ass``` 
action is most appropriate upon ```meeting a villain```. The subject of that
kick ass action will obviously be the superhero. This is one example of how
subject matter is implicitly determined by the parent class.
### Sort
    //piki

### Boolean Logic

or if `efu noso`
or `noso`
only `sosrefi`

[crenshaw]: http://compilers.iecc.com/crenshaw/
[gnu-tut]: http://gnuu.org/2009/09/18/writing-your-own-toy-compiler/
[sil-dict]: http://www-01.sil.org/americas/suriname/sranan/English/SrananEngDictIndex.html
