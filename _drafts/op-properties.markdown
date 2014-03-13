---
layout: post
title:  Basic Operator Properties
date:   2014-03-11 16:51:33
type:   mathematics
tags:
 - mathematics
 - calculus
 - study
mathjax: true
description: A quick glance at some of the properties of operators as commonly encoutered in my ventures through the world of computer science and mathematics.
---

## Associativity
The associative law basically states that the association one makes for
a set of tokens in an equation, at the same level of precendence, is not
influential to the outcome of the evaluation.

\\(a+b+c = a+(b+c) = (a+b)+c = (a+c)+b \\)

In the former case all elements $a$, $b$ and $c$ reside at the exact same
level of precedence. Due to this given, the order utilized in evaluating the
equation should not result to different outcomes.

## Commutativity
Commutativity is always tied to an operator. The property deals with the
influence of the order of the operands connected by the operator. In the
case of addition we could say that the operator is commutative because
$a+b$ and $b+a$ evaluate to the same result. 

In many computer languages the ```^``` operator is often used to represent
exponentiation where ```a^2``` represents $a^{2}$. That the ```^``` operator
is not commutative becomes quite evident when you realize that interchanging
the operands causes entirely different results in some cases especially
when the operands are not equal to each other.

 - notice that $1^{2} = 1$ while $2^{1} = 2$
 - $2^3 = 8$ while $3^{2} = 9$
 - when the operands are similar (both $2$) swapping the order has no effect because $2^{2} = 4$ either ways {{ ":wink:" | emojify }}
 - but in some cases swapping different operands may still return the same result as $4^2 = 16$ and $2^4 = 16$ as well {{ ":speak_no_evil:" | emojify }}

Cross-products are also non-commutative, but I suppose the concept of
commutativity is clear with the given example, so no need to spend more
time on that one.

## And&hellip;
Whenever in the mood, I might discuss the other op properties in this note {{ ":wink:" | emojify }}.
