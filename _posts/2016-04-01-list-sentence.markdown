---
layout: post
title: List Sentence
description: |
  Presenting semantic lists as we would've presented them in a sentence.
date:  2016-04-01 13:12:03 +0200
type: web # for icon
category: web # for url
tags:
 - list
 - css
 - html
 - web development
 - web
 - frontend
#og:
#  type: OG:TYPE # http://ogp.me/#types
#  og:type: # 
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: http://example.com
#twitter:
#  card: summary_large_image
#  image: http://example.com
head: mugshot
mathjax: true
---
So I just needed to present a list of authors in an article but I didn't want
to resort to writing a stupid text shoving helper.
The sun :sun: is beating down on me after the pasta :pasta: carbonara I just
devoured so I'm in
a good mood to share a little snippet I may need again in the future :wink:.

So for future me...

Semantically you just need a list, aesthetically you just need something
that is more natural language-ish. $LaTeX$ has a way of dealing with
authors, but we're writing webpages. It's just a matter of
style.

With my two authors, one quite wise and renowned for his
disregard for the ordering we generally respect in English grammar and the
other barely capable of formulating a proper sentence, we are in for a treat.

{% highlight html %}
<ul class="authors">
  <li class="author">Yoda</li>
  <li class="author">Jar Jar Bings</li>
</ul>
{% endhighlight %}

We want to disable the `list-style` and display the list and all it's
elements as `inline-block`s' in order to play ball with the rest of our
sentence, if there is one.

Using pseudo-classes such as `after`, `before` and
allows us to append or prepend some content to our items.

The entire ordeal is only necessary when we have multiple children which is
why we captured everything in a `:not(:only-child)` block.

Now that we're separated the lonely kids from the ones with siblings we need to
ensure that the last child is always properly prefixed with
the phrase _and_.

All other children, except the last two are postfixed with a comma. Note how
`d` and `e` aren't postfixed by anything in `a, b, c, d and e`. We basically
accomplish that by eliminating the last child and the 2nd last child
`:not(:last-child):not(:nth-last-child(2))` and postfixing the rest with a
comma.

The resulting css should look something like the following:

{% highlight scss %}
.authors {
  list-style: none;
  display: inline-block;
  .author {
    display: inline-block;

    &:not(:only-child) {
      &:last-child {
        &:before {
          content: " and ";
        }
      }
      &:not(:last-child):not(:nth-last-child(2)) {
        &:after{
          content: ',';
        }
      }
    }
  }
}
{% endhighlight %}

That's all for now.

If you really must you can prefix the entire `.authors` block or the first
`author` element with the string _by_ but that is up to you.

I can hear you thinking... don't be a lazy fart. Demo this sucker! Well here
goes...
<div class="element">
<p data-height="268" data-theme-id="0" data-slug-hash="EKwZja" data-default-tab="result" data-user="vidbina" class="codepen">See the Pen <a href="http://codepen.io/vidbina/pen/EKwZja/">List Sentence</a> by David Asabina (<a href="http://codepen.io/vidbina">@vidbina</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
</div>
