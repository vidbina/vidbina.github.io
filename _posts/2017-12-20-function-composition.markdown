---
layout: post
title: Function Composition
description: |
  Trying to understand Haskell's syntax for function composition through the
  <code>(.)</code> operator akin to $f\circ g$.
date:  2017-12-20 11:04:23 +0000
type: math # for icon
category: # for url
 - fp
tags:
 - fp
 - functional programming
 - haskell
 - composition
 - function composition
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
#twitter:
#  card: summary
#  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
head: mugshot
mathjax: true
emojify: true
---
Here be dragons :dragon:

The [Haskell wiki][haskell-fc] explains function composition as

> the act of pipelining the result of one function to the input of another,
> creating an entirely new function

and that seems relatively easy to wrap one's mind around.

It's just the associativity that confused me initially :confused:.

In Haskell, I defined two simple functions `times3` and `plus1`

```haskell
times3 = (*3)
plus1 = (+1)
```

which I could compose and apply to `2` to yield `7`

```haskell
(plus1 . times3) 2
```

which is "effectively" equivalent to

```haskell
plus1 (times3 2)
```

which demonstrates the piping idea in a manner more palatable to my brain.

The type of the composition operator `(.)` is defined as
$(\beta \to \gamma) \to (\alpha \to \beta) \to \alpha \to \gamma$
which I dumb down to
 - two operands, each being funtions, are composed to produce a new function
 $\alpha \to \gamma$
 - compositions are processed from the rightmost function towards the left
 therefore one may state that, regardless how many compositions are chained
 together:
   - the output type of the leftmost operand (in our simplified expression
   above, function $\beta \to \gamma$) dictates the return type of the
   resulting function (or composition) so I guess it makes sense to state that
   the leftmost function sits at the end of the pipe.
   - the rightmost function represents the first function that will be applied

## Links

 - [Function composition][haskell-fc]
 - [Why is function composition in Haskell right associative?][so-fc-haskell-rassoc]

[haskell-fc]: https://wiki.haskell.org/Function_composition
[so-fc-haskell-rassoc]: https://stackoverflow.com/questions/20342860/why-is-function-composition-in-haskell-right-associative#20344252
