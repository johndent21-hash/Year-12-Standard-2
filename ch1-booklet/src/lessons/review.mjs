// Chapter review (textbook Chapter 1 review, simplified). Multiple choice, short answer, extended response,
// set out like the Year 10 Cambridge chapter reviews. Every question points to the lesson that teaches it.
// All numbers and contexts are new: none repeat the textbook's or Lessons 1-12.
import { r, frac, banner, q, mc, sec } from '../parts.mjs';

const BLUE = '#3f7cc0', LBLUE = '#9fb9da', PLUM = '#7a1f4e', INK = '#3d3d3d';

// ---------------------------------------------------------------- figure helpers
const txt = (x, y, s, { size = 9, anchor = 'middle', fill = INK, font = 'Pagella' } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}"${font === 'Poppins' ? ' font-weight="300"' : ''}>${s}</text>`;
const head = (x, y, dir, c, s = 3) => {
  const w = s * 0.55;
  const p = { l: [[x, y], [x + s, y - w], [x + s, y + w]], r: [[x, y], [x - s, y - w], [x - s, y + w]] }[dir];
  return `<polygon points="${p.map((a) => a.map((v) => +v.toFixed(2)).join(',')).join(' ')}" fill="${c}"/>`;
};
const hArrow = (x1, x2, y, c = INK) => `<line x1="${x1 + 2}" y1="${y}" x2="${x2 - 2}" y2="${y}" stroke="${c}" stroke-width="0.6"/>${head(x1, y, 'l', c)}${head(x2, y, 'r', c)}`;
const tick = (x, y, c = INK) => `<line x1="${x}" y1="${y - 2.2}" x2="${x}" y2="${y + 2.2}" stroke="${c}" stroke-width="0.5"/>`;

// ---------------------------------------------------------------- SA 6: bathroom floor plan, drawn true size at 1 : 50 (1 unit = 1 mm)
// The same symbols as the key in Lesson 5. The room is 64 mm by 48 mm between the wall centre lines.
const wallH = (x1, x2, y, t = 1.4) => `<rect x="${x1}" y="${y - t / 2}" width="${x2 - x1}" height="${t}" fill="${INK}"/>`;
const wallV = (x, y1, y2, t = 1.4) => `<rect x="${x - t / 2}" y="${y1}" width="${t}" height="${y2 - y1}" fill="${INK}"/>`;
const windowV = (x, y1, y2, t = 1.4) => `<rect x="${x - t / 2}" y="${y1}" width="${t}" height="${y2 - y1}" fill="#fff" stroke="${INK}" stroke-width="0.3"/><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${INK}" stroke-width="0.3"/>`;
const door = (hx, hy, lx, ly, ax, ay, sweep) => {
  const rad = Math.hypot(lx - hx, ly - hy);
  return `<line x1="${hx}" y1="${hy}" x2="${lx}" y2="${ly}" stroke="${INK}" stroke-width="0.7"/><path d="M${lx} ${ly} A${rad} ${rad} 0 0 ${sweep} ${ax} ${ay}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
};
const bath = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><rect x="${x + 1.3}" y="${y + 1.3}" width="${w - 2.6}" height="${h - 2.6}" rx="${(Math.min(w, h) / 2.8).toFixed(2)}" fill="none" stroke="${INK}" stroke-width="0.35"/><circle cx="${x + 3.2}" cy="${y + h / 2}" r="0.6" fill="${INK}"/>`;
const shower = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><path d="M${x} ${y} L${x + s} ${y + s} M${x + s} ${y} L${x} ${y + s}" stroke="${INK}" stroke-width="0.35"/>`;
const toilet = (cx, top, k = 1) => `<rect x="${cx - 3 * k}" y="${top}" width="${6 * k}" height="${2.3 * k}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><ellipse cx="${cx}" cy="${top + 5.6 * k}" rx="${2.3 * k}" ry="${3.2 * k}" fill="#fff" stroke="${INK}" stroke-width="0.45"/>`;
const basin = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="0.45"/><ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2 - 1.3}" ry="${h / 2 - 1.3}" fill="none" stroke="${INK}" stroke-width="0.35"/>`;
const tag = (x, y, t) => `<circle cx="${x}" cy="${y}" r="2.7" fill="${PLUM}"/><text x="${x}" y="${y + 1.2}" font-size="3.4" fill="#fff" text-anchor="middle" font-family="Poppins" font-weight="500">${t}</text>`;
const planSvg = `
  <svg width="68mm" viewBox="0 0 68 52">
    ${wallH(1.3, 66.7, 2)}
    ${wallH(1.3, 44, 50)}${wallH(60, 66.7, 50)}
    ${wallV(2, 1.3, 22)}${windowV(2, 22, 40)}${wallV(2, 40, 50.7)}
    ${wallV(66, 1.3, 50.7)}
    ${door(60, 50, 60, 34, 44, 50, 0)}
    ${bath(2.7, 2.7, 33, 15)}
    ${toilet(41.5, 2.7, 1.45)}
    ${shower(47.3, 2.7, 18)}
    ${basin(6, 41, 11, 8.3)}
    <text x="31" y="33" font-size="2.6" fill="#7d7d7d" text-anchor="middle" font-family="Poppins" font-weight="500" letter-spacing="0.08">BATHROOM</text>
    <line x1="2.8" y1="31" x2="4.6" y2="31" stroke="${PLUM}" stroke-width="0.5"/>${tag(7.2, 31, 'A')}
    ${tag(19.2, 10.2, 'B')}
  </svg>`;

// ---------------------------------------------------------------- SA 7: a lake with one curved side (not to scale)
const lakeSvg = (() => {
  const x0 = 30, base = 56, span = 72, df = 15, dl = 25, k = 36 / dl;
  const P0 = [x0, +(base - k * df).toFixed(1)], P1 = [x0 + span, +(base - k * dl).toFixed(1)], c = span / 3;
  return `
  <svg width="42mm" viewBox="0 0 132 80">
    <path d="M${x0} ${base} L${P0[0]} ${P0[1]} C${P0[0] + c} ${P0[1] - 12}, ${P1[0] - c} ${P1[1] - 12}, ${P1[0]} ${P1[1]} L${P1[0]} ${base} Z" fill="${LBLUE}" fill-opacity="0.45" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round"/>
    <line x1="${x0}" y1="${base}" x2="${P0[0]}" y2="${P0[1]}" stroke="${BLUE}" stroke-width="2"/>
    <line x1="${P1[0]}" y1="${base}" x2="${P1[0]}" y2="${P1[1]}" stroke="${BLUE}" stroke-width="2"/>
    ${txt(x0 - 4, (base + P0[1]) / 2 + 3.5, `${df} m`, { size: 10.5, anchor: 'end' })}
    ${txt(P1[0] + 4, (base + P1[1]) / 2 + 3.5, `${dl} m`, { size: 10.5, anchor: 'start' })}
    ${txt(x0 + span / 2, (base + P0[1]) / 2 + 6, '1.5 m deep', { size: 7.5, font: 'Poppins', fill: '#2a5d96' })}
    ${tick(x0, base + 7, PLUM)}${tick(P1[0], base + 7, PLUM)}${hArrow(x0, P1[0], base + 7, PLUM)}
    ${txt(x0 + span / 2, base + 17.5, '8 m', { size: 10.5, fill: PLUM })}
  </svg>`;
})();

// ---------------------------------------------------------------- helpers
const MC = 20; // every multiple-choice box is the same small size (mm)
const row3 = (...cells) => `<div class="grid3 qpair">${cells.map((c) => `<div>${c}</div>`).join('')}</div>`;
const m2 = 'm<sup>2</sup>', m3 = 'm<sup>3</sup>';

// ---------------------------------------------------------------- page 1: before you start, multiple choice 1-9
const p1 = {
  cls: 'rev',
  html: `
  ${banner({ num: 'R', title: 'Chapter review', sub: 'Ratios and rates: all key ideas • MST-12-S2-05', cls: 'review' })}
  <div class="beige bys">
    <div class="caps">Before you start</div>
    <ul class="dots mb0">
      <li>Look back at your <b>checklist ratings</b> in Lessons 1 to 12. Any criterion you rated <span class="nw"><span class="rate"><i></i></span>&nbsp;<b>not yet</b></span> or <span class="nw"><span class="rate"><i class="o"></i></span>&nbsp;<b>getting there</b></span> is a good place to start.</li>
      <li><b>Show all your working</b>, <b>include units</b> in your answers, and <b>check</b> that each answer is sensible.</li>
      <li>Stuck? Every question shows the lesson to look back at, like this: <span class="eg">Lesson 4</span>&ensp;The key ideas on page 3 sum up every lesson, and the contents on page 2 shows where each lesson starts.</li>
    </ul>
  </div>

  ${sec('Multiple choice', 'circle the best answer')}
  ${row3(
    mc(1, `At an animal shelter, the ratio of cats to dogs is ${r('4:7')}. There are 56 dogs. How many cats are there?`, ['8', '14', '32', '98'], { see: 'Lesson 1', h: MC, row: true }),
    mc(2, `A 900&nbsp;g bag of flour is divided into two containers in the ratio ${r('5:4')}. What is the mass of the smaller amount?`, ['100&nbsp;g', '400&nbsp;g', '500&nbsp;g', '720&nbsp;g'], { see: 'Lesson 3', h: MC }),
    mc(3, `A scale drawing has a scale of ${r('1:25')}. A line on the drawing is 40&nbsp;mm long. What is the actual length?`, ['1.6&nbsp;mm', '40&nbsp;mm', '65&nbsp;mm', '1000&nbsp;mm'], { see: 'Lesson 4', h: MC }),
  )}
  ${row3(
    mc(4, 'The scale on a map is <span class="nw">1 mm = 40 m</span>. Two places are 800&nbsp;m apart. How far apart are they on the map?', ['20&nbsp;mm', '200&nbsp;mm', '840&nbsp;mm', '32&#8239;000&nbsp;mm'], { see: 'Lesson 4', h: MC }),
    mc(5, 'A dog groomer washes 1 dog every 45 minutes. How many hours does it take to wash 8 dogs?', ['3.6', '6', '36', '360'], { see: 'Lesson 9', h: MC, row: true }),
    mc(6, 'A tap fills a 12&nbsp;L watering can in 30 seconds. What is the rate of flow in litres per minute? <span class="hint nw">Hint: 30 s is half a minute.</span>&#8203;', ['0.4&nbsp;L/min', '6&nbsp;L/min', '12&nbsp;L/min', '24&nbsp;L/min'], { see: 'Lesson 8', h: MC }),
  )}
  ${row3(
    mc(7, 'Which is the <b>slowest</b> speed? <span class="hint nw">Hint: change each to km/h.</span>&#8203;', ['250&nbsp;m/min', '20&nbsp;km/h', '10&nbsp;m/s', '30&#8239;000&nbsp;m/h'], { see: 'Lessons 8 and 10', h: MC }),
    mc(8, 'How much energy does an 800&nbsp;W heater use in 5 hours?', ['0.16&nbsp;kWh', '0.8&nbsp;kWh', '4&nbsp;kWh', '4000&nbsp;kWh'], { see: 'Lesson 11', h: MC }),
    mc(9, 'Ravi uses a 4&nbsp;kW air conditioner for 2 hours. He pays 25&nbsp;c per kWh. What is the cost?', ['$0.50', '$1.00', '$2.00', '$8.00'], { see: 'Lesson 11', h: MC }),
  )}`,
};

// ---------------------------------------------------------------- page 2: multiple choice 10, short answer 1-3
const p2 = {
  cls: 'rev',
  html: `
  ${sec('Multiple choice', 'continued')}
  <div class="grid3 qpair">
    <div>${mc(10, 'A motorbike travels 300&nbsp;km using 15&nbsp;L of petrol. What is its fuel consumption, in L/100&nbsp;km?', ['0.05', '5', '20', '45'], { see: 'Lesson 12', h: MC, row: true })}</div>
    <div class="tipcell">
      <div class="beige tip">
        <div class="caps">Finished the multiple choice?</div>
        <p class="mb0">Check your answers at the back of the workbook before you start the short answer. Got one wrong? Go back to the lesson shown, then try it again.</p>
        <p class="mb0 score">My score: <span class="blank"></span> out of 10</p>
      </div>
    </div>
  </div>

  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Write each ratio in simplest form.', { see: 'Lesson 1', parts: [r('45:20'), r('16:24:40'), r('3.5:1.5')], h: 42, split: true })}
  ${q(2, 'A ranger catches 90 turtles in a lake, tags them and lets them go. A month later she catches 60 turtles, and 15 of them have tags.', { see: 'Lesson 2', parts: ['What fraction of the 2nd sample has tags? Simplify it.', 'Estimate the number of turtles in the lake.'], h: 42, split: true })}
  ${q(3, `Priya and Sam share the profits from their market stall in the ratio ${r('3:5')}.`, { see: 'Lesson 3', parts: ['One week the profit is $640. How much does Priya get?', 'The next week the profit is $1200. How much does Sam get?'], h: 42, split: true })}`,
};

// ---------------------------------------------------------------- page 3: short answer 4-8
const p3 = {
  cls: 'rev',
  html: `
  <div class="grid2 qpair">
    <div>${q(4, `Write each scale as a ratio in the form ${r('1:<i>x</i>')}.`, { see: 'Lesson 4', parts: ['1&nbsp;cm to 5&nbsp;m', '1&nbsp;mm to 8&nbsp;cm', '1&nbsp;m to 2&nbsp;km'], h: 32, split: true })}</div>
    <div>${q(5, 'A map has the scale <span class="nw">1 cm = 4 km</span>. Two towns are 65&nbsp;mm apart on the map. How far apart are they in real life, in&nbsp;km?', { see: 'Lesson 4', h: 32 })}</div>
  </div>
  <div class="grid2 planq">
    <div>${q(6, `This floor plan of a bathroom is drawn at a scale of ${r('1:50')}.`, { see: 'Lesson 5', cols: 1, parts: ['Name the symbol labelled A.', 'Name the symbol labelled B.', 'On the plan, the bathroom is 64&nbsp;mm long. How long is the real bathroom, in metres?'], h: 34, split: true })}</div>
    <div class="fig">${planSvg}<div class="cap">floor plan, scale ${r('1:50')}</div></div>
  </div>
  ${q(7, `<div class="fig" style="float:right; width:44mm; margin:-1mm 0 1mm 4mm">${lakeSvg}<div class="cap">plan of the lake (not to scale)</div></div>A lake in a park has one curved side. The water is 1.5&nbsp;m deep everywhere.`, { see: 'Lessons 6 and 7', cols: 1, parts: [
    'Use the trapezoidal rule to estimate the area of the lake.',
    `Find the volume of water in the lake, in ${m3}.`,
    'Change your answer to (b) into litres.',
    `12&nbsp;mm of rain falls on the lake. Find the volume of the rain, in ${m3}. <span class="hint">Hint: change 12 mm to metres first.</span>`,
  ], h: 36, split: true })}
  ${q(8, 'Convert each rate to the units shown.', { see: 'Lesson 8', parts: ['7200 m/h to m/min', '6 cm/s to mm/s', '$30/kg to $/g'], h: 28, split: true })}`,
};

// ---------------------------------------------------------------- page 4: short answer 9-12
const p4 = {
  cls: 'rev',
  html: `
  ${q(9, 'A 3&nbsp;kg bag of oranges costs $5.40.', { see: 'Lesson 9', parts: ['Find the cost of 1&nbsp;kg.', 'Find the cost of 8&nbsp;kg.', 'A 5&nbsp;kg bag costs $8.50. Which bag is the better buy?'], h: 40, split: true })}
  ${q(10, 'A delivery van travels at 70&nbsp;km/h.', { see: 'Lesson 10', parts: ['How far does it travel in 1.5 hours?', 'How long does it take to travel 245&nbsp;km? Give the time in hours and minutes.'], h: 40, split: true })}
  ${q(11, 'An electric car is charged at home for 5 hours. The charger has a power of 7000&nbsp;W. Electricity costs 20&nbsp;c per kWh.', { see: 'Lesson 11', parts: ['Write 7000&nbsp;W in kW.', 'How much energy is used, in kWh?', 'How much does it cost to charge the car?'], h: 40, split: true })}
  ${q(12, 'A car travels 560&nbsp;km on 40&nbsp;L of petrol.', { see: 'Lesson 12', parts: ['How far does it travel on 1&nbsp;L?', 'How far can it travel on 30&nbsp;L?'], h: 40, split: true })}`,
};

// ---------------------------------------------------------------- page 5: extended response
const p5 = {
  cls: 'rev',
  html: `
  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'There are 600 Year 7 students and 400 Year 8 students going to the swimming carnival. The school hires 20 buses. The buses are shared in the ratio Year&nbsp;7&#8239;:&#8239;Year&nbsp;8.', { see: 'Lesson 3', cols: 1, parts: [
    'Write the ratio Year&nbsp;7&#8239;:&#8239;Year&nbsp;8 in simplest form. <span class="hint">Hint: divide both numbers by 200.</span>',
    'How many parts are there in total?',
    'How many buses is one part?',
    'How many buses are for Year 7? How many are for Year 8?',
  ], h: 50, split: true })}
  ${q(2, 'Two hoses are used to fill a 240&nbsp;L paddling pool. Hose A on its own fills the pool in 12 minutes. Hose B on its own fills it in 24 minutes.', { see: 'Lessons 8 and 9', cols: 1, parts: [
    'How many litres per minute does hose A pour in? <span class="hint">Hint: 240 L in 12 minutes.</span>',
    'How many litres per minute does hose B pour in?',
    'Both hoses are turned on together. How many litres per minute do they pour in altogether?',
    'How long do both hoses take to fill the pool? <span class="hint">Hint: 240 L ÷ your answer to (c).</span>',
  ], h: 50, split: true })}
  <div class="beige endbox">
    <div class="caps">Finished the review?</div>
    <ol class="steps-list mb0">
      <li>Check your answers at the back of the workbook. Fix any mistakes in a different colour.</li>
      <li>For each question you got wrong, go back to the lesson shown and read the worked examples again.</li>
      <li>Rate yourself again on the checklist in each lesson.</li>
    </ol>
  </div>`,
};

export const pages = [p1, p2, p3, p4, p5];

export const answers = `
    <h4>Chapter review</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> C &nbsp;(<span class="nw">56 ÷ 7 = 8,</span> <span class="nw">4 × 8 = 32)</span></p>
    <p><b>2</b> B &nbsp;(<span class="nw">900 ÷ 9 = 100 g,</span> <span class="nw">4 × 100 = 400 g)</span></p>
    <p><b>3</b> D &nbsp;(<span class="nw">40 × 25 = 1000 mm)</span></p>
    <p><b>4</b> A &nbsp;(<span class="nw">800 ÷ 40 = 20 mm)</span></p>
    <p><b>5</b> B &nbsp;(<span class="nw">8 × 45 = 360 min,</span> <span class="nw">360 ÷ 60 = 6 h)</span></p>
    <p><b>6</b> D &nbsp;(<span class="nw">12 L in half a minute,</span> <span class="nw">12 × 2 = 24 L/min)</span></p>
    <p><b>7</b> A &nbsp;(<span class="nw">250 m/min = 15 km/h,</span> <span class="nw">10 m/s = 36 km/h,</span> <span class="nw">30&#8239;000 m/h = 30 km/h)</span></p>
    <p><b>8</b> C &nbsp;(<span class="nw">800 W = 0.8 kW,</span> <span class="nw">0.8 × 5 = 4 kWh)</span></p>
    <p><b>9</b> C &nbsp;(<span class="nw">4 × 2 = 8 kWh,</span> <span class="nw">8 × $0.25 = $2.00)</span></p>
    <p><b>10</b> B &nbsp;(<span class="nw">15 ÷ 300 × 100 = 5 L/100 km)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) ${r('9:4')}</span>&nbsp; <span class="nw">(b) ${r('2:3:5')}</span>&nbsp; <span class="nw">(c) ${r('35:15')} = ${r('7:3')}</span></p>
    <p><b>2</b> <span class="nw">(a) ${frac('15', '60')} = ${frac('1', '4')}</span>&nbsp; <span class="nw">(b) 90 × 4 = 360 turtles</span></p>
    <p><b>3</b> <span class="nw">(a) $640 ÷ 8 × 3 = $240</span>&nbsp; <span class="nw">(b) $1200 ÷ 8 × 5 = $750</span></p>
    <p><b>4</b> <span class="nw">(a) ${r('1:500')}</span>&nbsp; <span class="nw">(b) ${r('1:80')}</span>&nbsp; <span class="nw">(c) ${r('1:2000')}</span></p>
    <p><b>5</b> <span class="nw">65 mm = 6.5 cm,</span> <span class="nw">6.5 × 4 = 26 km</span></p>
    <p><b>6</b> <span class="nw">(a) window</span>&nbsp; <span class="nw">(b) bath</span>&nbsp; <span class="nw">(c) 64 × 50 = 3200 mm</span> <span class="nw">= 3.2 m</span></p>
    <p><b>7</b> <span class="nw">(a) 4 × (15 + 25) = 160 ${m2}</span>&nbsp; <span class="nw">(b) 160 × 1.5 = 240 ${m3}</span>&nbsp; <span class="nw">(c) 240&#8239;000 L</span>&nbsp; <span class="nw">(d) 12 mm = 0.012 m,</span> <span class="nw">160 × 0.012 = 1.92 ${m3}</span></p>
    <p><b>8</b> <span class="nw">(a) 7200 ÷ 60 = 120 m/min</span>&nbsp; <span class="nw">(b) 6 × 10 = 60 mm/s</span>&nbsp; <span class="nw">(c) $30 ÷ 1000 = $0.03/g</span></p>
    <p><b>9</b> <span class="nw">(a) $5.40 ÷ 3 = $1.80</span>&nbsp; <span class="nw">(b) 8 × $1.80 = $14.40</span>&nbsp; <span class="nw">(c) the 5 kg bag</span> <span class="nw">($8.50 ÷ 5 = $1.70 per kg)</span></p>
    <p><b>10</b> <span class="nw">(a) 70 × 1.5 = 105 km</span>&nbsp; <span class="nw">(b) 245 ÷ 70 = 3.5 h</span> <span class="nw">= 3 h 30 min</span></p>
    <p><b>11</b> <span class="nw">(a) 7000 ÷ 1000 = 7 kW</span>&nbsp; <span class="nw">(b) 7 × 5 = 35 kWh</span>&nbsp; <span class="nw">(c) 35 × $0.20 = $7.00</span></p>
    <p><b>12</b> <span class="nw">(a) 560 ÷ 40 = 14 km</span>&nbsp; <span class="nw">(b) 30 × 14 = 420 km</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">${r('600:400')} = ${r('3:2')}</span><br>(b) <span class="nw">3 + 2 = 5</span><br>(c) <span class="nw">20 ÷ 5 = 4 buses</span><br>(d) <span class="nw">Year 7: 3 × 4 = 12 buses,</span> <span class="nw">Year 8: 2 × 4 = 8 buses</span> <span class="nw">(12 + 8 = 20)</span></p>
    <p><b>2</b> (a) <span class="nw">240 ÷ 12 = 20 L/min</span><br>(b) <span class="nw">240 ÷ 24 = 10 L/min</span><br>(c) <span class="nw">20 + 10 = 30 L/min</span><br>(d) <span class="nw">240 ÷ 30 = 8 min</span></p>
`;

// Superscripts must not push lines apart. The two beige boxes take plum headings to match the review banner.
export const css = `
.rev sup { font-size: 70%; line-height: 0; vertical-align: 0; position: relative; top: -.45em; }
.rev .beige .caps { color: var(--plum); margin-bottom: 1mm; }
.rev .bys { margin-bottom: 1mm; }
.rev .bys .rate { vertical-align: -.2mm; }
.rev .rate i.o { border-color: #eea13a; }
.rev .eg { font: 400 8pt/1 'Poppins', sans-serif; color: #2a5d96; white-space: nowrap; }
.rev .eg::before { content: '→ '; font-family: 'PagellaMath', 'Pagella', serif; }
.rev .tipcell { grid-column: span 2; }
.rev .tip { flex: 1 0 auto; margin: 0 0 2.8mm; display: flex; flex-direction: column; justify-content: center; }
.rev .tip .score { margin-top: 2mm; }
.rev .tip .blank { display: inline-block; width: 14mm; border-bottom: .3mm solid var(--ink); margin: 0 1mm; }
.rev .planq { grid-template-columns: 1fr 70mm; column-gap: 5mm; align-items: center; }
.rev .endbox { margin-top: 4mm; }
`;
