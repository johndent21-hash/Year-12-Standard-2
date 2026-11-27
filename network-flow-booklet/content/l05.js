const { assert, N, en, ens, tbl, ul, ol, figs, satMethod, satTable } = require('./_h');
const { net, svg, maxFlow, greedyRange, checkFlow } = N;

// Every order of path choices gives the true maximum in these networks (checked), except the trap.
const safe = (G) => { const m = maxFlow(G).value; assert.deepStrictEqual(greedyRange(G), { lo: m, hi: m }); return m; };
const P = (s) => s.split('');

// Worked example 1
const W1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 10], ['s', 'B', 8], ['A', 'C', 5], ['A', 't', 5, { t: 0.55 }], ['B', 'C', 4], ['C', 't', 9], ['B', 't', 3, { t: 0.55, side: -1 }]]);
assert.strictEqual(safe(W1), 17);
const w1 = satMethod(W1, [P('sAt'), P('sACt'), P('sBt'), P('sBCt')]);
assert.strictEqual(w1.total, 17);

// Worked example 2: oil pipeline
const W2 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 12], ['s', 'B', 9], ['A', 'C', 7], ['A', 'D', 5], ['B', 'D', 8], ['C', 't', 10], ['D', 't', 11], ['B', 'A', 3]]);
const w2m = safe(W2);
const w2 = satMethod(W2, [P('sACt'), P('sADt'), P('sBDt')]);
assert.strictEqual(w2.total, w2m); assert(checkFlow(W2, w2.flow).ok);

// Foundation
const F1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 7], ['s', 'B', 5], ['A', 'B', 2], ['A', 't', 4], ['B', 't', 8]]);
assert.strictEqual(safe(F1), 11);
const f1 = satMethod(F1, [P('sAt'), P('sBt'), P('sABt')]);
const F2 = net({ s: [20, 80], P: [130, 20], Q: [130, 140], t: [240, 80] },
  [['s', 'P', 6], ['s', 'Q', 9], ['P', 't', 8], ['Q', 't', 5], ['Q', 'P', 3]]);
assert.strictEqual(safe(F2), 13);
const F3 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 120], ['s', 'B', 80], ['A', 'B', 30], ['A', 't', 90], ['B', 't', 100]]);
assert.strictEqual(safe(F3), 190);

// Core
const C4 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 9], ['s', 'B', 11], ['A', 'C', 5], ['A', 'D', 5], ['B', 'D', 8], ['C', 't', 9], ['D', 't', 10], ['D', 'C', 3]]);
const c4m = safe(C4);
const C5 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 30], ['s', 'B', 25], ['A', 'C', 15], ['A', 'B', 10], ['B', 'D', 20], ['C', 't', 25], ['D', 't', 30], ['C', 'D', 8]]);
const c5m = safe(C5);
const C6 = net({ s: [20, 90], P: [130, 20], Q: [130, 160], R: [240, 90], t: [350, 90] },
  [['s', 'P', 12], ['s', 'Q', 10], ['P', 'R', 6], ['Q', 'R', 9], ['P', 't', 9, { t: 0.6 }], ['Q', 't', 4, { t: 0.6 }], ['R', 't', 12]]);
const c6m = safe(C6);
const c6a = satMethod(C6, [P('sPt'), P('sPRt'), P('sQRt'), P('sQt')]);
const c6b = satMethod(C6, [P('sQRt'), P('sQt'), P('sPRt'), P('sPt')]);
assert.strictEqual(c6a.total, c6m); assert.strictEqual(c6b.total, c6m);

// Challenge: the trap
const T = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 5], ['s', 'B', 4], ['A', 'B', 4], ['A', 't', 3], ['B', 't', 6]]);
assert.deepStrictEqual(greedyRange(T), { lo: 7, hi: 9 }); assert.strictEqual(maxFlow(T).value, 9);
const tBad = satMethod(T, [P('sABt'), P('sAt'), P('sBt')]);
const tGood = satMethod(T, [P('sAt'), P('sBt'), P('sABt')]);
assert.deepStrictEqual([tBad.total, tGood.total], [7, 9]);
// Challenge: a student's table with a mistake
const H8 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 8], ['s', 'B', 6], ['A', 'C', 4], ['A', 't', 6, { t: 0.55 }], ['B', 'C', 5], ['C', 't', 10]]);
assert.strictEqual(safe(H8), 13);
const h8 = satMethod(H8, [P('sACt'), P('sAt'), P('sBCt')]);
assert.deepStrictEqual(h8.rows.map((r) => r.amt), [4, 4, 5]);

const blankRows = (n) => tbl(['Path', 'Flow sent', 'Edges saturated'], Array.from({ length: n }, () => ['', '', '']).concat([['<b>Total</b>', '', '']]));

module.exports = {
  n: 5,
  title: 'The saturated edges method',
  toc: 'Finding the flow capacity of a network',
  content: ['Calculate and analyse the flow capacity of a network including the use of the saturated edges method'],
  li: ['To find the flow capacity (maximum flow) of a network using the saturated edges method', 'To record the method clearly in a table'],
  sc: ['choose a path and find the most that can be sent along it', 'update the spare capacities and mark saturated edges', 'know when to stop', 'find the flow capacity of a network with up to 6 vertices'],
  key: `<p>The <b>flow capacity</b> of a network is the largest possible flow from <i>s</i> to <i>t</i>. The <b>saturated edges method</b> builds a flow one path at a time.</p>
    ${ol(['Choose a path from <i>s</i> to <i>t</i>.', 'Find the <b>smallest</b> capacity on the path. This is how much can be sent along it.', 'Subtract this amount from every edge on the path and write the new spare capacity. An edge with 0 left is <b>saturated</b>: cross it out.', 'Choose another path that has <b>no</b> saturated edges and repeat.', 'Stop when every path from <i>s</i> to <i>t</i> has a saturated edge. The flow capacity is the <b>total</b> sent along all the paths.'])}
    <div class="note">Record your working in a table: path, flow sent, edges saturated. In a few networks a poor choice of paths can leave you stuck below the true maximum (see Question 7). In Lesson 7 you will learn how to check your answer with a minimum cut.</div>`,
  examples: [
    {
      q: '<p>Use the saturated edges method to find the flow capacity of this network.</p>', fig: svg(W1), figSide: true,
      sol: `<div class="side"><div class="sbody">${satTable(w1)}${ul([`After 4 paths, every path from <i>s</i> to <i>t</i> uses a saturated edge (${ens(w1.sat)}), so we stop.`, `Flow capacity = 5 + 5 + 3 + 4 = <b>${w1.total}</b>`])}</div><div class="sfig">${svg(W1, { flows: w1.flow, sat: w1.sat, scale: 0.8 })}<div class="small" style="text-align:center">Final flow (gold) and saturated edges (red)</div></div></div>`,
    },
    {
      q: '<p>The network shows oil pipelines from a port (<i>s</i>) to a refinery (<i>t</i>). Capacities are in megalitres per day (ML/day). Find the maximum amount of oil that can reach the refinery each day.</p>', fig: svg(W2), figSide: true,
      sol: `<div class="side"><div class="sbody">${satTable(w2)}<p>Every path is now blocked by a saturated edge. The maximum is <b>${w2.total} ML/day</b>.</p><p class="small">B→A is not used: A already receives all it can pass on.</p></div><div class="sfig">${svg(W2, { flows: w2.flow, sat: w2.sat, scale: 0.8 })}</div></div>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Complete the table to find the flow capacity of this network. The paths are chosen for you.', fig: svg(F1), figSide: true,
          parts: [{ q: tbl(['Path', 'Spare capacities', 'Flow sent', 'Edges saturated'], [['<i>s</i>–A–<i>t</i>', '7, 4', '4', en('A>t')], ['<i>s</i>–B–<i>t</i>', '', '', ''], ['<i>s</i>–A–B–<i>t</i>', '', '', ''], ['<b>Total</b>', '', '', '']]), a: `<i>s</i>–B–<i>t</i>: 5, 8 → 5, ${en('s>B')}; <i>s</i>–A–B–<i>t</i>: 3, 2, 3 → 2, ${en('A>B')}; total ${f1.total}`, space: 'none' }],
        },
        {
          q: 'Find the flow capacity of this network.', fig: svg(F2), figSide: true,
          parts: [{ q: blankRows(3), a: '13 (e.g. <i>s</i>–P–<i>t</i> 6, <i>s</i>–Q–<i>t</i> 5, <i>s</i>–Q–P–<i>t</i> 2)', space: 'none' }],
        },
        {
          q: 'After a concert, people walk from a stadium (<i>s</i>) to a train station (<i>t</i>) along these paths. Capacities are in people per minute. Find the greatest number of people who can reach the station each minute.', fig: svg(F3), figSide: true,
          parts: [{ q: blankRows(3), a: '190 people per minute (e.g. <i>s</i>–A–<i>t</i> 90, <i>s</i>–B–<i>t</i> 80, <i>s</i>–A–B–<i>t</i> 20)', space: 'none' }],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'Find the flow capacity of this network. Show your working in a table.', fig: svg(C4), figSide: true,
          a: `${c4m}`, space: 'box:42',
        },
        {
          q: 'The network shows roads from a suburb (<i>s</i>) to the city (<i>t</i>) in the morning peak, in vehicles per minute. Find the maximum number of vehicles per minute that can reach the city.', fig: svg(C5),
          a: `${c5m} vehicles per minute`, space: 'box:36',
        },
        {
          q: 'Two students used the saturated edges method on this network. Ava chose the paths in the order <i>s</i>–P–<i>t</i>, <i>s</i>–P–R–<i>t</i>, <i>s</i>–Q–R–<i>t</i>, <i>s</i>–Q–<i>t</i>. Ben chose <i>s</i>–Q–R–<i>t</i>, <i>s</i>–Q–<i>t</i>, <i>s</i>–P–R–<i>t</i>, <i>s</i>–P–<i>t</i>.', fig: svg(C6), figSide: true,
          parts: [
            { q: 'Find the flow sent along each path by Ava.', a: c6a.rows.map((r) => r.amt).join(', '), space: 'lines:2' },
            { q: 'Find the flow sent along each path by Ben.', a: c6b.rows.map((r) => r.amt).join(', '), space: 'lines:2' },
            { q: 'Compare their answers for the flow capacity.', a: `Both get ${c6m}, even though the amounts on each path are different.`, space: 'line' },
          ],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'Kai starts the saturated edges method on this network with the path <i>s</i>–A–B–<i>t</i>.', fig: svg(T), figSide: true,
          parts: [
            { q: 'Continue Kai’s method. What total does he get?', a: `${tBad.total} (${tBad.rows.map((r) => `${r.p.map((v) => (v === 's' || v === 't' ? `<i>${v}</i>` : v)).join('–')}: ${r.amt}`).join(', ')})`, space: 'lines:2' },
            { q: 'Now start with <i>s</i>–A–<i>t</i> and <i>s</i>–B–<i>t</i>. What total do you get?', a: `${tGood.total}`, space: 'lines:2' },
            { q: 'Explain why Kai’s total cannot be the flow capacity. Why did his choice of first path cause a problem?', a: 'A larger flow (9) exists, so 7 is not the maximum. Sending 4 along A→B used up B→<i>t</i> and most of <i>s</i>→A, which blocked the direct routes A→<i>t</i> and <i>s</i>→B→<i>t</i>.', space: 'lines:3' },
          ],
        },
        {
          q: 'Lily’s working for this network is shown. She has made a mistake. Find it, correct it and find the flow capacity.', fig: svg(H8), figSide: true,
          parts: [
            { q: tbl(['Path', 'Flow sent', 'Edges saturated'], [['<i>s</i>–A–C–<i>t</i>', '4', 'A→C'], ['<i>s</i>–A–<i>t</i>', '6', 'A→<i>t</i>'], ['<i>s</i>–B–C–<i>t</i>', '5', 'B→C'], ['<b>Total</b>', '15', '']]) + 'Describe Lily’s mistake.', a: 'Row 2: <i>s</i>→A has only 8 − 4 = 4 spare after the first path, so only 4 can be sent along <i>s</i>–A–<i>t</i>, and the saturated edge is <i>s</i>→A, not A→<i>t</i>.', space: 'lines:2' },
            { q: 'Find the correct flow capacity.', a: '4 + 4 + 5 = 13', space: 'line' },
            { q: 'Without redoing the method, how could Lily have seen that 15 must be wrong?', a: 'Only 8 + 6 = 14 can leave the source, so the flow can never be 15.', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
