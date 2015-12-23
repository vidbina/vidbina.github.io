---
layout: post
title:  Wielding List Constructors
date:   2015-10-8 08:55:51
type: tools
category: tools
tags:
 - software
 - programming 
 - Erlang
 - list cons
 - immutable
image: 
twitter:
  card: summary_large_image
  image: 
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
description: Note-to-self about Erlang list constructors, whyto use them and how to refrain from writing code I could get murered over by some angry developers.
---

I finished a crapload of work for one of my clients and decided that I will
use my holidays to look into a language I wanted to explore for a long while
long... Erlang.

While reading [Learn You Some Erlang For Great Good](http://learnyousomeerlang.com/)
I stumbled upon a list growing problem.

# What Are Lists?

Erlang lists are finite collections of items of possibly multiple types and is
notated as `[Head|Tail]`. The `[...|...]` notation is referred to as a _cons_
(it's a list constructor) in Erlang patois and requires a right-hand operand
that is a list, also called the tail, to which it will append the left-hand
item which we call the head.

So let's look at a few snippets that demonstrate lists also covered
in the [book](http://learnyousomeerlang.com/starting-out-for-real#lists).

{% highlight erlang %}
[]. % nil or an empty list

[monkey, mole]. % monkey and mole in a list
[monkey|[mole]]. % monkey and mole in s list
[monkey|[mole|[]]]. % monkey and mole in a list
{% endhighlight %}

So let's understand how things work... Variables in Erlang aren't really
variables everything is immutable, which means we can't reassign its value.
It is important to understand this since my lack of understanding the
implications of immutability required me to do 1 hour worth of reading and
thinking before finally appreciating the design. Basically, we should keep in
mind that we need to construct new data if we need something changed.

{% highlight erlang %}
NoFlyList=[monkey|[mole]].
{% endhighlight %}

The `NoFlyList` represents a list of creatures we don't want on our flight
because of bad behavior. In Erlang `List`s are singly linked-lists which means
that list items only know who their successor is. A node in a doubly
linked-list knows predecessor and successor (previous and next) nodes. In the
case of the `NoFlyList` the monkey only sees that the mole is on the list and
the mole doesn't see jack--it's practically blind anyways.

<!-- TODO: Image of mode looking at other item -->

# Growing Lists

Now the most interesting bit which explains the merit of _cons_ is that we could
extend the list by prepending or appending the list.

<!-- In case of appending the
list we would have to tell the mole to remember who its successor is. Since
this requires a change to the mole, which isn't possible in Erlang because
everything is immutable, we would have to rebuild (let's say copy) the entire
list and in the process record the mole's successor.-->

## Append

The `++` list operator allows us to append something to a list. To be precise,
we're appending whatever we have to the right-hand side of the operator to the
left-hand side.

{% highlight erlang %}
NoobNoFlyList = NoFlyList++[ghost].
{% endhighlight %}

Experienced Erlang coders, a title and burden I aspire to carry in the future,
will probably chuckle when they see that snippet because they are aware of its
reckless inefficiency. Until a few hours ago I wasn't aware of this
clusterfuck either, which explains why I'm far from bearing that title :trophy:.

Erlang looks at the `++` operator, takes whatever it finds on the
right-hand side (the tail) as the item it wants to connect something to, where
the operand on the left-hand (the head) side represents the item we're going to
connect to the tail. What basically happens is that we have a immutable list
containing a ghost and we need to extend the list on the left-hand side of the
operator to contain our ghost. Remember that we have that monkey looking at the
mole in our `NoFlyList`? Well, now we want the mole to look at the ghost. It's
Erlang, however; so the mole is immutable. Since the mole is immutable we'll
have to create a copy of the mole that looks at the ghost in order to realize
that list extension. The new mole has nothing looking at it and we need the
monkey to do that, yet again we stumble into the problem of the monkey being
cast in stone, so we'll have to create a new monkey to look at the newly
created mole. Now we'll have a list in which the monkey looks at the mole
which looks at the ghost, but as you noticed we had to recreate the entire
list on the left-hand side. Bummer!

<!-- TODO: Visual representation of having to copy the NoFlyList -->

> I got this information from section 6.31.1 in the Erlang Specification Draft

In order to use the `++` append list operator without having to step through an
entire list which could very well be comprised of a million misbehaving
critters it would make more sense to have the list on the right-hand side of
the operator. 

<!-- TODO: Visual representation of a appending a list to a shortlist,
emphasize the impact of the shortlist which has to be produced and why it
needs to be copied since the shortlist isn't looking at anything -->

{% highlight erlang %}
ProNoFlyList = [ghost]++NoFlyList.
{% endhighlight %}

This time erlang has the `NoFlyList` and can keep her intact, `ghost` which
needs to look at the first item in the no-fly list is therefore the only item
that needs to be copied in order to obtain a version of the ghost that looks at
the first screw-up in the no-fly list. Now ghost looks at monkey, which still
looks at the mole which is still blind as a bat.

Just sidetracking here

 - the left-hand operand of the `++` operation is always a list. Erlang throws
 up if it isn't.
 - the left-hand operand of the `++` operation will be traversed in it's
 entirety with a time complexity of $O(n)$ where $n$ represents the number of
 items in the left-hand operand, it is in our interest to keep the left-hand
 operand as small as possible
 - the last item in the head (the left-hand operand) (which is a list) will
 need to point to the first item in the tail (the right-hand operand). Being
 pointed to doesn't require anything at all, so the passive tail will survive
 unscathed, however; the active head, having to do the pointing, will have to
 be reconstructed.

{% highlight erlang %}
[mole]++bat==[mole|bat]. % improper list
[mole]++[bat]==[mole,bat]. % proper list
[mole]++[bat]==[mole|[bat]]. % same thing
[mole]++[bat]==[mole|[bat|[]]]. % we covered this before
{% endhighlight %}


## Construct
Using list cons, one could perform the previous feat more effectively.

{% highlight erlang %}
BestNoFlyList = [ghost|NoFlyList].
{% endhighlight %}

As suggested in the [Efficiency Guide](http://www.erlang.org/doc/efficiency_guide/myths.html#id61192)
the constructor does not have to copy the ghost as it directly creates the
ghost looking at something, that very something we call the tail :wink:. Which directly gives us a ghost looking at a
monkey, which is looking at a blind mole. In the `[ghost]++NoFlyList` approach
we create the ghost, and subsequently have to recreate a copy of it to look at
whatever the hell is first up in the `NoFlyList`.

<!-- TODO: VIsual representation of a cons used which doesn't have to copy 
a shortlist because the head is already created ready to point to something
that is going to be supplied -->

