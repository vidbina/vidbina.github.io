---
layout: post
title:  The perfect blog...
date:   2013-12-29 03:32:51
type: tools
tags:
 - design
 - code
 - tools
 - web
 - devices
mathjax: true
redirect_from:
  - /2013/12/29/perfect-blogging-solution.html

description: My discoveries while rummaging through toolboxes looking for the blogging solution that works for me
emojify: true
---

I've had a few people ask me why I was not maintaining some blog and I have always
has some excuses to convince me why I did not. Last saturday was a conversation
too many and I decided to actually give blogging a serious try this time, but
where to start...

Any decent quest requires some objectives (how else will I know if I have
succeeded?). So here goes... I need something that:

 1. supports markdown
 2. allows me to enter LaTeX-like formulas
 2. supports embedded web content
 2. runs as lean as possible
 2. does not introduce new security risks
 2. grants me (and me alone) full control to my data
 2. is simple
 2. grants flexibility in layout/design
 2. adjusts well to different screen sizes
 2. offers me some metrics

## Machinery
I have ignored [Wordpress][wordpress] and quickly glanced over [Ghost][ghost],
because I am already partial to a solution that generates static content, which
is not going to change anytime soon. I do not see the need for tending
databases, maintaining a CMS, setting up authentication chains between
applications and datasources, and scrolling through logs containing the
addresses of the numerous bots which waste my resources in an effort to
find their way in.

I write much in Ruby, Python, Javascript and C family languages, so I guess
any solution friendly to these languages will work for me. Jekyll was too
easy to warrant moving on to test other solutions, but nanoc (Ruby), DocPad
(CoffeeScript), Hyde (Python), Hugo (Go) or Hexo (Javascript) would probably
suffice as well[^1]. All basically do the same thing (generate
static websites) but the approach in getting things done are obviously
different. I chose Jekyll[^2], a popular static site generator written in Ruby
and allows me to enter posts in Markdown :wink:.

[^1]: There is a plethora of static site generators out on the web today (october 2015). As for me, I'm still using Jekyll but have heard a great deal about for a nice overview visit https://staticsitegenerators.net/ where Jekyll, by merits of its Github stars is still one of the leading static site generator projects :wink:
[^2]: Rolling with Jekyll proved to be a great choice since I currently host my site on Github pages. Github offers a static site hosting service which will generate Jekyll sites after as little as an upstream push.

## Design
I'm not a designer and therefore resorted to articles and papers to find a
layout that would work well.

### Text
For reading I generally prefer _serif_ fonts. The font used in LaTeX or something
like [Iowan][iowan], which I first encountered in iBooks, read exceptionally
well.

My love for _serif_ fonts almost had me going in that direction until I started
looking into some basic typography.

Multiple sources mention _sans serif_ fonts having higher legiblity factors to
their _serif_ counterparts whilst _serif_ fonts are generally known to have a
higher readability factor.
I&rsquo;m thinking &ldquo;readability is what I really want, should I go for
serifs?&rdquo; I hardly care for readers finding one character understandable or
recognizable as I expect the significance of each and every character to drown
in the context of the word. The problem with _serif_&rsquo;s, however; is that they
are quite detailed and the many low-res devices still in use today will render
_serif_ fonts very unpleasant to read as put in [a TNW article][font-choice-tnw].
The low-res screen story happens to provide the historical prologue to the
pretense that _sans-serif_ types work best on screens.

So for the sake of those ol&rsquo; skool devices let us stick with
_sans serif_&rsquo;s.

Luckily for me, not all  _sans serif_ fonts score low in readability. David
Jury happened to be so friendly to explain that relatively high
[x-heights][x-height] of _sans-serif_ types (in comparison to their _serif_
counterparts) render words less readable as word shapes become less obvious.
If I focus on finding _sans-serif_ fonts where the types have long ascenders
and descenders I&rsquo;ll be fine.

<div class="element image light">
  <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Typography_Line_Terms.svg/500px-Typography_Line_Terms.svg.png" alt="typography terms">
</div>

So&hellip; word shapes play significant roles in the comprehension speed of
written text. What else matters? According to David Jury type sizes between 9pt
to 12pt are generally considered equally readible to observers above 10 years
of age. I suppose my audience fits in the &ldquo;10 years and riper&rdquo;
category which hands us a winner&hellip; 11pts at which we should attempt to
keep our lines limited to 60 characters ([David Jury, About Face page 74][about-face-size-serif]).

[Montserrat][montserrat] by [Julieta Ulanovsky][julieta] has a interesting
[history][montserrat-kickstarter], looks incredible and seems like it will fit
the bill&hellip; until people start complaining I will assume that it works well
in the readability department.

<div class="element video">
<iframe src="http://www.kickstarter.com/projects/julietaulanovsky/the-montserrat-typeface/widget/video.html" frameborder="0" scrolling="no"> </iframe>
</div>

### Math
Another matter I had not yet discussed is the presentation of mathematical
formulae. My go-to solution for web-math is [MathJax][mathjax]. What can I say
I'm a \\(\TeX\\) guy :wink:. Anyways the quadratic formula
looks as slick as it looks in \\(\LaTeX\\) documents if printed like
$$\large x = \frac{-b\pm\sqrt{b^2-4ac}}{2a}$$.


### Color
I love darkness&hellip; pun intended! I mostly work from terminal screens so I'm
very comfortable looking at dark screens. I tried white text on a black
background first.


It seems that the object of our focus determines a lot in terms of vocal comfort.
Reading white text on a dark background will have one fixated on
white content, which happens to stimulate all three types of [cones][cones-wiki] in the
retina. White on black is therefore quite strenuous on the human eye. Anthony
recommended the use of black text on a light, somewhat gray-ish, background in
his [post][darklight-text-ux]. All to reduce the amount of light reflected
back at your delicate eyes. It makes sense.

<blockquote>As for color, as long as there is sufficient contrast between the text and the background, many color combinations are
possible. However, most studies have shown that dark characters on a light background are superior to light characters
on a dark background (when the refresh rate is fairly high). For example, Bauer and Cavonius (1980) found that
participants were 26% more accurate in reading text when they read it with dark characters on a light background.
Moreover, a survey by Scharff, et al. (1996) revealed that the color combination perceived as being most readable is the
traditional black text on white background. However, it is common for websites (such as this one) to have an off-white
background in order to reduce the flicker and glare associated with white backgrounds.
  <footer>Michael Bernard</footer>
</blockquote>
The fragment cited above is from the Michael's paper [Criteria for optimal web design (designing for usability)][optimal-web-design-criteria], which I stumbled upon through [a stackexchange question][darklight-stackexchange-ux].

### Layout
I haven&rsquo;t put too much thought into the layout. I wanted it simple. Long
sentences, being [difficult to track][long-sentences-codinghorror] have been
listed as _no-go_&rsquo;s. A usability paper by J. Ryan Baker, titled [Is Multiple-Column Online Text Better? It Depends!][usability-columns-wichita]
does a great job at establishing which alignment and column strategies work
well for online content. I have taken the liberty of assuming that some of
the penalties for one-column texts are to be attributed the the lenght of the
lines. Especially in the full-justified single-column text I had a hard time in
keeping track of my position when finding my way from the end of a line to the
beginning of its successor. A fully justified two-column section, in which each
column contains somewhere between 35 to 50 characters is a option I can now
back with common-sense and hard numbers.


### Embedded Content
Personally I hate scrolling through pages of only text. Somewhere along the
line I will need to embed content into posts just to spice things up and
provide relevant content within the same page.

Nowadays any decent online service provider offers a quick way of embedding
content into webpages.

Twitter, Youtube, Spotify and Instagram, among others, offer the ability to
embed content using iframes. My sample of nicely styled content (as in proper
width and corresponding heights) is demonstrated beneath&hellip;

<div class="element tweet">
  <blockquote class="twitter-tweet" lang="en"><p>Those days when nothing seems to work :P… that’s when I abandon the code and turn to the piano <a href="https://twitter.com/search?q=%23coders&amp;src=hash">#coders</a> <a href="https://twitter.com/search?q=%23block&amp;src=hash">#block</a></p>&mdash; David Asabina (@vidbina) <a href="https://twitter.com/vidbina/statuses/417369790718959616">December 29, 2013</a></blockquote>
  <script async src="//platform.twitter.com/widgets.js" charset="utf-8"> </script>
</div>

<div class="element video">
  <iframe width="420" height="315" src="//www.youtube.com/embed/MJ6IcYwVxV0" frameborder="0" allowfullscreen> </iframe>
</div>

<div class="element instagram">
  <iframe src="//instagram.com/p/gICEH_Kc6b/embed/" width="612" height="710" frameborder="0" scrolling="no" allowtransparency="true"> </iframe>
</div>

<div class="element spotify">
  <iframe src="https://embed.spotify.com/?uri=spotify:track:32W1K50AaXGXoRBn3Zyax4" frameborder="0" allowtransparency="true"> </iframe>
</div>

<div class="element spotify small">
  <iframe src="https://embed.spotify.com/?uri=spotify:track:3KsatAMRt1a7iryhWt5I8U" width="300" height="380" frameborder="0" allowtransparency="true"> </iframe>
</div>

The embedded content from the different providers above is styled using a
smart solution [documented by Marc Hinse][marchinse] which in fact is a
variation to the [padded box][paddedbox]. Hinse&rsquo;s method uses paddings
in a pseudo block element (the `before`) to force containing divs to
certain sizes. The contents of the containing div are then absolutely
positioned to ensure all containing elements start on top of each other and
share point (0, 0) as their origin within the cathesian coordinate system. With
all the elements lying on top of each other we simply have to render the
`before` element invisible by setting its `opacity`, `z-index` or
`background` and _inflate_ the `before` div to force its container to
the right size in terms of width and height.

This solution is most interesting because of the aspect-ratios and other
dimensional properties you will be able to assign to page elements but I will
get to that in a short bit.

```css
.element {
  width: 100%;
  display: block;
  overflow: hidden;
}
.element > * {
  width: 100%;
}
.video, .spotify, .instagram {
  display: block;
  position: relative;
}
.video *, .spotify *, .instagram * {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.video:before, .spotify:before, .instagram:before {
  content: "";
  display: block;
}
```

Adding a embedded item to my page simply requires the addition of the `iframe`&rsquo;s
in divs of the `.element` class. Even with the `width` or `height`
attributes set on the `iframe` the styles will still ensure that the iframe
fills up its container.

```html
<div class="element spotify">
  /* copy the iframe from the embed snippet provided */
  <iframe src="https://embed.spotify.com/?uri=blahblah" ...> </iframe>
</div>
```

The iframe does not support much styling unless you are willing to try your
hands at setting element-level styles on the ugly ducklings using javascript.
I felt that a pure-CSS solution would be the cleanest way out for this specific
problem.

The dimensions for several embedded elements are coded into the css using the
`padding-top` and `padding-bottom` properties. Spotify for instance
displays a square record cover with a 80px control bar on top. The
width-to-height ratio for the image is 1:1 resulting to the `padding-top: 100%`
line. I want to reserve space that is at least as high as it is wide. The
remaining 80 pixels are dealt with by the `padding-bottom` property.
padding. Instagram pretty much has the same story but requires 98 pixes in
additional padding for the information above and beneath the square image.
Videos will be displayed in a 5:3 aspect ratio which coincides with Native
Super 16mm film as listed on [wikipedia][aspectratio] and only deviates from
the golden ratio by a percent :wink:.

```css
.instagram:before {
  padding-top: 100%;
  padding-bottom: 98px;
}
.spotify:before {
  padding-top: 100%;
  padding-bottom: 80px
}
.spotify.small:before {
  padding-top: 0;
}
.video:before {
  padding-top: 60%;
  background: yellow;
}
```

### Images
If there is a place for embedded content, images need to be convered as well.
Due to the small width of my page layout, I had to consider alternatives for
presenting larger images. I came up with an approach that may be both intrusive
and helpful. Since I will feature a lot of screenshots on this page, I need a
bit more than 500 to 600 pixels in width. However, I don't need my readers to
gaze at large pictures at all times and therefore considered zooming an image
on hover.

In CSS one can specify a `scale3d` transform on a hover as demonstrated in the
following snippet that just doubles the size of an image on the along the $x$
and $y$ axis.

```css
#img_x:hover { transform: scale3d(2, 2, 1); }
```

This solution is far from elegant, in fact it is rather nasty but what it
boils down to is me

 - iterating over every image contained in a container with
the classes `element` and `img`,
 - calculating the $x$ and $y$ scaling factors to get an image zoomed to
 something close to original size and
 - adding the calculated styles to a `<style>` block in the header:

```javascript
(function() {
  var els = document.querySelectorAll('.element.img');
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);

  for (var i = 0; i < els.length; i++) {
    (function(div, id) {
      // give every picture container a unique id
      // id is used to describe the hover transform style
      div.id = 'img_' + id;
      var img =  div.getElementsByTagName('img')[0];

      // load image
      var image = new Image();
      image.onload = function() {
        // get the image dimensions after it is loaded
        img.src = this.src;
        // calculate scaling factors
        var sx = this.width/img.width;
        var sy = this.height/img.height;
        // build style for this specific image
        var styleText = '#img_' + id +
          ':hover { transform: ' +
          'scale3d(' + sx + ', ' + sy + ', 1);' +
          '}';
        // add style to style block
        style.sheet.insertRule(styleText, 0);
      };
      image.src = img.src;
      img.src = "";
    })(els[i], i);
  }
})();
```

<div class="element image">
  <img src="https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/screenshots/tmuxvieditblog.png" alt="screen shot of tmux in which I am editing this post in vim">
</div>

I guess I&rsquo;ve got it all covered.


Time to start bloggin&hellip;

[font-choice-tnw]: http://thenextweb.com/dd/2011/03/02/whats-the-most-readable-font-for-the-screen/#!qQBqd?canvas=918984
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
[montserrat]: http://www.google.com/fonts/specimen/Montserrat
[montserrat-kickstarter]: http://www.kickstarter.com/projects/julietaulanovsky/the-montserrat-typeface
[julieta]: http://zkysky.com.ar
[iowan]: http://www.myfonts.com/fonts/bitstream/iowan-old-style/webfont_preview.html
[about-face-size-serif]: http://books.google.nl/books?id=upqBMzlXBzsC&pg=PA74&lpg=PA74&dq=sans+serf+vs+serif+legibility&source=bl&ots=iKUnB5HvLE&sig=bLrLa6_dhUl0sVvT495glkR3RZA&hl=en&sa=X&ei=JvXGUp-SKZSQ0QWQiIDQDQ&ved=0CGgQ6AEwBQ#v=onepage&q&f=false
[x-height]: http://en.wikipedia.org/wiki/X-height
[cones-wiki]: http://en.wikipedia.org/wiki/Cone_cell
[optimal-web-design-criteria]: http://uwf.edu/ddawson/d3net/documents/web_usability/optimal%20web%20design.pdf
[paddedbox]: http://daverupert.com/2012/04/uncle-daves-ol-padded-box/
[marchinse]: http://www.mademyday.de/css-height-equals-width-with-pure-css.html
[aspectratio]: http://en.wikipedia.org/wiki/Aspect_ratio_(image)
[mathjax]: http://www.mathjax.org/
