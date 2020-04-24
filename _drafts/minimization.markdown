---
layout: post
title:  A Few Notes While Reading Up on Minimizaton
date:   2015-11-29 20:38:51
type: math
category: math
tags:
 - minimization
 - algebra
 - math
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const_thumb.png
twitter:
  card: summary_large_image
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const1.png
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    tags:
      - math
      - matrix
      - calculus
      - algebra
    section: Algebra
description: Note-to-self while reading through Olver's Numerical Analysis lecture notes covering Minimization
mathjax: true
---

According to definition 12.1 in Olver's notes a positive definite matrix is
defined as a $$n \times n$$ matrix $$K$$ which is symmetric, $$K^T = K$$, and
satisfies a positivity condition $$\mathbf{x}^TK\mathbf{x} > 0$$ for all vectors
$$0 \neq \mathbf{x} \in \mathbb{R}^n$$.

This basically means that we're dealing with square matrices symmetric around
the main diagonal. Given such matrices, the scalar $$\mathbf{x}^TK\mathbf{x}$$
must be greater than $$0$$ in order to be definite and the elements of the
vector $$\mathbf{x}$$ may not equal $$0$$.

> Generally when talking vectors, column vectors are implied. For this very
reason many authors transpose the vectors in their text to enjoy the
convenience of notating their vectors as row vectors.

In example 12.2, Olver proceeds to demonstrate how the matrix
$$\bigl(\begin{smallmatrix}4&-2\\ -2&3\end{smallmatrix}\bigr)$$ happens to be a positive definite
matrix.

Why is that again?

Simply put, the matrix pertains to an expression that involves two
variables, which we'll call $x_1$ and $x_2$. The vector containing these
variables would be expressed as
$$\bigl(\begin{smallmatrix}x_1\\ x_2\end{smallmatrix}\bigr)$$. In order
to determine whether the matrix $$K$$ is a positive definite matrix we will need
to determine $$\mathbf{x}^TK\mathbf{x}$$.

$$\begin{pmatrix}x_1&x_2\end{pmatrix}\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}x_1\\x_2\end{pmatrix}$$

$$\begin{pmatrix}ax_1+cx_2&bx_1+dx_2\end{pmatrix}\begin{pmatrix}x_1\\x_2\end{pmatrix}$$

$$\begin{pmatrix}ax_1^2+(b+c)x_1x_2+dx_2^2\end{pmatrix}$$


With the information given,
$$\bigl(\begin{smallmatrix}4&-2\\-2&3\end{smallmatrix}\bigr)$$ may be expressed
as $$4x_1^2-4x_1x_2+3x_2^2$$.

$$\begin{array}{c|c|c|}
     & 2x_1 & x_2 \\ \hline
2x_1 & 4x_1^2 & 2x_1x_2 \\ \hline
-3x_2 & -6x_1x_2 & 3x_2^2 \\ \hline
\end{array}$$

$$(2x_1+x_2)(2x_1-3x_2)$$

$$\begin{array}{c|c|c|}
     & 2x_1 & -x_2 \\ \hline
2x_1 & 4x_1^2 & -x_1x_2 \\ \hline
-x_2 & -x_1x_2 & x_2^2 \\ \hline
\end{array}$$

$$(2x_1-x_2)(2x_1-x_2) = 4x_1^2 -4x_1x_2 + x_2^2$$

# Reading

 - [Olver's Numerical Analysis Lecture Notes](http://www.math.umn.edu/~olver/num.html)
 - [Olver's Numerical Analysis Lecture Notes covering Minimization](http://www.math.umn.edu/~olver/num_/lnz.pdf)

