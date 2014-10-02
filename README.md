# Blurt

I have made things easy for myself. By running ```rake reload``` I can now have
my website updated and running.

In order to make things work I have set up a ```.env``` file in my blog 
directory which contains my username, the server I sign in to and the path
of my website.

    export WEBSITE_USER=spock@enterprise.org
    export WEBSITE_PATH=/www/spock/

With the above information in a ```.env``` file an attempt would be made to 
update the ```/www/spock``` path as user ```spock``` on server 
```enterprise.org```. Change your setup to your liking and have fun.

## Setup
Get your ruby environment ready by running ```bundle install```. This will 
ensure that Jekyll and dotenv are installed on your box.

Run ```rake -T``` to get an impression of all the tasks I have already 
automated.

## Usage
At the moment jekyll allows you to build your site into the ```_site``` 
directory. User ```rake site:build``` to build your site into your ```_site```
directory.

In order to clean your ```_site``` directory for a rebuild or simply because
you don't want it anymore run ```rake site:clean```.

In order to upload your site run ```rake site:upload```.

In order to make life easier just run ```rake site:reload``` which cleans your
local ```_site``` directory, rebuilds your website into and uploads it 
afterwards.
