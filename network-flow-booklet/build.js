// Builds the Network Flow lesson booklet: node build.js
// Output: out/<NAME>.pdf (cover and contents, 10 lessons, short answer key at the back)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { lessonHtml, answersHtml } = require('./lib/render');
const front = require('./lib/front');

const NAME = 'Yr12_Std2_Network_Flow_Lesson_Booklet';
const OUT = path.join(__dirname, 'out');
const lessons = fs.readdirSync(path.join(__dirname, 'content')).filter((f) => /^l\d\d\.js$/.test(f)).sort()
  .map((f) => require(`./content/${f}`));

const font = (w) => `data:font/woff2;base64,${fs.readFileSync(path.join(__dirname, `assets/lexend-latin-${w}-normal.woff2`)).toString('base64')}`;
const css = fs.readFileSync(path.join(__dirname, 'lib/style.css'), 'utf8').replace('FONT400', font(400)).replace('FONT600', font(600)).replace('FONT700', font(700));
const doc = (body, extraCss = '') => `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><style>${css}${extraCss}</style></head><body>${body}</body></html>`;

const footer = `<div style="width:100%;font-family:Arial,sans-serif;font-size:7pt;color:#5b6275;padding:0 13mm;display:flex;justify-content:space-between;">
  <span>Banora Point High School · Mathematics Standard 2 · Year 12 · Network flow</span><span><span class="pageNumber"></span></span></div>`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pdf = async (html, file, withFooter) => {
    fs.writeFileSync(file.replace(/\.pdf$/, '.html'), html);
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: withFooter, headerTemplate: '<span></span>', footerTemplate: withFooter ? footer : '<span></span>' });
  };

  // 1. Lessons and answers (numbered pages)
  const body = `${lessons.map(lessonHtml).join('')}<section class="answers" id="answers"><h1><span class="mark">@@ANS@@</span>Short answer key</h1><p class="intro">Final answers only. Full working for the worked examples is in each lesson. Where several answers are possible (paths, flows, cuts), one correct answer is shown and any equivalent answer that follows the rules is correct.</p><div class="acols">${answersHtml(lessons)}</div></section>`;
  const bodyPdf = path.join(OUT, 'body.pdf');
  await pdf(doc(body), bodyPdf, true);

  // 2. Find the page each lesson starts on, for the contents
  const nPages = +execFileSync('pdfinfo', [bodyPdf]).toString().match(/Pages:\s+(\d+)/)[1];
  const starts = {}; let ansPage = null;
  for (let p = 1; p <= nPages; p++) {
    const t = execFileSync('pdftotext', ['-f', `${p}`, '-l', `${p}`, '-layout', bodyPdf, '-']).toString();
    lessons.forEach((L) => { if (!starts[L.n] && t.includes(`@@L${L.n}@@`)) starts[L.n] = p; });
    if (!ansPage && t.includes('@@ANS@@')) ansPage = p;
  }

  // 3. Cover and contents
  const frontPdf = path.join(OUT, 'front.pdf');
  await pdf(doc(front.html(lessons, starts, ansPage), front.css), frontPdf, false);
  await browser.close();

  const final = path.join(OUT, `${NAME}.pdf`);
  execFileSync('pdfunite', [frontPdf, bodyPdf, final]);
  const size = fs.statSync(final).size;
  console.log(`Built ${final}: ${nPages + 2} pages, ${(size / 1024).toFixed(0)} KB`);
  console.log('Lesson start pages:', JSON.stringify(starts), 'answers:', ansPage);
  lessons.forEach((L, i) => { const next = lessons[i + 1] ? starts[lessons[i + 1].n] : ansPage; console.log(`  Lesson ${L.n}: ${next - starts[L.n]} pages`); });
})();
