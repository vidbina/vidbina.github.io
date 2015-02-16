---
layout: post
title: "Good Parsing"
date: 2014-01-07 18:27
thumbnail: nil
type: computer science
tags:
 - parsing
 - computer science
 - technology
 - engineering
description: After using strcmp&rsquo;s one time too many in hell-bound codebases I turn better solutions.
---
I've ```strcmp```-ed my way through returned data much too often. Although
this may work for quick hacks, I&rsquo;ve been on the prowl for something better
that wouldn&rsquo;t be as detrimental to the maintainability of my work if the
grammar would be extended.

In my effort to find something maintainable, I turned to some basic theory
about parsing. It's pretty much _computer linguistics_.

## Lexing
I initially decided starting with parsers, but I believe this story is more
cohesive if I start up building from the perspective of lexers first.

My way of thinking about lexers is as machines with characters as input and
tokens as output. A lexer could chomp a string like
{% highlight ragel %}
'Mona has 2 gorgeous eyes!'
{% endhighlight %}
 
and interpret is as
{% highlight ragel %}
WORD WORD NUMBER WORD WORD PUNCTUATION
{% endhighlight %}

if programmed to recognize ```WORD```&rsquo;s, ```NUMBER```&rsquo;s and 
```PUNCTUATION```.

This makes things so much easier because we'll have an idea how to deal with
the bits of information available.

## Parsing
After lexing, a parser typically looks as patterns of tokens in order to
deduce the course of action, if any.

A parser for a calculator knows that certain

## Grammars

### Regular
 - no rule with more than one nonterminal in the right hand side
 - nonterminals are at the same end of the right hand side

In an effort to expand my understanding of this I decided to define a few
grammars. One fully regular and one non-regular.

The regular grammar one has one right-aligned nonterminal in the right hand
side.
{% highlight ragel %}
# the last token is always a
# the rest may either be a or b
expr := a          #  a
        | a expr   #  a a
                   #  a a a
        | b expr   #  a b a  
                   #  b b a
        ;
{% endhighlight %}

I mix things up a bit by aligning the nonterminal to the right in ```a expr```
and to the left in ```expr b```.
{% highlight ragel %}
# the second last token is always a
# the rest may either be a or b
expr := a          #  a
        | a expr   #  a a
                   #  a a a
        | expr b   #  a b  
                   #  a a b
                   #  a b b
        ;
{% endhighlight %}

a
a b
a a
a a a a a a b

 - every regular grammar corresponds directly to a nondeterministic finite automaton

My journey started by looking into parsers. As I&rsquo;ve come to understand,
parsing is simply the identification of sets of tokens to be translated into
some action.

A parser looking at

{% highlight ruby %}
(a * b) + c
{% endhighlight %}
#
[odd-time-signatures]: http://gryffonius.hubpages.com/hub/Odd-Time-Signatures-Made-Easy
[ragel-avr]: http://www.avrfreaks.net/index.php?name=PNphpBB2&file=viewtopic&t=80042
[]: https://github.com/matthijsgroen/blogposts/blob/master/remote-pair-programming.md
[]: http://mattr.info/2013/04/28/pairing-katrina-owen-recap.html
[]: http://mattr.info/2013/04/18/sit-back-listen-and-learn.html
