const { assert, N, en, ens, tbl, edgeTable, ul, ol, figs, satMethod, satTable } = require('./_h');
const { net, svg, autoCut, lineCut, cutValue, maxFlow, minCut, greedyRange, checkFlow, dotsOnly } = N;
const P = (s) => s.split('');
const sumText = (G, c) => `${c.fwd.map((k) => N.E(G, k).c).join(' + ')} = ${c.value}`;
const grp = (S) => `{${S.slice().sort((a, b) => (a === 's' ? -1 : b === 's' ? 1 : a < b ? -1 : 1)).map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}`;
const safe = (G) => { const m = maxFlow(G).value; assert.deepStrictEqual(greedyRange(G), { lo: m, hi: m }); return m; };
const small = (G, o = {}) => svg(G, { ...o, scale: 0.6 });
const V5 = { s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] };
const V6 = { s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] };
const V7 = { s: [20, 100], A: [130, 20], B: [130, 100], C: [130, 180], D: [260, 50], E: [260, 150], t: [370, 100] };

// Worked example 1: town water supply from a table
const W1 = net(V7, [['s', 'A', 25], ['s', 'B', 20], ['s', 'C', 15], ['A', 'B', 5], ['A', 'D', 18], ['B', 'D', 10], ['B', 'E', 12], ['C', 'E', 15], ['D', 't', 30], ['E', 't', 22]]);
assert.strictEqual(safe(W1), 50);
const w1 = satMethod(W1, [P('sADt'), P('sBDt'), P('sBEt'), P('sCEt')]);
assert.strictEqual(w1.total, 50);
const w1c = minCut(W1).cuts[0]; assert.strictEqual(w1c.value, 50); assert.strictEqual(minCut(W1).cuts.length, 1);

// Worked example 2: reading a maximum flow
const W2 = net(V5, [['s', 'A', 14], ['s', 'B', 11], ['A', 'C', 8], ['A', 't', 7], ['B', 'C', 9], ['C', 't', 12], ['B', 't', 4]]);
const W2f = { 's>A': 13, 's>B': 10, 'A>C': 6, 'A>t': 7, 'B>C': 6, 'C>t': 12, 'B>t': 4 };
assert(checkFlow(W2, W2f).ok); assert.strictEqual(checkFlow(W2, W2f).value, 23); assert.strictEqual(maxFlow(W2).value, 23);
const w2c = minCut(W2).cuts[0];

// Foundation 1: festival exit
const F1 = net(V5, [['s', 'A', 400], ['s', 'B', 300], ['A', 'C', 200], ['A', 't', 200], ['B', 'C', 150], ['C', 't', 380], ['B', 't', 120]]);
assert.strictEqual(safe(F1), 670);
const f1c = { cuts: [cutValue(F1, ['B'])] }; assert.strictEqual(f1c.cuts[0].value, 670);
// Foundation 2: deliveries from a table
const F2 = net(V6, [['s', 'A', 40], ['s', 'B', 35], ['A', 'C', 25], ['A', 'D', 20], ['B', 'A', 10], ['B', 'D', 30], ['C', 't', 30], ['D', 't', 40]]);
assert.strictEqual(safe(F2), 65);
const f2c = minCut(F2); assert.strictEqual(f2c.cuts.length, 1);
// Foundation 3: interpret a maximum flow
const F3 = net(V5, [['s', 'A', 12], ['s', 'B', 10], ['A', 'C', 7], ['A', 't', 6], ['B', 'C', 8], ['C', 't', 13], ['B', 'A', 3]]);
const F3f = { 's>A': 12, 's>B': 7, 'B>A': 1, 'A>C': 7, 'A>t': 6, 'B>C': 6, 'C>t': 13 };
assert(checkFlow(F3, F3f).ok); assert.strictEqual(checkFlow(F3, F3f).value, 19); assert.strictEqual(maxFlow(F3).value, 19);
const f3sat = F3.e.filter((x) => x.c === F3f[x.key]).map((x) => x.key);
assert.deepStrictEqual(f3sat, ['s>A', 'A>C', 'A>t', 'C>t']);

// Core 4
const C4 = net(V7, [['s', 'A', 16], ['s', 'B', 12], ['s', 'C', 10], ['A', 'B', 4], ['A', 'D', 11], ['B', 'D', 7], ['B', 'E', 8], ['C', 'E', 9], ['D', 'E', 3], ['D', 't', 15], ['E', 't', 14]]);
assert.strictEqual(safe(C4), 29);
const c4c = minCut(C4); assert.strictEqual(c4c.cuts.length, 1);
// Core 5: two-way roads, vehicles per hour
const C5 = net({ s: [20, 80], A: [140, 20], B: [140, 140], C: [260, 80], t: [380, 80] },
  [['s', 'A', 800], ['s', 'B', 600], ['A', 'B', 300, { bend: 20 }], ['B', 'A', 200, { bend: 20 }], ['A', 'C', 500], ['B', 'C', 400], ['A', 't', 250], ['C', 't', 850], ['B', 't', 150]]);
const c5m = maxFlow(C5).value; const c5c = minCut(C5);
assert.strictEqual(c5m, 1250);
// Core 6: data network from a description
const C6 = net(V6, [['s', 'A', 100], ['s', 'B', 80], ['A', 'C', 60], ['A', 'D', 50], ['B', 'D', 70], ['C', 't', 90], ['D', 't', 100], ['D', 'C', 20]]);
const c6m = safe(C6); const c6c = minCut(C6);

// Challenge 7: 8 vertices
const H7 = net({ s: [20, 100], A: [130, 20], B: [130, 180], C: [240, 20], D: [240, 100], E: [240, 180], F: [350, 60], t: [460, 100] },
  [['s', 'A', 20], ['s', 'B', 18], ['A', 'C', 12], ['A', 'D', 9], ['B', 'D', 7], ['B', 'E', 13], ['C', 'F', 10], ['D', 'F', 8], ['D', 'E', 5], ['C', 't', 6], ['F', 't', 16], ['E', 't', 15]]);
const h7 = minCut(H7); assert.strictEqual(h7.value, 35); assert.strictEqual(maxFlow(H7).value, 35); assert.strictEqual(h7.cuts.length, 1);
// Challenge 8: two different maximum flows
const H8 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] }, [['s', 'A', 10], ['s', 'B', 8], ['A', 'B', 4], ['A', 't', 7], ['B', 't', 9]]);
const H8a = { 's>A': 9, 's>B': 7, 'A>B': 2, 'A>t': 7, 'B>t': 9 };
const H8b = { 's>A': 8, 's>B': 8, 'A>B': 1, 'A>t': 7, 'B>t': 9 };
[H8a, H8b].forEach((f) => { assert(checkFlow(H8, f).ok); assert.strictEqual(checkFlow(H8, f).value, 16); });
assert.strictEqual(maxFlow(H8).value, 16);

module.exports = {
  n: 8,
  title: 'Solving network flow problems',
  toc: 'Larger networks and problems in context',
  content: ['Solve small-scale network flow problems including the use of the maximum-flow minimum-cut theorem', 'Convert information presented in a table to a weighted and directed network diagram'],
  li: ['To solve network flow problems in real contexts from start to finish', 'To interpret a maximum flow: saturated edges, spare capacity and bottlenecks'],
  sc: ['draw the network from a table or description', 'find the flow capacity and confirm it with a cut', 'describe the bottleneck in the context of the problem', 'read the spare capacity on each edge of a maximum flow'],
  key: `<p><b>A process for any network flow problem</b></p>
    ${ol(['<b>Understand the context.</b> What are the source, the sink, the edges and the units?', '<b>Draw the network</b> (if it is in a table or description). Show two-way connections as two edges.', '<b>Find a flow</b> using the saturated edges method.', '<b>Find a cut</b> with the same capacity. This proves the flow is a maximum.', '<b>Answer in context</b>, with units. The edges of the minimum cut are the bottleneck.'])}
    <div class="note">The maximum flow <b>value</b> is unique, but the flows on the individual edges often are not. Edges of the minimum cut are saturated in every maximum flow.</div>`,
  examples: [
    {
      q: `<p>Water is pumped from a treatment plant (<i>s</i>) through pumping stations A to E to a town reservoir (<i>t</i>). Capacities are in megalitres per day (ML/day). Find the maximum amount of water that can reach the reservoir each day, and the pipes that limit it.</p>`,
      fig: edgeTable(W1, 'Capacity (ML/day)').replace('<table class="t ">', '<table class="t" style="font-size:8pt">'), figSide: true,
      sol: `<div class="side"><div class="sfig">${svg(W1, { flows: w1.flow, sat: w1.sat, cuts: [autoCut(W1, w1c.S.filter((v) => v !== 's'), '')], scale: 0.9 })}</div><div class="sbody">${satTable(w1, false)}
        ${ul([`Cut ${grp(w1c.S)} | {D, <i>t</i>}: ${ens(w1c.fwd)}, ${sumText(W1, w1c)} ML/day.`, 'Flow = cut = 50, so the maximum is <b>50 ML/day</b>.', `The limiting pipes are ${ens(w1c.fwd)}.`])}</div></div>`,
    },
    {
      q: '<p>A maximum flow is shown. (a) Which edges are saturated? (b) How much spare capacity is there on <i>s</i>→A? (c) Explain why increasing the capacity of <i>s</i>→A would not increase the flow.</p>', fig: svg(W2, { flows: W2f }), figSide: true,
      sol: `${ul([`(a) Flow = capacity on ${ens(W2.e.filter((x) => x.c === W2f[x.key]).map((x) => x.key))}.`, '(b) 14 − 13 = <b>1</b>.', `(c) The minimum cut is ${ens(w2c.fwd)} (${sumText(W2, w2c)}). <i>s</i>→A is not in it, and every unit of flow must still cross these three full edges into <i>t</i>, so extra capacity on <i>s</i>→A cannot be used.`])}`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'At the end of a music festival, people walk from the arena (<i>s</i>) to the bus terminal (<i>t</i>). Capacities are in people per minute.', fig: svg(F1), figSide: true,
          parts: [
            { q: 'Use the saturated edges method to find a flow through the network.', a: '670 people per minute, e.g. <i>s</i>–A–<i>t</i> 200, <i>s</i>–A–C–<i>t</i> 200, <i>s</i>–B–C–<i>t</i> 150, <i>s</i>–B–<i>t</i> 120', space: 'box:24' },
            { q: `Find the capacity of the cut ${grp(f1c.cuts[0].S)} | {${N.names(F1).filter((v) => !f1c.cuts[0].S.includes(v)).map((v) => (v === 't' ? '<i>t</i>' : v)).join(', ')}}.`, a: `${ens(f1c.cuts[0].fwd)}: ${sumText(F1, f1c.cuts[0])}`, space: 'line' },
            { q: 'How many people per minute can reach the bus terminal?', a: '670 people per minute', space: 'line' },
          ],
        },
        {
          q: 'A courier sends parcels from a warehouse (<i>s</i>) through depots A to D to a city sorting centre (<i>t</i>). The vertices are drawn for you. Capacities are in parcels per hour.',
          fig: `<div class="side" style="align-items:center"><div class="sfig">${edgeTable(F2, 'Parcels/h')}</div><div class="sbody" style="text-align:center">${dotsOnly(F2)}</div></div>`,
          parts: [
            { q: 'Draw the edges and capacities on the diagram.', a: small(F2), space: 'none' },
            { q: 'Find the maximum number of parcels per hour that can reach the sorting centre. Confirm your answer with a cut.', a: `65 parcels per hour. Cut ${grp(f2c.cuts[0].S)}: ${ens(f2c.cuts[0].fwd)}, ${sumText(F2, f2c.cuts[0])}`, space: 'box:34' },
          ],
        },
        {
          q: 'This is a maximum flow for the network.', fig: svg(F3, { flows: F3f }), figSide: true,
          parts: [
            { q: 'What is the flow capacity?', a: '12 + 7 = 19', space: 'line' },
            { q: 'Name the saturated edges.', a: ens(f3sat), space: 'line' },
            { q: 'Which edge has the most spare capacity? How much?', a: '<i>s</i>→B: 10 − 7 = 3', space: 'line' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'Find the flow capacity of this network. Prove your answer with a cut, and name the bottleneck edges.', fig: svg(C4),
          a: `29. Cut ${grp(c4c.cuts[0].S)} | {<i>t</i>}: ${ens(c4c.cuts[0].fwd)}, ${sumText(C4, c4c.cuts[0])}. Bottleneck: ${ens(c4c.cuts[0].fwd)}.`, space: 'box:40',
        },
        {
          q: 'The network shows roads from a sports ground (<i>s</i>) to a motorway (<i>t</i>) after a game, in vehicles per hour. The road between A and B is two-way.', fig: svg(C5),
          parts: [
            { q: 'Find the maximum number of vehicles per hour that can reach the motorway.', a: `${c5m} vehicles per hour`, space: 'box:22' },
            { q: 'Give a cut that proves your answer.', a: `${grp(c5c.cuts[0].S)}: ${ens(c5c.cuts[0].fwd)}, ${sumText(C5, c5c.cuts[0])}`, space: 'lines:2' },
            { q: 'Does the two-way road A–B carry any traffic in your maximum flow? Explain whether it is needed.', a: 'Answers vary. E.g. A→<i>t</i> 250, A→C 500, B→<i>t</i> 150, B→C 350, C→<i>t</i> 850, with 0 on A–B. The bottleneck is the three roads into <i>t</i>, and they can be filled without using A–B, so it is not needed for the maximum flow.', space: 'lines:3' },
          ],
        },
        {
          q: 'A school network sends data from the server room (<i>s</i>) to the library (<i>t</i>). Cables run: <i>s</i> to A (100 Mbps), <i>s</i> to B (80), A to C (60), A to D (50), B to D (70), D to C (20), C to <i>t</i> (90), D to <i>t</i> (100). Draw the network and find the maximum data rate to the library.',
          a: `${small(C6)}<br>${c6m} Mbps. Cut ${grp(c6c.cuts[0].S)}: ${ens(c6c.cuts[0].fwd)}, ${sumText(C6, c6c.cuts[0])}`, space: 'box:48',
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'Find the flow capacity of this network. You must show a flow and a cut with the same value.', fig: svg(H7),
          a: `35. Cut ${grp(h7.cuts[0].S)}: ${ens(h7.cuts[0].fwd)}, ${sumText(H7, h7.cuts[0])}`, space: 'box:40',
        },
        {
          q: 'The flow capacity of this network is 16.', fig: svg(H8), figSide: true,
          parts: [
            { q: 'Find two different maximum flows. Write the flow on every edge for each.', a: 'e.g. <i>s</i>→A 9, <i>s</i>→B 7, A→B 2, A→<i>t</i> 7, B→<i>t</i> 9; and <i>s</i>→A 8, <i>s</i>→B 8, A→B 1, A→<i>t</i> 7, B→<i>t</i> 9', space: 'lines:3' },
            { q: 'Which edges carry the same flow in every maximum flow? Explain using the minimum cut.', a: 'A→<i>t</i> (7) and B→<i>t</i> (9). They form the minimum cut (7 + 9 = 16), so they must be full in every maximum flow.', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
