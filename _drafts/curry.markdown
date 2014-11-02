---
layout: post
title:  Curried
since:  2014-10-31 19:33:32
date:   2014-10-31 19:33:32
type:   coding
tags:
 - function programming
 - programming
 - software
 - computer science
 - code
description: "Drooling at some of the Scala wonders"
---
I have stumbled upon currying in it multiple languages among which Haskell and 
Scala and I find it absolutely gorgeous&hellip; currying.
I already have a few ideas of possible use-cases, but quite frankly I need to 
know how to gods use currying in order to play ball like the gods do 
{{ ":grin:" | emojify }}.

The most basic explanation of currying is seperating a single action into
multiple actions. Almost like adding on paper you:
 1. start on the rightmost column
 1. calculate the outcome of the digits in the column
 2. if necessary (because the outcome is greater than $10$) _carry_ something, 
 everything except the least significant digit (in ihe case of $123$ that would 
 be $12$) to the the column to the left of our current column
 3. jump to the column we just carried to (that one to our current 
 column&rsquo;s left)
 4. repeat step 2 until we&rsquo;ve processed all columns

      22  <- carries
      397
      456
      231
      578 +
    -----
     1662

The summation of \\(397\\), \\(456\\), \\(231\\) and \\(578\\) has been 
seperated into 3 seperate operations because this problem involved three 
decimal places (ones, tens and hundreds). Fortunately for us, the manner in
which computers process computation eliminates the need for us to go ahead and
help it execute long additions.
3+4 = 11 + 100 = 111 = 7
4+4 = 100 + 100 = 1000 = 8
3+3 = 11 + 11 = 110 = 6
5+3 = 101 + 11 = 1000 = 8

Currying in Scala is not exactly analogous to the carry example just
demonstrated but there are some simarities in the underlying idea -- dividing
a single operation into multiple jobs which are to be executed at different 
times if necessary.

The following represents a typical curry implementation in Scala
{% highlight scala %}
def multiplier (a:Int)(b:Int): Int = a * b
// multiplier: (a: Int)(b: Int)Int
{% endhighlight %}

We could compute multiplations by placing two function calls. One to pass 
```a``` and another to pass ```b```.
{% highlight scala %}
multiplier(12)(2)
// resX: Int = 24
{% endhighlight %}

Currying is most interesting when we want to split the operation to be 
executed at different times. It may be that only part of the input information
is known. Instead of holding on to the data until all input information is 
known, the data could already be plugged into the black box. The rest of the
information will be passed along whenever available.

Image the situation where one wants to have the multiplier double or triple a
value but does not yet know which value to perform this operation on. In that
case we could derrive an anonymous function that already passed the known 
parameter into the black box, allowing for the other parameter to be added later
whenever available.

{% highlight scala %}
val doubler = multiplier(2) _
val tripler = multiplier(3) _
{% endhighlight %}

Note that the underscore is used to return a anonymous function in this case.
Because we have defined ```multiplier``` as a named function we will not be 
able to make incomplete calls. If we would like to pass the lambda of the 
partially applied function we will need to use the underscore after the 
function call to derrive the lambda.
Because ```multiplier``` is a curried function it only requires the parameters
necessary in the first level of the function chain. After added
Someone has decided that a value
needs to be doubled or tripler, however; we do not yet know the value to be
subjected to this treatment.  By calling the ```multiplier``` function and 
passing the underscore after specifying the first argument we&rsquo;ve 
already taken the liberty to partially instruct the interpreter how to handle 
the multiplication. Now it is time for some dark magic, shifting things around 
passing the function as an argument to other functions somewhere in a function 
chain and instructing the multiplier to finish up when we finally know the 
rest of the necessary information. When we received that pigeon message or 
telegram wire that kindly requests us to double the value six.
{{ ":wink:" | emojify }}.

{% highlight scala %}
doubler(6)
// resX: Int = 12
{% endhighlight %}

Simply calling ```multiplier _``` would return an anonymous function that 
copies the ```multiply``` logic. As such the two calls with the necessary 
arguments would be necessary in order to get final results from our function.

## Alternatives
Now you should be familier with the syntax for defining curried functions.
{% highlight scala %}
def multiplier (a:Int)(b:Int): Int = a * b
// doubler: Int => Int = <function1>

val doubler = multiplier(2) _
// doubler: Int => Int = <function1>
val tripler = multiplier(3) _
// tripler: Int => Int = <function1>
{% endhighlight %}

You could also achieve somewhat the same effect by defining a function that
return a function that requires the subsequent element in your curry setup.
{% highlight scala %}
val multiplier = (m:Int) => ((n:Int) => m * n)
// multplier: Int => (Int => Int) = <function1>

val doubler = multiplier(2)
// doubler: Int => Int = <function1>
val tripler = multiplier(3)
// tripler: Int => Int = <function1>
{% endhighlight %}

We saved the lambda of every function in order to allow storage into a 
variable. The result can be achieved by passing the remaining argument to
the function direction or through the ```apply``` method.

{% highlight scala %}
doubler(41)
// resX: Int = 92

doubler.apply(43)
// resX: Int = 86
{% endhighlight %}

## The return type
From my amateuristic observations I have deduced that anonymous functions,
although capable of performing the same tasks as their named counterparts
are quite different.
{% highlight scala %}
val multiplier = (a: Int, b: Int) => a+b
// multiplier: (Int, Int) => Int = <function2>
{% endhighlight %}

For starters the following observations have been made:
 
 - anonymous functions infer their return type, named functions allow the return
 type to be explicitely set
 - anonymous functions may be passed around like we handle variables, named
 functions need to be executed

{% highlight scala %}
def multiplier(a: Int, b:Int): Int = a+b
// multiplier: (a: Int, b: Int)Int
{% endhighlight %}

## Partial application
Through a heuristic process the following interesting Scala features were
discovered.

### Anonimizing Named Functions
Using the underscore, it becomes possible to convert a named function into a
lambda.

{% highlight scala %}
def greet(name: String): String = "Hi " + name
// greet: (name: String)String
{% endhighlight %}

The ```greet``` function returns a String, but in some situations it may be 
necessary to call ```greet``` sometime in the future. Any call to great 
attempts to evaluate the function, but using the partial application feature 
one can call ```greet _``` which inadvertently would generate an anonymous 
function which we can pass around.

{% highlight scala %}
val greeter = greet _
// greeter: String => String = <function1>

greeter("Mona")
// resX: String = Hi Mona
{% endhighlight %}

In the example above we declared the ```greeter``` variable which partially 
applies the ```greet``` function. The underscore here basically tells 
```greeter``` to expect the parameters later, but copy the logic at the moment.

{% highlight scala %}
def quadratic(a: Int, b: Int, c: Int)(x: Int): Int = (a * x^2) + (b * x) + c
{% endhighlight %}
