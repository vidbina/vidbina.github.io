---
layout: post
title: NixOS cheatsheet
description: |
  A messy coverage of some basics that I may commonly refer to during my NixOS
  :snowflake: usage.
date:  2017-06-13 00:00:49 +0000
type: tools # for icon
category:
 - tools
 - nixos
tags:
 - nixos
 - os
 - operating system
 - package manager
 - nix
 - linux
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
mathjax: true
emojify: true
---
Learning Nix, I felt the need to take notes. My future self will thank me
for the reminders :wink:.

<div class="element note">
:bomb: I'm a total noob with Nix, I'm just writing just because my stupid brain
forgets shit all the time. Don't use this as a source of truth. I will update
things as I learn more, but I have already seen a few talks that suggest that
some of the CLI tools that I refer to here may be something of the past soon
enough. You've been warned :wink:.
</div>

# Nix Basics

In Nix* parlance you will often notice the terms [profile][nix-profiles] and
generation being thrown around. One should have a decent understanding of the
nix store to demystify these concepts.

The nix store contains all packages that are installed on your system in unique
directories which are prefixed by a cryptographic hash that contains the inputs
involved in building the package such that every build of the exact same
package would result to the same cryptographic hash for the installation
directory, while a minor tweak, perhaps just the addition or removal of a
single dependency or compiler flag, will produce a different prefix altogether.

In my system, for example, the GCC man pages are installed to `/nix/store/81dm4qw-gcc-5.4.0-man/`
where `81dm4qw` represents a trucated hash since displaying full hashes in a
post doesn't help anyone :wink:. Any time, I have the gcc manpages installed
and encounter the exact same hash in the directory name, I can be pretty
confident that the files in that directory are similar to the ones I may have
encountered before, perhaps even elsewhere. A different hash, however; would
indicate that there is a difference in the the gcc manpages, its dependencies
or perhaps the way they were built or installed.

Since the `/nix/store` paths are rather cryptic and kind of user-unfriendly in
a certain way (i.e.: PATH would be a unlegible mess with just a small number of
such paths added to it), Nix introduces the concept of profiles and
generations.

Profiles are simply a representation of the packages are are available within a
given environment and generations represent versions of those profiles.

In short, my personal profile `~/.nix-profile` points to something in the
`/nix/var/nix/profiles` directory which contains a manifest.nix file and a
`bin` and `share` directory that contain symlinks to the appropriate
destinations somewhere in `/nix/store`.

```
$HOME/.nix-profile
├── bin
│   │   ...
│   ├── tor -> /nix/store/${TOR_HASH}-tor-x.x.x/bin/tor
│   └── ...
├── manifest.nix -> /nix/store/${MANIFEST_HASH}-env-manifest.nix
└── share
    │   ...
    ├── tor -> /nix/store/${TOR_HASH}-tor-x.x.x/share/tor
    └── ...

4 directories, 4 files
```

With the `bin` directory as specified by my profile, added to `$PATH`, one can
easily call all the executables inside this `bin` directory. In fact, with
multiple profile directories containing their own `bin` directories, one can
switch environments by simply rerouting symlinks. This is the where NixOS gets
to boast atomic profile switches or updates.

<div class="element note">
Note that `$HOME/.nix-profile` is symlinked to
`/nix/var/nix/profiles/per-user/vid/profile` in my case, which happens to be
symlinked to `/nix/var/nix/profiles/per-user/vid/profile-NN-link` (where NN is
some number). Inside the `/nix/var/nix/profiles/per-user/vid` directory I find
a couple of symlinks that fit the profile-NN-link pattern which makes the
changing of my profile as simple as just switching the profile symlink to point
to one of those profile-NN-link targets :wink:.  Atomic AF!
</div>

{% if false %}
`$HOME/.nix-profile/bin:$HOME/.nix-profile/sbin:$HOME/.nix-profile/lib/kde4/libexec:/nix/var/nix/profiles/default/bin:/nix/var/nix/profiles/default/sbin:/nix/var/nix/profiles/default/lib/kde4/libexec:/run/current-system/sw/bin:/run/current-system/sw/sbin:/run/current-system/sw/lib/kde4/libexec`
{% endif %}

# Packages

NixOS allows the use of packages like any other sane distribution out there. One can
actually use NixOS like you would any other distribution by imperatively adding the
packages you need using a tool like `nix-env` , however; NixOS's package manager nix
allows a more powerful method for controlling the packages on your box.

## `nix-env` Operations

So the `nix-env` CLI boasts a few operations:
 - `--install` or `-i`
 - `--upgrade` or `-u`
 - `--uninstall` or `-e`
 - `--set`
 - `--set-flag`
 - `--query`
 - `--switch-profile` or `-S`
 - `--list-generations`
 - `--delete-generations`
 - `--switch-generations` or `-G` and
 - `--rollback`

all of which are discussed at length at the `man nix-env` or `nix-env --help` pages, yet
I repeated them here in order to provide an escape for the lazy future self.

### Query for available packages

You can only install packages once you know their names. Using the query operation
of `nix-env` allows one to explore whatever is installed in the current generation
or whatever is available for installation in the nix expression.

The current generation basically represents the entire constellation of packages that
are currently installed and part of your nix profile.

Query `-q` available `-a` packages that match the provided argument while preserving `-P`
already installed packages on the system (i.e.: retain formerly installed versions of a
specified derivation while attempting to install the version specified in the argument).

```
nix-env -qaP firefox
```

Which, for debian-based distro users, is more analogous to `apt-cache search firefox`.

<div class="element note">
Running `nix-env -qaP pasystray` provides me with the output

```
nixos.pasystray              pasystray-0.6.0
nixos-17.03-small.pasystray  pasystray-0.6.0
```

which indicates that version 0.6.0 of pasystray is available in the nixos and
nixos-17.03-small channels
</div>

One may also specify the nix expression by specifying the path to the nix
expression using the `-f` flag

```
nix-env -f ~/.nix-defexpr -qa
```

which becomes helpful when testing changes to a nixpkgs repository.

Let's, for the sake of argument, suppose that I have the nixpkgs repository
checked out to the `my_nixpkgs` directory. When I've made changes to the
nixpkgs repository I spawn a nix shell within which I try to install the
modified or newly added package. After modifying the nixpkgs repository to add
a `terraform_0_11` derivation, one can verify that the newly added package is
listed by querying the index

```
nix-env -f nixpkgs=my_nixpkgs -qaP terraform_0_11
```

and subsequently install the new package by running

```
nix-env -f nixpkgs=my_nixpkgs -i terraform_0_11
```

which may be done in the current shell, or even better a seperate nix-shell
just to keep things isolated :wink:.

<div class="element screencast">
<script type="text/javascript" src="https://asciinema.org/a/FRrvhg1eqRHf2wh9nnxsTDYPG.js" id="asciicast-FRrvhg1eqRHf2wh9nnxsTDYPG" async></script>
</div>

## Install a package only for the duration of a session

```
nix-shell -p libjpeg openjdk
```

# Channels

Within the Nix ecosystem, packages are delivered through the medium of
channels, which represent a collection of assets that fly under a given flag.

The [channels repository][gh-nixpkgs-channels] provides references for
every channel in relation to the [nixpkgs repository][gh-nixpkgs].

A simple glance into the [branches inside the nixpkgs-channels repository]
provide the insight into the cannels that are available, which as of the 26th
of June 2017 include:

 - nixpkgs-unstable (development branch, bleeding edge, not recommended for production)
 - nixos-unstable-small
 - nixos-17.03 (stable channel, think Ubuntu LTS-ish :wink:)
 - nixos-17.03-small

among some stale branches

 - nixos-14.12
 - nixos-14.12-small

which I suppose you'd generally want to avoid.

The [Upgrading NixOS][nixos-upgrade] section in the manual provides a clear
explanation and recommendation regarding the channels so feel free to consult
the source :wink:. The gist is that new PR's are generally merged into
channels postfixed as `-small` a bit faster than their stable counterparts.

List the channels on your current system using `nix-channel --list`
and find the expressions for your channels within the `~/.nix-defexpr`
directory

```
~/.nix-defexpr
├── channels -> /nix/var/nix/profiles/per-user/vid/channels
└── channels_root -> /nix/var/nix/profiles/per-user/root/channels
```

which indicates that the system is set up with a path for the root channel
(which are shared among all users of the system) and private channels which
as user specific.

<div class="element note">
NOTE: that running `sudo nix-channel --list` will provide a listing of the
channels as known to the user root, which may differ from the regular user
who's channel listing you may review through `nix-channel --list`.
</div>

Adding the nixos-17.03-small channel may be done by executing
`nix-channel --add https://nixos.org/channels/nixos-17.03-small`

## Name collision in input Nix expression, skipping...

```
$ nix-env -qaP go
warning: name collision in input Nix expressions, skipping ‘/store/vidbina.home/.nix-defexpr/channels_root/nixos’
nixos.go_bootstrap  go-1.4-bootstrap-20161024
nixos.go_1_6        go-1.6.4
nixos.go            go-1.7.4
```

After running `nix-channel --list`, I realised that I had added a non-stable channel under
the `nixos` name and wondered if perhaps the nixos name for a channel is already used by
Nix* internals and therefore collides.

Wondering whether the name collision issue may be attributed to the previous adding
of a channel under an already "reserved" name, being `nixos`, prompted the idea to remove
the channel to observe whether it resolved the issue.

The former execution of
`nix-channel --add https://nixos.org/channels/nixos-17.03-small nixos`.
pparently confused my setup which already contained a (root) channel named
`nixos`.

After removing the recently added user channel named nixos
`nix-channel --remove nixos` and re-adding it without specifying the
optional name
`nix-channel --add https://nixos.org/channels/nixos-17.03-small`,
the channel was added with the name `nixos-17.03-small`.

<div class="element note">
NOTE: Adding channels without providing the name simply names the channel in
accordance to the last phrase of the channel URL with the suffix `-stable` or
`-unstable` removed from the name such that `nixos-17.03-small` remains
`nixos-17.03-small` and `nixos-unstable-small` becomes `nixos-small` :wink:.
</div>

An update through `nix-channel --update`
was required to enforce the changes after which a query actually presented the
results from the different channels. :victory:

```
$ nix-env -qaP go
nixos.go_bootstrap              go-1.4-bootstrap-20161024
nixos-17.03-small.go_bootstrap  go-1.4-bootstrap-20161024
nixos.go_1_6                    go-1.6.4
nixos-17.03-small.go_1_6        go-1.6.4
nixos.go                        go-1.7.4
nixos-17.03-small.go            go-1.7.4
```

If you still are still looking at this error message study these
[Nix dev mailing list][nix-dev-name-coll] and [Stackexchange][name-coll]
threads for more information. Godspeed :rocket:

## Syntax

I've been using NixOS for the better part of the last 2 months now and I still
find myself fighting its syntax and eco-system from time to time. Since I'm a
big believer in practice, I decided to tweak a few packages to my liking or
at least attempt to add some functionality that I needed as an exercise in
wrapping my mind around the Nix-verse.

Let's simplify our lives by making the Nix repl available.

```
nix-env -i nix-repl
```

Within the nix repl it becomes easy to try out different statements and
expressions and perform some introspection. Inside the REPL one may

 - enter `:?` for the help menu
 - double TAB to trigger the autocompleter which exposes whatever is in scope :wink:
 (e.g.: functions and variables).

<div class="element image">
  <img src="/img/nix-repl-intro.png" alt="Screenshot of nix-repl" />
</div>

A helpful resource to keep close is the [syntax summary][nix-syntax-summary]
does exactly what its name implies :wink:.

So to drop to a practical use case. I've been meaning to override something in
firefox for a while.  Firefox, like any other Nix module, is defined in
[nixpkgs][nixpkgs-firefox]
as a [function][nix-fn] that takes some configuration flags and dependencies as
a set of arguments and returns a set of options, which in Nix syntax looks a
bit like `inputs: outputs` but is explained in detail in the
[Nix documentation on writing Nix expressions][nix-expr].

<div class="element note">
Tip :bulb: Feel free to enter all of the expressions displayed in the text as

```nix
expr
```

into the REPL in order to follow along. It's the best way to learn  :wink:.
</div>


### Functions

A doubling lambda $x \mapsto x\times 2$ is expressed in Nix as

```nix
x: x*2
```

and could be called by passing an argument, let's say $24$, as

```nix
(x: x*2) 24
```

where it is important to note that the lambda is enclosed between parenthesis
to indicate to the language how to tokenize the expression.

A function call in Nix looks like `fn arg` and without the parenthesis, the
expression

```nix
x: x*2 24
```

will represent a lambda that takes x, multiplies x by two and then applies 24
to the output of the multiplication. What the hell does that even mean?!?
:confused: Since `x*2` does not yield a function we are basically committing an
offense by attempting to apply 24 to the output of a multiplication operation.

Nix is user-friendly enough to throw
`error: attempt to call something which is not a function but an integer, at … `
whenever we pull crap like this.


Nix seem to deal with unary functions only, therefore passing multiple
arguments to a function isn't possible. What we can do, however; is pass a set
that contains an arbitrary amount of values to meet our needs. Calculating the
area of a triangle by returning half the product of the base $b$ and height $h$
could be represented as follows

```nix
areaOfTriangle = { b, h }: b*h/2
```

and subsequently called by passing a set with `a` and `b` defined :wink:.

```nix
areaOfTriangle { b = 12; h = 12; }
```

### Let

Of course, being able to bind expressions to names is cool, but using globals
isn't[^globals]. Inside the REPL you may be able to do this, but don't get too used to
it. The `let` statement allows one to specify a binding that will be limited to
the scope that follows the `in` keyword.

```nix
let n = 12; in {
  name = "example";
  n = n;
  version = "v0.${toString n}";
}
```

is a much cleaner way to deal with bindings.

### Builtins

[Learn x in y][learnxiny-nix] provides an excellent


### Demystifying the Firefox package

The `firefox` attribute in [all-packages.nix][gh-nixpkgs-all-firefox]
is bound to the output of `wrapFirefox firefox-unwrapped { }`.

In this case, the [wrapFirefox binding][gh-nixpkgs-all-wrapFirefox] has the
output of

```nix
callPackage ../applications/networking/browsers/firefox/wrapper.nix { }
```

assigned to it, which begs the question... what is `callPackage`? Well,
[callPackage is a convenience function][nixos-callPackage] that basically
fills in the blanks on a package import that may require some attributes that
are defined in nixpkgs.


In all-packages The
[wrapper function][gh-nixpkgs-wrapFirefox] takes a set with
dependencies such as stdenv, lib and some plugins, then it takes a browser
set and subsequently a configuration set for the browserName, desktopName and
an icon, among some other configurations, and returns a derivation.

```nix
(((wrapFirefox {}) browser) {})
```

```nix
__functionArgs (wrapFirefox)
```

Understanding what we feed into `wrapFirefox` requires understanding what rrecursive set [`firefox` from firefox/packages.nix][gh-nixpkgs-firefox-unwrapped]
```nix
:l nixpkgs # ignore if <nixpkgs> is already loaded
__attrNames firefox
```

In order to observe the output derivation whenever we call firefox

The wrapper takes a set containing stdenv, lib, config, esteidfirefoxplugin,
among others and returns a lambda that takes another set `browser` that returns
another lambda that takes a set that requires a configuration set for the
browser and populates some default attributes based on the `browser` binding
established prior after which we return a derivation.

```nix
{ stdenv, lib, makeDesktopItem, makeWrapper, config
, flashplayer, hal-flash
, MPlayerPlugin, ffmpeg, gst_all, xorg, libpulseaudio, libcanberra_gtk2
, supportsJDK, jrePlugin, icedtea_web
, trezor-bridge, bluejeans, djview4, adobe-reader
, google_talk_plugin, fribid, gnome3/*.gnome_shell*/
, esteidfirefoxplugin
, vlc_npapi
, libudev
}:

# configurability of the wrapper itself
browser:
{ browserName ? browser.browserName or (builtins.parseDrvName browser.name).name
, name ? (browserName + "-" + (builtins.parseDrvName browser.name).version)
, desktopName ? # browserName with first letter capitalized
  (lib.toUpper (lib.substring 0 1 browserName) + lib.substring 1 (-1) browserName)
, nameSuffix ? ""
, icon ? browserName
}:
# build output set
{ ... }
```


```nix
wrapFirefox { stdenv ? stdenv, meta = {}  } {} {}
```

and returns a lambda that

```nix
:l nixpkgs # ignore if <nixpkgs> is already loaded
firefox.plugins # or
let ff = wrapFirefox firefox-unwrapped {}; in ff.plugins
```

## Links

- [PR convo about installing a specific package version][pr-nix-install-specific-version]
- [[Nix-dev] warning: name collision in input Nix expressions][nix-dev-name-coll]
- [NixOS Manual: Configuration Syntax][nix-conf-syntax]
- [NixOS Manual: Syntax Summary][nix-syntax-summary]
- [NixOS Manual: Upgrading NixOS][nixos-upgrade]
- [Nix Manual: Writing Nix Expressions][nix-expr]
- [Learn x in y: nix][learnxiny-nix]

[nix-dev-name-coll]: https://mailman.science.uu.nl/pipermail/nix-dev/2013-October/011898.html
[nix-conf-syntax]: https://nixos.org/nixos/manual/index.html#sec-configuration-syntax
[pr-nix-install-specific-version]: https://github.com/NixOS/nixpkgs/issues/9682
[name-coll]: https://unix.stackexchange.com/questions/332272/name-collision-in-input-nix-expressions-with-nix-env-f
[nix-profiles]: https://nixos.org/nix/manual/#sec-profiles
[nix-env]: https://nixos.org/nix/manual/#sec-nix-env
[gh-nixpkgs-channels]:  https://github.com/NixOS/nixpkgs-channels
[gh-nixpkgs-channels Branches]:  https://github.com/NixOS/nixpkgs-channels/branches
[gh-nixpkgs]:https://github.com/NixOS/nixpkgs
[nixos-upgrade]: https://nixos.org/nixos/manual/index.html#sec-upgrading
[nix-expr]: http://nixos.org/nix/manual/#chap-writing-nix-expressions
[nix-fn]: http://nixos.org/nix/manual/#ss-functions
[nix-syntax-summary]: https://nixos.org/nixos/manual/index.html#sec-nix-syntax-summary
[gh-nixpkgs-wrapFirefox]: https://github.com/NixOS/nixpkgs/blob/2799a94963aaf37f059b5ed4c0d2b0cf98ba445e/pkgs/applications/networking/browsers/firefox/wrapper.nix
[gh-nixpkgs-all-wrapFirefox]: https://github.com/NixOS/nixpkgs/blob/2799a94963aaf37f059b5ed4c0d2b0cf98ba445e/pkgs/top-level/all-packages.nix#L16682
[gh-nixpkgs-all-firefox]: https://github.com/NixOS/nixpkgs/blob/2799a94963aaf37f059b5ed4c0d2b0cf98ba445e/pkgs/top-level/all-packages.nix#L14254
[gh-nixpkgs-firefox-packages]: https://github.com/NixOS/nixpkgs/blob/2799a94963aaf37f059b5ed4c0d2b0cf98ba445e/pkgs/applications/networking/browsers/firefox/packages.nix
[gh-nixpkgs-firefox-unwrapped]: https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/browsers/firefox/packages.nix#L7
[learnxiny-nix]: https://learnxinyminutes.com/docs/nix/
[nixos-callPackage]: https://nixos.org/nix/manual/#ex-hello-composition-co-3
[nix-drv]: https://nixos.org/nix/manual/#ssec-derivation
[nix-drv-pill]: https://nixos.org/nixos/nix-pills/our-first-derivation.html
[nix-cheatsheet]: https://nixos.wiki/wiki/Cheatsheet

[^globals]: Using globals is unsustainable because it becomes increasingly harder to keep track of which globals are defined and who assigns values to global references. This could lead to name collisions or even worse, if bindings are mutable, changes of global references.
