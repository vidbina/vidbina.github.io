---
layout: post
title:  Basic Operator Properties
date:   2014-03-11 16:51:33
type:   mathematics
category: math
tags:
 - mathematics
 - calculus
 - study
mathjax: true
redirect_from:
  - /2014/03/11/op-properties.html
  - /op-properties/
description: A quick glance at some of the properties of operators as commonly encoutered in my ventures through the world of computer science and mathematics.
emojify: true
---

## Associativity
The associative law basically states that the association one makes for
a set of tokens in an equation, to be subjected to the same type of operation,
is not influential to the outcome of the evaluation.

\\(a+b+c = a+(b+c) = (a+b)+c = (a+c)+b \\)

In the former case all elements $a$, $b$ and $c$ are to be subjected to the
same type of operation &dash; addition. The addition operator happens to be
associative so however we influence the precedence of any of the addition
operators, the result would remain the same. The same cannot be said for
exponentiation for example.

### Left, Non, Right
Operators may be left-associative, non-associative or right-associative. In the
case of left-associative operators, one should imagine that all tokens to the
left of the operator are evaluated prior to executing the operation.
For right-associative operators you just have to imagine the same as
left-associative operators with the left substituted for right.
Non-associative operators simply don't care.

Addition and subtraction operators are mostly dealt with as being left
associative which is why $a+b-c+d$ would be evaluated as $((a+b)-c)+d$.
Division and multiplication are also left-associative operations.

Exponentiation is a right-associative operation, so we evaluate everything to
the right of the operator prior to executing the current operation leading to
\\(a^{b^{c}}\\) being evaluated as \\(a^{(b^c)}\\). In many computer languages
the exponentiation operation is represented by the (caret) `^` expressing
$a^b$ as `a^b`. Mistakingly dealing with exponents as left-associative
would cause one to evaluate $a^{b^{c}}$ as $(a^b)^c$ which would cause
erronous results in most cases (in the cases where $a=b=c$ you could have many
fooled when applying the operation with a blatant disregard for associativity
:scream:).

## Commutativity
Commutativity is always tied to an operator. The property deals with the
influence of the order of the operands connected by the operator. In the
case of addition we could say that the operator is commutative because
$a+b$ and $b+a$ evaluate to the same result.

In many computer languages the `^` operator is often used to represent
exponentiation where `a^2` represents $a^{2}$. That the `^` operator
is not commutative becomes quite evident when you realize that interchanging
the operands causes entirely different results in some cases especially
when the operands are not equal to each other.

 - notice that $1^{2} = 1$ while $2^{1} = 2$
 - $2^3 = 8$ while $3^{2} = 9$
 - when the operands are similar (both $2$) swapping the order has no effect because $2^{2} = 4$ either ways :wink:
 - but in some cases swapping different operands may still return the same result as $4^2 = 16$ and $2^4 = 16$ as well :speak_no_evil:

Cross-products are also non-commutative, but I suppose the concept of
commutativity is clear with the given example, so no need to spend more
time on that one.

## And&hellip;
Whenever in the mood, I might discuss the other op properties in this note :wink:.
