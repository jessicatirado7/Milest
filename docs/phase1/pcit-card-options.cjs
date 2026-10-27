// PCIT appearance choices are injected for review only; site CSS is not edited.
const fs = require('fs');
const path = require('path');
const modules = process.env.AUDIT_TOOL_MODULES || 'C:/Users/alaba/AppData/Local/npm-cache/_npx/4f3a81969a4b9f91/node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const out = path.join(__dirname, 'evidence');
const root = path.resolve(__dirname, '../..');
const scope = 'body.mm-interior-page main .mm-ses-blue[aria-labelledby="pcit-timeline-heading"] .mm-ses-blue__card[aria-labelledby="pcit-at-glance-heading"]';
const choices = [
  { id: 'original', title: 'Original muted blue', note: 'Reference — existing body contrast 4.23:1', css: '' },
  { id: 'ivory', title: 'Ivory · recommended', note: 'Dark blue text · 10.55:1', background: '#f7f5ef', color: '#283c46' },
  { id: 'pale-blue', title: 'Pale blue', note: 'Dark blue text · 10.07:1', background: '#eaf1f4', color: '#283c46' },
  { id: 'muted-blue', title: 'Muted blue + white text', note: 'Closest to original · 4.86:1', background: '#5b7583', color: '#ffffff' },
];
for (const c of choices) if (c.background) {
  c.css = `${scope} { background: ${c.background}; color: ${c.color}; }
${scope} :is(h3, p, strong, a) { color: ${c.color}; }
${scope} a:is(:visited, :hover, :focus, :active) { color: ${c.color}; }
${scope} a:focus-visible { outline: 3px solid ${c.color}; outline-offset: 4px; }
`;
  fs.writeFileSync(path.join(__dirname, `pcit-${c.id}-proposal.css`), '/* REVIEW ONLY — not loaded by application pages. */\n' + c.css);
}
fs.writeFileSync(path.join(__dirname, 'pcit-options-data.json'), JSON.stringify(choices.map(({ css, ...c }) => c), null, 2));
async function scan(page) {
  await page.evaluate(fs.readFileSync(path.join(modules, 'axe-core/axe.min.js'), 'utf8'));
  return page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] } }); return { violations: r.violations, incomplete: r.incomplete.map(x => ({id:x.id,nodes:x.nodes.length})) }; });
}
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  if (process.argv.includes('--verify-applied')) {
    const report = { timestamp: new Date().toISOString(), appliedStylesOnly: true, results: [] };
    for (const width of [320, 390, 768, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/parent-child-interaction-therapy.html', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const card = page.locator('.mm-ses-blue__card');
      const appearance = await card.evaluate(e => ({ background: getComputedStyle(e).backgroundColor, colors: [...e.querySelectorAll('h3,p,strong,a')].map(x => getComputedStyle(x).color), sectionBackground: getComputedStyle(e.closest('.mm-ses-blue')).backgroundColor, viewport: innerWidth, pageWidth: document.documentElement.scrollWidth }));
      const a11y = await scan(page);
      const link = card.locator('a'); await link.hover();
      const hover = await link.evaluate(e => ({ color: getComputedStyle(e).color, underline: getComputedStyle(e).textDecorationLine }));
      await page.mouse.move(0, 0); await page.keyboard.press('Tab'); await link.focus();
      const focus = await link.evaluate(e => ({ color: getComputedStyle(e).color, outline: getComputedStyle(e).outline, offset: getComputedStyle(e).outlineOffset }));
      if ([390,1440].includes(width)) await page.locator('.mm-ses-blue').screenshot({ path: path.join(out, `pcit-ivory-applied-${width}.png`) });
      const passed = appearance.background === 'rgb(247, 245, 239)' && appearance.colors.every(c=>c==='rgb(40, 60, 70)') && appearance.sectionBackground==='rgb(82, 111, 127)' && appearance.pageWidth<=width && hover.color==='rgb(40, 60, 70)' && hover.underline==='underline' && focus.outline==='rgb(40, 60, 70) solid 3px' && focus.offset==='4px' && a11y.violations.length===0 && errors.length===0;
      report.results.push({ width, appearance, a11y, hover, focus, errors, passed });
      console.log('applied ivory', width, passed ? 'PASS' : 'FAIL');
      await page.close();
    }
    fs.writeFileSync(path.join(out, 'pcit-ivory-applied-checks.json'), JSON.stringify(report, null, 2));
    await browser.close();
    if (report.results.some(r=>!r.passed)) process.exitCode=1;
    return;
  }
  if (process.argv.includes('--check-review')) {
    const saved = JSON.parse(fs.readFileSync(path.join(out, 'pcit-options-checks.json'), 'utf8'));
    saved.preview = [];
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto('http://127.0.0.1:4173/docs/phase1/pcit-card-options.html', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.getElementById('status').dataset.loaded === 'ivory');
      for (const choice of await page.locator('#choice option').evaluateAll(es => es.map(e => e.value))) {
        await page.selectOption('#choice', choice);
        await page.waitForFunction(key => document.getElementById('status').dataset.loaded === key, choice);
        saved.preview.push(await page.evaluate(({choice,width}) => { const doc = document.getElementById('section').contentDocument; const card = doc.querySelector('.mm-ses-blue__card'); return {choice,width,background:getComputedStyle(card).backgroundColor,color:getComputedStyle(card.querySelector('p')).color}; }, {choice,width}));
      }
      await page.close();
    }
    fs.writeFileSync(path.join(out, 'pcit-options-checks.json'), JSON.stringify(saved, null, 2));
    console.log(JSON.stringify(saved.preview));
    await browser.close(); return;
  }
  const results = { timestamp: new Date().toISOString(), chrome: await browser.version(), applied: [], options: [] };
  if (!process.argv.includes('--preview-only')) {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
        await page.goto('http://127.0.0.1:4173/' + file, { waitUntil: 'networkidle' });
        const a11y = await scan(page);
        results.applied.push({ file, width, a11y });
        console.log('applied', file, width, a11y.violations.map(v=>v.id).join(',') || 'none');
      }
      await page.close();
      fs.writeFileSync(path.join(out, 'pcit-options-checks.json'), JSON.stringify(results, null, 2));
    }
  }
  for (const [mode, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 390, height: 844 }]]) {
    for (const choice of choices) {
      const page = await browser.newPage({ viewport });
      const errors = []; page.on('pageerror', e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4173/parent-child-interaction-therapy.html', { waitUntil: 'networkidle' });
      if (choice.css) await page.addStyleTag({ content: choice.css });
      await page.evaluate(() => document.fonts.ready);
      const card = page.locator('.mm-ses-blue__card');
      await card.screenshot({ path: path.join(out, `pcit-${choice.id}-card-${mode}.png`) });
      await page.locator('.mm-ses-blue').screenshot({ path: path.join(out, `pcit-${choice.id}-section-${mode}.png`) });
      const a11y = await scan(page);
      const link = card.locator('a');
      await page.keyboard.press('Tab'); await link.focus();
      const focus = await link.evaluate(e => ({ color: getComputedStyle(e).color, outline: getComputedStyle(e).outline, offset: getComputedStyle(e).outlineOffset }));
      await link.hover();
      const hover = await link.evaluate(e => ({ color: getComputedStyle(e).color, underline: getComputedStyle(e).textDecorationLine }));
      results.options.push({ choice: choice.id, mode, a11y, focus, hover, errors, card: await card.evaluate(e => ({ background: getComputedStyle(e).backgroundColor, text: [...e.querySelectorAll('h3,p,strong,a')].map(x=>({tag:x.tagName,color:getComputedStyle(x).color})), width: e.getBoundingClientRect().width })) });
      await page.close();
      console.log('option', choice.id, mode, a11y.violations.map(v=>v.id).join(',') || 'none');
    }
  }
  const board = await browser.newPage({ viewport: { width: 1900, height: 1000 } });
  const cards = choices.map(c => `<figure><figcaption>${c.title}</figcaption><p>${c.note}</p><img src="data:image/png;base64,${fs.readFileSync(path.join(out, `pcit-${c.id}-card-desktop.png`)).toString('base64')}" alt="${c.title} card screenshot"></figure>`).join('');
  await board.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#f7f5ef;color:#283c46;font:18px/1.5 Arial,sans-serif}h1{font:34px Georgia,serif;margin:0 0 10px}p{margin:0 0 20px}main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}figure{margin:0;background:#fff;border:1px solid #c2cbc5;border-radius:12px;overflow:hidden}figcaption{font-size:21px;font-weight:bold;padding:15px 16px 4px}figure p{padding:0 16px;font-size:16px;min-height:48px}img{display:block;width:100%;height:auto}footer{margin-top:22px}</style><h1>Who PCIT supports — card options</h1><p>The original is shown for reference. All three alternatives meet the normal-text contrast minimum. Card layout and clinical wording are unchanged.</p><main>${cards}</main><footer>Ivory offers the clearest separation from the blue section. Muted blue with white text is closest to the original treatment. Alternative card styling remains pending your choice.</footer>`);
  await board.locator('body').screenshot({ path: path.join(out, 'pcit-card-options.png') });
  await board.close();
  fs.writeFileSync(path.join(out, 'pcit-options-checks.json'), JSON.stringify(results, null, 2));
  await browser.close();
})().catch(e=>{ console.error(e); process.exitCode=1; });
