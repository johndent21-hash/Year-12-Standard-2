// Lesson 5 Plans and elevations (textbook 1E). Follows the Lesson 1 model.
import { r, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';
import { LESSONS } from '../meta.mjs';

const KEY_PAGE = LESSONS[4].start; // page 1 of this lesson holds the symbol key
const INK = '#3d3d3d';

// ---------------------------------------------------------------- floor-plan symbols
// Walls are solid bars; openings are gaps in them.
const wallH = (x1, x2, y, t = 1.3) => `<rect x="${x1}" y="${y - t / 2}" width="${x2 - x1}" height="${t}" fill="${INK}"/>`;
const wallV = (x, y1, y2, t = 1.3) => `<rect x="${x - t / 2}" y="${y1}" width="${t}" height="${y2 - y1}" fill="${INK}"/>`;
// Door: a leaf from the hinge, and an arc showing the swing
const door = (hx, hy, lx, ly, ax, ay, sweep) => {
  const rad = Math.hypot(lx - hx, ly - hy);
  return `<line x1="${hx}" y1="${hy}" x2="${lx}" y2="${ly}" stroke="${INK}" stroke-width="0.7"/><path d="M${lx} ${ly} A${rad} ${rad} 0 0 ${sweep} ${ax} ${ay}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
};
// Window: thin double line across a gap in the wall
const windowH = (x1, x2, y, t = 1.3) => `<rect x="${x1}" y="${y - t / 2}" width="${x2 - x1}" height="${t}" fill="#fff" stroke="${INK}" stroke-width="0.3"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${INK}" stroke-width="0.3"/>`;
const windowV = (x, y1, y2, t = 1.3) => `<rect x="${x - t / 2}" y="${y1}" width="${t}" height="${y2 - y1}" fill="#fff" stroke="${INK}" stroke-width="0.3"/><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${INK}" stroke-width="0.3"/>`;
// Sliding door: two overlapping panels in a gap
const slideH = (x1, x2, y) => { const w = (x2 - x1) * 0.56; return `<rect x="${x1}" y="${y - 1}" width="${w}" height="0.7" fill="#fff" stroke="${INK}" stroke-width="0.3"/><rect x="${x2 - w}" y="${y + 0.3}" width="${w}" height="0.7" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`; };
const slideV = (x, y1, y2) => { const h = (y2 - y1) * 0.56; return `<rect x="${x - 1}" y="${y1}" width="0.7" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.3"/><rect x="${x + 0.3}" y="${y2 - h}" width="0.7" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`; };
const bath = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><rect x="${x + 1.1}" y="${y + 1.1}" width="${w - 2.2}" height="${h - 2.2}" rx="${Math.min(w, h) / 2.8}" fill="none" stroke="${INK}" stroke-width="0.35"/><circle cx="${x + 2.6}" cy="${y + h / 2}" r="0.55" fill="${INK}"/>`;
const shower = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><path d="M${x} ${y} L${x + s} ${y + s} M${x + s} ${y} L${x} ${y + s}" stroke="${INK}" stroke-width="0.35"/>`;
const toilet = (cx, top, k = 1) => `<rect x="${cx - 3 * k}" y="${top}" width="${6 * k}" height="${2.3 * k}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><ellipse cx="${cx}" cy="${top + 5.6 * k}" rx="${2.3 * k}" ry="${3.2 * k}" fill="#fff" stroke="${INK}" stroke-width="0.45"/>`;
const basin = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2 - 1.2}" ry="${h / 2 - 1.2}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
const robe = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><line x1="${x + 1}" y1="${y + h / 2}" x2="${x + w - 1}" y2="${y + h / 2}" stroke="${INK}" stroke-width="0.35" stroke-dasharray="1 0.7"/>`;
const tub = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="0.8" fill="none" stroke="${INK}" stroke-width="0.35"/><circle cx="${x + w / 2}" cy="${y + h / 2}" r="0.5" fill="${INK}"/>`;
const label = (x, y, t, size = 2.3) => `<text x="${x}" y="${y}" font-size="${size}" fill="#7d7d7d" text-anchor="middle" font-family="Poppins" font-weight="500" letter-spacing="0.08">${t}</text>`;
const tag = (x, y, t) => `<circle cx="${x}" cy="${y}" r="2.1" fill="#7a1f4e"/><text x="${x}" y="${y + 0.95}" font-size="2.7" fill="#fff" text-anchor="middle" font-family="Poppins" font-weight="500">${t}</text>`;

// The symbol key: each icon in a 24 x 16 box
const icon = (body) => `<svg width="13mm" viewBox="0 0 24 16">${body}</svg>`;
const ICONS = {
  door: icon(`${wallH(0, 7, 13)}${wallH(17, 24, 13)}${door(7, 13, 7, 3, 17, 13, 1)}`),
  window: icon(`${wallH(0, 5, 8)}${wallH(19, 24, 8)}${windowH(5, 19, 8)}`),
  sliding: icon(`${wallH(0, 4, 8)}${wallH(20, 24, 8)}${slideH(4, 20, 8)}`),
  bath: icon(bath(1, 2.5, 22, 11)),
  shower: icon(shower(5.5, 1.5, 13)),
  toilet: icon(toilet(12, 0.8, 1.6)),
  basin: icon(basin(5, 2.5, 14, 11)),
  robe: icon(robe(1, 4, 22, 8)),
};
const symbolKey = `
  <div class="symkey">
    ${[['door', 'door'], ['window', 'window'], ['sliding', 'sliding door'], ['robe', 'robe (wardrobe)'],
       ['bath', 'bath'], ['shower', 'shower'], ['toilet', 'toilet (W.C.)'], ['basin', 'basin']]
      .map(([k, t]) => `<div class="fig">${ICONS[k]}<div class="cap">${t}</div></div>`).join('')}
  </div>`;

// ---------------------------------------------------------------- the house: 3D view, plan and elevations
// House 40 wide, 24 deep, walls 16 high, roof 9 high; ridge runs left to right.
const houseSvgs = (() => {
  const W = 40, D = 24, H = 16, R = 9, k = 0.35; // k: oblique depth factor
  const ox = 13, oy = 56; // front-bottom-left corner
  const P = (x, d, z) => [ox + x + k * d, oy - z - k * d];
  const pts = (...a) => a.map((p) => p.map((v) => +v.toFixed(2)).join(',')).join(' ');
  const st = `stroke="${INK}" stroke-width="0.6" stroke-linejoin="round"`;
  const front = pts(P(0, 0, 0), P(W, 0, 0), P(W, 0, H), P(0, 0, H));
  const roof = pts(P(0, 0, H), P(W, 0, H), P(W, D / 2, H + R), P(0, D / 2, H + R));
  const side = pts(P(W, 0, 0), P(W, D, 0), P(W, D, H), P(W, D / 2, H + R), P(W, 0, H));
  const doorF = pts(P(6, 0, 0), P(12, 0, 0), P(12, 0, 11), P(6, 0, 11));
  const winF = pts(P(20, 0, 6), P(32, 0, 6), P(32, 0, 12), P(20, 0, 12));
  const winS = pts(P(W, 7, 6), P(W, 17, 6), P(W, 17, 11), P(W, 7, 11));
  const arrow = (x1, y1, x2, y2, c = '#7a1f4e') => {
    const a = Math.atan2(y2 - y1, x2 - x1), hx = x2 - 4 * Math.cos(a), hy = y2 - 4 * Math.sin(a);
    const l = [hx + 2 * Math.sin(a), hy - 2 * Math.cos(a)], rr = [hx - 2 * Math.sin(a), hy + 2 * Math.cos(a)];
    return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${c}" stroke-width="1"/><polygon points="${x2},${y2} ${l.map((v) => v.toFixed(2)).join(',')} ${rr.map((v) => v.toFixed(2)).join(',')}" fill="${c}"/>`;
  };
  const txt = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" font-size="5" fill="#555" text-anchor="${a}" font-family="Poppins" font-weight="300">${t}</text>`;
  const threeD = `
    <svg width="40mm" viewBox="0 0 84 74">
      <polygon points="${front}" fill="#f5f3eb" ${st}/>
      <polygon points="${side}" fill="#d8d2b4" ${st}/>
      <polygon points="${roof}" fill="#9fb9da" ${st}/>
      <polygon points="${doorF}" fill="#7a1f4e" ${st}/>
      <polygon points="${winF}" fill="#fff" ${st}/>
      <polygon points="${winS}" fill="#fff" ${st}/>
      ${arrow(37, 3, 37, 21)}${txt(41, 9, 'top', 'start')}
      ${arrow(26, 72, 32, 62)}${txt(23, 72, 'front', 'end')}
      ${arrow(82, 40, 66, 40)}${txt(76, 35, 'side')}
    </svg>`;
  const s = 0.7; // mm per unit for the three views, so they share one scale
  const plan = `
    <svg width="${50 * s}mm" viewBox="0 0 50 34">
      <rect x="5" y="3" width="${W}" height="${D}" fill="#9fb9da" ${st}/>
      <line x1="5" y1="${3 + D / 2}" x2="${5 + W}" y2="${3 + D / 2}" ${st}/>
      <text x="25" y="32.6" font-size="3.6" fill="#555" text-anchor="middle" font-family="Poppins" font-weight="300">front</text>
    </svg>`;
  const frontEl = `
    <svg width="${50 * s}mm" viewBox="0 0 50 34">
      <rect x="5" y="${30 - H - R}" width="${W}" height="${R}" fill="#9fb9da" ${st}/>
      <rect x="5" y="${30 - H}" width="${W}" height="${H}" fill="#f5f3eb" ${st}/>
      <rect x="11" y="${30 - 11}" width="6" height="11" fill="#7a1f4e" ${st}/>
      <rect x="25" y="${30 - 12}" width="12" height="6" fill="#fff" ${st}/>
      <line x1="1" y1="30" x2="49" y2="30" stroke="${INK}" stroke-width="0.6"/>
    </svg>`;
  const sideEl = `
    <svg width="${34 * s}mm" viewBox="0 0 34 34">
      <polygon points="5,30 ${5 + D},30 ${5 + D},${30 - H} ${5 + D / 2},${30 - H - R} 5,${30 - H}" fill="#d8d2b4" ${st}/>
      <line x1="5" y1="${30 - H}" x2="${5 + D / 2}" y2="${30 - H - R}" stroke="#3f7cc0" stroke-width="1.2"/>
      <line x1="${5 + D}" y1="${30 - H}" x2="${5 + D / 2}" y2="${30 - H - R}" stroke="#3f7cc0" stroke-width="1.2"/>
      <rect x="${5 + 7}" y="${30 - 11}" width="10" height="5" fill="#fff" ${st}/>
      <line x1="1" y1="30" x2="33" y2="30" stroke="${INK}" stroke-width="0.6"/>
    </svg>`;
  return { threeD, plan, frontEl, sideEl };
})();

// ---------------------------------------------------------------- cubes
// hmap[j][i] = number of cubes stacked at column i, row j (j = 0 is the front row)
const cubeSvg = (hmap, { s = 7, d = 3.2, w = '40mm', arrows = true } = {}) => {
  const rows = hmap.length, cols = hmap[0].length, top = Math.max(...hmap.flat());
  const ox = 12, oy = 8 + top * s + rows * d + (arrows ? 4 : 0);
  const st = `stroke="${INK}" stroke-width="0.45" stroke-linejoin="round"`;
  let out = '';
  for (let j = rows - 1; j >= 0; j--) for (let i = 0; i < cols; i++) for (let k = 0; k < hmap[j][i]; k++) {
    const X = ox + i * s + j * d, Y = oy - (k + 1) * s - j * d;
    out += `<path d="M${X} ${Y} l${d} ${-d} h${s} l${-d} ${d} Z" fill="#eaf1fa" ${st}/>`
      + `<path d="M${X + s} ${Y} l${d} ${-d} v${s} l${-d} ${d} Z" fill="#9fb9da" ${st}/>`
      + `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="#cfdcee" ${st}/>`;
  }
  const W = ox + cols * s + rows * d + (arrows ? 20 : 4), Hh = oy + (arrows ? 14 : 3);
  let ar = '';
  if (arrows) {
    const cx = ox + (cols * s) / 2, rx = ox + cols * s + rows * d;
    const ah = (x, y, dir) => (dir === 'up' ? `<polygon points="${x},${y} ${x - 2},${y + 3.6} ${x + 2},${y + 3.6}" fill="#7a1f4e"/>` : `<polygon points="${x},${y} ${x + 3.6},${y - 2} ${x + 3.6},${y + 2}" fill="#7a1f4e"/>`);
    ar = `<line x1="${cx}" y1="${oy + 11}" x2="${cx}" y2="${oy + 5}" stroke="#7a1f4e" stroke-width="0.9"/>${ah(cx, oy + 2.5, 'up')}
      <text x="${cx + 3}" y="${oy + 11}" font-size="4.2" fill="#555" font-family="Poppins" font-weight="300">front</text>
      <line x1="${rx + 16}" y1="${oy - (top * s) / 2 - 2}" x2="${rx + 6}" y2="${oy - (top * s) / 2 - 2}" stroke="#7a1f4e" stroke-width="0.9"/>${ah(rx + 3, oy - (top * s) / 2 - 2, 'left')}
      <text x="${rx + 10}" y="${oy - (top * s) / 2 - 5}" font-size="4.2" fill="#555" text-anchor="middle" font-family="Poppins" font-weight="300">side</text>`;
  }
  return `<svg width="${w}" viewBox="0 0 ${W} ${Hh}">${out}${ar}</svg>`;
};

// A flat view drawn on squares: cells are [column, row] with row 0 at the bottom
const viewSvg = (cells, s = 4.2, mm = 1) => {
  const cols = Math.max(...cells.map((c) => c[0])) + 1, rows = Math.max(...cells.map((c) => c[1])) + 1;
  const sq = cells.map(([c, rr]) => `<rect x="${0.3 + c * s}" y="${0.3 + (rows - 1 - rr) * s}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.3"/>`).join('');
  return `<svg width="${(cols * s + 0.6) * mm}mm" viewBox="0 0 ${cols * s + 0.6} ${rows * s + 0.6}">${sq}</svg>`;
};
const rect = (c, rr) => Array.from({ length: c * rr }, (_, n) => [n % c, Math.floor(n / c)]);

// ---------------------------------------------------------------- floor plans
// Example 5.2: a bedroom and an ensuite
const ensuitePlan = `
  <svg width="56mm" viewBox="0 0 66 42">
    ${wallH(1, 65, 1.6)}${wallH(1, 10, 40.4)}${wallH(19, 65, 40.4)}
    ${wallV(1.6, 1, 14)}${wallV(1.6, 26, 41)}${windowV(1.6, 14, 26)}
    ${wallV(64.4, 1, 41)}${wallV(40.7, 1, 24)}${wallV(40.7, 32, 41)}
    ${door(10, 39.8, 10, 30.8, 19, 39.8, 1)}${door(41.4, 24, 49.4, 24, 41.4, 32, 1)}
    ${robe(6, 2.3, 22, 6)}
    ${shower(53, 2.3, 10.7)}${toilet(46.5, 2.3)}${basin(56.4, 30.5, 7.3, 9.2)}
    ${label(21, 24, 'BEDROOM')}${label(52.5, 21.6, 'ENSUITE')}
    ${tag(58.3, 15.8, 'A')}${tag(17, 12, 'B')}${tag(46.5, 14.4, 'C')}
  </svg>`;

// Extended response: W.C., bathroom, laundry and hall (drawn at 1 : 100, 1 unit = 1 mm)
const laundryPlan = `
  <svg width="75mm" viewBox="0 0 75 36">
    ${wallH(1, 73, 1)}${wallH(1, 73, 35)}${wallV(1, 1, 35)}${wallV(73, 1, 5)}${wallV(73, 17, 35)}${slideV(73, 5, 17)}
    ${wallV(13, 1, 21)}${wallV(43, 1, 21)}
    ${wallH(1, 3.5, 21)}${wallH(10.5, 34, 21)}${wallH(41, 46, 21)}${wallH(54, 73, 21)}
    ${door(3.5, 21, 3.5, 28, 10.5, 21, 0)}${door(41, 21, 41, 14, 34, 21, 0)}${door(46, 21, 46, 13, 54, 21, 1)}
    ${toilet(7, 1.7)}
    ${shower(13.7, 1.7, 9)}${bath(24, 1.7, 18.3, 7.6)}${basin(14.6, 14.4, 6.4, 6)}
    ${tub(57, 1.7, 9.3, 7)}
    ${robe(15, 29, 18, 5.3)}
    ${label(7, 17.6, 'W.C.')}${label(28.6, 16.6, 'BATHROOM', 2.2)}${label(62, 16.6, 'LAUNDRY', 2.2)}${label(52, 29.2, 'HALL', 2.2)}${label(24, 27.6, 'ROBE', 2)}
    <text x="70.6" y="11" font-size="1.9" fill="#7d7d7d" font-family="Poppins" font-weight="300" text-anchor="middle" transform="rotate(-90 70.6 11)">sliding door</text>
  </svg>`;

// MC2: the basin symbol on its own
const basinIcon = `<svg width="9mm" viewBox="4 2 16 12" style="vertical-align:middle">${basin(5, 2.5, 14, 11)}</svg>`;

// ---------------------------------------------------------------- lesson 5
const H = houseSvgs;
const p1 = {
  cls: 'l05',
  html: `
  ${banner({ num: '5', title: 'Plans and elevations', sub: 'Key idea: Plans and elevations • Textbook 1E • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Plans and elevations', `
    <ul class="dots mb0">
      <li>A <b>plan</b> is the view of an object from the <b>top</b>: a bird’s-eye view, looking straight down.</li>
      <li>An <b>elevation</b> is the view from <b>one side</b>, such as the <b>front elevation</b> or a <b>side elevation</b>.</li>
    </ul>
    <div class="houses">
      <div class="fig">${H.threeD}<div class="cap">the house</div></div>
      <div class="fig">${H.plan}<div class="cap"><b>plan</b> (from the top)</div></div>
      <div class="fig">${H.frontEl}<div class="cap"><b>front elevation</b></div></div>
      <div class="fig">${H.sideEl}<div class="cap"><b>side elevation</b></div></div>
    </div>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 1fr 84mm">
    <div>
      <div class="h2">Building plans</div>
      <ul class="dots mb0">
        <li>A <b>floor plan</b> is a plan of a building. It shows the walls, doors, windows and fittings.</li>
        <li>It is drawn to <b>scale</b>, usually ${r('1:100')}: 1 mm on the plan is 100 mm in real life.</li>
        <li>Lengths on building plans are in <b>millimetres</b>. <span class="nw">1 cm = 10 mm</span>, <span class="nw">1 m = 1000 mm</span>.</li>
      </ul>
      <p class="mb0 nw" style="margin-top:1mm">At ${r('1:100')}: &nbsp;36 mm → 36 × 100 = 3600 mm = 3.6 m</p>
    </div>
    <div>
      <div class="h2">Plan symbols</div>
      ${symbolKey}
    </div>
  </div>

  <div style="margin-top:3.5mm">${checklist(['tell a plan from an elevation, and read the symbols on a floor plan.', 'use a scale on a building plan.'])}</div>

  ${we('5.1', 'Drawing a plan and elevations', 'Some steps are made from 12 cubes. Draw their plan, front elevation and side elevation (from the right).', `
    <div class="grid2" style="grid-template-columns: 1fr 50mm; column-gap: 5mm; align-items:center">
      <div>
        <div class="sol-head views-head"><span>View</span><span>Drawing</span><span>Why</span></div>
        <div class="views">
          <div class="vn">Plan</div><div class="vd"><span class="vbox">${viewSvg(rect(3, 2), 5)}</span></div>
          <div class="why">Look straight <b>down</b> from the top. You see 3 squares across and 2 back.</div>
          <div class="vn">Front elevation</div><div class="vd"><span class="vbox">${viewSvg([[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0]], 5)}</span></div>
          <div class="why">Look straight at the <b>front</b>. The columns are 3, 2 and 1 cubes tall.</div>
          <div class="vn">Side elevation</div><div class="vd"><span class="vbox">${viewSvg(rect(2, 3), 5)}</span></div>
          <div class="why">Look from the <b>right</b>. You see 2 squares across (the depth) and 3 up.</div>
        </div>
      </div>
      <div class="fig">${cubeSvg([[3, 2, 1], [3, 2, 1]], { w: '48mm' })}<div class="cap">steps made from 12 cubes</div></div>
    </div>`, 'margin-top:4mm')}`,
};

const p2 = {
  cls: 'l05',
  html: `
  ${we('5.2', 'Reading a floor plan', `This floor plan shows a bedroom and an ensuite (a small bathroom). Use the symbol key on page ${KEY_PAGE} to name the symbols labelled A, B and C.`, `
    <div class="grid2" style="grid-template-columns: 1fr 58mm; column-gap: 5mm; align-items:center">
      <div>
        <div class="sol-head"><span></span><span>Answer</span><span>Why</span></div>
        ${sol('A', [['shower', 'A square with a cross is a <b>shower</b>.']])}
        ${sol('B', [['robe (wardrobe)', 'A long box with a dashed line (the hanging rail) is a <b>robe</b>.']])}
        ${sol('C', [['toilet (W.C.)', 'A small box (the cistern) and an oval bowl is a <b>toilet</b>. W.C. means water closet.']])}
      </div>
      <div class="fig">${ensuitePlan}</div>
    </div>`, '--wc: 30mm')}

  ${we('5.3', 'Using the scale on a building plan', `A house plan is drawn at ${r('1:50')}. &emsp;(a) What real distance, in cm, does 1 mm on the plan stand for? &emsp;(b) A wall is <span class="nw">96 mm</span> long on the plan. How long is the real wall, in metres?`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['real = 1 × 50 = 50 mm', `${r('1:50')}, so real lengths are <b>50 times</b> the plan.`],
      ['= 50 ÷ 10', 'Change mm to cm: 10 mm = 1 cm, so <b>divide</b> by 10.'],
      ['= 5 cm', 'Every 1 mm on the plan is 5 cm in real life.'],
    ])}
    ${sol('(b)', [
      ['real = 96 × 50', '<b>Multiply</b> the plan length by the scale number, 50.'],
      ['= 4800 mm', 'The plan length is in mm, so this answer is in <b>mm</b>.'],
      ['= 4800 ÷ 1000', 'Change mm to m: 1000 mm = 1 m, so <b>divide</b> by 1000.'],
      ['= 4.8 m', 'Check: 96 × 5 cm = 480 cm = 4.8 m.'],
    ])}`, 'margin-top:2.5mm')}

  ${we('5.4', 'Finding the scale of a plan', `On a plan, a wall that is 4&nbsp;m long is drawn 20&nbsp;mm long. Find the scale of the plan, in the form ${r('1:<i>x</i>')}.`, `
    <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
    <div style="margin-top:1mm">${steps([
      [r('20 mm:4 m'), 'Scale = drawing length : actual length.'],
      [`= ${r('20 mm:4 × 1000 mm')}`, 'Change to the <b>same unit</b>: 1 m = 1000 mm.'],
      [`= ${r('20:4000')}`, 'Both parts are in mm, so drop the units.'],
      [`= ${r('20 ÷ 20:4000 ÷ 20')}`, 'Divide <b>both</b> parts by the first number, 20.'],
      [`= ${r('1:200')}`, 'Check: 20 mm × 200 = 4000 mm = 4 m.'],
    ])}</div>`, 'margin-top:2.5mm; --wc: 46mm')}

  <div style="margin-top:3mm">${bar('Your turn 5', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'A can of drink stands upright on a table. What shape is its <b>plan</b>?', ['circle', 'rectangle', 'square', 'triangle'], { see: 'Key idea', h: 15.5 })}</div>
    <div>${mc(2, `What does this floor plan symbol show? <span style="display:inline-block; margin-left:1mm">${basinIcon}</span>`, ['bath', 'basin', 'shower', 'toilet'], { see: 'Example 5.2', h: 15.5 })}</div>
    <div>${mc(3, `On a plan drawn at ${r('1:100')}, what real distance does 1&nbsp;mm stand for? <span class="hint nw">Hint: 10 mm = 1 cm.</span> `, ['1 cm', '10 cm', '100 cm', '1000 cm'], { see: 'Example 5.3', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l05',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, `<div class="withfig"><div>This object is made from 4 cubes. Sketch its plan, its front elevation and its side elevation (from the right). <span class="hint">Hint: the plan is the view from the top.</span><span class="see">Example 5.1</span></div><div class="fig">${cubeSvg([[1, 2, 1]], { s: 7, w: '34mm' })}</div></div>`, { parts: ['plan', 'front elevation', 'side elevation'], h: 34, split: true })}
  ${q(2, `A house plan is drawn at ${r('1:100')}. Find each real length, in metres. <span class="hint">Hint: <span class="nw">× 100,</span> then <span class="nw">÷ 1000</span>.</span>`, { see: 'Example 5.3', parts: ['30 mm on the plan', '45 mm on the plan', '62 mm on the plan'], h: 28, split: true })}
  <div class="grid2 qpair">
    <div>${q(3, `A plan is drawn at ${r('1:100')}. A door is 9&nbsp;mm wide on the plan. How wide is the real door, in&nbsp;cm? <span class="hint nw">Hint: 10 mm = 1 cm.</span> `, { see: 'Example 5.3', h: 30 })}</div>
    <div>${q(4, `On a plan, a bed that is 2&nbsp;m long is drawn 40&nbsp;mm long. Find the scale of the plan, in the form ${r('1:<i>x</i>')}. <span class="hint nw">Hint: 2 m = 2000 mm.</span> `, { see: 'Example 5.4', h: 30 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `<div class="fig" style="float:right; width:77mm; margin:0 0 1mm 4mm">${laundryPlan}</div>This floor plan is part of a house. On the plan, the laundry is 30&nbsp;mm long and 20&nbsp;mm wide. The real laundry is 3&nbsp;m long.`, { see: 'Examples 5.2 to 5.4', cols: 1, parts: [
    'What does W.C. mean?',
    'Sketch the symbol used for the bath.',
    `Find the scale of the plan, in the form ${r('1:<i>x</i>')}. <span class="hint nw">Hint: 3 m = 3000 mm.</span>`,
    'How wide is the real laundry, in metres?',
  ], h: 30, split: true })}`,
};

export const pages = [p1, p2, p3];

const tiny = (cells) => `<span style="display:inline-block; vertical-align:middle; margin:0 .6mm">${viewSvg(cells, 4.2, 0.62)}</span>`;
export const answers = `
    <h4>Lesson 5 &nbsp;Plans and elevations</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> A &emsp;<b>2</b> B</p>
    <p><b>3</b> B &nbsp;(<span class="nw">1 × 100 = 100 mm = 10 cm)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> (a) plan: 3 squares in a row ${tiny(rect(3, 1))}<br>(b) front: 3 squares with 1 on top of the middle ${tiny([[0, 0], [1, 0], [2, 0], [1, 1]])}<br>(c) side: 2 squares, one on top of the other ${tiny(rect(1, 2))}</p>
    <p><b>2</b> <span class="nw">(a) 3000 mm = 3 m</span>&nbsp; <span class="nw">(b) 4500 mm = 4.5 m</span>&nbsp; <span class="nw">(c) 6200 mm = 6.2 m</span></p>
    <p><b>3</b> <span class="nw">9 × 100 = 900 mm,</span> <span class="nw">900 ÷ 10 = 90 cm</span></p>
    <p><b>4</b> <span class="nw">${r('40 mm:2000 mm')} = ${r('40:2000')}</span> <span class="nw">= ${r('1:50')}</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) water closet: a toilet<br>(b) a long rectangle with a rounded shape inside (and a dot for the plug)<br>(c) <span class="nw">${r('30:3000')} = ${r('1:100')}</span><br>(d) <span class="nw">20 × 100 = 2000 mm = 2 m</span></p>
`;

export const css = `
.l05 .houses { display: flex; justify-content: space-around; align-items: flex-end; margin-top: 2mm; }
.l05 .houses .cap b { font-weight: 500; color: var(--ink); }
.l05 .symkey { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6mm 2mm; margin-top: 1.4mm; }
.l05 .symkey .cap { margin-top: .6mm; white-space: nowrap; }
.l05 .views-head { grid-template-columns: 27mm 26mm 1fr; }
.l05 .views-head span:last-child { padding-left: 0; }
.l05 .views { display: grid; grid-template-columns: 27mm 26mm 1fr; column-gap: 1mm; row-gap: 1.8mm; align-items: center; margin-top: 1.4mm; }
.l05 .views .vn { font-family: 'Pagella', serif; }
.l05 .views .vbox { display: inline-block; border: .3mm solid var(--blue); background: var(--blue-pale); border-radius: 1mm; padding: 1.2mm 1.6mm; line-height: 0; }
.l05 .views .why { font: 400 8.8pt/1.3 'Poppins', sans-serif; color: #3d3d3d; }
.l05 .views .why b { font-weight: 600; color: var(--text); }
.l05 .withfig { display: flex; justify-content: space-between; align-items: flex-start; column-gap: 5mm; }
.l05 .withfig .fig { flex: none; margin-top: -2mm; }
`;
