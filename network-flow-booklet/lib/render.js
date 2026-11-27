// Turns lesson data into HTML. Each question carries its own answer, so the answer key is built from the same data.
//
// lesson: { n, title, content: [syllabus dot points], li: [..], sc: [..], key: html,
//           examples: [{ q, fig?, sol, figSide? }],
//           levels: [{ name: 'Foundation'|'Core'|'Challenge', who, qs: [question] }] }
// question: { q: html, fig?: svg, figSide?: bool, a?: answer, space?: 'lines:3' | 'box:30' | 'line' | 'none',
//             parts?: [{ q, a, space?, fig? }], brk?: bool (start on a new page) }

const LEVELS = {
  Foundation: { cls: 'l1', tag: 'Level 1', who: 'Everyone · start here' },
  Core: { cls: 'l2', tag: 'Level 2', who: 'Most students' },
  Challenge: { cls: 'l3', tag: 'Level 3', who: 'Extend yourself' },
};

const space = (sp) => {
  if (!sp || sp === 'none') return '';
  if (sp === 'line') return '<span class="aline"></span>';
  const [kind, n] = sp.split(':');
  if (kind === 'lines') return `<div class="lines">${'<div class="ln"></div>'.repeat(+n)}</div>`;
  if (kind === 'box') return `<div class="wbox" style="height:${n}mm"></div>`;
  throw new Error(`Unknown space ${sp}`);
};

const partHtml = (p, i) => {
  const letter = String.fromCharCode(97 + i);
  const inline = p.space === 'line';
  return `<div class="part${inline ? ' inl' : ''}"><span class="pl">(${letter})</span><div class="pq"><div class="pt">${p.q}${inline ? space('line') : ''}</div>${p.fig ? `<div class="pfig">${p.fig}</div>` : ''}${inline ? '' : space(p.space)}</div></div>`;
};

const qHtml = (Q, num) => {
  const parts = Q.parts ? `<div class="parts">${Q.parts.map(partHtml).join('')}</div>` : '';
  const own = Q.parts ? '' : (Q.space === 'line' ? '' : space(Q.space));
  const stem = `<div class="qt">${Q.q}${!Q.parts && Q.space === 'line' ? space('line') : ''}</div>`;
  let body;
  if (Q.fig && Q.figSide) body = `<div class="side"><div class="sfig">${Q.fig}</div><div class="sbody">${stem}${parts}${own}</div></div>`;
  else body = `${stem}${Q.fig ? `<div class="qfig">${Q.fig}</div>` : ''}${parts}${own}`;
  const split = Q.keep === false || (Q.parts && !Q.figSide && Q.keep !== true);
  return `<div class="q${Q.brk ? ' brk' : ''}${split ? ' split' : ''}"><span class="qn">${num}</span><div class="qb">${body}</div></div>`;
};

const exampleHtml = (X, i) => {
  const fig = X.fig ? `<div class="xfig">${X.fig}</div>` : '';
  const q = X.figSide && X.fig ? `<div class="side"><div class="sfig">${X.fig}</div><div class="sbody">${X.q}</div></div>` : `${X.q}${fig}`;
  return `<div class="ex${X.brk ? ' brk' : ''}"><div class="exq"><div class="exh">Worked example ${i + 1}</div><div>${q}</div></div><div class="exs"><div class="exsh">Solution</div>${X.sol}</div></div>`;
};

const lessonHtml = (L) => {
  let qn = 0;
  const levels = L.levels.map((lv) => {
    const M = LEVELS[lv.name];
    const qs = lv.qs.map((Q) => qHtml(Q, ++qn)).join('');
    return `<section class="level ${M.cls}${lv.brk ? ' brk' : ''}"><div class="lvh"><span class="lvtag">${M.tag}</span><span class="lvname">${lv.name}</span><span class="lvwho">${lv.who || M.who}</span></div>${qs}</section>`;
  }).join('');
  return `<article class="lesson" id="lesson-${L.n}">
    <header class="lh"><span class="mark">@@L${L.n}@@</span><div class="lnum"><span>Lesson</span>${L.n}</div><div class="ltitle"><h1>${L.title}</h1><div class="lcontent">${L.content.map((c) => `<span>${c}</span>`).join('')}</div></div></header>
    <div class="lisc"><div class="li"><h3>Learning intentions</h3><ul>${L.li.map((x) => `<li>${x}</li>`).join('')}</ul></div><div class="sc"><h3>Success criteria · I can…</h3><ul class="ticks">${L.sc.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>
    <div class="key"><div class="keyh">Key ideas</div>${L.key}</div>
    ${L.examples.map(exampleHtml).join('')}
    <div class="practice">${levels}</div>
  </article>`;
};

// Short answers: one line per question, parts run on.
const answersHtml = (lessons) => lessons.map((L) => {
  let qn = 0; const rows = [];
  L.levels.forEach((lv) => lv.qs.forEach((Q) => {
    qn++;
    let a;
    if (Q.parts) a = Q.parts.map((p, i) => `<b>(${String.fromCharCode(97 + i)})</b> ${p.a}`).join(' &nbsp; ');
    else a = Q.a;
    if (a === undefined || Q.parts?.some((p) => p.a === undefined)) throw new Error(`Lesson ${L.n} Q${qn}: missing answer`);
    rows.push(`<div class="ar"><span class="an">${qn}</span><span class="at">${a}</span></div>`);
  }));
  return `<div class="ablock"><h3>Lesson ${L.n} · ${L.title}</h3>${rows.join('')}</div>`;
}).join('');

module.exports = { lessonHtml, answersHtml };
