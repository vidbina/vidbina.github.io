---
layout: post
title: Nix Attribute Set (attrset) Laziness
description: |
  A note :memo: on laziness in Nix attrsets and merges :collision: of Nix
  attrsets which happened to bite me in the ass during my attempt to write a few
  derivations for new packages. :new: :package:
date:  2017-12-27 21:02:07 +0000
updated: 2018-01-26 14:02:29 +0200
type: tools # for icon
category: # for url
 - tools
 - nix
tags:
 - attrset
 - attrsets
 - computer science
 - language
 - laziness
 - lazy evaluation
 - lazy loading
 - nix
 - nix-repl
 - NixOS
 - programming language
 - scripting language
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
:bow: Special thanks to [@Profpatsch][profpatsch] for making sure that I keep
my terminology in line with the rest of the community. I erronously referred to
attrsets as "sets", but saw the confusion therein as attrsets are more akin to
hashmap than sets as they are formally known in [CS :computer:][set-cs] and
[mathmathics (Set Theory)][set-math].
</div>

<div class="element tweet">
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Great article, minor nitpick: We usually call them attribute sets (or attrsets), to differentiate from normal (multi-)sets (collections of values with no identifiers except maybe equality). They are more akin to (hash)maps (and internally probably implemented as such).</p>&mdash; Patschisupercalifragilisticexpialidociousdöner (@Profpatsch) <a href="https://twitter.com/Profpatsch/status/947462980568059905?ref_src=twsrc%5Etfw">December 31, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

</div>
An erronous statement such as

```nix
concat = builtins.nada ""
```

where the attribute `nada` is undefined, will not be evaluated immediately
after definition. Nix is lazy enough when it comes to attrsets to wait until
the call to `concat` to figure out the contents of the set and attempt to invoke
the function.

Conversely, something like

```nix
concat = nada ""
```

would fail at definition as `nada` is clearly undefined. The laziness of the
attrset is no longer there to defer the evaluation of the right-hand side of
this expression.

Note how

```nix
z = let
  concat = builtins.nada " ";
  items = ["leni" "photo"];
in {
  out = "${concat items}";
} // { out = "wow"; }
```

represents the definition of an attrset, which will be evaluated lazily.
Furthermore the the `builtins.nada` phrase will also be evaluated lazily. As
such, the first call of `z`, evaluates all attributes of the overriden attrset
to return an attrset resembling `{ out = "wow"; }`. This output suggests that
the erronous call was completely avoided as a result of the override of the
`out` attribute during merge (the `//` operator merges two attrsets).

I guess in the case of merges, one may assume that an attribute in the
left-hand side is optimized into oblivion if a similarly-named attribute is
present on the right-hand side as the right-hand side takes precedence.

For a recursive attrset

```nix
z = let
  concat = builtins.nada " ";
  items = ["leni" "photo"];
in rec {
  a = "${concat items}";
} // { a = "wow"; }
```

the same holds true *until* a reference is made to the defective attribute as in

```nix
z = let
  concat = builtins.nada " ";
  items = ["leni" "photo"];
in rec {
  a = "${concat items}";
  b = a; # <- reference to broken attribute
} // { a = "wow"; }
```

which fails comically with a fragmented error message :stuck_out_tongue_closed_eyes:

```
{ a = "wow"; b = error: attribute ‘nada’ missing, at (string):2:12
```

which could leave one to assume that recursive attrsets have to be considered
a bit less lazy when recursive references are made. It seems that `a` was
only overriden after all references to `a` within the left-hand operand were
evaluated. This is kind of a big deal, as that demands a bit more care from
anyone using recursive attrsets with the intent to override them later. :boom:

Fixing the `concat` partial by, for example definining it to

```nix
concat = builtins.concatStringsSep " "
```

results to the expression

```nix
z = let
  concat = builtins.concatStringsSep " ";
  items = ["leni" "photo"];
in rec {
  a = "${concat items}";
  b = a; # <- no longer broken
} // { a = "wow"; }
```

producing `{ a = "wow"; b = "leni photo"; }` which more or less demonstrates
that the solving of the left-hand operand was forced since the left-hand
attribute `b` referenced attribute `a` within its containing attrset. In that
case the merge seems to be performed after the left-hand operand is "solved".


When we abstain from referencing attribute `a` in the left-hand operand as in

```nix
z = let
  concat = builtins.nada " ";
  items = ["leni" "photo"];
in rec {
  a = "${concat items}";
  b = "not referencing broken code";
} // { a = "wow"; }
```

we end up with the result

```
{ a = "wow"; b = "not referencing broken code"; }
```

which leads me to the following take-away:

<div class="element note">
Exercise care when using recursive attrsets in overrides and understand when
used on the left-hand side, referenced attributes will be evaluated prior to
the merge.  If anything, it makes some sense to avoid the use of recursive
attrsets unless you have a good understanding of its inner-workings. I've been
bitten before by defining a recursive attrset for the general part of a
derivation and then merging it with another attrset to compose the concrete
attrsets for different derrivative packages, without being aware that some
values could be referenced against the old attrset attributes and others
against the override attrset attributes, depending on the expressions used.
</div>

The following pseudo-code demonstrates this problem in something remarkably stupid
I attempted earlier on.

```nix
q = rec {
  name = "some-package";
  version = "0.1.0";
  src = "old source";
  installPhase = ''
    #echo do something with ${src}
  '';
} // {
  src = "new source";
  # I would have to redefine installPhase here or
  # face the consequences of installPhase being
  # evaluated against the old value of src
}
```

Note that the resulting attrset contains the updated `src` but an `installPhase`
string that was evaluated against the old value of `src`. :boom:

This broken code, I wrapped into a helper to compose a derivation

```nix
mkSomePackage = overrides: stdenv.mkDerivation (rec {
  name = "some-package";
  version = "0.1.0";
  src = "some source";
  installPhase = ''
    #echo do something with ${src}
  '';
} // overrides)
```

which resulted to the resulting derivation having some properly overriden
attributes and some attributes evaluated against the original attributes
(i.e.: being from the left-hand attrset) contributing to some confusion. :sob:

Future me reading this... you've been warned. :rage:

## Links

 - [Nix Pills: Chapter 4. The Basics of the Language, Section 9. Laziness][nix-pill-basics]

[profpatsch]: http://profpatsch.de/
[set-math]: https://en.wikipedia.org/wiki/Set_(mathematics)
[set-cs]: https://en.wikipedia.org/wiki/Set_(abstract_data_type)
[nix-pill-basics]: https://nixos.org/nixos/nix-pills/basics-of-language.html#idm140737316523008
