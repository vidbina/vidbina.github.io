
## Remove all already-merged local branches
With ```git branch --merged``` one gets an overview of all merged local 
branches. Since already merged, the need for these is greatly diminished. 
Remove all of them by running:

{% highlight zsh %}
for F in $(git branch --merged); do
  if [[ $F == master|dev ]]; then
    continue
  fi
  echo git branch -d $F
done
{% endhighlight %}

The above may be typed into a zsh terminal directly (an indentation is merely
displayed for demonstrative purposes, feel free to omit it). Because of the 
`echo` in front of the last line within the for loop, the real removal will not
be executed but a printout will be produced of the commands that would be 
executed were the last line not simply echoed. Remove the `echo` if the output
returns whatever was expected.

## Remove all already-merged remote branches
One gets an overview of all merged remote branches by running 
```git branch -r --merged```. In some cases one may encounter a list of 
branches, some fresh some which deserve to be recorded in the annals of human 
history. Removal of such branches happens by running 
```git push REMOTE_NAME :BRANCH_NAME```. When in need of a painless way to 
remove 10+ branches consider the following: 

{% highlight zsh %}
for F in $(git branch -r --merged); do
  if [[ %F == */(master|dev) ]]; then
    continue
  fi
  echo git push origin :$(echo $F | sed:origin/::)
done
{% endhighlight %}

The above snippet may be typed into any zsh terminal. If the output makes any 
sense, retry the snippet without the cho prefix on the last line within the for
block.
