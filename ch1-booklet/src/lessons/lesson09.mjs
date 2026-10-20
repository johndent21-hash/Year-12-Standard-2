// Lesson 9 The unitary method and best buys (textbook 1G). Follows the structure of the model lesson (Lesson 1).
import { banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// Two-row table: go down to 1 (divide), then up to the amount needed (multiply)
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
const keySvg = downUp([{ label: 'mass', vals: ['3 kg', '1 kg', '5 kg'] }, { label: 'cost', vals: ['$12', '$4', '$20'] }], ['÷ 3', '× 5'], { lw: 30, w: 26, gap: 27 });
const potatoSvg = downUp([{ label: 'people', vals: ['4', '1', '10'] }, { label: 'potatoes', vals: ['6', '1.5', '15'] }], ['÷ 4', '× 10'], { lw: 42, w: 26, gap: 24 });

// Example 9.3: one hour holds four 15-minute blocks
const hourSvg = (() => {
  const w = 33;
  const cells = [0, 1, 2, 3].map((i) =>
    `<rect x="${2 + i * w}" y="4" width="${w}" height="17" fill="${i % 2 ? '#d8d2b4' : '#9fb9da'}" stroke="#fff" stroke-width="1.2"/><text x="${2 + i * w + w / 2}" y="15.5" font-size="8.5" text-anchor="middle" fill="#1c1c1c">15 min</text>`).join('');
  return `
  <svg width="45mm" viewBox="0 0 136 42" font-family="Pagella">
    ${cells}
    <path d="M2.5 24 v3 h131 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="68" y="38" font-size="10" text-anchor="middle" fill="#1c1c1c">1 h = 60 min</text>
  </svg>`;
})();

// ---------------------------------------------------------------- lesson 9
const p1 = {
  cls: 'l09',
  html: `
  ${banner({ num: '9', title: 'The unitary method and best buys', sub: 'Key idea: Unitary method • Textbook 1G • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Unitary method', `
    <div class="fig" style="float:right; width:56mm; margin:0 0 1mm 4mm">${keySvg}<div class="cap">down to 1 kg, then up to 5 kg</div></div>
    <p class="mb0">The <b>unitary method</b> uses a rate to find an amount. <i>Unit</i> means <b>one</b>: go down to 1, then up to the amount you need.</p>
    <ol class="steps-list mb0" style="margin-top:1mm">
      <li><b>Divide</b> to find the amount for <b>1</b> (1&nbsp;kg, 1 person, 1 hour). <br>3&nbsp;kg costs $12, so <span class="nw">1 kg: $12 ÷ 3 = $4</span>.</li>
      <li><b>Multiply</b> to find the amount you need. <span class="nw">5 kg: 5 × $4 = $20</span>.</li>
    </ol>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 82mm 1fr">
    <div>
      <div class="h2">Setting out</div>
      <table class="t compact">
        <tr><th>Step</th><th>Working</th></tr>
        <tr><td>Write what you know</td><td>3&nbsp;kg costs $12</td></tr>
        <tr><td><b>Divide</b> to go down to 1</td><td>1&nbsp;kg: $12 ÷ 3 = $4</td></tr>
        <tr><td><b>Multiply</b> to go up</td><td>5&nbsp;kg: 5 × $4 = $20</td></tr>
      </table>
      <ul class="dots mb0" style="margin-top:1.5mm">
        <li>Put the amount you want to find on the <b>right</b>.</li>
        <li><b>Check:</b> more kilograms should cost more.</li>
      </ul>
    </div>
    <div>
      <div class="h2">Best buys</div>
      <ul class="dots mb0">
        <li>The <b>unit price</b> is the price for 1 unit, such as per 1&nbsp;L, per 1&nbsp;kg or per 100&nbsp;g.</li>
        <li><span class="nw">Unit price = price ÷ amount</span></li>
        <li>Find the unit price of <b>each</b> item. The <b>lowest</b> unit price is the <b>best buy</b> (the best value).</li>
        <li>Supermarket shelf labels show the unit price under the price.</li>
      </ul>
    </div>
  </div>

  <div class="h2">Price per 100 g</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Count the lots of 100&nbsp;g. Then divide the price by the number of lots.</p>
    <div class="nw">500 g for $4.50 &ensp;→&ensp; 500 ÷ 100 = 5 lots &ensp;→&ensp; $4.50 ÷ 5 = <b>$0.90 per 100 g</b></div>
  </div>

  <div style="margin-top:3mm">${checklist(['use the unitary method to solve problems involving rates.', 'work out which product is the best buy.'])}</div>

  ${we('9.1', 'The unitary method', `(a) 6&nbsp;m of rope costs $27. Find the cost of 10&nbsp;m. <br>(b) A printer prints 90 pages in 5 minutes. How many pages does it print in 12 minutes?`, `
    <div style="--wc: 46mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['6 m costs $27', 'Write what you know. The cost is what we want, so it goes on the <b>right</b>.'],
      ['1 m: $27 ÷ 6 = $4.50', '<b>Divide</b> by 6 to go down to <b>1</b>&nbsp;m.'],
      ['10 m: 10 × $4.50', '<b>Multiply</b> by 10 to go up to 10&nbsp;m.'],
      ['= $45', 'Check: 10&nbsp;m is more than 6&nbsp;m, so it costs more than $27.'],
    ])}
    ${sol('(b)', [
      ['5 min: 90 pages', 'The pages are what we want, so they go on the right.'],
      ['1 min: 90 ÷ 5 = 18 pages', '<b>Divide</b> by 5 to go down to <b>1</b> minute.'],
      ['12 min: 12 × 18', '<b>Multiply</b> by 12 to go up to 12 minutes.'],
      ['= 216 pages', 'Check: more time, so more than 90 pages.'],
    ])}
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l09',
  html: `
  ${we('9.2', 'When the amount for 1 is a decimal', 'A recipe for 4 people uses 6 potatoes. How many potatoes are needed for 10 people?', `
    <div class="grid2" style="grid-template-columns: 1fr 58mm; column-gap: 5mm; align-items:center; --wc: 40mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['4 people: 6 potatoes', 'Put what we want on the <b>right</b>.'],
          ['1 person: 6 ÷ 4 = 1.5', '<b>Divide</b> by 4. Half a potato is fine as a step.'],
          ['10 people: 10 × 1.5', '<b>Multiply</b> by 10. Do not round the 1.5.'],
          ['= 15 potatoes', 'Check: more people need more potatoes.'],
        ])}</div>
      </div>
      <div class="fig">${potatoSvg}<div class="cap">down to 1 person, then up to 10 people</div></div>
    </div>`)}

  ${we('9.3', 'Finding a time', 'A baker ices 1 cake every 15 minutes. How many hours does it take to ice 20 cakes?', `
    <div class="grid2" style="grid-template-columns: 1fr 47mm; column-gap: 5mm; align-items:center; --wc: 40mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['1 cake: 15 min', 'The time for <b>1</b> cake is given. No need to divide.'],
          ['20 cakes: 20 × 15 min', '<b>Multiply</b> by 20 to go up to 20 cakes.'],
          ['= 300 min', 'The question asks for <b>hours</b>.'],
          ['= 300 ÷ 60 h', '60&nbsp;min = 1&nbsp;h, so <b>÷ 60</b>.'],
          ['= 5 h', 'Check: 4 cakes an hour, and 4 × 5 = 20 cakes.'],
        ])}</div>
      </div>
      <div class="fig">${hourSvg}<div class="cap">4 cakes in each hour</div></div>
    </div>`, 'margin-top:3.5mm')}

  ${we('9.4', 'Best buys', `Which is the best buy? &emsp;(a) 2&nbsp;L for $5.00 or 3&nbsp;L for $6.60 &emsp;(b) 400&nbsp;g for $3.20 or 600&nbsp;g for $4.20`, `
    <div style="--wc: 56mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['2 L: $5.00 ÷ 2 = $2.50 per L', 'Find the price of <b>1</b>&nbsp;L: price ÷ litres.'],
      ['3 L: $6.60 ÷ 3 = $2.20 per L', 'Do the same for the other size.'],
      ['3 L for $6.60 is the best buy', '$2.20 per L is the <b>lowest</b> unit price.'],
    ])}
    ${sol('(b)', [
      ['400 g: 400 ÷ 100 = 4 lots', 'Count the lots of <b>100&nbsp;g</b> in the small size.'],
      ['$3.20 ÷ 4 = $0.80 per 100 g', 'Divide the price by the number of lots.'],
      ['600 g: 600 ÷ 100 = 6 lots', 'Count the lots of 100&nbsp;g in the big size.'],
      ['$4.20 ÷ 6 = $0.70 per 100 g', 'Divide the price by the number of lots.'],
      ['600 g for $4.20 is the best buy', '$0.70 per 100&nbsp;g is the <b>lowest</b> unit price.'],
    ])}
    </div>`, 'margin-top:3.5mm')}

  <div style="margin-top:4.5mm">${bar('Your turn 9', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, '4&nbsp;kg of apples cost $10. How much do 6&nbsp;kg of apples cost?', ['$2.50', '$12', '$15', '$60'], { see: 'Example 9.1', h: 15.5 })}</div>
    <div>${mc(2, 'Which bottle of milk is the best buy?', ['1&nbsp;L: $2.50', '2&nbsp;L: $4.60', '3&nbsp;L: $7.20', '4&nbsp;L: $8.40'], { see: 'Example 9.4', h: 15.5 })}</div>
    <div>${mc(3, 'A courier delivers 1 parcel every 25 minutes. How many hours for 24 parcels? <span class="hint nw">Hint: 24 × 25 min, then ÷ 60.</span>&#8203;', ['10', '11', '12', '13'], { see: 'Example 9.3', h: 15.5, row: true })}</div>
  </div>`,
};

const p3 = {
  cls: 'l09',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'A 5&nbsp;kg bag of rice costs $9.20. Find the cost of each amount. <span class="hint">Hint: divide for (a), then multiply.</span>', { see: 'Example 9.1', parts: ['1&nbsp;kg', '3&nbsp;kg', '10&nbsp;kg'], h: 26, split: true })}
  ${q(2, '20&nbsp;m of curtain material costs $580. <span class="hint">Hint: go down to 1&nbsp;m, then up to 35&nbsp;m.</span>', { see: 'Example 9.1', parts: ['What is the cost of 1&nbsp;m?', 'What is the cost of 35&nbsp;m?'], h: 26, split: true })}
  <div class="grid2 qpair">
    <div>${q(3, 'A cake for 6 people needs 3 eggs. How many eggs are needed for a cake for 14 people? <span class="hint nw">Hint: 1 person: 3 ÷ 6 eggs.</span>&#8203;', { see: 'Example 9.2', h: 34 })}</div>
    <div>${q(4, 'Jess types 1 page every 12 minutes. How many hours does it take her to type 15 pages?', { see: 'Example 9.3', h: 34 })}</div>
  </div>
  ${q(5, 'A drink comes in two sizes: 1.25&nbsp;L for $3.25 or 2&nbsp;L for $4.20.', { see: 'Example 9.4', parts: ['Find the price per litre of the 1.25&nbsp;L bottle.', 'Find the price per litre of the 2&nbsp;L bottle.', 'Which is the best buy?'], h: 28, split: true })}

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'Instant coffee comes in a 200&nbsp;g jar for $9.00 or a 500&nbsp;g jar for $20.00.', { see: 'Key idea and Example 9.4', cols: 1, parts: [
    'How many lots of 100&nbsp;g are in each jar?',
    'Find the price per 100&nbsp;g of the 200&nbsp;g jar.',
    'Find the price per 100&nbsp;g of the 500&nbsp;g jar.',
    'Which jar is the best buy? <span class="hint">Hint: look for the lowest price per 100&nbsp;g.</span>',
  ], h: 30, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 9 &nbsp;The unitary method and best buys</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> C &nbsp;(<span class="nw">1 kg: $10 ÷ 4 = $2.50,</span> <span class="nw">6 kg: 6 × $2.50 = $15)</span></p>
    <p><b>2</b> D &nbsp;(per L: <span class="nw">$2.50, $2.30, $2.40, $2.10)</span></p>
    <p><b>3</b> A &nbsp;(<span class="nw">24 × 25 = 600 min,</span> <span class="nw">600 ÷ 60 = 10 h)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) $9.20 ÷ 5 = $1.84</span>&nbsp; <span class="nw">(b) 3 × $1.84 = $5.52</span>&nbsp; <span class="nw">(c) 10 × $1.84 = $18.40</span></p>
    <p><b>2</b> <span class="nw">(a) $580 ÷ 20 = $29</span>&nbsp; <span class="nw">(b) 35 × $29 = $1015</span></p>
    <p><b>3</b> <span class="nw">1 person: 3 ÷ 6 = 0.5 egg,</span> <span class="nw">14 people: 14 × 0.5 = 7 eggs</span></p>
    <p><b>4</b> <span class="nw">15 × 12 = 180 min,</span> <span class="nw">180 ÷ 60 = 3 h</span></p>
    <p><b>5</b> <span class="nw">(a) $3.25 ÷ 1.25 = $2.60 per L</span>&nbsp; <span class="nw">(b) $4.20 ÷ 2 = $2.10 per L</span>&nbsp; <span class="nw">(c) the 2 L bottle</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">200 g: 2 lots,</span> <span class="nw">500 g: 5 lots</span><br>(b) <span class="nw">$9.00 ÷ 2 = $4.50</span><br>(c) <span class="nw">$20.00 ÷ 5 = $4.00</span><br>(d) the 500 g jar <span class="nw">($4.00 per 100 g)</span></p>
`;

export const css = '';
