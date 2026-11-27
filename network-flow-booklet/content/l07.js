const { assert, N, en, ens, tbl, ul, figs, satMethod, satTable } = require('./_h');
const { net, svg, autoCut, lineCut, allCuts, cutValue, maxFlow, minCut, greedyRange, checkFlow } = N;
const P = (s) => s.split('');
const sumText = (G, c) => `${c.fwd.map((k) => N.E(G, k).c).join(' + ')} = ${c.value}`;
const grp = (c) => `{${c.S.slice().sort((a, b) => (a === 's' ? -1 : b === 's' ? 1 : a < b ? -1 : 1)).map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}`;

// Worked example 1: the oil network from the NESA syllabus example
const W1 = net({ s: [20, 90], A: [130, 20], D: [130, 160], C: [240, 90], B: [350, 20], t: [460, 90] },
  [['s', 'A', 8], ['s', 'D', 7], ['A', 'B', 5], ['A', 'C', 8], ['D', 'C', 6], ['C', 'B', 6], ['B', 't', 9], ['D', 't', 7]]);
const W1c = [autoCut(W1, [], 'C1'), autoCut(W1, ['A', 'D'], 'C2'), autoCut(W1, ['A', 'D', 'C'], 'C3'), autoCut(W1, ['A', 'D', 'C', 'B'], 'C4')];
const W1v = W1c.map((c) => lineCut(W1, c.pts));
assert.deepStrictEqual(W1v.map((c) => c.value), [15, 26, 18, 16]);
assert.strictEqual(maxFlow(W1).value, 15); assert.strictEqual(minCut(W1).cuts.length, 1);
const w1 = satMethod(W1, [P('sABt'), P('sACBt'), P('sDt')]);
assert.strictEqual(w1.total, 15);

// Worked example 2: flow and cut with equal values
const W2 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 11], ['s', 'B', 9], ['A', 'C', 4], ['A', 't', 8], ['B', 'C', 7], ['C', 't', 10], ['B', 'A', 3]]);
const w2 = satMethod(W2, [P('sAt'), P('sACt'), P('sBCt')]);
assert.strictEqual(w2.total, 18); assert.strictEqual(maxFlow(W2).value, 18);
const w2c = cutValue(W2, ['A', 'B', 'C']); assert.strictEqual(w2c.value, 18);

// Foundation 1: drawn cuts
const F1 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 13], ['s', 'B', 10], ['A', 'C', 8], ['A', 'D', 4], ['B', 'D', 7], ['C', 't', 9], ['D', 't', 12], ['C', 'D', 3]]);
const F1c = [autoCut(F1, [], 'C1'), autoCut(F1, ['A'], 'C2'), autoCut(F1, ['A', 'B'], 'C3'), autoCut(F1, ['A', 'B', 'C', 'D'], 'C4')];
const F1v = F1c.map((c) => lineCut(F1, c.pts));
assert.strictEqual(Math.min(...F1v.map((c) => c.value)), maxFlow(F1).value);
const f1min = maxFlow(F1).value;

// Foundation 3: flow and cut shown
const F3 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 8], ['s', 'B', 12], ['A', 'C', 6], ['A', 't', 5], ['B', 'C', 9], ['C', 't', 11], ['B', 'A', 2]]);
const F3f = { 's>A': 8, 's>B': 8, 'B>A': 0, 'A>C': 3, 'A>t': 5, 'B>C': 8, 'C>t': 11 };
assert(checkFlow(F3, F3f).ok); assert.strictEqual(checkFlow(F3, F3f).value, 16);
const F3c = autoCut(F3, ['A', 'B', 'C'], 'X'); assert.strictEqual(lineCut(F3, F3c.pts).value, 16);

// Core 4: list all cuts
const C4 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 14], ['s', 'B', 9], ['A', 'B', 5], ['A', 't', 8], ['B', 't', 13]]);
const c4 = allCuts(C4); assert.deepStrictEqual(c4.map((c) => c.value), [23, 22, 27, 21]);
// Core 5: context
const C5 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 300], ['s', 'B', 250], ['A', 'C', 180], ['A', 'D', 120], ['B', 'D', 200], ['C', 't', 220], ['D', 't', 260], ['D', 'C', 60]]);
const c5 = minCut(C5); assert.strictEqual(c5.value, 480); assert.strictEqual(c5.cuts.length, 1);
// Core 6: saturated edges then a cut
const C6 = net({ s: [20, 90], P: [130, 20], Q: [130, 160], R: [240, 20], S: [240, 160], t: [350, 90] },
  [['s', 'P', 16], ['s', 'Q', 14], ['P', 'R', 10], ['P', 'S', 5], ['Q', 'S', 11], ['R', 't', 12], ['S', 't', 15], ['Q', 'P', 4]]);
const c6 = minCut(C6); assert.strictEqual(c6.value, 25); assert.deepStrictEqual(greedyRange(C6), { lo: 25, hi: 25 });

// Challenge 7: unknown capacity
const H7 = (x) => net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', x], ['s', 'B', 12], ['A', 'B', 4], ['A', 't', 9], ['B', 't', 15]]);
assert.strictEqual(maxFlow(H7(8)).value, 20);
for (let x = 1; x <= 30; x++) assert.strictEqual(maxFlow(H7(x)).value === 20, x === 8);
for (let x = 1; x <= 30; x++) assert.strictEqual(maxFlow(H7(x)).value === 24, x >= 12);
const H7show = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 1], ['s', 'B', 12], ['A', 'B', 4], ['A', 't', 9], ['B', 't', 15]]);
// Challenge 8: wrong claim
const H8 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 15], ['s', 'B', 13], ['A', 'C', 9], ['A', 'D', 5], ['B', 'D', 8], ['C', 't', 14], ['D', 't', 12], ['B', 'C', 4]]);
const h8 = minCut(H8); assert.strictEqual(h8.value, 25); assert.strictEqual(cutValue(H8, ['A', 'B', 'C', 'D']).value, 26);

module.exports = {
  n: 7,
  title: 'Minimum cut and maximum flow',
  toc: 'The maximum-flow minimum-cut theorem',
  content: ['Solve small-scale network flow problems including the use of the maximum-flow minimum-cut theorem', 'Calculate and analyse the flow capacity of a network including the use of the saturated edges method'],
  li: ['To understand why no flow can be bigger than any cut', 'To use the maximum-flow minimum-cut theorem to find and check the flow capacity of a network'],
  sc: ['find the minimum cut of a small network', 'state the flow capacity using the maximum-flow minimum-cut theorem', 'prove a flow is maximum by finding a cut with the same value', 'identify the bottleneck edges of a network'],
  key: `${ul(['Every unit of flow from <i>s</i> to <i>t</i> must cross every cut. So <b>the value of any flow can never be more than the capacity of any cut</b>.',
    'The <b>minimum cut</b> is the cut with the smallest capacity.',
    '<b>Maximum-flow minimum-cut theorem:</b> the maximum flow through a network equals the capacity of the minimum cut. <b>flow capacity = minimum cut</b>',
    'The edges of the minimum cut are the <b>bottleneck</b> of the network. In a maximum flow they are all saturated.'])}
    <p style="margin-top:1mm"><b>Two ways to find the flow capacity</b></p>
    ${ul(['<b>Find the minimum cut.</b> Try cuts systematically: next to the source, next to the sink, and through edges with small capacities. In a small network you can list them all.',
      '<b>Find a flow and a cut with the same value.</b> If a flow and a cut have equal values, the flow is a maximum and the cut is a minimum. This is how you check an answer from the saturated edges method.'])}`,
  examples: [
    {
      q: '<p>The network shows the flow of oil from a storage tank (<i>s</i>) to a terminal (<i>t</i>). Find the maximum flow of oil through the network.</p>', fig: svg(W1, { cuts: W1c }),
      sol: `<div class="side"><div class="sbody">${tbl(['Cut', 'Edges counted', 'Capacity'], W1v.map((v, i) => [W1c[i].label, v.fwd.map(en).join(', ') + (v.back.length ? ` <span class="small">(${v.back.map(en).join(', ')} backwards)</span>` : ''), sumText(W1, v)]))}</div>
        <div class="sbody">${ul(['C1 has the smallest capacity of these cuts: 8 + 7 = <b>15</b>.', `Check with a flow: ${w1.rows.map((r) => `${r.p.map((x) => (x === 's' || x === 't' ? `<i>${x}</i>` : x)).join('–')} (${r.amt})`).join(', ')} gives a flow of 15.`, 'A flow of 15 and a cut of 15, so by the maximum-flow minimum-cut theorem the <b>maximum flow is 15</b>.'])}</div></div>`,
    },
    {
      q: '<p>Find the flow capacity of this network and prove your answer is correct.</p>', fig: svg(W2), figSide: true,
      sol: `<div class="side"><div class="sbody">${satTable(w2, false)}${ul([`Saturated edges method: a flow of <b>${w2.total}</b>.`, `Cut ${grp(w2c)} | {<i>t</i>}: ${ens(w2c.fwd)}, ${sumText(W2, w2c)}.`, 'The flow and the cut are equal, so <b>18 is the flow capacity</b>. No flow can be bigger than this cut.'])}</div><div class="sfig">${svg(W2, { flows: w2.flow, cuts: [autoCut(W2, ['A', 'B', 'C'], '')], scale: 0.85 })}</div></div>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Four cuts are drawn on this network.', fig: svg(F1, { cuts: F1c }), figSide: true,
          parts: [
            ...F1v.map((v, i) => ({ q: `Find the capacity of C${i + 1}.`, a: sumText(F1, v), space: 'line' })),
            { q: 'Which cut is the minimum cut of these four?', a: `C${F1v.findIndex((v) => v.value === f1min) + 1}`, space: 'line' },
            { q: 'The minimum cut of the whole network is one of these four. State the flow capacity.', a: `${f1min}`, space: 'line' },
          ],
        },
        {
          q: 'The cuts of a network have capacities 23, 19, 27, 21, 19 and 30.',
          parts: [
            { q: 'What is the flow capacity of the network?', a: '19', space: 'line' },
            { q: 'Could a flow of 20 be sent through this network? Explain.', a: 'No. Every flow must cross the cut of capacity 19, so no flow can be more than 19.', space: 'lines:2' },
          ],
        },
        {
          q: 'A flow of 16 is shown, with a cut X.', fig: svg(F3, { flows: F3f, cuts: [F3c] }), figSide: true,
          parts: [
            { q: 'Find the capacity of cut X.', a: '5 + 11 = 16', space: 'line' },
            { q: 'Explain why 16 must be the maximum flow.', a: 'No flow can be bigger than the capacity of any cut, so no flow can be bigger than 16. This flow is 16, so it is a maximum.', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'This network has four cuts. List them, find the minimum cut and state the flow capacity.', fig: svg(C4), figSide: true,
          a: `${c4.map((c) => `${grp(c)}: ${c.value}`).join('; ')}. Minimum cut: A→<i>t</i>, B→<i>t</i> (21). Flow capacity 21.`, space: 'box:40',
        },
        {
          q: 'The network shows evacuation routes from a town (<i>s</i>) to a safe area (<i>t</i>). Capacities are in vehicles per hour.', fig: svg(C5), figSide: true,
          parts: [
            { q: 'Find the minimum cut. Name its edges.', a: `${ens(c5.cuts[0].fwd)}: ${sumText(C5, c5.cuts[0])}`, space: 'lines:2' },
            { q: 'What is the greatest number of vehicles per hour that can reach the safe area?', a: '480', space: 'line' },
            { q: 'Which roads are the bottleneck?', a: 'C→<i>t</i> and D→<i>t</i>, the last roads into the safe area', space: 'lines:2' },
          ],
        },
        {
          q: 'Use the saturated edges method to find a flow, then find a cut with the same value to prove that it is the maximum flow.', fig: svg(C6), figSide: true,
          a: `Flow 25. Cut ${grp(c6.cuts[0])}: ${ens(c6.cuts[0].fwd)}, ${sumText(C6, c6.cuts[0])}`, space: 'box:42',
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'In this network the capacity of <i>s</i>→A is <i>x</i>.', fig: svg(H7show, { cap: { 's>A': 'x' } }), figSide: true,
          parts: [
            { q: 'Write the capacity of each of the four cuts in terms of <i>x</i> where needed.', a: '{<i>s</i>}: <i>x</i> + 12; {<i>s</i>, A}: 25; {<i>s</i>, B}: <i>x</i> + 15; {<i>s</i>, A, B}: 24', space: 'lines:2' },
            { q: 'The flow capacity is 20. Find <i>x</i>.', a: '<i>x</i> + 12 = 20, so <i>x</i> = 8 (the other cuts are then 25, 23, 24)', space: 'lines:2' },
            { q: 'For which values of <i>x</i> is the flow capacity 24?', a: '<i>x</i> ≥ 12 (then <i>x</i> + 12 ≥ 24 and <i>x</i> + 15 ≥ 24)', space: 'lines:2' },
          ],
        },
        {
          q: 'Noah says the flow capacity of this network is 26, because that is the total capacity of the edges into the sink.', fig: svg(H8), figSide: true,
          parts: [
            { q: 'Show that Noah is wrong by finding a cut with a smaller capacity.', a: `Cut ${grp(h8.cuts[0])}: ${ens(h8.cuts[0].fwd)}, ${sumText(H8, h8.cuts[0])}`, space: 'lines:2' },
            { q: 'What is the flow capacity? Justify your answer.', a: '25: a flow of 25 exists (e.g. by the saturated edges method) and it equals the cut of 25.', space: 'lines:2' },
          ],
        },
        {
          q: 'Explain why, in a maximum flow, every edge that crosses a minimum cut forwards must be saturated.',
          a: 'The flow across the cut equals the maximum flow, which equals the capacity of the cut (the sum of the forward capacities). This can only happen if every forward edge is full and any backward edge carries 0.', space: 'lines:3',
        },
      ],
    },
  ],
};
