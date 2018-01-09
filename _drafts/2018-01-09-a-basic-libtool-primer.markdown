---
layout: post
title: A basic Libtool primer
description: |
  During an attempt to build the digitalbitbox applications for NixOS, I ended
  up in a duel with libtool which led to me research what libtool is all about
  and how it may simplify my life.
date:  2018-01-09 21:09:47 +0000
type: tools # for icon
category:tools # for url
tags:
 - gnu
 - gcc
 - c
 - autotools
 - automake
 - library system
 - libtool
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
> :boom: Shared libraries may **only** be built from position-independent code

> Libtool automatically creates .libs directory upon its first execution

# File types

The following list gives a short overview of the extensions one may run into in
the wild and what kind of file each extension represents.

 - `*.a` archive or library
 - `*.o` object file
 - `*.la` libtool archive
 - `*.lo` libtool object

# Commands

 - `as`
 - `ar` archive
 - `gcc` GNU C compiler
 - `g++` GNU C++ compiler
 - `ld` linker
 - `nm`
 - `objcopy`
 - `objdump`
 - `ranlib`
 - `readelf`
 - `size`
 - `strings`
 - `strip`

```
s  c++  cc  cpp  g++  gcc  ld  ld.bfd  ld.gold
$ ls -la /nix/store/cv25ljwchmjgbnriyy07s5sjn6cpymwc-gcc-wrapper-4.9.4/bin
total 60
dr-xr-xr-x 1 root root   62 Jan  1  1970 .
dr-xr-xr-x 1 root root   28 Jan  1  1970 ..
lrwxrwxrwx 1 root root   66 Jan  1  1970 as -> /nix/store/zi17ydzr9x1kqjcpfjr93iwg1frpmv8s-binutils-2.28.1/bin/as
lrwxrwxrwx 1 root root    3 Jan  1  1970 c++ -> g++
lrwxrwxrwx 1 root root    3 Jan  1  1970 cc -> gcc
-r-xr-xr-x 1 root root 6333 Jan  1  1970 cpp
-r-xr-xr-x 1 root root 6333 Jan  1  1970 g++
-r-xr-xr-x 1 root root 6333 Jan  1  1970 gcc
-r-xr-xr-x 1 root root 6506 Jan  1  1970 ld
-r-xr-xr-x 1 root root 6522 Jan  1  1970 ld.bfd
-r-xr-xr-x 1 root root 6526 Jan  1  1970 ld.gold
$ ls -la /nix/store/zi17ydzr9x1kqjcpfjr93iwg1frpmv8s-binutils-2.28.1/bin/
total 15240
dr-xr-xr-x 1 root root     190 Jan  1  1970 .
dr-xr-xr-x 1 root root      64 Jan  1  1970 ..
-r-xr-xr-x 2 root root   38368 Jan  1  1970 addr2line
-r-xr-xr-x 2 root root   72176 Jan  1  1970 ar
-r-xr-xr-x 2 root root  424872 Jan  1  1970 as
-r-xr-xr-x 2 root root   33200 Jan  1  1970 c++filt
-r-xr-xr-x 2 root root 4634512 Jan  1  1970 dwp
-r-xr-xr-x 2 root root   37360 Jan  1  1970 elfedit
-r-xr-xr-x 2 root root  113976 Jan  1  1970 gprof
lrwxrwxrwx 4 root root      70 Jan  1  1970 ld -> /nix/store/zi17ydzr9x1kqjcpfjr93iwg1frpmv8s-binutils-2.28.1/bin/ld.bfd
-r-xr-xr-x 2 root root 1071712 Jan  1  1970 ld.bfd
-r-xr-xr-x 2 root root 7479040 Jan  1  1970 ld.gold
-r-xr-xr-x 2 root root   54520 Jan  1  1970 nm
-r-xr-xr-x 2 root root  250480 Jan  1  1970 objcopy
-r-xr-xr-x 2 root root  393672 Jan  1  1970 objdump
-r-xr-xr-x 2 root root   72208 Jan  1  1970 ranlib
-r-xr-xr-x 2 root root  559424 Jan  1  1970 readelf
-r-xr-xr-x 2 root root   38632 Jan  1  1970 size
-r-xr-xr-x 2 root root   38192 Jan  1  1970 strings
-r-xr-xr-x 2 root root  250480 Jan  1  1970 strip
```

# Links

- [libtool manual][libtool-man]

[libtool-man]: https://www.gnu.org/software/libtool/manual/libtool.html
