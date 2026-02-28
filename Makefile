BUNDLE ?= bundle exec

setup:
	bundle install

clean:
	rm -rf _site

build:
	$(BUNDLE) rake site:build

server:
	$(BUNDLE) rake site:server

server-dev:
	$(BUNDLE) rake site:serve

.PHONY: setup clean build server server-dev
