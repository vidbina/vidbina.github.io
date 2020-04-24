---
layout: post
title:  Simple Tmux-ing With Muxy
date:   2015-12-2 11:32:51
type: tools
category: tools
tags:
 - software
 - terminal
 - terminal multiplexer
 - zsh
image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const_thumb.png
twitter:
  card: summary_large_image
  image: https://s3.eu-central-1.amazonaws.com/vid.bina.me/img/twitter-cards/es6const1.png
og:
  type: article
  article: #see ogp.me/#types
    author: https://www.facebook.com/david.asabina
    tags:
      - terminal multiplexer
      - tmux
      - zsh
      - tools
      - command line interface
      - cli
    section: Software Engineering
description: A pragmatic solution to dealing with multiple sessions in tmux
emojify: true
---

A while ago I wrote a little tool to help me in managing my project workspaces
which I do with tmux. Basically I create different tmux sessions for every
project and spawn the necessary windows in order to quickly get me back on
track.

<div class="element">
  <div class="github-card" data-github="vidbina/muxy" data-width="400" data-height="153" data-theme="default"></div>
  <script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>
</div>

Using <em>muxy</em>, I can simply describe my setups for different
[projects](https://github.com/vidbina/muxy-projects) and basically load a
project by typing `load`[^load].

[^load]: I think this name is too ambiguous but I wasn't in a creative place when I wrote it. Pragmatic, but if it clashes with something else feel free to change the name or offer suggestions.

## Project File

Muxy loads a project by sourcing the `base`, followed by a `up` script. These
scripts are located in a project directory within the `$MUXY_PATH/projects`
directory. In case a project is named `hackathon` one would find it's project
directory at the `$MUXY_PATH/projects/hackathon` path.

The base file named `base.bash` in my case simple defines some variables.

```bash
NAME="hackathon"
SESSION="hack"
BASE="/path/to/workdir/hack"
```

The `up.bash` file specifies the steps that need to be taken in setting up the
workspace.

```bash
# up file

# start tmux if not already running
tmux start-session

# create new session, with a window named `base` where $BASE is the pwd
tmux new-window -c $BASE -d -s $SESSION -n base

# set env variables for this project
tmux setenv -t $SESSION $BASE
tmux setenv -t $SESSION SESSION_STARTUP_SCRIPT "/Users/david/Documents/Development/TMH/startup.zsh"
tmux setenv -t $SESSION AWS_DEFAULT_PROFILE "tmh"

# run some commands in the `base` window
# C-m is equivalent to pressing ente
tmux send-keys -t $SESSION:0 "ls -la" C-m
# split `base` window into two panes
tmux split-window -h -t $SESSION:0
# enter notes directory in second pane
tmux send-keys -t $SESSION:0 "cd $BASE/notes" C-m

# create new window called `concept`
tmux new-window -t $SESSION:1 -n concept

tmux attach-session -t $SESSION
```

## Leveraging Indexes

Note how `$SESSION:N` is used to create a window at the given index.
Generally one may use just the session name as the target as in

```bash
tmux new-window -t $SESSION -n blah
```

where tmux will automatically increment the index number for you, however;
there may be situations where you predict you may need to add new windows
on the fly while at work, but want to maintain order to some extent.

Imagine starting a project with the following panes

 - `base`, indexed 0
   - 1st pane where we `git log --oneline --graph --all --decorate`
   - 2nd pane where we `less README.md`
 - `code` where we edit code, indexed 1
 - `tests` where tests are run on code change, indexed 2

Mostly we expect to edit all code in the single `code` pane. We'll be using
`vim` which allows us to do elegant splits of all sorts in order to look at
multiple files. We decide, however; that we only want to look at code from
a single repository in a given tmux window, everytime we need to look at the
code of a dependency for instance, we'll have to open a different window and
view the code there. That way we keep our workflow slightly organized :wink:.
Upon creating that new window to view code, it is appended to the end of our
pane list as such `base`, `code`, `tests`, `dep1`. Maybe we just want to keep
the `tests` at the end of a list of code windows that all relate to it which is
possible by creating the `tests` window with higher index for example `5`
instead of `2` would allow us to open 3 windows before the `tests` window.

<!-- TODO: DEMO -->

Personally I just use indexes 0 through 9 because switching is somewhat
easier[^switch].

[^switch]: tmux, by default, has some easy bindings for switching between windows 0 through 9. The binding for 0 is generally defined a default tmux setup. In most setups the bindings equates to pressing ctrl and b together, followed by the number to switch to.

Sometimes it may be convenient to create

## Different Environment Variables for Projects

In order to properly deal with environment variables in tmux sessions, I would
highly recommend the use of the `tmux set-environment` and
`tmux update-environment` commands. The set and update environment commands
could for instance be used in the up-files for a project to set the
`$AWS_DEFAULT_PROFILE` variable for a devops user. That way one could just use
the `aws` cli from any tmux session whilst knowing that the correct profile has
been selected :wink:.

# Links

 - [Terminal Multiplexers: Screen, Tmux](http://hyperpolyglot.org/multiplexers)
