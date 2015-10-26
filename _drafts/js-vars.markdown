---
layout: post
title:  JS Variables & Scopes
date:   2015-10-17 17:02:51
type: code
category: code
tags:
 - scope
 - scoping
 - block
 - javascript
 - variables
 - es6
 - ecmascript
 - ecmascript2016
image: 
twitter:
  card: summary_large_image
  image: 
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    section: Javascript
description: A very basic post on the subleties of scoping in Javascript.
---
Just a little post on Javascript scopes. Nothing new, but just a simple
reminder whenever I context-switch from whichever of the gazillion languages
I write in.

## Hoist or Throw Up

Calling a variable without having it declared will result to a
`ReferenceError`.

 <!-- A -->
{% highlight javascript %}
function hi () {
  console.log(`hello ${sidekick}`);
}
hi ();
// ReferenceError: sidekick is not defined
{% endhighlight %}

Variable `var` declarations are hoisted to the top of a function block which
means that all declared variables are available anywhere in the block
regardless of where they were declared.

{% highlight javascript %}
function hi () {
  // with hoisting sidekick is already available here
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty';
}
hi ();
// hello undefined
{% endhighlight %}

Now with hoisting we can only promise that a variable will be accessible with
which we haven't said a darn thing about the value of that variable yet
:eyes:.


## `undefined` Until Assigned

Declared variables are `undefined` unless a value is explicitly assigned to
them. Eventhough declarations are hoisted to the top of the block, definitions
are just effective, starting at the location at which they are assigned. 

{% highlight javascript %}
function hi () {
  // sidekick is hoisted here, which means it exists
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty'; // but is only set here
  console.log(`c'mon, ${sidekick}`);
}
hi ();
// hello undefined
// c'mon, Morty
{% endhighlight %}

Even if the variable of interest happened to be defined in a parent scope, a
`var` statement will set the local variable of the same name as `undefined`

{% highlight javascript %}
var sidekick = 'Rick';
function hi () {
  // sidekick hoisted to this point and undefined
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty';
  console.log(`you don't understand, ${sidekick}`);
}
hi ();
// hello undefined
// you don't understand, Morty
{% endhighlight %}

It sometimes helps to imagine that any `var` variable declaration adds the
statement `var x = undefined;` at the top of the scope.

## `let` it Be

It is important to remember that hoisting is a bit different between `var`'s
and `let` or `const`'s. Instead of being hoisted to the top of the function
block, `let` and `const` are hoisted to the top of the containing block which
could be a `while` or `for` loop, a `function` or anything else where a block
is described.

{% highlight javascript %}
function hi () {
  // sidekick is hoisted to this point
  if(true) {
    var sidekick = 'Pinkie'
    console.log(`let's cook, ${sidekick}!`);
  }
  console.log(`you don't think, ${sidekick}`);
}
hi ();
// let's cook, Pinkman!
// you don't think, Pinkman
{% endhighlight %}

In that sense the scoping of `let` and `const` statements is a bit more
restrictive. A `let` or `const` declaration would be limited to the scope of
the if-block within which it was declared in our current example leaving
someone without its sidekick.

{% highlight javascript %}
function hi () {
  if(true) {
    // sidekick plays within this block
    let sidekick = 'Pinkman'
    console.log(`let's cook, ${sidekick}!`);
  }
  // there is no sidekick here
  console.log(`you don't think, ${sidekick}`);
}
hi ();
// let's cook, Pinkman!
// ReferenceError: sidekick is not defined
{% endhighlight %}

## Climbing the Scope Ladder

Declaring a variable in the local scope should be treated as if there hasn't
been anything in a former scope. One cannot rely on the former definition of
a variable because the declaration simply resets the variable's content to
`undefined` until the assignment has taken place in the nearest scope in which
the variable is defined.

{% highlight javascript %}
var sidekick = 'Rick';
function hi () {
  // local sidekick hoisted and undefined
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty'; // local sidekick set
  console.log(`bye, ${sidekick}`);
}
hi ();
// hello undefined
// bye Morty
{% endhighlight %}

The following example demonstrates how the `sidekick` variable, declared in a
function's parent scope and assigned therein, is accessible in the function's
local scope. Basically if a variable isn't defined in the local scope,
javascript climbs up the scope ladder, looking for the first place where it can
find a definition for the variable.

{% highlight javascript %}
var sidekick = 'Robin';
function hi () {
  console.log(`hello, ${sidekick}`);
}
hi ();
// hello Robin
{% endhighlight %}

{% highlight javascript %}
var sidekick = 'Smithers';
function hi () {
  if(true) {
    var sidekick = 'Sideshow Bob';
  }
  console.log('there is ${sidekick} again`);
}
{% endhighlight %}

:coffee: :scroll:
