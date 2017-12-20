---
layout: post
title: OpenStack Primer
description: |
  A primer on OpenStack use and development on Linux, with extra attention to NixOS use.
date:  2017-12-14 09:32:08 +0000
type: cloud # for icon
category:
 - cloud
 - openstack
tags:
 - cloud
 - openstack
 - python
 - nixos
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
While run some OpenStack experiments on my NixOS setup, I decided to focus on
setting up a local development environment where I could run the tests and execute a build.


Starting out with `default.nix` containing

```nix
{ stdenv, pkgs }:

stdenv.mkDerivation rec {
  name = "openstack-toolbox-${version}";
  version = "0.1.0";

  src = ./.;

  buildInputs = with pkgs; [
    python3Packages.pip
    python3Packages.virtualenv
  ];
}
```

and `shell.nix` containing

```nix
{ system ? builtins.currentSystem }:

let pkgs = import <nixpkgs> {};
in pkgs.callPackage ./default.nix {}
```

I attempted to follow the instructions in the
[OpenStack Python Project Guide][os-py-proj-guide] which recommend the usage
of `virtualenv` and the installation of certain dependencies using `bindep`

<div class="element">
  <script type="text/javascript" src="https://asciinema.org/a/A5rmzVgsCUF6tQnBHU1oxhtEt.js" id="asciicast-A5rmzVgsCUF6tQnBHU1oxhtEt" data-rows="15" async></script>
  <pre style="display: none;">FileNotFoundError: [Errno 2] No such file or directory: 'lsb_release': 'lsb_release'</pre>
</div>

but on NixOS this operation fails since `lsb_release`, which is needed by
`bindep -b` isn't available. This led me to attempt to trick `bindep`
by defining a fake `lsb_release`

```nix
#default.nix
{ config, stdenv, pkgs }:

stdenv.mkDerivation rec {
  name = "openstack-toolbox-${version}";
  version = "0.1.0";

  src = ./.;

  buildInputs =
    with pkgs;
    let nixos = import <nixpkgs/nixos> {}; in [
      (writeScriptBin "lsb_release" ''
        #!${stdenv.shell}
  
        echo "nixos";
        echo "${nixos.config.system.nixosRelease}";
        echo "${nixos.config.system.nixosCodeName}";
      ''
      )
      python3Packages.pip
      python3Packages.virtualenv
    ];

  shellHook = ''
    source virtualenvs/nova/bin/activate
    cd nova
  '';
}
```

in order to realise that it wouldn't help after all.

I only needed `bindep -b` to enumerate the dependencies that aren't yet
fulfilled such that I can proceed and install the missing pieces, however;
since the bindep project does not define a [Platform][bindep-platforms] for
NixOS at the time of writing, bindep ends up attempting to access attributes of
an undefined platform :boom:. Mocking the output of another distro for which
there is a platform defined isn't a qualitative solution since one would
still need to map the package names to their respective counterparts in the
nixpkgs repository.

> I do not think it pays to define a `Platform` for NixOS since package names
are bound to differ accross different platforms and I find it ludricrous to
expect a project's maintainers to:
 - figure out the proper package name for every distro and/or
 - attempt to test and build a codebase against every distro to figure out if
 it breaks or not.

Getting shit built on NixOS is just some extra work that doesn't really have
strong merit. One could just figure out how to get it done but...

<div class="element">
  <blockquote class="imgur-embed-pub" lang="en" data-id="ur4Srzk"><a href="//imgur.com/ur4Srzk">me irl</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>
</div>

:speak_no_evil: Not everything has to be done in NixOS :hear_no_evil:

There are most definitely healthier ways to go about this.

The more maintainable route from the perspective of the package maintainer
seems to define a contained environment that is easier to setup from any
environment which tends to leave us with virtual machines or containers, so...

<div class="element video">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/ZY8hnMnUDjU" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
</div>

{% if false %}
## Still trying the NixOS approach

<div class="element">
  <script type="text/javascript" src="https://asciinema.org/a/KSebHzZnwTixLbzNF5DJMvIcm.js" id="asciicast-KSebHzZnwTixLbzNF5DJMvIcm" data-rows="15" async></script>
</div>

add
 - python27Full
 - python35Full

### pg_config

```
Collecting psycopg2===2.7.3.2 (from -c https://git.openstack.org/cgit/openstack/requirements/plain/upper-constraints.txt (line 81))
  Using cached psycopg2-2.7.3.2.tar.gz
    Complete output from command python setup.py egg_info:
    running egg_info
    creating pip-egg-info/psycopg2.egg-info
    writing top-level names to pip-egg-info/psycopg2.egg-info/top_level.txt
    writing pip-egg-info/psycopg2.egg-info/PKG-INFO
    writing dependency_links to pip-egg-info/psycopg2.egg-info/dependency_links.txt
    writing manifest file 'pip-egg-info/psycopg2.egg-info/SOURCES.txt'
    Error: pg_config executable not found.
    
    Please add the directory containing pg_config to the PATH
    or specify the full executable path with the option:
    
        python setup.py build_ext --pg-config /path/to/pg_config build ...
    
    or with the pg_config option in 'setup.cfg'.
```

ZIP shit

```
ValueError: ZIP does not support timestamps before 1980
```
{% endif %}
## Links

 - [OpenStack Python Project Guide][os-py-proj-guide]

[os-py-proj-guide]: https://docs.openstack.org/project-team-guide/project-setup/python.html#running-python-unit-tests
[bindep-platforms]: https://github.com/openstack-infra/bindep/blob/master/bindep/depends.py
