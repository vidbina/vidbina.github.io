---
layout: post
title: Prompt Sugar
date: '2013-06-16T12:58:00+02:00'
tags:
- custom
- bash
- prompt
- git
- branch
- powerline
type: tools 
description: Dropping some redundant information from the prompt in exchange for some terminal sugar that means something.
tumblr_url: http://vid.bina.me/post/53122004414/prompt-sugar
---

I have finally ripped the hostname, username and current working directory 
strings from my prompt by stripping them from the `PS1` var. Especially the 
user- and hostname don&#8217;t add any real value for terminal sessions on my 
mech. They take up screen real-estate and whenever you&#8217;re screen-ing or 
tmux-ing (creating all kinds of awesome splits) you really don&#8217;t need 
that waste.

<img alt="image" src="http://media.tumblr.com/5f5205cd4a53c24d01c4c34b7b5cc278/tumblr_inline_mohvmmpUEl1qz4rgp.png"/></span></p>

I could go for a simple `$` prompt, but that&#8217;s just too little 
information. However, I do find myself `git branch`-ing a lot to figure out on 
the branch I&#8217;m working on. So why not display the current branch in my 
prompt?


That&#8217;s the awesomeness I witnessed on a [feller&#8217;s](dorsath) prompt 
a while back and I knew that instance that I needed that as well. After a short 
quest on Google I ended up finding a [post](show-git-branch-bash-prompt) that 
describes how to display the current branch in the prompt.


I finally added the `parse_git_rep` function to my `.bashrc` to extract some 
metadata regarding the repository I&#8217;m working on. That would be 
sufficient to give me a clear idea of the project I&#8217;m working on. I also 
set my terminal client (iTerm2) to use one of the prepped fonts from the 
[Powerline font rep](powerline-fonts) 
as I&#8217;m using one of their glyphs &#8212; the branch glyph.


{% gist 5792438 %}


In case you would still like to know the current working directory you could 
add the `\w` token to the `"$REPOSITORY$BRANCH$PROMPT"` string written to the 
`PS1` variable. Note, however; that `\w` writes the entire working directory 
path to the prompt, where `\W` only returns the basename of the current working 
directory (much shorter and sweeter). If I were to opt for this, I would 
differentiate the directory information from the rest by setting this in a 
different color resulting to something like 
`"$REPOSITORY$BRANCH$LIGHT_BLUE\W $PROMPT"`. The last screenshot shows the 
prompt options with the current working directory in both the short form `\W` 
and the long form `\w`.

<img alt="image" src="http://media.tumblr.com/17d03a7a9e0b4770cf7340f453688e0d/tumblr_inline_mohwffLPYp1qz4rgp.png"/>

Happy coding!

[dorsath]: https://github.com/dorsath
[show-git-branch-bash-prompt]: https://techcommons.stanford.edu/topics/git/show-git-branch-bash-prompt
[powerline-fonts]: https://github.com/Lokaltog/powerline-fonts"
