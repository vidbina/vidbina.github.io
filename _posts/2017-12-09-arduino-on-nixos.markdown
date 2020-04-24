---
layout: post
title: Arduino without the GUI
description: |
  A brief account of the different methods of building Arduino code on
  Linux :penguin:, especialy NixOS :snowflake:, utilizing the
  <code>arduino</code>, <code>arduino-builder</code> and <code>avrdude</code>
  tools :wrench: among other.
since:  2017-12-09 11:45:36 +0000
date:  2017-12-26 15:37:53 +0100
type: tools # for icon
category:
 - tools
 - arduino
tags:
 - tools
 - arduino
 - electronics
 - nixos
 - cli
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
The first attempt to start playing around with Arduino's on my machine had
involved installing the [`arduino` :octocat:][nixpkgs-all-arduino] package from
[nixpkgs :octocat:][nixpkgs].

After a few pathetic attempts to use the Arduino IDE with my current window
manager (XMonad), I gave up on the GUI route. Basically the IDE seems to be
okay, but menus exhibit really weird behavior requiring me to keep the mouse
depressed while navigating towards the drop-down menu which appears way out of
reach of the menu bar. Furthermore, the IDE doesn't seem to play well with
XMonad dictating which dimensions to assume.

To be honest, I wasn't serious about using the IDE anyways. CLI tools are more
user-friendly when it comes to automation anyways so fvck :fu: the UI.

So here is an account of several ways to build code for the Arduino boards
covering
 - the [easiest (least flexible)](#1) using the `arduino` tool which does it all,
 - the [harder (more flexible)](#2) option which utilizes the `arduino-build`
 tool in combination with `avrdude` and someday...
 - the [hardest option](#3) which I haven't come around to document but
 involves custom Makefiles to build source, and link objects and subsequently
 upload the whole she-bang using the `avrdude` tool. :hourglass:

## <span id="1"> 1

The easiest way to circumvent the painful IDE experience is by simply using the
`arduino` CLI tool.

In NixOS, one can install the `arduino` toolset system-wide by adding the
package `arduino` or `arduino-core`, conversely one may also define a custom
nix-shell. The nix-shell options is pretty neat since one defines `shell.nix`
and or `default.nix` inside the project directory within which one may specify
all needed dependencies for that project. This makes it really easy for other
Nix\* users to get setup in no time.

```nix
# shell.nix
{ system ? builtins.currentSystem }:

let pkgs = import <nixpkgs> {};
in pkgs.callPackage ./default.nix {}
```

The `shell.nix` file in this case, just defines a derrivation in which `system`
defaults to the [`builtins.currentSystem`][nixos-currentSystem] and where the
derivation defined in `default.nix` is loaded.

```nix
# default.nix
{ stdenv, pkgs }:

stdenv.mkDerivation rec {
  name = "arduino-dev-${version}";
  src = ./.;
  version = "0.1.0";

  ARDUINO_PATH="${pkgs.arduino-core}";

  buildInputs = with pkgs; [
    arduino
  ];

  shellHook = ''
    export PATH="$PATH:${pkgs.arduino-core}/share/arduino/"
  '';
}
```

The `default.nix` file basically sets up an environment containing the
`arduino` package -- essentially `arduino-core` with the GUI enabled as evident
in the [code :octocat:][nixpkgs-all-arduino]. In order to simplify things, we
define an environment variable `ARDUINO_PATH` which points to the location
where Arduino-related files may be found and add the path of the arduino
binaries to the `$PATH` environment variable in the `shellHook`, allowing us to
call commands such as `arduino` and `arduino-builder` :wink:.

Start the shell represented by the descriptions captures in `shell.nix` and
`default.nix` by running `nix-shell` within the directory where these files are
stored.

In order to figure out how to use the `arduino` CLI tool, consult the
[manpage][arduino-manpage] or see the [examples][arduino-examples] but
basically, provided that we have a sketch named `Blink.cpp`, one may run

```bash
arduino --verify Blink.cpp
```

to build the sketch.

<div class="element note">
:exclamation: Normal users generally don't have unrestricted access to devices.
In NixOS this rings true for the TTY devices. Just run `ls -la /dev/tty*` to
observe for yourself. The `root` user is most likely owner of all of the listed
devices, however; the serial TTY's seem to owned by the `dialout` group. By
adding the `dialout` group to your user's `extraGroups` (see the [NixOS
Manual][nixos-user-mgmt] for an example on configuring `extraGroups`) and
logging back into your system, you will now have access to any resource that
owned by the `dialout` group :wink:.
</div>

In order to compile and upload the sketch in one go, one may run

```bash
arduino \
  --board arduino:avr:leonardo \
  --port /dev/ttyACM0 \
  --upload Blink.cpp
```

in case the board in question is an Arduino Nano donning the ATMega168 AVR
chipset and connected to port `ttyACM0`. In case you're dealing with some other
hardware, please explore the boards.txt file located in the
`$ARDUINO_PATH/share/arduino/hardware/arduino/avr` directory and adjust the
parameters accordingly.

<div class="element note">
<a name="which-port">:bulb:</a> Determining the port could be as simple as
observing the output of `ls -la /dev/tty*` or just watching the output of
`dmesg -wH` or `journalctl -f` for USB-related messages while resetting or
connecting the board :wink:. The extract of my dmesg buffer below indicates
that there is a device connected as `ttyACM0` right after a new USB device has
been detected that fits the description.

```
[  +8.258105] usb 1-2: USB disconnect, device number 34
[  +0.798493] usb 1-2: new full-speed USB device number 35 using xhci_hcd
[  +0.171444] usb 1-2: New USB device found, idVendor=2341, idProduct=8036
[  +0.000003] usb 1-2: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[  +0.000001] usb 1-2: Product: Arduino Leonardo
[  +0.000002] usb 1-2: Manufacturer: Arduino LLC
[  +0.001795] cdc_acm 1-2:1.0: ttyACM0: USB ACM device
```
</div>

Usage of the `--verbose-build` and `--verbose-upload` arguments

```bash
arduino \
  --board arduino:avr:leonardo \
  --port /dev/ttyACM0 \
  --verbose-build \
  --verbose-upload \
  --upload Blink.cpp
```

could be helpful in case :poop: hits the fan in order to aid in sleuthing :mag:.

To conclude this section, observe how I change into a directory which contains
the default.nix and shell.nix, spawn a nix-shell and shoot an application to an
Arduino Leonardo :wink:.

<div class="element screencast">
<!--<script type="text/javascript" src="https://asciinema.org/a/151930.js" id="asciicast-151930" async></script>-->
<script type="text/javascript" src="https://asciinema.org/a/HDzd2kE1cy91Z8qoKsjBuJ5oK.js" id="asciicast-HDzd2kE1cy91Z8qoKsjBuJ5oK" async></script>
</div>

## <span id="2"> 2

:flushed: The process described in the previous section should be enough to get
going.  For whichever reason you decided to read on, things are about to get a
bit more involved. For convenience's sake, I assume that you have read through
the section above.

The `arduino` tool uses the `arduino-builder` under the hood. Given the
`default.nix` and `shell.nix` files presented above. We could run the
`arduino-builder` by executing

```bash
arduino-builder \
  -build-path ${PWD}/out \
  -debug-level 10 \
  -fqbn arduino:avr:leonardo \
  -hardware ${ARDUINO_PATH}/share/arduino/hardware/ \
  -libraries ${ARDUINO_PATH}/share/arduino/libraries/ \
  -tools ${ARDUINO_PATH}/share/arduino/tools/ \
  -tools ${ARDUINO_PATH}/share/arduino/tools-builder/ \
  -tools ${ARDUINO_PATH}/share/arduino/hardware/tools/ \
  -verbose \
  -warnings all \
  Blink.cpp
```

which is quite a handful but essentially compiles the Blink.cpp file, given the
parameters specified, to produce a collection of build artifacts in the
`${PWD}/out` directory. The build artifcats directory is a step up from the
`arduino` approach. If you like studying the machine code [like these guys](http://www.avrfreaks.net/forum/understanding-hex-file) you'll have something to study and play with
when using `arduino-builder` :wink:.

<div class="element note">
:smirk: Of course you didn't have to run the command with the `-debug-level
10`, `-verbose` and `-warning all` arguments but in many cases it is convenient
to have plenty of information available in case things fail.
</div>

After building one would still need to flash the Arduino. This could be done
by using the `avrdude` [:books:][avrdude-doc] tool. Since this wasn't installed
before, we would have to modify the `default.nix` file by adding the `avrdude`
package to the mix.

```nix
# default.nix
{ stdenv, pkgs }:

stdenv.mkDerivation rec {
  name = "arduino-dev-${version}";
  src = ./.;
  version = "0.1.0";

  ARDUINO_PATH="${pkgs.arduino-core}";

  buildInputs = with pkgs; [
    arduino
    avrdude
  ];

  shellHook = ''
    export PATH="$PATH:${pkgs.arduino-core}/share/arduino/"
  '';
}
```

<div class="element note">
A change to the nix files is only honored once we restart the shell, so do
yourself a favor, exit the running nix-shell and start the nix-shell again
after `avrdude` is added to the `buildInputs`.
</div>

At this stage, one may run

```bash
avrdude \
	-C${ARDUINO_PATH}/share/arduino/hardware/tools/avr/etc/avrdude.conf \
	-patmega32u4 \
	-cavr109 \
	-v -v -v -v \
	-P/dev/ttyACM0 \
	-b57600 \
	-D \
	-Uflash:w:${PWD}/out/Blink.cpp.hex:i
```

to upload the prior generated binary to the board.

:boom: In case you run into the

```
avrdude: ser_recv(): programmer is not responding
avrdude: butterfly_recv(): programmer is not responding
```

errors please

 - verify that the specified port is actually the correct port as explained
 [earlier](#which-port),
 - verify that the specified board and/or the processor correspond to the board
 and processor plugged into the machine and
 - ensure that the board switches "bootloader mode"

which would generally lead to resolution.

<div class="element note">
:bulb: For the Leonardo board known as device `ttyACM0`, the [Arduino Leonardo
documentation :book:][arduino-leonardo] mentions that one may set the board
into bootloader mode by opening and closing a serial connection at 1200 baud.
One may accomplish this in Linux by executing

```bash
stty -F /dev/ttyACM0 ispeed 1200 ospeed 1200
```

after which the led fades in and out to indicate that it is in bootloader mode
and good to go. For other board types, one would have to figure out what the
procedure is to get into bootmode. The Mega board, for instance doesn't require
any sorcery to make things work. Simply using the correct port and calling
avrdude with the appropriate arguments will result to a successful flash unless
the board and processor are defective.
</div>

For demonstrative purposes you can have a glance at [a Makefile][mkfile-neopixel]
which I wrote to simplify the build and flash process with arduino-builder for a
something I was fooling around at home with :stuck_out_tongue_closed_eyes:. The
make rules `build`, `clean` and `flash` should be sufficient for basic workflows.

## <span id="3"> 3

I would have to write a custom Makefiles to call `gcc` while including the
Wiring library and all other required libs, while perform all linking activities
myself. I would also have to provide a main function that calls the `setup` and
`loop` functions, unless the Wiring library has off-the-shelf method of handling
this which I don't remember. I did this a while ago in university, but have am
too lazy to look into my archives (which I don't have within reach at the moment
anyways). So let's just call this a work in progress. Hopefully some day I'll
get around to it. :rainbow:

## <span id="links"> Links

- [Arduino manpage][arduino-manpage]
- [`arduino-builder` on :octocat:][arduino-builder]
- [`avrdude` :books:][avrdude-doc]
- [Experimenting with `arduino-builder`][experimenting-arduino-builder]
- [inotool][inotool]

[nixpkgs-all-arduino]: https://github.com/NixOS/nixpkgs/blob/17.09/pkgs/top-level/all-packages.nix#L459
[nixpkgs]: https://github.com/NixOS/nixpkgs
[inotool]: http://inotool.org/
[arduino-manpage]: https://github.com/arduino/Arduino/blob/master/build/shared/manpage.adoc
[experimenting-arduino-builder]: https://microcontrollerelectronics.com/experimenting-with-arduino-builder/
[arduino-builder]: https://github.com/arduino/arduino-builder
[rzetterberg-teensy-nixos]: https://rzetterberg.github.io/teensy-development-on-nixos.html
[ada-arduino-neopixel-use]: https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library-use
[ada-arduino-lib-install]: https://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library-installation
[neopixel-guide]: https://cdn-learn.adafruit.com/downloads/pdf/adafruit-neopixel-uberguide.pdf
[nixos-currentSystem]: https://nixos.org/nix/manual#builtin-currentSystem
[arduino-examples]: https://github.com/arduino/Arduino/blob/master/build/shared/manpage.adoc#examples
[avrdude-doc]: http://www.nongnu.org/avrdude/user-manual/avrdude.html
[nixos-user-mgmt]: https://nixos.org/nixos/manual/index.html#sec-user-management
[arduino-leonardo]: https://store.arduino.cc/arduino-leonardo-with-headers
[arduino-loader-nicolas]: https://nicholaskell.wordpress.com/tag/leonardo/

[mkfile-neopixel]: https://github.com/vidbina/arduino-neopixel-strip/blob/22bae965d5f457829d4da060195846d076c76bd6/Makefile
