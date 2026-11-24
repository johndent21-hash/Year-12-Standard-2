const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/helpsheet.html'); await p.evaluate(() => document.fonts.ready);
  console.log((await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg,i) => {
    const lim = pg.querySelector('.foot').getBoundingClientRect().top;
    let mb = 0; pg.querySelectorAll('.grid > *').forEach(e => mb = Math.max(mb, e.getBoundingClientRect().bottom));
    const over = [...pg.querySelectorAll('.pb')].filter(e => e.scrollWidth > e.clientWidth + 1).length;
    return `p${i+1}: space ${(lim - mb).toFixed(0)}px, wide panels ${over}`;
  }))).join('\n'));
  await p.pdf({ path: 'helpsheet.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
