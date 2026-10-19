// Builds the booklet: src/pages.mjs -> src/booklet.html -> PDF (+ PNG previews with --png).
// Fails if any page's content runs into the footer.
// Usage: node build.mjs [output.pdf] [--png]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const { PAGES } = await import(pathToFileURL(join(here, 'src/pages.mjs')));
const { FOOTER } = await import(pathToFileURL(join(here, 'src/parts.mjs')));

const args = process.argv.slice(2);
const out = resolve(args.find((a) => a.endsWith('.pdf')) || join(here, 'booklet.pdf'));
const wantPng = args.includes('--png');

const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8">
<title>Ratios and rates: Chapter 1 key ideas and review</title>
<link rel="stylesheet" href="styles.css"></head>
<body>
${PAGES.map((p, i) => `<section class="page ${p.cls || ''}">${p.html}
${p.footer === false ? '' : `<div class="foot"><span>${FOOTER}</span><span class="pg">${i + 1}</span></div>`}</section>`).join('\n')}
</body></html>`;
const htmlPath = join(here, 'src/booklet.html');
writeFileSync(htmlPath, html);

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Overflow check: content must stay about 5 mm clear of the footer (18 mm from the page bottom).
const problems = await page.evaluate(() => {
  const mm = 96 / 25.4;
  return [...document.querySelectorAll('.page')].flatMap((pg, i) => {
    if (pg.classList.contains('cover')) return [];
    const limit = pg.getBoundingClientRect().bottom - 19 * mm + 1 * mm;
    let worst = 0, who = '';
    pg.querySelectorAll('*').forEach((el) => {
      if (el.closest('.foot')) return;
      const b = el.getBoundingClientRect().bottom;
      if (b > limit + 0.5 && b - limit > worst) { worst = b - limit; who = el.className || el.tagName; }
    });
    return worst ? [`page ${i + 1}: overflows by ${(worst / mm).toFixed(1)} mm (${who})`] : [];
  });
});
const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.family + ' ' + f.weight));

await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });

if (wantPng) {
  const dir = join(here, 'preview');
  mkdirSync(dir, { recursive: true });
  const n = await page.locator('.page').count();
  for (let i = 0; i < n; i++) {
    await page.locator('.page').nth(i).screenshot({ path: join(dir, `page-${String(i + 1).padStart(2, '0')}.png`) });
  }
}
await browser.close();

console.log(`wrote ${out} (${PAGES.length} pages)`);
if (fonts.length) console.log('fonts not loaded (unused is fine):', fonts.join(', '));
if (problems.length) { console.log('OVERFLOW:\n' + problems.join('\n')); process.exitCode = 1; }
else console.log('no overflow');
