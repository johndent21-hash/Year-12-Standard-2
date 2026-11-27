// Flow networks: data, checking maths (max flow, cuts, saturated edges method) and SVG diagrams.
// Every answer in the booklet that depends on a network is calculated here, not typed by hand.

const SC = 0.26; // mm per diagram unit, so text is the same size in every diagram
const R = 11;    // vertex radius

const net = (v, e, o = {}) => {
  const edges = e.map(([u, w, c, opt = {}]) => {
    if (!v[u] || !v[w]) throw new Error(`Edge ${u}->${w}: unknown vertex`);
    return { u, v: w, c, opt, key: `${u}>${w}` };
  });
  // An edge that passes close to another vertex is bent away from it, so diagrams stay readable.
  edges.forEach((x) => {
    if (x.opt.bend !== undefined) return;
    const A = v[x.u]; const B = v[x.v]; const dx = B[0] - A[0]; const dy = B[1] - A[1]; const L2 = dx * dx + dy * dy;
    Object.entries(v).forEach(([k, W]) => {
      if (k === x.u || k === x.v) return;
      const t = ((W[0] - A[0]) * dx + (W[1] - A[1]) * dy) / L2;
      if (t <= 0.1 || t >= 0.9) return;
      const cross = (dx * (W[1] - A[1]) - dy * (W[0] - A[0])) / Math.sqrt(L2); // + means W is on the left normal side
      const d = Math.abs(cross);
      if (d < 40) { const need = (48 - d) * 2; const bend = cross > 0 ? -need : need; if (!x.opt.bend || Math.abs(bend) > Math.abs(x.opt.bend)) x.opt.bend = bend; }
    });
  });
  const keys = new Set();
  edges.forEach((x) => { if (keys.has(x.key)) throw new Error(`Duplicate edge ${x.key}`); keys.add(x.key); });
  return { v, e: edges, s: o.s || 's', t: o.t || 't', unit: o.unit || '' };
};

const E = (N, key) => { const x = N.e.find((y) => y.key === key); if (!x) throw new Error(`No edge ${key}`); return x; };
const names = (N) => Object.keys(N.v);
const inner = (N) => names(N).filter((x) => x !== N.s && x !== N.t);

// ---------- maths ----------
const maxFlow = (N) => {
  const cap = {}; const flow = {};
  const add = (a, b, c) => { cap[a] = cap[a] || {}; cap[a][b] = (cap[a][b] || 0) + c; cap[b] = cap[b] || {}; cap[b][a] = cap[b][a] || 0; };
  N.e.forEach((x) => add(x.u, x.v, x.c));
  const res = JSON.parse(JSON.stringify(cap));
  let value = 0;
  for (;;) {
    const prev = { [N.s]: null }; const q = [N.s];
    while (q.length && !(N.t in prev)) { const a = q.shift(); for (const b in res[a]) if (res[a][b] > 0 && !(b in prev)) { prev[b] = a; q.push(b); } }
    if (!(N.t in prev)) break;
    let f = Infinity; for (let b = N.t; prev[b] !== null; b = prev[b]) f = Math.min(f, res[prev[b]][b]);
    for (let b = N.t; prev[b] !== null; b = prev[b]) { res[prev[b]][b] -= f; res[b][prev[b]] += f; }
    value += f;
  }
  // net flow on each original edge (no parallel/antiparallel ambiguity in our networks except opposite pairs, handled by min)
  N.e.forEach((x) => { const used = cap[x.u][x.v] - res[x.u][x.v]; flow[x.key] = Math.max(0, Math.min(x.c, used)); });
  return { value, flow };
};

const cutValue = (N, S) => {
  const set = new Set(S); set.add(N.s);
  if (set.has(N.t)) throw new Error('Sink on source side');
  let value = 0; const fwd = []; const back = [];
  N.e.forEach((x) => {
    if (set.has(x.u) && !set.has(x.v)) { value += x.c; fwd.push(x.key); }
    if (!set.has(x.u) && set.has(x.v)) back.push(x.key);
  });
  return { S: [...set], value, fwd, back };
};

const allCuts = (N) => {
  const I = inner(N); const out = [];
  for (let m = 0; m < 1 << I.length; m++) out.push(cutValue(N, I.filter((_, i) => m & (1 << i))));
  return out;
};

const minCut = (N) => {
  const c = allCuts(N); const value = Math.min(...c.map((x) => x.value));
  return { value, cuts: c.filter((x) => x.value === value) };
};

// Every simple path from s to t, as arrays of vertex names
const paths = (N) => {
  const out = [];
  const go = (a, seen) => {
    if (a === N.t) { out.push(seen.slice()); return; }
    N.e.filter((x) => x.u === a && !seen.includes(x.v)).forEach((x) => { seen.push(x.v); go(x.v, seen); seen.pop(); });
  };
  go(N.s, [N.s]);
  return out;
};

// Saturated edges method (forward paths only): the smallest and largest totals over every order of path choices.
const greedyRange = (N) => {
  const P = paths(N).map((p) => p.slice(1).map((b, i) => `${p[i]}>${b}`));
  const memo = new Map(); let lo = Infinity; let hi = 0;
  const go = (rem, total) => {
    const k = JSON.stringify(rem);
    if (memo.has(k) && memo.get(k) >= total) return; memo.set(k, total);
    let moved = false;
    P.forEach((p) => {
      const f = Math.min(...p.map((key) => rem[key]));
      if (f > 0) { moved = true; const r2 = { ...rem }; p.forEach((key) => { r2[key] -= f; }); go(r2, total + f); }
    });
    if (!moved) { lo = Math.min(lo, total); hi = Math.max(hi, total); }
  };
  const rem = {}; N.e.forEach((x) => { rem[x.key] = x.c; });
  go(rem, 0);
  return { lo, hi };
};

// Checks a flow (object key -> amount): capacity rule and conservation rule
const checkFlow = (N, F) => {
  const problems = [];
  N.e.forEach((x) => { const f = F[x.key]; if (f < 0 || f > x.c) problems.push(`${x.key} over capacity`); });
  const io = flowIO(N, F);
  inner(N).forEach((a) => { if (io[a].in !== io[a].out) problems.push(`${a}: in ${io[a].in}, out ${io[a].out}`); });
  return { ok: problems.length === 0, problems, value: io[N.s].out };
};
const flowIO = (N, F) => {
  const io = {}; names(N).forEach((a) => { io[a] = { in: 0, out: 0 }; });
  N.e.forEach((x) => { io[x.u].out += F[x.key] || 0; io[x.v].in += F[x.key] || 0; });
  return io;
};
const capIO = (N) => { const c = {}; N.e.forEach((x) => { c[x.key] = x.c; }); return flowIO(N, c); };

// A drawn cut line: which side each vertex is on, which edges it crosses, and its value
const segX = (p, q, a, b) => {
  const d = (x, y, z) => (z[0] - x[0]) * (y[1] - x[1]) - (z[1] - x[1]) * (y[0] - x[0]);
  const d1 = d(a, b, p); const d2 = d(a, b, q); const d3 = d(p, q, a); const d4 = d(p, q, b);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
};
const crossCount = (pts, seg0) => { const seg = seg0.map(([x, y], i) => [x + 0.0137 + i * 1e-5, y + 0.0291]); let n = 0; for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < seg.length - 1; j++) if (segX(seg[j], seg[j + 1], pts[i], pts[i + 1])) n++; return n; };
const lineCut = (N, pts) => {
  const S = names(N).filter((a) => a === N.s || crossCount(pts, [N.v[N.s], N.v[a]]) % 2 === 0);
  const crossed = N.e.filter((x) => crossCount(pts, edgePts(N, x)) % 2 === 1).map((x) => x.key);
  const c = cutValue(N, S.filter((a) => a !== N.s));
  // the geometry must agree with the sides: crossed edges are exactly those joining the two sides
  const join = [...c.fwd, ...c.back].sort().join(); const cr = crossed.slice().sort().join();
  if (join !== cr) throw new Error(`Cut line is ambiguous: crosses [${cr}] but sides give [${join}]`);
  return c;
};

// A dashed cut line that puts the vertices in S (plus s) on the left and the rest on the right.
// Vertices are grouped into rows by y; the line passes between the groups on each row.
const autoCut = (N, S, label, o = {}) => {
  const set = new Set([N.s, ...S]);
  const rows = {}; Object.entries(N.v).forEach(([k, p]) => { (rows[p[1]] = rows[p[1]] || []).push([k, p[0]]); });
  const ys = Object.keys(rows).map(Number).sort((a, b) => a - b);
  const gap = o.gap || 34;
  const iv = ys.map((y) => {
    const r = rows[y];
    const L = r.filter(([k]) => set.has(k)).map((q) => q[1]); const Rr = r.filter(([k]) => !set.has(k)).map((q) => q[1]);
    if (L.length && Rr.length && Math.max(...L) > Math.min(...Rr)) throw new Error(`autoCut: row ${y} not separable`);
    let lo = L.length ? Math.max(...L) + gap : -Infinity; let hi = Rr.length ? Math.min(...Rr) - gap : Infinity;
    if (lo > hi) { lo = hi = (Math.max(...L) + Math.min(...Rr)) / 2; }
    return [lo, hi];
  });
  // as straight as possible: every row as close as it can be to the same x
  const fin = iv.flat().filter(Number.isFinite); let T = fin.reduce((a, b) => a + b, 0) / fin.length;
  let xs = [];
  for (let k = 0; k < 30; k++) { xs = iv.map(([lo, hi]) => Math.min(hi, Math.max(lo, T))); T = xs.reduce((a, b) => a + b, 0) / xs.length; }
  const pts = ys.map((y, i) => [xs[i] + (o.dx && o.dx[y] || 0), y]);
  const top = [pts[0][0], ys[0] - 32]; const bot = [pts[pts.length - 1][0], ys[ys.length - 1] + 32];
  const c = { pts: [top, ...pts, bot], label, lp: top };
  const res = lineCut(N, c.pts);
  const want = [...set].sort().join(); if (res.S.slice().sort().join() !== want) throw new Error(`autoCut gives ${res.S} not ${want}`);
  return c;
};

// ---------- drawing ----------
const geom = (N, x) => {
  const a = N.v[x.u]; const b = N.v[x.v];
  const dx = b[0] - a[0]; const dy = b[1] - a[1]; const L = Math.hypot(dx, dy);
  const ux = dx / L; const uy = dy / L; let nx = -uy; let ny = ux; // left normal
  const bend = x.opt.bend || 0;
  const C = [(a[0] + b[0]) / 2 + nx * bend, (a[1] + b[1]) / 2 + ny * bend];
  return { a, b, ux, uy, nx, ny, L, bend, C };
};
const edgePts = (N, x) => {
  const g = geom(N, x); if (!g.bend) return [g.a, g.b];
  const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([(1 - t) ** 2 * g.a[0] + 2 * (1 - t) * t * g.C[0] + t * t * g.b[0], (1 - t) ** 2 * g.a[1] + 2 * (1 - t) * t * g.C[1] + t * t * g.b[1]]); }
  return pts;
};
const at = (g, t) => (g.bend
  ? [(1 - t) ** 2 * g.a[0] + 2 * (1 - t) * t * g.C[0] + t * t * g.b[0], (1 - t) ** 2 * g.a[1] + 2 * (1 - t) * t * g.C[1] + t * t * g.b[1]]
  : [g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t]);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// opts: flows {key: n | '' (empty box)}, caps (default true), cuts [{pts,label}], hi [keys] (highlighted path),
//       sat [keys] (crossed out), cap {key: text} (override label), letters {key: 'a'}, scale, title, vLabel {v: text}
const svg = (N, o = {}) => {
  const showCaps = o.caps !== false;
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  const grow = ([x, y], m) => { x0 = Math.min(x0, x - m); y0 = Math.min(y0, y - m); x1 = Math.max(x1, x + m); y1 = Math.max(y1, y + m); };
  Object.values(N.v).forEach((p) => grow(p, R + 14));
  (o.cuts || []).forEach((c) => c.pts.forEach((p) => grow(p, 12)));
  const parts = [];
  const hi = new Set(o.hi || []); const sat = new Set(o.sat || []);
  N.e.forEach((x) => {
    const g = geom(N, x);
    const h = hi.has(x.key);
    const p0 = g.bend ? (() => { const dx = g.C[0] - g.a[0]; const dy = g.C[1] - g.a[1]; const l = Math.hypot(dx, dy); return [g.a[0] + dx / l * R, g.a[1] + dy / l * R]; })() : [g.a[0] + g.ux * R, g.a[1] + g.uy * R];
    const p2 = g.bend ? (() => { const dx = g.b[0] - g.C[0]; const dy = g.b[1] - g.C[1]; const l = Math.hypot(dx, dy); return [g.b[0] - dx / l * (R + 1), g.b[1] - dy / l * (R + 1)]; })() : [g.b[0] - g.ux * (R + 1), g.b[1] - g.uy * (R + 1)];
    const d = g.bend ? `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} Q${g.C[0].toFixed(1)},${g.C[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}` : `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    parts.push(`<path d="${d}" class="edge${h ? ' hi' : ''}" marker-end="url(#ah${h ? 'h' : ''})"/>`);
    // label side: above the edge, or to the right of a vertical edge, unless told otherwise
    let side = (g.ny < -0.05 || (Math.abs(g.ny) <= 0.05 && g.nx > 0)) ? 1 : -1;
    if (g.bend && !x.opt.side) side = Math.sign(g.bend);
    if (x.opt.side) side *= x.opt.side;
    const t = x.opt.t || 0.5; const m = at(g, t);
    const off = x.opt.off || 10;
    const lp = [m[0] + g.nx * off * side, m[1] + g.ny * off * side];
    grow(lp, 12);
    const label = o.cap && o.cap[x.key] !== undefined ? o.cap[x.key] : (showCaps ? x.c : '');
    const lett = o.letters && o.letters[x.key] ? `<tspan class="lett">${o.letters[x.key]}</tspan>${label !== '' ? ' ' : ''}` : '';
    if (label !== '' || lett) {
      const n = String(label).length + (o.letters && o.letters[x.key] ? o.letters[x.key].length + 1 : 0);
      const w = n * 6.6 + 3;
      parts.push(`<rect x="${(lp[0] - w / 2).toFixed(1)}" y="${(lp[1] - 6).toFixed(1)}" width="${w.toFixed(1)}" height="12" class="capbg"/><text x="${lp[0].toFixed(1)}" y="${(lp[1] + 4).toFixed(1)}" class="cap">${lett}${esc(label)}</text>`);
    }
    if (o.flows && x.key in o.flows) {
      const fp = [m[0] - g.nx * (off + 2) * side, m[1] - g.ny * (off + 2) * side];
      grow(fp, 13);
      const f = o.flows[x.key];
      parts.push(`<rect x="${(fp[0] - 10).toFixed(1)}" y="${(fp[1] - 8).toFixed(1)}" width="20" height="16" rx="3" class="fbox${f === '' ? ' empty' : ''}"/>`);
      if (f !== '') parts.push(`<text x="${fp[0].toFixed(1)}" y="${(fp[1] + 4).toFixed(1)}" class="flow">${esc(f)}</text>`);
    }
    if (sat.has(x.key)) { const q = at(g, 0.3); const a1 = [q[0] + g.nx * 7 + g.ux * 3, q[1] + g.ny * 7 + g.uy * 3]; const b1 = [q[0] - g.nx * 7 - g.ux * 3, q[1] - g.ny * 7 - g.uy * 3]; parts.push(`<path d="M${a1[0]},${a1[1]} L${b1[0]},${b1[1]}" class="satx"/>`); }
  });
  Object.entries(N.v).forEach(([k, p]) => {
    const st = k === N.s || k === N.t;
    parts.push(`<circle cx="${p[0]}" cy="${p[1]}" r="${R}" class="vtx${st ? ' st' : ''}"/><text x="${p[0]}" y="${p[1] + 4.2}" class="vl${st ? ' st' : ''}">${esc(o.vLabel && o.vLabel[k] ? o.vLabel[k] : k)}</text>`);
    if (o.vNote && o.vNote[k]) { const [txt, dx, dy] = o.vNote[k]; parts.push(`<text x="${p[0] + dx}" y="${p[1] + dy}" class="vnote">${esc(txt)}</text>`); grow([p[0] + dx, p[1] + dy], 30); }
  });
  const used = [];
  (o.cuts || []).forEach((c) => {
    parts.push(`<polyline points="${c.pts.map((p) => p.join(',')).join(' ')}" class="cut"/>`);
    if (c.label) {
      const p = (c.lp || c.pts[0]).slice();
      while (used.some((q) => Math.abs(q[0] - p[0]) < 18 && Math.abs(q[1] - p[1]) < 10)) p[0] += 9;
      used.push(p);
      parts.push(`<text x="${p[0]}" y="${p[1] - 4}" class="cutl">${c.label}</text>`);
    }
  });
  const w = x1 - x0; const h = y1 - y0; const sc = o.scale || 1;
  return `<svg class="net" viewBox="${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}" style="width:${(w * SC * sc).toFixed(1)}mm;height:${(h * SC * sc).toFixed(1)}mm"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ahd"/></marker><marker id="ahh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ahd hi"/></marker></defs>${parts.join('')}</svg>`;
};

// Vertices only (for "draw the network" questions)
const dotsOnly = (N, o = {}) => svg({ ...N, e: [] }, o);

module.exports = { autoCut, net, E, names, inner, maxFlow, cutValue, allCuts, minCut, paths, greedyRange, checkFlow, flowIO, capIO, lineCut, svg, dotsOnly };
