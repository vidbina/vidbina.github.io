---
layout: post
title:  JS Variables & Scopes
date:   2015-10-26 17:02:51
type: code
category: code
tags:
 - scope
 - scoping
 - block
 - javascript
 - variables
 - es6
 - ECMAscript
 - ECMAscript2016
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    section: Javascript
description: A very basic post on the subleties of variable hoisting in Javascript comparing var and let declarations.
emojify: true
---
Just a little post on variable hoisting in Javascript. It's nothing new, just
a simple reminder whenever I context-switch from whichever of the gazillion
languages I write in back to ES6. There are a few subtleties regarding `var`
and `let`/`const` declarations that everyone writing Javascript should be
aware of. :warning:

<div class="element gif">
  <iframe src="//giphy.com/embed/6NvROVDmhI3QI" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
</div>

## Hoist or Throw Up

Calling a variable without having it declared will result to a
`ReferenceError`.

 <!-- A -->
```javascript
function hi () {
  console.log(`hello ${sidekick}`);
}
hi ();
// ReferenceError: sidekick is not defined
```

**Variable `var` declarations are hoisted to the top of a _function_** which
means that all declared variables are available anywhere in the function
regardless of where they were declared.

```javascript
function hi () {
  // with hoisting sidekick is already available here
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty';
}
hi ();
// hello undefined
```

Now with hoisting we can only promise that a variable will be accessible.
It isn't defined yet. Nothing meaningful is assigned to it yet.
:eyes:.


## `undefined` Until Assigned

**Declared variables are `undefined` unless a value is explicitly assigned to
them**. Eventhough declarations are hoisted to the top of the block,
definitions apply whenever the assignment is handled.

```javascript
function hi () {
  // sidekick is hoisted here, which means it exists
  console.log(`hello, ${sidekick}`);
  var sidekick = 'Morty'; // but is only assigned here
  console.log(`c'mon, ${sidekick}`);
}
hi ();
// hello undefined
// c'mon, Morty
```

Even if the variable of interest happened to be defined in a parent scope, a
hoisted `var` will be `undefined` by default within the scope in which it is
hoisted.

```javascript
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
```

It sometimes helps to imagine that any `var` variable declaration adds the
statement `var x = undefined;` at the top of the scope.

## `let` it Be

It is important to remember that hoisting is a bit different between `var`'s
and `let` or `const`'s. Instead of being hoisted to the top of the function
block, **`let` and `const` are hoisted to the top of the containing block**
which could be a `while` or `for` block or anything else where a block is
described in addition to `function` blocks.

```javascript
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
```

In that sense the scoping of `let` and `const` statements is a bit more
restrictive. A `let` or `const` declaration would be limited to the scope of
the if-block within which it was declared in our current example leaving
someone without its sidekick.

```javascript
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
```

A declared variable is set to `undefined`, even if the parent scope contains
a variable by the same name.

## Climbing the Scope Ladder

If a variable is not defined in the local scope, javascript climbs up the
scope ladder until it arrives at a scope that does define the variable of
interest. **With `var` declarations the hoisting boundary is the function**.

```javascript
var sidekick = 'Dr. Watson';
function hi () {
  // sidekick hoisted
  console.log(`another mystery, ${sidekick}`)
  if(true) {
    console.log(`another mystery, ${sidekick}`);
    if(true) {
      console.log(`mystery solved, ${sidekick}?`);
      if(true) {
        console.log(`the answer ss ${sidekick}`);
        var sidekick = 'Sherlock';
      }
    }
  }
}
// another mystery, undefined
// another mystery, undefined
// mystery solved, undefined?
// the answer ss undefined
```

**With `let` and `const` declarations the hoisting boundary is defined by the
containing block**.

```javascript
var sidekick = 'Dr. Watson';
function hi () {
  console.log(`another mystery, ${sidekick}`)
  if(true) {
    console.log(`another mystery, ${sidekick}`);
    if(true) {
      console.log(`mystery solved, ${sidekick}?`);
      if(true) {
        // sidekick hoisted
        console.log(`the answer ss ${sidekick}`);
        let sidekick = 'Sherlock';
      }
    }
  }
}
// another mystery, Dr. Watson
// another mystery, Dr. Watson
// mystery solved, Dr. Watson?
// the answer ss undefined
```

It is useful to know the mechanics of hoisting, although for readabilities'
sake it would be advised to not depend on this language feature too much.

## Read

 - [`let` vs `var`]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/let#let_vs_var
 - [ECMAScript 6 and Block Scope]: http://ariya.ofilabs.com/2013/05/es6-and-block-scope.html

:smile: Happy :coffee: :scroll:ing  :wink:
