// Finds small capacity changes that make every order of the saturated edges method reach the maximum.
// node tools/tune.js 'sA10 sB8 AC6 At5 BC4 Ct9 Bt3'
const N = require('../lib/net');
const spec = process.argv[2].split(' ').map((t) => { const m = t.match(/^(\w)(\w)(\d+)$/); return [m[1], m[2], +m[3]]; });
const vs = {}; spec.forEach(([a, b]) => { vs[a] = [0, 0]; vs[b] = [0, 0]; });
const ok = (caps) => { const G = N.net(vs, spec.map(([a, b], i) => [a, b, caps[i]])); const m = N.maxFlow(G).value; const r = N.greedyRange(G); return r.lo === m && r.hi === m ? m : null; };
const base = spec.map((x) => x[2]);
const out = [];
for (let i = 0; i < base.length; i++) for (const d of [-2, -1, 1, 2]) { const c = base.slice(); c[i] += d; if (c[i] > 0) { const m = ok(c); if (m) out.push(`${spec[i][0]}${spec[i][1]} ${base[i]}→${c[i]} (max ${m})`); } }
console.log(ok(base) ? `already safe, max ${ok(base)}` : out.join('\n') || 'no single change works');
