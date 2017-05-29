FROM ruby:2.4
MAINTAINER David Asabina <vid@bina.me>
WORKDIR /
COPY Gemfile Gemfile
EXPOSE 4000
RUN /usr/local/bin/bundle install
RUN useradd -ms /bin/bash rake

USER rake
