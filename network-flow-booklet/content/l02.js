const { assert, N, en, ens, tbl, edgeTable, ol, ul } = require('./_h');
const { net, svg, dotsOnly } = N;

const matrix = (G, order, blank = false) => tbl(['From \\ To', ...order.filter((v) => v !== G.s)],
  order.filter((v) => v !== G.t).map((a) => [`<b>${a}</b>`, ...order.filter((v) => v !== G.s).map((b) => {
    const x = G.e.find((y) => y.u === a && y.v === b); return blank ? '' : (x ? x.c : '–');
  })]), 'wide');
const small = (G, o = {}) => svg(G, { ...o, scale: 0.62 });

// Worked example 1 (table to diagram)
const W1 = net({ s: [20, 90], A: [130, 20], B: [130, 90], C: [130, 160], t: [240, 90] },
  [['s', 'A', 20], ['s', 'B', 15], ['s', 'C', 12], ['A', 't', 10], ['A', 'B', 8], ['B', 't', 18], ['C', 't', 14]]);
// Worked example 2 (diagram to matrix)
const W2 = net({ s: [20, 80], P: [120, 20], Q: [120, 140], R: [230, 80], t: [330, 80] },
  [['s', 'P', 7], ['s', 'Q', 9], ['P', 'R', 4], ['Q', 'P', 3], ['Q', 'R', 6], ['P', 't', 5], ['R', 't', 10]]);

// Foundation
const F1 = net({ s: [20, 80], A: [120, 20], B: [120, 140], C: [230, 80], t: [330, 80] },
  [['s', 'A', 9], ['s', 'B', 6], ['A', 'B', 3], ['A', 'C', 5], ['B', 'C', 7], ['A', 't', 4], ['C', 't', 11]]);
const F2 = net({ s: [20, 80], D: [120, 20], E: [120, 140], F: [230, 20], t: [330, 80] },
  [['s', 'D', 16], ['s', 'E', 12], ['D', 'F', 10], ['E', 'D', 5], ['E', 't', 9], ['F', 't', 14], ['D', 't', 4]]);
const F3 = net({ s: [0, 0], A: [0, 0], B: [0, 0], C: [0, 0], t: [0, 0] },
  [['s', 'A', 25], ['s', 'B', 30], ['A', 'C', 15], ['B', 'A', 10], ['B', 't', 20], ['C', 't', 35], ['A', 't', 12]]);

// Core
const C1 = net({ s: [20, 90], R1: [130, 20], R2: [130, 160], R3: [240, 90], t: [350, 90] },
  [['s', 'R1', 100], ['s', 'R2', 80], ['R1', 'R3', 60], ['R2', 'R3', 50], ['R1', 't', 40], ['R2', 't', 30], ['R3', 't', 90]]);
const C2 = net({ s: [20, 90], J: [130, 20], K: [130, 160], L: [240, 90], t: [350, 90] },
  [['s', 'J', 14], ['s', 'K', 11], ['J', 'L', 6], ['K', 'L', 8], ['J', 't', 9], ['L', 't', 13], ['K', 'J', 2]]);
const C3 = net({ s: [20, 80], A: [130, 20], B: [130, 140], t: [240, 80] },
  [['s', 'A', 900], ['s', 'B', 700], ['A', 'B', 600, { bend: 20 }], ['B', 'A', 400, { bend: 20 }], ['A', 't', 800], ['B', 't', 1000]]);

// Challenge: spot the errors
const T7 = net({ s: [20, 80], M: [120, 20], N: [120, 140], P: [230, 80], t: [330, 80] },
  [['s', 'M', 18], ['s', 'N', 14], ['M', 'P', 9], ['N', 'P', 10], ['M', 'N', 5], ['M', 't', 7], ['P', 't', 16]]);
const T7wrong = net({ s: [20, 80], M: [120, 20], N: [120, 140], P: [230, 80], t: [330, 80] },
  [['s', 'M', 18], ['s', 'N', 14], ['M', 'P', 9], ['N', 'P', 16], ['N', 'M', 5], ['M', 't', 7], ['P', 't', 10]]);
// Challenge: mixed units (L/h and L/min -> L/min)
const U = [['s', 'A', '1800 L/h', 30], ['s', 'B', '25 L/min', 25], ['A', 'B', '600 L/h', 10], ['A', 't', '50 L/min', 50], ['B', 't', '2700 L/h', 45]];
U.forEach(([, , txt, v]) => { const m = txt.match(/(\d+) L\/(h|min)/); assert.strictEqual(m[2] === 'h' ? +m[1] / 60 : +m[1], v); });
const Ug = net({ s: [20, 80], A: [120, 20], B: [120, 140], t: [220, 80] }, U.map(([a, b, , v]) => [a, b, v]));

module.exports = {
  n: 2,
  title: 'Tables and network diagrams',
  toc: 'Convert between tables and weighted, directed network diagrams',
  content: ['Convert information presented in a table to a weighted and directed network diagram', 'Define and use network flow terminology including source, sink, outflow, inflow and cut'],
  li: ['To draw a weighted, directed network diagram from a table', 'To write the information in a network diagram as a table'],
  sc: ['draw a flow network from a From/To/Capacity table', 'read a from–to table (matrix) and draw the network', 'write a table from a network diagram', 'show a two-way connection as two directed edges'],
  key: `<p>Flow information is often given in a table. There are two common layouts.</p>
    <div class="kgrid" style="grid-template-columns: auto 1fr; align-items:start"><div>${tbl(['From', 'To', 'Capacity'], [['<i>s</i>', 'A', 7], ['A', '<i>t</i>', 5], ['…', '…', '…']])}</div>
    <div>${ul(['<b>List layout:</b> one row for each edge. Draw an arrow <b>from</b> the first vertex <b>to</b> the second and write the capacity beside it.',
      '<b>From–to table (matrix):</b> rows are “from”, columns are “to”. The number in row A, column B is the capacity of A→B. A dash (–) means there is no edge.'])}</div></div>
    <p style="margin-top:1mm"><b>Steps for drawing the network</b></p>
    ${ol(['Find every vertex. Put the source <i>s</i> on the left and the sink <i>t</i> on the right, with the others in between.', 'Draw each edge as an arrow pointing in the direction of flow. Write the capacity beside it.', 'Check: the number of arrows matches the number of rows (or numbers in the matrix), <i>s</i> has only arrows out and <i>t</i> has only arrows in.'])}
    <div class="note">A two-way road or pipe is drawn as <b>two</b> directed edges, one each way. Each direction can have a different capacity.</div>`,
  examples: [
    {
      q: `<p>Water flows from a main dam (<i>s</i>) to three smaller dams (A, B and C), which supply a town (<i>t</i>). Capacities are in thousands of litres per minute. Draw the network.</p>${edgeTable(W1)}`,
      sol: `<div class="side"><div class="sfig">${svg(W1)}</div><div class="sbody">${ul(['Vertices: <i>s</i>, A, B, C, <i>t</i>. Put <i>s</i> on the left and <i>t</i> on the right.', 'Draw the 7 edges as arrows, e.g. the row “A, B, 8” is an arrow from A to B labelled 8.', 'Check: 7 rows and 7 arrows. <i>s</i> has only arrows out; <i>t</i> has only arrows in.'])}</div></div>`,
    },
    {
      q: '<p>Write the information in this network as a from–to table.</p>', fig: svg(W2), figSide: true,
      sol: `<div class="side"><div class="sfig">${matrix(W2, ['s', 'P', 'Q', 'R', 't'])}</div><div class="sbody">${ul(['Rows are “from” and columns are “to”, so the <i>s</i> column and the <i>t</i> row are left out.', `Q→P has capacity 3, so the 3 goes in row Q, column P. There is no edge P→Q, so row P, column Q has a dash.`, 'Check: 7 edges and 7 numbers.'])}</div></div>`,
    },
  ],
  levels: [
    {
      name: 'Foundation',
      qs: [
        {
          q: `The vertices of a network are drawn for you. Use the table to draw the edges and write the capacities.`,
          fig: `<div class="side" style="align-items:center"><div class="sfig">${edgeTable(F1)}</div><div class="sbody" style="text-align:center">${dotsOnly(F1, { scale: 1.15 })}</div></div>`,
          a: small(F1), space: 'none',
        },
        {
          q: `Complete the table for this network. One row has been done for you.${tbl(['From', 'To', 'Capacity'], [['<i>s</i>', 'D', 16], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']])}`, fig: svg(F2), figSide: true,
          a: `<i>s</i>→E 12, D→F 10, E→D 5, E→<i>t</i> 9, F→<i>t</i> 14, D→<i>t</i> 4 (any order)`, space: 'none',
        },
        {
          q: `Use this from–to table.`, fig: matrix(F3, ['s', 'A', 'B', 'C', 't']), figSide: true,
          parts: [
            { q: 'What is the capacity of B→<i>t</i>?', a: '20', space: 'line' },
            { q: 'Name all the edges that leave A.', a: `${ens(['A>C', 'A>t'])}`, space: 'line' },
            { q: 'Is there an edge from A to B? Explain.', a: 'No. Row A, column B has a dash. (There is an edge B→A.)', space: 'line' },
            { q: 'How many edges does the network have?', a: '7', space: 'line' },
            { q: 'Draw the network.', a: small({ ...F3, v: { s: [20, 80], A: [120, 20], B: [120, 140], C: [230, 20], t: [330, 80] } }), space: 'box:40' },
          ],
        },
      ],
    },
    {
      name: 'Core',
      qs: [
        {
          q: `A school computer network sends data from the internet connection (<i>s</i>) through three routers to the library (<i>t</i>). Capacities are in megabits per second (Mbps). Draw the network.`,
          fig: `<div class="side" style="align-items:flex-start"><div class="sfig">${edgeTable(C1, 'Capacity (Mbps)')}</div><div class="sbody"><div class="wbox" style="height:44mm;margin-top:0"></div></div></div>`,
          a: small(C1), space: 'none',
        },
        {
          q: `Write the information in this network as a from–to table. Use a dash (–) where there is no edge.${matrix(C2, ['s', 'J', 'K', 'L', 't'], true)}`, fig: svg(C2), figSide: true,
          a: 'Row <i>s</i>: J 14, K 11. Row J: L 6, <i>t</i> 9. Row K: J 2, L 8. Row L: <i>t</i> 13. All other cells –.', space: 'none',
        },
        {
          q: 'Traffic flows from a shopping centre car park (<i>s</i>) to a motorway on-ramp (<i>t</i>). The road between intersections A and B is two-way. Capacities are in vehicles per hour.',
          fig: tbl(['Road', 'Capacity (vehicles/h)'], [['<i>s</i> to A', 900], ['<i>s</i> to B', 700], ['A to B', 600], ['B to A', 400], ['A to <i>t</i>', 800], ['B to <i>t</i>', 1000]]), figSide: true,
          parts: [
            { q: 'Draw the network.', a: small(C3), space: 'box:36' },
            { q: 'Explain why the road between A and B is shown as two edges.', a: 'Traffic can go both ways and each direction has its own capacity (600 from A to B, 400 from B to A), so each direction needs its own arrow.', space: 'lines:2' },
          ],
        },
      ],
    },
    {
      name: 'Challenge',
      qs: [
        {
          q: 'Mia drew the network for this table. Her diagram has two mistakes. Describe each mistake.',
          fig: `<div class="side" style="align-items:center"><div class="sfig">${edgeTable(T7)}</div><div class="sbody" style="text-align:center">${svg(T7wrong)}<div class="small">Mia’s diagram</div></div></div>`,
          a: 'The edge between M and N points the wrong way (it should be M→N). The capacities of N→P and P→<i>t</i> are swapped: N→P should be 10 and P→<i>t</i> 16.', space: 'lines:3',
        },
        {
          q: 'An irrigation system carries water from a tank (<i>s</i>) to a field (<i>t</i>). The capacities were measured in different units.',
          fig: tbl(['From', 'To', 'Capacity'], U.map(([a, b, c]) => [a === 's' ? '<i>s</i>' : a, b === 't' ? '<i>t</i>' : b, c])), figSide: true,
          parts: [
            { q: 'Convert every capacity to litres per minute.', a: '<i>s</i>→A 30, <i>s</i>→B 25, A→B 10, A→<i>t</i> 50, B→<i>t</i> 45 (L/min)', space: 'lines:2' },
            { q: 'Draw the network with all capacities in L/min.', a: small(Ug), space: 'box:34' },
            { q: 'Which pipe has the greatest capacity? Explain why you could not tell straight from the table.', a: 'A→<i>t</i> (50 L/min). The table mixes L/h and L/min, so the numbers cannot be compared until they are in the same units. 2700 L/h looks biggest, but it is only 45 L/min.', space: 'lines:2' },
          ],
        },
      ],
    },
  ],
};
