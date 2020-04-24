---
layout: post
title: Linux Manual Primer
description: |
  A short guide on figuring your way around a Linux system using its
  built-in manuals and tools such as <code>apropos</code>, <code>info</code>,
  <code>man</code> and <code>whatis</code>.
date:  2020-04-23 13:09:04 +0000
type: tools # for icon
category: tools # for url
tags:
 - linux
 - manpage
 - manpages
 - manual
 - tools
 - man
 - apropos
 - info
 - whatis
emojify: true
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
While finding myself in a German train with choppy internet connectivity, I
realized lacking sufficient command of `apropos`, `info`, `man` or `whatis` to
get by without the web -- even if only for a little while. This post will
hopefully help anyone get up to speed.

## `man` CLI Tool

The laziest way to use `man` is by running

```
man -Ki PHRASE
```

This performs a _case-insensitive (`-i`)_ search of "PHRASE" in _all pages
(`-K`)_ and should work on any system, regardless of whether the manual database
has been populated -- something we'll discuss later. For every hit, `man` will
provide an option to view or skip the file using `return` and `control`+`C`
respectively as demonstrated in the [screencast][asciinema-man-skip] below. But
these bindings are not worth remembering as the `man` tool prints an
informative prompt that lists those bindings when relevant.

<div class="element screencast">
  <script id="asciicast-wspj6740NJTMooh24IQKOUsET" src="https://asciinema.org/a/wspj6740NJTMooh24IQKOUsET.js" async></script>
</div>

[asciinema-man-skip]: https://asciinema.org/a/wspj6740NJTMooh24IQKOUsET

### Keybindings

Since `man` uses `less` as its pager (tool to scroll through pages of content),
one should be able to find a way around manual by using the less keybindings.

The `less` bindings are quite similar to vim keybindings which can be observed
in the table listed below with the exception of the `h` and `!` commands.

| Key             | Function                   |
|-----------------|----------------------------|
| `h`             | **H**elp                   |
| `!`             | Execute command from shell |
| `j`             | Down one line              |
| `k`             | Up one line                |
| `space`         | Down one page              |
| `shift`+`space` | Up one page                |
| `/`             | Search forward             |
| `?`             | Search backward            |
| `n`             | Repeat search forward      |
| `N`             | Repeat search backward     |

With the exception of the `h` and `!` commands, all the listed bindings in the
table above correspond to the similar functions in vim.

Upon pressing `!` (execute command), `/` (search forward) or `?` (search
backward) a input prompt will be made available which can be navigated with the
standard arrow keys along with the familiar `home` and `end` keys. For
additional input control, it may prove helpful to learn the following
keybindings as well.

| Key               | Function                   |
|-------------------|----------------------------|
| `control`+`U`     | Clear line                 |
| `control`+`left`  | Move cursor left one word  |
| `control`+`right` | Move cursor right one word |


### Highlighting

The following snippet ([source][man-color]) added to your ~/.bashrc or ~/.zshrc
file will colorize the output of the man command to ease human parsing of
manual pages. :wink:

```bash
man () {
  LESS_TERMCAP_mb=$'\e'"[1;31m" \
  LESS_TERMCAP_md=$'\e'"[1;31m" \
  LESS_TERMCAP_me=$'\e'"[0m" \
  LESS_TERMCAP_se=$'\e'"[0m" \
  LESS_TERMCAP_so=$'\e'"[1;44;33m" \
  LESS_TERMCAP_ue=$'\e'"[0m" \
  LESS_TERMCAP_us=$'\e'"[1;32m" \
  command man "$@"
}
```

[man-color]:https://boredzo.org/blog/archives/2016-08-15/colorized-man-pages-understood-and-customized

### `apropos` CLI Tool

One can use the `apropos` CLI tool to search for keywords in the manual page
names and short descriptions. Running the `apropos` tool is equivalent to
running `man -k` but requires a manual database in order to work.

The convenience of `apropos` is that is matches the search string in the manual
package name and description and thus has a larger hit radius that one can take
advantage of by formulating clever searches.

Running `apropos security`, for example, list all manual pages that mention the
word "security" within their names and description.

### `whatis` CLI Tool

The `whatis` tool lists the manual page descriptions for a given name. This
name should match a valid manual page name. The use of `whatis` assumes that
you already know "what" you are looking for.

Using regular expressions may increase your hit radius as in `whatis -r "zip"`
which will filter all manual pages that match the regex `"zip"` (include the
phrase "zip") in their name.

### Build Database

In order to use the `apropos` or `whatis` tools, one would need to populate the
manual database through the `mandb` command.

In [NixOS :snowflake:][nixos-wiki-apropos], one may create the man directory
and populate it through the following commands:

```bash
sudo mkdir -p /var/cache/man/nixos
sudo mandb
```

These commands would need to be executed every time new packages are installed
(using `nix-build`, for example) to ensure that the database is up-to-date.

[nixos-wiki-apropos]: https://nixos.wiki/wiki/Apropos

## Info

```
info man
```

| Key                     | Function                                                      |
|-------------------------|---------------------------------------------------------------|
| `q`                     | **Q**uit                                                      |
| `H`                     | **H**elp/List keybindings                                     |
| `h`                     | **h**elp/tutorial                                             |
| `p`                     | **P**revious node                                             |
| `n`                     | **N**ext node                                                 |
| `u`                     | **U**p                                                        |
| `space`                 | Scroll forwards (continues to next node at end-of-page)       |
| `b`                     | Scroll **b**ackwards (within node i.e.: stops at top-of-page) |
| `delete` or `backspace` | Scroll backwards (continue to previous page at top-of-page)   |
| `control` + `l`         | Render                                                        |
| `b`                     | **B**eginning                                                 |
| `tab`                   | Skip to next hyperlink                                        |
| `return`                | Follow hyperlink                                              |
| `[`, `]`                | Next node, previous node                                      |
| `1...9`                 | Pick $n$th item in menu                                       |
| `m`                     | Pick **m**enu item by name                                    |
| `f`                     | **F**ollow link by name                                       |
| `g`                     | **G**o-to node by name                                        |
| `/`                     | Search forward                                                |
| `{`, `}`                | Search for previous match, search for next match              |
| `control` + `g`         | Cancel current operation                                      |

<!--
Basic Info command keys

H           Close this help window.
q           Quit Info altogether.
h           Invoke the Info tutorial.

Up          Move up one line.
Down        Move down one line.
PgUp        Scroll backward one screenful.
PgDn        Scroll forward one screenful.
Home        Go to the beginning of this node.
End         Go to the end of this node.

TAB         Skip to the next hypertext link.
RET         Follow the hypertext link under the cursor.
l           Go back to the last node seen in this window.

[           Go to the previous node in the document.
]           Go to the next node in the document.
p           Go to the previous node on this level.
n           Go to the next node on this level.
u           Go up one level.
-->

In `info` vernacular, pages are referred to as nodes.

```
man -k printf
man -f smail
```


## Info


[apropos-man-nixos]: https://nixos.wiki/wiki/Apropos
[gh-apropos-man-nixos]: https://github.com/NixOS/nixpkgs/issues/14472
