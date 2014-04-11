---
layout: post
title:  Browser friendly clefs
date:   2014-04-11 09:28:89
type: music
tags:
 - music
 - notation
 - browser
 - UI
 - software 
 - internet
description: "Music notation online."
vexflow: true
---
# Test
<div class="element music">
<canvas width="600" height="100" style="width: 100%;"></canvas>
</div>
<script>
  $(function() {
    var canvas = $("div.element.music canvas")[0];
    console.log('got ' + canvas);
    var renderer = new Vex.Flow.Renderer(canvas,
      Vex.Flow.Renderer.Backends.CANVAS);
    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, 580);
    stave.addClef("bass").setContext(ctx).draw();
  });
</script>
