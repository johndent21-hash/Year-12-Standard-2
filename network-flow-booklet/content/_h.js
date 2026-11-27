// Small helpers shared by the lesson files
const assert = require('assert');
const N = require('../lib/net');

const en = (key) => { const [a, b] = key.split('>'); return `<span class="e">${a}→${b}</span>`; };
const ens = (keys) => and(keys.map(en));
const and = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const tbl = (head, rows, cls = '') => `<table class="t ${cls}"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => (c === '' ? '<td class="blank"></td>' : `<td>${c}</td>`)).join('')}</tr>`).join('')}</table>`;
// From/To/Capacity table of a network
const edgeTable = (net, unit = 'Capacity', blank = false) => tbl(['From', 'To', unit], net.e.map((x) => [x.u, x.v, blank ? '' : x.c]));
const ul = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const ol = (xs) => `<ol class="steps">${xs.map((x) => `<li>${x}</li>`).join('')}</ol>`;
const figs = (items) => `<div class="figrow">${items.map(([f, c]) => `<figure>${f}${c ? `<figcaption>${c}</figcaption>` : ''}</figure>`).join('')}</div>`;
const sum = (net, keys) => keys.reduce((a, k) => a + N.E(net, k).c, 0);
const pathKeys = (p) => p.slice(1).map((b, i) => `${p[i]}>${b}`);
const pname = (p) => p.join('–');
const cutName = (net, S) => { const c = N.cutValue(net, S); return c; };

module.exports = { assert, N, en, ens, and, tbl, edgeTable, ul, ol, figs, sum, pathKeys, pname, cutName };

// Saturated edges method, following a given list of paths. Returns the table rows, flows and total.
const satMethod = (G, list) => {
  const rem = {}; G.e.forEach((x) => { rem[x.key] = x.c; });
  const flow = {}; G.e.forEach((x) => { flow[x.key] = 0; });
  const rows = []; let total = 0;
  list.forEach((p) => {
    const ks = pathKeys(p);
    const amt = Math.min(...ks.map((k) => rem[k]));
    if (!(amt > 0)) throw new Error(`Path ${p.join('-')} has no spare capacity`);
    const before = ks.map((k) => rem[k]);
    ks.forEach((k) => { rem[k] -= amt; flow[k] += amt; });
    const newly = ks.filter((k) => rem[k] === 0);
    rows.push({ p, amt, before, newly }); total += amt;
  });
  const stuck = N.paths(G).every((p) => pathKeys(p).some((k) => rem[k] === 0));
  if (!stuck) throw new Error(`Saturated edges method not finished: ${list.map((p) => p.join('')).join(', ')}`);
  return { rows, flow, total, rem, sat: G.e.filter((x) => rem[x.key] === 0).map((x) => x.key) };
};
const satTable = (r, withBefore = true) => tbl(['Path', ...(withBefore ? ['Spare capacities'] : []), 'Flow sent', 'Edges saturated'],
  [...r.rows.map((x) => [x.p.map((v) => (v === 's' || v === 't' ? `<i>${v}</i>` : v)).join('–'), ...(withBefore ? [x.before.join(', ')] : []), `<b>${x.amt}</b>`, x.newly.map(en).join(', ')]),
    ['<b>Total</b>', ...(withBefore ? [''] : []), `<b>${r.total}</b>`, '']]);
module.exports.satMethod = satMethod;
module.exports.satTable = satTable;
