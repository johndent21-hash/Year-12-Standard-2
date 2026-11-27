const { assert, N, en, ens, tbl, ul, figs } = require('./_h');
const { net, svg, checkFlow, flowIO } = N;

const F = (G, obj) => { const o = {}; Object.entries(obj).forEach(([k, v]) => { o[k] = v; }); return o; };
const valid = (G, fl) => checkFlow(G, fl);

// Key ideas
const K = net({ s: [20, 70], A: [130, 20], B: [130, 130], t: [240, 70] },
  [['s', 'A', 9], ['s', 'B', 6], ['A', 'B', 4], ['A', 't', 7], ['B', 't', 8]]);
const Kf = { 's>A': 6, 's>B': 5, 'A>B': 2, 'A>t': 4, 'B>t': 7 };
assert(valid(K, Kf).ok); assert.strictEqual(valid(K, Kf).value, 11);

// Worked example 1: conservation holds everywhere but B→C is over capacity
const W1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 10], ['s', 'B', 8], ['A', 'C', 5], ['A', 't', 6, { t: 0.55 }], ['B', 'C', 6], ['C', 't', 12]]);
const W1f = { 's>A': 8, 's>B': 7, 'A>C': 5, 'A>t': 3, 'B>C': 7, 'C>t': 12 };
const w1 = valid(W1, W1f); assert.deepStrictEqual(w1.problems, ['B>C over capacity']);

// Worked example 2: missing flows
const W2 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 20], t: [350, 80] },
  [['s', 'A', 12], ['s', 'B', 10], ['A', 'B', 3], ['A', 'C', 8], ['B', 'C', 5], ['B', 't', 9], ['C', 't', 11]]);
const W2f = { 's>A': 8, 's>B': 7, 'A>B': 2, 'A>C': 6, 'B>C': 3, 'B>t': 6, 'C>t': 9 };
assert(valid(W2, W2f).ok); assert.strictEqual(valid(W2, W2f).value, 15);
const W2show = { ...W2f, 's>A': 'x', 'B>C': 'y', 'C>t': 'w' };

// Foundation 1: complete the in/out table
const F1 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 11], ['s', 'B', 9], ['A', 'C', 6], ['A', 't', 5, { t: 0.55 }], ['B', 'C', 7], ['B', 't', 4, { t: 0.55, side: -1 }], ['C', 't', 13]]);
const F1f = { 's>A': 10, 's>B': 9, 'A>C': 6, 'A>t': 4, 'B>C': 6, 'B>t': 3, 'C>t': 12 };
const f1 = valid(F1, F1f); assert(f1.ok); assert.strictEqual(f1.value, 19);
const f1io = flowIO(F1, F1f);

// Foundation 3: one unknown at a vertex
const star = (ins, outs, unknownSide) => {
  const v = { X: [110, 60] }; const e = []; const fl = {};
  ins.forEach(([n, f], i) => { v[n] = [10, ins.length === 1 ? 60 : 15 + i * 90 / (ins.length - 1)]; e.push([n, 'X', 99]); fl[`${n}>X`] = f; });
  outs.forEach(([n, f], i) => { v[n] = [210, outs.length === 1 ? 60 : 15 + i * 90 / (outs.length - 1)]; e.push(['X', n, 99]); fl[`X>${n}`] = f; });
  const G = net(v, e, { s: '_', t: '_' });
  return svg(G, { caps: false, flows: fl, scale: 0.9 });
};
const stars = [
  [[['P', 7], ['Q', 5]], [['R', 4], ['S', 'x']]], // x = 8
  [[['P', 9]], [['R', 'x'], ['S', 3], ['T', 2]]], // x = 4
  [[['P', 'x'], ['Q', 6], ['U', 1]], [['R', 12], ['S', 5]]], // x = 10
];
const starAns = [8, 4, 10];
stars.forEach(([ins, outs], i) => {
  const known = (arr) => arr.filter(([, f]) => f !== 'x').reduce((a, [, f]) => a + f, 0);
  const x = ins.some(([, f]) => f === 'x') ? known(outs) - known(ins) : known(ins) - known(outs);
  assert.strictEqual(x, starAns[i]);
});

// Foundation 4: valid or not (two small networks)
const V = net({ s: [20, 70], A: [120, 20], B: [120, 120], t: [220, 70] },
  [['s', 'A', 8], ['s', 'B', 7], ['A', 'B', 3], ['A', 't', 6], ['B', 't', 9]]);
const Va = { 's>A': 8, 's>B': 5, 'A>B': 2, 'A>t': 6, 'B>t': 7 }; // valid, value 13
const Vb = { 's>A': 7, 's>B': 6, 'A>B': 3, 'A>t': 5, 'B>t': 9 }; // A: in 7 out 8
assert(valid(V, Va).ok); assert.strictEqual(valid(V, Va).value, 13);
assert.deepStrictEqual(valid(V, Vb).problems, ['A: in 7, out 8']);

// Core 5: several missing flows
const C5 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 15], ['s', 'B', 12], ['A', 'C', 9], ['A', 'D', 6], ['B', 'D', 10], ['C', 't', 14], ['D', 't', 13], ['D', 'C', 4]]);
const C5f = { 's>A': 14, 's>B': 10, 'A>C': 9, 'A>D': 5, 'B>D': 10, 'D>C': 3, 'C>t': 12, 'D>t': 12 };
assert(valid(C5, C5f).ok); assert.strictEqual(valid(C5, C5f).value, 24);
const C5show = { ...C5f, 'A>D': 'p', 'D>C': 'q', 'C>t': 'r', 'D>t': 'u' };
// with sA=14, AC=9 -> p=5; B: in 10 -> BD=10; D: in 5+10=15 = q + u; C: in 9+q = r. Given u = 12 -> q = 3, r = 12

// Core 6: find the error
const C6 = net({ s: [20, 90], P: [130, 20], Q: [130, 160], R: [240, 90], t: [350, 90] },
  [['s', 'P', 20], ['s', 'Q', 15], ['P', 'R', 8], ['Q', 'R', 10], ['P', 't', 12, { t: 0.6 }], ['Q', 't', 6, { t: 0.6 }], ['R', 't', 18]]);
const C6f = { 's>P': 18, 's>Q': 15, 'P>R': 8, 'Q>R': 10, 'P>t': 10, 'Q>t': 6, 'R>t': 18 };
assert.deepStrictEqual(valid(C6, C6f).problems, ['Q: in 15, out 16']);

// Core 7: context
const C7 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 40], ['s', 'B', 35], ['A', 'B', 10], ['A', 'C', 25], ['B', 'C', 20], ['B', 't', 30], ['C', 't', 45]]);
const C7f = { 's>A': 32, 's>B': 28, 'A>B': 10, 'A>C': 22, 'B>C': 18, 'B>t': 20, 'C>t': 40 };
assert(valid(C7, C7f).ok); assert.strictEqual(valid(C7, C7f).value, 60);
const C7show = { 's>A': 32, 's>B': 28, 'A>B': 10, 'A>C': '', 'B>C': 18, 'B>t': '', 'C>t': '' };

// Challenge 8: find a flow of a given value
const H8 = net({ s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] },
  [['s', 'A', 8], ['s', 'B', 9], ['A', 'C', 5], ['A', 'D', 4], ['B', 'D', 7], ['C', 't', 7], ['D', 't', 9], ['B', 'A', 2]]);
const H8f = { 's>A': 8, 's>B': 6, 'B>A': 1, 'A>C': 5, 'A>D': 4, 'B>D': 5, 'C>t': 5, 'D>t': 9 };
assert(valid(H8, H8f).ok); assert.strictEqual(valid(H8, H8f).value, 14);
assert.strictEqual(N.maxFlow(H8).value, 14);

// Challenge 10: range of an unknown flow
const H10 = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 20], t: [350, 80] },
  [['s', 'A', 10], ['s', 'B', 12], ['A', 'B', 4], ['A', 'C', 7], ['B', 'C', 6], ['B', 't', 10], ['C', 't', 11]]);
// fixed: sA 9, sB 8, AB 2, AC 7  -> B passes on 10 = y (B→C) + z (B→t); C: 7 + y = C→t <= 11 -> y <= 4; y<=6; z<=10 -> z >= 6
const H10show = { 's>A': 9, 's>B': 8, 'A>B': 2, 'A>C': 7, 'B>C': 'y', 'B>t': 'z', 'C>t': '' };
{ let lo = Infinity; let hi = -Infinity; for (let y = 0; y <= 6; y++) { const z = 10 - y; const fl = { 's>A': 9, 's>B': 8, 'A>B': 2, 'A>C': 7, 'B>C': y, 'B>t': z, 'C>t': 7 + y }; if (valid(H10, fl).ok) { lo = Math.min(lo, z); hi = Math.max(hi, z); } } assert.deepStrictEqual([lo, hi], [6, 10]); }

module.exports = {
  n: 3,
  title: 'Flows and the flow rules',
  toc: 'Valid flows, inflow = outflow, finding missing flows',
  content: ['Define and use network flow terminology including source, sink, outflow, inflow and cut', 'Calculate and analyse the flow capacity of a network'],
  li: ['To understand the two rules that every flow must follow', 'To use inflow = outflow to find missing flows'],
  sc: ['check whether a flow obeys the capacity rule and the conservation rule', 'calculate the inflow and outflow of a vertex', 'find a missing flow at a vertex', 'find the value of a flow'],
  key: `<div class="kgrid"><div>
    <p>A <b>flow</b> gives an amount to every edge. In this booklet the flow is written in a <b>gold box</b> and the capacity is the plain number.</p>
    <p><b>Every flow must obey two rules.</b></p>
    ${ul(['<b>Capacity rule:</b> the flow on an edge is between 0 and the capacity of that edge. It can never be more than the capacity.',
      '<b>Conservation rule:</b> at every vertex except <i>s</i> and <i>t</i>, <b>inflow = outflow</b>. Vertices cannot store flow.'])}
    <p>The <b>value</b> of the flow is the amount that gets through the network:<br><b>value = outflow of <i>s</i> = inflow of <i>t</i></b></p>
  </div><div class="kfig">${svg(K, { flows: Kf })}<div class="cap2">A: in 6, out 2 + 4 = 6 ✓ &nbsp; B: in 5 + 2 = 7, out 7 ✓<br>Value = 6 + 5 = 11 = 4 + 7</div></div></div>`,
  examples: [
    {
      q: '<p>Is this a valid flow? Give a reason.</p>', fig: svg(W1, { flows: W1f }), figSide: true,
      sol: `<div class="side"><div class="sfig">${tbl(['Vertex', 'Inflow', 'Outflow', 'Equal?'], [['A', '8', '5 + 3 = 8', '✓'], ['B', '7', '7', '✓'], ['C', '5 + 7 = 12', '12', '✓']])}</div>
        <div class="sbody"><p>Conservation rule: inflow = outflow at A, B and C. ✓</p><p>Capacity rule: check each edge. ${en('B>C')} has a flow of <b>7</b> but a capacity of only <b>6</b>. ✗</p><p><b>Not valid</b>, because the flow on ${en('B>C')} is more than its capacity.</p></div></div>`,
    },
    {
      q: '<p>This flow is valid. Find the missing flows <i>x</i>, <i>y</i> and <i>w</i>, and the value of the flow.</p>', fig: svg(W2, { flows: W2show }), figSide: true,
      sol: `${ul(['<b>Start at a vertex with only one unknown.</b> At A: inflow = <i>x</i>, outflow = 2 + 6 = 8, so <b><i>x</i> = 8</b>.',
        'At B: inflow = 7 + 2 = 9. Outflow = <i>y</i> + 6, so <i>y</i> + 6 = 9 and <b><i>y</i> = 3</b>.',
        'At C: inflow = 6 + <i>y</i> = 6 + 3 = 9 = outflow, so <b><i>w</i> = 9</b>.',
        'Value = outflow of <i>s</i> = 8 + 7 = <b>15</b>. Check: inflow of <i>t</i> = 6 + 9 = 15 ✓',
        'Check the capacity rule: every flow is no more than its capacity ✓'])}`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'This network shows a valid flow.', fig: svg(F1, { flows: F1f }), figSide: true,
          parts: [
            { q: `Complete the table.${tbl(['Vertex', 'Inflow', 'Outflow'], [['A', '', ''], ['B', '', ''], ['C', '', '']])}`, a: `A: ${f1io.A.in}, 6 + 4 = ${f1io.A.out}; B: ${f1io.B.in}, 6 + 3 = ${f1io.B.out}; C: 6 + 6 = ${f1io.C.in}, ${f1io.C.out}`, space: 'none' },
            { q: 'Find the outflow of <i>s</i> and the inflow of <i>t</i>.', a: 'Both 19', space: 'line' },
            { q: 'What is the value of this flow?', a: '19', space: 'line' },
          ],
        },
        {
          q: 'Each edge has the capacity and flow shown. Could this be part of a valid flow? Write yes or no.',
          parts: [
            { q: 'capacity 8, flow 5', a: 'yes', space: 'line' },
            { q: 'capacity 6, flow 7', a: 'no (more than the capacity)', space: 'line' },
            { q: 'capacity 4, flow 0', a: 'yes', space: 'line' },
            { q: 'capacity 10, flow 10', a: 'yes (the edge is full)', space: 'line' },
          ],
        },
        {
          q: 'Each diagram shows the flows into and out of one vertex X of a valid flow. Find <i>x</i>.',
          fig: figs(stars.map(([i, o], k) => [star(i, o), `(${'abc'[k]})`])),
          a: `(a) <i>x</i> = 7 + 5 − 4 = 8 &nbsp; (b) <i>x</i> = 9 − 3 − 2 = 4 &nbsp; (c) <i>x</i> = 12 + 5 − 6 − 1 = 10`, space: 'box:14',
        },
        {
          q: 'Two flows are shown on the same network. For each, decide whether it is a valid flow. If it is valid, give its value. If not, explain why.',
          fig: figs([[svg(V, { flows: Va }), 'Flow (a)'], [svg(V, { flows: Vb }), 'Flow (b)']]),
          parts: [
            { q: 'Flow (a)', a: 'Valid. Value = 8 + 5 = 13', space: 'lines:2' },
            { q: 'Flow (b)', a: 'Not valid: at A the inflow is 7 but the outflow is 3 + 5 = 8.', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'This flow is valid. Find <i>p</i>, <i>q</i>, <i>r</i> and the value of the flow, given that <i>u</i> = 12.', fig: svg(C5, { flows: C5show }), figSide: true,
          a: '<i>p</i> = 14 − 9 = 5; at D: 5 + 10 = 15 = <i>q</i> + 12, so <i>q</i> = 3; <i>r</i> = 9 + 3 = 12; value = 24', space: 'box:44',
        },
        {
          q: 'Ella says this flow is valid. Is she correct? Explain.', fig: svg(C6, { flows: C6f }), figSide: true,
          a: 'No. At Q the inflow is 15 but the outflow is 10 + 6 = 16, so the conservation rule is broken. (Every edge is within capacity.)', space: 'lines:4',
        },
        {
          q: 'Water flows through irrigation channels from a river pump (<i>s</i>) to a farm dam (<i>t</i>). Capacities and some flows are in litres per second (L/s). Complete the flow so that it is valid, then state how much water reaches the dam each second.', fig: svg(C7, { flows: C7show }),
          a: 'A→C = 32 − 10 = 22; C→<i>t</i> = 22 + 18 = 40; B→<i>t</i> = 28 + 10 − 18 = 20. 60 L/s reaches the dam.', space: 'lines:3',
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'Write a flow in the boxes that has a value of 14. Check both rules.', fig: svg(H8, { flows: Object.fromEntries(H8.e.map((x) => [x.key, ''])) }), figSide: true,
          a: `One answer: <i>s</i>→A 8, <i>s</i>→B 6, B→A 1, A→C 5, A→D 4, B→D 5, C→<i>t</i> 5, D→<i>t</i> 9`, space: 'none',
        },
        {
          q: 'Explain, in your own words, why the outflow of the source must always equal the inflow of the sink.',
          a: 'Every other vertex passes on exactly what it receives (inflow = outflow) and nothing can be stored or lost, so everything that leaves <i>s</i> must end up at <i>t</i>.', space: 'lines:3',
        },
        {
          q: 'Part of a valid flow is shown. The flows on B→C and B→<i>t</i> are <i>y</i> and <i>z</i>.', fig: svg(H10, { flows: H10show }), figSide: true,
          parts: [
            { q: 'Write an equation linking <i>y</i> and <i>z</i>.', a: '<i>y</i> + <i>z</i> = 10', space: 'line' },
            { q: 'Explain why <i>y</i> can be no more than 4.', a: 'C already receives 7 from A, and C→<i>t</i> can carry at most 11, so <i>y</i> ≤ 11 − 7 = 4.', space: 'lines:2' },
            { q: 'Find the smallest and largest possible values of <i>z</i>.', a: 'Smallest 6 (when <i>y</i> = 4), largest 10 (when <i>y</i> = 0)', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
