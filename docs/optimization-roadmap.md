# Controlled optimization roadmap and change log

October 27, 2026 baseline. **Phase 0 completed. Phase 1 is authorized; approved contrast fixes are implemented, including the owner-selected ivory/dark-blue PCIT support card.** Record: [PCIT implementation](phase1/pcit-card-review.md). Other Phase 1 checks remain open; later phases remain unapproved. Master evidence and complete finding records: [site audit](site-audit.md), [accessibility](accessibility-audit.md), [SEO](technical-seo-audit.md), [performance](performance-baseline.md).

## Safest implementation order

Keep the requested sequence: Phase 1 accessibility/functionality → Phase 2 technical/local SEO → Phase 3 CSS/JS/build → Phase 4 performance → Phase 5 UX/conversion → Phase 6 full validation → Phase 7 release readiness. Regression checks run within every phase; Phase 6 is the final combined pass. Do not bundle later phases into an approval for Phase 1. Confirm release provenance and appointment facts early, but change hosting/integrations only with explicit approval.

| Phase | Authorized state | Proposed work / finding IDs | Expected impact | Complexity | Exit evidence |
| --- | --- | --- | --- | --- | --- |
| 0 | Complete, documentation only | Inventory, baseline, findings, roadmap | Establish trustworthy source/live distinction | Medium | Five reports, complete file/page/image inventories, raw test artifacts and explicit gaps |
| 1 | Authorized; contrast corrections implemented | A01/A02 appearance approved and applied; A03 essential content fallback; C01 retain webform destination per owner and review conflicting copy; A04/A05/A06/A07 manual form/PDF/semantics/layout checks; full keyboard/screen reader/zoom review | High: readable text and reliable contact/intake access | Medium; third-party/manual work may require owner access | All affected pages/widths/states, axe, keyboard, native screen reader, zoom, provider outcomes; log remaining external barriers |
| 2 | Not approved | S01 canonicals/URL plan; S02 historical output handling plan; S03 sitemap; S04 links; S05 truthful schema/social tags; clinical/GBP/Search Console review | High discovery/trust potential; no ranking guarantee | Medium; redirects need hosting owner | Raw response chains, crawl graph, metadata/schema validation, owner-approved factual matrix |
| 3 | Not approved | P02/M01/M02 source/bundle mapping, supported tooling, safe duplicate cleanup, dependency consumers and multi-page package | Medium maintenance/render-path potential | Medium-high; purge risk high | Reproducible isolated complete build, cross-page/state coverage union and visual/accessibility regressions |
| 4 | Not approved | P01 responsive interior photos, P03 staged production payloads; actual critical path/font/cache work | High on image-heavy mobile pages | Medium | ≥3 consistent before/after samples per scenario, medians/range, screenshots/currentSrc; field CWV when available |
| 5 | Not approved | Calm navigation/service/therapist/insurance journey; refine C01 beyond essential functional correction; general-question path preserved | Potential qualified inquiry improvement; magnitude unknown | Low-medium | Owner review, privacy-safe funnel definitions and measured outcomes if data exists |
| 6 | Not approved | Full combined regression and final consistent Lighthouse runs | Confidence against regressions | Medium | All pages and five widths, keyboard/screen reader, forms, links, server status, metadata, console/resources and visual review |
| 7 | Not approved | Final release checklist/manifest and handoff | Prevent partial/broken release | Medium coordination | Reviewable release package + checklist, outstanding-risk acceptance; separate explicit deploy/commit approval |

## Item-level priority, impact, and complexity

Effort bands are rough planning estimates after approval, not promises: S = up to half a day, M = roughly 1–2 days, L = several days or external coordination. Manual assistive-technology and provider access can add elapsed time.

| Priority | Item | Benefit / impact estimate | Effort | Change risk / dependency | Phase |
| --- | --- | --- | --- | --- | --- |
| 1 | A01 blue-card text contrast | High; affects all 11 local substantive interiors | S–M | Shared colors must be tested after compositing | 1 |
| 1 | A02 missing interior link color | High; 1.23:1 text becomes readable | S | Scoped component fix safer than another CSS purge | 1 |
| 1 | C01 appointment destination | High task clarity; no quantified conversion lift | S–M | Rachel must confirm new-client route; secure integrations preserved | 1 |
| 1 | D01 release provenance | High release-risk reduction | M | Hosting owner/source directory unknown; no deployment authorized | Discovery now, implementation at approved release |
| 1 | S01/S02 canonical/duplicate URL plan | High consolidation potential | M | Requires actual hosting/backlink/indexing context | 2 |
| 1 | P01 PCIT/other hero sizing | High mobile byte/LCP potential | M | Natural image clarity/crop must be preserved | 4 |
| 2 | A03 animation visibility fallback | Medium robustness, supports contact path during script failure | S | Keep palette/layout and no-script behavior | 1 |
| 2 | A04 form/screen reader/zoom outcomes | High confidence in critical workflow | M–L | Provider test workflow and owner-controlled synthetic submission | 1 |
| 2 | A05 public PDFs | Unknown barriers; important policy/fee access | M | Requires PDF tools and owner-approved facts | 1 |
| 2 | S03 sitemap | Medium crawl/discovery hygiene | S | Align preferred URLs and genuine modification dates | 2 |
| 2 | S04 CPP link / profile links | Medium user trust/navigation | S | Choose official clinically suitable replacement | 2 |
| 2 | S06 play-therapy incoming link | Medium findability; currently sitemap-discoverable but absent from redesigned navigation graph | S | Rachel confirms availability and suitable context | 2 |
| 2 | S05 schema/social metadata | Medium local clarity/sharing potential | M | Confirm business facts; no ratings invented | 2 |
| 2 | P02/M01 shared CSS/dependencies | Medium maintainability; savings not guaranteed | M–L | Broad removal is high risk; A02 warns against homepage-only analysis | 3 |
| 2 | M02 build/release manifest | High future consistency | M | Explicit all-pages/assets build and supported runtime | 3 |
| 2 | P03 live originals/widget | High mobile payload potential | M–L | Production widget remains active; route approval prerequisite | 4/release |
| 3 | A06 list naming review | Low, uncertain actual barrier | S | Validate with current semantics/assistive technology first | 1 |
| 3 | A07 desktop payment layout overflow | Low; remove confirmed 28px horizontal scrolling | S | Component grid sizing fix with five-width/zoom checks | 1 |
| 3 | Fonts and dead configuration | Modest possible bytes/maintenance reduction | S–M | Typography/consumer checks; no visual changes solely for scores | 3–4 |

## Quick wins after their phase approval

Phase 1: minimally correct the blue-card composite background/text combinations; restore a scoped readable color for PCIT/EMDR resource links; keep essential contact content visible when AOS cannot initialize. These are small and reviewable, but still need shared-page and interaction verification.

Phase 2: activate the homepage canonical, align the sitemap and add clinical supervision, verify/replace the CPP families resource 404, retain improved local metadata. Redirects and public `dist` behavior require separate hosting context; no rename shortcut is recommended.

Phase 4: size PCIT hero variants first because the 1.27MB/3,712px mismatch is directly measured. Preserve current q-90 exceptions and natural photography; no blanket compression or e-sharpen.

## High-risk work to isolate

- Purging CSS from a single homepage scan: interior `.text-white` styling is already absent from the homepage-only bundle. Never delete based on reported unused percentages.
- Changing new-client CTA routing or removing production SimplePractice/Kwes/reCAPTCHA scripts before confirming actual practice operations and provider behavior.
- Renaming legacy typo URLs, altering the preferred hostname, deleting/excluding public `dist`, or changing server error/redirect rules without a tested map and host access.
- Rebuilding into tracked historical `dist` without isolated output and a complete page/PDF/SEO-file manifest.
- Removing `styles.css` because redesigned HTML does not link it; it is currently active on production.
- Rewriting clinical descriptions, provider scope, fees, insurance participation, availability or policies without Rachel's approval.
- Assuming a native constraint-validation check proves accessible hosted success/error handling, or that a Lighthouse/axe result proves legal compliance.

## Evidence required before treating cleanup as safe

Classify files by source, current local consumer, live consumer, build output and historical role. Map CSS/JS imports, CSS URLs, ImageKit source mirrors, dynamic classes and provider-generated states. Record selector/dependency deletion evidence including every relevant page, five widths, open/closed menus/dialogs, focus/hover/error/success states, reduced motion and no-script fallback. Confirm cascade/media context before removing exact repeated rules. Preserve readable source and a reproducible generation command. No unused asset or dependency deletion is authorized in Phase 0.

## Owner decisions and external access

| Decision / access | Why needed | Dependent work |
| --- | --- | --- |
| Appointment destination confirmed: existing webform for now; secure new-client portal later | Preserve destination and privacy restrictions; conflicting appointment/general-inquiry wording still needs a reviewable clarification | Phase 1 C01; no portal routing change authorized |
| Host document root, deployment owner/tool, intended public directories | Live design differs; new CSS absent; historical dist public | Staging, redirects, release |
| Controlled provider/mailbox test workflow | Confirm error/success, delivery, redirects without patient information | Phase 1 A04 |
| Rachel's clinical/insurance/fee/policy approval | Preserve accurate scope, credentials and service availability | Content/PDF/schema/SEO work |
| Screen-reader and PDF review capability | Complete evidence beyond automated scans | Phase 1 and final validation |
| Read-only Search Console/GBP/analytics exports if available | Actual queries, indexing, field CWV and conversion baseline | Phase 2/4/5 measurement |
| Funding/entity/headcount facts and qualified legal review | Section 504/ADA applicability cannot be inferred from insurance text | Legal determination outside code scan |

## Validation and release checklist template

For each approved phase record: summary, changed files, before/after behavior, exact tests, verified results, unresolved issues/third-party limits, owner decisions, next recommended gated phase. Maintain finding IDs/statuses and avoid calling untested checks passed.

- [ ] Confirm only approved phase files/behavior changed; review Git diff and preserve existing Heather credential edit.
- [ ] All affected pages at 320, 375/390, 768, 1024 and 1440; visual review and image-quality approval.
- [ ] Keyboard/tab/reverse tab/Enter/Space/Escape, visible unobscured focus, skip navigation, menus, all dialogs and secure/general contact paths.
- [ ] Native screen reader, actual 200%/400% browser zoom, text-spacing, reduced motion and script/CDN-failure behavior.
- [ ] Form errors/success/provider response/delivery using synthetic non-health data, owner-controlled route; no PHI capture/tracking.
- [ ] PDFs, alt decisions, headings/landmarks, contrast and focus states; residual accessibility and third-party issues recorded separately.
- [ ] Internal/external links, fragments, redirects, raw response codes, real and nested 404, missing CSS/JS/images and console errors.
- [ ] Titles/descriptions/canonical URLs, noindex endpoints, sitemap/robots, truthful schema validation, post-release Search Console work listed.
- [ ] Release contains complete HTML/CSS/JS/assets/PDF/SEO files; excludes audit docs/evidence, caches and unintended historical build/source maps.
- [ ] Compression/caching/security-header/provider configuration reviewed on actual staged host, no unsupported compliance claims.
- [ ] Performance before/after under identical conditions, ≥3 final runs and median/range; field CWV remains separate.
- [ ] Privacy notices, clinical and business facts approved; no new tracking or altered secure integration without explicit authorization.
- [ ] Explicit approval before commit, push, merge, deployment, deletion, or production integration changes.

## Change log

| Date | Phase | Changes | Validation / remaining issues |
| --- | --- | --- | --- |
| 2026-10-27 | 0 | Added five audit reports plus inventories, scripts and evidence under docs/; application source untouched | 14-page inventory/validation, 28 local axe scans + 4 live sample scans, 70 width checks, 20 event-based dialog keyboard samples, 6 Lighthouse runs, HTTP/link checks, partial coverage. Native screen reader, true zoom, PDF checks and provider outcomes remain open. No commits/push/deploy/deletions |
| Current checkpoint | 1 — contrast preview | Added review-only CSS, actual-page comparisons, interactive preview, and 56 current/proposed axe scans; no application color changes | All 11 affected pages clear tested contrast findings with draft CSS at both widths. Owner requested visual approval before implementation. Existing webform destination retained by owner direction. Phase 1 incomplete. |
| Follow-up checkpoint | 1 — approved contrast fixes and PCIT options | Applied approved resource-link/focus rules and other-card tints in milestone-pages.css; left PCIT card surface unchanged; prepared three PCIT alternatives | 28 applied-page scans: only pending PCIT card has detected contrast failures. 8 option/reference scans: all three alternatives clear selected axe checks at both widths; original reference fails as expected. Phase 1 remains incomplete. |
| Ivory selection | 1 — PCIT card applied | Integrated the selected ivory surface, dark blue text/link states and dark focus outline into milestone-pages.css | Applied-source checks at all five widths; remaining Phase 1 findings/manual checks still open. No commit or deployment. |

**Contrast appearance approval is complete. Continue the remaining authorized Phase 1 work; subsequent phases and deployment remain gated.**
