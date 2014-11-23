---
layout: post
title:  Before GUI Calculators
date:   2014-10-07 16:19:33
type:   tools
category: tools
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
Sometimes these basic questions pop up that need me to seek the counsel of a
calculations oracle. Because I am somewhat of a terminal hermit it helps to
be able to have your math executed there as well. No GUI calcs, no REPLs for
your favorite flavor languages -- just simple math.


## Change of base
The expression $\lfloor \log\_{b}(q) \rfloor + 1$ is the answer to all _How 
many digits in base $b$ are used to represent the value $q$_ questions.

I pipe some statements to `bc` in the following manner to solve how many bits
I would need to capture $44$:

{% highlight bash %}
echo "f=l(44)/l(2); scale=0; 1+(f/1)" | bc -l
{% endhighlight %}

If you want to know how many digits you would need to represent the decimal
value $57$ in the octal (base 8) system we ask:

{% highlight bash %}
echo "f=l(57)/l(8); scale=0; 1+(f/1)" | bc -l
{% endhighlight %}

If I want to capture the value $665$ in hex (base 16) I run
{% highlight bash %}
echo "f=l(665)/l(16); scale=0; 1+(f/1)" | bc -l
{% endhighlight %}

## The binary representation of any number?
Provided that we want to convert the decimal number $165$ to a binary number we
can do the previous thing for base $2$ or simply execute:

{% highlight bash %}
echo "obase=2; 165" | bc
{% endhighlight %}

So simple {{ ":smile:" | emojify }}

[bc-writeup]: http://www.basicallytech.com/blog/?/archives/23-command-line-calculations-using-bc.html
[bc]: http://www.gnu.org/software/bc/
[floorceiling]: http://en.wikipedia.org/wiki/Floor_and_ceiling_functions

[digit-spaces]: /math/digit-spaces/
