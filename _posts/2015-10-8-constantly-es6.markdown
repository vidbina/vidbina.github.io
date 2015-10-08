---
layout: post
title:  Note About ES6 Constants
date:   2015-10-8 08:55:51
type: tools
category: tools
tags:
 - software
 - programming 
 - es6
 - ECMAscript 
 - javascript
mathjax: true
description: Note to self about ECMAscript 6 constants, the pass-by-reference and pass-by-value ordeal and few tips to remember which may aid in maintaining sanity within (if you really don't want other devs to kill you).
---

While reading up about housekeeping the global object in ECMAscript 6 I
noticed a subtlety of `const` that could have escaped the attention of some
software developers like myself.

Non-primitives such as arrays and objects are
accessed by their pointers and constants to such items pertain to the
reference.

A constant array or object always maintains its reference[^1],
but the
data pointed to by the immutable reference may be mutated.

[^1]: The pointer never changes, meaning that it will always point to the same item in memory.

{% highlight javascript %}
const number = 12;
number++; // fails, integers are primitive
{% endhighlight %}

Changing the reference will not work for an array, however; one may mutate
the object referred to by use of the `push`, `pop`, `shift` and `unshift`
functions:

{% highlight javascript %}
const people = [];
people.push('Leni') // ok
people = []; // fails, don't reassign
{% endhighlight %}

The data referred to by an object reference may also be mutated:

{% highlight javascript %}
const thing = {};
thing['name'] = 'Spaceship'; // ok
thing = { 'name': 'Paperplane' } // fails, don't reassign
{% endhighlight %}

Upon first glance it isn't far fetched to assume that somewhere in the 
life cycle of a codebase, someone will mistake a constant for an item of
immutable state. :warning:. Here is how I maintain sanity:

 - remember that primitives are passed by value
 - remember that non-primitives are passed by a _copy of the reference_[^3]
 - always return copies to non-primitives, ensuring that no one has access
 to the data I need for my housekeeping effectively giving me some guarantees
 regarding state.

[^2]: The reference to the array is taken by functions as `push`, `pop`, `shift` and `unshift` and the data pointed to by the reference is mutated. The reference never changes.

[^3]: As phrased by [Alnitak](http://stackoverflow.com/users/6782/alnitak) in an answer to [Does JavaScript pass by reference?](http://stackoverflow.com/questions/13104494/does-javascript-pass-by-reference)

## Read

 - [Sandeep Panda's _Is JavaScript Pass by Value or Pass by Reference? — JavaScript Basics_ article](http://www.htmlxprs.com/post/34/pass-by-value-vs-pass-by-reference) for more information on pass by reference and pass by value in ES6
 - [Strongloop's _JavaScript ES6 Variable Declarations with let and const_](https://strongloop.com/strongblog/es6-variable-declarations/)
 - [Dr. Axel Rauschmayer](https://twitter.com/rauchsma)'s [Variables and scoping in ECMAScript 6](http://www.2ality.com/2015/02/es6-scoping.html)
