---
layout: post
title: Sigmoid Change
description: |
  The sigmoid function provides a differentiable alternative to the step
  function. Derrive the sigmoid function and observe why she is so elegant.
date:  2016-03-26 17:17:52 +0100
type:  math # for icon
category: math # for url
tags:
 - calculus
 - derrivative
 - differentiation
 - functions
 - fundamentals
 - machine learning
 - math
 - mathematics
 - sigmoid function
 - step function
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/weightedsigmoid_thumb.png
twitter:
  card: summary
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/weightedsigmoid_thumb.png
mathjax: true
function_plot: true
head: mugshot
mugshot_description: My face in 2015, I probably still look like this.
emojify: true
---
{% assign graphs = true %}
Step functions enforce some threshold on a variable e.g.: discard anything
below a certain value. Given $u(x)$ any value equal to or greater than $0$
would trigger a positive output ($1$ in this case), everything else just equals
zero. With $3u(x-8)$ everything equal to or greater than $8$ triggers a
non-zero output ($3$ in this case).

$$u(x) \begin{cases}
0 & \mbox{if} & x < 0 \\
1 & \mbox{if} & x \geq 0 \\
\end{cases}$$

Step functions are like switches. We could utilise them to trigger a signal
whenever a threshold is crossed. Imagine opening the floodgates whenever the
water level crosses a certain point or turning of the electric lighting when the
ambient light brightness exceeds a given measure.

Perceptrons, binary classifiers and the neurons in artificial neural networks
require an activation function in order to produce any output. The step
function is a valid option for the activation function but poses a challenge
in analysis because of the [jump discontinuity][jump-discontinuity] at $x=0$.

<div class="element note">
At $x=0$ the derivative is undefined ($\frac{\infty}{0}$) while the derivative
is zero for the remainder of the domain.
</div>

$$\sigma(x) = \frac{1}{1+e^{-x}}$$

The sigmoid function $\sigma(x)$, because of its differentiability :wink:, is
sometimes used as an alternative to the step function $u(x)$.

{% if graphs %}
<div class="element graph">
  <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function(event) {
      functionPlot({
        title: "step & sigmoid",
        width: 300,
        height: 225,
        target: "#sigmoid-step",
        grid: true,
        disableZoom: true,
        xAxis: {domain: [-10,10]},
        yAxis: {domain: [-0.1, 1.1]},
        data: [
          {
            fn: "1/(1+exp(-x))",
            derivative: {
              fn: "1/(1+exp(-x)) - (1/(1+exp(-x)))^2",
              updateOnMouseMove: true
            }
          },
          {
            points: [[-100,0], [0,0], [0,1], [100, 1]],
            fnType: 'points',
            graphType: 'polyline',
          },
        ]
      });
    });
  </script>
  <div id="sigmoid-step"></div>
</div>
{% endif %}

<div class="element note">
Why care for differentiability? Well, when determining the coefficients for a
neural network methods such as _back propagation_ depend on the ability to
determine the rate of change in the network output per change in the
coefficients. Imagine that we assign coefficients at random initially. Through
_back propagation_, we attempt to change every coefficient and determine how
quickly each change converges the output of the network towards target value
(given a certain set of input values). We choose to enforce the more favorable
change and proceed towards the next iteration in which we repeat the process
until the output of the network is sufficiently close to the target value.
This process involves as much partial derivatives as we have coefficients to
determine.
</div>

Some may choose to introduce a weight $\beta$ to the input variables in order
to obtain a sigmoid curve more reminiscent of the step we're trying to mimic.
By tweaking the $\beta$ term, one can obtain a result that approaches the step
function, yet remains differentiable throughout its entire domain :smile:. The
graph below demonstrates the output of a sigmoid function with a $\beta$ of
$1$, $2$, $10$ and $100$, where a plot of $\beta = 100$ approximates the step
function quite closely in comparison to the other plots.

$$\sigma(x) = \frac{1}{1+e^{-x\beta}}$$

{% if graphs %}
<div class="element graph">
  <script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function(event) {
      functionPlot({
        width: 300,
        height: 225,
        target: "#sigmoid",
        title: "weighted sigmoids",
        grid: true,
        disableZoom: true,
        xAxis: {domain: [-6,6]},
        yAxis: {domain: [-0.1, 1.1]},
        data: [
          {
            fn: "1/(1+exp(-x))",
            derivative: {
              fn: "1/(1+exp(-x)) - (1/(1+exp(-x)))^2",
              updateOnMouseMove: true
            }
          },
          {
            fn: "1/(1+exp(-2x))",
            derivative: {
              fn: "1/(1+exp(-2x)) - (1/(1+exp(-2x)))^2",
              updateOnMouseMove: true
            }
          },
          {
            fn: "1/(1+exp(-10x))",
            derivative: {
              fn: "1/(1+exp(-10x)) - (1/(1+exp(-10x)))^2",
              updateOnMouseMove: true
            }
          },
          {
            fn: "1/(1+exp(-100x))",
            derivative: {
              fn: "1/(1+exp(-100x)) - (1/(1+exp(-100x)))^2",
              updateOnMouseMove: true
            }
          },
        ]
      });
    });
  </script>
  <div id="sigmoid"></div>
</div>
{% endif %}

However enticing, during this post we'll keep our eyes set on the unweighted
sigmoid.

## Derivation of the Sigmoid

Let's find the derivative of the unweighted sigmoid.

$$\frac{d}{dx} \sigma(x) = \frac{d}{dx} \frac{1}{1+e^{-x}}$$

Let's stick to the Lagrange notation for a bit where we notate the derivative
to $f(x)$ as $f'(x)$. Given $f(x) = \frac{a(x)}{b(x)}$, the quotient rule would
state that:

$$f'(x) = \frac{a'(x)\cdot b(x) - a(x)\cdot b'(x)}{b(x)^2}$$

Now that we know how to work out the derivative to a quotient we can basically
work out $a'(x)$ and $b'(x)$ in order to fill in the blanks later.

$$ % show how to differentiate numerator and denominator
\begin{align}
  a(x)  &= 1                  \\
  a'(x) &= \frac{d}{dx}1 = 0  \\
  b(x)  &= 1+e^{-x} \\
  b'(x) &= \frac{d}{dx}1 + \frac{d}{dx}e^{-x} = -1 e^{-x} \\
\end{align}$$

Working out the math for the derivative to $\frac{1}{1+e^{-x}}$ leads to the
following result, given the quotient rule:

$$f'(x) = \frac{-1\cdot (-1 e^{-x})}{(1+e^{-x})^2} = \frac{e^{-x}}{(1+e^{-x})^2}
$$

It's pretty clear that $e^{-x}$ is equal to $(1+e^{-x})-1$. That part is
trivial to understand, however; it is pretty brilliant to have the insight to
organize the tokens as such in order to be able to eliminate tokens in the
next step through this substitution.

$$\frac{(1+e^{-x})-1}{(1+e^{-x})^2}$$

Go the extra mile to separate the expression into two separate terms:

$$\frac{(1+e^{-x})}{(1+e^{-x})^2} - \frac{1}{(1+e^{-x})^2}$$

We can simplify the first term since $(1+e^{-x})$ occurs in both the numerator
and denominator. The second term can be simplified by expressing the value as
the square of something which is simply $1 = 1^2$, yet this operation paves
the way to squaring the entire term since $\frac{a^n}{b^n} = (\frac{a}{b})^n$.

$$\frac{1}{(1+e^{-x})} - \bigg(\frac{1}{(1+e^{-x})}\bigg)^2$$

Since $\sigma(x)$ equals $\frac{1}{1+e^{-x}}$ we can simplify our result to:

$$\sigma(x) - \sigma(x)^2$$

which gives us the beautiful derivative of a sigmoid.

They don't make it any simpler than this :wink:.

[step-function]: https://en.wikipedia.org/wiki/Step_function
[jump-discontinuity]: https://en.wikipedia.org/wiki/Classification_of_discontinuities#Jump_discontinuity
[differentiable]: https://en.wikipedia.org/wiki/Differentiable_function
[diff-notation]: http://www.maths.manchester.ac.uk/~cds/articles/derivative.pdf
[youtube-sigmoid]: https://www.youtube.com/watch?v=aVId8KMsdUU
[humprys-notes-sigmoid]: http://www.computing.dcu.ie/~humphrys/Notes/Neural/sigmoid.html
