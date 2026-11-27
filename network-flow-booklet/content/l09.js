const { assert, N, en, ens, tbl, ul, figs } = require('./_h');
const { net, svg, allCuts, cutValue, maxFlow, minCut } = N;
const mod = (G, ch) => ({ ...G, e: G.e.map((x) => (ch[x.key] !== undefined ? { ...x, c: ch[x.key] } : x)) });
const mf = (G, ch = {}) => maxFlow(mod(G, ch)).value;
const grp = (S) => `{${S.slice().sort((a, b) => (a === 's' ? -1 : b === 's' ? 1 : a < b ? -1 : 1)).map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}`;
const sumText = (G, c) => `${c.fwd.map((k) => N.E(G, k).c).join(' + ')} = ${c.value}`;
const V4 = { s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] };
const V5 = { s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] };
const cutTable = (G, chs, heads) => tbl(['Cut (source side)', 'Edges counted', ...heads], allCuts(G).map((c) => [grp(c.S), c.fwd.map(en).join(', '), ...chs.map((ch) => { const v = cutValue(mod(G, ch), c.S.filter((x) => x !== 's')).value; return `${v}`; })]));

// Worked examples
const W = net(V4, [['s', 'A', 12], ['s', 'B', 10], ['A', 'B', 3], ['A', 't', 8], ['B', 't', 11]]);
assert.deepStrictEqual(allCuts(W).map((c) => c.value), [22, 21, 23, 19]);
assert.strictEqual(mf(W), 19); assert.strictEqual(mf(W, { 's>A': 20 }), 19); assert.strictEqual(mf(W, { 'A>t': 13 }), 22); assert.strictEqual(mf(W, { 'A>B': 0 }), 18);

// Foundation 1
const F1 = net(V4, [['s', 'A', 9], ['s', 'B', 7], ['A', 'B', 2], ['A', 't', 5], ['B', 't', 8]]);
const f1 = allCuts(F1); assert.deepStrictEqual(f1.map((c) => c.value), [16, 14, 17, 13]);
assert.deepStrictEqual([mf(F1, { 's>A': 12 }), mf(F1, { 'A>t': 8 }), mf(F1, { 'A>B': 0 })], [13, 16, 12]);
// which single edge can be reduced by 2 without changing the flow capacity? only s→A
assert.deepStrictEqual(F1.e.filter((x) => mf(F1, { [x.key]: x.c - 2 }) === 13).map((x) => x.key), ['s>A']);

// Core 3: an upgrade of 2 gives only 1
const C3 = net(V4, [['s', 'A', 10], ['s', 'B', 8], ['A', 'B', 3], ['A', 't', 6], ['B', 't', 12]]);
assert.strictEqual(mf(C3), 17); const c3min = minCut(C3); assert.strictEqual(c3min.cuts.length, 1);
const c3up = C3.e.map((x) => [x.key, mf(C3, { [x.key]: x.c + 2 })]);
assert.deepStrictEqual(c3up, [['s>A', 17], ['s>B', 18], ['A>B', 18], ['A>t', 18], ['B>t', 17]]);
// Core 4: two minimum cuts, vehicles per hour
const C4 = net(V5, [['s', 'A', 500], ['s', 'B', 400], ['A', 'C', 300], ['A', 't', 250], ['B', 'C', 200], ['C', 't', 450], ['B', 't', 150]]);
const c4min = minCut(C4); assert.strictEqual(c4min.value, 850); assert.strictEqual(c4min.cuts.length, 2);
const c4up = C4.e.map((x) => [x.key, mf(C4, { [x.key]: x.c + 100 })]);
assert.deepStrictEqual(c4up.filter(([, v]) => v > 850), [['B>t', 900]]);
const c4close = C4.e.map((x) => [x.key, mf(C4, { [x.key]: 0 })]);
assert.deepStrictEqual(c4close.find(([k]) => k === 's>A'), ['s>A', 350]);
assert.strictEqual(Math.min(...c4close.map(([, v]) => v)), 350);
assert.strictEqual(mf(C4, { 'B>C': 0 }), 650);

// Challenge 6: least extra capacity to reach 25
const H6 = net(V5, [['s', 'A', 14], ['s', 'B', 10], ['A', 'C', 6], ['A', 't', 7], ['B', 'C', 8], ['C', 't', 12], ['B', 't', 3]]);
assert.strictEqual(mf(H6), 22);
assert.strictEqual(mf(H6, { 'A>t': 10, 's>B': 11 }), 25);
{ // brute force: no total increase of 3 or less reaches 25
  const ks = H6.e.map((x) => x.key); let ok3 = false;
  const rec = (i, ch, tot) => { if (tot > 3 || ok3) return; if (i === ks.length) { if (mf(H6, Object.fromEntries(Object.entries(ch).map(([k, d]) => [k, N.E(H6, k).c + d]))) >= 25) ok3 = true; return; } for (let d = 0; d <= 3; d++) { ch[ks[i]] = d; rec(i + 1, ch, tot + d); } delete ch[ks[i]]; };
  rec(0, {}, 0); assert(!ok3);
}
const h6low = allCuts(H6).filter((c) => c.value < 25).sort((a, b) => a.value - b.value);
assert.deepStrictEqual(h6low.map((c) => c.value), [22, 23, 24, 24]);

module.exports = {
  n: 9,
  title: 'Changing the capacity of an edge',
  toc: 'Upgrades, closures and their effect on the flow capacity',
  content: ['Examine the impact of increasing or reducing the flow capacity of an edge in a network diagram', 'Solve small-scale network flow problems including the use of the maximum-flow minimum-cut theorem'],
  li: ['To predict how increasing or reducing the capacity of one edge changes the flow capacity', 'To choose the best upgrade for a network'],
  sc: ['explain why upgrading an edge outside the minimum cut does not help', 'find the new flow capacity after an edge is increased, reduced or closed', 'recognise when a network has more than one minimum cut', 'choose the edge to upgrade that gives the greatest increase'],
  key: `${ul(['The flow capacity equals the minimum cut. So to see the effect of a change, look at what happens to the <b>cuts</b>.',
    '<b>Increasing</b> an edge that is <b>not in any minimum cut</b> does not change the flow capacity: the minimum cut is still there with the same capacity.',
    'Increasing an edge in the minimum cut by <i>k</i> increases that cut by <i>k</i>, but another cut may now be the smallest. The flow capacity goes up by <b>at most <i>k</i></b>.',
    'If there are <b>two or more minimum cuts</b>, an upgrade only helps if the edge is in <b>all</b> of them.',
    '<b>Reducing</b> an edge (or closing it: capacity 0) lowers every cut that counts it. The new flow capacity is the smallest cut after the change. It may stay the same, or fall.'])}
    <div class="note"><b>Method:</b> list the cuts and their capacities, change the ones that include the edge, then find the new minimum.</div>`,
  examples: [
    {
      q: '<p>For this network, find the flow capacity, and the new flow capacity if: (a) <i>s</i>→A is increased to 20; (b) A→<i>t</i> is increased by 5; (c) A→B is closed.</p>', fig: svg(W), figSide: true,
      sol: `${cutTable(W, [{}, { 's>A': 20 }, { 'A>t': 13 }, { 'A>B': 0 }], ['Now', '(a)', '(b)', '(c)'])}
        ${ul(['Now: the minimum cut is A→<i>t</i>, B→<i>t</i> = <b>19</b>.', '(a) <i>s</i>→A is not in the minimum cut. Smallest cut is still 19: <b>no change</b>.', '(b) The minimum cut rises to 24, but the cut {<i>s</i>} (22) is now the smallest. Flow capacity <b>22</b>: an upgrade of 5 gives only 3 more.', '(c) Closing A→B lowers the cut {<i>s</i>, A} from 21 to 18. Flow capacity falls to <b>18</b>.'])}`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Use this network.', fig: svg(F1), figSide: true,
          parts: [
            { q: `Complete the table of cuts.${tbl(['Source side', 'Edges counted', 'Capacity'], [['{<i>s</i>}', '<i>s</i>→A, <i>s</i>→B', '16'], ['{<i>s</i>, A}', '', ''], ['{<i>s</i>, B}', '', ''], ['{<i>s</i>, A, B}', '', '']])}`, a: f1.slice(1).map((c) => `${c.fwd.map(en).join(', ')}: ${c.value}`).join('; '), space: 'none' },
            { q: 'What is the flow capacity?', a: '13', space: 'line' },
            { q: 'Find the new flow capacity if <i>s</i>→A is increased by 3. Explain.', a: '13 (no change): <i>s</i>→A is not in the minimum cut.', space: 'lines:2' },
            { q: 'Find the new flow capacity if A→<i>t</i> is increased by 3.', a: '16 (cuts become 16, 17, 17, 16)', space: 'line' },
            { q: 'Find the new flow capacity if A→B is closed.', a: '12 (cut {<i>s</i>, A} becomes 12)', space: 'line' },
          ],
        },
        {
          q: 'Write true or false, and give a reason.',
          parts: [
            { q: 'Increasing the capacity of any edge always increases the flow capacity.', a: 'False. Only edges in the minimum cut (in every minimum cut) can help.', space: 'lines:2' },
            { q: 'Increasing an edge in the minimum cut by 5 always increases the flow capacity by 5.', a: 'False. It increases by at most 5; another cut may become the minimum.', space: 'lines:2' },
            { q: 'Reducing the capacity of an edge can never increase the flow capacity.', a: 'True. No cut gets bigger, so the minimum cut cannot get bigger.', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'Use this network.', fig: svg(C3), figSide: true,
          parts: [
            { q: 'Find the flow capacity and the minimum cut.', a: `17; ${grp(c3min.cuts[0].S)}: ${ens(c3min.cuts[0].fwd)}`, space: 'lines:2' },
            { q: 'One edge can be increased by 2. Which edges would increase the flow capacity, and to what?', a: `${ens(c3up.filter(([, v]) => v > 17).map(([k]) => k))}: each gives 18`, space: 'lines:2' },
            { q: 'Explain why an increase of 2 only gives 1 more.', a: 'The minimum cut rises from 17 to 19, but another cut ({<i>s</i>} or {<i>s</i>, A, B}, depending on the edge) still has capacity 18, so that cut becomes the minimum.', space: 'lines:2' },
          ],
        },
        {
          q: 'The network shows roads from a stadium car park (<i>s</i>) to a highway (<i>t</i>), in vehicles per hour. The council can widen one road, adding 100 vehicles per hour.', fig: svg(C4), figSide: true,
          parts: [
            { q: 'Show that the network has two minimum cuts, and state the flow capacity.', a: `${c4min.cuts.map((c) => `${grp(c.S)}: ${sumText(C4, c)}`).join('; ')}. Flow capacity 850.`, space: 'lines:3' },
            { q: 'Which road should be widened? Explain.', a: 'B→<i>t</i>: it is the only road in both minimum cuts. The flow capacity becomes 900. Widening any other road leaves one minimum cut at 850.', space: 'lines:3' },
            { q: 'Instead, road B→C is closed for repairs. Find the new flow capacity.', a: '650', space: 'line' },
          ],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'The flow capacity of this network is 22. Capacity can be added to any edges, in whole units.', fig: svg(H6), figSide: true,
          parts: [
            { q: 'List the cuts with capacity less than 25.', a: h6low.map((c) => `${grp(c.S)}: ${c.value}`).join('; '), space: 'lines:2' },
            { q: 'Find the least total capacity that must be added to make the flow capacity 25. Which edges would you upgrade?', a: '4 units, e.g. A→<i>t</i> +3 and <i>s</i>→B +1. A→<i>t</i> is in three of the four small cuts; {<i>s</i>} needs 1 more on <i>s</i>→A or <i>s</i>→B, which are not in the smallest cut, so 3 units is not enough.', space: 'lines:4' },
          ],
        },
        {
          q: 'For the network in Question 1, the capacity of one edge is reduced by 2 for maintenance, but the flow capacity does not change. Which edge was it? Explain.',
          a: '<i>s</i>→A. Every cut that counts it ({<i>s</i>} 16, {<i>s</i>, B} 17) is still at least 13 after a reduction of 2. Every other edge is in the minimum cut or in the cut of 14.', space: 'lines:3',
        },
        {
          q: 'Explain why increasing the capacity of one edge by <i>k</i> can never increase the flow capacity by more than <i>k</i>.',
          a: 'Every cut increases by <i>k</i> (if it counts the edge) or by 0. So the minimum cut, and therefore the maximum flow, increases by at most <i>k</i>.', space: 'lines:3',
        },
      ],
    },
  ],
};
