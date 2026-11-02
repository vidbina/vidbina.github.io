# Blurt

Personal blog of David Asabina, published at <https://vid.bina.me>.

The site is built by GitHub Pages from `master` with its legacy Jekyll build, so pushing to `master` deploys it. See [the build path decision](docs/decisions/0001-select-pages-build-path.md) for why.

## Preview locally

With Docker running:

```bash
make preview
```

This builds the site with the same `github-pages` version as the [GitHub Pages dependency list](https://pages.github.com/versions.json) and serves it on <http://localhost:4000>. Restart it to pick up changes. Update `GITHUB_PAGES` in the `Makefile` if that list moves on.

Pages that use math need the MathJax submodule locally:

```bash
make mathjax
```

## New posts

```bash
rake site:new "Title" "category"
```

This creates a draft in `_drafts/`. Move it to `_posts/` to publish it.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`docs/TODO.md`](docs/TODO.md).
