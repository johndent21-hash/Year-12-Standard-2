// Lesson 1 Ratios (textbook 1A). This is the model lesson: copy its structure for every lesson.
import { r, frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';
import { LESSONS } from '../meta.mjs';

// ---------------------------------------------------------------- figures
const bucket = (x, fill) => `
  <g transform="translate(${x},6)">
    <path d="M3 5 Q9 -5 15 5" fill="none" stroke="#3d3d3d" stroke-width="0.9"/>
    <path d="M0.5 5 L17.5 5 L15.3 23 L2.7 23 Z" fill="${fill}" stroke="#3d3d3d" stroke-width="0.9"/>
    <rect x="-0.3" y="3.6" width="18.6" height="3" rx="1" fill="${fill}" stroke="#3d3d3d" stroke-width="0.9"/>
  </g>`;
const bucketsSvg = `
  <svg width="46mm" viewBox="0 0 172 44" font-family="Poppins" font-weight="300">
    ${[0, 1, 2, 3, 4].map((i) => bucket(2 + i * 22, '#d8d2b4')).join('')}
    ${[0, 1].map((i) => bucket(122 + i * 22, '#9fb9da')).join('')}
    <text x="56" y="41" font-size="8" fill="#555" text-anchor="middle">sand</text>
    <text x="142" y="41" font-size="8" fill="#555" text-anchor="middle">cement</text>
  </svg>`;

const barModelSvg = (() => {
  const cell = (x, y, fill) =>
    `<rect x="${x}" y="${y}" width="22" height="16" fill="${fill}" stroke="#fff" stroke-width="1.2"/><text x="${x + 11}" y="${y + 11.5}" font-size="9" text-anchor="middle" fill="#1c1c1c">3</text>`;
  return `
  <svg width="58mm" viewBox="0 0 170 62" font-family="Pagella">
    <text x="0" y="18" font-size="9" fill="#555" font-family="Poppins" font-weight="300">boys</text>
    ${[0, 1, 2].map((i) => cell(30 + i * 22, 6, '#9fb9da')).join('')}
    <text x="102" y="18" font-size="10" fill="#3f7cc0">= 9</text>
    <text x="0" y="46" font-size="9" fill="#555" font-family="Poppins" font-weight="300">girls</text>
    ${[0, 1, 2, 3].map((i) => cell(30 + i * 22, 34, '#d8d2b4')).join('')}
    <text x="124" y="46" font-size="10" fill="#3f7cc0">= 12</text>
  </svg>`;
})();

// ---------------------------------------------------------------- lesson 1
const p1 = {
  html: `
  ${banner({ num: '1', title: 'Ratios', sub: 'Key idea: Ratio • Textbook 1A • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Ratio', `
    <div class="fig" style="float:right; width:48mm; margin:0 0 1mm 4mm">${bucketsSvg}<div class="cap">sand : cement = 5 : 2</div></div>
    <p class="mb0">A <b>ratio</b> compares two or more amounts of the <b>same kind</b>, in a set order.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li>5 buckets of sand to 2 buckets of cement is ${r('5:2')}, read “5 to 2”.</li>
      <li><b>Order matters:</b> cement to sand is ${r('2:5')}. A ratio has <b>no units</b>.</li>
      <li><b>Equivalent ratios:</b> multiply or divide <b>every</b> part by the same number. ${r('5:2')} = ${r('10:4')} = ${r('15:6')}</li>
    </ul>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 1fr 80mm">
    <div>
      <div class="h2">Simplest form</div>
      <p class="mb0">Divide every part by the <b>highest common factor</b> (HCF).</p>
      <ul class="dots mb0" style="margin-top:1mm">
        <li><b>Finding the HCF:</b> try the factors of the smallest number, biggest first, until one divides into every part.</li>
        <li><b>Decimals?</b> Multiply every part by 10 first.</li>
        <li><b>Different units?</b> Make them the same: <span class="nw">40 cm&#8239;:&#8239;2 m = ${r('40:200')} = ${r('1:5')}</span>.</li>
      </ul>
    </div>
    <div>
      <div class="h2">Three ways to write a ratio</div>
      <table class="t compact">
        <tr><th>Form</th><th>How</th><th>${r('8:10')}</th></tr>
        <tr><td><b>Simplest</b></td><td>÷ by the HCF</td><td>${r('4:5')}</td></tr>
        <tr><td><b>${r('1:<i>a</i>')}</b></td><td>÷ by the <b>first</b> number</td><td>${r('1:1.25')}</td></tr>
        <tr><td><b>${r('<i>b</i>:1')}</b></td><td>÷ by the <b>second</b> number</td><td>${r('0.8:1')}</td></tr>
      </table>
    </div>
  </div>

  <div class="h2">Finding an unknown</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Find two numbers in the same place. Divide to find what one was multiplied by. Do the <b>same</b> to the other part.</p>
    <div class="nw">${r('3:4')} = ${r('<i>a</i>:20')} &ensp;→&ensp; 20 ÷ 4 = <b>5</b>, so <i>a</i> = 3 × <b>5</b> = 15</div>
  </div>

  <div style="margin-top:3mm">${checklist(['change a ratio to simplest form, to the form 1 : <i>a</i> and to the form <i>b</i> : 1.', 'use a ratio to find an unknown amount.'])}</div>

  ${we('1.1', 'Simplest form', `Write each ratio in simplest form. &emsp;(a) ${r('12:18')} &emsp;(b) ${r('10:15:30')} &emsp;(c) ${r('4.8:1.6')}`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [r('12:18'), 'The HCF of 12 and 18 is <b>6</b>.'],
      [`= ${r('12 ÷ 6 : 18 ÷ 6')}`, 'Divide <b>both</b> parts by 6.'],
      [`= ${r('2:3')}`, 'Only 1 divides into 2 and 3, so this is simplest form.'],
    ])}
    ${sol('(b)', [
      [r('10:15:30'), 'The HCF of 10, 15 and 30 is <b>5</b>.'],
      [`= ${r('10 ÷ 5 : 15 ÷ 5 : 30 ÷ 5')}`, 'Divide <b>every</b> part by 5.'],
      [`= ${r('2:3:6')}`, 'Only 1 divides into 2, 3 and 6.'],
    ])}
    ${sol('(c)', [
      [r('4.8:1.6'), 'There are decimals. Make whole numbers first.'],
      [`= ${r('4.8 × 10 : 1.6 × 10')}`, 'Multiply <b>both</b> parts by <b>10</b>.'],
      [`= ${r('48:16')}`, 'The HCF of 48 and 16 is <b>16</b>.'],
      [`= ${r('48 ÷ 16 : 16 ÷ 16')}`, 'Divide both parts by 16.'],
      [`= ${r('3:1')}`, `Keep the 1. Write ${r('3:1')}, not just 3.`],
    ])}`, 'margin-top:3mm')}`,
};

const p2 = {
  html: `
  ${we('1.2', 'The forms 1 : <i>a</i> and <i>b</i> : 1', `Write the ratio ${r('15:12')} &ensp;(a) in the form ${r('1:<i>a</i>')} &ensp;(b) in the form ${r('<i>b</i>:1')}.`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [r('15:12'), 'To make the <b>first</b> part 1, divide both parts by the first number, 15.'],
      [`= ${r('15 ÷ 15 : 12 ÷ 15')}`, 'Use your calculator: 12 ÷ 15 = 0.8'],
      [`= ${r('1:0.8')}`, 'The first part is now 1.'],
    ])}
    ${sol('(b)', [
      [r('15:12'), 'To make the <b>second</b> part 1, divide both parts by the second number, 12.'],
      [`= ${r('15 ÷ 12 : 12 ÷ 12')}`, 'Use your calculator: 15 ÷ 12 = 1.25'],
      [`= ${r('1.25:1')}`, 'The second part is now 1.'],
    ])}`)}

  ${we('1.3', 'Finding an unknown', `Find the value of the pronumeral. &emsp;(a) ${r('2:5')} = ${r('<i>a</i>:20')} &emsp;(b) ${r('3:4')} = ${r('15:<i>b</i>')}`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [`${r('2:5')} = ${r('<i>a</i>:20')}`, 'Find two numbers in the same place: 5 and 20 are both <b>second</b> parts.'],
      ['20 ÷ 5 = <b>4</b>', 'Divide to find what 5 was multiplied by (5 × 4 = 20).'],
      ['<i>a</i> = 2 × <b>4</b>', 'Do the same to the first part.'],
      ['<i>a</i> = 8', `Check: ${r('8:20')} simplifies to ${r('2:5')}.`],
    ])}
    ${sol('(b)', [
      [`${r('3:4')} = ${r('15:<i>b</i>')}`, '3 and 15 are both <b>first</b> parts.'],
      ['15 ÷ 3 = <b>5</b>', 'Divide to find what 3 was multiplied by (3 × 5 = 15).'],
      ['<i>b</i> = 4 × <b>5</b>', 'Do the same to the second part.'],
      ['<i>b</i> = 20', `Check: ${r('15:20')} simplifies to ${r('3:4')}.`],
    ])}`, 'margin-top:2.5mm')}

  ${we('1.4', 'Using a ratio to find an amount', `The ratio of boys to girls in a class is ${r('3:4')}. There are 12 girls. How many boys are in the class?`, `
    <div class="grid2" style="grid-template-columns: 1fr 58mm; column-gap: 5mm; align-items:center; --wc: 38mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          [`boys : girls = ${r('3:4')}`, 'Write the ratio with labels so you know which part is which.'],
          ['4 parts = 12 girls', 'Girls are the <b>second</b> part, so 4 parts = 12.'],
          ['1 part = 12 ÷ 4 = 3', 'Find <b>one part</b> first.'],
          ['boys = 3 parts = 3 × 3', 'Boys are the <b>first</b> part, 3 parts.'],
          ['= 9 boys', `Check: ${r('9:12')} simplifies to ${r('3:4')}.`],
        ])}</div>
      </div>
      <div class="fig">${barModelSvg}<div class="cap">each box is one part = 3 students</div></div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 1', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, `Which is equivalent to ${r('2:5')}?`, [r('4:10'), r('5:2'), r('4:7'), r('2:10')], { see: 'Key idea', h: 15.5 })}</div>
    <div>${mc(2, `What is ${r('15:20')} in <span class="nw">simplest form?</span>`, [r('5:4'), r('3:4'), r('1:5'), r('30:40')], { see: 'Example 1.1', h: 15.5 })}</div>
    <div>${mc(3, `Adults : children = ${r('5:9')}. There are 630 children. <span class="nw">How many adults?</span> <span class="hint nw">Hint: 9 parts = 630.</span>`, ['70', '126', '280', '350'], { see: 'Example 1.4', h: 15.5, row: true })}</div>
  </div>`,
};

const p3 = {
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Write each ratio in simplest form. <span class="hint">Hint: find the HCF. Decimals? Multiply by 10 first.</span>', { see: 'Example 1.1', parts: [r('20:30'), r('6:9:12'), r('1.5:2.5')], h: 35, split: true })}
  ${q(2, `Consider the ratio ${r('10:4')}. Write it`, { see: 'Examples 1.1 and 1.2', parts: ['in simplest form', `in the form ${r('1:<i>a</i>')}`, `in the form ${r('<i>b</i>:1')}`], h: 24, split: true })}
  ${q(3, 'Find the value of the pronumeral. <span class="hint">Hint: divide to find what was multiplied.</span>', { see: 'Example 1.3', parts: [`${r('2:3')} = ${r('<i>a</i>:15')}`, `${r('4:3')} = ${r('<i>a</i>:24')}`, `${r('3:5')} = ${r('12:<i>b</i>')}`], h: 28, split: true })}
  <div class="grid2 qpair">
    <div>${q(4, `Gabriel mixes sand and cement in the ratio ${r('5:2')}. He uses 4 buckets of cement. How many buckets of sand? <span class="hint">Hint: <span class="nw">2 parts = 4 buckets</span>.</span>`, { see: 'Example 1.4', h: 30 })}</div>
    <div>${q(5, `The ratio of Victoria’s height to Willow’s height is ${r('8:7')}. Victoria is 176 cm tall. How tall is Willow? <span class="hint">Hint: <span class="nw">8 parts = 176 cm</span>.</span>`, { see: 'Example 1.4', h: 30 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, `A fruit punch recipe mixes orange juice and lemonade in the ratio ${r('3:5')}.`, { see: 'Key idea and Example 1.4', cols: 1, parts: [
    'Write the ratio of <b>lemonade</b> to <b>orange juice</b>.',
    'Mia uses 600 mL of orange juice. How many millilitres is <b>one part</b>?',
    'How much lemonade does Mia need?',
    'How much punch does Mia make altogether? <span class="hint">Hint: add the orange juice and the lemonade.</span>',
  ], h: 24, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 1 &nbsp;Ratios</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> A &emsp;<b>2</b> B</p>
    <p><b>3</b> D &nbsp;(<span class="nw">1 part = 630 ÷ 9 = 70,</span> <span class="nw">adults = 5 × 70 = 350)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) ${r('2:3')}</span>&nbsp; <span class="nw">(b) ${r('2:3:4')}</span>&nbsp; <span class="nw">(c) ${r('3:5')}</span></p>
    <p><b>2</b> <span class="nw">(a) ${r('5:2')}</span>&nbsp; <span class="nw">(b) ${r('1:0.4')}</span>&nbsp; <span class="nw">(c) ${r('2.5:1')}</span></p>
    <p><b>3</b> <span class="nw">(a) <i>a</i> = 10</span>&nbsp; <span class="nw">(b) <i>a</i> = 32</span>&nbsp; <span class="nw">(c) <i>b</i> = 20</span></p>
    <p><b>4</b> <span class="nw">1 part = 4 ÷ 2 = 2,</span> <span class="nw">sand = 5 × 2 = 10 buckets</span></p>
    <p><b>5</b> <span class="nw">1 part = 176 ÷ 8 = 22 cm,</span> <span class="nw">Willow = 7 × 22 = 154 cm</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) ${r('5:3')}<br>(b) <span class="nw">600 ÷ 3 = 200 mL</span><br>(c) <span class="nw">5 × 200 = 1000 mL</span><br>(d) <span class="nw">600 + 1000 = 1600 mL</span></p>
`;

export const css = '';
