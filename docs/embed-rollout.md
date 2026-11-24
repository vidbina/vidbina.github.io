# Embed rollout

Tracks moving every third-party embed behind the consent gate decided in
[`0002-gate-embeds-behind-consent.md`](decisions/0002-gate-embeds-behind-consent.md).
One PR per provider, and each PR ticks its own line below.

## How the pieces fit

- `_includes/csp.html` puts a Content-Security-Policy in every page's `<head>`. It allows this site's own files, plus the sources in `_data/embeds/<provider>.yml` for each provider the page gates. A provider that is not gated on a page is blocked there, so its embed stays empty and the visitor's browser never contacts it.
- The two talk decks under `talks/` have their own `<head>` and a fixed policy that allows only this site.
- `js/embed-consent.js` reads the same data files for the provider's name, operator, privacy policy and version.
- Gating a provider therefore takes a data file plus the `.consent` markup around each embed, and needs no change to the layout or script.

## Checklist for each provider

Every provider PR goes through all of these, on a local Pages build in Chrome with storage cleared:

- [ ] Each embed URL checked: dead ones removed, not gated
- [ ] `_data/embeds/<provider>.yml` with name, operator, privacy policy, version and CSP sources
- [ ] Each live embed wrapped in `.consent` with a fallback link and a `<template>`, using `https://` URLs
- [ ] The build inventory shows no ungated load from this provider
- [ ] Page load: no request to the provider and no policy violation
- [ ] Load once: the embed renders, no policy violation, nothing stored
- [ ] Load all N once, on pages with several embeds from the provider
- [ ] Always load: stored, survives a reload, other providers stay gated; Forget restores the gate
- [ ] The imprint list shows the provider and withdrawing works
- [ ] Listing pages that show the post (`/`, `/page2/`, `/news/`) behave the same
- [ ] Light and dark mode, and a 390 px frame
- [ ] PR body states the before and after counts; screenshots sent to the operator

## Order and status

- [x] Stopgap: block everything not gated
- [x] Giphy: all 19 gated as plain GIFs from `media.giphy.com`, which still serves the 14 whose embed pages return 404
- [x] YouTube: 12 more embeds gated (13 with the NixOS post); 4 videos that are gone or private replaced with a note
- [x] Instagram: 7 posts on 5 pages gated, with a re-scan after load like X; 2 removed posts (3 embeds) replaced with a note
- [x] Spotify: 8 players on 7 posts gated, moved from the legacy `embed.spotify.com` to `open.spotify.com/embed`
- [x] X (Twitter): 5 more tweets on 4 posts and 2 on `/news/` gated; 4 deleted tweets on the Slack post kept as plain quotes
- [x] asciinema: 4 recordings on 4 posts gated; the player script works when the gate inserts it
- [x] GitHub Gist: 3 files from 2 of the operator's gists inlined as code blocks, so the provider is gone
- [x] GitHub cards (jsDelivr): the 3 cards, which loaded from jsDelivr and called GitHub's API, became plain links to the repos and profile
- [x] CodePen: the one pen gated, loading CodePen's current embed script directly
- [ ] Kickstarter: check the video still exists
- [ ] Images: S3 is dead (403) and stays blocked until the originals are found; Wikimedia, GitHub, xkcd and cinemablend need a decision to host locally, link out or remove. `js/emoji-cdn.js` on the NYC talk deck points at a dead host and goes too
- [ ] Build check in CI: fail when a page loads a third party outside a `<template>`
- [ ] Final imprint text, once nothing is left ungated

## Inventory

Third-party loads outside a `<template>` in the built site on 2026-11-24, before the stopgap: 104 on 33 pages. The NixOS store post's three tweets and one video were already gated.

### Images (s3.eu-central-1.amazonaws.com): 21 loads on 6 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/cloud/marathon-dreamin/](https://vid.bina.me/cloud/marathon-dreamin/) | 4 | `_posts/2015-09-19-marathon-dreamin.markdown` |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/reflection/suspicious-profile/](https://vid.bina.me/reflection/suspicious-profile/) | 5 | `_posts/2015-10-22-suspicious-profile.markdown` |
| [/tools/oh-gpg/](https://vid.bina.me/tools/oh-gpg/) | 5 | `_posts/2014-10-20-oh-gpg.markdown` |
| [/tools/pros-of-conses/](https://vid.bina.me/tools/pros-of-conses/) | 5 | `_posts/2015-12-24-pros-of-conses.markdown` |
| [/web/secure-github-pages/](https://vid.bina.me/web/secure-github-pages/) | 1 | `_posts/2016-03-18-secure-github-pages.markdown` |

### Giphy: 19 loads on 7 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/cloud/dockerized/](https://vid.bina.me/cloud/dockerized/) | 2 | `_posts/2015-05-19-dockerized.markdown` |
| [/cloud/marathon-dreamin/](https://vid.bina.me/cloud/marathon-dreamin/) | 6 | `_posts/2015-09-19-marathon-dreamin.markdown` |
| [/code/hoisted-js-vars/](https://vid.bina.me/code/hoisted-js-vars/) | 1 | `_posts/2015-10-26-hoisted-js-vars.markdown` |
| [/family/to-my-brother/](https://vid.bina.me/family/to-my-brother/) | 4 | `_posts/2016-01-25-to-my-brother.markdown` |
| [/reflection/suspicious-profile/](https://vid.bina.me/reflection/suspicious-profile/) | 3 | `_posts/2015-10-22-suspicious-profile.markdown` |
| [/tools/constantly-es6/](https://vid.bina.me/tools/constantly-es6/) | 1 | `_posts/2015-10-8-constantly-es6.markdown` |
| [/tools/oh-gpg/](https://vid.bina.me/tools/oh-gpg/) | 2 | `_posts/2014-10-20-oh-gpg.markdown` |

### YouTube: 16 loads on 11 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/aviation/flight-routes/](https://vid.bina.me/aviation/flight-routes/) | 2 | `_posts/2014-1-19-flight-routes.markdown` |
| [/cloud/marathon-dreamin/](https://vid.bina.me/cloud/marathon-dreamin/) | 1 | `_posts/2015-09-19-marathon-dreamin.markdown` |
| [/entrepreneurship/animating-laundr/](https://vid.bina.me/entrepreneurship/animating-laundr/) | 1 | `_posts/2014-04-11-animating-laundr.markdown` |
| [/music/mvula-overcome/](https://vid.bina.me/music/mvula-overcome/) | 1 | `_posts/2016-03-15-mvula-overcome.markdown` |
| [/music/snarky-puppy-we-like-it-here/](https://vid.bina.me/music/snarky-puppy-we-like-it-here/) | 1 | `_posts/2014-9-30-snarky-puppy-we-like-it-here.markdown` |
| [/opinion/hello-trickster/](https://vid.bina.me/opinion/hello-trickster/) | 1 | `_posts/2016-04-28-hello-trickster.markdown` |
| [/opinion/stir-it-up/](https://vid.bina.me/opinion/stir-it-up/) | 3 | `_posts/2015-05-29-stir-it-up.markdown` |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/rant/slack-broke-my-flow/](https://vid.bina.me/rant/slack-broke-my-flow/) | 1 | `_posts/2015-09-18-slack-broke-my-flow.markdown` |
| [/travel/coming-to-africa/](https://vid.bina.me/travel/coming-to-africa/) | 3 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/web/landing-strip/](https://vid.bina.me/web/landing-strip/) | 1 | `_posts/2015-09-14-landing-strip.markdown` |

### Instagram: 10 loads on 5 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/code/ipa-api/](https://vid.bina.me/code/ipa-api/) | 1 | `_posts/2016-01-25-to-my-brother.markdown` |
| [/family/to-my-brother/](https://vid.bina.me/family/to-my-brother/) | 2 | `_posts/2016-01-25-to-my-brother.markdown` |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/travel/coming-to-africa/](https://vid.bina.me/travel/coming-to-africa/) | 5 | `_posts/2014-9-29-coming-to-africa.markdown` |
| [/web/list-sentence/](https://vid.bina.me/web/list-sentence/) | 1 | `_posts/2016-01-25-to-my-brother.markdown` |

### Spotify: 8 loads on 7 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/cloud/marathon-dreamin/](https://vid.bina.me/cloud/marathon-dreamin/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/family/to-my-brother/](https://vid.bina.me/family/to-my-brother/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/music/mvula-overcome/](https://vid.bina.me/music/mvula-overcome/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/music/snarky-puppy-we-like-it-here/](https://vid.bina.me/music/snarky-puppy-we-like-it-here/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 2 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/reflection/suspicious-profile/](https://vid.bina.me/reflection/suspicious-profile/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/tools/oh-gpg/](https://vid.bina.me/tools/oh-gpg/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |

### X (Twitter): 7 loads on 5 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/news/](https://vid.bina.me/news/) | 2 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/rant/slack-broke-my-flow/](https://vid.bina.me/rant/slack-broke-my-flow/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/tools/nix/nix-set-laziness/](https://vid.bina.me/tools/nix/nix-set-laziness/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/tools/pros-of-conses/](https://vid.bina.me/tools/pros-of-conses/) | 2 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |

### Images (upload.wikimedia.org): 6 loads on 4 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |
| [/talks/devops/dont-pee-in-my-sandbox/](https://vid.bina.me/talks/devops/dont-pee-in-my-sandbox/) | 3 | `talks/devops/dont-pee-in-my-sandbox/index.html` |
| [/web/kubernetting-gcloud/](https://vid.bina.me/web/kubernetting-gcloud/) | 1 | `_posts/2015-02-22-kubernetting-gcloud.markdown` |
| [/web/landing-strip/](https://vid.bina.me/web/landing-strip/) | 1 | `_posts/2015-09-14-landing-strip.markdown` |

### asciinema: 4 loads on 4 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/tools/arduino/arduino-on-nixos/](https://vid.bina.me/tools/arduino/arduino-on-nixos/) | 1 | `_posts/2017-12-09-arduino-on-nixos.markdown` |
| [/tools/housekeeping-disks-in-linux/](https://vid.bina.me/tools/housekeeping-disks-in-linux/) | 1 | `_posts/2017-09-07-housekeeping-disks-in-linux.markdown` |
| [/tools/irc/irssi-primer/](https://vid.bina.me/tools/irc/irssi-primer/) | 1 | `_posts/2017-12-05-irssi-primer.markdown` |
| [/tools/nixos/nixos-cheatsheet/](https://vid.bina.me/tools/nixos/nixos-cheatsheet/) | 1 | `_posts/2017-06-13-nixos-cheatsheet.markdown` |

### GitHub cards (jsDelivr): 3 loads on 3 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/tools/simple-tmux-with-muxy/](https://vid.bina.me/tools/simple-tmux-with-muxy/) | 1 | `_posts/2015-09-14-landing-strip.markdown` |
| [/web/for-my-friend-getting-up-to-speed/](https://vid.bina.me/web/for-my-friend-getting-up-to-speed/) | 1 | `_posts/2015-09-14-landing-strip.markdown` |
| [/web/landing-strip/](https://vid.bina.me/web/landing-strip/) | 1 | `_posts/2015-09-14-landing-strip.markdown` |

### GitHub Gist: 3 loads on 2 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/tools/oh-gpg/](https://vid.bina.me/tools/oh-gpg/) | 1 | `_posts/2014-10-20-oh-gpg.markdown` |
| [/web/trekking-through-the-aws-jungle/](https://vid.bina.me/web/trekking-through-the-aws-jungle/) | 2 | `_posts/2014-10-6-trekking-through-the-aws-jungle.markdown` |

### Images (github.com): 3 loads on 1 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/web/landing-strip/](https://vid.bina.me/web/landing-strip/) | 3 | `_posts/2015-09-14-landing-strip.markdown` |

### Kickstarter: 1 loads on 1 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/perfect-blogging-solution/](https://vid.bina.me/perfect-blogging-solution/) | 1 | `_posts/2013-12-1-perfect-blogging-solution.markdown` |

### Images (imgs.xkcd.com): 1 loads on 1 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/tools/fucking-sudont/](https://vid.bina.me/tools/fucking-sudont/) | 1 | `_posts/2014-10-06-fucking-sudont.markdown` |

### CodePen: 1 loads on 1 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/web/list-sentence/](https://vid.bina.me/web/list-sentence/) | 1 | `_posts/2016-04-01-list-sentence.markdown` |

### Images (www.cinemablend.com): 1 loads on 1 pages

| Page | Loads | Source |
| :--- | ---: | :--- |
| [/cloud/marathon-dreamin/](https://vid.bina.me/cloud/marathon-dreamin/) | 1 | `_posts/2015-09-19-marathon-dreamin.markdown` |

