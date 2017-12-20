---
layout: post
title: Function Composition
description: |
  Trying to understand Haskell's syntax for Function Composition
date:  2017-12-20 11:04:23 +0000
type: fp # for icon
category: fp # for url
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
---
Here be dragons :dragon:

The Haskell wiki explains function composition as

> the act of pipelining the result of one function to the input of another,
creating an entirely new function

and that seems relatively easy to wrap one's mind around.

It's just the associativity that gets to me :confused:.

In Haskell, I defined two simple functions `times3` and `plus1`

```haskell
times3 = (*3)
plus1 = (+1)
```

which I could compose and apply to `2` to yield `7`

```haskell
(plus1 . times3) 2
```

which is effectively equivalent to

```haskell
plus1 (times3 2)
```

which demonstrates the piping idea a bit better.

The type of the composition operator `(.)` is defined as
$(\beta \to \gamma) \to (\alpha \to \beta) \to \alpha \to \gamma$
which I guess means that
 - the output type of the first function $\beta \to \gamma$ dictates the type
 of the resulting or composed function so I guess it makes sense to state that
 the first function sits at the end of the pipe.

## Links

[haskell-fc]: https://wiki.haskell.org/Function_composition
