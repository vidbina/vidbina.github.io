---
layout: post
type: aviation
date: 2014-01-19 00:03
title: Making Some Sense of Flight Routes
description: Looking at a flight route for a commercial airliner had me wondering&hellip; reason to explore
tags:
 - flight
 - navigation
 - map
 - travel
---
The misses is on a flight to Suriname, so I'm tracking her flight in an online
flight tracker while she is enroute.

The flight routes for commercial flights are obviously indicative of the 
journey the aircraft will be venturing through the skies and I just got curious
which led to a full day of entertainment.

<blockquote>
VALKO UL980 MANGO UL620 MID UR8 SAM UN20 GAPLI OMOKO 4500N 02000W 4000N 02500W 3500N 03000W 3000N 03500W 2400N 04000W BUTUX ASALI BUXEX
</blockquote>

The funk?!? {{ ":confused:" | emojify }}

## Departure
Since we are leaving from our starting airport we will need to understand what
<strong>VALKO</strong> really means. <strong>VALKO</strong> is one of the 
departure routes available from Schiphol (EHAM). This stuff is thoroughly 
documented in Aeronautical Information Publications ([AIP][aip-definition]) 
released by the [national aerospace authorities][ais-nl]. The documentation for
Schiphol (EHAM) contains the following descriptions for VALKO departures:

 - VALKO 3M (from runway 9)
 - VALKO 2E (from runway 18L)
 - VALKO 1G (from runway 22)
 - VALKO 1S (from runway 24)

In total there are four ways to start a VALKO departure.

I chose to take a look at VALKO 3M (runway 9) and got the following take-off 
route description:

<blockquote>
Track 087° MAG. At 500 ft AMSL turn right (turn MAX 220 KIAS) to intercept RTM 034 inbound to intercept PAM 240. At 25.0 PAM turn right to track 266° MAG to VALKO (48.9 PAM).
RNAV: THR 09 / At 500 ft AMSL turn right / EH030 (MAX 220 KIAS) / EH025 / EH040 / VALKO
</blockquote>

Backed up by the map below, my interpretation of the sequence of relevant 
waypoints and the RNAV is&hellip;
<blockquote>
Maintain the 087&deg; heading until 500 ft above medium sea level, at which we
turn to intercept the RTM034 radial maintain a maximum airspeed of 220 knots 
while executing the turn. When on the RTM034 radial attempt to intercept the
PAM240 radial and fly this heading. At 25 nautical miles from the PAM VOR-DME
turn turn right to follow a heading of 266&deg; to VALKO which is 48.9 nautical
miles from the PAM VOR-DME.
</blockquote>

The <i>RNAV</i> line simply contains the lift-off runway, directions for the 
right turn after take-off and the waypoints we have to cross on our way to 
VALKO.

<div class="element document portrait-a4">
  <embed class="a4" src="http://www.ais-netherlands.nl/aim/2013-11-28-AIRAC/eAIP/html/graphics/eAIP/EH-AD-2.EHAM-SID-09.pdf?">
</div>

## VOR
Very High Frequency Omni-direction Radio range navigation is used to specify
reference points that the aircraft may encounter on its journey. The 
instrumentation in an aircraft will allow the observer to ascertain the heading
of the craft in relation to the checkpoint, as such it may be the case that the
VOR is not necessarily used just to be flown over but to obtain the proper 
heading for a intended route in relation to a fixed point on the earth surface. 
Generally VOR&rsquo;s are designated with three letters. In the flight route
displayed at the beginning of this post <i>MID</i> and <i>SAM</i> would be 
VOR's.

## Airways
Now that we&rsquo;ve unraveled the departure mystery we get the 
<strong>U980</strong> which is an [airway][airway-wiki]. Airway designations in
Europe contain one letter, where the letter <i>U</i> is used to indicate high 
enroute traffic, followed by one to three numbers. In the US, airways are 
prefixed with the letters <i>V</i> (low altitude based on VOR), <i>J</i> (high 
altitude based on VOR), <i>T</i> (low altitudes RNAV) or <i>Q</i> (high 
altitude RNAV).

## Waypoints
<i>[MANGO][waypoint-mango]</i> seems a bit out of place in the list flight plan 
but it is not. The five-letter words are known as waypoints. During the flight
the aircraft will flying-over or flying-by [MANGO][waypoint-mango], [GAPLI][waypoint-gapli],
[OMOKO][waypoint-omoko], [BUTUX][waypoint-butux], [ASALI][waypoint-asali] and
[BUXEX][waypoint-buxex] in the listed order. These waypoints and the 
corresponding GPS coordinates are available on OpenNav.

## Oceanic Waypoints
Out on the open sea waypoints are not named which seems quite obvious as I can 
not imagine the convenience of assigning a proper name to every waypoint on the
ocean.
The convention here is to use the latitude and longitude of the location in
designating the waypoint. A waypoint designated as 4500N 02000W would simply
be the waypoint located at 45&deg;N 20&deg;W.

## Arrival
I scoured the web for AIP&rsquo;s for Suriname but have not had any luck so 
far. Some [pilot information][pbm] on the airport website provides some intel
on the situation on location&hellip; single runway (RWY11/RWY29) equipped for 
precision approaches, no ILS frequencies publicly listed on the site, no ATC 
frequencies publicly listed&hellip; Welp, the pilots must know.

## Review
After some research we can now decipher the following flightplan&hellip;
<blockquote>
VALKO UL980 MANGO UL620 MID UR8 SAM UN20 GAPLI OMOKO 4500N 02000W 4000N 02500W 3500N 03000W 3000N 03500W 2400N 04000W BUTUX ASALI BUXEX
</blockquote>

&hellip;to the following summary
<blockquote>
We take the VALKO departure route from Schiphol, follow airway UL980 to turn 
unto UL620 through the MANGO waypoint over Great Brittain. We proceed our 
flight to turn unto airway UR8 through the MID VOR after which we fly unto 
airway UN20 through the SAM VOR. We follow waypoint GAPLI, then OMOKO to lead 
us to the open sea.

On the ocean we fly from 45&deg;N 20&deg;W to 40&deg;N 25&deg;W (mind you we are 
moving south-west). We continue to 35&deg;N 30&deg;W and proceed through 
30&deg;N, 35&deg;W to 24&deg;N 40&deg;W. The entire trip over the oceanic 
waypoints is pretty much a straight line that is exactly 225&deg; SW-bound. 
Every successive waypoint has been 5&deg; units more southbound and westbound 
than its successor. As we approach the latitude that Trinidad rests on we head 
for the BUTUX waypoint, move one to the ASALI 
waypoint and finally to the BUXES waypoint over Suriname&rsquo;s airspace.
</blockquote>

I have no clue how pilots proceed after passing the last waypoint, but I suppose
they do not really rely on the autopilot from that point onward. Perhaps they 
have arrival routes on maps that they carry on-board, perhaps they just course 
on until they are able to establish radio contact to be ushered into the right
position for a ILS approach. I really have no clue, but I will figure this out 
one day.

The misses is about to land soon {{ ":airplane:" | emojify }}, if she 
hasn&rsquo;t already&hellip;

<!--
<div class="element document portrait-a4">
  <embed src="http://www.ais-netherlands.nl/aim/2013-11-28-AIRAC/eAIP/html/graphics/eAIP/EH-AD-2.EHAM-ADC-A2s.pdf?">
</div>
-->

[aip-definition]: http://en.wikipedia.org/wiki/Aeronautical_Information_Publication
[aip-eham]: http://www.ais-netherlands.nl/aim/2013-11-28-AIRAC/eAIP/html/index-en-GB.html
[ais-nl]: http://www.ais-netherlands.nl/aim/index.html
[airway-wiki]: http://en.wikipedia.org/wiki/Airway_(aviation)
[waypoint-mango]: http://opennav.com/waypoint/UK/MANGO
[waypoint-gapli]: http://opennav.com/waypoint/UK/GAPLI
[waypoint-omoko]: http://opennav.com/waypoint/UK/OMOKO
[waypoint-butux]: http://opennav.com/waypoint/TT/BUTUX
[waypoint-asali]: http://opennav.com/waypoint/AG/ASALI
[waypoint-buxex]: http://opennav.com/waypoint/SR/BUXEX
[faa-sr]: http://www.faa.gov/air_traffic/publications/ifim/country_info/PDF/SR.pdf
[waypoint-naming-conv]: http://www.uasc.com/documents/support/WaypointNamingConventions.pdf
[pbm]: http://www.japi-airport.com/?page_id=15
