---
layout: post
date: 2013-06-19T10:58:00+02:00
title: "Housekeeping with DataMapper\'s Sweatshop"
tags:
- datamapper
- sweatshop
- testing
- ruby
- tdd
- software development
categories: code
tumblr_url: http://vid.bina.me/post/53360841572/housekeeping-with-datamappers-sweatshop
type: code
---
This is a note to the future-me using [DataMapper](datamapper) 
[Sweatshop](dm-sweatshop) (who might have forgotten this) and anyone else who
might need this info. It might be useful if you keep on getting
`nil` when using `pick` or when running into `TooManyTriesException` when using
the `unique` method

## Remembered Unique Values
If you run into `TooManyTriesException` whilst using the Sweatshop&#8217;s 
`unique` method you might need to clean up after yourself. The Sweatshop keeps 
track of all records it spawns over time and the values it presents as unique 
values in an effort the maintain a blacklist of already used values.


I usually purge and repopulate tables prior to unleashing my assertions unto 
the code that query them. The `unique_map`, however; remembers all values for 
unique fields until the map is explicitly cleared or until the ruby instance 
is terminated. Even destroying your records won&#8217;t clear entries from the 
`unique_map`

In order to get rid of the `TooManyTriesException`s I clear the `unique_map` 
in the helper I use to clean up after myself (most likely the `after`helper).

{% highlight ruby lineos %}
DataMapper::Sweatshop::UniqueWorker.unique_map.clear</pre>
{% endhighlight %}

##Picking and the Record Map
It might occur to you that in some cases the `pick` method returns valid 
content while `get`ting the same `id` from the database returns `nil`.

{% highlight ruby lineos %}
> p = Frog.pick # should return something to variable p
#<Frog @id=2 @name="Kermit">
> Frog.get(p.id)
nil
{% endhighlight %}

The record map seems to be used by Sweatshop as a store of all items it has 
generated for `pick`-ing among a few other things I haven&#8217;t looked into. 
In my tests I prefer the succinct `pick` notation instead of `all.sample`. I 
also have this habit of destroying the old and spawning some new records for 
every test just to start of with a clean slate with known properties required 
for that specific test. It is important, however; to be aware of the fact that 
the `record_map` <em>does not keep track of the the table entries removed</em> 
during its lifetime. Given this behavior you will need to clear the `record_map` after destroying some records unless you occasionally need to `pick` nonexistent entities.</p>

Just like I clean up the `unique_map`, I clean up up my `record_map` in the 
test helper which does all the clean-up housekeeping.


{% highlight ruby %}
DataMapper::Sweatshop.record_map.clear
{% endhighlight %}

[datamapper]: http://datamapper.org/
[dm-sweatshop]: http://rubygems.org/gems/dm-sweatshop
