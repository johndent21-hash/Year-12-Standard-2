// Lesson 3 Dividing a quantity in a given ratio (textbook 1C). Follows the structure of the model lesson (Lesson 1).
import { r, frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// Bar model with one row of equal boxes per person, drawn at the same scale as Lesson 1's bar model.
const barRows = (rows, label, { w = 22, lw = 30, gap = 28, width } = {}) => {
  const max = Math.max(...rows.map((row) => row.n));
  const W = lw + max * w + 42, H = gap * (rows.length - 1) + 26;
  const cell = (x, y, fill) =>
    `<rect x="${x}" y="${y}" width="${w}" height="16" fill="${fill}" stroke="#fff" stroke-width="1.2"/><text x="${x + w / 2}" y="${y + 11.5}" font-size="9" text-anchor="middle" fill="#1c1c1c">${label}</text>`;
  return `
  <svg width="${width || (W * 0.341).toFixed(1)}mm" viewBox="0 0 ${W} ${H}" font-family="Pagella">
    ${rows.map((row, j) => {
      const y = 5 + j * gap;
      return `<text x="0" y="${y + 12}" font-size="9" fill="#555" font-family="Poppins" font-weight="300">${row.name}</text>
      ${Array.from({ length: row.n }, (_, i) => cell(lw + i * w, y, row.fill)).join('')}
      <text x="${lw + row.n * w + 6}" y="${y + 12}" font-size="10" fill="#3f7cc0">${row.total}</text>`;
    }).join('')}
  </svg>`;
};
const BLUE = '#9fb9da', SAND = '#d8d2b4';

const keySvg = barRows([{ name: 'Amy', n: 2, fill: BLUE, total: '= $16' }, { name: 'Ben', n: 3, fill: SAND, total: '= $24' }], '$8');
const avaSvg = barRows([{ name: 'Ava', n: 4, fill: BLUE, total: '= $20' }, { name: 'Ben', n: 5, fill: SAND, total: '= $25' }], '$5', { w: 17 });
const threeSvg = barRows([
  { name: 'Mia', n: 1, fill: BLUE, total: '= $12' },
  { name: 'Noah', n: 2, fill: SAND, total: '= $24' },
  { name: 'Olivia', n: 3, fill: '#c9d8ea', total: '= $36' },
], '$12', { lw: 34, gap: 24 });

// Example 3.2: 240 g of nuts in 8 equal parts, 5 larger and 3 smaller
const nutsSvg = (() => {
  const w = 20;
  const cells = Array.from({ length: 8 }, (_, i) =>
    `<rect x="${2 + i * w}" y="14" width="${w}" height="16" fill="${i < 5 ? SAND : BLUE}" stroke="#fff" stroke-width="1.2"/><text x="${2 + i * w + w / 2}" y="25.5" font-size="8.5" text-anchor="middle" fill="#1c1c1c">30 g</text>`).join('');
  return `
  <svg width="47mm" viewBox="0 0 164 50" font-family="Pagella">
    <text x="52" y="9" font-size="8" fill="#555" text-anchor="middle" font-family="Poppins" font-weight="300">larger: 5 parts</text>
    <text x="132" y="9" font-size="8" fill="#3f7cc0" text-anchor="middle" font-family="Poppins" font-weight="300">smaller: 3 parts</text>
    ${cells}
    <path d="M2.5 33 v3 h99 v-3 M102.5 33 v3 h59 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="52" y="47" font-size="10" text-anchor="middle" fill="#1c1c1c">150 g</text>
    <text x="132" y="47" font-size="10" text-anchor="middle" fill="#3f7cc0">90 g</text>
  </svg>`;
})();

// ---------------------------------------------------------------- lesson 3
const p1 = {
  cls: 'l03',
  html: `
  ${banner({ num: '3', title: 'Dividing a quantity in a given ratio', sub: 'Key idea: Dividing a quantity in a given ratio • Textbook 1C • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Dividing a quantity in a ratio', `
    <div class="fig" style="float:right; width:50mm; margin:0 0 1mm 4mm">${keySvg}<div class="cap">Share $40 in the ratio ${r('2:3')}.<br>5 parts, so each part is $8.</div></div>
    <p class="mb0">To divide a <b>quantity</b> (an amount) in a ratio, change the ratio into <b>fractions</b>. Then multiply the quantity by each fraction.</p>
    <ol class="steps-list mb0" style="margin-top:1mm">
      <li><b>Add</b> the parts to get the total number of parts: 2 + 3 = 5.</li>
      <li>Write each part <b>over the total</b>: ${frac('2', '5')} and ${frac('3', '5')}.</li>
      <li><b>Multiply</b> the quantity by each: <span class="nw">${frac('2', '5')} × $40 = $16</span>, <span class="nw">${frac('3', '5')} × $40 = $24</span>.</li>
      <li><b>Check</b> that the shares add up to the quantity: <span class="nw">$16 + $24 = $40</span>.</li>
    </ol>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm">
    <div>
      <div class="h2">Ratio to fractions</div>
      <table class="t compact">
        <tr><th>Ratio</th><th>Total parts</th><th>Fractions</th></tr>
        <tr><td>${r('5:1')}</td><td>5 + 1 = 6</td><td>${frac('5', '6')} and ${frac('1', '6')}</td></tr>
        <tr><td>${r('1:3')}</td><td>1 + 3 = 4</td><td>${frac('1', '4')} and ${frac('3', '4')}</td></tr>
        <tr><td>${r('1:2:4')}</td><td>1 + 2 + 4 = 7</td><td>${frac('1', '7')}, ${frac('2', '7')} and ${frac('4', '7')}</td></tr>
      </table>
    </div>
    <div>
      <div class="h2">Tips</div>
      <ul class="dots mb0">
        <li><b>Order matters.</b> Amy&#8239;:&#8239;Ben = ${r('2:3')} means Amy gets 2 parts and Ben gets 3.</li>
        <li>The <b>smaller</b> share goes with the <b>smaller</b> number.</li>
        <li><b>Three parts?</b> Same steps. Add all three parts.</li>
      </ul>
    </div>
  </div>

  <div class="h2">Another way: find one part</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Divide the amount by the total parts to find <b>one part</b>. Then multiply by each number in the ratio.</p>
    <div class="nw">$40 ÷ 5 = <b>$8</b> &ensp;→&ensp; 2 × <b>$8</b> = $16, &nbsp;3 × <b>$8</b> = $24</div>
  </div>

  <div style="margin-top:3mm">${checklist(['divide a quantity in a given ratio, with two or three parts.'])}</div>

  ${we('3.1', 'Sharing in a ratio', `Ava and Ben share $45 in the ratio ${r('4:5')}. &emsp;(a) How much does Ava get? &emsp;(b) How much does Ben get?`, `
    <div class="grid2" style="grid-template-columns: 1fr 52mm; column-gap: 4mm; align-items:center; --wc: 36mm">
      <div>
        <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
        ${sol('(a)', [
          ['total parts = 4 + 5 = 9', '<b>Add</b> the parts of the ratio.'],
          [`Ava = ${frac('4', '9')} × $45`, 'Ava is first, so she gets <b>4</b> of the 9 parts.'],
          ['= $45 ÷ 9 × 4', 'Divide by 9, then multiply by 4.'],
          ['= $5 × 4', 'One part is $45 ÷ 9 = $5.'],
          ['= $20', 'Ava gets 4 parts of $5.'],
        ])}
        ${sol('(b)', [
          [`Ben = ${frac('5', '9')} × $45`, 'Ben gets the other <b>5</b> parts.'],
          ['= $45 ÷ 9 × 5', 'Divide by 9, then multiply by 5.'],
          ['= $5 × 5', 'One part is still $5.'],
          ['= $25', 'Check: $20 + $25 = $45, the whole amount.'],
        ])}
      </div>
      <div class="fig">${avaSvg}<div class="cap">9 parts, so each part is<br>$45 ÷ 9 = $5</div></div>
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l03',
  html: `
  ${we('3.2', 'Finding one share', `A 240&nbsp;g bag of nuts is divided in the ratio ${r('5:3')}. What is the mass of the <b>smaller</b> amount?`, `
    <div class="grid2" style="grid-template-columns: 1fr 48mm; column-gap: 4mm; align-items:center; --wc: 45mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['total parts = 5 + 3 = 8', '<b>Add</b> the parts.'],
          [`smaller = ${frac('3', '8')} × 240 g`, 'The smaller amount goes with the <b>smaller</b> number, 3.'],
          ['= 240 g ÷ 8 × 3 = 30 g × 3', 'Divide by 8, then multiply by 3.'],
          ['= 90 g', 'Check: 5 × 30 = 150&nbsp;g, and 150 + 90 = 240.'],
        ])}</div>
      </div>
      <div class="fig">${nutsSvg}<div class="cap">8 parts, so each part is<br>240 ÷ 8 = 30&nbsp;g</div></div>
    </div>`)}

  ${we('3.3', 'A ratio with three parts', `Mia, Noah and Olivia share $72 in the ratio ${r('1:2:3')}. How much does each person get?`, `
    <div class="grid2" style="grid-template-columns: 1fr 50mm; column-gap: 5mm; align-items:center; --wc: 64mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['total parts = 1 + 2 + 3 = 6', 'Add <b>all three</b> parts.'],
          [`Mia = ${frac('1', '6')} × $72 = $72 ÷ 6 = $12`, 'Mia gets 1 part. One part is $12.'],
          [`Noah = ${frac('2', '6')} × $72 = $12 × 2 = $24`, 'Noah gets 2 parts of $12.'],
          [`Olivia = ${frac('3', '6')} × $72 = $12 × 3 = $36`, 'Olivia gets 3 parts of $12.'],
          ['Mia $12, Noah $24, Olivia $36', 'Check: $12 + $24 + $36 = $72.'],
        ])}</div>
      </div>
      <div class="fig">${threeSvg}<div class="cap">6 parts, so each part is<br>$72 ÷ 6 = $12</div></div>
    </div>`, 'margin-top:2.5mm')}

  ${we('3.4', 'Making the ratio first', `A school camp has 45 students and 18 teachers. The 21 tents are shared in the ratio students&#8239;:&#8239;teachers. How many tents does each group get?`, `
    <div style="--wc: 56mm">
    <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
    <div style="margin-top:1mm">${steps([
      [`students : teachers = ${r('45:18')}`, 'Write the numbers in the <b>same order</b> as the words.'],
      [`= ${r('45 ÷ 9 : 18 ÷ 9')} = <b>${r('5:2')}</b>`, 'The HCF of 45 and 18 is <b>9</b>. Divide both parts by 9 to get simplest form.'],
      ['total parts = 5 + 2 = 7', '<b>Add</b> the parts.'],
      ['1 part = 21 ÷ 7 = 3 tents', 'Share the 21 tents: find <b>one part</b>.'],
      ['students = 5 × 3 = 15 tents', 'Students get 5 parts.'],
      ['teachers = 2 × 3 = 6 tents', 'Teachers get 2 parts.'],
      ['15 tents and 6 tents', 'Check: 15 + 6 = 21 tents.'],
    ])}</div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 3', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, `Kim and Lee share some money in the ratio ${r('2:7')}. What fraction does Kim get?`, [frac('2', '7'), frac('2', '9'), frac('7', '9'), frac('1', '2')], { see: 'Key idea', h: 15.5, row: true })}</div>
    <div>${mc(2, `A 360&nbsp;g bag of lollies is divided in the ratio ${r('7:5')}. Find the mass of the smaller amount.`, ['150&nbsp;g', '168&nbsp;g', '192&nbsp;g', '210&nbsp;g'], { see: 'Example 3.2', h: 15.5 })}</div>
    <div>${mc(3, `$90 is shared in the ratio ${r('1:3:5')}. What is the largest share? <span class="hint nw">Hint: 1 + 3 + 5 = 9 parts.</span>&#8203;`, ['$10', '$18', '$30', '$50'], { see: 'Example 3.3', h: 15.5, row: true })}</div>
  </div>`,
};

const p3 = {
  cls: 'l03',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Divide $400 in each ratio. <span class="hint">Hint: add the parts first.</span>', { see: 'Example 3.1', parts: [r('3:2'), r('4:1'), r('3:7')], h: 34, split: true })}
  ${q(2, `Daniel and Eddie share their profits in the ratio ${r('3:4')}. <span class="hint nw">Hint: 3 + 4 = 7 parts.</span>&#8203;`, { see: 'Examples 3.1 and 3.2', parts: ['One week the profit is $700. How much does Daniel get?', 'The next week the profit is $1400. How much does Eddie get?'], h: 26, split: true })}
  ${q(3, `Share $100 between Jack, Kate and Leo in the ratio ${r('2:3:5')}. <span class="hint nw">Hint: 2 + 3 + 5 = 10 parts.</span>&#8203;`, { see: 'Example 3.3', h: 26 })}
  <div class="grid2 qpair">
    <div>${q(4, `A 35&nbsp;kg bag of potting mix has soil and compost in the ratio ${r('4:3')}. How many kilograms of compost are in the bag? <span class="hint nw">Hint: 7 parts = 35 kg.</span>&#8203;`, { see: 'Example 3.2', h: 26 })}</div>
    <div>${q(5, `A 90&nbsp;cm piece of wood is cut into two pieces in the ratio ${r('7:2')}. How long is the longer piece? <span class="hint nw">Hint: 9 parts = 90 cm.</span>&#8203;`, { see: 'Example 3.2', h: 26 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'A cruise ship has 160 passengers and 60 crew. Its 22 lifeboats are shared in the ratio passengers&#8239;:&#8239;crew.', { see: 'Example 3.4', cols: 1, parts: [
    'Write the ratio passengers&#8239;:&#8239;crew in simplest form. <span class="hint">Hint: the HCF of 160 and 60 is 20.</span>',
    'How many parts are there in total?',
    'How many lifeboats is one part?',
    'How many lifeboats are for the passengers? How many are for the crew?',
  ], h: 26, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 3 &nbsp;Dividing a quantity in a given ratio</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> B &emsp;<b>2</b> A &nbsp;(<span class="nw">360 ÷ 12 = 30,</span> <span class="nw">5 × 30 = 150 g)</span></p>
    <p><b>3</b> D &nbsp;(<span class="nw">$90 ÷ 9 = $10,</span> <span class="nw">5 × $10 = $50)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) $240 and $160</span>&nbsp; <span class="nw">(b) $320 and $80</span>&nbsp; <span class="nw">(c) $120 and $280</span></p>
    <p><b>2</b> <span class="nw">(a) $700 ÷ 7 × 3 = $300</span>&nbsp; <span class="nw">(b) $1400 ÷ 7 × 4 = $800</span></p>
    <p><b>3</b> <span class="nw">1 part = $100 ÷ 10 = $10,</span> <span class="nw">Jack $20, Kate $30, Leo $50</span></p>
    <p><b>4</b> <span class="nw">1 part = 35 ÷ 7 = 5 kg,</span> <span class="nw">compost = 3 × 5 = 15 kg</span></p>
    <p><b>5</b> <span class="nw">1 part = 90 ÷ 9 = 10 cm,</span> <span class="nw">longer = 7 × 10 = 70 cm</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">${r('160:60')} = ${r('8:3')}</span><br>(b) <span class="nw">8 + 3 = 11</span><br>(c) <span class="nw">22 ÷ 11 = 2 lifeboats</span><br>(d) <span class="nw">passengers 8 × 2 = 16,</span> <span class="nw">crew 3 × 2 = 6</span> <span class="nw">(16 + 6 = 22)</span></p>
`;

export const css = `
  .l03 .steps .frac { line-height: 1.04; font-size: .92em; }
  .l03 table.t .frac { line-height: 1.04; font-size: .92em; }
  .l03 table.t td { padding-top: .7mm; padding-bottom: .7mm; vertical-align: middle; }
  .l03 .steps { row-gap: .9mm; }
  .l03 ol.steps-list .frac { line-height: 1.06; font-size: .94em; }
`;
