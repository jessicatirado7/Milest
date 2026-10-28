# Milestone Mental Health

Static HTML website. Preserve established `.html` URLs, clinical text, appointment/client-portal destinations and approved photography. No server-side Node application runs on HostGator.

`docs/` contains local audit/release records and is excluded from GitHub. Documentation links below refer to that local folder. Keep `tools/` in GitHub because the npm build, CSS and preview commands depend on it. Generated `build/` packages also stay local; the FileZilla upload folder is inside `build/release-6304cb7ceece9e2d/upload/`.

## Local development

Use **Node 24 LTS** and its npm. The project is validated with a checksum-verified portable Node 24.22.1; the machine's previous global Node 19 is unsupported and was not changed.

```text
npm ci --ignore-scripts
npm start
```

Source preview: `http://127.0.0.1:4175/`. Stop with Ctrl+C. This is a plain static preview; reload after changes. It binds only to loopback and returns the local custom document with a real 404 status on unknown paths. It does not simulate HostGator redirects, compression, PHP or provider delivery.

## CSS source

Edit `css/milestone-home.source.css`, then run:

```text
npm run css
```

This regenerates `css/milestone-home.min.css` through whitespace-only PostCSS serialization with a structural equivalence check. No selector purge, value rewrite or reordering occurs. `npm start` regenerates it before serving. `npm run css:check` checks that the generated file is current. The historical `.home.min.css` name is retained, but the file provides the foundation for 14 pages, not just the homepage.

`css/milestone-pages.css` is the active readable interior-page stylesheet. `css/milestone-404.css` is the active error-page stylesheet. Other component/reference CSS, `styles.css`, Modernizr files and `.parcelrc` remain for provenance and older live consumers. They are not sources for the new bundle or the active build; editing a reference stylesheet alone does not update the shared foundation.

Homepage contact-form styles are now in the readable shared source. The tiny keyboard skip-link style stays inline. The faithful standalone document readers retain their own inline CSS and no scripts.

## JavaScript

`js/navigation.js` handles the shared copyright year, mobile link-close behavior and Escape focus restoration for the existing Bootstrap dropdown. On the homepage it also coordinates same-page navigation with focus/menu closing and sizes payment photos for their actual cover footprint. Keyboard-style activations jump directly and focus the destination heading; trusted pointer clicks glide and focus after motion settles, unless reduced motion is requested. The heading lands below the sticky header even in short zoomed viewports. Further user activity cancels pending focus. The existing inline biography-to-form controller also checks heading visibility after closing the dialog, correcting its position only when necessary. `js/scripts.js` provides homepage navbar shrink and local form-error enhancements. Bootstrap 5.1.3 still provides menus, collapse and dialogs. Its pinned CDN/version and the existing portal/form integrations are retained. All four specialization text bodies are focusable named sections, allowing keyboard scrolling when content overflows.

jQuery, AOS and Modernizr are no longer loaded by the redesigned homepage. Current pages have no AOS triggers; every legacy WebP selector lacks a required layout class/ID in the current HTML. Native `picture`/`source`/`img` fallbacks remain. Legacy files are retained, not deleted.

## Responsive interior photos

Phase 4 adds width candidates to all 11 interior hero photos. Existing ImageKit sources use width-only, quality-90 transforms. The three photos without verified ImageKit mirrors use committed files under `assets/img/responsive/`; WebP and JPEG copies are generated separately from their respective originals. All original files remain intact. The regular build copies these finished assets without processing photographs or requiring an image library.

The `sizes` expressions follow the existing CSS layout and account for the full scaled image behind `object-fit: cover`. This preserves detail in portrait crops of landscape photos. If hero container/grid/gutter/aspect-ratio rules change, update and recheck `sizes` at all breakpoints and densities. Current candidates stop at original resolution; no sharpening/upscaling is applied. Homepage quality exceptions remain unchanged. [Measurement, reproduction and photo review](docs/phase4/review.md).

Owner-requested Phase 5 refinements give the three payment photos q90 delivery and larger width candidates. A `ResizeObserver` updates their native `sizes` for the actual image box/cover footprint, including the tall scheduling card; generous HTML fallbacks remain without JavaScript. Original image dimensions in the markup must match the source when replacing a photo. [Refinement measurements](docs/phase5/refinements.md).

## Build and preview

Phase 5 adds homepage shortcuts to team/fees information and service cards, plus precise specialization fragments shared by all primary menus. Keep `specialization-trauma`, `specialization-child`, `specialization-attachment`, `specialization-perinatal` and existing section/service IDs stable. Targets use `tabindex="-1"` and a scroll margin under the sticky header. After owner review, coordinated JavaScript restores the glide without the reproduced native focus/scroll race; `mm-home-page` keeps automatic focus/no-JS scrolling immediate. Reduced-motion requests receive immediate navigation. Form wording describes a non-confidential message and does not imply a booked appointment. [UX review](docs/phase5/review.md), [owner refinements](docs/phase5/refinements.md).

```text
npm run build
npm run preview
```

Build output is a new content-addressed folder, `build/site-<hash>/`. `build/latest.json` identifies the current package; `build-manifest.json` inside it lists all files, sizes and SHA-256 hashes. Equal inputs and pinned dependencies produce the same path/manifest. Existing packages are checked, not silently overwritten or deleted; an unexpected/modified file causes a clear error.

The package preserves all 16 HTML filenames and exact HTML bytes, both linked PDFs, robots/sitemap files, and the complete local HTML/CSS/metadata dependency closure. HTML is not rewritten, images are not recompressed, and PDFs are not changed. Absolute same-site logo references in social metadata/JSON-LD are included. External CDN resources remain external.

The output excludes audit documents/evidence, tools, node_modules, package/config files, readable CSS sources/references, source maps, historical `dist/` and the draft server configuration. The tracked historical `dist` folder is never overwritten. The manifest is a local integrity record, not evidence of a deployment or a final Phase 7 release sign-off.

`npm run preview -- --port 4180` uses an alternate port when needed. Phase 7 prepares the exact runtime-only folder at `build/release-6304cb7ceece9e2d/upload/` and equivalent `site-files.zip`, with integrity records beside them. [Release review](docs/phase7/release-checklist.md), [FileZilla upload/backup/rollback guide](docs/phase7/upload-guide.md). Upload approval and host-side backup/configuration checks remain pending; preparation does not publish the site. Keep the source/audit folders, historical dist, ZIPs and integrity records off the server. The reviewed `.htaccess` remains separate and requires its own host/configuration approval.

## Verification and follow-up

Current release handoff: [Phase 7 checklist](docs/phase7/release-checklist.md), [third-party limits and decisions](docs/phase7/third-party-and-decisions.md). Combined application evidence: [Phase 6 review](docs/phase6/review.md). [Phase 5 review](docs/phase5/review.md), [Phase 4 review](docs/phase4/review.md) and [Phase 3 review](docs/phase3/review.md) preserve their historical checkpoints. Prior accessibility/SEO owner questions remain in [owner notes](docs/owner-review-notes.md). No new analytics, account changes, real form submissions or publishing are part of the local build. Phase 7 preparation is authorized; execution is a separate decision.
