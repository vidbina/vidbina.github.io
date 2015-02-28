---
layout: post
title:  Building Graph Editing UI's Using HTML5
since:  2015-02-26 18:32
date:   2015-02-30 21:09
type: cloud
category: tools
tags:
 - user interface
 - html5
 - web
 - design
 - usability
 - directed graph
mathjax: true
description: "Learnings in conceptualizing and building a browser-friendly 
graph editing interface"
---
Recently I got in touch with one of the Civil Engineering faculty professors
regarding the development of some software for a traffic sim. One of the 
interesting parts of the project involve the design and development of some 
interface to allow the creation and manipulation of directed graphs. This post
will cover the lessons learned and the challenges encountered along the way.

# Modelling Traffic Infrastructures
Modelling of traffic infrastructures may be done through the use of directed 
graphs. These graphs contain all necessary information on the composition of 
the network (roads, junctions, allowed driving directions, lane count) to 
facilitate its use in the simulation of numerous scenarios. Before anyone can
run a simulation, a description of the infrastructure is required.

Because these networks are directed graphs, it would be helpful to offer the
end-user a visual representation of such graphs, with the added ability of
mutating these graphs by manipulating these visual elements. This implies that
the interface should somehow be drag-and-drop friendly because I'm not setting
up an interfaces for my personal use here (I would probably have opted for an 
input format reminiscent of the input one feeds to GraphViz -- Apparently, I 
love typing up text).

<div class="element">
 <img 
   src="/resources/traffic/4-point-intersection.svg"
   alt="A 4-point interesection with describing the routes available for the southerner">
</div>
The following features will be covered in my quest for a solution:

  - User should be able to click and draw structures into existence
  - User should be able to click and move structures from position
  - User should be able to zoom in and out
  - User should be able to distinguish between entities by color and/or shape
  - User should be able to distinguish between entity components by color and/or shape
  - User should be able to recognize elements by name

## Graphics Solutions

3djs
# Directed Graphs

[bike-lane-colors]: http://john-s-allen.com/blog/?p=2293
[bike-lane-colors-dc]: http://greatergreaterwashington.org/post/20027/colored-bike-lanes-come-in-many-colors/
[req-to-experiment]: http://nacto.org/wp-content/uploads/2011/02/Chicago_Color-request-with-attachments.pdf
[bikes-nyc]: http://www.transalt.org/sites/default/files/resources/blueprint/index.html
[bikes-nyc-lanes]: http://www.transalt.org/sites/default/files/resources/blueprint/chapter4/chapter4b.html
[transpo]: http://www.transpo.com/color-safe/
