const { assert, N, en, ens, tbl, ul, ol, figs } = require('./_h');
const { net, svg, allCuts, cutValue, maxFlow, minCut, greedyRange } = N;
const mod = (G, ch) => ({ ...G, e: G.e.map((x) => (ch[x.key] !== undefined ? { ...x, c: ch[x.key] } : x)) });
const mf = (G, ch = {}) => maxFlow(mod(G, ch)).value;
const up = (G, d) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, N.E(G, k).c + v]));
const grp = (S) => `{${S.slice().sort((a, b) => (a === 's' ? -1 : b === 's' ? 1 : a < b ? -1 : 1)).map((v) => (v === 's' ? '<i>s</i>' : v)).join(', ')}}`;
const sumText = (G, c) => `${c.fwd.map((k) => N.E(G, k).c).join(' + ')} = ${c.value}`;
const safe = (G) => { const m = maxFlow(G).value; assert.deepStrictEqual(greedyRange(G), { lo: m, hi: m }); return m; };
const V4 = { s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] };
const V5 = { s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] };
const V6 = { s: [20, 90], A: [130, 20], B: [130, 160], C: [240, 20], D: [240, 160], t: [350, 90] };

// Worked example 1: peak hour
const W1 = net(V6, [['s', 'A', 30], ['s', 'B', 25], ['A', 'C', 18], ['A', 'D', 10], ['B', 'A', 5], ['B', 'D', 20], ['C', 't', 22], ['D', 't', 28]]);
assert.strictEqual(safe(W1), 46); const w1c = minCut(W1).cuts; assert.strictEqual(w1c.length, 1);
assert.strictEqual(46 * 60, 2760); assert.strictEqual(3000 / 60, 50);
assert.strictEqual(mf(W1, up(W1, { 'A>C': 4 })), 50); assert.strictEqual(mf(W1, up(W1, { 'A>C': 3 })), 49); assert.strictEqual(mf(W1, up(W1, { 'D>t': 4 })), 48);
// Worked example 2: evacuation
const W2 = net(V5, [['s', 'A', 300], ['s', 'B', 250], ['A', 'C', 180], ['A', 't', 150], ['B', 'C', 120], ['C', 't', 260], ['B', 't', 100]]);
const w2 = minCut(W2); assert.strictEqual(w2.value, 510); assert.strictEqual(w2.cuts.length, 1);
const w2t = 12000 / 510; assert(w2t > 23.5 && w2t < 23.6);

// Foundation 3
const F3 = net(V4, [['s', 'A', 12], ['s', 'B', 9], ['A', 'B', 2], ['A', 't', 10], ['B', 't', 8]]);
assert.strictEqual(safe(F3), 18);
// Core 4: town water
const C4 = net(V5, [['s', 'A', 9], ['s', 'B', 8], ['A', 'C', 5], ['A', 't', 4], ['B', 'C', 6], ['C', 't', 8], ['B', 't', 2]]);
const c4 = safe(C4); const c4c = minCut(C4).cuts;
const demand4 = 42000 * 250 / 1e6; assert.strictEqual(demand4, 10.5);
assert.strictEqual(c4, 14);
const demand4b = 60000 * 250 / 1e6; assert.strictEqual(demand4b, 15);
// Core 5: stadium evacuation
const C5 = net(V6, [['s', 'A', 600], ['s', 'B', 500], ['A', 'C', 350], ['A', 'D', 200], ['B', 'D', 400], ['C', 't', 450], ['D', 't', 500], ['B', 'A', 100]]);
const c5 = safe(C5); const c5c = minCut(C5).cuts;
assert.strictEqual(c5, 850);
const c5t = 25000 / c5; assert(c5t > 29.4 && c5t < 29.5); // about 29.4 min: just within 30 min
// Challenge 6: least upgrade to meet demand 60
const H6 = net(V6, [['s', 'A', 40], ['s', 'B', 30], ['A', 'C', 25], ['A', 'D', 12], ['B', 'A', 6], ['B', 'D', 22], ['C', 't', 28], ['D', 't', 30]]);
assert.strictEqual(safe(H6), 55);
assert.strictEqual(mf(H6, up(H6, { 'A>C': 5 })), 58); assert.strictEqual(mf(H6, up(H6, { 'D>t': 5 })), 59);
assert.strictEqual(mf(H6, up(H6, { 'A>C': 3, 'D>t': 2 })), 60);
{ const ks = H6.e.map((x) => x.key); let ok4 = false; const rec = (i, d, tot) => { if (tot > 4 || ok4) return; if (i === ks.length) { if (mf(H6, up(H6, d)) >= 60) ok4 = true; return; } for (let k = 0; k <= 4; k++) { d[ks[i]] = k; rec(i + 1, d, tot + k); } delete d[ks[i]]; }; rec(0, {}, 0); assert(!ok4); }
const h6low = allCuts(H6).filter((c) => c.value < 60).sort((a, b) => a.value - b.value);
// Challenge 7: growing demand
const yrs = (() => { let d = 2400; let n = 0; while (d <= 2760) { d *= 1.06; n++; } return n; })();
assert.strictEqual(yrs, 3); assert(2400 * 1.06 ** 2 < 2760 && 2400 * 1.06 ** 3 > 2760);

module.exports = {
  n: 10,
  title: 'Can the network meet demand?',
  toc: 'Comparing flow capacity with demand; review',
  content: ['Explain why the flow capacity of a network is or is not sufficient to meet demand in a variety of contexts', 'Examine the impact of increasing or reducing the flow capacity of an edge in a network diagram'],
  li: ['To decide whether a network can meet a demand, and explain why', 'To recommend changes to a network that cannot meet demand'],
  sc: ['compare a demand with the flow capacity, using the same units', 'calculate a shortfall or the time needed to move a total amount', 'explain my decision using the minimum cut', 'recommend an upgrade and check that it works'],
  key: `${ul(['The <b>demand</b> is how much needs to get through the network, e.g. vehicles per hour in peak hour.',
    'The network can meet the demand only if <b>demand ≤ flow capacity</b> (the minimum cut).',
    'If the demand is more than the flow capacity, the <b>shortfall</b> is demand − flow capacity. To fix it, edges in the minimum cut must be upgraded (Lesson 9).',
    '<b>Units must match.</b> Convert first, e.g. 45 vehicles per minute = 45 × 60 = 2700 vehicles per hour.',
    'To move a <b>total</b> amount: time = total amount ÷ flow capacity.'])}
    <div class="note"><b>Writing your answer:</b> state the flow capacity (with the cut that proves it), compare it with the demand in the same units, then give a clear conclusion in context.</div>`,
  examples: [
    {
      q: '<p>The network shows roads into a city centre (<i>t</i>) from a suburb (<i>s</i>), in vehicles per minute. In peak hour, 3000 vehicles need to make this trip. (a) Can the network meet the demand? Explain. (b) Which road should be upgraded, and by how much?</p>', fig: svg(W1), figSide: true,
      sol: `${ul([`Flow capacity: the minimum cut is ${ens(w1c[0].fwd)}, ${sumText(W1, w1c[0])} vehicles per minute (a flow of 46 can be found with the saturated edges method).`,
        'Same units: demand = 3000 ÷ 60 = <b>50 vehicles per minute</b>. (Or capacity = 46 × 60 = 2760 vehicles per hour.)',
        '(a) <b>No.</b> 50 > 46, so the network cannot meet the demand. Shortfall = 4 vehicles per minute (240 vehicles in the hour).',
        '(b) Upgrade a road in the minimum cut. Increasing A→C by 4 (to 22) raises that cut to 50, and every other cut is at least 50, so the flow capacity becomes 50 ✓. Increasing D→<i>t</i> by 4 would only give 48, because the cut {<i>s</i>, A, B} (A→C, A→D, B→D = 48) then becomes the minimum.'])}`,
    },
    {
      q: '<p>A town of 12 000 people is being evacuated along these roads to a safe area. Capacities are in people per minute. How long will it take, at best, to evacuate the town?</p>', fig: svg(W2), figSide: true,
      sol: `${ul([`Minimum cut: ${ens(w2.cuts[0].fwd)}, ${sumText(W2, w2.cuts[0])} people per minute.`, 'Time = 12 000 ÷ 510 = 23.5… minutes.', 'At best it takes about <b>24 minutes</b>. (In practice it would take longer: the network will not run at full capacity all the time.)'])}`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'A network has a flow capacity of 35 cars per minute. Can it meet each demand? Write yes or no.',
          parts: [
            { q: '30 cars per minute', a: 'yes', space: 'line' },
            { q: '40 cars per minute', a: 'no (shortfall 5 cars per minute)', space: 'line' },
            { q: '1800 cars per hour', a: 'yes (30 cars per minute)', space: 'line' },
            { q: '2400 cars per hour', a: 'no (40 cars per minute)', space: 'line' },
          ],
        },
        {
          q: 'Convert each flow capacity to the units given.',
          parts: [
            { q: '45 vehicles per minute = ______ vehicles per hour', a: '2700', space: 'none' },
            { q: '12 L per second = ______ L per minute', a: '720', space: 'none' },
            { q: '7200 people per hour = ______ people per minute', a: '120', space: 'none' },
          ],
        },
        {
          q: 'The network shows the flow of passengers, in people per minute, from an airport check-in hall (<i>s</i>) through security screening to the departure gates (<i>t</i>).', fig: svg(F3), figSide: true,
          parts: [
            { q: 'Find the flow capacity of the network.', a: '18 people per minute (cut A→<i>t</i>, B→<i>t</i>: 10 + 8)', space: 'lines:2' },
            { q: 'In the morning rush, 1200 passengers per hour arrive. Can the network cope? Explain.', a: 'No. 1200 per hour = 1200 ÷ 60 = 20 per minute, which is more than the 18 per minute that can get through.', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'The network shows a town’s water supply from a dam (<i>s</i>) to the town reservoir (<i>t</i>). Capacities are in megalitres per day (1 ML = 1 000 000 L). Each person uses about 250 L of water a day.', fig: svg(C4), figSide: true,
          parts: [
            { q: 'Find the flow capacity of the network.', a: `14 ML/day (cut ${grp(c4c[0].S)}: ${ens(c4c[0].fwd)}, ${sumText(C4, c4c[0])})`, space: 'lines:2' },
            { q: 'The town has 42 000 people. Can the network meet the demand? Explain.', a: 'Demand = 42 000 × 250 = 10 500 000 L = 10.5 ML/day ≤ 14 ML/day, so yes.', space: 'lines:2' },
            { q: 'The town is expected to grow to 60 000 people. Will the network still meet demand?', a: 'Demand = 15 ML/day > 14 ML/day, so no. The shortfall is 1 ML/day; a pipe in the minimum cut needs upgrading.', space: 'lines:2' },
          ],
        },
        {
          q: 'A stadium holding 25 000 people must be able to empty in 30 minutes. The network shows the exit routes from the stands (<i>s</i>) to the street (<i>t</i>), in people per minute.', fig: svg(C5), figSide: true,
          parts: [
            { q: 'Find the flow capacity of the exit network.', a: `${c5} people per minute (cut ${grp(c5c[0].S)}: ${sumText(C5, c5c[0])})`, space: 'lines:2' },
            { q: 'Can the stadium be emptied in 30 minutes? Justify your answer.', a: '25 000 ÷ 850 ≈ 29.4 minutes < 30, so yes, but only just (and only if every exit runs at full capacity). Or: 850 × 30 = 25 500 ≥ 25 000.', space: 'lines:2' },
            { q: 'Give one reason why the real time might be longer.', a: 'e.g. people do not spread evenly across the exits, crowds slow down, some exits may be blocked', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'A road network has a flow capacity of 55 vehicles per minute, but the peak demand is 60 vehicles per minute. Roads can be upgraded in whole units of 1 vehicle per minute.', fig: svg(H6), figSide: true,
          parts: [
            { q: 'List all cuts with capacity less than 60.', a: h6low.map((c) => `${grp(c.S)}: ${c.value}`).join('; '), space: 'lines:2' },
            { q: 'Show that upgrading only one road cannot meet the demand.', a: 'The 55 cut (A→C, D→<i>t</i>) needs +5. A→C +5 leaves the cut C→<i>t</i>, D→<i>t</i> at 58; D→<i>t</i> +5 leaves the cut A→C, A→D, B→D at 59.', space: 'lines:2' },
            { q: 'Find the least total upgrade that meets the demand.', a: '5 units, e.g. A→C +3 and D→<i>t</i> +2 (any split with A→C at least +1 and D→<i>t</i> at least +2)', space: 'lines:2' },
          ],
        },
        {
          q: 'The network in Worked example 1 can carry 2760 vehicles per hour. This year the peak-hour demand is 2400 vehicles, and it is growing by 6% each year. After how many years will the network no longer meet the demand? Show your working.',
          a: '2400 × 1.06² ≈ 2697 (still OK); 2400 × 1.06³ ≈ 2858 > 2760. After 3 years.', space: 'lines:3',
        },
        {
          q: 'A planner says: “The roads leaving the suburb can carry 3500 vehicles per hour, which is more than the demand of 3000, so there will be no traffic problem.” Explain why this reasoning is not enough.',
          a: 'The capacity leaving the source is only one cut. The flow capacity is the minimum cut, which may be much smaller somewhere else in the network (e.g. the roads into the city). You need the minimum cut, not just the roads out of the source.', space: 'lines:3',
        },
      ],
    },
  ],
};
