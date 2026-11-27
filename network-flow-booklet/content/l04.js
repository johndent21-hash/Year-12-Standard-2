const { assert, N, en, ens, tbl, ul, figs, pathKeys } = require('./_h');
const { net, svg, checkFlow, maxFlow, paths } = N;

const ex = (G, fl) => Object.fromEntries(G.e.map((x) => [x.key, x.c - fl[x.key]]));
const satOf = (G, fl) => G.e.filter((x) => x.c === fl[x.key]).map((x) => x.key);
const stuck = (G, fl) => paths(G).every((p) => pathKeys(p).some((k) => N.E(G, k).c === fl[k]));

// Key ideas / worked examples
const W = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 10], ['s', 'B', 9], ['A', 'B', 4], ['A', 't', 8], ['B', 't', 12]]);
const Wf = { 's>A': 7, 's>B': 9, 'A>B': 1, 'A>t': 6, 'B>t': 10 };
assert(checkFlow(W, Wf).ok); assert.strictEqual(checkFlow(W, Wf).value, 16);
assert.deepStrictEqual(satOf(W, Wf), ['s>B']);
const Wf2 = { 's>A': 10, 's>B': 9, 'A>B': 2, 'A>t': 8, 'B>t': 11 };
assert(checkFlow(W, Wf2).ok); assert.strictEqual(checkFlow(W, Wf2).value, 19); assert(stuck(W, Wf2)); assert.strictEqual(maxFlow(W).value, 19);

// Foundation 1
const F1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 12], ['s', 'B', 8], ['A', 'C', 7], ['A', 't', 5, { t: 0.55 }], ['B', 'C', 6], ['C', 't', 15]]);
const F1f = { 's>A': 12, 's>B': 6, 'A>C': 7, 'A>t': 5, 'B>C': 6, 'C>t': 13 };
assert(checkFlow(F1, F1f).ok);
assert.deepStrictEqual(satOf(F1, F1f), ['s>A', 'A>C', 'A>t', 'B>C']);
const f1x = ex(F1, F1f);

// Foundation 3: spare capacity along a path
const F3 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 14], ['s', 'B', 10], ['A', 'C', 8], ['A', 'D', 5], ['B', 'D', 9], ['C', 't', 11], ['D', 't', 12], ['C', 'D', 3]]);
const F3f = { 's>A': 10, 's>B': 7, 'A>C': 6, 'A>D': 4, 'B>D': 7, 'C>D': 0, 'C>t': 6, 'D>t': 11 };
assert(checkFlow(F3, F3f).ok); assert.strictEqual(checkFlow(F3, F3f).value, 17);
const f3x = ex(F3, F3f);
const along = (p) => Math.min(...pathKeys(p).map((k) => f3x[k]));
assert.deepStrictEqual([along(['s', 'A', 'C', 't']), along(['s', 'B', 'D', 't']), along(['s', 'A', 'D', 't']), along(['s', 'A', 'C', 'D', 't'])], [2, 1, 1, 1]);

// Core 4
const C4 = net({ s: [20, 90], P: [130, 20], Q: [130, 160], R: [240, 90], t: [350, 90] },
  [['s', 'P', 16], ['s', 'Q', 12], ['P', 'R', 9], ['Q', 'R', 7], ['P', 't', 8, { t: 0.6 }], ['Q', 't', 6, { t: 0.6 }], ['R', 't', 15]]);
const C4f = { 's>P': 12, 's>Q': 10, 'P>R': 6, 'Q>R': 4, 'P>t': 6, 'Q>t': 6, 'R>t': 10 };
assert(checkFlow(C4, C4f).ok); assert.strictEqual(checkFlow(C4, C4f).value, 22);
assert.strictEqual(maxFlow(C4).value, 28);
// s-P-t spare min(4,2)=2 ; s-P-R-t spare min(4,3,5)=3 ; s-Q-R-t spare min(2,3,5)=2
const C4x = ex(C4, C4f);

// Core 5: data network
const C5 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 90], t: [350, 90] },
  [['s', 'A', 50], ['s', 'B', 40], ['A', 'C', 30], ['B', 'C', 25], ['A', 't', 20, { t: 0.6 }], ['B', 't', 15, { t: 0.6 }], ['C', 't', 45]]);
const C5f = { 's>A': 45, 's>B': 35, 'A>C': 25, 'B>C': 20, 'A>t': 20, 'B>t': 15, 'C>t': 45 };
assert(checkFlow(C5, C5f).ok); assert.strictEqual(checkFlow(C5, C5f).value, 80);
assert.deepStrictEqual(satOf(C5, C5f), ['A>t', 'B>t', 'C>t']); assert(stuck(C5, C5f));

// Challenge 7: keep increasing
const H7 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 9], ['s', 'B', 8], ['A', 'C', 6], ['A', 'D', 3], ['B', 'D', 7], ['C', 't', 8], ['D', 't', 10]]);
const H7f = { 's>A': 5, 's>B': 4, 'A>C': 3, 'A>D': 2, 'B>D': 4, 'C>t': 3, 'D>t': 6 };
assert(checkFlow(H7, H7f).ok); assert.strictEqual(checkFlow(H7, H7f).value, 9);
assert.strictEqual(maxFlow(H7).value, 16);
const rem = (G, f) => ({ ...G, e: G.e.map((x) => ({ ...x, c: x.c - f[x.key] })) });
assert.deepStrictEqual(N.greedyRange(rem(H7, H7f)), { lo: 7, hi: 7 });
assert.deepStrictEqual(N.greedyRange(rem(C4, C4f)), { lo: 6, hi: 6 });
assert.deepStrictEqual(N.greedyRange(rem(W, Wf)), { lo: 3, hi: 3 });

// Challenge 8: stuck but not maximum
const T = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 2], ['s', 'B', 2], ['A', 'B', 2], ['A', 't', 2], ['B', 't', 2]]);
const Tf = { 's>A': 2, 's>B': 0, 'A>B': 2, 'A>t': 0, 'B>t': 2 };
assert(checkFlow(T, Tf).ok); assert(stuck(T, Tf)); assert.strictEqual(maxFlow(T).value, 4);

module.exports = {
  n: 4,
  title: 'Excess capacity and saturated edges',
  toc: 'Spare capacity, saturated edges, increasing a flow',
  content: ['Calculate and analyse the flow capacity of a network including the use of the saturated edges method'],
  li: ['To find the spare (excess) capacity of each edge in a flow', 'To use saturated edges to decide whether a flow can be increased'],
  sc: ['calculate the excess capacity of an edge', 'identify the saturated edges in a flow', 'find a path with spare capacity and increase the flow along it', 'explain why a saturated edge can be a bottleneck'],
  key: `<div class="kgrid"><div>
    ${ul(['The <b>excess capacity</b> of an edge is the spare room on it:<br><b>excess capacity = capacity − flow</b>',
      'An edge is <b>saturated</b> when its excess capacity is 0 (flow = capacity). It is full. We mark a saturated edge with a short red stroke.',
      'To <b>increase</b> a flow, find a path from <i>s</i> to <i>t</i> with <b>no saturated edges</b>. You can add the <b>smallest</b> excess capacity on that path to every edge on the path.',
      'If every path from <i>s</i> to <i>t</i> has a saturated edge, no more can be added this way.'])}
  </div><div class="kfig">${svg(W, { flows: Wf, sat: satOf(W, Wf) })}<div class="cap2"><i>s</i>→B is saturated (9 of 9).<br>Excess on <i>s</i>→A is 10 − 7 = 3.</div></div></div>`,
  examples: [
    {
      q: '<p>For the flow shown in the Key ideas, find the excess capacity of each edge and name the saturated edges.</p>',
      sol: `<div class="side"><div class="sfig">${tbl(['Edge', 'Capacity', 'Flow', 'Excess capacity'], W.e.map((x) => [en(x.key), x.c, Wf[x.key], `${x.c} − ${Wf[x.key]} = <b>${x.c - Wf[x.key]}</b>`]))}</div><div class="sbody"><p>The only edge with excess capacity 0 is ${en('s>B')}, so <b>${en('s>B')} is saturated</b>.</p><p class="small">Every other edge still has room for more flow.</p></div></div>`,
    },
    {
      q: '<p>Increase the flow as much as you can by finding paths with no saturated edges. What is the final value of the flow?</p>',
      sol: `${tbl(['Path', 'Excess capacities on the path', 'Add', 'Newly saturated'], [
        ['<i>s</i>–A–<i>t</i>', '3, 2', '<b>2</b>', `${en('A>t')}`],
        ['<i>s</i>–A–B–<i>t</i>', '3 − 2 = 1, 3, 2', '<b>1</b>', `${en('s>A')}`],
      ])}
      <div class="side"><div class="sbody">${ul(['The value was 16. It is now 16 + 2 + 1 = <b>19</b>.', `Check every path: <i>s</i>–A–<i>t</i> uses ${en('A>t')} (saturated), <i>s</i>–B–<i>t</i> uses ${en('s>B')} (saturated) and <i>s</i>–A–B–<i>t</i> uses ${en('s>A')} (saturated). No path is free, so we stop.`])}</div><div class="sfig">${svg(W, { flows: Wf2, sat: satOf(W, Wf2), scale: 0.85 })}</div></div>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Complete the table for the flow shown.', fig: svg(F1, { flows: F1f }), figSide: true,
          parts: [
            { q: tbl(['Edge', 'Capacity', 'Flow', 'Excess', 'Saturated?'], F1.e.map((x, i) => (i === 0 ? [en(x.key), x.c, F1f[x.key], 0, 'yes'] : [en(x.key), '', '', '', '']))), a: F1.e.slice(1).map((x) => `${en(x.key)} ${f1x[x.key]}${f1x[x.key] === 0 ? ' (sat.)' : ''}`).join('; '), space: 'none' },
            { q: 'How many edges are saturated?', a: '4', space: 'line' },
          ],
        },
        {
          q: 'Find the excess capacity of an edge with:',
          parts: [
            { q: 'capacity 15, flow 9', a: '6', space: 'line' },
            { q: 'capacity 40, flow 40', a: '0 (saturated)', space: 'line' },
            { q: 'capacity 7.5, flow 2.5', a: '5', space: 'line' },
          ],
        },
        {
          q: 'For this flow, find the most extra flow that could be sent along each path.', fig: svg(F3, { flows: F3f }), figSide: true,
          parts: [
            { q: '<i>s</i>–A–C–<i>t</i>', a: 'excesses 4, 2, 5 → 2', space: 'line' },
            { q: '<i>s</i>–B–D–<i>t</i>', a: 'excesses 3, 2, 1 → 1', space: 'line' },
            { q: '<i>s</i>–A–D–<i>t</i>', a: 'excesses 4, 1, 1 → 1', space: 'line' },
            { q: '<i>s</i>–A–C–D–<i>t</i>', a: 'excesses 4, 2, 3, 1 → 1', space: 'line' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'This network shows a flow of 22.', fig: svg(C4, { flows: C4f }), figSide: true,
          parts: [
            { q: 'Which edges are saturated?', a: `${en('Q>t')} only`, space: 'line' },
            { q: 'Find a path from <i>s</i> to <i>t</i> with no saturated edges, and the most that can be added along it.', a: `e.g. <i>s</i>–P–<i>t</i>: add 2; or <i>s</i>–P–R–<i>t</i>: add 3; or <i>s</i>–Q–R–<i>t</i>: add 2`, space: 'lines:2' },
            { q: 'Keep adding flow along paths with no saturated edges until you cannot add any more. What value do you reach?', a: '28 (e.g. +2 on <i>s</i>–P–<i>t</i>, +2 on <i>s</i>–P–R–<i>t</i>, +2 on <i>s</i>–Q–R–<i>t</i>)', space: 'box:20' },
          ],
        },
        {
          q: 'A school’s data network is carrying 80 Mbps, as shown. The IT manager wants to send another 5 Mbps from the server (<i>s</i>) to the hall (<i>t</i>).', fig: svg(C5, { flows: C5f, sat: [] }),
          parts: [
            { q: 'Name the saturated edges.', a: `${ens(['A>t', 'B>t', 'C>t'])}`, space: 'line' },
            { q: 'Explain why the extra 5 Mbps cannot be sent using these paths.', a: 'Every path to <i>t</i> ends with A→<i>t</i>, B→<i>t</i> or C→<i>t</i>, and all three are saturated, so no path has any spare capacity.', space: 'lines:2' },
            { q: 'Which edges have spare capacity that cannot be used? Why is upgrading them pointless?', a: `<i>s</i>→A (5), <i>s</i>→B (5), A→C (5), B→C (5). Extra data could reach A, B or C, but cannot get from there to <i>t</i>.`, space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'This network shows a flow of 9. Increase the flow as much as you can. Show the final flow on each edge (cross out the old values) and state the final value.', fig: svg(H7, { flows: H7f }),
          a: 'Final value 16, e.g. <i>s</i>→A 9, <i>s</i>→B 7, A→C 6, A→D 3, B→D 7, C→<i>t</i> 6, D→<i>t</i> 10', space: 'lines:3',
        },
        {
          q: 'Sam finds this flow of 2 and says, “Every path from <i>s</i> to <i>t</i> has a saturated edge, so this is the biggest flow possible.”', fig: svg(T, { flows: Tf, sat: ['s>A', 'A>B', 'B>t'] }), figSide: true,
          parts: [
            { q: 'Check that every path from <i>s</i> to <i>t</i> has a saturated edge.', a: '<i>s</i>–A–<i>t</i> (<i>s</i>→A full), <i>s</i>–B–<i>t</i> (B→<i>t</i> full), <i>s</i>–A–B–<i>t</i> (all full)', space: 'lines:2' },
            { q: 'Find a valid flow with a larger value.', a: '<i>s</i>→A 2, A→<i>t</i> 2, <i>s</i>→B 2, B→<i>t</i> 2, A→B 0: value 4', space: 'lines:2' },
            { q: 'What does this tell you about Sam’s reasoning?', a: 'Getting stuck does not prove the flow is the maximum. Sending flow along A→B blocked better routes. A different choice of paths gives more, so you need another check (a cut, Lesson 7).', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
