# Performance baseline — Phase 0

October 27, 2026. No application changes. Complete finding records: **P01/P02/P03/M01/M02** in [site audit](site-audit.md#finding-register).

## Method and limits

Lighthouse 12.5.1 using installed headless Chrome, default mobile simulated throttling; desktop configured 1350×940, DPR 1, RTT 40ms, throughput 10,240 Kbps, CPU slowdown 1. Mobile screen and throttling settings, actual browser version/user agent, environment, fetch timestamps and warnings are retained in every JSON report. Browser interaction checks used 390×844 and 1440×1000 with additional five-width sweeps.

Local served through `http://127.0.0.1:4173/` using the audit-only static server. It intentionally has **no gzip/Brotli, production latency, CDN cache or long-lived cache configuration**. Live Apache serves gzip for sampled HTML/CSS. Local “enable compression/cache” opportunities describe this test server, not an established production defect. The redesigned local stylesheets do not exist on the live host; comparison is between different versions and hosting environments.

One run per URL/device, six total; these are **single samples, not medians or measured improvement**. Some browser audit activity overlapped; cache, network and CPU contention can affect values. The owner's historical 83–84/100 performance values are unverified references only. Phase 4 should repeat at least three isolated runs per representative scenario on equivalent staged hosting, report median and range, and compare visual results after each minimal change.

No field dataset, CrUX/Search Console CWV or RUM data was obtained. INP is **not measured**; TBT is a lab diagnostic and must not be substituted for INP. [Google's field thresholds](https://web.dev/articles/vitals) use the 75th percentile by device: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Mobile Lighthouse ≥90 remains an aspirational lab goal.

## Recorded results

<!-- LIGHTHOUSE_TABLE -->

| Environment/page | Mode | Perf / A11y / BP / SEO | FCP s | LCP s | TBT ms | CLS | Speed Index s | Transfer bytes | Request entries |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| local-home | mobile | 76 / 100 / 100 / 100 | 3.52 | 4.58 | 49 | 0.0189 | 3.52 | 605600 | 20 |
| local-home | desktop | 99 / 100 / 100 / 100 | 0.69 | 0.81 | 0 | 0.0020 | 0.69 | 694104 | 22 |
| local-pcit | mobile | 71 / 96 / 100 / 100 | 2.73 | 9.63 | 0 | 0.0008 | 2.73 | 1586234 | 10 |
| local-pcit | desktop | 92 / 96 / 100 / 100 | 0.80 | 1.80 | 0 | 0.0026 | 0.80 | 1579777 | 9 |
| live-home | mobile | 60 / 95 / 79 / 92 | 3.74 | 6.71 | 346 | 0.0261 | 3.74 | 22605614 | 91 |
| live-home | desktop | 90 / 94 / 78 / 92 | 1.20 | 1.76 | 0 | 0.0259 | 1.20 | 22591028 | 90 |

<!-- END_LIGHTHOUSE_TABLE -->

Full reports: [local home mobile](evidence/lighthouse-local-home-mobile.json), [desktop](evidence/lighthouse-local-home-desktop.json); [local PCIT mobile](evidence/lighthouse-local-pcit-mobile.json), [desktop](evidence/lighthouse-local-pcit-desktop.json); [live home mobile](evidence/lighthouse-live-home-mobile.json), [desktop](evidence/lighthouse-live-home-desktop.json). [Summary with configurations](evidence/lighthouse-summary.json).

Transfer totals are Lighthouse's byte-weight audit values; counts are network-request audit entries. Lazy loading means these are not total bytes for every photo after fully scrolling the page. Cross-origin browser Resource Timing may show transferSize 0 without timing permission; it does not prove no transfer.

## Bottlenecks and safest remedies

| ID / bottleneck | Measured evidence | Recommended change | Impact / complexity / risk |
| --- | --- | --- | --- |
| P01 PCIT hero original | 1,266,700 bytes, natural width 3,712, about 329 CSS px at 390 viewport, no srcset/sizes; mobile LCP 9.64s | ImageKit width variants with exact layout-aware sizes; retain quality; reserve dimensions | High potential impact / medium / medium visual risk |
| P01 Other interior originals | All 11 service/career hero img tags lack srcset; several local originals and JPGs | Measure each currentSrc/geometry, introduce appropriately sized variants incrementally | Likely high on image-heavy pages / medium / medium |
| P02 Interior CSS | 89,554 + 130,953 bytes uncompressed; PCIT approximately 187KiB estimated unused CSS | Document sources/build; inspect shared rules across all pages before consolidation | Medium / medium-high / high if purged blindly |
| P03 Published older site | Mobile 22,605,614 bytes, 91 request entries, LCP 6.71s, TBT 346ms | Validate full redesigned release with correct new-client routing before any eventual publishing | High potential / high coordination / high integration risk |
| Homepage delivery | Local FCP 3.52s/LCP 4.58s, render-path CSS/font and responsive photo work remains | Repeat under production-like compression, inspect critical path and actual LCP candidate before preload or CSS changes | Medium / medium / low-medium |
| Font requests | Source Sans 3 normal/italic variable ranges, display=swap and preconnects already present; serif fallbacks | Verify actually used weights/italics and visual changes before reducing requests; do not add Lora solely for a fallback declaration | Low-medium / low-medium / typography risk |
| Legacy JS | Local script 1,018 bytes; Modernizr 4,461; jQuery/AOS/Bootstrap delivered externally | Check consumers before retiring a dependency; preserve collapse/modal/AOS failure behavior | Modest local CPU potential / medium / medium-high |

Live mobile largest requests include Familytherapy.webp ≈3.10MB, local kidsonthecomputer.webp ≈2.75MB, Momhuggingchild.webp ≈2.01MB, Kidsatplay.webp ≈1.93MB, family.webp ≈1.80MB, and a SimplePractice chunk ≈1.58MB. All are actual Lighthouse network entries. Widget removal has already happened in redesigned HTML but **has not happened on the live site**. Do not change an active secure integration without separate approval.

Homepage responsive-photo delivery is already substantially improved locally: srcset/sizes, lazy loading, deliberate high-quality q-90 exceptions, reserved portrait geometry, and existing preconnects. Selected Lighthouse image savings estimates concern image geometry/cropping; do not treat them as a mandate to lower quality. No e-sharpen or blanket recompression is proposed. Source blur requires source replacement review, not artificial sharpening.

## Coverage and cleanup evidence

[coverage.json](evidence/coverage.json) contains Chrome DevTools protocol CSS/JS coverage from a desktop local homepage reload, scroll and first dialog. Common CSS: 45,117 of 89,552 captured characters were exercised (about 50.4%). AOS CSS: 436 of 26,053 characters (about 1.7%). Font stylesheet coverage is not a reliable font-use metric. JavaScript coverage uses function/range execution data and is retained raw.

These percentages are **not safe deletion percentages**. Mobile navigation, 19 other dialogs, interior layouts, form/error states, focus/hover, no-script/reduced-motion and feature fallbacks are outside this coverage recording. The separate functional tests do not magically extend the recorded coverage union. A02 shows a homepage bundle can already omit an interior requirement.

Safest candidates: exact duplicate declaration review within identical cascade/media contexts, documented source-to-bundle generation, dead Partytown configuration after consumer checks, optional jQuery retirement after native Bootstrap replacement. Preserve Bootstrap grid/utility/modal/collapse/dropdown rules still used. Preserve `styles.css` because production still loads it. No CSS/JS file or selector was deleted.

## Production delivery checks

Sampled live HTML/CSS responses use gzip and Last-Modified; sampled headers do not show an explicit Cache-Control/Expires policy. This is insufficient to quantify repeat-visit caching or CDN behavior. DNS/TTFB, compression negotiation, host configuration, cache validation and response headers for redesigned assets need staging/hosting access. HTTP www redirects 301 to HTTPS; non-www HTTPS remains separate. Actual unknown live URL returns 404, which is correct.

Reflow/CLS: local sampled CLS is low (0.0008–0.0189). The five-width sweep had 69 matching width measurements and one 28px desktop homepage overflow; a settled-page rerun confirmed actual horizontal scrolling in the payment block layout (A07). Narrower tested widths matched. Low CLS does not certify absence of clipping or shifts from every below-fold image, dynamic embed or modal state. Initial default browser scans reported no JS exceptions/request errors; scroll-triggered resources and production third-party errors require dedicated follow-up.

## Phase 4 measurement contract

For each approved change: record exact URL/viewport/cache/throttling/configuration and at least three before runs; change one bottleneck; repeat after under matching conditions; compare median/range, selected image sizes, bytes and screenshots; retain only justified changes. Use an approved staged server with compression/caching, one browser workload at a time. Check all affected pages and the approved image quality at DPR 1/2/3 where relevant. Keep lab results separate from real-user CWV and avoid inferring conversion changes.

## Interior hero inventory

<!-- HERO_TABLE -->

| Page | Hero img src | Width/height attributes | Responsive img srcset | Browser evidence / action |
| --- | --- | --- | --- | --- |
| career.html | https://ik.imagekit.io/qjk625zh0/thumbnails/womenwithipad.jpg | absent / absent | absent | natural 5855px / rendered 329px at 390; measure variants and preserve crop/quality |
| caregiver-coaching-and-consultation.html | assets/img/portfolio/thumbnails/womanandgirl.jpg | absent / absent | absent | natural 7680px / rendered 329px at 390; measure variants and preserve crop/quality |
| circle-of-security-parenting.html | https://ik.imagekit.io/qjk625zh0/thumbnails/parentswithbaby.jpg | absent / absent | absent | natural 3200px / rendered 329px at 390; measure variants and preserve crop/quality |
| clinical-supervision.html | https://ik.imagekit.io/qjk625zh0/thumbnails/clinicalsupervision.jpg | absent / absent | absent | natural 2048px / rendered 329px at 390; measure variants and preserve crop/quality |
| experiental-play-therapy.html | https://ik.imagekit.io/qjk625zh0/thumbnails/boyplaying.jpg | 960 / 1120 | absent | natural 5616px / rendered 329px at 390; measure variants and preserve crop/quality |
| eye-movement-densensitizaion-and-reprocessing.html | assets/img/portfolio/thumbnails/happy%20girl.jpg | 2048 / 1365 | absent | natural 7680px / rendered 329px at 390; measure variants and preserve crop/quality |
| parent-child-interaction-therapy.html | https://ik.imagekit.io/qjk625zh0/thumbnails/Kidsrunning.webp | absent / absent | absent | natural 3712px / rendered 329px at 390; measure variants and preserve crop/quality |
| social-emotional-skill-building.html | https://ik.imagekit.io/qjk625zh0/thumbnails/happyfamily.jpg | 960 / 1120 | absent | natural 3990px / rendered 329px at 390; measure variants and preserve crop/quality |
| theraplay.html | assets/img/portfolio/thumbnails/motherplaying.jpg | absent / absent | absent | natural 7952px / rendered 329px at 390; measure variants and preserve crop/quality |
| trauma-focused-cognitive-behavorial-therapy.html | https://ik.imagekit.io/qjk625zh0/thumbnails/girlslayingdown.webp | absent / absent | absent | natural 4000px / rendered 329px at 390; measure variants and preserve crop/quality |
| trauma-informed-child-parent-psychotherapy.html | https://ik.imagekit.io/qjk625zh0/thumbnails/girlwithbigsmile.webp | absent / absent | absent | natural 1049px / rendered 329px at 390; measure variants and preserve crop/quality |

<!-- END_HERO_TABLE -->
