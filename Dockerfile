FROM ruby:2.4
WORKDIR /tmp/static
COPY Gemfile* /tmp/static/
EXPOSE 4000
RUN /usr/local/bin/bundle install
RUN useradd -ms /bin/bash rake

USER rake
