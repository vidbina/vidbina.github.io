---
layout: post
title: NixOS zsh prompt option order
description: |
  A note to self on the order in which NixOS :snowflake: zsh :shell: prompt
  options are handled.
date:  2018-10-31 15:05:55 +0000
type: tools # for icon
category: nixos # for url
tags:
 - nixos
 - nixos-configuration
 - order
 - prompt
 - shell
 - zsh
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

On the [NixOS options][nixos-options] page, you'll find the following prompt
options for zsh:

 - `interactiveShellInit`
 - `loginShellInit`
 - `promptInit`
 - `shellInit`

Errors like

```
zsh-syntax-highlighting: unhandled ZLE widget 'autosuggest-accept'
zsh-syntax-highlighting: (This is sometimes caused by doing `bindkey <keys> autosuggest-accept` without creating the 'autosuggest-accept' widget with `zle -N` or `zle -C`.)
```

may pop up in the prompt, depending on the order of commands executed on
setup.

The following list represents the login files that the values of the options
are composed into and the order in which they are loaded:

 - zshenv
   - `shellInit`
 - zprofile
   - `loginShellInit`
 - zshrc
   - `interactiveShellInit`
   - `promptInit`

Keep that in mind when editing any of the `*Init` options :wink:.

## Links

 - [The source to the zsh options on NixOS :snowflake:][nixos-zsh]
 - [NixOS :snowflake: options for zsh :shell:][nixos-options]

[nixos-zsh]: https://github.com/NixOS/nixos/blob/master/modules/programs/zsh/zsh.nix
[nixos-zsh]: https://nixos.org/releases/tmp/release-nixos-unstable-small/nixos-18.09pre134216.fbac1cbc065/unpack/nixos-18.09pre134216.fbac1cbc065/nixpkgs/nixos/modules/programs/zsh/zsh.nix
[nixos-options]: https://nixos.org/nixos/options.html#zsh.
