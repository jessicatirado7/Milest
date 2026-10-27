# Reproducing the Phase 0 baseline

These scripts write only `docs/` audit artifacts. They are not application code or production dependencies. Do not publish docs/evidence snapshots or the audit server.

The audit used installed Chrome 156.0.8078.48, Node 19.1.0, Playwright 1.51.1, axe-core 4.10.3, Lighthouse 12.5.1, and html-validate 9.7.1. Node 19 caused engine-support warnings; use a supported current Node release for future reproducible runs, and record the changed environment. Audit packages were installed temporarily through npm exec, without changing package.json/lockfile:

```powershell
npm exec --yes --package=playwright@1.51.1 --package=@axe-core/playwright@4.10.2 --package=lighthouse@12.5.1 --package=html-validate@9.7.1 -- playwright --version
```

Set `AUDIT_TOOL_MODULES` to that temporary install's node_modules folder if it differs from the recorded default path in the scripts. The scripts use the installed Windows Chrome path; adjust it only in audit tooling for another host. htmlparser2/postcss come from existing project node_modules.

From repository root, in separate terminals as needed:

```powershell
node docs/audit-tools/inventory.cjs
node docs/audit-tools/server.cjs
```

With the local server listening on 127.0.0.1:4173, run checks. For comparable performance runs, close competing browser workloads; Phase 0 included overlapping audit activity and only one sample per scenario.

```powershell
node docs/audit-tools/live.cjs
node docs/audit-tools/validate.cjs
node docs/audit-tools/browser.cjs
node docs/audit-tools/followup.cjs
node docs/audit-tools/focused-tests.cjs
node docs/audit-tools/focused-tests.cjs --rich-results
node docs/audit-tools/focused-tests.cjs --overflow
node docs/audit-tools/lighthouse.mjs
node docs/audit-tools/assemble.cjs
```

`focused-tests.json` is authoritative for dialogs, because it uses Bootstrap completion events and fresh pages. The older fixed-delay dialog checks in followup.json are preserved as superseded evidence. followup.json remains the source for all-page five-width checks and explicit redirect/PDF responses. Rich Results failed with Google's “Log in and try again” message; that is not a validation result. Scripts do not submit the site's contact form or enter patient information, authenticate to the portal, install tracking, run the application build, or deploy anything.

`assemble.cjs` refreshes generated tables between markers and the full file inventory, and preserves hand-written findings. Keep manual narrative synchronized with any new evidence. Stop the local audit server when finished. Never run package build into tracked historical dist during an audit without an approved isolated output plan.
