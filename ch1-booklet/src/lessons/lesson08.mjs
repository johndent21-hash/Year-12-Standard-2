// Lesson 8 Rates (textbook 1G). Follows the structure of the model lesson (Lesson 1).
import { r, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// Key idea: $12 for 3 kg is three 1 kg bags at $4 each
const bag = (x) => `
  <g transform="translate(${x},0)">
    <path d="M4 9 L26 9 L29.5 38 Q29.5 40 27.5 40 L2.5 40 Q0.5 40 0.5 38 Z" fill="#d8d2b4" stroke="#3d3d3d" stroke-width="0.9"/>
    <path d="M4 9 Q8 3 11 6 Q15 1 19 6 Q22 3 26 9" fill="#d8d2b4" stroke="#3d3d3d" stroke-width="0.9"/>
    <text x="15" y="29" font-size="8.5" text-anchor="middle" fill="#3d3d3d">1 kg</text>
    <text x="15" y="52" font-size="10" text-anchor="middle" fill="#3f7cc0">$4</text>
  </g>`;
const bagsSvg = `
  <svg width="38mm" viewBox="0 0 112 72" font-family="Pagella">
    ${[0, 1, 2].map((i) => bag(2 + i * 39)).join('')}
    <path d="M3 57 v3 h105 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="56" y="70" font-size="10" text-anchor="middle" fill="#1c1c1c">$12 for 3 kg</text>
  </svg>`;

// Example 8.4: what happens in 1 minute happens 60 times in 1 hour
const tapSvg = (() => {
  const cell = (x, y, w, t, hi) =>
    `<rect x="${x}" y="${y}" width="${w}" height="17" rx="2" fill="${hi ? '#eaf1fa' : '#f5f3eb'}" stroke="${hi ? '#3f7cc0' : '#d8d2b4'}" stroke-width="0.9"/><text x="${x + w / 2}" y="${y + 12}" font-size="9.5" text-anchor="middle" fill="#1c1c1c">${t}</text>`;
  const arrow = (y, label) =>
    `<line x1="72" y1="${y}" x2="104" y2="${y}" stroke="#7a1f4e" stroke-width="0.9"/><path d="M103 ${y - 3} L108 ${y} L103 ${y + 3} Z" fill="#7a1f4e"/><text x="89" y="${y - 4}" font-size="9" text-anchor="middle" fill="#7a1f4e">× 60</text>`;
  return `
  <svg width="56mm" viewBox="0 0 176 62" font-family="Pagella">
    <text x="0" y="20" font-size="8.5" fill="#555" font-family="Poppins" font-weight="300">water</text>
    <text x="0" y="46" font-size="8.5" fill="#555" font-family="Poppins" font-weight="300">time</text>
    ${cell(30, 7, 38, '25 mL')}${arrow(16, '× 60')}${cell(112, 7, 62, '1500 mL', true)}
    ${cell(30, 33, 38, '1 min')}${arrow(42, '× 60')}${cell(112, 33, 62, '60 min = 1 h', true)}
  </svg>`;
})();

// ---------------------------------------------------------------- lesson 8
const p1 = {
  cls: 'l08',
  html: `
  ${banner({ num: '8', title: 'Rates', sub: 'Key idea: Rate • Textbook 1G • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Rate', `
    <div class="fig" style="float:right; width:42mm; margin:0 0 1mm 4mm">${bagsSvg}<div class="cap">each kilogram costs $4</div></div>
    <p class="mb0">A <b>rate</b> compares two amounts with <b>different units</b>, such as km/h, $/kg, L/100&nbsp;km and $/hour.</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li>Say the / as “<b>per</b>”, which means “for each”. 60&nbsp;km/h is 60 kilometres per hour: 60&nbsp;km in each hour.</li>
      <li><b>Rate or ratio?</b> A ratio compares amounts of the <b>same kind</b> and has no units. A rate has two <b>different</b> units, so <b>always write the units</b>.</li>
      <li><b>Simplest form:</b> give the rate for <b>1</b> of the second unit. <span class="nw">$12 for 3 kg</span> = <span class="nw">$4 for 1 kg</span> = <b>$4/kg</b>.</li>
    </ul>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 74mm 1fr">
    <div>
      <div class="h2">Units you need</div>
      <table class="t compact">
        <tr><th>Measure</th><th>Units</th></tr>
        <tr><td><b>Time</b></td><td>1&nbsp;h = 60&nbsp;min &emsp; 1&nbsp;min = 60&nbsp;s</td></tr>
        <tr><td><b>Volume</b></td><td>1&nbsp;L = 1000&nbsp;mL</td></tr>
        <tr><td><b>Mass</b></td><td>1&nbsp;kg = 1000&nbsp;g</td></tr>
        <tr><td><b>Length</b></td><td>1&nbsp;km = 1000&nbsp;m &emsp; 1&nbsp;cm = 10&nbsp;mm</td></tr>
      </table>
    </div>
    <div>
      <div class="h2">Converting a rate</div>
      <p class="mb0">Change <b>one unit at a time</b>, and write every step.</p>
      <ul class="dots mb0" style="margin-top:1mm">
        <li><b>Before the /</b>: a <b>smaller</b> unit? Multiply. A <b>bigger</b> unit? Divide. <span class="nw">mL → L is ÷ 1000.</span></li>
        <li><b>After the /</b>: ask “how much in <b>1</b> of the new unit?” <span class="nw">1 min = 60 s,</span> so <span class="nw">per s → per min is × 60.</span></li>
      </ul>
    </div>
  </div>

  <div class="h2">Two units to change</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Change the time first. Then change the other unit.</p>
    <div class="nw">90 m/min = 90 × 60 m/h = 5400 m/h = 5400 ÷ 1000 km/h = 5.4 km/h</div>
  </div>

  <div style="margin-top:3mm">${checklist(['write a rate in simplest form, such as $4/kg.', 'convert a rate to other units of measurement.'])}</div>

  ${we('8.1', 'Simplest form of a rate', `Write each rate in simplest form. &emsp;(a) $12 for 3&nbsp;kg &emsp;(b) 20&nbsp;L in 4&nbsp;min &emsp;(c) 150&nbsp;km in 2&nbsp;h`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['$12 for 3 kg', 'We want the cost of <b>1</b>&nbsp;kg, not 3&nbsp;kg.'],
      ['= $12 ÷ 3 for 1 kg', '<b>Divide</b> by 3 to go down to 1&nbsp;kg.'],
      ['= $4/kg', '“For 1 kg” is written <b>/kg</b>. Say “4 dollars per kilogram”.'],
    ])}
    ${sol('(b)', [
      ['20 L in 4 min', 'We want the litres in <b>1</b> minute.'],
      ['= 20 ÷ 4 L in 1 min', '<b>Divide</b> by 4 to go down to 1 minute.'],
      ['= 5 L/min', 'Say “5 litres per minute”.'],
    ])}
    ${sol('(c)', [
      ['150 km in 2 h', 'We want the distance in <b>1</b> hour.'],
      ['= 150 ÷ 2 km in 1 h', '<b>Divide</b> by 2 to go down to 1 hour.'],
      ['= 75 km/h', 'Keep the <b>units</b>: 75 on its own does not say what it measures.'],
    ])}`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l08',
  html: `
  ${we('8.2', 'Changing the time unit', `Convert each rate. &emsp;(a) 4 L/s to L/min &emsp;(b) 4800 m/h to m/min`, `
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['4 L/s', '4 litres in <b>each</b> second.'],
      ['= 4 × 60 L/min', 'There are <b>60</b> seconds in 1 minute, so <b>× 60</b>.'],
      ['= 240 L/min', 'A minute is longer, so the number gets <b>bigger</b>.'],
    ])}
    ${sol('(b)', [
      ['4800 m/h', '4800&nbsp;m in each hour, and 1 hour = 60 minutes.'],
      ['= 4800 ÷ 60 m/min', 'A minute is 60 times <b>shorter</b> than an hour, so <b>÷ 60</b>.'],
      ['= 80 m/min', 'Check: 80 × 60 = 4800&nbsp;m in an hour.'],
    ])}`)}

  ${we('8.3', 'Changing the other unit', `Convert each rate. &emsp;(a) 4 cm/s to mm/s &emsp;(b) 5000 m/h to km/h &emsp;(c) $20/kg to $/g`, `
    <div style="--wc: 52mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['4 cm/s = 4 × 10 mm/s', '1&nbsp;cm = 10&nbsp;mm. To a <b>smaller</b> unit, so <b>×</b>&nbsp;10.'],
      ['= 40 mm/s', 'Only the cm changed. The /s stays the same.'],
    ])}
    ${sol('(b)', [
      ['5000 m/h = 5000 ÷ 1000 km/h', '1000&nbsp;m = 1&nbsp;km. To a <b>bigger</b> unit, so <b>÷</b>&nbsp;1000.'],
      ['= 5 km/h', 'The /h stays the same.'],
    ])}
    ${sol('(c)', [
      ['$20/kg = $20 for 1000 g', 'This time the unit <b>after</b> the / changes. 1&nbsp;kg = 1000&nbsp;g.'],
      ['= $20 ÷ 1000 for 1 g', '<b>Divide</b> by 1000 to find the cost of <b>1</b>&nbsp;g.'],
      ['= $0.02/g', '1&nbsp;g is much smaller than 1&nbsp;kg, so it costs much <b>less</b>.'],
    ])}
    </div>`, 'margin-top:2.5mm')}

  ${we('8.4', 'Changing both units', 'A dripping tap wastes 25&nbsp;mL of water every minute. Convert this rate to litres per hour (L/h).', `
    <div class="grid2" style="grid-template-columns: 1fr 56mm; column-gap: 5mm; align-items:center; --wc: 36mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['25 mL/min', '<b>One unit at a time.</b> Start with the time.'],
          ['= 25 × 60 mL/h', 'There are 60 minutes in 1 hour, so <b>× 60</b>.'],
          ['= 1500 mL/h', 'Now change mL to L.'],
          ['= 1500 ÷ 1000 L/h', '1000&nbsp;mL = 1&nbsp;L. To a <b>bigger</b> unit, so <b>÷ 1000</b>.'],
          ['= 1.5 L/h', 'The tap wastes 1.5 litres every hour.'],
        ])}</div>
      </div>
      <div class="fig">${tapSvg}<div class="cap">1 hour is 60 minutes, so 60 times the water</div></div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 8', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'Ella is paid $96 for 4 hours of work. What is her rate of pay?', ['$24/h', '$92/h', '$100/h', '$384/h'], { see: 'Example 8.1', h: 15.5 })}</div>
    <div>${mc(2, 'A hose pours out 30&nbsp;L of water every minute. What is this rate in L/h?', ['0.5&nbsp;L/h', '90&nbsp;L/h', '1800&nbsp;L/h', '3000&nbsp;L/h'], { see: 'Example 8.4', h: 15.5 })}</div>
    <div>${mc(3, 'Which is the <b>slowest</b> speed? <span class="hint nw">Hint: change each to km/h.</span>&#8203;', ['40&nbsp;km/h', '6000&nbsp;m/h', '60&nbsp;km/h', '2000&nbsp;m/min'], { see: 'Examples 8.3 and 8.4', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l08',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Write each rate in simplest form. <span class="hint">Hint: divide to go down to 1 of the second unit.</span>', { see: 'Example 8.1', parts: ['$18 for 3&nbsp;kg', '35&nbsp;L in 5&nbsp;min', '240&nbsp;km in 4&nbsp;h'], h: 26, split: true })}
  ${q(2, 'Convert each rate. <span class="hint">Hint: <span class="nw">1 min = 60 s</span> and <span class="nw">1 h = 60 min</span>.</span>', { see: 'Examples 8.2 and 8.4', parts: ['5 bottles/s to bottles/min', '14&#8239;400 m/h to m/min', '50 mL/min to mL/h'], h: 26, split: true })}
  ${q(3, 'Convert each rate. <span class="hint">Hint: <span class="nw">1 cm = 10 mm</span>, <span class="nw">1 km = 1000 m</span> and <span class="nw">1 kg = 1000 g</span>.</span>', { see: 'Example 8.3', parts: ['8 cm/s to mm/s', '7000 m/h to km/h', '$15/kg to $/g'], h: 28, split: true })}
  <div class="grid2 qpair">
    <div>${q(4, 'A dripping tap wastes 30&nbsp;mL of water every minute. Convert this rate to litres per hour (L/h). <span class="hint">Hint: × 60 first, then ÷ 1000.</span>', { see: 'Example 8.4', h: 35 })}</div>
    <div>${q(5, 'A toy car travels at 120&nbsp;cm/s. Convert this speed to mm/min. <span class="hint">Hint: change the time first <span class="nw">(× 60)</span>, then cm to mm <span class="nw">(× 10)</span>.</span>', { see: 'Examples 8.2 and 8.3', h: 35 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'A machine in a factory fills 1200 bottles in 4 minutes.', { see: 'Examples 8.1, 8.2 and 8.4', cols: 1, parts: [
    'Write this rate in simplest form, in bottles/min.',
    'Convert your answer to (a) into bottles/h.',
    'Convert your answer to (a) into bottles/s. <span class="hint">Hint: a second is 60 times shorter than a minute.</span>',
    'A new machine fills 6 bottles/s. Which machine is faster? <span class="hint">Hint: compare with (c).</span>',
  ], h: 30, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 8 &nbsp;Rates</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> A &nbsp;(<span class="nw">$96 ÷ 4 = $24/h)</span></p>
    <p><b>2</b> C &nbsp;(<span class="nw">30 × 60 = 1800 L/h)</span></p>
    <p><b>3</b> B &nbsp;(<span class="nw">6000 m/h = 6 km/h;</span> <span class="nw">2000 m/min = 120 km/h)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) $6/kg</span>&nbsp; <span class="nw">(b) 7 L/min</span>&nbsp; <span class="nw">(c) 60 km/h</span></p>
    <p><b>2</b> <span class="nw">(a) 5 × 60 = 300 bottles/min</span>&nbsp; <span class="nw">(b) 14&#8239;400 ÷ 60 = 240 m/min</span>&nbsp; <span class="nw">(c) 50 × 60 = 3000 mL/h</span></p>
    <p><b>3</b> <span class="nw">(a) 8 × 10 = 80 mm/s</span>&nbsp; <span class="nw">(b) 7000 ÷ 1000 = 7 km/h</span>&nbsp; <span class="nw">(c) $15 ÷ 1000 = $0.015/g</span></p>
    <p><b>4</b> <span class="nw">30 × 60 = 1800 mL/h,</span> <span class="nw">1800 ÷ 1000 = 1.8 L/h</span></p>
    <p><b>5</b> <span class="nw">120 × 60 = 7200 cm/min,</span> <span class="nw">7200 × 10 = 72&#8239;000 mm/min</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">1200 ÷ 4 = 300 bottles/min</span><br>(b) <span class="nw">300 × 60 = 18&#8239;000 bottles/h</span><br>(c) <span class="nw">300 ÷ 60 = 5 bottles/s</span><br>(d) the new machine <span class="nw">(6 bottles/s is more than 5 bottles/s)</span></p>
`;

export const css = '';
