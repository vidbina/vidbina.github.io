---
layout: post
title:  Understanding Material Conditionals
date:   2015-03-11 22:51:51
type: math
category: math
tags:
 - math
 - logic
 - reasoning
 - philosophy
mathjax: true
description: "A simpleton's reasoning of material conditionals (if/then logic
$p\\rightarrow q$) which seems to be different from the way we discuss if/then
constructs in everyday English or computation but really isn't at all hard to
grasp."
emojify: true
---
After a inspiring catch-up dinner with the founder of
[Clinck](http://clinck.me), I've just resumed my week's reading. I'm covering
mathematics... the basics... conditional statements and that brings me
to [material conditional][material-conditional].

While looking at the $p \rightarrow q$ (_if $p$ then $q$_ or even better
_$p$ implies $q$_) statements I noticed something curious -- given a $false$
antecedent, the statement is always true.

## Perspective
From a computing point of view, one is used to formulating if/then statements
as a means to describe causal relationships (simply stated: if $p$ happens to
be true, make sure $q$ happens). But in terms of classical logic, we are not
describing causal relationships but simply evaluating the truthfulness of the
statement. We are basically saying that $p$ implies $q$.

Constantly ask yourself, is the statement true?

I have a silly case to demonstrate the evaluation of a statement. Assume we
use the antecedent $p$ to represent that _a creature has green blood_ and the
consequent $q$ to represent that _a creature is an alien_ simply read as _if
a creature has green blood, then it is an alien_.

<div class="element image">
  <img src="/resources/math/ifthen-bloodandaliens.svg" alt="Simple Venn diagram to explore the if creature has green blood, then creature is alien material condition" />
</div>

The Venn diagram has surrounded the subject we're talking about (our antecedent
$q$) with a white outline, call it the spotlight :flashlight:.
Our consequent is represented by another circle which may overlap the
antecedent wherever both conditions hold $true$. In case we have a truthful
condition (because both conditions hold $true$) the entire area is white.
False conditions within the spotlight maintain their non-white color and
everything else simply falls beyond the scope of the statement we're making
(resides in darkness, outside the spotlight), after all we're simply stating
something about _creatures with green blood_.

### When A Truth Implies Another Truth

If a creature has green blood $p=T$ and the creature happens to be an alien
$q=T$ the statement is clearly true. We're not bullshitting anyone when stating
that (see the section labelled _vicious goo-stuffed ET's_ represented by the
white area in the Venn diagram).

### When A Truth Implies A Lie

Upon the discovery of a creature with green blood $p=T$ which somehow does not
happen to be classified as an alien $q=F$ (perhaps some mutant venturing through
Gotham) then the statement is suddenly discredited ($p\wedge\neg q$, read as
_$p$ and the inverse of $q$_). The green-blooded non-alien lifeforms (captured
by the green area in the Venn diagram) are represented by this statement.

### When A False Statement Implies Anything
If the creature has blue blood and happens to be an alien, the statement is
still true because we initially only said something about the green-blooded
critters which can not be discredited by this unrelated observation (unrelated
because blue-blooded creatures have no business in a discussion about
green-blooded ones). Remember that the our statement really reads _green blood
implies alien_. Without green blood we're not even having this discussion.

If the creature has blue blood and does not happen to be an alien, the
statement is still true because yet again our statement only said something
about that which bleeds green. Take the dark blue area in the Venn diagram.
It covers all non green-blooded creatures that are not extra-terrestrial
(humans fall into this category). Why are we bringing this up? Out of scope.

In short, anything with a false antecedent $q=F$ will end up being a truthful
statement because we have formulated our statement as such to only describe the
cases where $q=T$ (think _spotlight_), therefore the making of other claims
does not result in any logical discrepancies.

To stick with the blood color theme, stating something about green-blooded
creatures can not possibly be discredited by showing up with a non-green
blooded speciment, regardless of the peculiarities one wishes to demonstrate.
The claim about green-blooded creatures still stands.

## Representation
The interesting behavior of material condition becomes more natural when
looking at it's logical equivalent $\neg(p\wedge \neg q)$. One can clearly see
in the logical equivalent that the falseness of $p$ will always result to a
truthful outcome of the statement. Basically a truthful statement will require
a $false$ within the parentheses in order to evaluate to $true$. This may help
in constructing truth tables, but really&hellip; thinking about green-blooded
aliens will too.

## Read

 - [Michael Hutching's Introduction to Mathematical Arguments](https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CB0QFjAAahUKEwig8Nvcu-XIAhXn_XIKHfybALU&url=https%3A%2F%2Fmath.berkeley.edu%2F~hutching%2Fteach%2Fproofs.pdf&usg=AFQjCNHMThrxJeLFf-XjZq-eqQRebxoroA&bvm=bv.106130839,d.bGg)
 - [Material Conditional Wikipedia page][material-conditional]

[material-conditional]: http://en.wikipedia.org/wiki/Material_conditional
