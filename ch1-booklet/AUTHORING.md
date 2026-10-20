# Authoring guide: Chapter 1 simplified key ideas and review

Read this whole guide before writing anything. **Lesson 1 (`src/lessons/lesson01.mjs`) is the
approved model.** The teacher has seen it and signed off on it. Copy its structure, tone,
components and level of detail exactly.

## Who this is for and what the teacher asked for

- Year 12 NSW Mathematics Standard 2, **lower-ability students** at Kingscliff High School.
- A **simplified** version of the textbook's *Chapter 1 key ideas and review*
  (CambridgeMATHS Standard 2 Year 12, Ratios and rates):
  `/home/user/Year-12-Standard-2/Chapter 1 Key Ideas and Review.pdf` (7 pages: key ideas,
  checklist with success criteria, multiple choice, short answer, extended response).
- One lesson per key idea, and **every lesson is exactly 3 A4 pages**.
- **Worked examples must be fully worked**, so a student can read an example and then answer
  the questions on their own. Every line of working has a plain-words reason beside it.
- The questions follow the layout of the Year 10 Cambridge chapter reviews: **Multiple choice →
  Short answer → Extended response.** The extended response must be **very simple**:
  one short context, 3–4 small parts, each one step.
- **Easier and fewer** than the textbook: friendlier numbers, **4 options** in multiple choice
  (A–D), multi-step questions split into parts, and **hints on the first few questions**.
- Students write in **plain working boxes**, with no dots or grid inside. Answers go at the back.
- The visual design matches the school's *Ratios and rates* workbook. That is already done in
  `src/styles.css` and `src/parts.mjs`; use those components.

## The 3-page lesson pattern (from Lesson 1)

**Page 1**
1. `banner({ num, title, sub: 'Key idea: … • Textbook 1X • MST-12-S2-05' })`
2. `box('Key idea &nbsp;<name>', …)`: the textbook key idea in plain words, 3–4 bullets,
   and a small figure if it helps (float it right, as Lesson 1 does).
3. One or two short supporting sections (`.h2` headings, often side by side in a `grid2`),
   e.g. a method, a units reminder, or a small table.
4. `checklist([...])`: the matching *I can* statements from the textbook checklist, simplified.
5. Worked example *n*.1.

**Page 2**
- Worked examples *n*.2 to *n*.4 (3 or 4 examples in total for the lesson).
- `bar('Your turn n', 'Stuck? Each question shows you where to look.')`
- `sec('Multiple choice', 'circle the best answer')` and three MC questions side by side in a
  `<div class="grid3 qpair">`, each a `mc(...)` with the same fixed `h` (about 15 mm).

**Page 3**
- `sec('Short answer', 'show your working in the box')`: 4–5 questions. Multi-part questions
  use `split: true` so the box gets labelled (a)(b)(c) columns. Pair short questions side by side
  in `<div class="grid2 qpair">`, with equal `h` so the boxes line up.
- `sec('Extended response', 'answer each part in order')`: **one** very simple question with
  parts listed down the page (`cols: 1`) and a split box (`split: true`, about 24–30 mm).

Number multiple choice, short answer and extended response separately from 1, as the textbook does.

## Worked examples: the rules

- Use `we(id, topic, question, body)`. Inside it, put `<div class="sol-head"><span></span><span>Working</span><span>Why</span></div>`
  at the top, then `sol('(a)', rows)` for each part. Each row is `[working, why]`.
- **The last row is the answer.** `steps()` puts it in the blue box automatically. Start it with
  `= ` when it continues a chain, so the equals signs line up.
- Every line shows the operation, e.g. `= 12 ÷ 6 : 18 ÷ 6`. **Never** hide a step in the Why column.
- The Why column is short plain English (about 4–12 words). Bold the key word: *Divide **both** parts by 6.*
- Use a check line where it helps, e.g. `Check: 9 : 12 simplifies to 3 : 4.`
- For a one-part example without (a)/(b) labels, use `steps(rows)` directly, as Example 1.4 does,
  with a two-column sol-head.
- Use a small figure (bar model, diagram, graph) where it makes the method clearer.

## Questions: the rules

- Every question has a pointer: `see: 'Example 5.2'` (or `'Key idea'`, or `'Examples 5.1 and 5.3'`).
  The example it points to **must demonstrate every step the question needs**. If a question
  needs a step no example shows, add it to an example or change the question.
- **Do not reuse a worked example's numbers in a practice question**, or the answer is already printed.
- Hints go in `<span class="hint">Hint: …</span>` on the first few questions (MC 3, SA 1–3, the ER).
  Keep an equation inside a hint together: `<span class="nw">2 parts = 4 buckets</span>`.
- Adapt the textbook's checklist question and review questions for this section (listed in your
  brief below) into simpler versions. Friendlier numbers, fewer parts, one step per part.
- Multiple choice: exactly one correct option, and plausible distractors (common mistakes).
- Make working boxes big enough for the working the example models: about 6–7 mm per
  handwritten line, plus 4 mm for the part label in split boxes.

## Answers

Export `answers`, an HTML fragment in this exact shape (see Lesson 1):

```
<h4>Lesson 5 &nbsp;Plans and elevations</h4>
<h5>Multiple choice</h5><p><b>1</b> A &emsp;<b>2</b> C</p><p><b>3</b> D &nbsp;(short working)</p>
<h5>Short answer</h5><p><b>1</b> <span class="nw">(a) …</span>&nbsp; <span class="nw">(b) …</span></p> …
<h5>Extended response</h5><p><b>1</b> (a) …<br>(b) …</p>
```

Give brief working for multi-step answers. Wrap each calculation in `<span class="nw">…</span>`
so it never breaks mid-equation. Keep it compact: answers are three columns per page.

## Typography and house style

- Ratios: always `r('3:4')`, which gives thin non-breaking spaces. Fractions: `frac('2', '5')`.
- Symbols: × ÷ = ≈ and the true minus sign −. Squared and cubed units: `m<sup>2</sup>`, `m<sup>3</sup>`.
  Do not use ✓, emoji or other unusual symbols, because the fonts may not have them.
- Put `&nbsp;` between a number and its unit where a line might break (`176&nbsp;cm`).
  Large numbers take a narrow space: `50&#8239;000`. Four-digit numbers take none: `1600`.
- Pronumerals are italic: `<i>a</i>`. Australian spelling: metres, litres, kilometres, colour.
- Money: `$1.60`. Time: `2 h 30 min`. Use units consistently and always state them in answers.
- Short sentences and everyday words. Explain a term the first time it appears.
- Notation that must match the key ideas page (p3) and the HSC reference sheet:
  trapezoidal rule `A ≈ h/2 (d_f + d_l)`, where *h* is the distance between the two measurements.
  The textbook writes this distance as *b*; you may say so once. Volume: `V = Ah`. When *h* would
  clash with the trapezoidal rule, write `V = area × depth`. Speed `S = D/T`. Energy (kWh) =
  power (kW) × time (h). Fuel used (L) = distance (km) ÷ 100 × rate (L/100 km).

## Files you may and may not touch

- **Only edit your own module(s)**: `src/lessons/lessonNN.mjs` (or `src/lessons/review.mjs`).
  Replace the placeholder entirely. Export `pages` (exactly 3 page objects for a lesson), `answers`
  and `css`.
- **Do not edit** `parts.mjs`, `styles.css`, `pages.mjs`, `meta.mjs`, `build.mjs`, other lessons or
  any git state. Several authors are working at the same time.
- If you need lesson-specific CSS, give your page objects `cls: 'l05'` and put rules scoped to
  `.l05` in `export const css`. Prefer the existing classes: `box`, `beige`, `pale`, `grid2`,
  `grid3`, `qpair`, `table.t`, `table.t.compact`, `h2`, `h3`, `disp`, `fig`, `cap`, `hint`, `nw`.
- Figures: hand-written inline SVG with the palette blue `#3f7cc0`, light blue `#9fb9da`,
  plum `#7a1f4e`, charcoal `#3d3d3d`, sand `#d8d2b4`, beige `#f5f3eb`. Fonts in SVG are
  `font-family="Pagella"` for maths/labels and `"Poppins"` for captions. Keep figures small.
- Imports: `import { r, frac, banner, box, checklist, steps, sol, we, q, mc, sec, bar } from '../parts.mjs';`
  and `import { LESSONS } from '../meta.mjs';` as needed.

## Build and check (repeat until clean)

```
cd /home/user/Year-12-Standard-2/ch1-booklet
NODE_PATH=$(npm root -g) node build.mjs --lesson 5 --png      # or: --review --png
```

The output goes to `build/lesson05/` (`lesson05.pdf`, `page-NN.png`). The build must say
**`no overflow`**, and each lesson must be exactly 3 pages. Then **look at every PNG**
(use the Read tool on the PNG files; for detail run
`pdftoppm -r 150 -f N -l N -png build/lesson05/lesson05.pdf build/lesson05/hi`) and fix:

- text clipped, overlapping, or running into the footer or margin
- awkward wraps: a number split from its unit, an equation split across lines, a single word alone on a line
- boxes that don't line up, or are too small for the working the example models
- anything that looks different from Lesson 1

Finally, **re-do every calculation yourself**: every worked-example line, every MC key and every
answer. Check that every pointer leads to an example showing all the steps the question needs.
