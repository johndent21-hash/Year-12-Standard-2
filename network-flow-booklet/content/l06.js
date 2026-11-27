const { assert, N, en, ens, tbl, ul, figs } = require('./_h');
const { net, svg, autoCut, lineCut, allCuts, cutValue, paths } = N;

const setName = (G, S) => `{${['s', ...S].map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}`;
const restName = (G, S) => `{${N.names(G).filter((v) => v !== 's' && !S.includes(v)).map((v) => (v === 't' ? '<i>t</i>' : v)).join(', ')}}`;
const cv = (G, S) => cutValue(G, S);
const sumText = (G, c) => `${c.fwd.map((k) => N.E(G, k).c).join(' + ')} = ${c.value}`;

// Worked example network (one backward edge, D→A)
const W = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 10], ['s', 'B', 8], ['A', 'C', 7], ['B', 'D', 9], ['D', 'A', 3], ['C', 't', 11], ['D', 't', 6]]);
const Wc = [autoCut(W, [], 'C1'), autoCut(W, ['A', 'B'], 'C2'), autoCut(W, ['A', 'B', 'C', 'D'], 'C3')];
const Wv = Wc.map((c) => lineCut(W, c.pts));
assert.deepStrictEqual(Wv.map((c) => c.value), [18, 16, 17]);
assert.deepStrictEqual(Wv[1].back, ['D>A']);
const W2 = cv(W, ['A']); assert.strictEqual(W2.value, 15);

// Key ideas picture
const K = net({ s: [20, 70], A: [130, 20], B: [130, 120], t: [240, 70] },
  [['s', 'A', 9], ['s', 'B', 6], ['A', 'B', 4], ['A', 't', 7], ['B', 't', 8]]);
const Kc = autoCut(K, ['A'], ''); const Kv = lineCut(K, Kc.pts);
assert.strictEqual(Kv.value, 6 + 4 + 7);

// Foundation 1 and 2 (no backward edges in the cuts used in Q1)
const F1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 9], ['s', 'B', 7], ['A', 'C', 5], ['A', 't', 6], ['B', 'C', 8], ['C', 't', 10]]);
const F1c = [autoCut(F1, [], 'C1'), autoCut(F1, ['A', 'B'], 'C2'), autoCut(F1, ['A', 'B', 'C'], 'C3')];
const F1v = F1c.map((c) => lineCut(F1, c.pts));
assert.deepStrictEqual(F1v.map((c) => c.value), [16, 19, 16]);
F1v.forEach((c) => assert.strictEqual(c.back.length, 0));
const F2c = autoCut(F1, ['A'], 'C4'); const F2v = lineCut(F1, F2c.pts);
assert.strictEqual(F2v.value, 18);

// Foundation 3: which lines are cuts?
const F3 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 6], ['s', 'B', 5], ['A', 'B', 2], ['A', 't', 3], ['B', 't', 7]]);
const L1 = autoCut(F3, [], 'L1'); const L2 = autoCut(F3, ['A'], 'L2');
const L3 = { pts: [[92, -12], [100, 52], [178, 52], [188, -12]], label: 'L3', lp: [188, -12] };
{ // L3 crosses s→A, A→B and A→t but not the path s–B–t, so it is not a cut
  const crossed = F3.e.filter((x) => { const seg = [F3.v[x.u], F3.v[x.v]]; let n = 0; for (let i = 0; i < L3.pts.length - 1; i++) { const p = L3.pts[i]; const q = L3.pts[i + 1]; const d = (a, b, c) => (c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0]); if (d(p, q, seg[0]) * d(p, q, seg[1]) < 0 && d(seg[0], seg[1], p) * d(seg[0], seg[1], q) < 0) n++; } return n % 2; }).map((x) => x.key);
  assert.deepStrictEqual(crossed.sort(), ['A>B', 'A>t', 's>A']);
  assert(paths(F3).some((p) => p.slice(1).every((b, i) => !crossed.includes(`${p[i]}>${b}`))));
}
// Core 6: all 4 cuts of a 4-vertex network
const F6 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 6], ['s', 'B', 5], ['A', 'B', 2], ['A', 't', 3], ['B', 't', 7]]);
const f6 = [[], ['A'], ['B'], ['A', 'B']].map((S) => cv(F6, S));
assert.deepStrictEqual(f6.map((c) => c.value), [11, 10, 13, 10]);
assert.deepStrictEqual(f6[2].back, ['A>B']);

// Core 4: backward edges
const C4 = net({ s: [20, 90], P: [130, 20], Q: [130, 160], R: [240, 20], S: [240, 160], t: [350, 90] },
  [['s', 'P', 12], ['s', 'Q', 10], ['P', 'R', 8], ['Q', 'S', 9], ['R', 'Q', 4], ['S', 'P', 5], ['R', 't', 10], ['S', 't', 11]]);
const C4c = [autoCut(C4, ['P', 'Q'], 'C1'), autoCut(C4, ['P'], 'C2'), autoCut(C4, ['P', 'R'], 'C3')];
const C4v = C4c.map((c) => lineCut(C4, c.pts));
assert.deepStrictEqual(C4v.map((c) => [c.value, c.back]), [[17, ['R>Q', 'S>P']], [18, ['S>P']], [24, ['S>P']]]);

// Core 5: cuts from vertex groups
const C5 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 14], ['s', 'B', 9], ['A', 'C', 6], ['A', 'D', 7], ['B', 'D', 5], ['C', 't', 10], ['D', 't', 12], ['D', 'C', 4]]);
const c5a = cv(C5, ['A']); const c5b = cv(C5, ['A', 'B', 'D']);
assert.deepStrictEqual([c5a.value, c5b.value], [22, 22]);
assert.deepStrictEqual(c5b.fwd.sort(), ['A>C', 'D>C', 'D>t']);

// Challenge 7: all 8 cuts
const H7 = F1; const h7 = allCuts(H7);
const h7min = Math.min(...h7.map((c) => c.value));
assert.strictEqual(h7.length, 8); assert.strictEqual(h7min, 16);
// Challenge 8: Zoe adds a backward edge
const H8 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 10], ['s', 'B', 6], ['A', 'C', 7], ['B', 'C', 3], ['B', 't', 9], ['C', 't', 8], ['A', 'B', 2]]);
const h8 = cv(H8, ['A', 'C']);
assert.strictEqual(h8.value, 16); assert.deepStrictEqual(h8.back, ['B>C']);
assert.deepStrictEqual(h8.fwd.sort(), ['A>B', 'C>t', 's>B']);

const cutRows = (G, list) => tbl(['Source side', 'Sink side', 'Edges counted', 'Value'], list.map((S) => { const c = cv(G, S); return [setName(G, S), restName(G, S), c.fwd.map(en).join(', '), `${c.value}`]; }));

module.exports = {
  n: 6,
  title: 'Cuts',
  toc: 'Drawing cuts and calculating their capacity',
  content: ['Define and use network flow terminology including source, sink, outflow, inflow and <b>cut</b>', 'Solve small-scale network flow problems including the use of the maximum-flow minimum-cut theorem'],
  li: ['To understand what a cut is', 'To calculate the capacity of a cut correctly, including when an edge crosses it backwards'],
  sc: ['decide whether a line is a cut', 'list the vertices on each side of a cut', 'calculate the capacity of a cut, leaving out backward edges', 'list all the cuts of a small network'],
  key: `<div class="kgrid"><div>
    ${ul(['A <b>cut</b> splits the vertices into two groups: the <b>source side</b> (with <i>s</i>) and the <b>sink side</b> (with <i>t</i>).',
      'We draw a cut as a dashed line. It must cut <b>every</b> path from <i>s</i> to <i>t</i>. A line that leaves a path from <i>s</i> to <i>t</i> uncut is <b>not</b> a cut.',
      'The <b>capacity</b> (value) of a cut is the total capacity of the edges that cross it <b>from the source side to the sink side</b>.',
      'An edge that crosses <b>backwards</b> (from the sink side to the source side) is <b>not counted</b>.'])}
    <div class="note">A cut can be named by its source side, e.g. the cut {<i>s</i>, A} | {B, <i>t</i>}.</div>
  </div><div class="kfig">${svg(K, { cuts: [Kc] })}<div class="cap2">Source side {<i>s</i>, A}, sink side {B, <i>t</i>}<br>Capacity = 6 + 4 + 7 = 17</div></div></div>`,
  examples: [
    {
      q: '<p>Find the capacity of each cut C1, C2 and C3.</p>', fig: svg(W, { cuts: Wc }), figSide: true,
      sol: `${tbl(['Cut', 'Source side', 'Edges crossing forwards', 'Backwards (not counted)', 'Capacity'], Wc.map((c, i) => { const v = Wv[i]; return [c.label, `{${v.S.map((x) => (x === 's' ? '<i>s</i>' : x)).join(', ')}}`, v.fwd.map(en).join(', '), v.back.map(en).join(', ') || '–', `${sumText(W, v)}`]; }))}
        <p>C2 crosses ${en('D>A')}, but this edge goes from D (sink side) back to A (source side), so it is <b>not</b> counted. C2 = 7 + 9 = 16, not 19.</p>`,
    },
    {
      q: `<p>For the same network, find the capacity of the cut ${setName(W, ['A'])} | ${restName(W, ['A'])}.</p>`,
      sol: `<div class="side"><div class="sbody">${ul([`Edges from the source side to the sink side: ${ens(W2.fwd)}.`, `${en('D>A')} goes from D (sink side) to A (source side): not counted.`, `Capacity = ${sumText(W, W2)}`])}</div><div class="sfig">${svg(W, { cuts: [autoCut(W, ['A'], '')], scale: 0.8 })}</div></div>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Find the capacity of each cut.', fig: svg(F1, { cuts: F1c }), figSide: true,
          parts: [
            { q: 'C1', a: '9 + 7 = 16', space: 'line' },
            { q: 'C2', a: '5 + 6 + 8 = 19', space: 'line' },
            { q: 'C3', a: '6 + 10 = 16', space: 'line' },
            { q: 'Which cuts have the smallest capacity?', a: 'C1 and C3 (16)', space: 'line' },
          ],
        },
        {
          q: 'For the cut C4 on the same network:', fig: svg(F1, { cuts: [F2c] }), figSide: true,
          parts: [
            { q: 'list the vertices on the source side', a: '<i>s</i>, A', space: 'line' },
            { q: 'list the vertices on the sink side', a: 'B, C, <i>t</i>', space: 'line' },
            { q: 'name the edges that cross C4', a: `${ens(F2v.fwd)}`, space: 'line' },
            { q: 'find the capacity of C4', a: '7 + 5 + 6 = 18', space: 'line' },
          ],
        },
        {
          q: 'Three dashed lines are drawn on this network. For each line, decide whether it is a cut. If it is a cut, find its capacity. If not, explain why.', fig: svg(F3, { cuts: [L1, L2, L3] }), figSide: true,
          parts: [
            { q: 'L1', a: 'Cut: 6 + 5 = 11', space: 'line' },
            { q: 'L2', a: 'Cut: 5 + 2 + 3 = 10', space: 'line' },
            { q: 'L3', a: 'Not a cut: the path <i>s</i>–B–<i>t</i> does not cross it (<i>s</i> and <i>t</i> are on the same side).', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'Find the capacity of each cut. Watch out for edges that cross backwards.', fig: svg(C4, { cuts: C4c }), figSide: true,
          parts: C4v.map((v, i) => ({ q: `C${i + 1}`, a: `${sumText(C4, v)} (${v.back.map(en).join(', ')} not counted)`, space: 'lines:2' })),
        },
        {
          q: 'For this network, draw each cut and find its capacity.', fig: svg(C5), figSide: true,
          parts: [
            { q: `Source side ${setName(C5, ['A'])}, sink side ${restName(C5, ['A'])}`, a: `${sumText(C5, c5a)}`, space: 'line' },
            { q: `Source side ${setName(C5, ['A', 'B', 'D'])}, sink side ${restName(C5, ['A', 'B', 'D'])}`, a: `${ens(c5b.fwd)}: ${sumText(C5, c5b)}`, space: 'line' },
          ],
        },
        {
          q: 'A network with two vertices between <i>s</i> and <i>t</i> has exactly four cuts. Complete the table for this network.', fig: svg(F6), figSide: true,
          parts: [{ q: tbl(['Source side', 'Sink side', 'Edges counted', 'Capacity'], [['{<i>s</i>}', '{A, B, <i>t</i>}', '', ''], ['{<i>s</i>, A}', '{B, <i>t</i>}', '', ''], ['{<i>s</i>, B}', '{A, <i>t</i>}', '', ''], ['{<i>s</i>, A, B}', '{<i>t</i>}', '', '']]), a: f6.map((c) => `${c.fwd.map(en).join(', ')}: ${c.value}`).join('; ') + ' (A→B is backwards in the third cut)', space: 'none' }],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'The network in Question 1 has three vertices between <i>s</i> and <i>t</i>. Explain why it has 8 cuts. List all 8 cuts and their capacities, and find the smallest.',
          a: `Each of A, B, C can be on either side: 2 × 2 × 2 = 8. ${h7.map((c) => `{${c.S.slice().sort((x, y) => (x === 's' ? -1 : y === 's' ? 1 : x < y ? -1 : 1)).map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}: ${c.value}`).join('; ')}. Smallest: ${h7min}.`, space: 'box:55',
        },
        {
          q: `Zoe calculates the capacity of the cut ${setName(H8, ['A', 'C'])} | ${restName(H8, ['A', 'C'])} as 2 + 6 + 3 + 8 = 19.`, fig: svg(H8), figSide: true,
          parts: [
            { q: 'Explain Zoe’s mistake and find the correct capacity.', a: 'She counted B→C (3), which crosses backwards, from B (sink side) to C (source side). Correct capacity: 6 + 2 + 8 = 16.', space: 'lines:2' },
            { q: 'Explain why edges that cross a cut backwards are not counted.', a: 'Flow on a backward edge goes from the sink side back to the source side, so it does not help any flow get across the cut towards <i>t</i>.', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
