// Cover and inside cover (contents, outcomes, how to use, key terms)
const fs = require('fs');
const path = require('path');
const { net, svg, maxFlow } = require('./net');

const logo = () => {
  for (const f of ['banora-logo.png', 'banora-logo.jpg', 'banora-logo.svg']) {
    const p = path.join(__dirname, '..', 'assets', f);
    if (fs.existsSync(p)) {
      const mime = f.endsWith('svg') ? 'image/svg+xml' : f.endsWith('png') ? 'image/png' : 'image/jpeg';
      return `<img class="logo" src="data:${mime};base64,${fs.readFileSync(p).toString('base64')}" alt="Banora Point High School logo">`;
    }
  }
  // No logo file yet: a plain wordmark in the school colours. Put the logo at assets/banora-logo.png and rebuild.
  return '<div class="wordmark"><div class="wm1">Banora Point</div><div class="wm2">HIGH SCHOOL</div></div>';
};

const coverNet = (() => {
  const N = net({ s: [20, 110], A: [120, 40], B: [120, 180], C: [230, 110], D: [330, 40], E: [330, 180], t: [430, 110] },
    [['s', 'A', 12], ['s', 'B', 10], ['A', 'C', 5], ['B', 'C', 6], ['A', 'D', 8], ['B', 'E', 7], ['C', 'D', 4], ['C', 'E', 6], ['D', 't', 11], ['E', 't', 9]]);
  const { flow, value } = maxFlow(N);
  return { svg: svg(N, { flows: flow, scale: 1.55 }), value };
})();

const css = `
.cover { height: 266mm; display: flex; flex-direction: column; position: relative; break-after: page; }
.cv-top { display: flex; justify-content: space-between; align-items: flex-start; }
.logo { height: 30mm; }
.wordmark { color: var(--navy); line-height: 1; }
.wm1 { font-size: 21pt; font-weight: 700; letter-spacing: -0.01em; }
.wm2 { font-size: 10.5pt; letter-spacing: 0.32em; margin-top: 1.2mm; }
.cv-course { text-align: right; color: var(--navy); font-weight: 600; font-size: 11pt; line-height: 1.35; }
.cv-course span { display: block; color: var(--teal); font-weight: 400; font-size: 9.5pt; }
.bands { margin: 9mm 0 7mm; }
.bands div { height: 2.6mm; border-radius: 2mm; margin-bottom: 1.6mm; }
.cv-title { font-size: 46pt; font-weight: 700; color: var(--navy); line-height: 0.98; letter-spacing: -0.02em; margin: 0; }
.cv-sub { font-size: 14pt; color: var(--teal); font-weight: 600; margin: 3mm 0 0; }
.cv-net { margin: 10mm auto 2mm; text-align: center; }
.cv-cap { text-align: center; font-size: 8.4pt; color: var(--mute); }
.cv-who { margin-top: auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 6mm; font-size: 10pt; color: var(--navy); font-weight: 600; }
.cv-who div { border-bottom: 0.4mm solid var(--navy); padding-bottom: 7mm; }
.cv-foot { margin-top: 7mm; background: var(--navy); color: #fff; border-radius: 2.5mm; padding: 3mm 5mm; display: flex; justify-content: space-between; font-size: 8.6pt; }
.cv-foot b { color: var(--gold-100); }
.inside { break-before: page; }
.inside h2 { font-size: 13pt; color: var(--navy); margin: 0 0 2mm; border-bottom: 0.6mm solid var(--gold); padding-bottom: 1mm; }
table.toc { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin-bottom: 3.5mm; }
table.toc th { text-align: left; background: var(--navy); color: #fff; font-weight: 600; padding: 1.2mm 2mm; font-size: 8.4pt; }
table.toc td { padding: 0.55mm 2mm; border-bottom: 0.3mm solid var(--navy-100); vertical-align: top; }
table.toc td.n { font-weight: 700; color: var(--navy); width: 8mm; }
table.toc td.pg { text-align: right; width: 10mm; font-weight: 600; }
table.toc td.done { width: 12mm; text-align: center; }
table.toc td.done span { display: inline-block; width: 3.6mm; height: 3.6mm; border: 0.35mm solid var(--teal); border-radius: 0.6mm; }
table.toc .sub { color: var(--mute); font-size: 7.8pt; display: block; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.lvkey { display: flex; gap: 2mm; align-items: flex-start; margin-bottom: 1.6mm; font-size: 8.8pt; }
.lvkey .lvtag { flex: none; width: 19mm; white-space: nowrap; text-align: center; }
.gloss { font-size: 8.1pt; line-height: 1.3; }
.gloss dt { font-weight: 600; color: var(--navy); }
.gloss dd { margin: 0 0 0.8mm; }
.outc { font-size: 8.6pt; background: var(--teal-50); border-radius: 2mm; padding: 2mm 3mm; margin-bottom: 4mm; }
.outc b { color: var(--teal); }
`;

const html = (lessons, starts, ansPage) => `
<section class="cover">
  <div class="cv-top">${logo()}<div class="cv-course">Mathematics Standard 2<span>Year 12 · Networks</span></div></div>
  <div class="bands"><div style="background:var(--navy);width:100%"></div><div style="background:var(--teal);width:82%"></div><div style="background:var(--gold);width:64%"></div></div>
  <h1 class="cv-title">Network<br>flow</h1>
  <p class="cv-sub">Lesson booklet · 10 lessons</p>
  <div class="cv-net">${coverNet.svg}</div>
  <div class="cv-cap">The gold boxes show a maximum flow of ${coverNet.value} through this network. By Lesson 7 you will be able to prove that no bigger flow is possible.</div>
  <div class="cv-who"><div>Name</div><div>Class</div><div>Teacher</div></div>
  <div class="cv-foot"><span><b>NSW Mathematics Standard 11–12 Syllabus (2024)</b> · Year 12 Standard 2 · Network flow</span><span>MST-12-S2-06 · MAO-WM-01</span></div>
</section>
<section class="inside">
  <h2>Contents</h2>
  <table class="toc"><tr><th></th><th>Lesson</th><th>Page</th><th>Done</th></tr>
  ${lessons.map((L) => `<tr><td class="n">${L.n}</td><td>${L.title}<span class="sub">${L.toc}</span></td><td class="pg">${starts[L.n] || ''}</td><td class="done"><span></span></td></tr>`).join('')}
  <tr><td class="n"></td><td>Short answer key</td><td class="pg">${ansPage || ''}</td><td></td></tr></table>
  <div class="outc"><b>Outcomes.</b> A student applies network flow concepts to solve problems and model decision-making in practical contexts <b>MST-12-S2-06</b>; develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly <b>MAO-WM-01</b>.</div>
  <div class="two">
    <div>
      <h2>How to use this booklet</h2>
      <p style="font-size:8.8pt">Each lesson is one period. Read the <b>Key ideas</b>, follow the <b>Worked examples</b> with your teacher, then work through the practice. Start at Level 1 and keep going as far as you can.</p>
      <div class="lvkey l1"><span class="lvtag" style="background:var(--teal)">Level 1</span><span><b>Foundation.</b> Everyone does these. One step at a time, just like the worked examples.</span></div>
      <div class="lvkey l2"><span class="lvtag" style="background:var(--navy)">Level 2</span><span><b>Core.</b> Most students. Put the steps together and explain your answers.</span></div>
      <div class="lvkey l3"><span class="lvtag" style="background:var(--gold-d)">Level 3</span><span><b>Challenge.</b> Unfamiliar problems and harder reasoning.</span></div>
      <p style="font-size:8.8pt;margin-top:2mm">Check your answers in the <b>short answer key</b> at the back (page ${ansPage || ''}). Tick the <b>Success criteria</b> at the start of each lesson when you can do them.</p>
      <p class="small">Diagrams are not drawn to scale. Edge lengths mean nothing; only the numbers (capacities) matter. All contexts and capacities are made up for practice.</p>
    </div>
    <div>
      <h2>Key terms</h2>
      <dl class="gloss">
        <dt>Directed network</dt><dd>A network whose edges have arrows; travel is only possible in the direction of the arrows.</dd>
        <dt>Capacity (of an edge)</dt><dd>The weight on an edge in a flow network: the most that can flow along it, e.g. litres per minute.</dd>
        <dt>Source (s)</dt><dd>A vertex with only outgoing edges. The flow starts here.</dd>
        <dt>Sink (t)</dt><dd>A vertex with only incoming edges. The flow ends here.</dd>
        <dt>Inflow / outflow</dt><dd>The total flow of the edges arriving at / leaving a vertex.</dd>
        <dt>Excess capacity</dt><dd>Capacity − flow for an edge.</dd>
        <dt>Saturated edge</dt><dd>An edge with zero excess capacity (flow = capacity).</dd>
        <dt>Cut</dt><dd>Splits the vertices into two groups, with the source in one and the sink in the other.</dd>
        <dt>Minimum cut</dt><dd>The cut with the smallest capacity.</dd>
        <dt>Flow capacity</dt><dd>The maximum flow through the whole network.</dd>
        <dt>Maximum-flow minimum-cut theorem</dt><dd>The flow through a network cannot exceed the value of any cut, and the maximum flow equals the value of the minimum cut.</dd>
      </dl>
    </div>
  </div>
</section>`;

module.exports = { html, css };
