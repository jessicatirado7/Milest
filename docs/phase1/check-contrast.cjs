// Review-only contrast checks. Injects draft CSS in memory, never edits site pages.
const fs = require('fs');
const path = require('path');
const modules = process.env.AUDIT_TOOL_MODULES || 'C:/Users/alaba/AppData/Local/npm-cache/_npx/4f3a81969a4b9f91/node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const root = path.resolve(__dirname, '../..');
const out = path.join(__dirname, 'evidence');
fs.mkdirSync(out, { recursive: true });
const css = fs.readFileSync(path.join(__dirname, 'contrast-proposal.css'), 'utf8');
const axe = fs.readFileSync(path.join(modules, 'axe-core/axe.min.js'), 'utf8');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
async function scan(page) {
  await page.evaluate(axe);
  return page.evaluate(async () => {
    const result = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } });
    return { violations: result.violations, incomplete: result.incomplete.map(x => ({ id: x.id, nodes: x.nodes.length })) };
  });
}
async function colors(page) {
  return page.locator('.mm-ses-blue__card, .mm-ses-blue .mm-ses-body a, .mm-career-glance dt').evaluateAll(es => es.map(e => {
    const c = getComputedStyle(e);
    return { tag: e.tagName, classes: e.className, text: e.textContent.trim().slice(0, 70), color: c.color, background: c.backgroundColor, outline: c.outline, underline: c.textDecorationLine };
  }));
}
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const reviewOnly = process.argv.includes('--review-only');
  const report = reviewOnly ? JSON.parse(fs.readFileSync(path.join(out, 'contrast-checks.json'), 'utf8')) : { timestamp: new Date().toISOString(), chrome: await browser.version(), proposalOnly: true, pages: [], linkStates: [] };
  if (!reviewOnly) {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport });
    for (const file of pages) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      try {
        await page.goto('http://127.0.0.1:4173/' + file, { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => document.fonts.ready);
        const before = { a11y: await scan(page), colors: await colors(page) };
        await page.addStyleTag({ content: css });
        const after = { a11y: await scan(page), colors: await colors(page) };
        report.pages.push({ file, viewport, before, after, errors });
        console.log(file, viewport.width, before.a11y.violations.map(x => x.id).join(',') || 'none', '→', after.a11y.violations.map(x => x.id).join(',') || 'none');
      } catch (error) { report.pages.push({ file, viewport, error: error.message, errors }); }
      await page.close();
      fs.writeFileSync(path.join(out, 'contrast-checks.json'), JSON.stringify(report, null, 2));
    }
    await context.close();
  }
  for (const file of ['parent-child-interaction-therapy.html', 'eye-movement-densensitizaion-and-reprocessing.html']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto('http://127.0.0.1:4173/' + file, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: css });
    const link = page.locator('.mm-ses-blue .mm-ses-body a').first();
    const style = () => link.evaluate(e => { const c = getComputedStyle(e); return { color: c.color, underline: c.textDecorationLine, outline: c.outline, outlineOffset: c.outlineOffset, focused: e === document.activeElement }; });
    const normal = await style();
    await link.hover(); const hover = await style();
    await page.mouse.move(0, 0); await page.keyboard.press('Tab'); await link.focus(); const focus = await style();
    await page.mouse.move(...await link.evaluate(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
    await page.mouse.down(); const active = await style();
    // Navigate away before mouseup: no click or external navigation is triggered.
    await page.goto('about:blank'); await page.mouse.up();
    report.linkStates.push({ file, normal, hover, focus, active });
    await page.close();
  }
  }
  // Capture the actual section at native desktop/mobile widths, before and after.
  for (const [name, file] of [['pcit', 'parent-child-interaction-therapy.html'], ['careers', 'career.html']]) {
    for (const [mode, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport });
      await page.goto('http://127.0.0.1:4173/' + file, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator('.mm-ses-blue').first();
      await section.screenshot({ path: path.join(out, `${name}-current-${mode}.png`) });
      await page.addStyleTag({ content: css });
      await section.screenshot({ path: path.join(out, `${name}-proposed-${mode}.png`) });
      if (name === 'pcit' && mode === 'desktop') {
        await page.keyboard.press('Tab');
        await page.locator('.mm-ses-blue .mm-ses-body a').first().focus();
        await section.screenshot({ path: path.join(out, 'pcit-proposed-focus.png') });
      }
      await page.close();
    }
  }
  // Comparison boards use the real screenshots; no recreated clinical content.
  for (const [name, title] of [['pcit', 'PCIT — resource link and planning card'], ['careers', 'Careers — labels and values']]) {
    const page = await browser.newPage({ viewport: { width: 1900, height: 1200 }, deviceScaleFactor: 1 });
    const a = fs.readFileSync(path.join(out, `${name}-current-desktop.png`)).toString('base64');
    const b = fs.readFileSync(path.join(out, `${name}-proposed-desktop.png`)).toString('base64');
    await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#f7f5ef;color:#283c46;font:20px/1.4 Arial,sans-serif}h1{margin:0 0 8px;font:32px Georgia,serif}p{margin:0 0 20px}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;background:white;border:1px solid #c2cbc5;border-radius:12px;overflow:hidden}figcaption{padding:14px 18px;font-weight:bold}img{display:block;width:100%;height:auto}footer{margin-top:18px}</style><h1>${title}</h1><p>Review-only proposal. The website's stylesheets have not been changed.</p><main><figure><figcaption>Current</figcaption><img src="data:image/png;base64,${a}" alt="Current blue section"></figure><figure><figcaption>Proposed</figcaption><img src="data:image/png;base64,${b}" alt="Proposed contrast correction"></figure></main><footer>Same section blue, typography and layout. Darker card tint; resource link becomes white and underlined.</footer>`);
    await page.locator('body').screenshot({ path: path.join(out, `${name}-comparison.png`) });
    await page.close();
  }
  const review = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await review.goto('http://127.0.0.1:4173/docs/phase1/contrast-preview.html', { waitUntil: 'networkidle' });
  await review.waitForFunction(() => document.getElementById('after-status').textContent.startsWith('Proposal loaded'));
  report.preview = { current: await review.locator('#before-status').innerText(), proposed: await review.locator('#after-status').innerText() };
  report.preview.pages = [];
  for (const file of await review.locator('#page option').evaluateAll(es => es.map(e => e.value))) {
    await review.selectOption('#page', file);
    await review.waitForFunction(() => document.getElementById('after-status').textContent.startsWith('Proposal loaded') && document.getElementById('before-status').textContent.startsWith('Current site'));
    report.preview.pages.push(await review.evaluate(() => ({ file: document.getElementById('page').value, before: getComputedStyle(document.getElementById('before').contentDocument.querySelector('.mm-ses-blue__card')).backgroundColor, after: getComputedStyle(document.getElementById('after').contentDocument.querySelector('.mm-ses-blue__card')).backgroundColor })));
  }
  await review.close();
  fs.writeFileSync(path.join(out, 'contrast-checks.json'), JSON.stringify(report, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
