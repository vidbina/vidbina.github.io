---
layout: post
title: Stylistic Variants in Inkscape
description: |
  Accessing stylistic variants in Inkscape, along with some other
  font :black_nib: feature settings.
date:  2017-09-22 20:47:00 +0000
type: typography
category: # for url
 - typography
tags:
 - typography
 - design
 - inkscape
og:
  type: article # http://ogp.me/#types
#  og:type: #
#   - og:value: value
#     og:attr: foo
#   - og:value: value
#image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
#twitter:
#  card: summary
#  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/brexit.png
head: mugshot
emojify: true
---
Lately I have been dabbling a bit in typography. One of the things, I had the
opportunity to play around with are stylistic variants, a feature I came to
experiment with in my
[first font design attempt](https://github.com/vidbina/a-industrial).

So here's how one may leverage the features that modern fonts offer.

<div class="element image"><img alt="Text and Font item in the toolbar" src="/img/text-in-toolbar-inkscape.png" /></div>

Open the Text and Font panel through
 - the toolbar (see image above, button is higlighted in pink)
 - the Text menu, subsequently followed by the Text and Font menu item
 - `Ctrl` + `Shift` + `T`, unless you have changed the shortcuts.

The trick here is to select the part of the text one want to manipulate and
open the "Variant" tab in the _Text and Font_ panel in which we may specify
some opentype-compliant descriptor for a feature setting one wants activated.

<!--
<div class="element image">
<img alt="Example of the _Text and Font_ Variant interface" src="/img/text-and-font-variant.png"/>
</div>
-->

<div class="element image">
<img alt="Screenshot of the entire workspace while specifying variants for glyphs" src="/img/variant-inkscape-screenshot.png" />
</div>

In the screenshot the word "area" is presented in the _A Industrial_ typeface
while "a" is represented through an alternate glyph for each occurrence.
Selecting a portion of the text, specifying a valid descriptor in the feature
settings text field and applying that change will modify the presentation of
the text accordingly.
