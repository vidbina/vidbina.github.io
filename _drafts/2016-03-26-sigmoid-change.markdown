---
layout: post
title: Sigmoid Change
description: |
  The sigmoid function provides a derrivable alternative for step function.
  Take a look at how we derrive the sigmoid function and observe why she is so
  elegant.
date:  2016-03-26 17:17:52 +0100
type:  math # for icon
category: math # for url
tags:
 - math
 - derrivative
 - functions
 - step function
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: http://example.com
#twitter:
#  card: summary_large_image
#  image: http://example.com
mathjax: true
---
So a sigmoid looks like this:

$$\sigma(x) = \frac{1}{1+e^{-x}}$$

The sigmoid is an elegant function because it provides an alternative to the
step function. The step function is not [differentiable][differentiable]
because of the [jump discontinuity][jump-discontinuity] at $x = 0$.

$$\frac{d}{dx} \sigma(x) = \frac{d}{dx} \frac{1}{1+e^{-x}}$$

Let's stick to the Lagrange notation for a bit where we notate the derivative
to $f(x)$ as $f'(x)$. Given $f(x) = \frac{a(x)}{b(x)}$, the quotient rule would
state that:

$$f'(x) = \frac{a'(x)\cdot b(x) - a(x)\cdot b'(x)}{b(x)^2}$$

Now that we know how to work out the derivative to a quotient we can basically
work out $a'(x)$ and $b'(x)$ in order to fill in the blanks later.

$$ % show how to differentiate numerator and denominator
\begin{align}
  a(x)  &= 1                  &  b(x)  &= 1+e^{-x} \\
  a'(x) &= \frac{d}{dx}1 = 0  &  b'(x) &= \frac{d}{dx}1 + \frac{d}{dx}e^{-x} = -1 e^{-x} \\
%        &                     &        & \frac{d}{dx}e^{-x} &= (\frac{d}{dx}(-x))\cdot e^{-x} \\
\end{align}$$

Working out the math for the derivative to $\frac{1}{1+e^{-x}}$ leads to the
following result, given the quotient rule:

$$f'(x) = \frac{-1\cdot (-1 e^{-x})}{(1+e^{-x})^2} = \frac{e^{-x}}{(1+e^{-x})^2}
$$

It's pretty clear that $e^{-x}$ is equal to $(1+e^{-x})-1$. That part is
trivial to understand, however; it is pretty brilliant to have the insight to
organize the token as such in order to be able to eliminate tokens in the next
step through this substitution.

$$\frac{(1+e^{-x})-1}{(1+e^{-x})^2}$$

Go the extra mile to separate the expression into two separate terms

$$\frac{(1+e^{-x})}{(1+e^{-x})^2} - \frac{1}{(1+e^{-x})^2}$$

We can simplify the first term since there is a $(1+e^{-x})$ in both
the numerator and denominator. The second term can be simplified by
squaring the numerator; an operation which doesn't change a darn thing since
the square of one remains one, yet this operation paves the way to squaring
the entire term (numerator and denominator) which offers another
simplification $\frac{a^n}{b^n} = (\frac{a}{b})^n$.

$$\frac{1}{(1+e^{-x})} - \bigg(\frac{1}{(1+e^{-x})}\bigg)^2$$

Since $\sigma(x)$ is equals to $\frac{1}{1+e^{-x}}$ as we've seen in the
definition (first expression in this post), we can simplify our result to.

$$\sigma(x) - \sigma(x)^2$$

Which gives us the beautiful derivative of a sigmoid. They don't make it any
simpler than this :wink:.

$$
% \frac{d}{dx} \frac{1}{1+e^{-x}} &= \frac{\frac{d1}{dx}\cdot{(1+e^{-x})-\frac{d(1+e^{-x})}{dx}}}{(1+e^{-x})^2}
$$

[step-function]: https://en.wikipedia.org/wiki/Step_function
[jump-discontinuity]: https://en.wikipedia.org/wiki/Classification_of_discontinuities#Jump_discontinuity
[differentiable]: https://en.wikipedia.org/wiki/Differentiable_function
[diff-notation]: http://www.maths.manchester.ac.uk/~cds/articles/derivative.pdf
[youtube-sigmoid]: https://www.youtube.com/watch?v=aVId8KMsdUU
