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
computer language based on the vocabulary and grammar from a creole language.
Of all creole languages, I am most acquainted with the Suriname creole 
version, and scouring the web for some history got me a few interesting
youtube videos that would do quite well in kicking off the start of this 
journey.

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/_VFXoqfoi6I" frameborder="0" allowfullscreen></iframe>
</div>

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/A-3Z1KbYUj4" frameborder="0" allowfullscreen></iframe>
</div>

## Constructs
When I think of a language I quickly think in terms of constructs that I 
already know from existing computer languages &dash;&dash; I am therefore 
extremely biased and perhaps not the best candidate for concocting something 
new.

I have already though a bit about classes, methods, conditional statements, 
looping mechanisms, basic operators and use of punctuation. 

### Conditional Statements
Conditional logic is frequently needed in programs. I will need a proper way to 
describe such logic. The Suriname language allows for the following grammer, 
which bears striking similarity to the grammatical structure utilized in the 
English language &dash; There is a reason they call it _neger-engels_ 
(Negro-English):

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

In the Surinamese language conditional logic is often used as such:

  - `efu poku de, prei poku` (`if x, y`),
  - `efu poku de dan prei poku` (`if x then y`)
  - but also `prei poku efu poku de` (`y if x`).

If we want to support all the above methods of describing conditional logic,
we should add the terms ```if``` and ```then``` to the list of reserved 
keywords. We could also determine that from this moment onward, the usage of a
comma signifies the delimiter between the condition (```x```) and the action
(```y```).

The `prei poku` phrase presents another set of challenges, if we try to 
approximate the natural language as much as possible, because in many cases 
one would throw in an article causing one to naturally tend to type 
`prei a poku` (`play the song`) or `prei den poku` (`play the songs`). As 
evident the language does not employ plurals, but simply indicates number by
means of the article preceding the noun. This challenge will be dealt with when
we think of the mechanism in calling functions.

### Calling
Any decent language, should offer the ability to describe functions. This 
allows for code reuse which is a great way to allow more with less (less 
characters and lines) {{ ":thumbsup:" | emojify }}.

In the `prei poku` (`play music`) phrase `prei` is the action (_play_) and 
`poku` is the object being acted upon (_music_). As the action may be specific 
to the object &dash;&dash; the play action on a music item is quite different 
to the play action on a mandolin or a videogame console &dash;&dash; I would 
assume this would fit the object-method design pattern.
The challenge, however; is that the object-method pattern is often designed as 
such to state the object first and the action second as presented in the next
snippet:

    object.action(parameters)

But wait&hellip; now we need a subject as full sentences in the English 
language contain at least a subject and a verb. In the case of the 
`prei poku` (`play music`) bit, the subject is implicit but most likely _you_, 
resulting to the phrase being understood as `yu prei poku` (`you play music`).
After all, someone or something needs to do it.

{% highlight ruby %}
music_player.play(song) # subject.action(object)
song.play # object.action
{% endhighlight %}

The language being created should not support `object action` logic as the
natural language does not support such grammar either. It really makes no sense
to say _song play_, _wall paint_ or _car drive_ while _play song_, _paint wall_
and _drive car_ do make sense. As the subject, _I_, is implied in the 
previously mentioned phrases we will need to consider mechanism for supplying 
a subject in case of phrases of code where the subject would be implied.

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
        answer "Zeus"

    FSM as a god
      upon a request for name
        answer "Flying Spaghetti Monster"
      when I answer,
        answer and rain pastasauce

### While
    di disi, dati


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
