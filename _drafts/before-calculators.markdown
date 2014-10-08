---
layout: post
title:  Before GUI Calculators
date:   2014-10-07 16:19:33
type:   tools
category: math
tags:
 - mathematics
 - calculus
 - study
 - tools
 - cli
 - unix
mathjax: true
description: A note-to-self to future me in case I forget how to perform calculation in my terminal without firing up a REPL
---

## How many bits are needed to represent a number?
Just to rewind back to a somewhat simpler scenario, let&rsquo;s think base $10$
for a second. We can capture 10 values by just using one decimal place which 
are $0$, $1$, $2$, $3$, $4$, $5$, $6$, $7$, $8$ and $9$.
That is quite simple {{ ":wink:" | emojify }}. For every decimal place we have
to assume a factor of $10^{N}$ where $N$ represents the place of decimal. The
least significant digit is the one furthest to the right such that $47$ 
equals $(4\times 10^{1})+(7\times 10^{0}) = 40 + 7$.

$\log\_{10}(100) = 2$ means that the value $100$ is captured by the second power
to the base $10^2$. Ones are the zeroeth power to the base ($10^0=1$), tens are
the first power ($10^1=10$) and hundredths are the second power ($10^2=100$).

We need three powers to ten ($10^3$) to represent $1000$, that means 4 
digits because the power to zero covers the ones {{ ":wink:" | emojify }}.
If I ask how many decimal places are needed to represent $978$, you would
answer that we need $\log\_{10}(978) \approx 2.99034$ powers to the ten to
cover it.

After calculating the powers needed to achieve your target value round down
the result to the nearest whole number (we [floor][floorceiling] it) because
we only care about the range the number is in. It is in the tens, hundreds,
thousands, billions, etc. Don&rsquo;t care about the details, we are 
generalizing. For the values $100$, $500$ and $999$, which all lie within the 
hundreds range, the powers to the tenth base are respectively 
$log\_{10}(100) = 2$,
$log\_{10}(500) \approx 2.69897$ and 
$log\_{10}(999) \approx 2.99957$.
The whole number we can round it down to is $2$ (hundreds) which gives us 3
decimal places $10^0$, $10^1$ and $10^2$.

$\lfloor \log_{10}(q) \rfloor + 1$

In the binary world the trick remains the same with a minor difference, the
base changes. If we need 8 represented we determine that we need 
three ($\log\_{2}(8) = 3$) powers to two to represent that number. Accounting
for the zeroeth power (the ones) we get four digits and yes 
$1000\_{2} is 8\_{10}$.

$\log_{10}{100}$ 
$\log_{10}(47) = _{}$

The value four is represented as the third decimal digit $100^{10} = 4_{10}$

[bc-writeup]: http://www.basicallytech.com/blog/?/archives/23-command-line-calculations-using-bc.html
[bc]: http://www.gnu.org/software/bc/
[floorceiling]: http://en.wikipedia.org/wiki/Floor_and_ceiling_functions
