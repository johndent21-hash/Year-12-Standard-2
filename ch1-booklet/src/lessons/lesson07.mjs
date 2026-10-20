// Lesson 7 Volume of water (textbook 1F). Follows the Lesson 1 model.
import { r, frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

const BLUE = '#3f7cc0', LBLUE = '#9fb9da', PLUM = '#7a1f4e', INK = '#3d3d3d', SAND = '#d8d2b4', BEIGE = '#f5f3eb';

// ---------------------------------------------------------------- figure helpers
const txt = (x, y, s, { size = 9, anchor = 'middle', fill = INK, font = 'Pagella', italic = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}"${font === 'Poppins' ? ' font-weight="300"' : ''}${italic ? ' font-style="italic"' : ''}>${s}</text>`;
// italic d with a subscript, e.g. d_f
const dsub = (x, y, sub, { size = 10, anchor = 'middle', fill = BLUE } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="Pagella" font-style="italic">d<tspan font-size="${(size * 0.7).toFixed(1)}" dy="${(size * 0.22).toFixed(1)}">${sub}</tspan></text>`;
const head = (x, y, dir, c, s = 3) => {
  const w = s * 0.55;
  const p = { l: [[x, y], [x + s, y - w], [x + s, y + w]], r: [[x, y], [x - s, y - w], [x - s, y + w]],
    u: [[x, y], [x - w, y + s], [x + w, y + s]], d: [[x, y], [x - w, y - s], [x + w, y - s]] }[dir];
  return `<polygon points="${p.map((a) => a.map((v) => +v.toFixed(2)).join(',')).join(' ')}" fill="${c}"/>`;
};
const hArrow = (x1, x2, y, c = INK) => `<line x1="${x1 + 2}" y1="${y}" x2="${x2 - 2}" y2="${y}" stroke="${c}" stroke-width="0.6"/>${head(x1, y, 'l', c)}${head(x2, y, 'r', c)}`;
const vArrow = (x, y1, y2, c = INK) => `<line x1="${x}" y1="${y1 + 2}" x2="${x}" y2="${y2 - 2}" stroke="${c}" stroke-width="0.6"/>${head(x, y1, 'u', c)}${head(x, y2, 'd', c)}`;
const tick = (x, y, c = INK) => `<line x1="${x}" y1="${y - 2.2}" x2="${x}" y2="${y + 2.2}" stroke="${c}" stroke-width="0.5"/>`;
const corner = (x, y, dx, dy, s = 3.2) => `<path d="M${x + dx * s} ${y} L${x + dx * s} ${y + dy * s} L${x} ${y + dy * s}" fill="none" stroke="${INK}" stroke-width="0.45"/>`;
const pts = (...a) => a.map((p) => p.join(',')).join(' ');

// The water in a pool is a prism: the same depth everywhere (oblique view)
const sq = (v) => `${v} m<tspan font-size="6.5" dy="-3.6">2</tspan>`; // SVG text cannot hold <sup>
const poolSvg = ({ w = '42mm', top = 'area', len = '', wid = '', dep = 'depth' } = {}) => {
  const x0 = 8, y0 = 60, L = 70, D = 21, wx = 24, wy = 15;
  const A = [x0, y0 - D], B = [x0 + L, y0 - D], C = [x0 + L + wx, y0 - D - wy], E = [x0 + wx, y0 - D - wy];
  const F = [x0 + L, y0], G = [x0, y0], H = [x0 + L + wx, y0 - wy];
  const st = `stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"`;
  return `
  <svg width="${w}" viewBox="0 0 ${x0 + L + wx + 36} ${len ? 72 : 64}">
    <polygon points="${pts(A, B, F, G)}" fill="${LBLUE}" ${st}/>
    <polygon points="${pts(B, C, H, F)}" fill="${BLUE}" fill-opacity="0.6" ${st}/>
    <polygon points="${pts(A, B, C, E)}" fill="${LBLUE}" fill-opacity="0.4" ${st}/>
    ${txt(x0 + L / 2 + wx / 2, y0 - D - wy / 2 + 3, top, { size: top === 'area' ? 8.5 : 9.5, font: top === 'area' ? 'Poppins' : 'Pagella', fill: top === 'area' ? BLUE : INK })}
    ${vArrow(H[0] + 6, C[1], H[1], PLUM)}
    ${txt(H[0] + 10, (C[1] + H[1]) / 2 + 3, dep, { size: dep === 'depth' ? 8 : 9.5, anchor: 'start', fill: PLUM, font: dep === 'depth' ? 'Poppins' : 'Pagella' })}
    ${len ? txt(x0 + L / 2, y0 + 10, len, { size: 9.5 }) : ''}
    ${wid ? txt(x0 + wx / 2 - 3, y0 - D - wy / 2 + 2, wid, { size: 9.5, anchor: 'end' }) : ''}
  </svg>`;
};

// One strip with one curved side, for the trapezoidal rule (not to scale)
const stripSvg = (df, dl, hLab, { w = '38mm', note = '' } = {}) => {
  const x0 = 30, base = 56, span = 72, k = 36 / Math.max(df, dl);
  const P0 = [x0, +(base - k * df).toFixed(1)], P1 = [x0 + span, +(base - k * dl).toFixed(1)], c = span / 3;
  return `
  <svg width="${w}" viewBox="0 0 132 ${note ? 84 : 76}">
    <path d="M${x0} ${base} L${P0[0]} ${P0[1]} C${P0[0] + c} ${P0[1] - 12}, ${P1[0] - c} ${P1[1] - 12}, ${P1[0]} ${P1[1]} L${P1[0]} ${base} Z" fill="${LBLUE}" fill-opacity="0.45" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <line x1="${x0}" y1="${base}" x2="${P0[0]}" y2="${P0[1]}" stroke="${BLUE}" stroke-width="2"/>
    <line x1="${P1[0]}" y1="${base}" x2="${P1[0]}" y2="${P1[1]}" stroke="${BLUE}" stroke-width="2"/>
    ${txt(x0 - 4, (base + P0[1]) / 2 + 3.5, `${df} m`, { size: 10.5, anchor: 'end' })}
    ${txt(P1[0] + 4, (base + P1[1]) / 2 + 3.5, `${dl} m`, { size: 10.5, anchor: 'start' })}
    ${tick(x0, base + 7, PLUM)}${tick(P1[0], base + 7, PLUM)}${hArrow(x0, P1[0], base + 7, PLUM)}
    ${txt(x0 + span / 2, base + 17.5, hLab, { size: 10.5, fill: PLUM })}
    ${note ? txt(x0 + span / 2, (base + Math.max(P0[1], P1[1])) / 2 + 3, note, { size: 7.5, font: 'Poppins', fill: '#2a5d96' }) : ''}
  </svg>`;
};

// Rain falling on a flat roof: a thin layer of water on top
const rainSvg = (() => {
  const x0 = 12, y0 = 58, L = 62, wx = 22, wy = 13, T = 6, R = 3.2;
  const top = (dy) => [[x0, y0 - T - dy], [x0 + L, y0 - T - dy], [x0 + L + wx, y0 - T - wy - dy], [x0 + wx, y0 - T - wy - dy]];
  const t0 = top(0), t1 = top(R);
  const st = `stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"`;
  let drops = '';
  for (let i = 0; i < 9; i++) {
    const x = x0 + 10 + i * 9.5, y = 6 + (i % 3) * 7;
    drops += `<line x1="${x}" y1="${y}" x2="${x - 2.2}" y2="${y + 6}" stroke="${LBLUE}" stroke-width="1.1" stroke-linecap="round"/>`;
  }
  return `
  <svg width="36mm" viewBox="0 0 136 70">
    ${drops}
    <polygon points="${pts([x0, y0 - T], [x0 + L, y0 - T], [x0 + L, y0], [x0, y0])}" fill="${SAND}" ${st}/>
    <polygon points="${pts([x0 + L, y0 - T], [x0 + L + wx, y0 - T - wy], [x0 + L + wx, y0 - wy], [x0 + L, y0])}" fill="${SAND}" ${st}/>
    <polygon points="${pts(t0[0], t0[1], t1[1], t1[0])}" fill="${BLUE}" fill-opacity="0.75" stroke="none"/>
    <polygon points="${pts(t0[1], t0[2], t1[2], t1[1])}" fill="${BLUE}" fill-opacity="0.9" stroke="none"/>
    <polygon points="${pts(...t1)}" fill="${LBLUE}" ${st}/>
    ${txt(x0 + L / 2 + wx / 2, y0 - T - R - wy / 2 + 3, '60 m<tspan font-size="6" dy="-3.5">2</tspan>', { size: 9.5 })}
    <line x1="${x0 + L + wx + 2}" y1="${t1[2][1] + 1.5}" x2="${x0 + L + wx + 9}" y2="${t1[2][1] - 4}" stroke="${PLUM}" stroke-width="0.5"/>
    ${txt(x0 + L + wx + 10, t1[2][1] - 4, '15 mm', { size: 9, anchor: 'start', fill: PLUM })}
  </svg>`;
})();

// Underestimate or overestimate: the rule uses the straight dashed line, not the curve
const underOverSvg = (kind) => {
  const x0 = 24, x1 = 98, base = 52, P0 = [x0, 28], P1 = [x1, 22];
  const up = kind === 'out';
  const curve = up ? `C${x0 + 22} 4, ${x1 - 26} 2, ${x1} ${P1[1]}` : `C${x0 + 24} 46, ${x1 - 26} 44, ${x1} ${P1[1]}`;
  const land = `M${x0} ${base} L${x0} ${P0[1]} ${curve} L${x1} ${base} Z`;
  const gap = `M${x0} ${P0[1]} ${curve} Z`; // between the curve and the straight line
  return `
  <svg width="38mm" viewBox="0 0 124 62">
    <defs><pattern id="l07hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3.2" stroke="${PLUM}" stroke-width="0.8"/></pattern></defs>
    <path d="${land}" fill="${BEIGE}" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="${gap}" fill="${up ? PLUM : 'url(#l07hatch)'}" fill-opacity="${up ? 0.28 : 0.7}" stroke="none"/>
    <line x1="${x0}" y1="${P0[1]}" x2="${x1}" y2="${P1[1]}" stroke="${BLUE}" stroke-width="1" stroke-dasharray="2.6 1.8"/>
    <line x1="${x0}" y1="${base}" x2="${x0}" y2="${P0[1]}" stroke="${BLUE}" stroke-width="2"/>
    <line x1="${x1}" y1="${base}" x2="${x1}" y2="${P1[1]}" stroke="${BLUE}" stroke-width="2"/>
    ${dsub(x0 - 4, 44, 'f', { anchor: 'end' })}${dsub(x1 + 4, 41, 'l', { anchor: 'start' })}
    ${up ? txt(61, 19.5, 'left out', { size: 8, font: 'Poppins', fill: PLUM }) : txt(61, 48.5, 'land', { size: 8, font: 'Poppins', fill: '#8a8a8a' })}
    ${up ? txt(61, 43, 'land', { size: 8, font: 'Poppins', fill: '#8a8a8a' }) : `<rect x="46" y="13.2" width="30" height="9" rx="1.5" fill="#fff"/>${txt(61, 20, 'extra', { size: 8, font: 'Poppins', fill: PLUM })}`}
  </svg>`;
};

// Extended response: the pond from Lesson 6, with the straight lines the trapezoidal rule uses
const pondSvg = `
  <svg width="38mm" viewBox="0 0 108 86">
    <path d="M26 66 L74 66 L74 42 A24 24 0 0 0 26 42 Z" fill="${LBLUE}" fill-opacity="0.45" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <polyline points="26,42 50,18 74,42" fill="none" stroke="${BLUE}" stroke-width="1.1" stroke-dasharray="2.6 1.8"/>
    <line x1="50" y1="66" x2="50" y2="18" stroke="${BLUE}" stroke-width="0.7" stroke-dasharray="1.4 1.4"/>
    <line x1="26" y1="66" x2="26" y2="42" stroke="${BLUE}" stroke-width="2"/>
    <line x1="74" y1="66" x2="74" y2="42" stroke="${BLUE}" stroke-width="2"/>
    ${corner(26, 66, 1, -1)}${corner(74, 66, -1, -1)}
    ${txt(22, 57.5, '4 m', { size: 10, anchor: 'end' })}
    ${txt(53, 52, '8 m', { size: 10, anchor: 'start' })}
    ${txt(78, 57.5, '4 m', { size: 10, anchor: 'start' })}
    ${tick(26, 72, PLUM)}${tick(50, 72, PLUM)}${tick(74, 72, PLUM)}${hArrow(26, 50, 72, PLUM)}${hArrow(50, 74, 72, PLUM)}
    ${txt(38, 83, '4 m', { size: 9.5, fill: PLUM })}${txt(62, 83, '4 m', { size: 9.5, fill: PLUM })}
  </svg>`;

// ---------------------------------------------------------------- lesson 7
const m2 = 'm<sup>2</sup>', m3 = 'm<sup>3</sup>';
const p1 = {
  cls: 'l07',
  html: `
  ${banner({ num: '7', title: 'Volume of water', sub: 'Key idea: Volume of water • Textbook 1F • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Volume of water', `
    <div class="fig" style="float:right; width:44mm; margin:-1mm 0 0 4mm">${poolSvg()}<div class="cap">water with the same depth everywhere</div></div>
    <p class="mb0">When water has the <b>same depth</b> everywhere, its volume is the <b>area</b> of its surface times its <b>depth</b>.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b><i>V</i> = area × depth.</b> The reference sheet writes <i>V</i> = <i>Ah</i>, where <i>h</i> is the depth.</li>
      <li>We write <b>depth</b> so it is not mixed up with the <i>h</i> in the trapezoidal rule.</li>
      <li>Find the <b>area</b> first: use a formula, or the trapezoidal rule for a curved side.</li>
      <li>Rain on an area works the same way: volume = area × rainfall depth.</li>
    </ul>`)}

  <div class="grid2" style="margin-top:4.5mm; column-gap:6mm; grid-template-columns: 1fr 84mm">
    <div>
      <div class="h2">Rainfall</div>
      <ul class="dots mb0">
        <li>Rain is measured in <b>millimetres</b>. Change it to <b>metres</b> first: <b>÷ 1000</b>.</li>
        <li>Volume of rain = area × rainfall depth, in m<sup>3</sup>.</li>
        <li>Then change m<sup>3</sup> to litres: <b>× 1000</b>.</li>
      </ul>
      <div class="h3">Underestimate or overestimate?</div>
      <p class="mb0">The trapezoidal rule uses <b>straight</b> lines. If the real edge curves <b>out</b>, the answer is too small (<b>underestimate</b>). If it curves <b>in</b>, the answer is too big (<b>overestimate</b>).</p>
    </div>
    <div>
      <div class="h2">Changing units</div>
      <table class="t compact">
        <tr><th>Change</th><th>How</th><th>Example</th></tr>
        <tr><td>m<sup>3</sup> → L</td><td>× 1000</td><td>2 m<sup>3</sup> = 2 × 1000 = 2000 L</td></tr>
        <tr><td>L → m<sup>3</sup></td><td>÷ 1000</td><td>500 L = 500 ÷ 1000 = 0.5 m<sup>3</sup></td></tr>
        <tr><td>mm → m</td><td>÷ 1000</td><td>18 mm = 18 ÷ 1000 = 0.018 m</td></tr>
      </table>
      <p class="mb0" style="margin-top:1.2mm"><b>1 m<sup>3</sup> = 1000 L</b> &emsp; <b>1 m = 1000 mm</b> &emsp; m<sup>2</sup> × m = m<sup>3</sup></p>
    </div>
  </div>

  <div style="margin-top:4.5mm">${checklist(['find the volume of water from a plan, using the trapezoidal rule when necessary.', 'find the volume of rain that falls on an area, in m<sup>3</sup> and in litres.', 'say whether a trapezoidal rule estimate is an underestimate or an overestimate.'])}</div>

  ${we('7.1', 'Volume = area × depth', 'A swimming pool is 10 m long and 4 m wide. The water is 1.5 m deep everywhere. Find the volume of water &ensp;(a) in m<sup>3</sup> &ensp;(b) in litres.', `
    <div class="grid2" style="grid-template-columns: 1fr 42mm; column-gap: 4mm; align-items:center; --wc: 46mm">
      <div>
        <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
        ${sol('(a)', [
          [`area = 10 × 4 = 40 ${m2}`, 'The surface is a rectangle: <b>length × width</b>.'],
          ['<i>V</i> = area × depth', 'The depth is the <b>same</b> everywhere.'],
          ['= 40 × 1.5', 'The depth is 1.5 m.'],
          [`= 60 ${m3}`, 'm<sup>2</sup> × m gives <b>cubic</b> metres, m<sup>3</sup>.'],
        ])}
        ${sol('(b)', [
          ['60 × 1000', '1 m<sup>3</sup> = 1000 L, so <b>multiply</b> by 1000.'],
          ['= 60&#8239;000 L', ''],
        ])}
      </div>
      <div class="fig">${poolSvg({ w: '42mm', top: sq(40), len: '10 m', wid: '4 m', dep: '1.5 m' })}<div class="cap">the water in the pool</div></div>
    </div>`, 'margin-top:4.5mm')}`,
};

const p2 = {
  cls: 'l07',
  html: `
  ${we('7.2', 'Trapezoidal rule, then volume', 'This dam has one curved side and is 2 m deep everywhere. Estimate &ensp;(a) its area &ensp;(b) its volume.', `
    <div style="--wc: 52mm">
      <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
      <div class="partfig">
        <div>${sol('(a)', [
          [`<i>A</i> ≈ ${frac('10', '2')}(16 + 24)`, 'Trapezoidal rule: <i>h</i> = 10, <i>d<sub>f</sub></i> = 16, <i>d<sub>l</sub></i> = 24.'],
          ['= 5 × 40', 'Do 10 ÷ 2 and the <b>bracket</b> first.'],
          [`= 200 ${m2}`, 'This is the area of the water’s <b>surface</b>.'],
        ])}${sol('(b)', [
          ['<i>V</i> = area × depth', 'The depth is 2 m. It is <b>not</b> <i>h</i> = 10.'],
          ['= 200 × 2', 'Use the area from part (a).'],
          [`= 400 ${m3}`, 'm<sup>2</sup> × m gives m<sup>3</sup>.'],
        ])}</div>
        <div class="fig">${stripSvg(16, 24, '10 m', { w: '38mm', note: '2 m deep' })}<div class="cap">plan of the dam (not to scale)</div></div>
      </div>
    </div>`)}

  ${we('7.3', 'Volume of rain', '15 mm of rain falls on a shed roof of area 60 m<sup>2</sup>. Find the volume of rain &ensp;(a) in m<sup>3</sup> &ensp;(b) in litres.', `
    <div style="--wc: 52mm">
      <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
      <div class="partfig">
        <div>${sol('(a)', [
          ['15 mm = 15 ÷ 1000 = 0.015 m', 'Change mm to m: <b>divide</b> by 1000.'],
          ['<i>V</i> = 60 × 0.015', 'Area × rainfall depth. Both are in <b>metres</b>.'],
          [`= 0.9 ${m3}`, 'Rain is a very <b>thin</b> layer of water.'],
        ])}${sol('(b)', [
          ['0.9 × 1000', '1 m<sup>3</sup> = 1000 L, so <b>multiply</b> by 1000.'],
          ['= 900 L', 'A tank under the roof could collect 900 L.'],
        ])}</div>
        <div class="fig">${rainSvg}<div class="cap">15 mm of rain on the roof</div></div>
      </div>
    </div>`, 'margin-top:2.5mm')}

  ${we('7.4', 'Underestimate or overestimate?', 'The trapezoidal rule is used for each block. Is the estimate an underestimate or an overestimate?', `
    <div style="--wc: 44mm">
      <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
      <div class="partfig">
        <div>${sol('(a)', [
          ['rule uses the dashed line', 'The rule joins the ends with a <b>straight</b> line.'],
          ['the curve is <b>outside</b> it', 'So the rule leaves out the shaded land.'],
          ['underestimate', 'Too small. A volume from it is too small too.'],
        ])}</div>
        <div class="fig">${underOverSvg('out')}</div>
      </div>
      <div class="partfig sep">
        <div>${sol('(b)', [
          ['the curve is <b>inside</b> it', 'So the rule adds the hatched part: not land.'],
          ['overestimate', 'Too big. A volume from it is too big too.'],
        ])}</div>
        <div class="fig">${underOverSvg('in')}</div>
      </div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 7', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, `How many litres are in 3&nbsp;${m3}?`, ['30 L', '300 L', '3000 L', '0.003 L'], { see: 'Key idea', h: 15.5 })}</div>
    <div>${mc(2, 'What is 25&nbsp;mm in metres?', ['2.5 m', '0.025 m', '0.25 m', '25&#8239;000 m'], { see: 'Example 7.3', h: 15.5 })}</div>
    <div>${mc(3, `A pond has a surface area of 40&nbsp;${m2} and is 0.5&nbsp;m deep. Find its volume. <span class="hint nw">Hint: area × depth.</span>`, [`80 ${m3}`, `40.5 ${m3}`, `20&#8239;000 ${m3}`, `20 ${m3}`], { see: 'Example 7.1', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l07',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Change each one to the unit shown. <span class="hint">Hint: × 1000 or ÷ 1000.</span>', { see: 'Key idea', parts: [`5 ${m3} to litres`, `2500 L to ${m3}`, '40 mm to metres'], h: 22, split: true })}
  ${q(2, 'A pool is 8&nbsp;m long and 5&nbsp;m wide. The water is 2&nbsp;m deep everywhere. <span class="hint">Hint: <span class="nw">area = 8 × 5</span>.</span>', { see: 'Example 7.1', parts: ['Find the area of the surface.', 'Find the volume of water.', 'Change the volume to litres.'], h: 27, split: true })}
  ${q(3, 'A body of water has one curved side. Its measurements are <span class="nw"><i>h</i> = 6 m</span> (the textbook writes <span class="nw"><i>b</i> = 6 m</span>), <span class="nw"><i>d<sub>f</sub></i> = 20 m</span> and <span class="nw"><i>d<sub>l</sub></i> = 40 m</span>. The water is 2.5&nbsp;m deep everywhere. <span class="hint">Hint: the depth is 2.5 m, not <i>h</i>.</span>', { see: 'Example 7.2', parts: ['Use the trapezoidal rule to find the area.', 'Find the volume of water, in m<sup>3</sup>.'], h: 29, split: true })}
  ${q(4, 'Now 9&nbsp;mm of rain falls on the same area as in Question 3.', { see: 'Example 7.3', parts: ['Change 9 mm to metres.', 'Find the volume in m<sup>3</sup>.', 'Change it to litres.'], h: 27, split: true })}

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `<div class="fig" style="float:right; width:40mm; margin:-2mm 0 0 4mm">${pondSvg}<div class="cap">the dashed lines are the ones the trapezoidal rule uses</div></div>A concrete fish pond is a rectangle with a semicircle on one end. Using the trapezoidal rule, its area is about 48&nbsp;${m2}. The water is 1.5&nbsp;m deep everywhere.`, { see: 'Examples 7.1 and 7.4', cols: 1, parts: [
    'Find the volume of water in the pond, in m<sup>3</sup>.',
    'How many litres of water are needed to fill the pond? <span class="hint">Hint: 1 m<sup>3</sup> = 1000 L.</span>',
    'Is your answer to (b) an underestimate or an overestimate? Explain. <span class="hint">Hint: compare the dashed lines with the curved edge.</span>',
  ], h: 34, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 7 &nbsp;Volume of water</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> C &emsp;<b>2</b> B &nbsp;(<span class="nw">25 ÷ 1000 = 0.025 m)</span></p>
    <p><b>3</b> D &nbsp;(<span class="nw">40 × 0.5 = 20 ${m3})</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 5000 L</span>&nbsp; <span class="nw">(b) 2.5 ${m3}</span>&nbsp; <span class="nw">(c) 0.04 m</span></p>
    <p><b>2</b> <span class="nw">(a) 8 × 5 = 40 ${m2}</span>&nbsp; <span class="nw">(b) 40 × 2 = 80 ${m3}</span>&nbsp; <span class="nw">(c) 80&#8239;000 L</span></p>
    <p><b>3</b> <span class="nw">(a) 3 × (20 + 40) = 180 ${m2}</span>&nbsp; <span class="nw">(b) 180 × 2.5 = 450 ${m3}</span></p>
    <p><b>4</b> <span class="nw">(a) 9 ÷ 1000 = 0.009 m</span>&nbsp; <span class="nw">(b) 180 × 0.009 = 1.62 ${m3}</span>&nbsp; <span class="nw">(c) 1620 L</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">48 × 1.5 = 72 ${m3}</span><br>(b) <span class="nw">72 × 1000 = 72&#8239;000 L</span><br>(c) underestimate: the dashed lines are inside the curved edge, so the rule leaves out some of the pond.</p>
`;

// Superscripts must not push lines apart; fractions inside worked examples are a little smaller.
export const css = `
.l07 sup { font-size: 70%; line-height: 0; vertical-align: 0; position: relative; top: -.45em; }
.l07 sub { font-size: 70%; line-height: 0; vertical-align: 0; position: relative; top: .3em; }
.l07 .steps .frac { font-size: 84%; }
.l07 .partfig { display: grid; grid-template-columns: 1fr var(--fc, 40mm); column-gap: 4mm; align-items: center; }
.l07 .partfig.sep { border-top: .25mm dashed #cfcfcf; padding-top: 1.8mm; margin-top: 1.8mm; }
.l07 .partfig .sol + .sol { margin-top: 1.4mm; }
`;
