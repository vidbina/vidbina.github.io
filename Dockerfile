FROM ruby:2.4
EXPOSE 4000

RUN useradd -mG staff -s /bin/bash static
USER static

WORKDIR /home/static
COPY Gemfile Gemfile.lock /home/static/

RUN /usr/local/bin/bundle install
