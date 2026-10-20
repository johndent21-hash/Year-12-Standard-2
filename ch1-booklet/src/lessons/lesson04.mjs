// Lesson 4 Scale drawings (textbook 1D). Follows the Lesson 1 model.
import { r, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// A small map drawn at true size: 1 viewBox unit = 1 mm, so each scale-bar block is really 1 cm.
const mapSvg = `
  <svg width="46mm" viewBox="0 0 46 31" font-family="Poppins" font-weight="300">
    <rect x="0.2" y="0.2" width="45.6" height="22.6" fill="#f5f3eb" stroke="#d8d2b4" stroke-width="0.4"/>
    <path d="M33 0.4 C31.4 6, 34.6 11, 32.8 16 S32.4 21, 33.6 22.6 L38.4 22.6 C37.2 21, 37.6 18, 38.4 15.4 S36.2 6, 38 0.4 Z" fill="#d8d2b4"/>
    <path d="M38 0.4 C36.2 6, 39.4 11, 38.4 15.4 S37.2 21, 38.4 22.6 L45.6 22.6 L45.6 0.4 Z" fill="#9fb9da"/>
    <path d="M0.4 17.6 C9 15.6, 18 20.4, 32.4 17.2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <path d="M13 0.4 C14 6, 12 10, 14.4 17.6" fill="none" stroke="#fff" stroke-width="1.1"/>
    <line x1="5" y1="9" x2="35" y2="9" stroke="#3f7cc0" stroke-width="0.45" stroke-dasharray="1.2 0.9"/>
    <circle cx="5" cy="9" r="1" fill="#7a1f4e"/>
    <circle cx="35" cy="9" r="1" fill="#7a1f4e"/>
    <text x="20" y="7.4" font-size="2.9" fill="#3f7cc0" text-anchor="middle" font-family="Pagella">3 cm</text>
    <text x="5.6" y="13.2" font-size="2.3" fill="#555" text-anchor="middle">Home</text>
    <text x="35" y="13.2" font-size="2.3" fill="#555" text-anchor="middle">Beach</text>
    <rect x="3" y="24.6" width="10" height="1.6" fill="#3d3d3d"/>
    <rect x="13" y="24.6" width="10" height="1.6" fill="#fff"/>
    <rect x="23" y="24.6" width="10" height="1.6" fill="#3d3d3d"/>
    <rect x="3" y="24.6" width="30" height="1.6" fill="none" stroke="#3d3d3d" stroke-width="0.3"/>
    <text x="3" y="29.6" font-size="2.3" fill="#555" text-anchor="middle">0</text>
    <text x="13" y="29.6" font-size="2.3" fill="#555" text-anchor="middle">100</text>
    <text x="23" y="29.6" font-size="2.3" fill="#555" text-anchor="middle">200</text>
    <text x="30.9" y="29.6" font-size="2.3" fill="#555">300 m</text>
  </svg>`;

// drawing length  --x scale number-->  actual length,  and back with ÷
const arrowSvg = `
  <svg width="74mm" viewBox="0 0 222 48" font-family="Poppins" font-weight="400">
    <rect x="1" y="12" width="76" height="22" rx="3" fill="#f5f3eb" stroke="#d8d2b4" stroke-width="1"/>
    <rect x="145" y="12" width="76" height="22" rx="3" fill="#f5f3eb" stroke="#d8d2b4" stroke-width="1"/>
    <text x="39" y="26.5" font-size="9" fill="#3d3d3d" text-anchor="middle">drawing length</text>
    <text x="183" y="26.5" font-size="9" fill="#3d3d3d" text-anchor="middle">actual length</text>
    <line x1="82" y1="17" x2="134" y2="17" stroke="#3f7cc0" stroke-width="1.3"/>
    <polygon points="141,17 133,13 133,21" fill="#3f7cc0"/>
    <line x1="140" y1="29" x2="88" y2="29" stroke="#7a1f4e" stroke-width="1.3"/>
    <polygon points="81,29 89,25 89,33" fill="#7a1f4e"/>
    <text x="111" y="11" font-size="10" fill="#3f7cc0" text-anchor="middle" font-family="Pagella">× scale number</text>
    <text x="111" y="44" font-size="10" fill="#7a1f4e" text-anchor="middle" font-family="Pagella">÷ scale number</text>
  </svg>`;

// km -> m -> cm -> mm ladder: multiply going right, divide going left
const ladderSvg = (() => {
  const xs = [22, 85, 148, 211];
  const units = ['km', 'm', 'cm', 'mm'];
  const facs = ['1000', '100', '10'];
  const circles = xs.map((x, i) => `<circle cx="${x}" cy="25" r="12" fill="#eaf1fa" stroke="#3f7cc0" stroke-width="0.9"/><text x="${x}" y="28.6" font-size="10.5" text-anchor="middle" fill="#1c1c1c">${units[i]}</text>`).join('');
  const arrows = facs.map((f, i) => {
    const a = xs[i] + 15, b = xs[i + 1] - 15, mid = (xs[i] + xs[i + 1]) / 2;
    return `<line x1="${a}" y1="19" x2="${b - 5}" y2="19" stroke="#3f7cc0" stroke-width="1.2"/><polygon points="${b},19 ${b - 6},16 ${b - 6},22" fill="#3f7cc0"/>
      <line x1="${b}" y1="31" x2="${a + 5}" y2="31" stroke="#7a1f4e" stroke-width="1.2"/><polygon points="${a},31 ${a + 6},28 ${a + 6},34" fill="#7a1f4e"/>
      <text x="${mid}" y="12.5" font-size="9.5" text-anchor="middle" fill="#3f7cc0">× ${f}</text>
      <text x="${mid}" y="45" font-size="9.5" text-anchor="middle" fill="#7a1f4e">÷ ${f}</text>`;
  }).join('');
  return `<svg width="78mm" viewBox="0 0 234 48" font-family="Pagella">${circles}${arrows}</svg>`;
})();

// A ruler, true size (1 unit = 1 mm), with a 35 mm length marked above it
const rulerSvg = (() => {
  let ticks = '';
  for (let i = 0; i <= 40; i++) {
    const x = 5 + i, len = i % 10 === 0 ? 3.4 : i % 5 === 0 ? 2.4 : 1.4;
    ticks += `<line x1="${x}" y1="9" x2="${x}" y2="${9 + len}" stroke="#3d3d3d" stroke-width="${i % 10 === 0 ? 0.3 : 0.2}"/>`;
  }
  const nums = [0, 1, 2, 3, 4].map((n) => `<text x="${5 + n * 10}" y="16.6" font-size="2.6" text-anchor="middle" fill="#3d3d3d">${n}</text>`).join('');
  return `
  <svg width="50mm" viewBox="0 0 50 19" font-family="Pagella">
    <rect x="2" y="9" width="47.6" height="9.4" rx="0.6" fill="#f5f3eb" stroke="#3d3d3d" stroke-width="0.3"/>
    ${ticks}${nums}
    <line x1="5" y1="6" x2="40" y2="6" stroke="#3f7cc0" stroke-width="0.7"/>
    <line x1="5" y1="4.6" x2="5" y2="7.4" stroke="#3f7cc0" stroke-width="0.5"/>
    <line x1="40" y1="4.6" x2="40" y2="7.4" stroke="#3f7cc0" stroke-width="0.5"/>
    <text x="22.5" y="3.6" font-size="2.9" text-anchor="middle" fill="#3f7cc0">35 mm = 3.5 cm</text>
  </svg>`;
})();

// ---------------------------------------------------------------- lesson 4
const p1 = {
  cls: 'l04',
  html: `
  ${banner({ num: '4', title: 'Scale drawings', sub: 'Key idea: Scale drawing • Textbook 1D • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Scale drawing', `
    <div class="fig" style="float:right; width:48mm; margin:0 0 0 4mm">${mapSvg}<div class="cap">1 cm = 100 m, so 3 cm = 300 m</div></div>
    <p class="mb0">A <b>scale</b> compares a length on a drawing with the real (actual) length.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b>Scale = drawing length : actual length.</b> The drawing comes <b>first</b>.</li>
      <li><b>With units:</b> 1 cm to 1 m (or 1 cm = 1 m). Each 1 cm on the drawing is 1 m in real life.</li>
      <li><b>No units:</b> a ratio such as ${r('1:100')}. Each 1 cm is 100 cm (or each 1 mm is 100 mm).</li>
      <li>1 cm to 1 m is the <b>same scale</b> as ${r('1:100')}, because 1 m = 100 cm.</li>
    </ul>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 1fr 80mm">
    <div>
      <div class="h2">Using a scale</div>
      <div class="fig" style="margin:1mm 0 1.6mm">${arrowSvg}</div>
      <ul class="dots mb0">
        <li>The <b>scale number</b> is the second number: 50 in ${r('1:50')}, and 20 in 1 cm = 20 m.</li>
        <li>Both lengths must be in the <b>same unit</b>. Change units first if you need to.</li>
      </ul>
    </div>
    <div>
      <div class="h2">Changing units</div>
      <div class="fig" style="margin:1mm 0 1.6mm">${ladderSvg}</div>
      <p class="mb0">To a <b>smaller</b> unit, <b>multiply</b>.<br>To a <b>bigger</b> unit, <b>divide</b>.<br><span class="nw">1 km = 1000 m = 100&#8239;000 cm</span></p>
    </div>
  </div>

  <div style="margin-top:3mm">${checklist(['use a scale drawing to calculate real distances.', `use a scale to find a length on a drawing, and write a scale in the form ${r('1:<i>x</i>')}.`])}</div>

  ${we('4.1', 'Finding a real length', `Find each real length. &emsp;(a) <span class="nw">Scale 1 cm = 20 m,</span> two trees <span class="nw">4.5 cm</span> apart on a map &emsp;(b) <span class="nw">Scale ${r('1:50')},</span> a wall <span class="nw">7 cm</span> long on a plan, in metres &emsp;(c) <span class="nw">Scale ${r('1:25&#8239;000')},</span> two lookouts <span class="nw">8 cm</span> apart on a map, in kilometres`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['1 cm = 20 m', 'Every 1 cm on the map is <b>20 m</b> in real life.'],
      ['real = 4.5 × 20', '<b>Multiply</b> the map length by 20.'],
      ['= 90 m', 'The scale says <b>m</b>, so the answer is in metres.'],
    ])}
    ${sol('(b)', [
      ['real = 7 × 50', 'No units: every 1 cm is <b>50 cm</b>. Multiply by 50.'],
      ['= 350 cm', 'The plan length is in cm, so this answer is in <b>cm</b>.'],
      ['= 350 ÷ 100', 'Change to metres: 100 cm = 1 m, so <b>divide</b> by 100.'],
      ['= 3.5 m', 'Check: 1 cm is 50 cm = 0.5 m, and 7 × 0.5 = 3.5 m.'],
    ])}
    ${sol('(c)', [
      ['real = 8 × 25&#8239;000', '<b>Multiply</b> the map length by 25&#8239;000.'],
      ['= 200&#8239;000 cm', 'The map length is in cm, so this answer is in <b>cm</b>.'],
      ['= 200&#8239;000 ÷ 100&#8239;000', 'Change to km: 1 km = 100&#8239;000 cm, so <b>divide</b> by 100&#8239;000.'],
      ['= 2 km', 'Check: 4 cm × 25&#8239;000 = 100&#8239;000 cm = 1 km, so 8 cm = 2 km.'],
    ])}`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l04',
  html: `
  ${we('4.2', 'Finding a length on the drawing', `Find each length on the drawing. &emsp;(a) <span class="nw">Scale 1 cm = 25 m,</span> a path <span class="nw">150 m</span> long, on a map &emsp;(b) <span class="nw">Scale ${r('1:40')},</span> a table <span class="nw">1.6 m</span> long, on a plan, in centimetres`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['1 cm = 25 m', 'Every 25 m in real life is <b>1 cm</b> on the map.'],
      ['map = 150 ÷ 25', 'Real to map, so <b>divide</b> by 25.'],
      ['= 6 cm', 'The scale’s first unit is cm. Check: 6 × 25 = 150 m.'],
    ])}
    ${sol('(b)', [
      ['1.6 m = 1.6 × 100 = 160 cm', 'Change to cm first, so both lengths use the <b>same unit</b>.'],
      ['plan = 160 ÷ 40', 'Real to plan, so <b>divide</b> by the scale number, 40.'],
      ['= 4 cm', 'Check: 4 × 40 = 160 cm = 1.6 m.'],
    ])}`, '--wc: 50mm')}

  ${we('4.3', 'Change the map length first', 'A map has the scale <span class="nw">1 cm = 2 km</span>. Two towns are <span class="nw">35 mm</span> apart on the map. How far apart are the towns in real life?', `
    <div class="grid2" style="grid-template-columns: 1fr 52mm; column-gap: 5mm; align-items:center; --wc: 34mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['35 mm = 35 ÷ 10', 'Change mm to cm: <b>divide</b> by 10.'],
          ['= 3.5 cm', 'Now it is in cm, the same unit as the scale.'],
          ['real = 3.5 × 2', 'Every 1 cm is 2 km, so <b>multiply</b> by 2.'],
          ['= 7 km', 'The scale says <b>km</b>, so the answer is in kilometres.'],
        ])}</div>
      </div>
      <div class="fig">${rulerSvg}<div class="cap">ruler in cm: &nbsp;10 mm = 1 cm</div></div>
    </div>`, 'margin-top:4mm')}

  ${we('4.4', 'Writing a scale as 1 : <i>x</i>', `Write each scale in the form ${r('1:<i>x</i>')}. &emsp;<span class="nw">(a) 1 cm to 2 m</span> &emsp;<span class="nw">(b) 1 mm to 5 cm</span> &emsp;<span class="nw">(c) 1 m to 4 km</span>`, `
    <div class="sol-head multi"><span>(a)</span><span>(b)</span><span>(c)</span><span>Why</span></div>
    <div class="steps multi">
      <div class="m">${r('1 cm:2 m')}</div><div class="m">${r('1 mm:5 cm')}</div><div class="m">${r('1 m:4 km')}</div>
      <div class="why">Write it as drawing : actual.</div>
      <div class="m">= ${r('1 cm:2 × 100 cm')}</div><div class="m">= ${r('1 mm:5 × 10 mm')}</div><div class="m">= ${r('1 m:4 × 1000 m')}</div>
      <div class="why">Make the units the <b>same</b>.</div>
      <div class="m">= <span class="hl">${r('1:200')}</span></div><div class="m">= <span class="hl">${r('1:50')}</span></div><div class="m">= <span class="hl">${r('1:4000')}</span></div>
      <div class="why">Same units, so <b>drop</b> them.</div>
    </div>`, 'margin-top:4mm')}

  <div style="margin-top:5mm">${bar('Your turn 4', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, `A plan has the scale ${r('1:100')}. What does 1&nbsp;cm on the plan stand for?`, ['1 cm', '10 cm', '100 cm', '100 m'], { see: 'Key idea', h: 22 })}</div>
    <div>${mc(2, `A drawing has the scale ${r('1:20')}. A line on it is 20&nbsp;mm long. What is the real length?`, ['1 mm', '20 mm', '40 mm', '400 mm'], { see: 'Example 4.1', h: 22 })}</div>
    <div>${mc(3, 'A map has the scale <span class="nw">1 mm = 150 m</span>. Two places are <span class="nw">600 m</span> apart. How far apart are they on the map? <span class="hint nw">Hint: divide by 150.</span> ', ['4 mm', '0.25 mm', '4 cm', '90&#8239;000 mm'], { see: 'Example 4.2', h: 22 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l04',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'On a map, the scale is <span class="nw">1 cm = 50 m</span>. How far apart in real life are two points that are this far apart on the map? <span class="hint">Hint: multiply by 50.</span>', { see: 'Example 4.1', parts: ['3.2 cm', '6 cm', '0.4 cm'], h: 22, split: true })}
  ${q(2, `A park map has the scale ${r('1:400')}. Find each real distance in metres. <span class="hint">Hint: <span class="nw">× 400,</span> then <span class="nw">÷ 100</span>.</span>`, { see: 'Example 4.1', parts: ['5 cm', '20 cm', '1.5 cm'], h: 28, split: true })}
  ${q(3, `Write each scale in the form ${r('1:<i>x</i>')}. <span class="hint">Hint: change to the same unit first.</span>`, { see: 'Example 4.4', parts: ['1 cm to 3 m', '1 mm to 6 cm', '1 m to 2.5 km'], h: 26, split: true })}
  <div class="grid2 qpair">
    <div>${q(4, `A kitchen plan has the scale ${r('1:50')}. The bench is 3&nbsp;m long. How long is the bench on the plan, in&nbsp;cm? <span class="hint">Hint: change 3&nbsp;m to cm first.</span>`, { see: 'Example 4.2', h: 30 })}</div>
    <div>${q(5, 'A map has the scale <span class="nw">1 cm = 5 km</span>. Two towns are 46&nbsp;mm apart on the map. What is the real distance, in&nbsp;km? <span class="hint nw">Hint: 46 mm = 4.6 cm.</span>', { see: 'Example 4.3', h: 30 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `A bushwalking map has the scale ${r('1:50&#8239;000')}.`, { see: 'Examples 4.1 and 4.2', cols: 1, parts: [
    'A walking track is 6&nbsp;cm long on the map. How long is the real track, in centimetres?',
    'Change your answer to part (a) into kilometres. <span class="hint">Hint: <span class="nw">1 km = 100&#8239;000 cm</span>.</span>',
    'A lake is 2.5&nbsp;km long. Change 2.5&nbsp;km into centimetres. <span class="hint nw">Hint: × 100&#8239;000.</span>',
    'How long is the lake on the map, in centimetres?',
  ], h: 28, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 4 &nbsp;Scale drawings</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> C &emsp;<b>2</b> D &nbsp;(<span class="nw">20 × 20 = 400 mm)</span></p>
    <p><b>3</b> A &nbsp;(<span class="nw">600 ÷ 150 = 4 mm)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 160 m</span>&nbsp; <span class="nw">(b) 300 m</span>&nbsp; <span class="nw">(c) 20 m</span></p>
    <p><b>2</b> <span class="nw">(a) 2000 cm = 20 m</span>&nbsp; <span class="nw">(b) 8000 cm = 80 m</span>&nbsp; <span class="nw">(c) 600 cm = 6 m</span></p>
    <p><b>3</b> <span class="nw">(a) ${r('1:300')}</span>&nbsp; <span class="nw">(b) ${r('1:60')}</span>&nbsp; <span class="nw">(c) ${r('1:2500')}</span></p>
    <p><b>4</b> <span class="nw">3 m = 300 cm,</span> <span class="nw">300 ÷ 50 = 6 cm</span></p>
    <p><b>5</b> <span class="nw">46 mm = 4.6 cm,</span> <span class="nw">4.6 × 5 = 23 km</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">6 × 50&#8239;000 = 300&#8239;000 cm</span><br>(b) <span class="nw">300&#8239;000 ÷ 100&#8239;000 = 3 km</span><br>(c) <span class="nw">2.5 × 100&#8239;000 = 250&#8239;000 cm</span><br>(d) <span class="nw">250&#8239;000 ÷ 50&#8239;000 = 5 cm</span></p>
`;

// Example 4.4 sets its three parts side by side, with one shared Why column.
export const css = `
.l04 .sol-head.multi { grid-template-columns: repeat(3, 33mm) 1fr; column-gap: 4mm; font-family: 'Pagella', serif; font-size: 10.5pt; letter-spacing: 0; text-transform: none; color: var(--text); }
.l04 .sol-head.multi span:last-child { padding-left: 0; font: 500 7pt/1 'Poppins', sans-serif; letter-spacing: .06em; text-transform: uppercase; color: #9a9a9a; }
.l04 .steps.multi { grid-template-columns: repeat(3, 33mm) 1fr; margin-top: 1.4mm; }
`;
