---
layout: post
title:  How Many Digit Spaces
date:   2014-10-07 16:19:33
type:   mathematics
category: math
tags:
 - mathematics
 - calculus
 - study
mathjax: true
description: "When working with values in different base systems it may be
convenient to know how to determine how much digit spaces a value would
require"
emojify: true
---
Especially when working with microprocessors I frequently have to figure out
how many bits I would need to capture a given value. It so happened to be
that one can easily derrive an answer to that question through the expression
$\lfloor \log\_{b}(q) \rfloor + 1$ where $q$ is the value we want to capture
and $b$ is the number of the base we want to express our value in.


This is a pretty basic expression, but I got to writing this post while
compiling a list of problems to conveniently solve with ``bc`` and catching
myself dumping too much details in that post.

Solving this in `bc` is discussed in that post with `bc` commands
:wink: but to save you a click here goes&hellip; in case you
need to figure out how many bits you will need (base 2) for the value $8$ use
the following command to pipe the statements to bc for processing, needless to
say that you need to change $8$ for whatever value want to represent, and
$2$ for whatever the intended base of your output should be.

```bash
echo "f=l(8)/l(2); scale=0; 1+(f/1)" | bc -l
#echo "p=l(8)/l(2); scale=0; print 1+(f/1), \" bits\"" | bc -l
```

## How many digits are needed to represent a number in base $b$?
The expression $\lfloor \log\_{b}(q) \rfloor + 1$ is the answer to that
problem. Working out $\log\_{b}(q)$ in a calculator is simply done by
calculating $\frac{\log(q)}{\log(b)}$ where $q$ is the number we want to
capture and $b$ is the base of the system we want to represent that value in.


Just to rewind back to a somewhat simpler scenario, let&rsquo;s think base $10$
for a second. We can capture 10 values by just using one decimal place which
are $0$, $1$, $2$, $3$, $4$, $5$, $6$, $7$, $8$ and $9$.
That is quite simple :wink:. For every decimal place we have
to assume a factor of $10^{N}$ where $N$ represents the place of decimal. The
least significant digit is the one furthest to the right such that $47$
equals $(4\times 10^{1})+(7\times 10^{0}) = 40 + 7$.

$\log\_{10}(100) = 2$ means that the value $100$ is captured by the second power
to the base $10^2$. Ones are the zeroeth power to the base ($10^0=1$), tens are
the first power ($10^1=10$) and hundredths are the second power ($10^2=100$).

We need three powers to ten ($10^3$) to represent $1000$, that means 4
digits because the power to zero covers the ones :wink:.
If I ask how many decimal places are needed to represent $978$, you would
answer that we need $\log\_{10}(978) \approx 2.99034$ powers to the ten to
cover it.

After calculating the powers needed to achieve your target value round down
the result to the nearest whole number (we [floor][floorceiling] it) because
we only care about the range the number is in. It is in the tens, hundreds,
thousands, millions, billions, etc. Don&rsquo;t care about the details, we are
generalizing. For the values $100$, $500$ and $999$, which all lie within the
hundreds range, the powers to the tenth base are respectively
$log\_{10}(100) = 2$,
$log\_{10}(500) \approx 2.69897$ and
$log\_{10}(999) \approx 2.99957$.
The whole number we can round it down to is $2$ (hundreds) which gives us 3
decimal places $10^0$, $10^1$ and $10^2$.

The number of digits needed to represent the number equals the next smallest
integer greater than the floor of the logarithm of the number of interest to
with its base set to the base of the output value we are looking for.

$\lfloor \log\_{10}(q) \rfloor + 1$

In the binary world the trick remains the same with a minor difference, the
base changes. If we need 8 represented we determine that we need
three ($\log\_{2}(8) = 3$) powers to two to represent that number. Accounting
for the zeroeth power (the ones) we get four digits and yes
$1000\_{2} is 8\_{10}$.

$\log_{2}{8}$
$\log_{10}(47) = _{}$

The value four is represented as the third decimal digit $100^{10} = 4_{10}$

[bc-writeup]: http://www.basicallytech.com/blog/?/archives/23-command-line-calculations-using-bc.html
[bc]: http://www.gnu.org/software/bc/
[floorceiling]: http://en.wikipedia.org/wiki/Floor_and_ceiling_functions
