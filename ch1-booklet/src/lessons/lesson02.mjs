// Lesson 2 Capture–recapture (textbook 1B). Follows the structure of the model lesson (Lesson 1).
import { frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';

// ---------------------------------------------------------------- figures
// A fish facing right. Tagged fish are light blue with a plum tag on the back.
const fish = (x, y, tagged) => {
  const fill = tagged ? '#9fb9da' : '#d8d2b4';
  return `
    <g transform="translate(${x} ${y})">
      <path d="M-5 0 L-10 -3.6 L-10 3.6 Z" fill="${fill}" stroke="#3d3d3d" stroke-width="0.6" stroke-linejoin="round"/>
      <ellipse rx="6.5" ry="3.5" fill="${fill}" stroke="#3d3d3d" stroke-width="0.6"/>
      <circle cx="3.6" cy="-0.8" r="0.65" fill="#3d3d3d"/>
      ${tagged ? '<rect x="-1.8" y="-6.4" width="3.6" height="3.2" rx="0.8" fill="#7a1f4e"/>' : ''}
    </g>`;
};

// The lake and the 2nd sample: 1 in 5 tagged in each
const pondSvg = (() => {
  const lake = [[34, 20, 0], [56, 20, 0], [78, 20, 1], [23, 33, 0], [45, 33, 1], [67, 33, 0], [89, 33, 0], [34, 46, 0], [56, 46, 0], [78, 46, 0]];
  const net = [[153, 21, 0], [177, 21, 0], [153, 34, 0], [177, 34, 1], [165, 47, 0]];
  return `
  <svg width="58mm" viewBox="0 0 198 68" font-family="Poppins" font-weight="300">
    <ellipse cx="56" cy="33" rx="54" ry="26" fill="#eaf1fa" stroke="#9fb9da" stroke-width="1"/>
    ${lake.map(([x, y, t]) => fish(x, y, t)).join('')}
    <path d="M115 33 H129" stroke="#3d3d3d" stroke-width="0.9"/><path d="M129 29.5 L134 33 L129 36.5 Z" fill="#3d3d3d"/>
    <rect x="139" y="9" width="56" height="48" rx="5" fill="#f5f3eb" stroke="#3d3d3d" stroke-width="0.7" stroke-dasharray="2 1.5"/>
    ${net.map(([x, y, t]) => fish(x, y, t)).join('')}
    <text x="56" y="67" font-size="8" fill="#555" text-anchor="middle">lake</text>
    <text x="167" y="67" font-size="8" fill="#555" text-anchor="middle">2nd sample</text>
  </svg>`;
})();

// Bar model for Example 2.1: the 60 tagged fish are 1 of 5 equal parts
const fifthsSvg = `
  <svg width="48mm" viewBox="0 0 158 50" font-family="Pagella">
    <text x="19" y="9" font-size="8" fill="#3f7cc0" text-anchor="middle" font-family="Poppins" font-weight="300">tagged</text>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${4 + i * 30}" y="13" width="30" height="16" fill="${i === 0 ? '#9fb9da' : '#d8d2b4'}" stroke="#fff" stroke-width="1.2"/><text x="${19 + i * 30}" y="24.5" font-size="9" text-anchor="middle" fill="#1c1c1c">60</text>`).join('')}
    <path d="M4.5 32 v3 h149 v-3" fill="none" stroke="#3d3d3d" stroke-width="0.7"/>
    <text x="79" y="47" font-size="10" text-anchor="middle" fill="#3f7cc0">population = 5 × 60 = 300</text>
  </svg>`;

// Ali's catch of 20 fish for Example 2.3: 1 in 5 tagged in every row
const catchSvg = (() => {
  const tagged = [1, 3, 0, 4];
  const all = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) all.push(fish(13 + c * 20, 10 + r * 14, tagged[r] === c));
  return `<svg width="36mm" viewBox="0 0 104 60">${all.join('')}</svg>`;
})();

// ---------------------------------------------------------------- lesson 2
const p1 = {
  cls: 'l02',
  html: `
  ${banner({ num: '2', title: 'Capture–recapture', sub: 'Key idea: Capture–recapture • Textbook 1B • MST-12-S2-05' })}
  ${box('Key idea &nbsp;Capture–recapture', `
    <div class="fig" style="float:right; width:60mm; margin:0 0 1mm 4mm">${pondSvg}<div class="cap">1 in 5 fish caught has a tag, so about<br>1 in 5 fish in the lake has a tag.</div></div>
    <p class="mb0"><b>Capture–recapture</b> estimates the size of an animal <b>population</b> (how many animals there are) without counting them all.</p>
    <ol class="steps-list mb0" style="margin-top:1mm">
      <li><b>Capture</b> some animals. <b>Tag</b> them (put a mark or band on them) and let them go.</li>
      <li>Wait for the tagged animals to <b>mix in</b> with the others.</li>
      <li><b>Recapture:</b> catch a 2nd <b>sample</b> (group). Count the tags.</li>
    </ol>
    <div class="grid2" style="clear:both; grid-template-columns: 1fr auto; column-gap: 5mm; align-items:center; margin-top:1.5mm">
      <p class="mb0">The fraction with tags in the 2nd sample is about the same as the fraction with tags in the <b>whole population</b>.</p>
      <div class="nw">${frac('tagged in 2nd sample', 'size of 2nd sample')} = ${frac('tagged at first', 'population')}</div>
    </div>`)}

  <div class="grid2" style="margin-top:3mm; column-gap:6mm">
    <div>
      <div class="h2">Assumptions</div>
      <p class="mb0">The estimate is only good if:</p>
      <ul class="dots mb0" style="margin-top:1mm">
        <li>no animals are <b>born</b>, <b>die</b>, <b>arrive</b> or <b>leave</b> between the two catches</li>
        <li>the <b>tags don’t fall off</b></li>
        <li>the tagged animals <b>mix in</b> with the others</li>
        <li>every animal has the <b>same chance</b> of being caught.</li>
      </ul>
    </div>
    <div>
      <div class="h2">Finding the population</div>
      <p class="mb0"><b>Is it 1 in something?</b> If <span class="nw">1 in 5</span> have tags, the animals tagged at first are one fifth of the population. Multiply by 5.</p>
      <p class="mb0" style="margin-top:1mm"><b>Any numbers:</b> use the rule.</p>
      <div class="rule">population = ${frac('tagged at first × size of 2nd sample', 'tagged in 2nd sample')}</div>
    </div>
  </div>

  <div style="margin-top:3mm">${checklist(['use the capture–recapture technique to estimate a population.'])}</div>

  ${we('2.1', 'Estimating a population', `A ranger catches 60 fish in a lake, tags them and lets them go. A week later she catches 50 fish, and 10 of them have tags. Estimate the number of fish in the lake &ensp;(a) using fractions &ensp;(b) using the rule.`, `
    <div class="grid2" style="grid-template-columns: 1fr 49mm; column-gap: 4mm; align-items:center; --wc: 50mm">
      <div>
        <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
        ${sol('(a)', [
          [`fraction tagged = ${frac('10', '50')}`, '10 of the 50 fish caught have tags.'],
          [`= ${frac('10 ÷ 10', '50 ÷ 10')} = ${frac('1', '5')}`, 'Divide the top and bottom by <b>10</b>. <b class="nw">1 in 5</b> has a tag.'],
          [`60 fish = ${frac('1', '5')} of all the fish`, 'So about <span class="nw">1 in 5</span> of <b>all</b> the fish have tags.'],
          ['population = 60 × 5', 'One fifth is 60, so all of it is <b>5 times</b> as big.'],
          ['= 300 fish', 'Check: 60 out of 300 is <span class="nw">1 in 5</span>.'],
        ])}
        ${sol('(b)', [
          [`population = ${frac('60 × 50', '10')} = ${frac('3000', '10')}`, 'Use the rule: 60 tagged, 50 caught, 10 with tags.'],
          ['= 300 fish', '3000 ÷ 10 = 300, the same as (a).'],
        ])}
      </div>
      <div class="fig">${fifthsSvg}<div class="cap">the 60 tagged fish are<br>1 of 5 equal parts</div></div>
    </div>`, 'margin-top:3mm')}`,
};

const p2 = {
  cls: 'l02',
  html: `
  ${we('2.2', 'Using the rule', `A scientist tags 30 frogs at a pond and lets them go. A week later she catches 25 frogs, and 10 of them have tags. &ensp;(a) What fraction of the 2nd sample has tags? &ensp;(b) Estimate the number of frogs at the pond.`, `
    <div style="--wc: 53mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [`fraction tagged = ${frac('10', '25')} = ${frac('10 ÷ 5', '25 ÷ 5')}`, '10 of the 25 frogs caught have tags. The HCF of 10 and 25 is <b>5</b>.'],
      [`= ${frac('2', '5')}`, 'Divide the top and bottom by 5. <b class="nw">2 in 5</b> have tags.'],
    ])}
    ${sol('(b)', [
      [`population = ${frac('30 × 25', '10')} = ${frac('750', '10')}`, '<span class="nw">2 in 5</span> is not 1 in something, so use the <b>rule</b>. 30 × 25 = 750.'],
      ['= 75 frogs', 'Divide: 750 ÷ 10 = 75. Check: 30 out of 75 is also <span class="nw">2 in 5</span> (÷ 15).'],
    ])}
    </div>`)}

  ${we('2.3', 'Expected number tagged', 'About 500 fish live in a dam, and 100 of them have tags. Ali catches 20 fish. How many would you expect to have tags?', `
    <div class="grid2" style="grid-template-columns: 1fr 40mm; column-gap: 5mm; align-items:center; --wc: 53mm">
      <div>
        <div class="sol-head" style="grid-template-columns: var(--wc) 1fr"><span>Working</span><span>Why</span></div>
        <div style="margin-top:1mm">${steps([
          [`${frac('100', '500')} = ${frac('100 ÷ 100', '500 ÷ 100')} = ${frac('1', '5')}`, '100 of the 500 fish have tags. Divide the top and bottom by 100: <b class="nw">1 in 5</b> has a tag.'],
          [`expected = ${frac('1', '5')} × 20 = 20 ÷ 5`, 'Expect the <b>same fraction</b> in Ali’s catch. One fifth means ÷ 5.'],
          ['= 4 fish', 'Check: 4 out of 20 is <span class="nw">1 in 5</span>.'],
        ])}</div>
      </div>
      <div class="fig">${catchSvg}<div class="cap">Ali’s 20 fish: expect 1 in 5<br>to have a tag</div></div>
    </div>`, 'margin-top:2.5mm')}

  ${we('2.4', 'Why an estimate might be wrong', 'In Example 2.1, suppose some tags had fallen off, so only 6 of the 50 fish caught had tags, not 10. &ensp;<span class="nw">(a) Find</span> the new estimate. &ensp;<span class="nw">(b) Is</span> it too big or too small?', `
    <div style="--wc: 53mm">
    <div class="sol-head"><span></span><span>Working</span><span>Why</span></div>
    ${sol('(a)', [
      [`population = ${frac('60 × 50', '6')} = ${frac('3000', '6')}`, 'Use the rule with only <b>6</b> tagged. 60 × 50 = 3000.'],
      ['= 500 fish', 'Divide: 3000 ÷ 6 = 500.'],
    ])}
    ${sol('(b)', [
      ['6 tagged, not 10', 'Lost tags mean <b>fewer</b> tagged fish are caught.'],
      ['The estimate is too big.', 'Dividing by a smaller number gives a <b>bigger</b> answer: 500, not 300.'],
    ])}
    </div>`, 'margin-top:2.5mm')}

  <div style="margin-top:3mm">${bar('Your turn 2', 'Stuck? Each question shows you where to look.')}</div>

  ${sec('Multiple choice', 'circle the best answer')}
  <div class="grid3 qpair">
    <div class="mc-list">${mc(1, 'Which would make the estimate <b>less</b> accurate?', ['The tagged fish mix in.', 'No fish are born or die.', 'Some tags fall off.', 'No fish leave the lake.'], { see: 'Assumptions', h: 15.5 })}</div>
    <div>${mc(2, '25 birds are tagged. Later, 40 birds are caught and 10 have tags. Estimate the population.', ['75', '100', '250', '1000'], { see: 'Example 2.1', h: 15.5, row: true })}</div>
    <div>${mc(3, '600 fish live in a lake. 60 have tags. Sam catches 30 fish. How many would you expect to have tags? <span class="hint nw">Hint: 1 in 10 has a tag.</span>&#8203;', ['3', '6', '10', '20'], { see: 'Example 2.3', h: 15.5, row: true })}</div>
  </div>`,
};

const p3 = {
  cls: 'l02',
  html: `
  ${sec('Short answer', 'show your working in the box')}
  ${q(1, 'Estimate each population. <span class="hint">Hint: find the fraction tagged in the 2nd sample first.</span>', { see: 'Example 2.1', parts: ['20 tagged at first.<br>Later 30 caught, 10 tagged.', '30 tagged at first.<br>Later 20 caught, 5 tagged.', '80 tagged at first.<br>Later 60 caught, 6 tagged.'], h: 30, split: true })}
  ${q(2, 'A biologist tags 50 carp in a dam and lets them go. Later he catches 40 carp, and <span class="nw">16 of them have tags.</span>', { see: 'Example 2.2', parts: ['What fraction of the 2nd sample has tags? Simplify it.', 'Estimate the number of carp in the dam. <span class="hint nw">Hint: use the rule.</span>'], h: 26, split: true })}
  <div class="grid2 qpair">
    <div>${q(3, 'A scientist tags 200 fish in a pond and lets them go. Later she catches 50 fish, and 20 of them have tags. Estimate the number of fish in the pond. <span class="hint nw">Hint: use the rule.</span>&#8203;', { see: 'Example 2.2', h: 28 })}</div>
    <div>${q(4, 'About 400 possums live in a forest, and 80 of them have tags. A ranger catches 30 possums. How many would you expect to have tags? <span class="hint nw">Hint: 80 out of 400 is 1 in 5.</span>&#8203;', { see: 'Example 2.3', h: 28 })}</div>
  </div>
  ${q(5, 'Some of the tagged fish are eaten by birds before the 2nd catch.', { see: 'Example 2.4', parts: ['Will <b>more</b> or <b>fewer</b> tagged fish be caught?', 'Will the estimate be <b>too big</b> or <b>too small</b>?'], h: 15, split: true })}

  ${sec('Extended response', 'answer each part in order')}
  ${q(1, 'A ranger tags 40 kangaroos in a national park and lets them go. Two weeks later she catches 30 kangaroos, and 6 of them have tags.', { see: 'Key idea, Assumptions and Example 2.1', cols: 1, parts: [
    'What fraction of the 2nd sample has tags? Simplify it.',
    'Estimate the number of kangaroos in the park. <span class="hint">Hint: use your answer to (a).</span>',
    'Why does the ranger wait two weeks before the 2nd catch?',
    'Write one other thing that must be true for her estimate to be good.',
  ], h: 24, split: true })}`,
};

export const pages = [p1, p2, p3];

export const answers = `
    <h4>Lesson 2 &nbsp;Capture–recapture</h4>
    <h5>Multiple choice</h5>
    <p><b>1</b> C</p>
    <p><b>2</b> B &nbsp;(<span class="nw">10 out of 40 is 1 in 4,</span> <span class="nw">25 × 4 = 100)</span></p>
    <p><b>3</b> A &nbsp;(<span class="nw">60 out of 600 is 1 in 10,</span> <span class="nw">30 ÷ 10 = 3)</span></p>
    <h5>Short answer</h5>
    <p><b>1</b> <span class="nw">(a) 60</span>&nbsp; <span class="nw">(b) 120</span>&nbsp; <span class="nw">(c) 800</span></p>
    <p><b>2</b> <span class="nw">(a) ${frac('16', '40')} = ${frac('2', '5')}</span>&nbsp; <span class="nw">(b) 50 × 40 ÷ 16</span> <span class="nw">= 125 carp</span></p>
    <p><b>3</b> <span class="nw">200 × 50 ÷ 20</span> <span class="nw">= 500 fish</span></p>
    <p><b>4</b> <span class="nw">${frac('80', '400')} = ${frac('1', '5')},</span> <span class="nw">30 ÷ 5 = 6 possums</span></p>
    <p><b>5</b> <span class="nw">(a) fewer</span>&nbsp; <span class="nw">(b) too big</span></p>
    <h5>Extended response</h5>
    <p><b>1</b> (a) <span class="nw">${frac('6', '30')} = ${frac('1', '5')}</span><br>(b) <span class="nw">40 × 5 = 200 kangaroos</span><br>(c) So the tagged kangaroos can mix in with the others.<br>(d) Any one: no kangaroos are born, die, arrive or leave; the tags stay on; every kangaroo has the same chance of being caught.</p>
`;

export const css = `
  .l02 .rule { font-size: 10pt; margin-top: 1.5mm; white-space: nowrap; }
  .l02 .steps .frac { line-height: 1.06; font-size: .94em; }
  .l02 .steps { row-gap: 1mm; }
  .l02 .mc-list .mc-opts { grid-template-columns: 1fr; row-gap: .3mm; }
`;
