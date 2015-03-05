---
layout: post
title:  Simple Sigmas
date:   2015-03-05 09:22:33
type:   tools
category: math
tags:
 - mathematics
 - calculus
 - study
mathjax: true
description: Just unearthing a few gems that should make series summation so much simpler
---
Yesterday I spent the better half of the day designing and testing running 
variance and SMA functions for a project I happen to be working on. As with all
things in embedded systems, memory is scarce. Therefore we abstain from 
remembering sets of information as much as possible. 

For the running variance problem, I stumbled upon Welford's method for 
computing variance, but that is another story {{ ":bulb:" | emojify }}.

Anyways... While refreshing some of the basic math skills whilst working on the 
problem I [rediscovered some amazing properties that one should exploit whenever
performing summation operations on series][sigma-notation].

$\Sigma\limits\_{i=1}^{n} 1 = n$

$\Sigma\_{i=1}^{n} c = c \cdot n$

$\sum\limits\_{i=1}^{n} i = \frac{n(n + 1)}{2} $

$\sum\limits\_{i=1}^{n} i^2 = \frac{n(n + 1)(2n + 1)}{6} $

$\sum\limits\_{i=1}^{n} i^3 = (\frac{n(n + 1)}{6})^2 $

[sigma-notation]: http://www.math.binghamton.edu/grads/kaminski/Math221_Fall09/AppE_notes.pdf
