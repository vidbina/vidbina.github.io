# Project TODOs

> [!NOTE]
> For AI agents: When uncertain about TODO context fit, use collapsible details blocks: `<details><summary>AI-generated TODOs to be reviewed</summary>- [ ] items</details>`

## Now

Audit of 2026-11-02. The items in each list can run in parallel unless they say `after:`.

- [ ] Namecheap DNS: Delete the two A records on `vid.bina.me` and keep the CNAME, because the conflict is the likely reason no certificate is issued (Impact: Availability, Effort: S, Owner: operator)
- [ ] GitHub Pages: Re-add the custom domain, confirm a certificate is issued, then enforce HTTPS (Impact: Availability, Effort: S, after: DNS)
- [ ] `_layouts/default.html`, `_includes/emojify.html`, `css/main.scss`: Drop hardcoded `https://vid.bina.me` asset URLs, which break CSS, emoji and the header image on HTTP today (Impact: Availability, Effort: S)
- [ ] `index.html:38`: Fix the Previous link, whose `replace` renders `https:/vid.bina.me/` and will 404 once on HTTPS (Impact: UX, Effort: S)
- [ ] GitHub settings: Apply the squash-only spec in `.github-settings.yaml` (Impact: DevEx, Effort: S, Owner: needs operator approval)
- [ ] Mixed content: Move the 18 `http://` asset references to https in posts and talks, including the `http://vid.bina.me` PDF embeds in `_posts/2014-1-19-flight-routes.markdown` (Impact: Availability, Effort: S)

## Next

- [ ] `docs/decisions/0001-select-pages-build-path.md`: Decide between the legacy build and an Actions deploy of Jekyll 4.4 (Impact: Security/DevEx, Effort: S, Owner: operator)
- [ ] `Gemfile`, `_config.yml`, `_plugins/`, `.github/workflows/`: Modernize the toolchain as decided, including `submodules: true` for MathJax (Impact: Security/DevEx, Effort: M, after: decision)
- [ ] `README.md`, `AGENTS.md`, `Makefile`, `Rakefile`, `Dockerfile`: Replace the Ruby 2.4, Docker and rsync instructions, adopting `.envrc` and devenv if they fit (Impact: DevEx, Effort: S, after: toolchain)
- [ ] GitHub PRs: Close [#14](https://github.com/vidbina/vidbina.github.io/pull/14), [#6](https://github.com/vidbina/vidbina.github.io/pull/6), [#11](https://github.com/vidbina/vidbina.github.io/pull/11), [#12](https://github.com/vidbina/vidbina.github.io/pull/12) and [#13](https://github.com/vidbina/vidbina.github.io/pull/13), then resume paused Dependabot security fixes (Impact: Security, Effort: S, after: toolchain, Owner: needs operator approval)
- [ ] `_config.yml`: Exclude `Makefile`, `Dockerfile`, `Rakefile`, `README.md`, `blank.html` and MathJax docs and tests from the site and sitemap (Impact: Security, Effort: S)
- [ ] `vendor/emojify/0.9.5/emojify.min.css`: Test whether this 5.4 MB render-blocking stylesheet can go, since fixing TLS brings it back on 56 pages (Impact: Performance, Effort: S, after: asset URLs)
- [ ] `_layouts/default.html`: Restore footer social icons, which appear to have no webfont or glyph CSS (Impact: UX, Effort: S)
- [ ] `_includes/function_plot.html`: Replace the dead `wzrd.in` bundle, which breaks the graphs on `/math/sigmoid-change/` (Impact: Content, Effort: S)
- [ ] Local links: Fix the scheme-less links in the laundr and coming-to-africa posts, `_data/news.yml:36`, the talks favicons and `/svg/head.svg` (Impact: UX, Effort: S)

## Later

- [ ] S3 assets: Recover or replace 21 references on 6 pages and the og/twitter images on 11 pages, as the bucket returns 403 `AllAccessDisabled` and sampled assets are not in git (Impact: Content, Effort: L, Owner: operator knows if originals exist)
- [ ] Giphy embeds: Replace or remove the 14 of 19 that return 404 (Impact: Content, Effort: M)
- [ ] Other dead images: Replace the Wikimedia, Pandora's Cluster and cinemablend images (Impact: Content, Effort: S)
- [ ] External links: Sweep the 356 unique links, where 5 of a 32-link sample were dead (Impact: Content, Effort: L)
- [ ] `_data/news.yml`, `_posts/`: Fix SEO metadata: duplicate twitter tags, missing canonicals, the `example.com` image in `hello-trickster`, raw `:emoji:` in descriptions (Impact: SEO, Effort: S)
- [ ] Feed: Add one, as `/feed.xml` is a 404 and readers have no way to subscribe (Impact: UX, Effort: S, after: toolchain)
- [ ] Emoji: Add the missing `:facepalm:` and `:thinking:` images (Impact: UX, Effort: S)
- [ ] `images/`, `fonts/`: Trim about 746 unused emoji PNGs, unused Montserrat Alternates fonts and `fonts/entypo.zip` (Impact: Performance, Effort: S)
- [ ] `vendor/`, `js/`: Audit browser-side code that Dependabot cannot see: emojify 0.9.5, `impress.js`, the 66 MB MathJax 2.7.1 submodule (Impact: Security, Effort: M)

<details>
<summary>Needs a decision from the operator before any change</summary>

Removing these from the site is easy, but they stay in git history and on GitHub unless history is rewritten.

- [ ] `resources/aviation/approach_plates/smjp_jeppesen_20120817.pdf`: Possibly copyrighted chart (Impact: Legal, Effort: S)
- [ ] `resources/aviation/`: Outdated navigation charts (Impact: Safety, Effort: S)
- [ ] `resources/startup/laundr/ops-collage-042014.jpg`: Shows identifiable people and a handwritten customer name (Impact: Privacy, Effort: S)
- [ ] `resources/startup/africa/personalintro.png`: Personal sketch with age and height (Impact: Privacy, Effort: S)
- [ ] `resume/`: Birth year and city are public (Impact: Privacy, Effort: S)
- [ ] `_data/experience.yml`: Four `public: false` entries are readable in the public repo (Impact: Privacy, Effort: S)
- [ ] `_drafts/`: 25 drafts are public on GitHub, though not on the site (Impact: Privacy, Effort: S)

</details>

## Completed

- [x] Site: Audit outage, toolchain, content and CI (Impact: Availability, Effort: S, Completed: 2026-11-02)

## Never

- [ ] ~~Merge [PR #14 (Codex Jekyll 4.4 draft)](https://github.com/vidbina/vidbina.github.io/pull/14) as the upgrade~~ -> Its build fails, and it has no deploy path (Reason: See `docs/decisions/0001-select-pages-build-path.md`, Date: 2026-11-02)

---

<details>
<summary>📋 Usage & Guidelines</summary>

**Purpose:** Repository-specific task scratchpad outside formal ticketing (Linear)

**Use for:**

- Technical debt discovered during development
- "Gotchas" and improvement opportunities
- Repository-specific setup/tooling issues
- Refactoring opportunities

**Format:** `file/path.ts: Brief description (Impact: Performance/Security/DevEx, Effort: S/M/L)`

**Examples:**

- `src/api/users.ts: N+1 query causing slow dashboard loads (Impact: Performance, Effort: M)`
- `README.md: Missing Redis setup steps (Impact: DevEx, Effort: S)`
- `~~Real-time chat~~ -> Polling sufficient for now (Reason: Complexity vs value, Date: 2024-01-15)`

**Workflow:**

1. Add items during development (low friction)
2. Weekly review to evaluate Linear promotion
3. Monthly archival of old Completed/Never items to `TODO.ARCHIVE.md`

</details>
