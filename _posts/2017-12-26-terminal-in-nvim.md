---
layout: post
title: Terminal in neovim
description: |
  A short guide :clipboard: on dropping in and out of terminals :fax: in neovim.
date:  2017-12-26 09:39:19 +0000
type: tools # for icon
category:
 - tools
 - nvim
tags:
 - editor
 - neovim
 - nvim
 - terminal
 - tools
 - workflow
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
<div class="element note">
:bulb: See `:help terminal-emulator` in neovim for more info
</div>

Ocasionally I will sideline my WM[^wm] (XMonad) or terminal multiplexer (tmux) in
order to start a terminal session in nvim itself.

Sometimes it pays to use neovim's builtin terminals because

 - when already in neovim and in need of a terminal in order to quickly move
 forward with whatever it is I'm trying to do, it is convenient to spawn one
 and get shit done :poop:
 - moving the neovim window around between workspaces or displays will always
 keep the related terminal close (i.e: I don't have to move two windows around)
 or consider how to move the editor into a tmux session and then split it
 - yanking text between buffers is a breeze

Start a neovim terminal through the `:terminal` command in neovim. You'll get
dropped into insert mode so do yourself a favor and use the
`Ctrl`+`\` `Ctrl`+`n` sequence to exit into normal mode. Of course, once in
normal mode you may return to insert mode using any of the keybindings that
you're most comfortable with (in my case `a` or `i`).

Another, perhaps more practical, way to spawn a terminal is by using the
term scheme. Opening a file prefixed with `term://` will result into the section
prefixed by the `term://` to be executed in the terminal as in
 - `:vsplit term://zsh` spawning a zsh :ocean: shell :shell:,
 - `:split term://htop` spawning htop in a terminal and
 - `:edit term://bash` spawning a bash shell :shell:.

<div class="element note">
Note that navigating between neovim windows is only possible in normal mode.
Which should make sense when you think about it. It isn't much different when
editing text in vim-ish editors. The terminal-emulator help page documents how
you may define mappings using `:noremap` and `:tnoremap` to specify mappings to
navigate windows within any mode.
</div>

So in conclusion,
 - use the `:terminal` command to spawn a terminal or
 - open a `term://*` file, where `*` represents the executable to call in the
 terminal,

and remember the following mappings for convenience's sake:

 - `<C-\><C-N>` to switch to normal mode[^cdashcn]
 - `<C-l>` to redraw[^cl]

[https://codeyarns.com/2010/11/26/how-to-view-variables-in-vim/]: next

[^wm]: window manager
[^cdashcn]: `Ctrl`+`\` then `Ctrl`+`N`
[^cl]: `Ctrl`+`L`
