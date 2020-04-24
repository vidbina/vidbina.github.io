---
layout: post
type: aviation
category: aviation
date: 2014-01-19 00:03
title: Making Some Sense of Flight Routes
description: Looking at a flight route for a commercial airliner had me wondering&hellip; reason to explore
tags:
 - flight
 - navigation
 - map
 - travel
redirect_from:
  - /2014/01/19/flight-routes.html
  - /flight-routes/
emojify: true
---
The misses is on a flight to Suriname, so I'm tracking her flight in an online
flight tracker while she is enroute.

The flight routes for commercial flights are obviously indicative of the
journey the aircraft will be venturing through the skies and I just got curious
which led to a full day of entertainment.

The flight plan I ran into looked like this&hellip;
<blockquote>
GORLO UL980 LAM UL179 CPT UM197 GAPLI GUNSO OMOKO 4800N 01500W 4500N 02000W
4200N 02500W 3900N 03000W 3500N 03700W 2900N 04500W 2300N 05000W 1800N 05200W
1400N 05300W 0916N 05400W ZY
</blockquote>

The funk does that mean?!? :confused:

## Departure
Since we are leaving from our starting airport we will need to understand what
<strong>GORLO</strong> really means. <strong>GORLO</strong> is one of the
departure routes available from Schiphol (EHAM). This stuff is thoroughly
documented in Aeronautical Information Publications ([AIP][aip-definition])
released by the [national aerospace authorities][ais-nl]. The documentation for
Schiphol (EHAM) contains the following descriptions for GORLO departures:

 - GORLO 2F (from runway 4)
 - GORLO 2N (from runway 9)
 - GORLO 1P (from runway 27)
 - GORLO 3V (from runway 36L)
 - GORLO 1Z (from runway 36L)

In total there are five ways to start a GORLO departure. Any one following a
GORLO departure instruction from its designated take-off runway should end up
heading the same direction eventually.

I chose to take a look at GORLO 2N (runway 9) and got the following take-off
route description:

<blockquote>
Track 087° MAG. At 500 ft AMSL turn left (turn MAX 220 KIAS) to track 315° MAG.
At 7.0 SPL turn left to track 271° MAG. At 11.0 SPY turn left to track 212° MAG
to intercept SPY 242 to VOLLA (29.0 SPY). Track 238° MAG to GORLO (72.3 SPY).
RNAV: THR 09 / At 500 ft AMSL turn left / EH053 (MAX 220 KIAS) / EH094 / EH090
/ EH091 / VOLLA / GORLO
</blockquote>

Backed up by the map below, my interpretation of the sequence of relevant
waypoints and the RNAV is&hellip;
<blockquote>
Maintain the 087&deg; heading until 500 ft above medium sea level, at which we
turn to follow a heading of 315&deg;. At 7.0 nautical miles to the SPL VOR we
turn left to track a heading of 271&deg;. At 11 nautical miles from SPY we turn
again to track a heading of 212&deg;. We are to intercept SPY 242 to the VOLLA
waypoint which is 29 nautical miles from the SPY VOR. Once there we slightly
change our heading to 238&deg; and set course for the GORLO waypoint.
</blockquote>

The <i>RNAV</i> line simply contains the lift-off runway, directions for the
left turn after take-off and the waypoints we have to cross on our way to
GORLO.

<div class="element document portrait-a4">
  <embed class="a4" src="http://vid.bina.me/resources/aviation/departure_charts/eham_aip_rwy09_20130919.pdf">
</div>

## VOR
Very High Frequency Omni-direction Radio range navigation allows the observer
to obtain the heading and distance information (in the case of VOR-DME&rsquo;s).
It is simply a beacon. As such it may be the case that the VOR is not
necessarily used just to be flown over but to obtain the proper heading for a
intended route in relation to a fixed point on the earth surface.
Generally VOR&rsquo;s are designated with three letters. In the flight route
displayed at the beginning of this post <i>LAM</i> and <i>CPT</i> would be
VOR's beacons that we tune into to establish the proper heading.

## Airways
Now that we&rsquo;ve unraveled the departure mystery we get the
<strong>U980</strong> which is an [airway][airway-wiki]. Airway designations in
Europe contain one letter, where the letter <i>U</i> is used to indicate high
enroute traffic, followed by one to three numbers. In the US, airways are
prefixed with the letters <i>V</i> (low altitude based on VOR), <i>J</i> (high
altitude based on VOR), <i>T</i> (low altitudes RNAV) or <i>Q</i> (high
altitude RNAV).

## Waypoints
The five-letter words in the flight plan that are not known as departure or
arrival routes are known as waypoints. During the
flight the aircraft will fly-over or fly-by [GAPLI][waypoint-gapli],
[GUNZO][waypoint-gunzo], and [OMOKO][waypoint-omoko] in the listed order. These
waypoints and the corresponding GPS coordinates are available on OpenNav.

## Oceanic Waypoints
Out on the open sea waypoints are not named which seems quite obvious as I can
not imagine the convenience of assigning a proper name to every waypoint on the
ocean.
The convention here is to use the latitude and longitude of the location in
designating the waypoint. A waypoint designated as 4500N 02000W would simply
be the waypoint located at 45&deg;N 20&deg;W.

## Arrival
I got my hands on aeronautical charts for the destination which choreograph the
approach dance for a ILS landing. The ILS approach is only possible when landing
at a heading of 11 which I believe is assigned based on the direction of the
wind at the time of landing as we will most likely land into the wind to
maintain a proper airspeed. If we land on a runway 29 (which is exactly the
same tarmac runway, only approached from the other side) we will need to
execute a VOR-DME approach, which has been nicely explained in a FlightGear
tutorial I found on [youtube][flightgear-vordme].

<div class="element video">
  <iframe src="http://www.youtube.com/embed/aIJHn3iSipE" frameborder="0" allowfullscreen> </iframe>
</div>

On the map we have our frequencies, approach patterns and corresponding
airspeeds and altitudes, which should be enough to keep the process
moving forward.
<div class="element document portrait-a4">
  <embed class="a4" src="http://vid.bina.me/resources/aviation/approach_plates/smjp_jeppesen_20120817.pdf">
</div>

Yet again, a FlightGear How-to video comes to the rescue by quickly explaining
some of the concepts encountered in this map.

<div class="element video">
  <iframe src="http://www.youtube.com/embed/z8yEHyKs_JE" frameborder="0" allowfullscreen> </iframe>
</div>

My summary of the ILS approach,
assuming we are approaching the ZY VOR-DME at a heading of 227&deg;, would
be&hellip;
<blockquote>
Maintain a heading of 227&deg; to the ZY VOR and turn right to heading 309&deg;
when at 2 nautical miles from the VOR (we are assuming we are a in a heavy
airliner which would most likely qualify as CAT D). Whilst flying the assigned
heading. At 9 nautical miles from ZY we start the turnaround to heading
106&deg; to line up with our runway. This maneouver should be executed at an
altitude of 2000 feet. Whilst on the 106&deg; radial we initiate the 3&deg;
descent using the recommended descent rates for our given airspeed. The
approach plate indicates a descent of 372 fpm (feet-per-minute) at 70 knots
till 849 fpm at 160 knots. At a half nautical mile to the VOR we approach the
middle marker, before that point we should have established visual contact
with the cues available on and near the airstrip, otherwise we are set to fly
a missed approach.
</blockquote>

The misses has already landed :airplane:&hellip; time to
sleep.

[aip-definition]: http://en.wikipedia.org/wiki/Aeronautical_Information_Publication
[aip-eham]: http://www.ais-netherlands.nl/aim/2013-11-28-AIRAC/eAIP/html/index-en-GB.html
[ais-nl]: http://www.ais-netherlands.nl/aim/index.html
[airway-wiki]: http://en.wikipedia.org/wiki/Airway_(aviation)
[waypoint-mango]: http://opennav.com/waypoint/UK/MANGO
[waypoint-gapli]: http://opennav.com/waypoint/UK/GAPLI
[waypoint-gunzo]: http://www.opennav.com/waypoint/UK/GUNSO
[waypoint-omoko]: http://opennav.com/waypoint/UK/OMOKO
[waypoint-butux]: http://opennav.com/waypoint/TT/BUTUX
[waypoint-asali]: http://opennav.com/waypoint/AG/ASALI
[waypoint-buxex]: http://opennav.com/waypoint/SR/BUXEX
[faa-sr]: http://www.faa.gov/air_traffic/publications/ifim/country_info/PDF/SR.pdf
[waypoint-naming-conv]: http://www.uasc.com/documents/support/WaypointNamingConventions.pdf
[pbm]: http://www.japi-airport.com/?page_id=15
[vor-intercept]: http://www.youtube.com/watch?v=q2ZJPD8L1Bk
[flightgear-vordme]: http://www.youtube.com/watch?v=z8yEHyKs_JE
[ais-eham-gorlo-rwy9]: http://www.ais-netherlands.nl/aim/2013-12-26-AIRAC/eAIP/html/graphics/eAIP/EH-AD-2.EHAM-SID-09.pdf?
