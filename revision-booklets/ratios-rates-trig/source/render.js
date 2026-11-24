const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/booklet.html');
  await p.evaluate(() => document.fonts.ready);
  const issues = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      const pr = pg.getBoundingClientRect();
      const fe = pg.querySelector('.foot'); if (!fe) return; const foot = fe.getBoundingClientRect();
      const ci = pg.querySelector('.checkin');
      const limit = ci ? ci.getBoundingClientRect().top : foot.top;
      let maxB = 0;
      pg.querySelectorAll('.qs, .ans, .cols2, .panel, .weekbox, p, table').forEach(e => { const r = e.getBoundingClientRect(); if (r.bottom > maxB) maxB = r.bottom; });
      out.push(`p${i+1}: space left ${(limit - maxB).toFixed(0)}px`);
      const a = pg.querySelector('.ans'); if (a) out.push(`  ans overflowX ${a.scrollWidth - a.clientWidth}`);
    });
    // fonts
    out.push([...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+f.weight).join(','));
    return out;
  });
  console.log(issues.join('\n'));
  await p.pdf({ path: 'booklet.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
