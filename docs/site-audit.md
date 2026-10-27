# Milestone Mental Health — Phase 0 site audit

Audit date: October 27, 2026 (America/Chicago). Scope: complete repository inventory, source inspection, local browser baseline, and separate public production checks. **Phase 0 only; application code unchanged.**

## Executive summary

The redesigned local site is materially different from the published site. Production still serves the older design, `css/styles.css`, duplicate jQuery loads, and SimplePractice/reCAPTCHA/Kwes scripts. The new `milestone-home.min.css` and `milestone-pages.css` URLs return 404 on production. Deploying only redesigned HTML would therefore break presentation. Hosting and release provenance must be established before any eventual release.

The redesign provides a strong starting point: descriptive local titles and descriptions, one H1 and main landmark per page, working skip navigation, visible form labels, privacy instructions, and Bootstrap interactions. There are confirmed contrast failures on all 11 local service/careers pages. A homepage-only CSS bundle is also missing a utility still used by interior links. Homepage appointment CTAs currently reach a general-inquiry form that explicitly says it does not request appointments.

The largest measured local performance issue is the PCIT hero: approximately 1.27 MB and 3,712 natural pixels wide, without responsive variants. Local mobile Lighthouse samples scored 76 for the homepage and 71 for PCIT. Production homepage scored 60 and transferred about 22.6 MB. These are separate single-run lab baselines, with important environment differences; see [performance baseline](performance-baseline.md).

No critical issue was demonstrated. High severity items are readability barriers, appointment-path confusion, release divergence, duplicate URL exposure, and oversized images. No complete WCAG conformance or legal compliance determination is made. Manual assistive-technology and third-party workflow testing remain outstanding.

## Repository and release state

- Branch: `master`, tracking `origin/master`; no fetch or push performed, so remote freshness is unverified.
- HEAD: `0351e43571aeb984f20ba047858563df7737ac3c`, October 26, 2026, “Updated layout for conversion, more user friendly, and user flow.”
- Existing uncommitted change: `index.html`, Heather's license text changed from LGSW to LICSW. Preserved exactly; audit uses the working copy.
- Recent history includes clinician additions/removals, photo updates, and an older secure widget integration. History is evidence of maintenance, not proof of deployment.
- No applicable `AGENTS.md` found in the workspace or checked ancestor directories. No existing equivalent audit documentation found.
- 14 root HTML files; 12 additional HTML files in `dist/`. 13 source CSS files plus 2 generated CSS files. 2 source JS files plus 17 generated JS files. 212 files under `assets/`; full filenames, byte sizes, and classifications are in [file inventory](file-inventory.md) and [raw inventory](evidence/inventory.json).
- Tracked `.parcel-cache/` contains 12 entries. `node_modules/` exists and is ignored; `.parcel-cache/` and `dist/` are tracked. Neither was changed.
- `package.json`: Parcel `^2.8.3`, source `index.html`, `start: parcel`, `build: parcel build`; Babel, resolver-glob, PurgeCSS, Partytown, body-parser dependencies. `.parcelrc` adds the glob resolver. No documented multi-page release command, deployment workflow, hosting config, redirects file, `.htaccess`, Netlify/Vercel config, or GitHub Actions workflow found among tracked files.
- Build not run: it can overwrite tracked `dist/` and caches. The single configured entry does not establish that all public documents, PDFs, robots and sitemap are packaged correctly. Verify a staged build in an isolated output directory in Phase 3.
- Apache is observed on production. The actual document root, upload mechanism, server configuration and deployment owner are not available in this repository.

## Active, historical, and uncertain files

| Group | Classification and evidence | Safe action now |
| --- | --- | --- |
| Root HTML | Current redesigned working source, publicly reachable matching URLs serve older bodies | Preserve; prepare a complete release manifest later |
| `css/milestone-home.min.css` | Loaded by all 14 root pages; 89,554 bytes; header calls it homepage-only | Preserve; audit shared utility coverage before modifying |
| `css/milestone-pages.css` | Loaded by 12 interior/success pages; 130,953 bytes | Preserve shared `.mm-ses-*` layouts |
| `css/milestone-404.css` | Loaded by root 404 page; 5,881 bytes | Preserve |
| `css/styles.css` | Not linked by redesigned root HTML, but **active on live production**, 244,614-byte live body vs 249,692-byte local file | Never classify globally unused |
| Other 9 source CSS files | Not directly linked from redesigned root HTML; readable component/reference/source candidates, provenance not established | Retain; map to bundle before cleanup |
| `js/scripts.js` | Active locally on homepage and production; navigation shrink, jQuery collapse, AOS initialization | Retain working behavior |
| `modernizr.js` | Active locally on homepage and live site; feature detection; legacy `.no-webp` CSS present | Candidate only after feature and fallback audit |
| `dist/` | Older generated HTML, hashed assets, source maps, PDFs; `/dist/index.html` is publicly accessible with HTTP 200 | Treat as publicly exposed historical site; plan hosting exclusion/URL handling with approval |
| `.parcel-cache/` | Generated tracked build cache, not directly referenced by HTML | Exclude from future release artifacts; repository removal requires approval |
| Local images/PDFs | Many originals and responsive siblings; direct references do not include CSS URLs or ImageKit mirrors | No deletion authorized; filename similarity is not non-use evidence |
| Experimental files | None conclusively identified | Do not label originals/backups disposable without provenance |

The exact published deployment manifest cannot be reconstructed from Git alone. Evidence identifies live entry documents/dependencies and the public old `dist` entry, not every file present on the host. No production integration has been changed.

## Dependencies, components, and visitor paths

Local homepage: Google Fonts Source Sans 3 variable normal/italic (`display=swap`), system/Georgia serif fallbacks with some `Lora` declarations but no local Lora request; ImageKit responsive photography and logos; AOS 2.3.1 CSS/JS from unpkg; Bootstrap 5.1.3 bundle from jsDelivr; jQuery 3.6.0 from code.jquery.com; Modernizr; local theme script; inline copyright, Partytown configuration, and modal-to-contact handler. AOS stylesheet has a noscript fallback, so two source link tags do not imply two normal-browser fetches. Partytown configuration/package exists but no active worker bootstrap was found in root HTML.

Interiors use Google Fonts, ImageKit (and selected local hero images), common CSS and deferred Bootstrap. No jQuery/AOS script is loaded by these redesigned interiors. Homepage has 20 Bootstrap dialogs (4 specialization, 16 clinician biographies), collapse navigation, a specialization dropdown, general form, map iframe, section anchors, mailto/tel/PDF links, and external portal CTAs. The 404 page uses its own stylesheet with shared navigation and footer.

General inquiry: native HTML POST to WebForms; name/email/general question only; visible warning prohibits sensitive information. No actual inquiry was sent. Secure appointment/care route: external `milestonementalhealth.clientsecure.me`, landing HTTP 200 only; no login/intake/submission or third-party accessibility certification. Map: Snazzy Maps iframe with title and lazy loading, plus independent directions/address text.

Live homepage additionally requests Adobe Typekit, Google Cinzel/Raleway, Bootstrap Icons, duplicate jQuery, SimplePractice widget, reCAPTCHA, Kwes scripts, and a map. These remain **production-active** even though removed from redesigned local HTML. Do not remove or alter the live integrations during this audit.

## Five most urgent issues

1. **A01/A02 — High:** shared blue-panel contrast failures and near-illegible interior links (as low as 1.23:1). Fix minimal scoped colors/utilities in Phase 1.
2. **C01 — High:** homepage appointment CTAs land at “Send a General Inquiry,” which disclaims appointment requests. Confirm the new-client route before changing CTA destinations.
3. **D01/S02 — High:** redesigned source is not published, new CSS is missing from production, and historical `/dist/index.html` is public. Establish release scope; preserve current integrations until a separately approved release.
4. **S01 — High:** all 14 fetched live pages lack working HTML canonicals; www/non-www and `/`/`index.html` serve duplicate bodies. Local homepage canonical is commented out.
5. **P01 — High:** oversized, unresponsive interior hero images; PCIT mobile sample LCP 9.64 seconds. Size variants before reducing quality.

## Finding register

All findings below are **open recommendations, not implemented**. Severity reflects user/release impact, not a legal conclusion. Locations refer to the audited working source; browser selectors and raw evidence identify rendered targets.

### D01 — High / Maintainability — local/live release divergence

- Location: `index.html:14`, `css/milestone-home.min.css:1`, `css/milestone-pages.css:1`, hosting configuration outside repository. URL: all public root pages.
- Observed/evidence: [live HTTP evidence](evidence/live-http.json): older titles/styles; redesigned CSS returns 404. Local homepage 207,384 bytes; fetched live homepage 116,711 bytes. Apache production response includes Last-Modified October 20, 2026.
- Guidance: release integrity prerequisite; no direct WCAG criterion assigned.
- Fix: identify actual document root/deployment owner, record asset manifest, stage complete root site and assets, explicitly handle historical directories. Do not deploy during Phase 0.
- Risk: high if wrong output directory or partial upload is chosen. Verify: staged HTML/CSS/JS/PDF completeness, hashes, all routes, and approved production smoke test. Status: open, hosting confirmation required.

### A01 — High / Accessibility — blue card contrast

- Location: `css/milestone-pages.css:2409`, `:2423`, `:5852`; `.mm-ses-blue__card`, `.mm-career-glance`. URLs: all 11 service/careers pages, listed in page matrix.
- Observed/evidence: axe at 390/1440 widths: pale text `#f7f9f8` on composite `#607b89` = 4.23:1; white on same = 4.47:1; career `#eaf1f4` = 3.91:1. These small/normal text targets require 4.5:1. [Browser evidence](evidence/browser.json).
- Criterion: [WCAG 1.4.3](https://www.w3.org/TR/WCAG21/#contrast-minimum).
- Fix: minimally darken the affected card background or adjust its text/overlay tokens; include every actual composited background and text state. Risk: low/medium because shared CSS affects many pages. Verify: computed contrast and visual review on all 11 pages at mobile/desktop. Status: open, Phase 1.

### A02 — High / Accessibility — interior link utility missing from homepage bundle

- Location: `parent-child-interaction-therapy.html:223`, `eye-movement-densensitizaion-and-reprocessing.html` `.text-white`; `css/milestone-home.min.css:13` default anchor color. URLs: PCIT and EMDR.
- Observed/evidence: `.text-white` is used but no corresponding rule exists in either active common stylesheet. Browser computes `#0d6581` link text on `#526f7f` = 1.23:1. The bundle describes itself as homepage-only but every redesigned page loads it.
- Criterion: WCAG 1.4.3. Fix: scoped accessible link color in the shared interior blue component, or restore only required utility with cross-page proof; retain recognizable links in all states.
- Risk: low for scoped correction; high for another homepage-only CSS purge. Verify: axe, hover/focus/visited contrast, all interior pages. Status: open, Phase 1.

### C01 — High / Conversion — appointment intent reaches general form

- Location: `index.html:286`, `:326`, `:3947`, `:4002`; header/hero/service/team/footer appointment anchors and modal-to-contact script. URL: `/#request-appointment`.
- Observed/evidence: target contains “Send a General Inquiry,” privacy warning, and “Submitting this form does not request, schedule, or confirm an appointment.” Portal/phone are in an adjacent panel. Other interiors already link appointment CTAs directly to portal.
- Guidance: clear link purpose (WCAG 2.4.4 review), privacy-preserving task completion. This is confirmed path friction, not evidence that private information was submitted.
- Fix: Rachel confirms exact new-client route and provider-selection behavior; then align appointment CTAs and modal destinations while preserving a separate general-inquiry path. Risk: medium/high if portal URL or new-client policy is assumed. Verify: keyboard, screen reader and mobile appointment flow, no sensitive form fields or analytics payloads. Status: open, owner decision required.

### S01 — High / SEO — absent canonical signals and duplicate origins

- Location: `index.html:15`; live HTML heads; server redirects unavailable in repository. URLs: `/`, `/index.html`, www and non-www.
- Observed/evidence: homepage canonical is only a comment. All 11 substantive local interiors have active self-canonicals; local 404/success intentionally noindex. All fetched live pages have no active canonical. Both HTTPS hosts and both home paths return 200; HTTP www redirects 301 to HTTPS www.
- Guidance: [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- Fix: retain existing spelling-error paths, set homepage canonical, align sitemap/internal links, plan preferred-origin/home-path redirects with hosting owner. Risk: low for correct metadata, medium for redirects. Verify: raw HTML, redirect chains, final status, Search Console selected canonical when available. Status: open, Phase 2.

### S02 — High / SEO — publicly accessible historical distribution

- Location: `dist/index.html`, other tracked `dist/*`, hosting public directory. URL: `/dist/index.html`.
- Observed/evidence: HTTP 200, 67,108-byte historical homepage; [live HTTP evidence](evidence/live-http.json). This proves exposure of that entry only, not indexing of every `dist` file.
- Guidance: canonicalization and duplicate-content consolidation. Fix: choose appropriate hosting exclusion, redirect, or removal response for historical URLs after checking backlinks and actual access logs; preserve historical source offline.
- Risk: medium/high if deployed output depends on directory. Verify: production response/indexability and root asset survival. Status: open; no deletion or server change approved.

### P01 — High / Performance — interior hero originals

- Location: `parent-child-interaction-therapy.html:102`; other interior hero `img` tags, full inventory in [performance report](performance-baseline.md). URL: PCIT plus other service/career pages.
- Observed/evidence: PCIT `Kidsrunning.webp` 1,266,700 bytes; browser natural width 3,712 vs about 329 rendered CSS pixels at 390. No `srcset`/`sizes`; mobile LCP sample 9.64 seconds.
- Guidance: [Google Web Vitals](https://web.dev/articles/vitals). Fix: measured ImageKit width variants, correct `sizes`, aspect-ratio reservation, eager/high priority only for real LCP images. Keep approved quality and no artificial sharpening.
- Risk: medium (cropping/sharpness/layout). Verify: selected currentSrc/natural dimensions, screenshots and repeated Lighthouse on staged compressed hosting. Status: open, Phase 4 after preceding gates.

### A03 — Medium / Accessibility — animation-dependent contact visibility

- Location: `index.html:38`, `:3990`–`:4168`, `js/scripts.js:37`; contact `[data-aos]`.
- Observed/evidence: [focused tests](evidence/focused-tests.json) show all four contact blocks opacity 0 with JavaScript disabled while noscript AOS CSS loads. With JS and scrolling the reached blocks become visible. Reduced-motion mode still uses AOS visibility behavior; comprehensive motion/failure review remains needed.
- Criterion: robustness/visible-focus review (2.4.7); absence of a no-JS alternative alone is not a WCAG failure when accessible JavaScript is relied upon. Reduced-motion suppression is a practical enhancement; do not mislabel WCAG 2.3.3 AAA as AA.
- Fix: make essential content visible independently of animation initialization; explicit reduced-motion and no-script fallback. Risk: low/medium, preserve intended calm design. Verify: block AOS JS, disable JS, reduce motion, scroll and keyboard-focus form/portal at 320 and 1440. Status: open, Phase 1.

### A04 — Medium / Accessibility — third-party form outcomes unverified

- Location: `index.html:4025`–`:4099`; external WebForms handler and `form-submission-sucess.html`. URL: general inquiry/hosted response.
- Observed/evidence: required/email native constraints, persistent labels and warning are present; native empty-field checks fail with browser messages as expected. No submission made; external error/success announcement, redirects, delivery, spam checks and screen-reader recovery are unverified. No local `_redirect` setting is present; dashboard behavior unknown.
- Criteria: 3.3.1–3.3.3, 4.1.3, 1.3.5. Fix: verify provider configuration with synthetic non-health test data in an owner-controlled test workflow, then add local associations/status handling only if needed. Risk: medium for delivery/integration changes. Verify: keyboard/screen reader, invalid and server-error paths, 200/400% zoom, success page and actual receipt. Status: testing gap, Phase 1; owner/provider access needed for end-to-end evidence.

### A05 — Medium / Accessibility — policy and fee PDFs need accessibility review

- Location: `assets/Files/no-surprises-act.pdf`, `assets/Files/4_2_25_FEE_SCHEDULE.pdf`; homepage payment/footer links.
- Observed/evidence: both linked PDFs return 200 live; tagged structure, reading order, form semantics and magnification were not tested. Filename date is not proof of current fee validity.
- Criteria: 1.1.1, 1.3.1, 1.3.2, 1.4.3, 2.4.2 as applicable. Fix: inspect with a PDF accessibility checker and screen reader, provide equivalent accessible content if necessary; Rachel verifies fee/policy currency. Risk: medium if pricing or rights language changes. Verify: PDF/UA-style structural checks plus manual reading and equivalent information. Status: manual review required, not a confirmed PDF failure.

### S03 — Medium / SEO — stale/incomplete sitemap

- Location: `sitemap.xml:13` onward; live `/sitemap.xml`.
- Observed/evidence: 2022 `lastmod` values, both `/` and `/index.html`, clinical-supervision page omitted; new fee PDF not listed (listing every PDF is optional). robots.txt correctly advertises sitemap and permits main pages.
- Guidance: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Fix: preferred indexable URLs only, include clinical supervision if intended to be indexed; use verifiable significant update dates or omit unmaintained lastmod. Risk: low. Verify: XML parse, canonical/status alignment, submission and indexing in Search Console. Status: open, Phase 2.

### S04 — Medium / SEO — broken education resource link

- Location: `trauma-informed-child-parent-psychotherapy.html:260`. URL: `https://childparentpsychotherapy.com/families/`.
- Observed/evidence: final HTTP 404 in [external link evidence](evidence/live-http.json). EMDRIA and Minnesota Psychological Association links return 403 to the test client; those are **not** established broken links.
- Guidance: helpful, usable supporting links. Fix: verify official current family resource and owner-approved replacement. Risk: low/medium (clinical resource choice). Verify: real browser destination and relevant content, repeat status check. Status: open, Phase 2 (or accessibility/functionality gate if link is essential).

### S05 — Medium / SEO — structured data and social sharing opportunity

- Location: all root document heads; `index.html:3`–`:39`. URL: indexable practice/service pages.
- Observed/evidence: no JSON-LD found in 14 local pages; no Open Graph/Twitter metadata found by source review. The production URL was entered into Google's Rich Results Test, which returned “Something went wrong / Log in and try again”; no validation result obtained. [Attempt evidence](evidence/rich-results.json). Missing schema is an opportunity, not an indexing prohibition.
- Guidance: [Google LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- Fix: truthful Organization/appropriate LocalBusiness identity with visible NAP; service descriptions only where supported. Confirm business type, hours, logo, location and official profiles. Add social image metadata separately. Never fabricate reviews, ratings or eligibility promises.
- Risk: medium for medical/business assertions. Verify: JSON parse, Schema.org validator and completed Google Rich Results run; metadata preview. Status: open, Phase 2, owner confirmation needed.

### S06 — Medium / SEO — play-therapy page lacks incoming navigation links

- Location: `experiental-play-therapy.html`; missing incoming anchor in other redesigned root HTML. URL: `/experiental-play-therapy.html`.
- Observed/evidence: static anchor graph finds zero incoming links from the other 13 root documents; its self-canonical is not a navigation link. The URL remains in sitemap.xml and returns 200 live, so it is not entirely undiscoverable. [Inventory](evidence/inventory.json).
- Guidance: crawlable, relevant internal links and useful navigation. Fix: Rachel confirms current service availability, then add an appropriate contextual link from an existing child/play-therapy section or relevant modality page; preserve URL spelling.
- Risk: low/medium if current clinical availability is assumed. Verify: recrawl anchor graph, keyboard/link purpose, appropriate source context and sitemap/canonical consistency. Status: open, Phase 2, clinical availability confirmation required.

### P02 — Medium / Performance — large shared CSS and legacy rules

- Location: `css/milestone-home.min.css:1`, `css/milestone-pages.css:1`.
- Observed/evidence: interior pages load 220,507 uncompressed CSS bytes; PCIT Lighthouse estimates about 187 KiB unused on that page/load. Desktop homepage coverage after scrolling/first dialog uses 45,117 of 89,552 CSS characters; this is limited state coverage, not deletion evidence. PostCSS inspection found 8 exact repeated rule-text groups in home bundle and 2 in pages stylesheet; media/cascade context not yet evaluated.
- Guidance: efficient critical rendering; preserve accessible dynamic states. Fix: establish readable sources and repeatable build, then merge only provably redundant rules and review page-component commonality. Risk: high for purging; A02 already demonstrates a missing utility.
- Verify: all pages/widths/dialogs/dropdowns/focus/errors, screenshots, coverage union and repeated lab comparison. Status: open, Phase 3; no selectors deleted.

### P03 — Medium / Performance — older live imagery and widget payload

- Location: live `index.html`, corresponding archived snapshot [here](evidence/live/index.html); ImageKit originals and SimplePractice widget chunks.
- Observed/evidence: live mobile Lighthouse transfer 22,605,614 bytes / 91 request entries; one family image about 3.10 MB, local computer image 2.75 MB, widget chunk about 1.58 MB. Live TBT 346 ms. Local redesigned homepage no longer loads the old widget and is much lighter, but is not yet a published replacement.
- Guidance: CWV measurement and resource efficiency. Fix: carry verified local responsive-image work into an approved full release; confirm new appointment route before removing any active widget. Risk: high for integration changes, medium for photo sizing. Verify: approved staged route, real image clarity, no portal breakage, lab/field measurements. Status: open, Phase 4/release approval.

### M01 — Low / Maintainability — legacy dependency and source provenance

- Location: `js/scripts.js:29`–`:38`, `modernizr.js`, `index.html:4331`–`:4361`, component CSS, `package.json`.
- Observed/evidence: jQuery used for navbar collapse, AOS initialized unconditionally, Modernizr feature classes still have CSS references, unused-looking Partytown configuration; 9 component/reference CSS files not directly linked locally. Exact source-to-minified-bundle process is undocumented. Old version numbers are not by themselves proof of exploitable vulnerabilities.
- Fix: map bundles to readable sources; consider native Bootstrap collapse to retire jQuery only after interaction checks; evaluate Modernizr and AOS separately; remove dead configuration only with evidence. Risk: medium. Verify: no console errors, scroll, mobile close, reduced motion, feature fallbacks, all dynamic states and dependency audit in isolated toolchain. Status: candidates only, Phase 3.

### M02 — Medium / Maintainability — release artifacts and unsupported audit host runtime

- Location: `.parcel-cache/`, `dist/`, `package.json`, `.gitignore`; environment Node 19.1.0.
- Observed/evidence: caches and older distribution are tracked; package source only `index.html`; Node 19 triggers engine warnings for installed audit dependencies. Audit tools executed successfully but supported runtime should be used for reproducible future checks. Site dependencies/lockfile unchanged.
- Fix: use a supported Node version in documented isolated audit/build environment, explicit multi-page/assets output manifest, exclude caches/docs/evidence from releases. Repository deletions or dependency updates need their own approved change.
- Risk: medium/high for packaging. Verify: clean isolated build includes all 14 pages/PDFs/SEO files, no audit/cache exposure, reproducible assets and staging regression. Status: open, Phase 3.

### A06 — Low / Accessibility — validator semantic warning needs confirmation

- Location: `clinical-supervision.html:200`, `ul.mm-supervision-refined__expertise[aria-label]`.
- Observed/evidence: html-validate 9.7.1 recommended preset reports `aria-label-misuse`; axe raises no matching violation. Do not equate this linter's model with demonstrated screen-reader failure.
- Criterion: 1.3.1/4.1.2 review. Fix: inspect semantics with current standards/assistive technology; prefer a visible section heading and `aria-labelledby` if grouping needs a name. Risk: low. Verify: accessibility tree and screen-reader list announcement. Status: review only, Phase 1.

### A07 — Low / Accessibility — desktop payment-block overflow

- Location: `css/milestone-home.min.css`, `.mm-payment-block` and its parent grid in `index.html` payment/scheduling section. URL: `/`, desktop 1440px.
- Observed/evidence: 69 of 70 width measurements matched the viewport; homepage at 1440 measured document width 1468. A dedicated settled-page test reproduced 1468 over several seconds and actual horizontal scrollX 28; three payment article right edges reached 1468. [Follow-up](evidence/overflow.json).
- Criterion: responsive/reflow and clipping review (1.4.10); this 1440px result does not itself establish a 320px reflow failure. No overflow measured at the narrower tested widths.
- Fix: inspect grid intrinsic sizing/min-width and child widths, apply the smallest component-level correction; do not hide overflow as a substitute for checking content. Risk: low/medium for grid layout. Verify: all five widths, actual zoom, long text/text spacing and payment content visibility. Status: confirmed desktop layout issue, Phase 1.

## Tests and evidence

| Check | Scope / result | Limit |
| --- | --- | --- |
| Repository inventory | All non-dependency source, assets, distribution; tracked Git/cache list separately inspected | No remote fetch or host filesystem access |
| axe-core 4.10.3 | 14 local pages × 390/1440, live home/PCIT × same widths; first open dialog | Not WCAG certification; incomplete checks retained |
| Playwright 1.51.1 / installed Chrome | 70 page-width reflow checks; skip/menu/dropdown/form constraints; 20 dialogs with completion-event waits | No physical touch, native screen reader, true browser zoom or complete visual regression |
| Lighthouse 12.5.1 | 6 reports: local home/PCIT and live home, mobile/desktop | Single runs; local audit server uncompressed; some audit tasks overlapped |
| HTML validation | html-validate 9.7.1 recommended preset, all 14 local documents | 358 lint errors: mostly formatting; see accessibility report; not Nu/W3C validator certification |
| Broken links | Local href/src file and HTML fragment graph: no broken targets after root URL normalization; 13 unique external link targets; both linked production PDFs | 403s need manual review; no authentication or form POST |
| Chrome DevTools coverage | Local homepage desktop, scroll + first dialog | No cross-page/state coverage union; never use alone for removal |
| Rich Results | Production URL test attempted in official tool | Tool returned “Something went wrong / Log in and try again”; no validation result; no JSON-LD locally |
| WAVE | Not run | No installed extension/API available; axe used |
| Screen reader / PDF checker | Not run | Interactive assistive-technology/PDF review outstanding |
| Search Console / GBP / analytics | Not accessed | No authenticated dataset supplied; no rankings, traffic, conversions, field INP or indexing claims |

Scripts are under [audit-tools](audit-tools/); raw JSON, source snapshots and screenshots under [evidence](evidence/). These are audit artifacts, not application runtime dependencies or a deployment package. Temporary audit packages were downloaded to npm's tool cache; project package files were unchanged. Headless Chrome required approved sandbox escalation.

The initial fixed-delay all-dialog run in `followup.json` is superseded by `focused-tests.json`, which waits for Bootstrap `shown.bs.modal`/`hidden.bs.modal` events on fresh pages. The initial zero-count validation using a standard-only configuration was replaced with the recommended ruleset; only the latter is reported. Final reconciliation found one width overflow among 70 checks: homepage desktop 1440→1468. A dedicated settled-page test confirmed actual horizontal scrolling; see A07. Earlier commentary that all widths fit was superseded by this evidence.

## Owner decisions and phase gate

Confirm new-client portal destination/policy, deployed document root and release mechanism, clinical/fee document currency, provider test workflow, and available Search Console/GBP/analytics access. Heather is preserved as MSW, LICSW and Michael as BA – Mental Health Intern Practitioner. Paige's scope/referral limitations were not changed. Legal applicability requires separate funding/entity/headcount review.

Approve **Phase 1 only** next: minimal contrast/link fixes, essential-content visibility safeguards, confirmed appointment routing, full manual keyboard/screen-reader/forms/zoom work. Later phases remain gated. No application changes, commits, deletion, pushes, merges or deployment were performed.

## Page inventory

Generated below from the current local source and browser evidence. URLs are under `https://www.milestonementalhealth.com`; production serves older content at all 14 paths. “No axe finding” describes tested states only. Full SEO proposals are in [technical SEO audit](technical-seo-audit.md).

<!-- PAGE_INVENTORY -->

| Page | URL | Purpose | CSS | JS | SEO status | Accessibility status | Performance issues | Conversion path |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 404.html | https://www.milestonementalhealth.com/404.html | Error recovery | css/milestone-home.min.css, css/milestone-404.css | Bootstrap + inline copyright | noindex, follow | No axe finding in default states; manual criteria open | No page LH; shared CSS | Home/contact recovery |
| career.html | https://www.milestonementalhealth.com/career.html | Professional recruitment | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| caregiver-coaching-and-consultation.html | https://www.milestonementalhealth.com/caregiver-coaching-and-consultation.html | Caregiver coaching/consultation | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| circle-of-security-parenting.html | https://www.milestonementalhealth.com/circle-of-security-parenting.html | Circle of Security Parenting information | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| clinical-supervision.html | https://www.milestonementalhealth.com/clinical-supervision.html | Professional clinical supervision | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| experiental-play-therapy.html | https://www.milestonementalhealth.com/experiental-play-therapy.html | Experiential play therapy information | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| eye-movement-densensitizaion-and-reprocessing.html | https://www.milestonementalhealth.com/eye-movement-densensitizaion-and-reprocessing.html | EMDR therapy information | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| form-submission-sucess.html | https://www.milestonementalhealth.com/form-submission-sucess.html | General-message confirmation endpoint | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | noindex, follow | No axe finding in default states; manual criteria open | No page LH; shared CSS | Home/services; provider routing unknown |
| index.html | https://www.milestonementalhealth.com/ | Practice discovery, services, clinicians, insurance, contact | css/milestone-home.min.css | Bootstrap, jQuery, AOS, theme, Modernizr, inline handlers | Canonical commented | No axe finding in default states; manual criteria open | Mobile LH 76; LCP 4.58s | Appointment anchors → general form; adjacent portal/phone |
| parent-child-interaction-therapy.html | https://www.milestonementalhealth.com/parent-child-interaction-therapy.html | PCIT information for caregivers | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | Mobile LH 71; LCP 9.64s; 1.27MB hero | Secure portal CTA; general contact/phone alternatives |
| social-emotional-skill-building.html | https://www.milestonementalhealth.com/social-emotional-skill-building.html | Social-emotional skill support | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| theraplay.html | https://www.milestonementalhealth.com/theraplay.html | Theraplay information for families | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| trauma-focused-cognitive-behavorial-therapy.html | https://www.milestonementalhealth.com/trauma-focused-cognitive-behavorial-therapy.html | Trauma-focused CBT information | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |
| trauma-informed-child-parent-psychotherapy.html | https://www.milestonementalhealth.com/trauma-informed-child-parent-psychotherapy.html | Child-parent psychotherapy information | css/milestone-home.min.css, css/milestone-pages.css | Bootstrap + inline copyright | Unique title/description/H1; active canonical | Contrast fails; manual criteria open | No page LH; hero lacks srcset; 220.5kB shared CSS | Secure portal CTA; general contact/phone alternatives |

<!-- END_PAGE_INVENTORY -->
