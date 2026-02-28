# Blurt

[emojifyjs]: https://www.npmjs.com/package/emojify.js

A small Jekyll setup for my personal website.

## Setup

1. Install dependencies:

   ```bash
   bundle install
   ```

2. Build the site:

   ```bash
   bundle exec rake site:build
   ```

## Usage

- List available tasks:

  ```bash
  bundle exec rake -T
  ```

- Serve the site locally:

  ```bash
  bundle exec rake site:server
  ```

- Serve with drafts:

  ```bash
  bundle exec rake site:serve
  ```

- Create a new draft:

  ```bash
  bundle exec rake site:new "Title" "category"
  ```

## Notes

- Deployment-specific automation (like rsync upload tasks) was removed from this repo. The site is intended to be deployable through GitHub Pages or another static hosting platform.
- If `bundle install` fails with HTTP 403 in your environment, verify outbound access to `https://rubygems.org`.
