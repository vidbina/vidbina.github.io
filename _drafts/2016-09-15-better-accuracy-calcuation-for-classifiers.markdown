---
layout: post
title: Better accuracy calcuation for classifiers
description: |
  WIP
date:  2016-09-15 17:09:06 +0200
type: math # for icon
category: math # for url
tags:
 - TAGA
 - TAGB
og:
  type: OG:TYPE # http://ogp.me/#types
  og:type: #
   - og:value: value
     og:attr: foo
   - og:value: value
image: http://example.com
mathjax: true
twitter:
  card: summary_large_image
  image: http://example.com
---

I just spend a minute looking at the accuracy scoring formula presented in
Lantz' _Machine Learning with R_ and couldn't help but wonder if there isn't
a better way to generate some metric of accuracy.

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN}$$

This metric attempts to provide some indication of the accuracy of a model
by essentially calculating how much of the predictions are correct over the
number of total predictions made.

The book goes a fine job of explaining a scenario where a classifier could
still score relatively well if it classifies a rare condition.

Consider a rare condition that only occurs in a half percent of the cases;
given $100000$ tests we could run into about $50$ cases of the condition.

If we always predict that the condition isn't there we will actually be correct
in $99950/100000$ episodes of the prediction. Whenever the condition is
actually there we will be wrong every freaking time.

The confusion matrix for this scenario is portrayed below. It is clear that
e

|          |predicted T    |predicted F  |
|:---------|----:|--:|
|actual T  |99950| 0 |
|actual F  |   50| 0 |

$TP = 99950$, $FP = 50$, $TN = 0$ en $FN = 0$

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN} = \frac{99950+0}{99950+0+50+0} = \frac{99950}{100000}$$


|          |predicted F    |predicted T  |
|:---------|----:|--:|
|actual F  |99950| 0 |
|actual T  |   50| 0 |

$TP = 0$, $FP = 0$, $TN = 99950$ en $FN = 50$

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN} = \frac{0+99950}{0+99950+0+50} = \frac{99950}{100000}$$


|   |predicted P    |predicted N   |
|:--|----:|---:|
|actual P  |99950| 0  |
|actual N  |   40| 10 |

$TP = 99950$, $FP = 40$, $TN = 10$ en $FN = 0$

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN} = \frac{99950+10}{99950+10+40+0} = \frac{99960}{100000}$$


|          |predicted P    |predicted N   |
|:---------|----:|---:|
|actual P  |99950| 0  |
|actual N  |   10| 40 |

$TP = 99950$, $FP = 10$, $TN = 40$ en $FN = 0$

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN} = \frac{99950+40}{99950+40+10+0} = \frac{99990}{100000}$$


|          |predicted P    |predicted N   |
|:---------|----:|---:|
|actual P  |99950| 0  |
|actual N  |   10| 40 |

$TP = 99950$, $FP = 10$, $TN = 40$ en $FN = 0$

$$accuracy = \frac{TP+TN}{TP+TN+FP+FN} = \frac{99950+40}{99950+40+10+0} = \frac{99990}{100000}$$

$$accuracy = \frac{TP}{k_N(TP+FP)} + \frac{TN}{k_N(TN+FN)} = \frac{99950}{2(99990)} + \frac{10}{2(10)}$$

##
How about expression accuracy on a per-class basis
$$accuracy = \frac{TP}{k_N(TP+FP)} + \frac{TN}{k_N(TN+FN)} = \frac{99950}{2(99950)} + \frac{1}{2}$$

