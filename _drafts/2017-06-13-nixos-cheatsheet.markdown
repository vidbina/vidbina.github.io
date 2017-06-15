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
As I'm not the brightest idiot out there I try to produce digital notes-to-self in
an effort to externalize some knowledge. Honestly speaking, I probably use note-taking
more as a mechanism to weave knowledge into the fabric of my brain and therefore
improve recall which isn't exactly my strong suit as I have made apparent from the start
of this post. Some say writing things down helps one remember, so here goes... :notebook:

# Nix Basics

In Nix* parlance you will often notice the terms [profile][nix-profile] and generation
being thrown around. To make it a bit clearer one should have a decent understanding of
the nix store.

The nix store contains all packages that are installed on your system in unique
directories which are prefixed by a cryptographic hash that contains the inputs involved
in building the package such that every build of the exact same package would result to
the same cryptographic hash for the installation directory, while a minor tweak, perhaps
just the addition or removal of a single dependency or compiler flag, will produce a
different prefix altogether.

In my system, for example, the GCC man pages are installed to `/nix/store/81dm4qw-gcc-5.4.0-man/`
where `81dm4qw` represents a trucated hash since it displaying full hashes in a
post doesn't help anyone :wink:. Anytime, I have the gcc manpages installed and
encounter the exact same hash in the directory name, I can pretty much be confident
that the files in that directory are similar to the ones I have encountered before.
A different hash, however; would indicate that there is a difference in the the gcc
manpages, or perhaps the way they were built or installed.

Since the `/nix/store` paths are rather cryptic and kind of user-unfriendly in a certain way
(i.e.: PATH would be a unlegible mess with just a small number of such paths added to it),
nix introduces the concept of profiles and generations.

Profiles are simply a representation of the packages are are available within a given
environment and generations represent versions of those profiles.

In short, my personal profile `~/.nix-profile` points to something in the
`/nix/var/nix/profiles` directory which contains a manifest.nix file and a `bin` and
`share` directory that contain symlinks to the appropriate destinations somewhere in
`/nix/store`.

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

With the `bin` directory as specified by my profile, added to $PATH, one can easily call
all the executable inside this `bin` directory. In fact, with multiple profile directories
containing their own `bin` directories, one can switch environments by simply rerouting
symlinks. This is the where NixOS gets to boast atomic profile switches or updates.

<!-- `$HOME/.nix-profile/bin:$HOME/.nix-profile/sbin:$HOME/.nix-profile/lib/kde4/libexec:/nix/var/nix/profiles/default/bin:/nix/var/nix/profiles/default/sbin:/nix/var/nix/profiles/default/lib/kde4/libexec:/run/current-system/sw/bin:/run/current-system/sw/sbin:/run/current-system/sw/lib/kde4/libexec` -->


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

One may also

```
nix-env -f ~/.nix-defexpr -qa
```

## Install a package only for the duration of a session

```
nix-shell -p libjpeg openjdk
```

# Channels

```
~/.nix-defexpr
├── channels -> /nix/var/nix/profiles/per-user/vid/channels
└── channels_root -> /nix/var/nix/profiles/per-user/root/channels
```

```
nix-channel --add https://nixos.org/channels/nixos-17.03-small
```

Note that `tree -L 2 ~/.nix-defexpr`

Adds a channel

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

Most likely, the former execution of

`nix-channel --add https://nixos.org/channels/nixos-17.03-small nixos`.

confused my setup.

After removing the channel inapporpriately named nixos

```nix-channel --remove nixos```

and re-adding it without specifying the optional name

`nix-channel --add https://nixos.org/channels/nixos-17.03-small`,

an update was required to enforce the changes

```nix-channel --update```.

After the change, a query actually presented the results from the different channels.

```
$ nix-env -qaP go
nixos.go_bootstrap              go-1.4-bootstrap-20161024
nixos-17.03-small.go_bootstrap  go-1.4-bootstrap-20161024
nixos.go_1_6                    go-1.6.4
nixos-17.03-small.go_1_6        go-1.6.4
nixos.go                        go-1.7.4
nixos-17.03-small.go            go-1.7.4
```

## Links

- https://github.com/NixOS/nixpkgs/issues/9682
- https://mailman.science.uu.nl/pipermail/nix-dev/2013-October/011898.html
- [name-coll]: https://unix.stackexchange.com/questions/332272/name-collision-in-input-nix-expressions-with-nix-env-f
- [nix-profiles]: https://nixos.org/nix/manual/#sec-profiles
- [nix-env]: https://nixos.org/nix/manual/#sec-nix-env
