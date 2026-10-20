// Reusable building blocks for the booklet pages.

// Ratio with non-breaking thin spaces around each colon: r('12:18') -> 12 : 18
export const r = (s) => `<span class="nw">${s.replace(/\s*:\s*/g, '&#8239;:&#8239;')}</span>`;

// Stacked fraction
export const frac = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;

export const banner = ({ num, title, sub, alt = false }) => `
  <div class="banner${alt ? ' alt' : ''}">
    <div class="tag">
      <div class="num">${num}</div>
      <div><div class="title">${title}</div><div class="sub">${sub}</div></div>
    </div>
  </div>`;

export const shortBanner = (title, cls = '') => `
  <div class="banner short ${cls}"><div class="tag"><div class="title">${title}</div></div></div>`;

export const box = (hd, bd, style = '') =>
  `<div class="box" style="${style}"><div class="hd">${hd}</div><div class="bd">${bd}</div></div>`;

// Success criteria from the textbook's chapter checklist, with a self-rating
export const checklist = (items) => `
  <div class="pale">
    <div class="caps" style="display:flex; justify-content:space-between; align-items:baseline; white-space:nowrap">Checklist · success criteria<span class="ratekey" style="margin:0">Finished? Check the answers, then rate yourself: <span class="rate"><i></i><i></i><i></i></span> not yet / getting there / got it</span></div>
    <div class="checklist">
      ${items.map((t) => `<div class="ic"><i>I can</i> ${t}</div><div class="rate"><i></i><i></i><i></i></div>`).join('')}
    </div>
  </div>`;

// The answer goes in a blue box; a leading "= " stays outside so the equals signs line up
const fin = (m) => (m.startsWith('= ') ? `= <span class="hl">${m.slice(2)}</span>` : `<span class="hl">${m}</span>`);

// Rows of [working, reason]; the last row is the answer
export const steps = (rows) => `
  <div class="steps">
    ${rows.map(([m, why], i) => `<div class="m">${i === rows.length - 1 ? fin(m) : m}</div><div class="why">${why || ''}</div>`).join('')}
  </div>`;

// One part of a worked solution, labelled (a), (b), ...
export const sol = (part, rows) => `
  <div class="sol">
    <div class="pt">${part}</div>
    ${steps(rows)}
  </div>`;

export const we = (id, topic, question, body, style = '') => `
  <div class="we" style="${style}">
    <div class="hd">Worked example ${id}<span>${topic}</span></div>
    <div class="bd"><div class="q">${question}</div>${body}</div>
  </div>`;

// Plain working box. split: one labelled column per part. fill: grows to the bottom of a qpair/grid3 row.
const work = (h, n, { split, fill }) => {
  const size = fill ? `min-height:${h}mm` : `height:${h}mm`;
  return split
    ? `<div class="work split${fill ? ' fill' : ''}" style="${size}; --n:${n}">${Array.from({ length: n }, (_, i) => `<div><span>(${String.fromCharCode(97 + i)})</span></div>`).join('')}</div>`
    : `<div class="work${fill ? ' fill' : ''}" style="${size}"></div>`;
};

// A question with its number, an optional "see example" pointer and a working box.
// Parts sit in columns that line up with a split box, unless cols: 1 lists them down the page.
export const q = (n, text, { see, h = 0, parts, cols = 3, split = false, fill = false } = {}) => `
  <div class="qn">
    <div class="n">${n}</div>
    <div>${text}${see ? `<span class="see">${see}</span>` : ''}
      ${parts ? `<div class="parts${split && h && cols !== 1 ? ' split' : cols === 2 ? ' two' : cols === 1 ? ' one' : ''}" style="--n:${parts.length}">${parts.map((p, i) => `<div>(${String.fromCharCode(97 + i)}) ${p}</div>`).join('')}</div>` : ''}
    </div>
  </div>
  ${h ? work(h, parts ? parts.length : 1, { split: split && parts, fill }) : ''}`;

export const mc = (n, text, opts, { see, h = 14, row = false, fill = false } = {}) => `
  <div class="qn">
    <div class="n">${n}</div>
    <div>${text}${see ? `<span class="see">${see}</span>` : ''}
      <div class="mc-opts${row ? ' row' : ''}">${opts.map((o, i) => `<div><b>${'ABCD'[i]}.</b>${o}</div>`).join('')}</div>
    </div>
  </div>
  ${h ? work(h, 1, { fill }) : ''}`;

export const sec = (a, c, rule = false) =>
  `<div class="sec${rule ? ' rule' : ''}"><span class="a">${a}</span><span class="c">${c}</span></div>`;

export const bar = (title, legend) =>
  `<div class="bar"><span>${title}</span><span class="legend">${legend}</span></div>`;

export const FOOTER = 'Kingscliff High School • Mathematics Standard 2 • Ratios and rates • Chapter 1 key ideas and review';
