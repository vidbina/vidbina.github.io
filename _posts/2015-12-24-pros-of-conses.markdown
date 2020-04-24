---
layout: post
title:  Pros of Conses
date:   2015-12-23 21:13:51
type: tools
category: tools
tags:
 - software
 - programming
 - Erlang
 - list cons
 - immutable
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/erlcons_thumb.png
twitter:
  card: summary_large_image
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/erlcons.png
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    tags:
       - software
       - programming
       - Erlang
       - list cons
       - immutable
    section: Software Engineering
description: Note-to-self about Erlang list conses and why to use them to refrain from writing code I could possibly get shunned over by wiser peers.
mathjax: true
emojify: true
redirect_from:
  - /tools/pro-of-cons.html
---

While reading [Learn You Some Erlang For Great Good](http://learnyousomeerlang.com/)
I stumbled upon a list growing problem. Little did I know that my lack of
understanding was about to dispatch me on a 1-hour journey that would help me
better understand and appreciate the pros of conses (I'll explain what conses
are in a sec).

# What Are Lists?

An Erlang list is a finite collections of items (elements could be of different
types) and is notated as `[Head|Tail]`. The `[...|...]` notation is referred
to as a _cons_ (it's a list constructor) in Erlang patois and requires a left-hand
operand commonly referred to as the head and a right-hand operand, the tail.

So let's look at a few snippets that demonstrate lists.

```erlang
[]. % nil or an empty list

[monkey,mole]. % monkey and mole in a list
[monkey|[mole]]. % monkey and mole in s list
[monkey|[mole|[]]]. % monkey and mole in a list

[mokey|mole]. % improper list, steer clear of these
```

The [book](http://learnyousomeerlang.com/starting-out-for-real#lists) does a
great job in explaining lists too by the way and if you want to get a deeper
understanding I have attached a fragment of the Erlang Specification Draft 0.7
below, otherwise just skip the PDF.

<div class="element document portrait-a4">
  <embed class="a4" src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/doc/erlang/erl_spec47_lists.pdf">
</div>

It always helps to truly understand how things work... Variables in Erlang
aren't really variable as everything is immutable. This means that we can't
reassign values or modify properties.

My lack of understanding the implications of immutability required me to do 1
hour worth of reading and thinking, after having proposed inefficient code,
before finally appreciating the design.

<div class="element twitter">
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/mononcqc">@mononcqc</a> thx for the <a href="https://twitter.com/hashtag/Erlang?src=hash">#Erlang</a> bible 🙌🏿 Why didn’t you avoid `reverse` by `Sublist++[H]` instead of `[H|Sublist]`? <a href="https://t.co/6DkoaTASs4">https://t.co/6DkoaTASs4</a></p>&mdash; David Asabina (@vidbina) <a href="https://twitter.com/vidbina/status/679659666817859584">December 23, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Basically, we should keep in mind that we need to construct new data if we need
anything changed... every single time which means that we have to play ball in
an entirely different manner when dealing with those immutable creatures.

Let's cut to the chase...

```erlang
NoFlyList=[monkey|[mole]].
```

The `NoFlyList` represents a list of creatures we don't want on our flight
because of bad behavior. Maybe the monkey pooped:poop: in his seat and the mole
burrowed his way into a fluffy cushion:seat:... really, that isn't the point; of
importance is realizing that Erlang `List`s are singly linked-lists meaning
that list items only know who their successors are.

<div class="element twitter">
<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/vidbina">@vidbina</a> <a href="https://twitter.com/mononcqc">@mononcqc</a> SL ++ [H] is O(n) whereas [H|SL] is O(1). Lists are singly linked.</p>&mdash; Jesper L. Andersen (@jlouis666) <a href="https://twitter.com/jlouis666/status/679667193894858753">December 23, 2015</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

<div class="element note">
A node in a doubly linked-list knows predecessor and successor (previous and
next) nodes.
</div>

In the case of the `NoFlyList` the monkey only sees the mole and the mole
doesn't see jack--it's practically blind anyways :eyes:.

<!-- TODO: Image of mode looking at other item -->

# Growing Lists

Now the most interesting bit, which should help us understand the merit of
_conses_, is that we could extend our list of creatures unwelcome on our
flights:airplane: by prepending or appending items to the list.

<!-- In case of appending the
list we would have to tell the mole to remember who its successor is. Since
this requires a change to the mole, which isn't possible in Erlang because
everything is immutable, we would have to rebuild (let's say copy) the entire
list and in the process record the mole's successor.-->

## Append

The `++` list operator is officially called the list addition operator, so
yeah... it will allow us to add something to a list. In our example we want
to add a list containing just a ghost to our already existing list of
creatures we'd rather not board on our planes.

```erlang
NoobNoFlyList = NoFlyList++[ghost].
```

Experienced Erlang coders, a title and burden I aspire to carry in the future,
will probably chuckle when they see that snippet because they can only imagine
the author's recklessness in daring to specify this inefficient code. Until a
few hours ago I wasn't aware of this fuckup either, which explains why I'm far
from bearing that title :trophy:.

Erlang looks at the `++` operator, takes whatever it finds on the
right-hand side (the tail) as the item it wants to connect something to, where
the operand on the left-hand (the head) side represents the item we're going to
connect to the tail.

We have a immutable list containing a ghost and need to extend the no-fly list
to contain all items in the list that currently contains just our ghost. This
basically means that we want the mole, the last one in our no-fly list, to look
at the first item in our tail, which is the ghost. It's Erlang, however; so the
mole is immutable therefore we'll have to create a copy of the mole that looks
at the ghost in order to realize that list extension.

The new mole has nothing looking at it and we need the monkey to do that, yet
again we stumble into the problem of the monkey being cast in stone, so we'll
have to create a new monkey to look at the newly created mole. Now we'll have a
list in which the monkey looks at the mole which looks at the ghost, but as
you noticed we had to recreate the entire list on the left-hand side. Bummer!

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/gif/erl_list_add_single.gif" alt="Demonstrating how expensive List++[Item] is in Erlang">
</div>

Section 6.13.1 in the Erlang Specification Draft contains a formal definition
of the `++` operator which I attached below for your convenience :wink:.

<div class="element document portrait-a4">
  <embed class="a4" src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/doc/erlang/erl_spec47_listops.pdf">
</div>

## Prepend

In order to use the `++` list operator without having to step through an
entire list which could very well be comprised of a million misbehaving
critters it would be more sensible to have the list on the right-hand side of
the operator.

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/gif/erl_single_add_list.gif" alt="Demonstrating how cheap [Item]++List is in Erlang">
</div>

```erlang
OkayNoFlyList = [ghost]++NoFlyList.
```

Note that the left-hand operand represent a list of a single item -- our ghost.
The list happens to be immutable so Erlang cannot in good conscience modify
it or any of its contents, therefore being forced to make a copy.
This time the `ghost` needs to look at the first screw-up in the no-fly list,
therefore being the only item that needs to be copied. In the meantime the
monkey still looks at the mole which is still blind as a bat.

Just sidetracking here

 - the left-hand operand of the `++` operation is always a list. Erlang throws
 up if it isn't.
 - the left-hand operand of the `++` operation will be traversed in its
 entirety, leading to a time complexity of $O(n)$ where $n$ represents the
 number of items in the left-hand operand
 - the last item in the head (the left-hand operand) (which is a list) will
 need to point to the first item in the tail (the right-hand operand). Being
 pointed to doesn't require anything at all, so the passive tail will survive
 unscathed, however; the active head, having to do the pointing, will have to
 be reconstructed.

```erlang
[mole]++bat==[mole|bat]. % improper list
[mole]++[bat]==[mole,bat]. % proper list
[mole]++[bat]==[mole|[bat]]. % same thing
[mole]++[bat]==[mole|[bat|[]]]. % we covered this before
```

## Cons
Using list cons, one could perform the previous feat more effectively.

```erlang
EliteNoFlyList = [ghost|NoFlyList].
```

As suggested in the [Efficiency Guide](http://www.erlang.org/doc/efficiency_guide/myths.html#id61192)
the constructor does not have to copy the ghost as it directly creates the
ghost looking at something, that very something we call the tail :wink:. Which directly gives us a ghost looking at a
monkey, which is looking at a blind mole. In the `[ghost]++NoFlyList` approach
we create the ghost, and subsequently have to recreate a copy of it to look at
whatever the hell is first up in the `NoFlyList`.

<div class="element image">
<img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/gif/erl_list_cons.gif" alt="Demonstrating how cheap [Item|List] is in Erlang">
</div>

Always remember that using a non-list tail will result to a improper list,
with which you will most likely have a bad time

```erlang
[monkey|mole] != [monkey,mole]. % avoid
[monkey|[mole]] == [monkey,mole]. % do this :)
```
