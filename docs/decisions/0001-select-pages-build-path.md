---
title: "Select the GitHub Pages build path"
tags: [site, deps, hosting]
status: exploring
decision: ""
review_date: 2026-12-01
related_to: []
supersedes: ""
---

# Select the GitHub Pages build path

## Status Log

| Status    | Date       | Author         | Related Tickets | Notes                        |
| :-------- | :--------- | :------------- | :-------------- | :--------------------------- |
| exploring | 2026-11-02 | Claude (audit) | none            | Recommendation awaits review |

## Context

The site builds through legacy GitHub Pages from `master`. `Gemfile.lock` pins `github-pages` 192 and Jekyll 3.7.4, and carries 58 open [Dependabot alerts](https://github.com/vidbina/vidbina.github.io/security/dependabot). Those gems run at build time only, so visitors get static files and the real risk is low. The stale lock is mainly a maintenance problem.

## Exploration

| | A: `github-pages` gem, legacy build | B: Actions deploy, Jekyll 4.4 |
| :-- | :-- | :-- |
| Status | [Last release v232, Aug 2024](https://github.com/github/pages-gem/releases), [pinned to Jekyll 3.10](https://pages.github.com/versions.json) | [Jekyll 4.4.1](https://rubygems.org/gems/jekyll/versions) |
| GitHub's position | [Supported "for some workflows"](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) | [Recommended](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) |
| Alerts, comparing lockfile versions to advisories | 57 of 58 clear on a 232 lock; `rubyzip` stays. None if the Gemfile and lock are deleted | None on the tested lock |
| Upkeep | None to run, versions frozen | One workflow, plus action and Ruby bumps |
| Output | Matches `master` today | Local test: same file count, 41 files differ |

Findings from a local build of B on `ruby:3.3`:

- Keeping `_plugins/emoji.rb` with `jemoji` fails with `undefined method 'find_by_alias'`.
- Dropping only the plugin builds, but `jemoji` becomes active and changes 73 HTML files. In Jekyll 3.10 the `gems:` key overwrites `plugins:`, so `jemoji` is off today.
- Removing the plugin, `jemoji` and the `gems:` key, with compressed Sass, builds cleanly. Against the live site, 21 HTML files still differ, mainly in Rouge token classes and footnote attributes. This was compared by bytes, not in a browser.
- `js/MathJax` is a submodule, so the workflow needs `submodules: true` or math breaks without an error.
- Ruby 3.3 is [expected to reach EOL on 2027-03-31](https://www.ruby-lang.org/en/downloads/branches/), so use a newer version and test it first.

[PR #14 (Codex Jekyll 4.4 draft)](https://github.com/vidbina/vidbina.github.io/pull/14) is not a good basis. Its build fails with the same plugin error, it has no Actions deploy, and it deletes `Gemfile.lock`. Its Rakefile cleanups are worth keeping.

## Decision

Not decided. The audit recommends B: A costs less today, but it stays on a frozen Jekyll line GitHub no longer recommends. A with the Gemfile and lock deleted is the no-CI fallback, at the cost of local build parity.

## Consequences

To be filled in once decided. B adds a workflow to maintain, and gem code then runs in a job that leads to deployment, so keep the lock committed.

## Confirmation

To be filled in once decided. For B: a deployed Actions run serves the custom domain over HTTPS, and pages using MathJax still render.
