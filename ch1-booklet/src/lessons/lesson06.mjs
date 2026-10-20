// Lesson 6 Perimeter and area of land (textbook 1F). Follows the Lesson 1 model.
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
    u: [[x, y], [x - w, y + s], [x + w, y + s]] }[dir];
  return `<polygon points="${p.map((a) => a.map((v) => +v.toFixed(2)).join(',')).join(' ')}" fill="${c}"/>`;
};
const hArrow = (x1, x2, y, c = INK) => `<line x1="${x1 + 2}" y1="${y}" x2="${x2 - 2}" y2="${y}" stroke="${c}" stroke-width="0.6"/>${head(x1, y, 'l', c)}${head(x2, y, 'r', c)}`;
const tick = (x, y, c = INK) => `<line x1="${x}" y1="${y - 2.2}" x2="${x}" y2="${y + 2.2}" stroke="${c}" stroke-width="0.5"/>`;
const corner = (x, y, dx, dy, s = 3.2) => `<path d="M${x + dx * s} ${y} L${x + dx * s} ${y + dy * s} L${x} ${y + dy * s}" fill="none" stroke="${INK}" stroke-width="0.45"/>`;

// Key idea: a block of land with one curved side
const blockSvg = `
  <svg width="42mm" viewBox="0 0 132 80">
    <path d="M20 60 L112 60 L112 16 C84 2, 44 8, 20 30 Z" fill="${BEIGE}" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <line x1="20" y1="60" x2="20" y2="30" stroke="${BLUE}" stroke-width="2"/>
    <line x1="112" y1="60" x2="112" y2="16" stroke="${BLUE}" stroke-width="2"/>
    ${dsub(14, 49, 'f', { size: 11, anchor: 'end' })}
    ${dsub(118, 42, 'l', { size: 11, anchor: 'start' })}
    ${tick(20, 68, PLUM)}${tick(112, 68, PLUM)}${hArrow(20, 112, 68, PLUM)}
    ${txt(66, 78.5, 'h', { size: 11, fill: PLUM, italic: true })}
    ${txt(64, 42, 'curved side', { size: 7, font: 'Poppins', fill: '#8a8a8a' })}
    <path d="M64 35 L64 15" stroke="#9a9a9a" stroke-width="0.5"/>${head(64, 12, 'u', '#9a9a9a', 2.4)}
  </svg>`;

// Examples 6.1 and 6.3: plan of a block, 1 cm on the plan = 11 units. Sides 6, 4, 3 and 5 cm (60, 40, 30, 50 m).
const planSvg = ({ labs = ['6 cm', '4 cm', '3 cm', '5 cm'], split = false, w = '39mm' } = {}) => {
  const u = 11, x0 = 28, y0 = 60;
  const BL = [x0, y0], BR = [x0 + 6 * u, y0], TR = [x0 + 3 * u, y0 - 4 * u], TL = [x0, y0 - 4 * u];
  return `
  <svg width="${w}" viewBox="0 0 122 72">
    <polygon points="${[BL, BR, TR, TL].map((p) => p.join(',')).join(' ')}" fill="${BEIGE}" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    ${split ? `<line x1="${TR[0]}" y1="${TR[1]}" x2="${TR[0]}" y2="${y0}" stroke="${BLUE}" stroke-width="0.8" stroke-dasharray="2.2 1.6"/>${corner(TR[0], y0, 1, -1)}
    ${txt(x0 + 1.5 * u, y0 - 2 * u + 2.5, 'rectangle', { size: 6.5, font: 'Poppins', fill: '#8a8a8a' })}
    ${txt(TR[0] + 13.5, y0 - 3.5, 'triangle', { size: 5.6, font: 'Poppins', fill: '#8a8a8a' })}` : ''}
    ${corner(x0, y0, 1, -1)}${corner(x0, TL[1], 1, 1)}
    ${txt(x0 + 3 * u, y0 + 10, labs[0], { size: 10 })}
    ${txt(x0 - 3, y0 - 2 * u + 3.5, labs[1], { size: 10, anchor: 'end' })}
    ${txt(x0 + 1.5 * u, TL[1] - 4, labs[2], { size: 10 })}
    ${txt(x0 + 4.5 * u + 4, y0 - 2 * u - 1, labs[3], { size: 10, anchor: 'start' })}
  </svg>`;
};

// Grid of squares with a paddock on it. poly: corners in grid units (y up), counterclockwise, convex.
// Squares completely inside are blue; the half squares on the edge show the sand colour.
const gridSvg = (poly, { cols, rows, s = 9, w }) => {
  const ox = 4 + s, oy = 4 + (rows - 1) * s; // grid point (0,0) sits one square in from the bottom-left
  const X = (gx) => ox + gx * s, Y = (gy) => oy - gy * s;
  const inside = ([px, py]) => poly.every((a, i) => {
    const b = poly[(i + 1) % poly.length];
    return (b[0] - a[0]) * (py - a[1]) - (b[1] - a[1]) * (px - a[0]) >= -1e-9;
  });
  let full = '';
  for (let gx = -1; gx < cols - 1; gx++) for (let gy = -1; gy < rows - 1; gy++) {
    if ([[gx, gy], [gx + 1, gy], [gx, gy + 1], [gx + 1, gy + 1]].every(inside)) full += `<rect x="${X(gx)}" y="${Y(gy + 1)}" width="${s}" height="${s}" fill="${LBLUE}"/>`;
  }
  let lines = '';
  for (let i = 0; i <= cols; i++) lines += `<line x1="${4 + i * s}" y1="4" x2="${4 + i * s}" y2="${4 + rows * s}" stroke="#c9c9c9" stroke-width="0.4"/>`;
  for (let j = 0; j <= rows; j++) lines += `<line x1="4" y1="${4 + j * s}" x2="${4 + cols * s}" y2="${4 + j * s}" stroke="#c9c9c9" stroke-width="0.4"/>`;
  const pts = poly.map(([gx, gy]) => `${X(gx)},${Y(gy)}`).join(' ');
  return `
  <svg width="${w}" viewBox="0 0 ${8 + cols * s} ${8 + rows * s}">
    <polygon points="${pts}" fill="${SAND}"/>
    ${full}${lines}
    <polygon points="${pts}" fill="none" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
  </svg>`;
};
const PADDOCK_EX = [[1, 0], [4, 0], [5, 1], [5, 2], [3, 4], [2, 4], [0, 2], [0, 1]]; // 12 full + 6 half squares
const PADDOCK_SA = [[0, 0], [2, 0], [4, 2], [4, 4], [2, 4], [0, 2]]; // 10 full + 4 half squares
const key = `<span class="sw" style="background:${LBLUE}"></span>full &ensp;<span class="sw" style="background:${SAND}"></span>half`;

// Example 6.3: a lawn, rectangle 20 m by 10 m with a semicircle on the right end (1 m = 3 units)
const lawnSvg = `
  <svg width="39mm" viewBox="0 0 120 60">
    <path d="M84 13 L24 13 L24 43 L84 43 A15 15 0 0 0 84 13 Z" fill="${BEIGE}" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="M84 43 A15 15 0 0 0 84 13" fill="none" stroke="${BLUE}" stroke-width="2"/>
    <line x1="84" y1="13" x2="84" y2="43" stroke="#9a9a9a" stroke-width="0.6" stroke-dasharray="2 1.6"/>
    ${corner(24, 43, 1, -1)}${corner(24, 13, 1, 1)}
    ${txt(54, 9, '20 m', { size: 10 })}
    ${txt(20, 31.5, '10 m', { size: 10, anchor: 'end' })}
    ${txt(54, 54, '20 m', { size: 10 })}
    ${txt(105, 50, 'curved', { size: 6.5, font: 'Poppins', fill: BLUE })}
    ${txt(105, 57, 'edge', { size: 6.5, font: 'Poppins', fill: BLUE })}
  </svg>`;

// Strips for the trapezoidal rule: ds = the measurements in metres (2 or 3); hLab = distance between them.
const stripsSvg = (ds, hLab, { w = '40mm' } = {}) => {
  const n = ds.length, x0 = 30, base = 58, span = n === 2 ? 72 : 88, dx = span / (n - 1);
  const k = 38 / Math.max(...ds);
  const P = ds.map((d, i) => [x0 + i * dx, +(base - k * d).toFixed(1)]);
  const c = dx / 3;
  let curve;
  if (n === 2) curve = `C${P[0][0] + c} ${P[0][1] - 12}, ${P[1][0] - c} ${P[1][1] - 12}, ${P[1][0]} ${P[1][1]}`;
  else {
    // a smooth curve (parabola) that passes through all three measurement tops
    const C = [P[1][0], +(2 * P[1][1] - (P[0][1] + P[2][1]) / 2).toFixed(1)];
    curve = `Q${C[0]} ${C[1]}, ${P[2][0]} ${P[2][1]}`;
  }
  const last = P[n - 1];
  const labs = ds.map((d, i) => {
    const [x, y] = P[i], my = (base + y) / 2 + 3.5;
    if (i === 0) return txt(x - 4, my, `${d} m`, { size: 10.5, anchor: 'end' });
    if (i === n - 1) return txt(x + 4, my, `${d} m`, { size: 10.5, anchor: 'start' });
    return txt(x + 3, my, `${d} m`, { size: 10.5, anchor: 'start' });
  }).join('');
  const mids = P.slice(1, -1).map(([x, y]) => `<line x1="${x}" y1="${base}" x2="${x}" y2="${y}" stroke="${BLUE}" stroke-width="1.2" stroke-dasharray="2.4 1.6"/>`).join('');
  const hs = P.slice(1).map(([x], i) => `${tick(P[i][0], base + 7, PLUM)}${tick(x, base + 7, PLUM)}${hArrow(P[i][0], x, base + 7, PLUM)}${txt((P[i][0] + x) / 2, base + 17.5, hLab, { size: 10.5, fill: PLUM })}`).join('');
  return `
  <svg width="${w}" viewBox="0 0 ${x0 + span + 30} 78">
    <path d="M${x0} ${base} L${P[0][0]} ${P[0][1]} ${curve} L${last[0]} ${base} Z" fill="${BEIGE}" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <line x1="${x0}" y1="${base}" x2="${P[0][0]}" y2="${P[0][1]}" stroke="${BLUE}" stroke-width="2"/>
    <line x1="${last[0]}" y1="${base}" x2="${last[0]}" y2="${last[1]}" stroke="${BLUE}" stroke-width="2"/>
    ${mids}${labs}${hs}
  </svg>`;
};

// Extended response: a pond, a rectangle 8 m wide and 4 m long with a semicircle on the end (1 m = 6 units)
const pondSvg = `
  <svg width="40mm" viewBox="0 0 108 86">
    <path d="M26 66 L74 66 L74 42 A24 24 0 0 0 26 42 Z" fill="${LBLUE}" fill-opacity="0.45" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <line x1="26" y1="42" x2="74" y2="42" stroke="#8a8a8a" stroke-width="0.5" stroke-dasharray="1.4 1.4"/>
    <line x1="26" y1="66" x2="26" y2="42" stroke="${BLUE}" stroke-width="2"/>
    <line x1="74" y1="66" x2="74" y2="42" stroke="${BLUE}" stroke-width="2"/>
    <line x1="50" y1="66" x2="50" y2="18" stroke="${BLUE}" stroke-width="1.2" stroke-dasharray="2.4 1.6"/>
    ${corner(26, 66, 1, -1)}${corner(74, 66, -1, -1)}
    ${txt(22, 57.5, '4 m', { size: 10, anchor: 'end' })}
    ${txt(53, 36, '8 m', { size: 10, anchor: 'start' })}
    ${txt(78, 57.5, '4 m', { size: 10, anchor: 'start' })}
    ${tick(26, 73, PLUM)}${tick(50, 73, PLUM)}${tick(74, 73, PLUM)}${hArrow(26, 50, 73, PLUM)}${hArrow(50, 74, 73, PLUM)}
    ${txt(38, 84, '4 m', { size: 10, fill: PLUM })}${txt(62, 84, '4 m', { size: 10, fill: PLUM })}
  </svg>`;

// ---------------------------------------------------------------- lesson 6
const half = frac('1', '2');
const m2 = 'm<sup>2</sup>';
const p1 = {
  cls: 'l06',
  html: `
  ${banner({ num: '6', title: 'Perimeter and area of land', sub: 'Key idea: Perimeter and area • Textbook 1F • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Perimeter and area of land', `
    <div class="fig" style="float:right; width:42mm; margin:-1.5mm 0 0 4mm">${blockSvg}<div class="cap">a block with one curved side</div></div>
    <p class="mb0"><b>Perimeter</b> is the distance <b>around</b> the outside. <b>Area</b> is the space <b>inside</b>, in m<sup>2</sup>.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b>Perimeter from a plan or an aerial photo</b> (a photo taken from above): multiply each side by the <b>scale</b>, then add.</li>
      <li><b>Estimate an area:</b> cover it with a grid of squares and <b>count</b> them.</li>
      <li><b>Calculate an area:</b> use a <b>formula</b> (rectangle, triangle, semicircle).</li>
      <li><b>One curved side?</b> The <b>trapezoidal rule</b> gives an approximate area (≈).</li>
    </ul>`)}

  <div class="grid2" style="margin-top:3.8mm; column-gap:6mm; grid-template-columns: 1fr 80mm">
    <div>
      <div class="h2">Formulas you need</div>
      <table class="t compact">
        <tr><th>Shape</th><th>Area</th><th>Perimeter</th></tr>
        <tr><td><b>Rectangle</b></td><td>length × width</td><td>add the 4 sides</td></tr>
        <tr><td><b>Triangle</b></td><td>${half} × base × height</td><td>add the 3 sides</td></tr>
        <tr><td><b>Semicircle</b></td><td>π<i>r</i><sup>2</sup> ÷ 2</td><td>curved edge = π<i>d</i> ÷ 2</td></tr>
      </table>
      <p class="mb0" style="margin-top:1.2mm">Semicircle = <b>half</b> a circle. &nbsp;<i>d</i> = diameter, &nbsp;<i>r</i> = <i>d</i> ÷ 2</p>
    </div>
    <div>
      <div class="h2">The trapezoidal rule</div>
      <div class="disp nw" style="margin:0 0 1.2mm"><i>A</i> ≈ ${frac('<i>h</i>', '2')}(<i>d<sub>f</sub></i> + <i>d<sub>l</sub></i>)</div>
      <ul class="dots mb0">
        <li><i>h</i> = distance between the two measurements (the textbook calls it <i>b</i>)</li>
        <li><i>d<sub>f</sub></i> = first measurement, &nbsp;<i>d<sub>l</sub></i> = last measurement</li>
        <li><b>Two strips:</b> <span class="nw"><i>A</i> ≈ ${frac('<i>h</i>', '2')}(<i>d</i><sub>1</sub> + <i>d</i><sub>2</sub>) + ${frac('<i>h</i>', '2')}(<i>d</i><sub>2</sub> + <i>d</i><sub>3</sub>)</span></li>
      </ul>
    </div>
  </div>

  <div style="margin-top:3.8mm">${checklist(['find the perimeter of land from a plan or an aerial photo, using the scale.', 'find an area by counting squares, with a formula, or with the trapezoidal rule.'])}</div>

  ${we('6.1', 'Perimeter from a plan', 'This plan of a block of land has the scale <span class="nw">1 cm = 10 m</span>. Find the real perimeter of the block.', `
    <div class="grid2" style="grid-template-columns: 1fr 40mm; column-gap: 4mm; align-items:center; --wc: 52mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['6 × 10 = 60 m, &ensp;4 × 10 = 40 m', '1 cm on the plan = 10 m, so <b>multiply</b> by 10.'],
          ['3 × 10 = 30 m, &ensp;5 × 10 = 50 m', 'Do the same for the other two sides.'],
          ['<i>P</i> = 60 + 40 + 30 + 50', '<b>Add</b> all four real sides.'],
          ['= 180 m', 'Check: 6 + 4 + 3 + 5 = 18 cm, and 18 × 10 = 180.'],
        ])}</div>
      </div>
      <div class="fig">${planSvg()}<div class="cap">plan, scale 1 cm = 10 m</div></div>
    </div>`, 'margin-top:4mm')}

  ${we('6.2', 'Estimating area by counting squares', 'A paddock is drawn on a grid. Each square is 10 m by 10 m. Estimate the area of the paddock.', `
    <div class="grid2" style="grid-template-columns: 1fr 40mm; column-gap: 4mm; align-items:center; --wc: 52mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['12 full + 6 halves', 'Count <b>full</b> (blue) and <b>half</b> (sand) squares.'],
          ['= 12 + 6 ÷ 2 = 15 squares', '<b>Two halves</b> make one whole square.'],
          [`1 square = 10 × 10 = 100 ${m2}`, 'Find the area of <b>one</b> square.'],
          ['<i>A</i> ≈ 15 × 100', 'Counting gives an <b>estimate</b>, so use ≈.'],
          [`= 1500 ${m2}`, ''],
        ])}</div>
      </div>
      <div class="fig">${gridSvg(PADDOCK_EX, { cols: 7, rows: 6, w: '33mm' })}<div class="cap">${key}</div></div>
    </div>`, 'margin-top:3.5mm')}`,
};

const p2 = {
  cls: 'l06',
  html: `
  ${we('6.3', 'Using the area formulas', 'Find (a) the area of the block in Example 6.1 &ensp;(b) the perimeter of the lawn &ensp;(c) the area of the lawn.', `
    <div style="--wc: 57mm; --fc: 36mm">
      <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
      <div class="partfig">
        <div>${sol('(a)', [
          [`rectangle = 30 × 40 = 1200 ${m2}`, 'Split at the dashed line. <b>Length × width</b>.'],
          ['triangle base = 60 − 30 = 30 m', 'The rest of the 60 m bottom side.'],
          [`triangle = ${half} × 30 × 40 = 600 ${m2}`, `<b>${half} × base × height</b>.`],
          ['<i>A</i> = 1200 + 600', '<b>Add</b> the two areas.'],
          [`= 1800 ${m2}`, 'Area is in <b>square</b> metres.'],
        ])}</div>
        <div class="fig">${planSvg({ labs: ['60 m', '40 m', '30 m', '50 m'], split: true, w: '36mm' })}<div class="cap">the block, real lengths</div></div>
      </div>
      <div class="partfig sep">
        <div>${sol('(b)', [
          ['curved edge = π × 10 ÷ 2 = 15.7 m', '<b>Half</b> of π × diameter. Use the π key.'],
          ['<i>P</i> = 20 + 10 + 20 + 15.7', 'Add the <b>outside</b> edges only.'],
          ['= 65.7 m', 'Do <b>not</b> add the dashed line.'],
        ])}${sol('(c)', [
          [`rectangle = 20 × 10 = 200 ${m2}`, 'Rectangle: length × width.'],
          ['<i>r</i> = 10 ÷ 2 = 5 m', 'The radius is <b>half</b> the diameter.'],
          [`semicircle = π × 5<sup>2</sup> ÷ 2 = 39.3 ${m2}`, '<b>Half</b> of π<i>r</i><sup>2</sup>. 39.26… rounds to 39.3.'],
          ['<i>A</i> = 200 + 39.3', '<b>Add</b> the two parts.'],
          [`= 239.3 ${m2}`, ''],
        ])}</div>
        <div class="fig">${lawnSvg.replace('width="39mm"', 'width="36mm"')}<div class="cap">the lawn: a rectangle and<br>a semicircle</div></div>
      </div>
    </div>`)}

  ${we('6.4', 'The trapezoidal rule', 'Use the trapezoidal rule to estimate the area of each block of land. &emsp;(a) one strip &emsp;(b) two strips', `
    <div style="--wc: 59mm">
      <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
      <div class="partfig">
        <div>${sol('(a)', [
          [`<i>A</i> ≈ ${frac('20', '2')}(35 + 45)`, '<i>h</i> = 20, <i>d<sub>f</sub></i> = 35, <i>d<sub>l</sub></i> = 45.'],
          ['= 10 × 80', 'Do 20 ÷ 2 and the <b>bracket</b> first.'],
          [`= 800 ${m2}`, ''],
        ])}</div>
        <div class="fig">${stripsSvg([35, 45], '20 m', { w: '33mm' })}</div>
      </div>
      <div class="partfig sep">
        <div>${sol('(b)', [
          [`<i>A</i> ≈ ${frac('20', '2')}(30 + 40) + ${frac('20', '2')}(40 + 36)`, 'Use the rule <b>twice</b>. 40 is in both.'],
          ['= 10 × 70 + 10 × 76', 'Do each ÷ 2 and each bracket.'],
          ['= 700 + 760', 'Multiply.'],
          [`= 1460 ${m2}`, '<b>Add</b> the two strips.'],
        ])}</div>
        <div class="fig">${stripsSvg([30, 40, 36], '20 m', { w: '39mm' })}</div>
      </div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 6', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'An aerial photo has the scale <span class="nw">1 cm = 20 m</span>. A fence is 6&nbsp;cm on the photo. How long is it really?', ['0.3 m', '120 m', '26 m', '1200 m'], { see: 'Example 6.1', h: 15.5 })}</div>
    <div>${mc(2, `A paddock covers 8 full and 4 half squares. Each square is 100&nbsp;${m2}. What is its area?`, [`800 ${m2}`, `1200 ${m2}`, `1000 ${m2}`, `600 ${m2}`], { see: 'Example 6.2', h: 15.5 })}</div>
    <div>${mc(3, 'Use the trapezoidal rule: <span class="nw"><i>h</i> = 10 m,</span> <span class="nw"><i>d<sub>f</sub></i> = 18 m,</span> <span class="nw"><i>d<sub>l</sub></i> = 22 m.</span> <span class="hint nw">Hint: 10 ÷ 2 = 5.</span>', [`400 ${m2}`, `45 ${m2}`, `110 ${m2}`, `200 ${m2}`], { see: 'Example 6.4', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l06',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'An aerial photo of a rectangular block has the scale <span class="nw">1 cm = 20 m</span>. On the photo the block is 4&nbsp;cm long and 3&nbsp;cm wide. Find the real lengths. <span class="hint">Hint: real length = photo length × 20.</span>', { see: 'Examples 6.1 and 6.3', parts: ['Find the length and width.', 'Find the perimeter.', 'Find the area.'], h: 26, split: true })}
  <div class="grid2 qpair">
    <div>${q(2, `<div class="fig" style="float:right; margin:0 0 1mm 3mm">${gridSvg(PADDOCK_SA, { cols: 6, rows: 6, w: '27mm' })}</div>Each square on this grid is 10&nbsp;m by 10&nbsp;m. <span class="hint">Hint: two halves make one square.</span>`, { see: 'Example 6.2', cols: 1, parts: ['How many full squares?', 'How many half squares?', 'Estimate the area.'], h: 30, split: true })}</div>
    <div>${q(3, 'A garden bed is a semicircle with a diameter of 6&nbsp;m. Find each one, to 1 decimal place. <span class="hint">Hint: the radius is <span class="nw">6 ÷ 2 = 3 m</span>.</span>', { see: 'Example 6.3', cols: 1, parts: ['the curved edge', 'the perimeter (add the straight edge)', 'the area'], h: 30, split: true })}</div>
  </div>
  <div class="grid2 qpair">
    <div>${q(4, `<div class="fig" style="float:right; margin:-1mm 0 1mm 2mm">${stripsSvg([25, 35], '30 m', { w: '38mm' })}</div>Use the trapezoidal rule to estimate the area of this block.`, { see: 'Example 6.4', h: 26 })}</div>
    <div>${q(5, `<div class="fig" style="float:right; margin:-1mm 0 1mm 2mm">${stripsSvg([12, 18, 14], '10 m', { w: '42mm' })}</div>Use the trapezoidal rule <b>twice</b> to estimate the area of this block.`, { see: 'Example 6.4', h: 26 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `<div class="fig" style="float:right; width:42mm; margin:-2mm 0 0 4mm">${pondSvg}</div>A concrete fish pond is a rectangle with a semicircle on one end. The rectangle is 8&nbsp;m wide and 4&nbsp;m long, so the semicircle has a diameter of 8&nbsp;m. Give answers to 1 decimal place.`, { see: 'Examples 6.3 and 6.4', cols: 1, parts: [
    'Find the length of the curved edge. <span class="hint">Hint: <span class="nw">π × 8 ÷ 2</span>.</span>',
    'Find the perimeter of the pond.',
    `Use the trapezoidal rule twice, with the measurements shown, to estimate the area of the pond. <span class="hint">Hint: <span class="nw"><i>A</i> ≈ ${frac('4', '2')}(4 + 8) + ${frac('4', '2')}(8 + 4)</span>.</span>`,
  ], h: 30, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 6 &nbsp;Perimeter and area of land</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> B &nbsp;(<span class="nw">6 × 20 = 120 m)</span></p>
    <p><b>2</b> C &nbsp;(<span class="nw">8 + 4 ÷ 2 = 10 squares,</span> <span class="nw">10 × 100 = 1000 ${m2})</span></p>
    <p><b>3</b> D &nbsp;(<span class="nw">5 × (18 + 22) = 5 × 40</span> <span class="nw">= 200 ${m2})</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 4 × 20 = 80 m,</span> <span class="nw">3 × 20 = 60 m</span>&nbsp; <span class="nw">(b) 80 + 60 + 80 + 60 = 280 m</span>&nbsp; <span class="nw">(c) 80 × 60 = 4800 ${m2}</span></p>
    <p><b>2</b> <span class="nw">(a) 10</span>&nbsp; <span class="nw">(b) 4</span>&nbsp; <span class="nw">(c) 10 + 4 ÷ 2 = 12 squares,</span> <span class="nw">12 × 100 = 1200 ${m2}</span></p>
    <p><b>3</b> <span class="nw">(a) π × 6 ÷ 2 = 9.4 m</span>&nbsp; <span class="nw">(b) 9.4 + 6 = 15.4 m</span>&nbsp; <span class="nw">(c) π × 3<sup>2</sup> ÷ 2 = 14.1 ${m2}</span></p>
    <p><b>4</b> <span class="nw">15 × (25 + 35) = 15 × 60</span> <span class="nw">= 900 ${m2}</span></p>
    <p><b>5</b> <span class="nw">5 × (12 + 18) + 5 × (18 + 14)</span> <span class="nw">= 150 + 160 = 310 ${m2}</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">π × 8 ÷ 2 = 12.6 m</span><br>(b) <span class="nw">8 + 4 + 4 + 12.6 = 28.6 m</span><br>(c) <span class="nw">2 × 12 + 2 × 12</span> <span class="nw">= 24 + 24 = 48 ${m2}</span></p>
`;

// Superscripts must not push lines apart; fractions inside worked examples are a little smaller.
export const css = `
.l06 sup { font-size: 70%; line-height: 0; vertical-align: 0; position: relative; top: -.45em; }
.l06 sub { font-size: 70%; line-height: 0; vertical-align: 0; position: relative; top: .3em; }
.l06 .steps .frac { font-size: 84%; }
.l06 .sw { display: inline-block; width: 2.4mm; height: 2.4mm; border: .2mm solid #9a9a9a; vertical-align: -.3mm; margin: 0 .8mm 0 0; }
.l06 .partfig { display: grid; grid-template-columns: 1fr var(--fc, 40mm); column-gap: 4mm; align-items: center; }
.l06 .partfig.sep { border-top: .25mm dashed #cfcfcf; padding-top: 1.8mm; margin-top: 1.8mm; }
.l06 .partfig .sol + .sol { margin-top: 1.4mm; }
`;
