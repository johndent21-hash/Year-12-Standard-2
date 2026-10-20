// Lesson 11 Energy (textbook 1I). Follows the structure of the model lesson (Lesson 1).
import { banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// Key idea: a 2 kW heater uses 2 kWh in each hour, so 6 kWh in 3 hours
const hoursSvg = (() => {
  const w = 38;
  const cells = [0, 1, 2].map((i) => {
    const x = 2 + i * w;
    return `<text x="${x + w / 2}" y="8" font-size="8" text-anchor="middle" fill="#555" font-family="Poppins" font-weight="300">1 h</text>
    <rect x="${x}" y="11" width="${w}" height="17" fill="#9fb9da" stroke="#fff" stroke-width="1.2"/>
    <text x="${x + w / 2}" y="23" font-size="9.5" text-anchor="middle" fill="#1c1c1c">2 kWh</text>`;
  }).join('');
  return `
  <svg width="40mm" viewBox="0 0 118 48" font-family="Pagella">
    ${cells}
    <path d="M2.5 31 v3 h113 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="59" y="45" font-size="10" text-anchor="middle" fill="#1c1c1c">3 h: 2 × 3 = 6 kWh</text>
  </svg>`;
})();

// Examples 11.3 and 11.4: three boxes joined by arrows; the last box is the answer
const flow = (vals, ops, labels, { w = 42, gap = 34 } = {}) => {
  const W = 3 * w + 2 * gap + 2;
  const xs = [0, 1, 2].map((i) => 1 + i * (w + gap));
  const cell = (x, t, hi) =>
    `<rect x="${x}" y="14" width="${w}" height="17" rx="2" fill="${hi ? '#eaf1fa' : '#f5f3eb'}" stroke="${hi ? '#3f7cc0' : '#d8d2b4'}" stroke-width="0.9"/><text x="${x + w / 2}" y="26" font-size="9.5" text-anchor="middle" fill="#1c1c1c">${t}</text>`;
  const arrow = (x1, x2, label) =>
    `<line x1="${x1 + 3}" y1="22.5" x2="${x2 - 4}" y2="22.5" stroke="#7a1f4e" stroke-width="0.9"/><path d="M${x2 - 5} 19.5 L${x2 - 0.5} 22.5 L${x2 - 5} 25.5 Z" fill="#7a1f4e"/><text x="${(x1 + x2) / 2}" y="10" font-size="9" text-anchor="middle" fill="#7a1f4e">${label}</text>`;
  return `
  <svg width="${(W * 0.31).toFixed(1)}mm" viewBox="0 0 ${W} 46" font-family="Pagella">
    ${xs.map((x, i) => cell(x, vals[i], i === 2)).join('')}
    ${ops.map((op, i) => arrow(xs[i] + w, xs[i + 1], op)).join('')}
    ${xs.map((x, i) => `<text x="${x + w / 2}" y="43" font-size="8.5" text-anchor="middle" fill="#555" font-family="Poppins" font-weight="300">${labels[i]}</text>`).join('')}
  </svg>`;
};
const costSvg = flow(['2.4 kW', '4.8 kWh', '$1.44'], ['× 2 h', '× $0.30'], ['power', 'energy', 'cost']);
const backSvg = flow(['$3.00', '12 kWh', '10 h'], ['÷ $0.25', '÷ 1.2 kW'], ['cost', 'energy', 'time']);

// ---------------------------------------------------------------- lesson 11
const p1 = {
  cls: 'l11',
  html: `
  ${banner({ num: '11', title: 'Energy', sub: 'Key idea: Energy rate • Textbook 1I • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Energy rate', `
    <div class="fig" style="float:right; width:44mm; margin:0 0 1mm 4mm">${hoursSvg}<div class="cap">a 2 kW heater: 2 kWh each hour</div></div>
    <p class="mb0"><b>Power</b> is how fast an appliance uses electricity, in <b>watts</b> (W) or <b>kilowatts</b> (kW). <b>Energy</b> is the electricity it uses over time, in <b>kilowatt-hours</b> (kWh).</p>
    <ul class="dots mb0" style="margin-top:1mm">
      <li><b>1&nbsp;kW = 1000&nbsp;W.</b> To change W to kW, <b>÷ 1000</b>. <span class="nw">600 W = 600 ÷ 1000 = 0.6 kW</span></li>
      <li><b>Energy (kWh) = power (kW) × time (h).</b> A 2&nbsp;kW heater for 3&nbsp;h uses <span class="nw">2 × 3 = 6 kWh</span>.</li>
      <li><b>Running cost = energy (kWh) × price per kWh.</b> At $0.30 per kWh: <span class="nw">6 × $0.30 = $1.80</span></li>
    </ul>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm; grid-template-columns: 78mm 1fr">
    <div>
      <div class="h2">Power ratings</div>
      <table class="t compact">
        <tr><th>Appliance</th><th>Power (W)</th><th>Power (kW)</th></tr>
        <tr><td>Phone charger</td><td>10&nbsp;W</td><td>0.01&nbsp;kW</td></tr>
        <tr><td>TV</td><td>150&nbsp;W</td><td>0.15&nbsp;kW</td></tr>
        <tr><td>Microwave</td><td>1000&nbsp;W</td><td>1&nbsp;kW</td></tr>
        <tr><td>Kettle</td><td>2200&nbsp;W</td><td>2.2&nbsp;kW</td></tr>
      </table>
    </div>
    <div>
      <div class="h2">Watch the units</div>
      <ul class="dots mb0">
        <li><b>Wh or kWh?</b> W × h gives <b>watt-hours</b> (Wh). kW × h gives <b>kilowatt-hours</b> (kWh). <span class="nw">1 kWh = 1000 Wh</span>.</li>
        <li><b>Minutes?</b> Change to hours: <b>÷ 60</b>. <span class="nw">30 min = 0.5 h</span>.</li>
        <li><b>Cents?</b> Change to dollars: <b>÷ 100</b>. <span class="nw">30 c = $0.30</span>.</li>
      </ul>
    </div>
  </div>

  <div class="h2">Working backwards</div>
  <div class="grid2" style="grid-template-columns: 1fr auto; column-gap: 6mm; align-items: baseline">
    <p class="mb0">Cost ÷ price per kWh = <b>energy</b> (kWh).<br>Energy (kWh) ÷ power (kW) = <b>time</b> (h).</p>
    <div class="nw">$1.80 ÷ $0.30 = 6 kWh &ensp;→&ensp; 6 kWh ÷ 2 kW = <b>3 h</b></div>
  </div>

  <div style="margin-top:3mm">${checklist(['calculate the energy used by an appliance, in kWh or Wh.', 'calculate the cost of running electrical appliances.'])}</div>

  ${we('11.1', 'Energy in kilowatt-hours', `How much energy does each appliance use, in kWh? <br>(a) a 3.5&nbsp;kW air conditioner for 2&nbsp;h &emsp;(b) a 1500&nbsp;W heater for 3&nbsp;h &emsp;(c) a 40&nbsp;W light for 10&nbsp;h`, `
    <div style="--wc: 52mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['Energy = 3.5 × 2', 'The power is already in <b>kW</b>. Energy = power × time.'],
      ['= 7 kWh', 'kW × h gives <b>kilowatt-hours</b> (kWh).'],
    ])}
    ${sol('(b)', [
      ['Power = 1500 ÷ 1000 = 1.5 kW', 'The power is in <b>watts</b>. Change to kW: <b>÷ 1000</b>.'],
      ['Energy = 1.5 × 3', 'Energy = power (kW) × time (h).'],
      ['= 4.5 kWh', 'Check: 1.5&nbsp;kWh each hour, for 3 hours.'],
    ])}
    ${sol('(c)', [
      ['Power = 40 ÷ 1000 = 0.04 kW', 'Change to kW: <b>÷ 1000</b>. <b>Careful:</b> 0.04, not 0.4.'],
      ['Energy = 0.04 × 10', 'Energy = power (kW) × time (h).'],
      ['= 0.4 kWh', 'A light uses much less energy than a heater.'],
    ])}
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l11',
  html: `
  ${we('11.2', 'Energy in watt-hours', `(a) A 60&nbsp;W fan runs for 8&nbsp;h. Find the energy it uses in Wh. &emsp;(b) Write your answer to (a) in kWh. <br>(c) A 2000&nbsp;W oven is used for 30&nbsp;minutes. Find the energy it uses in Wh.`, `
    <div style="--wc: 48mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      ['Energy = 60 × 8', 'The power is in <b>W</b> and we want <b>Wh</b>, so keep the watts.'],
      ['= 480 Wh', 'W × h gives <b>watt-hours</b> (Wh).'],
    ])}
    ${sol('(b)', [
      ['Energy = 480 ÷ 1000', '1&nbsp;kWh = 1000&nbsp;Wh. To a <b>bigger</b> unit, so <b>÷ 1000</b>.'],
      ['= 0.48 kWh', 'Check: 0.06&nbsp;kW × 8&nbsp;h = 0.48&nbsp;kWh.'],
    ])}
    ${sol('(c)', [
      ['Time = 30 ÷ 60 = 0.5 h', 'Time must be in <b>hours</b>. 1&nbsp;h = 60&nbsp;min, so <b>÷ 60</b>.'],
      ['Energy = 2000 × 0.5', 'Power in <b>W</b> × time in <b>h</b>.'],
      ['= 1000 Wh', 'That is the same as 1&nbsp;kWh.'],
    ])}
    </div>`)}

  ${we('11.3', 'Running cost', 'A 2.4&nbsp;kW clothes dryer runs for 2&nbsp;h. Electricity costs 30&nbsp;c per kWh. Find the cost.', `
    <div class="grid2" style="grid-template-columns: 1fr 61mm; column-gap: 5mm; align-items:center; --wc: 44mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['Energy = 2.4 × 2', '<b>Step 1</b> Energy = power × time.'],
          ['= 4.8 kWh', 'The dryer uses 4.8&nbsp;kWh.'],
          ['Price = 30 ÷ 100 = $0.30', '<b>Step 2</b> Cents to dollars: <b>÷ 100</b>.'],
          ['Cost = 4.8 × $0.30', '<b>Step 3</b> Cost = energy × price.'],
          ['= $1.44', 'Check: 5&nbsp;kWh would cost $1.50.'],
        ])}</div>
      </div>
      <div class="fig">${costSvg}<div class="cap">multiply by the time, then by the price</div></div>
    </div>`, 'margin-top:2.5mm')}

  ${we('11.4', 'Working backwards', 'A 1200&nbsp;W pool pump cost $3.00 to run at $0.25 per kWh. How many hours did it run?', `
    <div class="grid2" style="grid-template-columns: 1fr 61mm; column-gap: 5mm; align-items:center; --wc: 50mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          ['Energy = $3.00 ÷ $0.25', '<b>Step 1</b> Energy = cost ÷ price.'],
          ['= 12 kWh', 'The pump used 12&nbsp;kWh.'],
          ['Power = 1200 ÷ 1000 = 1.2 kW', '<b>Step 2</b> W to kW: <b>÷ 1000</b>.'],
          ['Time = 12 ÷ 1.2', '<b>Step 3</b> Time = energy ÷ power.'],
          ['= 10 h', 'Check: 1.2 × 10 × $0.25 = $3.00.'],
        ])}</div>
      </div>
      <div class="fig">${backSvg}<div class="cap">work backwards: divide instead of multiply</div></div>
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 11', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div>${mc(1, 'What is 2500&nbsp;W in kilowatts (kW)?', ['0.25&nbsp;kW', '2.5&nbsp;kW', '25&nbsp;kW', '2500&nbsp;kW'], { see: 'Key idea', h: 15.5 })}</div>
    <div>${mc(2, 'How much energy does an 1800&nbsp;W hair dryer use in <span class="nw">2 hours?</span>', ['0.9&nbsp;kWh', '3.6&nbsp;kWh', '900&nbsp;kWh', '3600&nbsp;kWh'], { see: 'Example 11.1', h: 15.5 })}</div>
    <div>${mc(3, 'A 1.2&nbsp;kW dishwasher runs for 5&nbsp;h at 25&nbsp;c per kWh. <span class="nw">What is the cost?</span> <span class="hint nw">Hint: 25 c = $0.25.</span>', ['$0.30', '$1.25', '$1.50', '$6.00'], { see: 'Example 11.3', h: 15.5 })}</div>
  </div>`,
};

const p3 = {
  cls: 'l11',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Find the energy each appliance uses, in kWh. <span class="hint">Hint: change W to kW first <span class="nw">(÷ 1000)</span>.</span>', { see: 'Example 11.1', parts: ['a 2.5&nbsp;kW oven for 2&nbsp;h', 'a 200&nbsp;W TV for 5&nbsp;h', 'a 50&nbsp;W laptop for 12&nbsp;h'], h: 26, split: true })}
  ${q(2, 'Find the energy each appliance uses, in Wh. <span class="hint">Hint: W × h gives Wh, and <span class="nw">half an hour = 0.5 h</span>.</span>', { see: 'Example 11.2', parts: ['a 15&nbsp;W shaver for 2&nbsp;h', 'a 900&nbsp;W iron for half an hour', 'Write (b) in kWh.'], h: 26, split: true })}
  ${q(3, 'At 20&nbsp;c per kWh, find the cost of using each amount of energy. <span class="hint">Hint: <span class="nw">20 c = $0.20</span>.</span>', { see: 'Example 11.3', parts: ['4&nbsp;kWh', '25&nbsp;kWh', '0.5&nbsp;kWh'], h: 22, split: true })}
  <div class="grid2 qpair">
    <div>${q(4, 'A 250&nbsp;W slow cooker runs for 10&nbsp;hours. Electricity costs 40&nbsp;c per kWh. Find the cost. <span class="hint nw">Hint: kW first, then kWh.</span>', { see: 'Examples 11.1 and 11.3', h: 36 })}</div>
    <div>${q(5, 'A 600&nbsp;W vacuum cleaner cost $2.70 to run. Electricity costs $0.30 per kWh. <span class="nw">For how many hours was it used?</span> <span class="hint nw">Hint: energy = $2.70 ÷ $0.30.</span>', { see: 'Example 11.4', h: 36 })}</div>
  </div>

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'Jai’s 400&nbsp;W gaming PC runs for 5&nbsp;hours a day. Electricity costs 30&nbsp;c per kWh.', { see: 'Examples 11.1 and 11.3', cols: 1, parts: [
    'Write the power of the PC in kW.',
    'How much energy does the PC use in one day, in kWh?',
    'How much does it cost to run the PC for one day? <span class="hint">Hint: <span class="nw">30 c = $0.30</span>.</span>',
    'How much does it cost for one week (7&nbsp;days)? <span class="hint">Hint: 7 × your answer to (c).</span>',
  ], h: 28, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 11 &nbsp;Energy</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> B &nbsp;(<span class="nw">2500 ÷ 1000 = 2.5 kW)</span></p>
    <p><b>2</b> B &nbsp;(<span class="nw">1800 W = 1.8 kW,</span> <span class="nw">1.8 × 2 = 3.6 kWh)</span></p>
    <p><b>3</b> C &nbsp;(<span class="nw">1.2 × 5 = 6 kWh,</span> <span class="nw">6 × $0.25 = $1.50)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 2.5 × 2 = 5 kWh</span>&nbsp; <span class="nw">(b) 0.2 × 5 = 1 kWh</span>&nbsp; <span class="nw">(c) 0.05 × 12 = 0.6 kWh</span></p>
    <p><b>2</b> <span class="nw">(a) 15 × 2 = 30 Wh</span>&nbsp; <span class="nw">(b) 900 × 0.5 = 450 Wh</span>&nbsp; <span class="nw">(c) 450 ÷ 1000 = 0.45 kWh</span></p>
    <p><b>3</b> <span class="nw">(a) 4 × $0.20 = $0.80</span>&nbsp; <span class="nw">(b) 25 × $0.20 = $5.00</span>&nbsp; <span class="nw">(c) 0.5 × $0.20 = $0.10</span></p>
    <p><b>4</b> <span class="nw">250 W = 0.25 kW,</span> <span class="nw">0.25 × 10 = 2.5 kWh,</span> <span class="nw">2.5 × $0.40 = $1.00</span></p>
    <p><b>5</b> <span class="nw">$2.70 ÷ $0.30 = 9 kWh,</span> <span class="nw">600 W = 0.6 kW,</span> <span class="nw">9 ÷ 0.6 = 15 h</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">400 ÷ 1000 = 0.4 kW</span><br>(b) <span class="nw">0.4 × 5 = 2 kWh</span><br>(c) <span class="nw">2 × $0.30 = $0.60</span><br>(d) <span class="nw">7 × $0.60 = $4.20</span></p>
`;

export const css = '';
