---
layout: post
title: List Sentence
description: |
  Presenting HTML lists as we would've presented them in a sentence.
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
 - star wars
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/list-stars.png
twitter:
  card: summary
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/list-stars.png
head: mugshot
mathjax: true
emojify: true
---
So I just needed to present a list of authors in an article but I didn't want
to resort to writing a stupid text shoving helper.

The sun :sunny: is beating down on me but I need to sit it out since my dark
skin needs more exposure to produce my dosages of vitamin D. While devouring
my pasta :spaghetti: carbonara I decided to share a little snippet I
may need again in the future :wink:.

<div class="element instagram">
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:30.8796296296% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BDqHlkPy0Lz/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Back in #Berlin 🇩🇪 and basking in the sun 🌞 to produce #vitamin #D. Just had some pasta 🍝 while getting some #html #css stuff done. Such a difference from the mind numbing puzzles 🀄 I generally try to solve. Felt like a kid for a second. #playtime #html #css #fun -- #piece of #cake 🍰 but I can&#39;t do this all day 😝 https://vid.bina.me/web/list-sentence/</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A photo posted by David Asabina (@vidbina) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2016-04-01T12:44:50+00:00">Apr 1, 2016 at 5:44am PDT</time></p></div></blockquote>
<script async defer src="//platform.instagram.com/en_US/embeds.js"></script>
</div>

So for future me...

Semantically you just need a list, aesthetically you just need something
that is more natural language-ish. $LaTeX$ has a way of dealing with
authors, but we're writing webpages. It's just a matter of
style.

With my two authors, one quite wise and renowned for his
disregard for the ordering we generally respect in English grammar and the
other barely capable of formulating a proper sentence, we are in for a treat.

```html
<ul class="authors">
  <li class="author">Yoda</li>
  <li class="author">Jar Jar Bings</li>
</ul>
```

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

```scss
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
```

That's all for now.

If you really must you can prefix the entire `.authors` block or the first
`author` element with the string _by_ but that is up to you.

I can hear you thinking... don't be a lazy fart. Demo this sucker! Well here
goes...
<div class="element">
<p data-height="268" data-theme-id="0" data-slug-hash="EKwZja" data-default-tab="result" data-user="vidbina" class="codepen">See the Pen <a href="http://codepen.io/vidbina/pen/EKwZja/">List Sentence</a> by David Asabina (<a href="http://codepen.io/vidbina">@vidbina</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
</div>
