---
layout: post
title: NixOS cheatsheet
description: |
  Add a description to this article here. Keep it short and sweet.
date:  2017-06-13 00:00:49 +0000
type: tools # for icon
category: tools # for url
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
---
Learning Nix, I felt the need to take notes. My future self will thank me
for the reminders :wink:.

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

> Note that `$HOME/.nix-profile` is symlinked to `/nix/var/nix/profiles/per-user/vid/profile`
in my case, which happens to be symlinked to `/nix/var/nix/profiles/per-user/vid/profile-NN-link`
(where NN is some number). Inside the `/nix/var/nix/profiles/per-user/vid`
directory I find a couple of symlinks that fit the profile-NN-link pattern
which makes the changing of my profile as simple as just switching the
profile symlink to point to one of those profile-NN-link targets :wink:.
Atomic AF!

{% if fasle %}
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

> Running `nix-env -qaP pasystray` provides me with the output
```
nixos.paysystray              pasystray-0.6.0
nixos-17.03-small.paysystray  pasystray-0.6.0
```
which indicates that version 0.6.0 of pasystray is available in the nixos and
nixos-17.03-small channels

One may also

```
nix-env -f ~/.nix-defexpr -qa
```

## Install a package only for the duration of a session

```
nix-shell -p libjpeg openjdk
```

# Channels

Within the Nix ecosystem, packages are delivered through the medium of
channels, which represent a collection of assets that fly under a given flag.

The [channels repository][github-nixpkgs-channels] provides references for
every channel in relation to the [nixpkgs repository][github-nixpkgs].

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

The [Upgrading NixOS][Upgrading NixOS] section in the manual provides a clear
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

> NOTE: that running `sudo nix-channel --list` will provide a listing of the
channels as known to the user root, which may differ from the regular user
who's channel listing you may review through `nix-channel --list`.

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

After running ```nix-channel --list```, I realised that I had added a non-stable channel under
the `nixos` name and wondered if perhaps the nixos name for a channel is already used by
Nix* internals and therefore collides.

Wondering whether the name collision issue may be attributed to the previous adding
of a channel under an already "reserved" name, being `nixos`, prompted the idea to remove
the channel to observe whether it resolved the issue.

The former execution of
```nix-channel --add https://nixos.org/channels/nixos-17.03-small nixos```.
apparently confused my setup which already contained a (root) channel named
`nixos`.

After removing the recently added user channel named nixos
```nix-channel --remove nixos``` and re-adding it without specifying the
optional name
```nix-channel --add https://nixos.org/channels/nixos-17.03-small```,
the channel was added with the name `nixos-17.03-small`.

> NOTE: Adding channels without providing the name simply names the channel in
accordance to the last phrase of the channel URL with the suffix `-stable` or
`-unstable` removed from the name such that `nixos-17.03-small` remains
`nixos-17.03-small` and `nixos-unstable-small` becomes `nixos-small` :wink:.

An update through ```nix-channel --update```
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

I've been using NixOS for the better part of the last 2 months now and am still
fighting with its syntax and eco-system from time to time. Since I'm a big
believer or doing shit to understand what is going on, I decided to tweak a few
packages to my liking or attempt to add some functionality that I needed as an
exercise in wrapping my mind around the Nix-verse.

Let's simplify our lives by making the Nix repl available.

```
nix-env -i nix-repl
```

Within the nix repl we can try out different statements and expressions and perform some
introspection. Inside the repl we could

 - enter `:?` for the help menu
 - double TAB to trigger the autocompleter which exposes whatever is in scope :wink:
 (e.g.: functions and variables).

<div class="element img">
  <img src="/img/nix-repl-intro.png" alt="Screenshot of nix-repl" />
</div>

So to drop to a practical use case. I've been meaning to override something in firefox for a
while.


## Links

- [PR convo about installing a specific package version][pr-nix-install-specific-version]
- [[Nix-dev] warning: name collision in input Nix expressions][nix-dev-name-coll]
- [NixOS Manual: Upgrading NixOS][Upgrading NixOS]

[nix-dev-name-coll]: https://mailman.science.uu.nl/pipermail/nix-dev/2013-October/011898.html
[pr-nix-install-specific-version]: https://github.com/NixOS/nixpkgs/issues/9682
[name-coll]: https://unix.stackexchange.com/questions/332272/name-collision-in-input-nix-expressions-with-nix-env-f
[nix-profiles]: https://nixos.org/nix/manual/#sec-profiles
[nix-env]: https://nixos.org/nix/manual/#sec-nix-env
[github-nixpkgs-channels]:  https://github.com/NixOS/nixpkgs-channels
[github-nixpkgs-channels Branches]:  https://github.com/NixOS/nixpkgs-channels/branches
[github-nixpkgs]:https://github.com/NixOS/nixpkgs
[Upgrading NixOS]: https://nixos.org/nixos/manual/index.html#sec-upgrading
