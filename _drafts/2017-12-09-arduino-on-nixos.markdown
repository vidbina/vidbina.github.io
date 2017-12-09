---
layout: post
title: Arduino on NixOS
description: |
  Add a description to this article here. Keep it short and sweet.
date:  2017-12-09 11:45:36 +0000
type: tools # for icon
category:
 - tools
 - electronics
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
---
The first attempt to start playing around with Arduino's on my machine had
involved installing the [`arduino` :octocat:][nixpkgs-all-arduino] package from
[nixpkgs :octocat:][nixpkgs].

After a few pathetic attempts to use the Arduino IDE in XMonad (my window
manager), I gave up on the GUI route. Basically the IDE seems to be okay, but
menus exhibit really weird behavior requiring me to keep the mouse depressed
while navigating towards the drop-down menu which appears way out of frame of
the menu bar. Furthermore, the IDE doesn't seem to play well with XMonad
dictating which dimensions to assume.

To be honest, I wasn't serious about using the IDE anyways. CLI tools are more
user-friendly when it comes to automation anyways so fvck the UI.

## 1

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

In order to compile and upload the sketch in one go, one may run

```bash
arduino \
  --board arduino:avr:nano:cpu=atmega168 \
  --port /dev/ttyACM0 \
  --upload Blink.cpp
```

in case the board in question is an Arduino Nano donning the ATMega168 AVR
chipset. In case you're dealing with some other hardware, please explore the
boards.txt file

```bash
less $ARDUINO_PATH/share/arduino/hardware/arduino/avr/boards.txt
```

for the appropriate identifier for your hardware.


```bash
arduino \
  --board arduino:avr:nano:cpu=atmega168 \
  --port /dev/ttyACM0 \
  --verbose-build \
  --verbose-upload \
  --upload Blink.cpp
```

in case things fail in order to get more verbose output on the build and upload
progress to aid your sleuthing :mag:.

## 2

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

which is quite a handful.

> :smirk: Of course you didn't have to run the command with the
`-debug-level 10`, `-verbose` and `-warning all` arguments but in many cases it
is convenient to have sufficient information available in case things :poop:
fail.

After a succesful build, one should find the build artifacts inside the `out`
directory :trophy:.

After building one would still need to flash the Arduino. This could be done
by using the `avrdude` tool. Since this wasn't installed before, we would have
to modify the `default.nix` file by adding the `avrdude` package to the mix

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

> A change to the nix files is only honored once we restart the shell, so do
yourself a favor, exit the running nix-shell and start the nix-shell again
after `avrdude` is added to the `buildInputs`.

At this stage, one may run

```bash
hello
```

to upload the prior generated binary to the board.

To round it all up, all of this manual labor warrants the use of a Makefile to
simplify the entire dance by storing

```make
BUILDER=arduino-builder
FLASHER=avrdude
MKDIR=mkdir -p
RM=rm -rf

BUILD_DIR=${PWD}/out

build:
	${MKDIR} ${BUILD_DIR}
	${BUILDER} \
		-build-path ${BUILD_DIR} \
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

flash:
	${FLASHER} --version

clean:
	${RM} ${BUILD_DIR}

.PHONY: build clean flash
```

into the file `Makefile` and subsequently calling the defined rules `clean`,
`build` and `flash` by running `make clean`, `make build` and `make flash` from
the console :metal:.

## 3

## Links

- [Arduino manpage][arduino-manpage]
- [inotool][inotool]
- [Experimenting with `arduino-builder`][experimenting-arduino-builder]
- [`arduino-builder` on :octocat:][arduino-builder]

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
[avrdued-doc]: http://www.nongnu.org/avrdude/user-manual/avrdude.html
