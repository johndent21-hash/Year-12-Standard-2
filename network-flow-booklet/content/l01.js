const { assert, N, en, ens, tbl, ul, figs } = require('./_h');
const { net, svg, capIO } = N;

// Key ideas picture
const K = net({ s: [20, 70], A: [120, 20], B: [120, 120], t: [220, 70] },
  [['s', 'A', 9], ['s', 'B', 6], ['A', 'B', 4], ['A', 't', 7], ['B', 't', 8]]);

// Worked examples
const W = net({ s: [20, 80], A: [130, 20], B: [130, 140], C: [240, 80], t: [350, 80] },
  [['s', 'A', 14], ['s', 'B', 10], ['A', 'C', 6, { side: -1, t: 0.4 }], ['B', 'C', 8], ['A', 't', 9, { t: 0.55 }], ['C', 't', 12]]);
const wio = capIO(W);
assert.deepStrictEqual([wio.A.out, wio.C.in, wio.C.out, wio.s.out, wio.t.in], [15, 14, 12, 24, 21]);

// Foundation network
const F = net({ s: [20, 80], A: [120, 20], B: [120, 140], C: [230, 20], t: [330, 80] },
  [['s', 'A', 8], ['s', 'B', 5], ['A', 'B', 3], ['A', 'C', 6], ['B', 'C', 2], ['B', 't', 7], ['C', 't', 9]]);
const fio = capIO(F);
assert.deepStrictEqual([fio.s.out, fio.t.in], [13, 16]);
assert.deepStrictEqual([fio.A.in, fio.A.out, fio.B.in, fio.B.out, fio.C.in, fio.C.out], [8, 9, 8, 9, 8, 9]);

// Water network context
const Wt = net({ s: [20, 70], P: [120, 20], Q: [120, 120], t: [220, 70] },
  [['s', 'P', 30], ['s', 'Q', 25], ['P', 'Q', 10], ['P', 't', 18], ['Q', 't', 32]]);

// Core network
const C = net({ s: [20, 100], A: [120, 20], B: [120, 100], Cc: [120, 180], D: [240, 50], E: [240, 150], t: [350, 100] },
  [['s', 'A', 10], ['s', 'B', 7], ['s', 'Cc', 4], ['A', 'D', 6], ['B', 'D', 5], ['B', 'E', 3], ['Cc', 'E', 6], ['D', 't', 9], ['E', 't', 12]]);
const cio = capIO(C);
assert.deepStrictEqual([cio.s.out, cio.t.in, cio.D.in, cio.D.out, cio.E.in, cio.E.out, cio.A.in, cio.A.out], [21, 21, 11, 9, 9, 12, 10, 6]);
const cLab = { vLabel: { Cc: 'C' } };

// Dead end
const X = net({ s: [20, 70], A: [120, 20], B: [120, 120], X: [230, 20], t: [230, 120] },
  [['s', 'A', 12], ['s', 'B', 9], ['A', 'X', 7], ['A', 'B', 4], ['B', 't', 15]]);

// Challenge: every path through M
const M = net({ s: [20, 90], A: [120, 30], B: [120, 150], M: [220, 90], Cv: [320, 30], D: [320, 150], t: [420, 90] },
  [['s', 'A', 9], ['s', 'B', 11], ['A', 'M', 7], ['B', 'M', 8], ['M', 'Cv', 6], ['M', 'D', 6], ['Cv', 't', 10], ['D', 't', 8]]);
const mio = capIO(M);
assert.deepStrictEqual([mio.s.out, mio.t.in, mio.M.in, mio.M.out], [20, 18, 15, 12]);
assert.strictEqual(N.maxFlow(M).value, 12);

module.exports = {
  n: 1,
  title: 'What is a flow network?',
  toc: 'Source, sink, capacity, inflow and outflow',
  content: ['Define and use network flow terminology including source, sink, outflow, inflow and cut', 'Prior knowledge: directed networks and weighted edges (Year 11 Networks, paths and trees)'],
  li: ['To understand how a directed, weighted network can model something flowing through a system', 'To learn the language of network flow: source, sink, capacity, inflow and outflow'],
  sc: ['identify the source and the sink of a flow network', 'state the capacity of an edge and explain what it means in context', 'find the total capacity of the edges into and out of a vertex', 'explain why a vertex can never pass on more than it can receive'],
  key: `<div class="kgrid"><div>
    <p>A <b>flow network</b> models something moving through a system: water in pipes, cars on roads, data through cables, people through gates.</p>
    ${ul([
      'It is a <b>directed</b> network. The arrows show which way things flow.',
      'It is <b>weighted</b>. The weight on an edge is its <b>capacity</b>: the most that can flow along that edge in a unit of time, e.g. litres per minute.',
      'The <b>source</b>, <i>s</i>, has only outgoing edges. The flow starts here.',
      'The <b>sink</b>, <i>t</i>, has only incoming edges. The flow ends here.',
      'The <b>inflow</b> of a vertex is the total flow arriving at it. The <b>outflow</b> is the total flow leaving it.',
    ])}
    <div class="note">Vertices other than <i>s</i> and <i>t</i> cannot store anything: what flows in must flow out. So the most that can pass through a vertex is the <b>smaller</b> of the total capacity in and the total capacity out.</div>
  </div><div class="kfig">${svg(K)}<div class="cap2">Total capacity into B: 6 + 4 = 10<br>Total capacity out of B: 8<br>At most 8 can pass through B.</div></div></div>`,
  examples: [
    {
      q: '<p>The network shows water pipes from a reservoir (<i>s</i>) to a town (<i>t</i>). Capacities are in kilolitres per hour (kL/h).</p>',
      fig: svg(W), figSide: true,
      sol: `${tbl(['Question', 'Answer and reason'], [
        ['Which vertex is the source? the sink?', '<i>s</i> is the source (only edges going out). <i>t</i> is the sink (only edges coming in).'],
        ['What is the capacity of A→C? What does it mean?', '6. At most 6 kL of water can flow through the pipe from A to C each hour.'],
        ['Total capacity of the edges leaving A', `${en('A>C')} and ${en('A>t')}: 6 + 9 = <b>15 kL/h</b>`],
        ['Total capacity into C and out of C', 'In: 6 + 8 = 14 kL/h. Out: 12 kL/h.'],
        ['What is the most that can flow through C?', 'The smaller of 14 and 12, so <b>12 kL/h</b>. C cannot store water, so it can only pass on 12.'],
      ])}`,
    },
    {
      q: '<p>For the same network, explain why no more than 21 kL/h of water can ever reach the town.</p>',
      sol: `<p>Total capacity leaving the source: 14 + 10 = 24 kL/h. Total capacity arriving at the sink: 9 + 12 = <b>21 kL/h</b>.</p>
        <p>All the water reaching the town must come along ${en('A>t')} or ${en('C>t')}, and together these can carry at most 21 kL/h. So at most 21 kL/h can reach the town, even though the reservoir could send out 24 kL/h.</p>
        <p class="small">This gives an <b>upper limit</b>. Whether 21 kL/h is actually possible needs the other edges to be checked. You will learn how to do that in Lessons 5 to 7.</p>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: 'Use this flow network.', fig: svg(F), figSide: true,
          parts: [
            { q: 'Which vertex is the source?', a: '<i>s</i>', space: 'line' },
            { q: 'Which vertex is the sink?', a: '<i>t</i>', space: 'line' },
            { q: 'What is the capacity of edge A→C?', a: '6', space: 'line' },
            { q: 'Name the two edges that leave A.', a: `${ens(['A>B', 'A>C'])}`, space: 'line' },
            { q: 'Name the two edges that arrive at C.', a: `${ens(['A>C', 'B>C'])}`, space: 'line' },
            { q: 'Find the total capacity of the edges leaving <i>s</i>.', a: '8 + 5 = 13', space: 'line' },
            { q: 'Find the total capacity of the edges arriving at <i>t</i>.', a: '7 + 9 = 16', space: 'line' },
          ],
        },
        {
          q: 'For the network in Question 1, complete the table.',
          fig: tbl(['Vertex', 'Edges in', 'Total capacity in', 'Edges out', 'Total capacity out'], [['A', '<i>s</i>→A', '8', '', ''], ['B', '', '', '', ''], ['C', '', '', '', '']], 'wide'),
          a: `A: out ${ens(['A>B', 'A>C'])}, 9. &nbsp;B: in ${ens(['s>B', 'A>B'])}, 8; out ${ens(['B>C', 'B>t'])}, 9. &nbsp;C: in ${ens(['A>C', 'B>C'])}, 8; out ${en('C>t')}, 9.`,
          space: 'none',
        },
        {
          q: 'Complete each sentence using a word from the box: <b>source · sink · capacity · inflow · outflow</b>',
          parts: [
            { q: 'The vertex where the flow ends is called the', a: 'sink', space: 'line' },
            { q: 'The most that can flow along an edge is its', a: 'capacity', space: 'line' },
            { q: 'The total flow leaving a vertex is its', a: 'outflow', space: 'line' },
            { q: 'The vertex with only outgoing edges is the', a: 'source', space: 'line' },
            { q: 'The total flow arriving at a vertex is its', a: 'inflow', space: 'line' },
          ],
        },
        {
          q: 'The network shows the water supply from a dam (<i>s</i>) to a town (<i>t</i>) through two treatment plants, P and Q. Capacities are in megalitres per day (ML/day).', fig: svg(Wt), figSide: true,
          parts: [
            { q: 'What does the 18 on edge P→<i>t</i> mean?', a: 'At most 18 ML of water per day can flow from plant P to the town.', space: 'lines:2' },
            { q: 'Find the total capacity into Q and out of Q.', a: 'In: 25 + 10 = 35 ML/day. Out: 32 ML/day.', space: 'line' },
            { q: 'What is the most that can flow through Q each day?', a: '32 ML/day (the smaller of 35 and 32)', space: 'line' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: 'Use this network. Capacities are in cars per minute.', fig: svg(C, cLab), figSide: true,
          parts: [
            { q: 'Find the total capacity leaving <i>s</i> and arriving at <i>t</i>.', a: 'Leaving <i>s</i>: 21. Arriving at <i>t</i>: 21.', space: 'line' },
            { q: 'Find the most that can flow through vertex D. Show working.', a: 'In: 6 + 5 = 11. Out: 9. At most 9 cars/min.', space: 'lines:2' },
            { q: 'Find the most that can flow through vertex E. Show working.', a: 'In: 3 + 6 = 9. Out: 12. At most 9 cars/min.', space: 'lines:2' },
            { q: 'Vertex A receives up to 10 cars per minute. Explain why edge <i>s</i>→A can never be full.', a: 'A can only pass on 6 (its one edge out, A→D, has capacity 6), and A cannot store cars, so at most 6 of the 10 can ever be used.', space: 'lines:2' },
          ],
        },
        {
          q: 'For the network in Question 5, Jake says: “Vertex C can pass on 6 cars per minute, because the edge leaving it has a capacity of 6.” Explain Jake’s mistake.',
          a: 'Only 4 cars per minute can arrive at C (edge <i>s</i>→C has capacity 4), so at most 4 can leave C, not 6.', space: 'lines:2',
        },
        {
          q: 'In this network, vertex X has edges coming in but none going out.', fig: svg(X), figSide: true,
          parts: [
            { q: 'Is X a sink for this flow network? Explain.', a: 'No. The flow goes to the one sink <i>t</i>; X is a dead end that the flow cannot leave.', space: 'lines:2' },
            { q: 'What is the most that can flow along A→X, if flow cannot be stored? Explain.', a: '0. Anything sent to X could not leave it, and vertices other than <i>s</i> and <i>t</i> cannot store flow.', space: 'lines:2' },
          ],
        },
        {
          q: 'Describe a real situation that could be modelled by a flow network. State what the source, the sink, the edges and the capacities represent, including units.',
          a: 'Sample: people leaving a stadium. Source: the stadium; sink: the train station; edges: walkways; capacities: people per minute each walkway can carry.', space: 'lines:3',
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'The network shows the flow of gas, in terajoules per day, from a gas field (<i>s</i>) to a city (<i>t</i>).', fig: svg(M, { vLabel: { Cv: 'C' } }),
          parts: [
            { q: 'Find the total capacity leaving the source and the total capacity arriving at the sink.', a: 'Leaving <i>s</i>: 20. Arriving at <i>t</i>: 18.', space: 'line' },
            { q: 'Explain why every unit of gas must pass through vertex M.', a: 'Every path from <i>s</i> to <i>t</i> goes through M: A and B only lead to M, and C and D can only be reached from M.', space: 'lines:2' },
            { q: 'Hence explain why no more than 12 terajoules per day can reach the city.', a: 'At most 15 can enter M but only 6 + 6 = 12 can leave it. All the gas passes through M, so at most 12 TJ/day can reach the city.', space: 'lines:3' },
          ],
        },
        {
          q: 'Draw a flow network with a source, a sink and three other vertices, and write capacities on the edges so that the total capacity leaving the source is 20, but no more than 8 can reach the sink.',
          a: 'Many answers. E.g. <i>s</i>→A 10, <i>s</i>→B 10, A→C 10, B→C 10, C→<i>t</i> 8 (everything must pass along C→<i>t</i>).', space: 'box:42',
        },
      ],
    },
  ],
};
