// Builds the booklet from src/pages.mjs into a PDF (+ PNG previews with --png).
// Fails if any page's content runs into the footer or past the right margin.
//
// Usage:
//   node build.mjs [out.pdf] [--png]            whole booklet (default out: booklet.pdf, previews in preview/)
//   node build.mjs --lesson 5 [--png]           one lesson, numbered as in the booklet -> build/lesson05/
//   node build.mjs --review [--png]             the chapter review -> build/review/
//   node build.mjs --answers [--png]            the answers pages -> build/answers/
// Run with NODE_PATH=$(npm root -g) so Playwright is found.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const { SECTIONS, PAGES, CSS } = await import(pathToFileURL(join(here, 'src/pages.mjs')));
const { FOOTER } = await import(pathToFileURL(join(here, 'src/parts.mjs')));
const { LESSONS, REVIEW_PAGE, ANSWERS_PAGE } = await import(pathToFileURL(join(here, 'src/meta.mjs')));

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const lessonArg = args.includes('--lesson') ? Number(args[args.indexOf('--lesson') + 1]) : null;

// Pick the pages to build and the booklet page number of the first one
let pages = PAGES, firstNum = 1, name = 'booklet', outDir = here, previewDir = join(here, 'preview');
if (lessonArg) {
  pages = SECTIONS.lessons[lessonArg - 1];
  firstNum = LESSONS[lessonArg - 1].start;
  name = `lesson${String(lessonArg).padStart(2, '0')}`;
} else if (flag('--review')) {
  pages = SECTIONS.review; firstNum = REVIEW_PAGE; name = 'review';
} else if (flag('--answers')) {
  pages = SECTIONS.answers; firstNum = ANSWERS_PAGE; name = 'answers';
}
if (name !== 'booklet') { outDir = join(here, 'build', name); previewDir = outDir; }
const out = resolve(args.find((a) => a.endsWith('.pdf')) || join(outDir, `${name}.pdf`));
mkdirSync(dirname(out), { recursive: true });

const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8">
<title>Ratios and rates: Chapter 1 key ideas and review</title>
<link rel="stylesheet" href="styles.css">
<style>${CSS}</style></head>
<body>
${pages.map((p, i) => `<section class="page ${p.cls || ''}">${p.html}
${p.footer === false ? '' : `<div class="foot"><span>${FOOTER}</span><span class="pg">${firstNum + i}</span></div>`}</section>`).join('\n')}
</body></html>`;
// The HTML lives in src/ so the relative font, image and stylesheet paths resolve
const htmlPath = join(here, 'src', name === 'booklet' ? 'booklet.html' : `_${name}.html`);
writeFileSync(htmlPath, html);

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Overflow check: content must stay about 5 mm clear of the footer (18 mm from the page bottom)
// and inside the 15 mm side margins.
const problems = await page.evaluate((firstNum) => {
  const mm = 96 / 25.4;
  return [...document.querySelectorAll('.page')].flatMap((pg, i) => {
    if (pg.classList.contains('cover')) return [];
    const box = pg.getBoundingClientRect();
    const bottom = box.bottom - 18 * mm, right = box.right - 15 * mm + 0.5 * mm;
    let worstB = 0, whoB = '', worstR = 0, whoR = '';
    pg.querySelectorAll('*').forEach((el) => {
      if (el.closest('.foot')) return;
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) return;
      if (b.bottom > bottom + 0.5 && b.bottom - bottom > worstB) { worstB = b.bottom - bottom; whoB = el.className || el.tagName; }
      if (b.right > right && b.right - right > worstR) { worstR = b.right - right; whoR = el.className || el.tagName; }
    });
    const n = firstNum + i, msgs = [];
    if (worstB) msgs.push(`page ${n}: runs into the footer by ${(worstB / mm).toFixed(1)} mm (${whoB})`);
    if (worstR) msgs.push(`page ${n}: runs past the right margin by ${(worstR / mm).toFixed(1)} mm (${whoR})`);
    return msgs;
  });
}, firstNum);

await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });

if (flag('--png')) {
  mkdirSync(previewDir, { recursive: true });
  if (name === 'booklet') { rmSync(previewDir, { recursive: true, force: true }); mkdirSync(previewDir); }
  const n = await page.locator('.page').count();
  for (let i = 0; i < n; i++) {
    await page.locator('.page').nth(i).screenshot({ path: join(previewDir, `page-${String(firstNum + i).padStart(2, '0')}.png`) });
  }
}
await browser.close();

console.log(`wrote ${out} (${pages.length} pages, numbered from ${firstNum})`);
if (problems.length) { console.log('OVERFLOW:\n' + problems.join('\n')); process.exitCode = 1; }
else console.log('no overflow');
