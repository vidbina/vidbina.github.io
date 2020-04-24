---
layout: post
title: Understanding nixos-configuration imports
description: |
  With a nixos-configuration defined over multiple .nix-files, one may define
  values for the same attributes in different files to be composed into a
  single value. This allows one to define parts of attributes wherever it makes
  most sense (e.g.: whever the relevant package is actually defined) and this
  article explores how this actually works.
date: 2018-10-27 11:38:13 +0000
type: linux configuration setup tooling computer # for icon
category: nixos # for url
tags:
 - nixos
 - nixos-configuration
 - nix
 - zsh
 - bash completion
 - shell completion
 - linux
 - configuration management
 - tooling
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

Just sat through an informative few days at [#NixCon2018
:snowflake:][NixCon2018] for which the [videos are now available
online][NixCon2018] :wink: :wink:.

While fiddling with nixos-configuration, I ran into the problem of wanting to
define parts of my `program.zsh.promptInit` wherever an associated package
would be listed in a multi-file setup.

## Setup

Consider a nixos-configuration :snowflake: consisting of multiple .nix-files of
which an extract would reflect the following file tree structure:

```
/home/vidbina/nixos-configuration
├── cad.nix
├── productivity.nix
└── virt.nix
```

where `configuration.nix` is the entry-point of the config and the `imports`
attribute is used to "import" :unamused: the other .nix-files as demonstrated in
the snippet below.

```nix
/* configuration.nix */
{ config, pkgs, ... }:

{
  imports = [
    ./hardware-configuration.nix # Include the results of the hardware scan.

    ./cad.nix
    ./productivity.nix
    ./virt.nix
  ];

  boot = { ... };

  hardware = { ... };

  programs = {
    zsh = {
      enable = true;
      promptInit = ''
        echo "promptInit configuration.nix"
      '';
    };
  };
```

With the taskwarrior package listed in the `productivity.nix` file, it would
make sense to define the taskwarrior-related zshrc junk (i.e.: shell
completions, etc) in that file as well.

```nix
/* productivity.nix */
{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    taskwarrior
  ];

  programs.zsh.promptInit = ''
    echo "promptInit productivity.nix"
    source ${taskwarrior}/share/bash-completion/completions/task.bash
  '';
}
```

In this case, one would possibly have better visibility over all related
attributes in the event of a change. For example, upon the removal of the
taskwarrior package, it would be helpful observe that the promptInit may need
modification as well, as opposed to having to manipulate multiple files for
such a change :thinking:.

Assuming that the other .nix-files have an attribute `program.zsh.promptInit`
set to an echo of the .nix-file's name in a similar fashion to
`productivity.nix` above, a new shell starts up with the following echos

```
promptInit virt.nix
promptInit productivity.nix
promptInit cad.nix
promptInit configuration.nix
```

which may lead to the assumption that assigning to the same key in mutliple
files that are imported by `imports`, prepends the content of those imported
files to that of the calling file (configuration.nix defines the the `imports`
attribute).

After altering the order of the values in the `imports` array, one may find
that the order of the echo's is updated to reflects that change.
In our case, every successive item in the list seems to be prepended to
whatever prompInit has previously been noted, so `imports = [ a b c ]` would
result to `echo c; echo b; echo a;`.

How are these attributes consolidated?

lib/modules.nix

```nix
args: {
  /* ... */
  operator = m: toClosureList m.file m.key m.imports;
}
```

## Links

 - [NixCon2018 Youtube playlist][NixCon2018]

[NixCon2018]: https://www.youtube.com/watch?v=rzjMif6wvMk&list=PLgknCdxP89ReJKWX3sthcsbBYsoihzSQX
