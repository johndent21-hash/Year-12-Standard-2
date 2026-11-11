const { chromium } = require('playwright');
(async () => {
  const [,, html, pdf, png] = process.argv;
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + html, {waitUntil: 'load'});
  // report overflowing pages
  const ov = await p.evaluate(() => [...document.querySelectorAll('.page')].map((s,i)=>{
    const foot = s.querySelector('.foot'); const kids=[...s.children].filter(c=>!c.classList.contains('foot'));
    const last = kids.length? kids[kids.length-1].getBoundingClientRect().bottom - s.getBoundingClientRect().top : 0;
    return [i+1, Math.round(last), Math.round(s.getBoundingClientRect().height)]; }));
  console.log(JSON.stringify(ov));
  await p.pdf({path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true});
  await b.close();
})();
