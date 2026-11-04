---
title: "Gate third-party embeds behind consent"
tags: [site, privacy, legal]
status: exploring
decision: ""
review_date: 2027-11-01
related_to: ["0001-select-pages-build-path"]
supersedes: ""
---

# Gate third-party embeds behind consent

## Status Log

| Status    | Date       | Author         | Related Tickets | Notes                                      |
| :-------- | :--------- | :------------- | :-------------- | :----------------------------------------- |
| exploring | 2026-11-04 | Claude (draft) | none            | Prototype on one post; rollout not started |

## Context

A visitor's browser contacts third parties as soon as some posts open. Those providers get the visitor's IP address, and some set cookies: a test request to `youtube.com/embed` returned 6 cookies, Spotify 2 and a gist script 3. `imprint/index.html` discloses this, but disclosure is not consent.

The goal is that a page names what would load, contacts the provider only after the visitor agrees, and allows loading again afterwards. This note is an engineering record, not legal advice.

The built site has 108 third-party loads on 34 pages:

| Loads | Type             | Host                            | Pages |
| ----: | :--------------- | :------------------------------ | ----: |
|    19 | iframe           | `giphy.com`                     |     7 |
|    17 | iframe           | `www.youtube.com`               |    12 |
|     8 | iframe           | `embed.spotify.com`             |     7 |
|     6 | iframe           | `instagram.com`                 |     2 |
|     1 | iframe           | `www.kickstarter.com`           |     1 |
|    10 | script           | `platform.twitter.com`          |     6 |
|     4 | script           | `asciinema.org`                 |     4 |
|     4 | script           | `platform.instagram.com`        |     3 |
|     3 | script           | `cdn.jsdelivr.net`              |     3 |
|     3 | script           | `gist.github.com`               |     2 |
|     1 | script           | `assets.codepen.io`             |     1 |
|    21 | image, PDF embed | `s3.eu-central-1.amazonaws.com` |     6 |
|    11 | image            | Wikimedia, GitHub, xkcd, others |     6 |

## Exploration

**Constraints.** Legacy Pages runs no custom Jekyll plugins, so the source markup itself must change. A script also cannot reliably stop an iframe or script that is already in the HTML, because the browser may fetch it first. The markup has to be inert before any script runs.

| Option                        | Result                                                                  |
| :---------------------------- | :---------------------------------------------------------------------- |
| `<template>` in each post     | Chosen. Inert in every browser for iframes, scripts and images          |
| `data-src` on each iframe     | Covers iframes only, not script widgets or tweets                       |
| Consent banner or CMP         | Adds a dependency and site-wide state to protect a few old embeds       |
| `youtube-nocookie.com`        | Returned 0 cookies, but the provider still receives the IP address      |
| Replace all embeds with links | Simplest and fully private, but loses players the posts are built around |

**The prototype.** `_posts/2017-07-12-when-your-nixos-store-outgrows-you.markdown` has the markup; `js/embed-consent.js` does the rest:

```html
<div class="consent" data-provider="youtube">
  <a href="https://www.youtube.com/watch?v=OazFiIhwAEs">Watch on YouTube</a>
  <template>
    <!-- the original embed, unchanged -->
  </template>
</div>
```

- **Without JavaScript**, the visitor gets the link and nothing loads.
- **With JavaScript**, a notice names the provider and links its privacy policy, with a Load button.
- **After loading**, the visitor can Reload or Remove the embed.
- **Quoted posts** stay readable before consent: a blockquote in the template is shown as a plain copy, without its images.
- **Nothing is stored**, so there is no state to disclose or revoke, and refreshing the page unloads everything.
- **The script** is only requested on pages that have a gate.

**Checked in desktop Chrome on a local Pages-toolchain build:** no third-party requests before a click; one click loaded only that tweet; Reload, Remove and page refresh worked; dark mode and a 390 px frame displayed correctly.

**Not yet checked:** other browsers, a real phone, screen readers, and every provider other than YouTube and X.

**Expected problems in rollout:**

- `gist.github.com` scripts use `document.write`, which cannot work after a click. Inlining the code as local code blocks removes that provider altogether.
- Instagram and asciinema scripts need testing, and Instagram may need its own re-scan call as X does.
- 14 of the 19 Giphy embeds return 404 and should be removed, not gated.
- The S3 bucket returns 403, but browsers still contact AWS for those 21 assets.
- A post can reintroduce an ungated embed unnoticed, so rollout should include a build check that fails on third-party loads outside `<template>`.

## Open Questions

1. How should the 32 hot-linked images and PDFs be handled: gated, self-hosted or removed? Self-hosting raises the copyright question for each image.
2. Should the site offer "always allow this provider"? The prototype leaves this out, because remembering the choice adds stored state and needs a way to withdraw it.
3. Should visitors get a "load all on this page" control? `_posts/2015-09-18-slack-broke-my-flow.markdown` has 5 tweets to click through.

## Rollout

1. Decide the open questions.
2. Remove dead embeds and inline the gists.
3. Convert the remaining embeds, provider by provider, with the build check.
4. Update `imprint/index.html` in the same change that gates the last embed. Its current text says embeds load when a post opens, which stays true until then.

## Decision

Pending.
