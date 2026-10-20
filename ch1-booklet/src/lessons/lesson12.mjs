// Lesson 12 Fuel consumption (textbook 1J). Follows the structure of the model lesson (Lesson 1).
import { frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// Key idea: 8 L/100 km is 8 L for each 100 km of road, so 24 L for 300 km
const drop = (x, y) =>
  `<path d="M${x} ${y - 6} C${x + 2.5} ${y - 2.5} ${x + 4.2} ${y - 0.2} ${x + 4.2} ${y + 1.8} A4.2 4.2 0 0 1 ${x - 4.2} ${y + 1.8} C${x - 4.2} ${y - 0.2} ${x - 2.5} ${y - 2.5} ${x} ${y - 6} Z" fill="#9fb9da" stroke="#3f7cc0" stroke-width="0.7"/>`;
const roadSvg = (() => {
  const w = 40;
  const segs = [0, 1, 2].map((i) => {
    const x = 2 + i * w;
    return `<text x="${x + w / 2}" y="8" font-size="8" text-anchor="middle" fill="#555" font-family="Poppins" font-weight="300">100 km</text>
    <rect x="${x}" y="11" width="${w}" height="9" fill="#3d3d3d" stroke="#fff" stroke-width="1.2"/>
    ${drop(x + 13, 29)}
    <text x="${x + 20}" y="32.5" font-size="9.5" fill="#1c1c1c">8 L</text>`;
  }).join('');
  return `
  <svg width="42mm" viewBox="0 0 124 58" font-family="Pagella">
    ${segs}
    <line x1="4" y1="15.5" x2="120" y2="15.5" stroke="#fff" stroke-width="0.8" stroke-dasharray="4 3"/>
    <path d="M2.5 38 v3 h119 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="62" y="52" font-size="10" text-anchor="middle" fill="#1c1c1c">300 km: 3 × 8 = 24 L</text>
  </svg>`;
})();

// Example 12.3: three boxes joined by arrows; the last box is the answer
const flow = (vals, ops, labels, { w = 40, gap = 42 } = {}) => {
  const W = 3 * w + 2 * gap + 2;
  const xs = [0, 1, 2].map((i) => 1 + i * (w + gap));
  const cell = (x, t, hi) =>
    `<rect x="${x}" y="14" width="${w}" height="17" rx="2" fill="${hi ? '#eaf1fa' : '#f5f3eb'}" stroke="${hi ? '#3f7cc0' : '#d8d2b4'}" stroke-width="0.9"/><text x="${x + w / 2}" y="26" font-size="9.5" text-anchor="middle" fill="#1c1c1c">${t}</text>`;
  const arrow = (x1, x2, label) =>
    `<line x1="${x1 + 3}" y1="22.5" x2="${x2 - 4}" y2="22.5" stroke="#7a1f4e" stroke-width="0.9"/><path d="M${x2 - 5} 19.5 L${x2 - 0.5} 22.5 L${x2 - 5} 25.5 Z" fill="#7a1f4e"/><text x="${(x1 + x2) / 2}" y="10" font-size="9" text-anchor="middle" fill="#7a1f4e">${label}</text>`;
  return `
  <svg width="${(W * 0.29).toFixed(1)}mm" viewBox="0 0 ${W} 46" font-family="Pagella">
    ${xs.map((x, i) => cell(x, vals[i], i === 2)).join('')}
    ${ops.map((op, i) => arrow(xs[i] + w, xs[i + 1], op)).join('')}
    ${xs.map((x, i) => `<text x="${x + w / 2}" y="43" font-size="8.5" text-anchor="middle" fill="#555" font-family="Poppins" font-weight="300">${labels[i]}</text>`).join('')}
  </svg>`;
};
const costSvg = flow(['240 km', '15.6 L', '$29.64'], ['÷ 100 × 6.5', '× $1.90'], ['distance', 'fuel used', 'cost']);

// Example 12.4: two-row table: go down to 1 litre (divide), then up to 25 litres (multiply)
const downUp = (rows, ops, { lw = 38, w = 28, gap = 24 } = {}) => {
  const W = lw + 3 * w + 2 * gap + 1, H = 62;
  const cell = (x, y, t, hi) =>
    `<rect x="${x}" y="${y}" width="${w}" height="17" rx="2" fill="${hi ? '#eaf1fa' : '#f5f3eb'}" stroke="${hi ? '#3f7cc0' : '#d8d2b4'}" stroke-width="0.9"/><text x="${x + w / 2}" y="${y + 12}" font-size="9.5" text-anchor="middle" fill="#1c1c1c">${t}</text>`;
  const arrow = (x1, x2, y, label) =>
    `<line x1="${x1 + 3}" y1="${y}" x2="${x2 - 4}" y2="${y}" stroke="#7a1f4e" stroke-width="0.9"/><path d="M${x2 - 5} ${y - 3} L${x2} ${y} L${x2 - 5} ${y + 3} Z" fill="#7a1f4e"/><text x="${(x1 + x2) / 2}" y="${y - 4}" font-size="9" text-anchor="middle" fill="#7a1f4e">${label}</text>`;
  return `
  <svg width="${(W * 0.341).toFixed(1)}mm" viewBox="0 0 ${W} ${H}" font-family="Pagella">
    ${rows.map((row, j) => {
      const y = 10 + j * 30;
      return `<text x="0" y="${y + 12}" font-size="8.5" fill="#555" font-family="Poppins" font-weight="300">${row.label}</text>
      ${row.vals.map((v, i) => cell(lw + i * (w + gap), y, v, i === 1)).join('')}
      ${ops.map((op, i) => arrow(lw + i * (w + gap) + w, lw + (i + 1) * (w + gap), y + 8.5, op)).join('')}`;
    }).join('')}
  </svg>`;
};
const howFarSvg = downUp([{ label: 'litres', vals: ['40', '1', '25'] }, { label: 'km', vals: ['680', '17', '425'] }], ['÷ 40', '× 25'], { lw: 30, w: 26, gap: 28 });

// ---------------------------------------------------------------- lesson 12
const p1 = {
  cls: 'l12',
  html: `
  ${banner({ num: '12', title: 'Fuel consumption', sub: 'Key idea: Fuel consumption • Textbook 1J • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Fuel consumption', `
    <div class="fig" style="float:right; width:44mm; margin:0 0 1mm 4mm">${roadSvg}<div class="cap">8 L/100 km: 8 L for each 100 km</div></div>
    <p class="mb0"><b>Fuel consumption</b> is a rate. It tells you how much fuel a car uses, usually in <b>litres per 100&nbsp;kilometres</b> (L/100&nbsp;km).</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b>8&nbsp;L/100&nbsp;km</b> means the car uses 8&nbsp;litres of fuel for <b>every</b> 100&nbsp;km it travels.</li>
      <li>A <b>lower</b> number is better. It means the car uses <b>less</b> fuel, so it is more <b>fuel efficient</b> and cheaper to run.</li>
    </ul>
    <div class="disp nw mb0" style="clear:both; margin-top:1.8mm"><b>Fuel used</b> (L) = ${frac('distance (km)', '100')} × rate (L/100&nbsp;km) <span style="display:inline-block; width:14mm"></span> <b>Rate</b> (L/100&nbsp;km) = ${frac('litres', 'km')} × 100</div>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 84mm 1fr">
    <div>
      <div class="h2">L/100 km or km/L?</div>
      <table class="t compact">
        <tr><th>Rate</th><th>Tells you</th><th>Better car</th></tr>
        <tr><td><b>L/100&nbsp;km</b></td><td>litres for 100&nbsp;km</td><td><b>lower</b> number</td></tr>
        <tr><td><b>km/L</b></td><td>km on 1 litre</td><td><b>higher</b> number</td></tr>
      </table>
      <p class="mb0" style="margin-top:1.2mm">New cars in Australia show their fuel consumption in L/100&nbsp;km on a windscreen label.</p>
    </div>
    <div>
      <div class="h2">Cost of fuel</div>
      <ul class="dots mb0">
        <li><b>$1.80/L</b> means $1.80 for <b>each</b> litre.</li>
        <li><b>Cost = litres × price per litre</b></li>
        <li>The car in the picture uses 24&nbsp;L. At $1.80/L, the fuel costs <span class="nw">24 × $1.80 = $43.20</span>.</li>
      </ul>
    </div>
  </div>

  <div class="h2">How far on this much fuel?</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Use the unitary method. <b>Divide</b> to find the km for 1&nbsp;litre, then <b>multiply</b>.</p>
    <div class="nw">650 km on 50 L &ensp;→&ensp; 1 L: 650 ÷ 50 = 13 km &ensp;→&ensp; 20 L: 20 × 13 = <b>260 km</b></div>
  </div>

  <div style="margin-top:3mm">${checklist(['calculate the fuel used on a trip, and the cost of the fuel.', 'calculate the fuel consumption rate of a motor vehicle.'])}</div>

  ${we('12.1', 'Fuel used for a trip', `A car uses 9&nbsp;L/100&nbsp;km. How much fuel does it use on each trip? &emsp;(a) 200&nbsp;km &emsp;(b) 350&nbsp;km &emsp;(c) 80&nbsp;km`, `
    <div style="--wc: 50mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['Fuel used = 200 ÷ 100 × 9', 'Fuel used = <b>distance ÷ 100</b> × rate.'],
      ['= 2 × 9', '200&nbsp;km is <b>2</b> lots of 100&nbsp;km.'],
      ['= 18 L', 'The car uses 9&nbsp;L for <b>each</b> 100&nbsp;km.'],
    ])}
    ${sol('(b)', [
      ['Fuel used = 350 ÷ 100 × 9', 'Use the same rule with the new distance.'],
      ['= 3.5 × 9', '350&nbsp;km is <b>3.5</b> lots of 100&nbsp;km.'],
      ['= 31.5 L', 'Check: between 3 × 9 = 27 and 4 × 9 = 36.'],
    ])}
    ${sol('(c)', [
      ['Fuel used = 80 ÷ 100 × 9', 'This trip is <b>shorter</b> than 100&nbsp;km.'],
      ['= 0.8 × 9', '80&nbsp;km is <b>0.8</b> of 100&nbsp;km.'],
      ['= 7.2 L', 'Less than 100&nbsp;km, so less than 9&nbsp;L.'],
    ])}
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l12',
  html: `
  ${we('12.2', 'Finding the fuel consumption rate', `(a) A car uses 42&nbsp;L of petrol to travel 600&nbsp;km. Find its fuel consumption in L/100&nbsp;km. <br>(b) A ute uses 66&nbsp;L to travel 550&nbsp;km. Find its fuel consumption. &emsp;(c) Which is more fuel efficient?`, `
    <div style="--wc: 50mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['Rate = 42 ÷ 600 × 100', 'Rate = litres ÷ km × 100. The <b>litres</b> go first.'],
      ['= 0.07 × 100', 'Use your calculator: 42 ÷ 600 = 0.07'],
      ['= 7 L/100 km', 'Check: 600&nbsp;km is 6 lots of 100&nbsp;km, and 6 × 7 = 42&nbsp;L.'],
    ])}
    ${sol('(b)', [
      ['Rate = 66 ÷ 550 × 100', '× 100 gives the litres for <b>100</b>&nbsp;km, not 1&nbsp;km.'],
      ['= 0.12 × 100', 'Use your calculator: 66 ÷ 550 = 0.12'],
      ['= 12 L/100 km', 'Check: 5.5 × 12 = 66&nbsp;L.'],
    ])}
    ${sol('(c)', [
      ['7 is lower than 12', 'Compare the rates from (a) and (b).'],
      ['The car', 'A <b>lower</b> rate means <b>less</b> fuel for each 100&nbsp;km.'],
    ])}
    </div>`)}

  ${we('12.3', 'The cost of fuel for a trip', 'Sam’s car uses 6.5&nbsp;L/100&nbsp;km. Petrol costs $1.90 per litre. Find the cost of the petrol for a 240&nbsp;km trip.', `
    <div class="grid2" style="grid-template-columns: 1fr 59mm; column-gap: 5mm; align-items:center; --wc: 49mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['Fuel used = 240 ÷ 100 × 6.5', '<b>Step 1</b> Find the litres for the trip.'],
          ['= 2.4 × 6.5', '240&nbsp;km is 2.4 lots of 100&nbsp;km.'],
          ['= 15.6 L', 'The trip uses 15.6 litres.'],
          ['Cost = 15.6 × $1.90', '<b>Step 2</b> Cost = litres × price.'],
          ['= $29.64', 'Check: 16&nbsp;L at $2 would be $32.'],
        ])}</div>
      </div>
      <div class="fig">${costSvg}<div class="cap">find the litres, then multiply by the price</div></div>
    </div>`, 'margin-top:2.5mm')}

  ${we('12.4', 'How far on this much fuel?', 'A small car travels 680&nbsp;km on 40&nbsp;L of petrol. How far can it travel on 25&nbsp;L?', `
    <div class="grid2" style="grid-template-columns: 1fr 57mm; column-gap: 5mm; align-items:center; --wc: 38mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['40 L: 680 km', 'Write what you know, km on the <b>right</b>.'],
          ['1 L: 680 ÷ 40 = 17 km', '<b>Divide</b> by 40 to go down to <b>1</b>&nbsp;L (17&nbsp;km/L).'],
          ['25 L: 25 × 17', '<b>Multiply</b> by 25 to go up to 25 litres.'],
          ['= 425 km', 'Check: less fuel, so less than 680&nbsp;km.'],
        ])}</div>
      </div>
      <div class="fig">${howFarSvg}<div class="cap">down to 1 litre, then up to 25 litres</div></div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 12', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'Which rate (in L/100&nbsp;km) is the most fuel efficient?', ['9.2', '11.5', '7.4', '6.8'], { see: 'Key idea', h: 15.5, row: true })}</div>
    <div>${mc(2, 'A car uses 6&nbsp;L/100&nbsp;km. How much fuel does it use for 450&nbsp;km?', ['2.7&nbsp;L', '27&nbsp;L', '75&nbsp;L', '2700&nbsp;L'], { see: 'Example 12.1', h: 15.5 })}</div>
    <div>${mc(3, 'A van travels 360&nbsp;km on 54&nbsp;L of petrol. What is its rate in L/100&nbsp;km? <span class="hint nw">Hint: litres ÷ km × 100.</span>&#8203;', ['0.15', '6.7', '15', '194.4'], { see: 'Example 12.2', h: 15.5, row: true })}</div>
  </div>`,
};

const p3 = {
  cls: 'l12',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'A car uses 11&nbsp;L/100&nbsp;km. How much fuel does it use on each trip? <span class="hint">Hint: <span class="nw">distance ÷ 100 × 11</span>.</span>', { see: 'Example 12.1', parts: ['500&nbsp;km', '250&nbsp;km', '60&nbsp;km'], h: 26, split: true })}
  ${q(2, 'Find the fuel consumption of each car, in L/100&nbsp;km. <span class="hint">Hint: <span class="nw">litres ÷ km × 100</span>.</span>', { see: 'Example 12.2', parts: ['Kim’s car: 20&nbsp;L for 250&nbsp;km', 'Leo’s car: 39&nbsp;L for 300&nbsp;km', 'Whose car is more efficient?'], h: 26, split: true })}
  ${q(3, 'Petrol costs $1.75 per litre. Find the cost of each amount of petrol. <span class="hint">Hint: <span class="nw">cost = litres × $1.75</span>.</span>', { see: 'Example 12.3', parts: ['20&nbsp;L', '46&nbsp;L', '32.4&nbsp;L'], h: 22, split: true })}
  <div class="grid2 qpair">
    <div>${q(4, 'Ben’s car uses 5.5&nbsp;L/100&nbsp;km. He drives 800&nbsp;km. Petrol costs $1.70 per litre. <span class="hint nw">Hint: litres first.</span>', { see: 'Example 12.3', parts: ['How many litres?', 'What is the cost?'], h: 30, split: true })}</div>
    <div>${q(5, 'A car travels 960&nbsp;km on 80&nbsp;L of petrol. <span class="hint nw">Hint: divide to go down to 1&nbsp;L.</span>', { see: 'Example 12.4', parts: ['How far on 1&nbsp;L?', 'How far on 50&nbsp;L?'], h: 30, split: true })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'Rata drives 150&nbsp;km from Sydney to Newcastle. His car uses 14&nbsp;L/100&nbsp;km. <br>Petrol costs $1.60 per litre.', { see: 'Examples 12.1, 12.2 and 12.3', cols: 1, parts: [
    'How many litres of petrol does the trip use?',
    'How much does the petrol cost? <span class="hint">Hint: <span class="nw">litres × $1.60</span>.</span>',
    'His friend’s hybrid car uses 6&nbsp;L for the same trip. Find its fuel consumption in L/100&nbsp;km.',
    'Which car is more fuel efficient? <span class="hint">Hint: the lower rate uses less fuel.</span>',
  ], h: 28, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 12 &nbsp;Fuel consumption</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> D &nbsp;(the lowest rate)</p>
    <p><b>2</b> B &nbsp;(<span class="nw">450 ÷ 100 × 6 = 27 L)</span></p>
    <p><b>3</b> C &nbsp;(<span class="nw">54 ÷ 360 × 100 = 15 L/100 km)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 5 × 11 = 55 L</span>&nbsp; <span class="nw">(b) 2.5 × 11 = 27.5 L</span>&nbsp; <span class="nw">(c) 0.6 × 11 = 6.6 L</span></p>
    <p><b>2</b> <span class="nw">(a) 20 ÷ 250 × 100 = 8 L/100 km</span>&nbsp; <span class="nw">(b) 39 ÷ 300 × 100 = 13 L/100 km</span>&nbsp; <span class="nw">(c) Kim’s car (8 is lower than 13)</span></p>
    <p><b>3</b> <span class="nw">(a) 20 × $1.75 = $35.00</span>&nbsp; <span class="nw">(b) 46 × $1.75 = $80.50</span>&nbsp; <span class="nw">(c) 32.4 × $1.75 = $56.70</span></p>
    <p><b>4</b> <span class="nw">(a) 800 ÷ 100 × 5.5 = 44 L</span>&nbsp; <span class="nw">(b) 44 × $1.70 = $74.80</span></p>
    <p><b>5</b> <span class="nw">(a) 960 ÷ 80 = 12 km</span>&nbsp; <span class="nw">(b) 50 × 12 = 600 km</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">150 ÷ 100 × 14 = 21 L</span><br>(b) <span class="nw">21 × $1.60 = $33.60</span><br>(c) <span class="nw">6 ÷ 150 × 100 = 4 L/100 km</span><br>(d) the hybrid car <span class="nw">(4 is lower than 14)</span></p>
`;

export const css = '';
