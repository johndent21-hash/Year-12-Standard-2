import { r, frac, shortBanner, box } from './parts.mjs';
import { LESSONS, REVIEW_PAGE, ANSWERS_PAGE } from './meta.mjs';
import * as review from './lessons/review.mjs';

const lessonModules = await Promise.all(LESSONS.map((l) => import(`./lessons/lesson${String(l.n).padStart(2, '0')}.mjs`)));

// ---------------------------------------------------------------- cover
const cover = {
  cls: 'cover',
  footer: false,
  html: `
  <div class="art"></div>
  <div class="card">
    <div class="top">
      <img class="logo" src="img/logo.png" alt="Kingscliff High School">
      <div class="meta">Mathematics Standard 2<br>Year 12<br><span class="pill">CHAPTER 1 · KEY IDEAS AND REVIEW</span></div>
    </div>
    <h1>Ratios and rates</h1>
    <div class="subtitle">Year 12 Standard 2<span class="sep">•</span>Simplified review workbook</div>
    <div class="syl">NSW Mathematics Standard 11–12 Syllabus (2024)<span class="sep"> • </span>Outcomes MST-12-S2-05, MAO-WM-01</div>
    <div class="fields"><div>Name</div><div>Class</div><div>Teacher</div></div>
  </div>
  <div class="credit">Cover and banner artwork: <i>Kingscliff High School Vision Statement</i> by local Indigenous artist Marni Tuala.</div>`,
};

// ---------------------------------------------------------------- about
const contentsRows = [
  ...LESSONS.map((l) => `<tr><td class="k">${l.n}</td><td>${l.title}</td><td class="s">${l.sec}</td><td class="p">${l.start}</td></tr>`),
  `<tr><td class="k r">R</td><td><b>Chapter review</b></td><td class="s"></td><td class="p">${REVIEW_PAGE}</td></tr>`,
  `<tr><td class="k r">A</td><td>Answers</td><td class="s"></td><td class="p">${ANSWERS_PAGE}</td></tr>`,
].join('');

const about = {
  html: `
  ${shortBanner('About this workbook')}
  <div class="grid2" style="grid-template-columns: 1fr 1.08fr; column-gap: 7mm;">
    <div>
      <p>This workbook is a simplified version of the <b>Chapter 1 key ideas and review</b> from your textbook, <i>CambridgeMATHS Mathematics Standard 2 Year 12</i>. There is one lesson for each key idea, and each lesson has three parts:</p>
      <ul class="bars-list" style="margin-top:3mm">
        <li><b>Key idea</b>: the idea in plain words, with the <i>I can</i> statements from the textbook checklist.</li>
        <li class="b"><b>Worked examples</b>: every example is fully worked, with the reason for each line next to it. The answer is in a <span class="nw" style="border:.3mm solid var(--blue);background:var(--blue-pale);border-radius:1mm;padding:0 1.2mm">blue box</span>.</li>
        <li class="b"><b>Your turn</b>: <b>multiple choice</b>, <b>short answer</b> and <b>extended response</b> questions, like the textbook review. Each question tells you where to look.</li>
      </ul>
      <p class="mb0">The workbook ends with a <b>chapter review</b> set out the same way, and answers to every question.</p>
    </div>
    <div>
      ${box('Contents', `<table class="contents">${contentsRows}</table>`, '')}
    </div>
  </div>
  <div class="pale" style="margin-top:3.5mm">
    <div class="caps">Working on your own?</div>
    <ol class="steps-list" style="margin:0; columns:2; column-gap:8mm">
      <li>Read the key idea and look at the picture.</li>
      <li>Read a worked example one line at a time. Cover the next line: can you say what comes next?</li>
      <li>Try the questions that point to that example. Write every step in the box.</li>
      <li>Check the answers at the back, fix any mistakes, then rate yourself on the checklist.</li>
    </ol>
  </div>
  ${box('Syllabus outcomes', `
    <div class="outcomes">
      <div class="code">MST-12-S2-05</div><div>solves practical problems involving ratios and rates</div>
      <div class="code">MAO-WM-01</div><div>develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly</div>
    </div>`, 'margin-top:3.5mm')}
  ${box('Formulas you’ll use <small>(some are on the HSC reference sheet)</small>', `
    <div class="formulas" style="grid-template-columns: 1.05fr .7fr 1.25fr; column-gap: 5mm;">
      <div>Trapezoidal rule: &nbsp;<span class="var">A</span> ≈ ${frac('<span class="var">h</span>', '2')}(<span class="var">d<sub>f</sub></span> + <span class="var">d<sub>l</sub></span>)</div>
      <div>Speed: &nbsp;<span class="var">S</span> = ${frac('<span class="var">D</span>', '<span class="var">T</span>')}</div>
      <div>Volume: &nbsp;<span class="var">V</span> = <span class="var">Ah</span>, &nbsp;1 m<sup>3</sup> = 1000 L</div>
      <div style="grid-column: span 2">Fuel used (L) = ${frac('distance (km)', '100')} × rate (L/100&nbsp;km)</div>
      <div>Energy (kWh) = power (kW) × time (h)</div>
    </div>`, 'margin-top:4mm')}
  <div class="grid2" style="margin-top:4.5mm">
    <div>
      <div class="h3 mt0" style="font-size:11pt">Acknowledgement of Country</div>
      <p>We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. The artwork on the cover and throughout this workbook is our school vision statement, created by local Indigenous artist Marni Tuala.</p>
    </div>
    <div>
      <div class="h3 mt0" style="font-size:11pt">You will need</div>
      <p>A calculator, a ruler and a pencil. Show your working in every box: in the HSC, working earns marks even when the final answer is wrong.</p>
    </div>
  </div>`,
};

// ---------------------------------------------------------------- key ideas summary
const kiRows = [
  [1, 'Ratio', `Compares amounts of the <b>same kind</b>, in a set order. Multiply or divide every part by the same number to get an <b>equivalent ratio</b>.`, `${r('5:2')} is not the same as ${r('2:5')}<br>${r('5:2')} = ${r('10:4')} = ${r('15:6')}`],
  [2, 'Capture–recapture', `Estimates the size of an animal population. Tag some animals, release them, then catch a second sample.`, `<span class="nw" style="font-size:8.6pt">${frac('tagged in 2nd sample', 'size of 2nd sample')} = ${frac('tagged at first', 'population')}</span>`],
  [3, 'Dividing a quantity in a ratio', `<b>1</b> Add the parts (2 + 3 = 5).<br><b>2</b> Write each part over the total.<br><b>3</b> Multiply the quantity by each fraction.`, `Share $40 in the ratio ${r('2:3')}.<br>${frac('2', '5')} × $40 = $16, &nbsp;${frac('3', '5')} × $40 = $24`],
  [4, 'Scale drawings', `Scale = drawing length : actual length. A scale can have units (1 cm to 1 m) or no units (${r('1:100')}).`, `Scale ${r('1:100')}. 3 cm on the plan<br>→ real length = 3 × 100 = 300 cm = 3 m`],
  [5, 'Plans and elevations', `A <b>plan</b> is the view from the top. An <b>elevation</b> is the view from one side, such as the front or the side.`, `plan = bird’s-eye view<br>front elevation = view from the front`],
  [6, 'Perimeter and area of land', `<b>Perimeter</b>: measure each side on the photo and multiply by the scale. <b>Area</b>: count grid squares to estimate, or use a formula. For one curved side, use the trapezoidal rule.`, `<span class="var">A</span> ≈ ${frac('<span class="var">h</span>', '2')}(<span class="var">d<sub>f</sub></span> + <span class="var">d<sub>l</sub></span>)<br><span style="font-size:8.6pt"><i>h</i> = distance between the two measurements, <i>d<sub>f</sub></i> = first, <i>d<sub>l</sub></i> = last</span>`],
  [7, 'Volume of water', `If the depth is the same everywhere, volume = area of the surface × depth. For rain, change millimetres to metres first.`, `<span class="var">V</span> = <span class="var">Ah</span> (<span class="var">h</span> = depth), &nbsp;1 m<sup>3</sup> = 1000 L<br>18 mm = 0.018 m`],
  [8, 'Rates', `Compares two amounts with <b>different units</b>.`, `km/h, &nbsp;$/kg, &nbsp;L/100&nbsp;km, &nbsp;$/hour<br>25 mL/min = 25 × 60 mL/h<br>= 1500 mL/h = 1.5 L/h`],
  [9, 'Unitary method', `Divide to find the amount for <b>1</b>. Multiply to find the amount you need. For the best buy, compare prices for the same amount.`, `3 kg costs $12<br>1 kg: $12 ÷ 3 = $4 &nbsp;→&nbsp; 5 kg: 5 × $4 = $20`],
  [10, 'Speed', `Speed is a rate. On a distance–time graph, a steeper line is faster and a flat line means stopped.`, `<span class="var">S</span> = ${frac('<span class="var">D</span>', '<span class="var">T</span>')}, &nbsp;<span class="var">D</span> = <span class="var">S</span> × <span class="var">T</span>`],
  [11, 'Energy', `Energy (kWh) = power (kW) × time (hours). Running cost = energy × price per kWh.`, `1 kW = 1000 W, so 600 W = 0.6 kW<br>2 kW for 3 h = 6 kWh<br>at $0.30 per kWh: 6 × $0.30 = $1.80`],
  [12, 'Fuel consumption', `A rate given in litres per 100&nbsp;km (L/100&nbsp;km) or km per litre.`, `Fuel used (L) = ${frac('distance (km)', '100')} × rate<br>Rate = ${frac('litres', 'km')} × 100<br><span class="nw">30 L for 400 km → 7.5 L/100&nbsp;km</span>`],
];
const keyIdeas = {
  html: `
  ${shortBanner('Key ideas <small>Chapter 1 at a glance</small>')}
  <p style="margin-bottom:2mm">A simplified version of the textbook’s <i>Key ideas and chapter summary</i>. Each key idea has its own lesson.</p>
  <table class="ki">
    <tr><td></td><td></td><td></td><td class="x" style="padding-top:1.2mm;padding-bottom:1.2mm;font:500 7.5pt/1 Poppins;color:#7a1f4e;letter-spacing:.05em">EXAMPLE</td></tr>
    ${kiRows.map(([n, k, e, x]) => `<tr><td class="n">${n}</td><td class="k">${k}</td><td class="e">${e}</td><td class="x">${x}</td></tr>`).join('')}
  </table>`,
};

// ---------------------------------------------------------------- answers
// Answer fragments are grouped onto pages by hand so each page's three columns fill without overflowing.
const ANSWER_GROUPS = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], ['R']];
const fragment = (k) => (k === 'R' ? review.answers : lessonModules[k - 1].answers);
const answerPages = ANSWER_GROUPS.map((group, i) => ({
  html: `
  ${shortBanner(i === 0 ? 'Answers' : 'Answers <small>continued</small>')}
  <div class="answers">${group.map(fragment).join('')}</div>`,
}));

// ---------------------------------------------------------------- assembly
lessonModules.forEach((m, i) => {
  if (m.pages.length !== 3) throw new Error(`Lesson ${i + 1} has ${m.pages.length} pages; every lesson must be exactly 3`);
});
export const SECTIONS = {
  front: [cover, about, keyIdeas],
  lessons: lessonModules.map((m) => m.pages),
  review: review.pages,
  answers: answerPages,
};
export const CSS = [...lessonModules.map((m) => m.css || ''), review.css || ''].join('\n');
export const PAGES = [...SECTIONS.front, ...SECTIONS.lessons.flat(), ...SECTIONS.review, ...SECTIONS.answers];
