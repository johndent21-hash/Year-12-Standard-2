const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/' + (process.argv[2]||'sydney') + '.html'); await p.evaluate(() => document.fonts.ready);
  console.log((await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg,i) => {
    const fe = pg.querySelector('.foot'); if (!fe) return `p${i+1}: cover`;
    const ci = pg.querySelector('.checkin, .coupon, .unlock');
    const lim = ci ? ci.getBoundingClientRect().top : fe.getBoundingClientRect().top;
    let mb = 0; pg.querySelectorAll('.qs, .ans, .cols2, .panel, .weekbox, .sandbox, .grid > *, .cert, p, table').forEach(e => { if (!ci || !ci.contains(e)) mb = Math.max(mb, e.getBoundingClientRect().bottom); });
    const bq = pg.querySelector('.bq'), bt = pg.querySelector('.btxt');
    let clash = '';
    if (bq && bt) { const a = bq.getBoundingClientRect(), c = bt.getBoundingClientRect(); const h1 = bt.querySelector('h1').getBoundingClientRect(); const d = bt.querySelector('div').getBoundingClientRect(); if (a.left < Math.max(h1.right, d.right) + 4) clash = ' QUOTE CLASH'; }
    return `p${i+1}: space ${(lim - mb).toFixed(0)}px${clash}`;
  }))).join('\n'));
  await p.pdf({ path: (process.argv[2]||'sydney') + '.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
