// Lesson 10 Speed and distance–time graphs (textbook 1G and 1H). Follows the structure of the model lesson (Lesson 1).
import { frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

const BLUE = '#3f7cc0', LBLUE = '#9fb9da', PLUM = '#7a1f4e', INK = '#3d3d3d', SAND = '#d8d2b4', BEIGE = '#f5f3eb';

// ---------------------------------------------------------------- figure helpers
const txt = (x, y, s, { size = 8.5, anchor = 'middle', fill = INK, font = 'Pagella', italic = false, rot = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}"${font === 'Poppins' ? ' font-weight="300"' : ''}${italic ? ' font-style="italic"' : ''}${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${s}</text>`;
const head = (x, y, dir, c = INK, s = 3.4) => {
  const w = s * 0.5;
  const p = { u: [[x, y], [x - w, y + s], [x + w, y + s]], r: [[x, y], [x - s, y - w], [x - s, y + w]], l: [[x, y], [x + s, y - w], [x + s, y + w]] }[dir];
  return `<polygon points="${p.map((a) => a.join(',')).join(' ')}" fill="${c}"/>`;
};

// Key idea: the D-S-T triangle. Cover the one you want; what is left is the rule.
const triSvg = `
  <svg width="25mm" viewBox="0 0 110 92">
    <path d="M55 3 L107 89 L3 89 Z" fill="${BEIGE}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>
    <line x1="29" y1="46" x2="81" y2="46" stroke="${INK}" stroke-width="1.1"/>
    <line x1="55" y1="46" x2="55" y2="89" stroke="${INK}" stroke-width="1.1"/>
    ${txt(55, 33, 'D', { size: 19, fill: BLUE, italic: true })}
    ${txt(55, 42.5, 'distance', { size: 9, font: 'Poppins', fill: '#555' })}
    ${txt(35, 72, 'S', { size: 19, fill: BLUE, italic: true })}
    ${txt(34, 83.5, 'speed', { size: 9, font: 'Poppins', fill: '#555' })}
    ${txt(75, 72, 'T', { size: 19, fill: BLUE, italic: true })}
    ${txt(76, 83.5, 'time', { size: 9, font: 'Poppins', fill: '#555' })}
  </svg>`;

// Distance–time graph on a grid. pts are [hours, km]; labels every ylab km.
const dtGraph = ({ xmax, ymax, ystep, ylab, pts, w, sx = 20, sy = 11, notes = () => '' }) => {
  const L = 31, T = 9, R = 13, B = 27;
  const gw = xmax * sx, gh = (ymax / ystep) * sy;
  const X = (x) => +(L + x * sx).toFixed(2), Y = (y) => +(T + gh - (y / ystep) * sy).toFixed(2);
  let grid = '';
  for (let i = 1; i <= xmax; i++) grid += `<line x1="${X(i)}" y1="${T}" x2="${X(i)}" y2="${T + gh}"/>`;
  for (let j = ystep; j <= ymax; j += ystep) grid += `<line x1="${L}" y1="${Y(j)}" x2="${L + gw}" y2="${Y(j)}"/>`;
  let labels = txt(L - 4, T + gh + 10, '0', { anchor: 'end' });
  for (let i = 1; i <= xmax; i++) labels += txt(X(i), T + gh + 10, i);
  for (let j = ylab; j <= ymax; j += ylab) labels += txt(L - 4, Y(j) + 3, j, { anchor: 'end' });
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join(' ');
  return `
  <svg width="${w}" viewBox="0 0 ${L + gw + R} ${T + gh + B}">
    <g stroke="#d3dae4" stroke-width="0.5">${grid}</g>
    <path d="M${L} ${T - 5} L${L} ${T + gh} L${L + gw + 7} ${T + gh}" fill="none" stroke="${INK}" stroke-width="0.9"/>
    ${head(L, T - 8, 'u')}${head(L + gw + 10, T + gh, 'r')}
    ${labels}
    ${txt(L + gw / 2, T + gh + 22, 'Time (h)', { size: 7.5, font: 'Poppins', fill: '#555' })}
    ${txt(9, T + gh / 2, 'Distance from home (km)', { size: 7.2, font: 'Poppins', fill: '#555', rot: -90 })}
    <path d="${d}" fill="none" stroke="${BLUE}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="1.9" fill="${BLUE}"/>`).join('')}
    ${notes(X, Y)}
  </svg>`;
};

// Examples 10.3 and 10.4: Jo walks 6 km in 2 h, stops for 3 h, walks home in 1 h
const walkSvg = dtGraph({
  xmax: 6, ymax: 8, ystep: 1, ylab: 1, pts: [[0, 0], [2, 6], [5, 6], [6, 0]], w: '52mm',
  notes: (X, Y) => txt((X(2) + X(5)) / 2, Y(6) - 4, 'stopped', { size: 7, font: 'Poppins', fill: PLUM }),
});
// Extended response: Mia rides 30 km in 2 h, rests from 2 h to 4 h, rides home by 5 h
const bikeSvg = dtGraph({ xmax: 6, ymax: 40, ystep: 5, ylab: 10, pts: [[0, 0], [2, 30], [4, 30], [5, 0]], w: '46mm' });

// Key idea: the parts of a distance–time graph, no numbers
const miniSvg = (() => {
  const P = [[22, 66], [66, 50], [100, 50], [112, 16], [146, 66]];
  const lab = (x, y, s, anchor = 'middle') => txt(x, y, s, { size: 7, font: 'Poppins', fill: PLUM, anchor });
  return `
  <svg width="53mm" viewBox="0 0 184 80">
    <path d="M22 5 L22 66 L164 66" fill="none" stroke="${INK}" stroke-width="0.9"/>
    ${head(22, 2, 'u')}${head(167, 66, 'r')}
    ${txt(12, 36, 'distance', { size: 7, font: 'Poppins', fill: '#555', rot: -90 })}
    ${txt(92, 77, 'time', { size: 7, font: 'Poppins', fill: '#555' })}
    <path d="M${P.map((p) => p.join(' ')).join(' L')}" fill="none" stroke="${BLUE}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
    ${P.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${BLUE}"/>`).join('')}
    ${lab(40, 51, 'slower')}
    ${lab(83, 45, 'stopped')}
    ${lab(104, 26, 'faster', 'end')}
    ${lab(128, 34, 'coming back', 'start')}
  </svg>`;
})();

// Example 10.2: time for 300 m, shorter bar wins
const raceSvg = (() => {
  const k = 4, x0 = 50;
  const lane = (y, name, t, fill) =>
    `${txt(0, y + 8.5, name, { size: 8, font: 'Poppins', fill: '#555', anchor: 'start' })}<rect x="${x0}" y="${y}" width="${t * k}" height="12" fill="${fill}"/>${txt(x0 + t * k + 4, y + 9, `${t} s`, { size: 10, fill: '#1c1c1c', anchor: 'start' })}`;
  return `
  <svg width="49mm" viewBox="0 0 154 40">
    ${lane(3, 'greyhound', 18, SAND)}
    ${lane(22, 'horse', 20, LBLUE)}
    <line x1="${x0}" y1="0" x2="${x0}" y2="37" stroke="${INK}" stroke-width="0.8"/>
  </svg>`;
})();

// Multiple choice 2: four small distance–time graphs
const icon = (d) => `<svg width="12mm" viewBox="0 0 40 26" style="vertical-align:middle"><path d="M5 1 V23 H38" fill="none" stroke="${INK}" stroke-width="1"/><path d="${d}" fill="none" stroke="${BLUE}" stroke-width="2.2" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------- lesson 10
const S = '<i>S</i>', D = '<i>D</i>', T = '<i>T</i>';
const p1 = {
  cls: 'l10',
  html: `
  ${banner({ num: '10', title: 'Speed and distance–time graphs', sub: 'Key idea: Speed • Textbook 1G and 1H • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Speed', `
    <div class="fig" style="float:right; width:31mm; margin:-1.5mm 0 0 4mm">${triSvg}<div class="cap">cover the one you want</div></div>
    <p class="mb0"><b>Speed</b> is a rate: 60&nbsp;km/h means 60&nbsp;km travelled in <b>each</b> hour.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b>Speed</b> = distance ÷ time: &nbsp;<span class="nw">${S} = ${frac(D, T)}</span>. &nbsp;Turn it around: <span class="nw">${D} = ${S} × ${T}</span> &nbsp;and&nbsp; <span class="nw">${T} = ${frac(D, S)}</span>.</li>
      <li><b>Units:</b> km and h give <b>km/h</b>; m and s give <b>m/s</b>. Always write the units.</li>
      <li>On a <b>distance–time graph</b>, a <b>steeper</b> line is <b>faster</b> and a <b>flat</b> line means <b>stopped</b>.</li>
    </ul>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 1fr 80mm">
    <div>
      <div class="h2">Changing units</div>
      <table class="t compact">
        <tr><th>Change</th><th>How</th><th>Example</th></tr>
        <tr><td>minutes → hours</td><td><b>÷ 60</b></td><td>45&nbsp;min = 45 ÷ 60 = 0.75&nbsp;h</td></tr>
        <tr><td>hours → minutes</td><td><b>× 60</b></td><td>0.5&nbsp;h = 0.5 × 60 = 30&nbsp;min</td></tr>
        <tr><td>km/h → m/s</td><td><b>÷ 3.6</b></td><td>18&nbsp;km/h = 18 ÷ 3.6 = 5&nbsp;m/s</td></tr>
      </table>
      <ul class="dots mb0" style="margin-top:1.5mm">
        <li><span class="nw">15 min = 0.25 h,</span> &nbsp;<span class="nw">30 min = 0.5 h,</span> &nbsp;<span class="nw">45 min = 0.75 h</span></li>
        <li><b>Why 3.6?</b> 1&nbsp;m/s is 3600&nbsp;m in an hour, or 3.6&nbsp;km/h.</li>
        <li><b>Comparing?</b> Use the <b>same units</b>, or compare the <b>times</b> for the same distance.</li>
      </ul>
    </div>
    <div>
      <div class="h2">Distance–time graphs</div>
      <div class="fig">${miniSvg}</div>
      <ul class="dots mb0" style="margin-top:1mm">
        <li>A line going <b>down</b> means coming <b>back</b> home.</li>
        <li>For <b>each part</b>, speed = distance ÷ time.</li>
        <li><b>Average speed</b> = total distance ÷ total time. <b>Include</b> any stops.</li>
      </ul>
    </div>
  </div>

  <div style="margin-top:3mm">${checklist(['solve problems involving speed, distance and time.', 'read a distance–time graph and use it to find speeds.'])}</div>

  ${we('10.1', 'Speed, distance and time', `(a) A bus travels 36&nbsp;km in 45&nbsp;min. Find its speed in km/h. <br>(b) A train travels at 80&nbsp;km/h for 2.5&nbsp;h. How far does it go? <br>(c) Ana walks 10&nbsp;km at 4&nbsp;km/h. How long does she take? Give the time in hours and minutes.`, `
    <div style="--wc: 50mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [`${T} = 45 ÷ 60 = 0.75 h`, 'For km/h, the time must be in <b>hours</b>. Minutes <b>÷ 60</b>.'],
      [`${S} = ${frac(D, T)} = 36 ÷ 0.75`, 'We want the <b>speed</b>. Cover <i>S</i> in the triangle: <i>D</i> is over <i>T</i>.'],
      ['= 48 km/h', 'km and h give <b>km/h</b>. Check: 48 × 0.75 = 36&nbsp;km.'],
    ])}
    ${sol('(b)', [
      [`${D} = ${S} × ${T}`, 'We want the <b>distance</b>. Cover <i>D</i>: <i>S</i> and <i>T</i> are side by side, so <b>multiply</b>.'],
      ['= 80 × 2.5', 'The time is already in hours.'],
      ['= 200 km', 'Check: 2&nbsp;h is 160&nbsp;km, and half an hour more is 40&nbsp;km.'],
    ])}
    ${sol('(c)', [
      [`${T} = ${frac(D, S)} = 10 ÷ 4 = 2.5 h`, 'We want the <b>time</b>. Cover <i>T</i>: <i>D</i> is over <i>S</i>.'],
      ['0.5 h = 0.5 × 60 = 30 min', 'Change the part of an hour to minutes: <b>× 60</b>.'],
      [`${T} = 2 h 30 min`, '2.5&nbsp;h is <b>not</b> 2&nbsp;h 50&nbsp;min.'],
    ])}
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l10',
  html: `
  ${we('10.2', 'km/h and m/s', 'A horse gallops at 54&nbsp;km/h. A greyhound runs 300&nbsp;m in 18&nbsp;s. Which would win a 300&nbsp;m race?', `
    <div class="grid2" style="grid-template-columns: 1fr 49mm; column-gap: 5mm; align-items:center; --wc: 50mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['54 km/h = 54 ÷ 3.6 m/s', 'The race is in <b>metres</b>, so change to <b>m/s</b>.'],
          ['= 15 m/s', 'The horse runs 15&nbsp;m every second.'],
          [`horse: ${T} = 300 ÷ 15 = 20 s`, '<i>T</i> = <i>D</i> ÷ <i>S</i>. m ÷ m/s gives <b>seconds</b>.'],
          ['The greyhound wins.', 'It takes 18&nbsp;s. The <b>shorter</b> time wins.'],
        ])}</div>
      </div>
      <div class="fig">${raceSvg}<div class="cap">time to run 300 m</div></div>
    </div>`)}

  ${we('10.3', 'Reading a distance–time graph', 'Jo walks from home to a friend’s house and back. Use the graph to find (a) Jo’s speed on the way there &ensp;(b) how long she stopped &ensp;(c) her speed on the way home.', `
    <div class="grid2" style="grid-template-columns: 1fr 52mm; column-gap: 5mm; align-items:center; --wc: 34mm">
      <div>
        <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
        ${sol('(a)', [
          [`${S} = 6 ÷ 2`, 'The line goes <b>up</b> 6&nbsp;km in the first 2&nbsp;h.'],
          ['= 3 km/h', 'Speed = distance ÷ time, for that part.'],
        ])}
        ${sol('(b)', [
          ['stop = 5 − 2', 'The line is <b>flat</b> from 2&nbsp;h to 5&nbsp;h.'],
          ['= 3 h', 'A flat line means <b>stopped</b>.'],
        ])}
        ${sol('(c)', [
          [`${S} = 6 ÷ 1`, 'It comes <b>down</b> 6&nbsp;km, from 5&nbsp;h to 6&nbsp;h.'],
          ['= 6 km/h', 'A <b>steeper</b> line, so faster.'],
        ])}
      </div>
      <div class="fig">${walkSvg}<div class="cap">Jo’s walk</div></div>
    </div>`, 'margin-top:2.5mm')}

  ${we('10.4', 'Average speed', 'Use Jo’s walk in Example 10.3. Find her average speed (a) for the whole trip &ensp;(b) without the stop.', `
    <div style="--wc: 40mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [`${D} = 6 + 6 = 12 km`, 'Total distance: there <b>and</b> back.'],
      [`${S} = 12 ÷ 6`, 'The whole trip takes 6&nbsp;h, <b>including</b> the stop.'],
      ['= 2 km/h', 'Average speed = total distance ÷ total time.'],
    ])}
    ${sol('(b)', [
      [`${T} = 6 − 3 = 3 h`, 'Take away the 3&nbsp;h stop.'],
      [`${S} = 12 ÷ 3`, 'The same 12&nbsp;km, in less time.'],
      ['= 4 km/h', 'Faster than (a), because the stop is left out.'],
    ])}
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 10', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'A car travels 210&nbsp;km in 3&nbsp;h. What is its average speed?', ['0.014&nbsp;km/h', '70&nbsp;km/h', '207&nbsp;km/h', '630&nbsp;km/h'], { see: 'Example 10.1', h: 15.5 })}</div>
    <div>${mc(2, 'Which distance–time graph shows a car that is <b>stopped</b>?', [icon('M7 21 L36 11'), icon('M7 21 L21 3'), icon('M7 11 L36 11'), icon('M7 4 L36 21')], { see: 'Key idea', h: 15.5 })}</div>
    <div>${mc(3, 'Leah runs 5&nbsp;km in 30&nbsp;minutes. What is her speed in km/h? <span class="hint nw">Hint: 30 min = 0.5 h.</span>&#8203;', ['0.17&nbsp;km/h', '2.5&nbsp;km/h', '10&nbsp;km/h', '150&nbsp;km/h'], { see: 'Example 10.1', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l10',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Find the speed, distance or time. <span class="hint">Hint: cover the one you want in the triangle.</span>', { see: 'Example 10.1', parts: ['A cyclist rides 42&nbsp;km in 3&nbsp;h. Find her speed.', 'A plane flies at 650&nbsp;km/h for 2&nbsp;h. How far does it fly?', 'A ship sails 150&nbsp;km at 30&nbsp;km/h. How long does it take?'], h: 22, split: true })}
  ${q(2, 'Find each answer. <span class="hint">Hint: minutes ÷ 60 = hours, and hours × 60 = minutes.</span>', { see: 'Example 10.1', parts: ['Ben cycles 4&nbsp;km in 15&nbsp;min. Find his speed in km/h.', 'A ferry travels 21&nbsp;km in 45&nbsp;min. Find its speed in km/h.', 'Zoe drives 135&nbsp;km at 60&nbsp;km/h. Find the time in hours and minutes.'], h: 25, split: true })}
  <div class="grid2 qpair">
    <div>${q(3, `A motorbike travels at 100&nbsp;km/h. How far does it travel in 3.5&nbsp;hours? <span class="hint nw">Hint: ${D} = ${S} × ${T}.</span>`, { see: 'Example 10.1', h: 24 })}</div>
    <div>${q(4, 'Change each speed to m/s.', { see: 'Example 10.2', parts: ['90&nbsp;km/h', '72&nbsp;km/h'], h: 24, split: true })}</div>
  </div>
  ${q(5, 'Cathy Freeman’s best time for the 400&nbsp;m race was 48.63&nbsp;s. A wombat can run at 36&nbsp;km/h.', { see: 'Example 10.2', parts: ['Change 36&nbsp;km/h to m/s.', 'How long would the wombat take to run 400&nbsp;m?', 'Would the wombat beat Cathy Freeman?'], h: 22, split: true })}

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `<div class="fig" style="float:right; width:46mm; margin:-1mm 0 0 4mm">${bikeSvg}</div>Mia rides her bike from home to the beach, has a rest, then rides home. The graph shows her trip.`, { see: 'Examples 10.3 and 10.4', cols: 1, parts: [
    'What was her speed on the way to the beach?',
    'What was her speed on the way home?',
    'What was her average speed for the whole trip, including the rest? <span class="hint nw">Hint: total distance = 30 + 30 km.</span>',
    'What was her average speed without the rest? <span class="hint nw">Hint: take away the rest time.</span>',
  ], h: 23, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 10 &nbsp;Speed and distance–time graphs</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> B &nbsp;(<span class="nw">210 ÷ 3 = 70 km/h)</span></p>
    <p><b>2</b> C &nbsp;(a flat line means stopped)</p>
    <p><b>3</b> C &nbsp;(<span class="nw">5 ÷ 0.5 = 10 km/h)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 42 ÷ 3 = 14 km/h</span>&nbsp; <span class="nw">(b) 650 × 2 = 1300 km</span>&nbsp; <span class="nw">(c) 150 ÷ 30 = 5 h</span></p>
    <p><b>2</b> <span class="nw">(a) 4 ÷ 0.25 = 16 km/h</span>&nbsp; <span class="nw">(b) 21 ÷ 0.75 = 28 km/h</span>&nbsp; <span class="nw">(c) 135 ÷ 60 = 2.25 h</span> <span class="nw">= 2 h 15 min</span></p>
    <p><b>3</b> <span class="nw">100 × 3.5 = 350 km</span></p>
    <p><b>4</b> <span class="nw">(a) 90 ÷ 3.6 = 25 m/s</span>&nbsp; <span class="nw">(b) 72 ÷ 3.6 = 20 m/s</span></p>
    <p><b>5</b> <span class="nw">(a) 36 ÷ 3.6 = 10 m/s</span>&nbsp; <span class="nw">(b) 400 ÷ 10 = 40 s</span>&nbsp; <span class="nw">(c) yes: 40 s is less than 48.63 s</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">30 ÷ 2 = 15 km/h</span><br>(b) <span class="nw">30 ÷ 1 = 30 km/h</span><br>(c) <span class="nw">60 ÷ 5 = 12 km/h</span><br>(d) <span class="nw">5 − 2 = 3 h,</span> <span class="nw">60 ÷ 3 = 20 km/h</span></p>
`;

// Fractions inside worked examples are a little smaller; the small graphs in MC 2 sit on the text line.
export const css = `
.l10 .steps .frac { font-size: 84%; }
.l10 .mc-opts svg { display: inline-block; vertical-align: middle; }
`;
