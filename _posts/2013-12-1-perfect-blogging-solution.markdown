---
layout: post
title:  "The perfect blog..."
date:   2013-12-29 03:32:51
thumbnail: nil
categories: design tools
description: My discoveries while rummaging through toolboxes looking for the blogging solution that works for me
---

I've had a few people ask me why I wasn't maintaining some blog and I've always
has some excuses to convince me why I didn't. Last saturday was a conversation
too many and I decided to actually give blogging a serious try this time, but
where to start...

## Needs/Requirements
Any decent quest requires some objectives (how else would I know if I'd
succeeded?). So here goes... I need something that:

 1. supports markdown
 2. supports LaTeX-like formulas
 - supports embedded web content
 - runs as lean as possible
 - does not introduce new security hazzards
 - grants me (and me alone) full control to my data
 - is simple
 - looks nice
 - adjusts well to different screen sizes
 - offers me some metrics

## Machinery
I've ignored [Wordpress][wordpress] and quickly glanced over [Ghost][ghost].
Already partial to a solution that generates static content... that is not
going to change anytime soon. I don't see the need for tending databases,
maintaining a CMS, setting up authentication chains between applications and
datasources, and scrolling through logs of bots all over the globe trying to
bruteforce my database and CMS passwords.

I do a lot of coding in Ruby, Python, Javascript and C-ish languages so I guess
any solution friendly to these languages will work for me. Jekyll was too easy
to warrant moving on to test other solutions, but nanoc, DocPad and Hyde would
probably suffice as well. All basically do the same thing (generate static
websites) with minute differences.

## Design
I'm not a designer

## Embedded Content
Tweets are practically copy pasted in here&hellip;
<div class="element">
  <blockquote class="twitter-tweet" lang="en"><p>Those days when nothing seems to work :P… that’s when I abandon the code and turn to the piano <a href="https://twitter.com/search?q=%23coders&amp;src=hash">#coders</a> <a href="https://twitter.com/search?q=%23block&amp;src=hash">#block</a></p>&mdash; David Asabina (@vidbina) <a href="https://twitter.com/vidbina/statuses/417369790718959616">December 29, 2013</a></blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

&hellip;as are Youtube videos and other fascinating content.
<div class="element video">
  <iframe src="//www.youtube.com/embed/j8cKdDkkIYY" frameborder="0" allowfullscreen></iframe>
</div>

Nowadays any decent facilitator offers a quick way of embedding content into
webpages.

[font-choice-tnw]: http://thenextweb.com/dd/2011/03/02/whats-the-most-readable-font-for-the-screen/#!qQBqd
[usability-columns-wichita]: http://psychology.wichita.edu/surl/usabilitynews/72/columns.asp
[long-sentences-codinghorror]: http://www.codinghorror.com/blog/2006/06/text-columns-how-long-is-too-long.html
[ghost]: https://ghost.org
[wordpress]: https://wordpress.org
[comparison-jekyll-vs-hyde]: http://philipm.at/2011/jekyll_vs_hyde.html
[list-of-10-generators]: http://www.webhostingbillboarders.com/development/10-powerful-free-static-website-generators/
[darklight-stackexchange-ux]: http://ux.stackexchange.com/questions/35837/why-do-most-websites-use-a-white-background
[darklight-text-ux]: http://uxmovement.com/content/when-to-use-white-text-on-a-dark-background/
[darklight-dosdonts]: http://www.webdesignerdepot.com/2009/08/the-dos-and-donts-of-dark-web-design/
[ratiolock-css3]: http://www.mademyday.de/css-height-equals-width-with-pure-css.html
