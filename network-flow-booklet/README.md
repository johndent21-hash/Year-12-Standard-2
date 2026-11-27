# Network flow lesson booklet (Banora Point High School)

A 10-lesson booklet for Year 12 Mathematics Standard 2, Network flow (NSW Mathematics Standard 11–12 Syllabus 2024, outcomes MST-12-S2-06 and MAO-WM-01). The short answer key is at the back.

Output: `out/Yr12_Std2_Network_Flow_Lesson_Booklet.pdf`

## Build

Needs Node.js, Playwright with Chromium, and poppler (`pdfinfo`, `pdftotext`, `pdfunite`).

```bash
node build.js
```

The build fails, with a message, if any answer is missing or any calculated value no longer matches what a question says.

## The school logo

Put the logo at `assets/banora-logo.png` (or `.jpg` / `.svg`) and rebuild. Until then the cover shows the school's name as plain text in the school colours. The colours (navy, teal, gold) are taken from the logo and set in `lib/style.css`.

## How it is organised

| File | What it does |
|---|---|
| `content/l01.js` … `l10.js` | One lesson each: key ideas, worked examples, then Level 1 (Foundation), Level 2 (Core) and Level 3 (Challenge) questions. Every question carries its own answer. |
| `lib/net.js` | Network diagrams (SVG) and the checking maths: maximum flow, every cut, minimum cuts, and every possible order of the saturated edges method. Cut lines are drawn automatically and checked against the edges they cross. |
| `lib/render.js` | Turns lesson data into pages and builds the answer key from the same data. |
| `lib/front.js` | Cover, contents (page numbers found automatically), outcomes, how to use, key terms. |
| `tools/tune.js` | Finds small capacity changes so that the saturated edges method gives the true maximum whatever paths a student picks. |

## Checks built into the content

- Every network answer (flow capacity, cut capacities, valid flows, effects of upgrades) is calculated in code and asserted.
- Foundation and Core networks that students solve with the saturated edges method give the true maximum for **every** order of path choices. The exceptions are deliberate: Lesson 4 Q7 and Lesson 5 Q7 show that a poor choice of paths can get stuck, which is why the minimum cut check matters.
- Cut capacities count only edges crossing from the source side to the sink side.
