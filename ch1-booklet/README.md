# Chapter 1 Ratios and rates: simplified key ideas and review

A simplified, write-in workbook built from the textbook's *Chapter 1 key ideas and review*
(`../Chapter 1 Key Ideas and Review.pdf`). It is set out like the Year 10 Cambridge chapter
reviews and styled like the Kingscliff *Ratios and rates* Band 3–4 workbook.

**The finished workbook is `../Chapter 1 Ratios and Rates Workbook.pdf`** (48 A4 pages):
cover, about and contents, key ideas summary, 12 three-page lessons (one per key idea), a
five-page chapter review, and answers.

Each lesson has a key idea with the textbook's checklist, fully worked examples (working and the
reason for each line, answer in a blue box), then multiple choice, short answer and a very
simple extended response, with plain working boxes and a pointer to the example to look at.

## Files

- `src/pages.mjs`: cover, about page, key ideas page and answers pages, plus the assembly of the booklet.
- `src/meta.mjs`: the lesson list and page numbering.
- `src/lessons/lesson01.mjs` … `lesson12.mjs`: one module per lesson (3 pages, answers, any lesson CSS).
  Lesson 1 is the model the others follow.
- `src/lessons/review.mjs`: the chapter review (5 pages).
- `src/parts.mjs`: reusable pieces (banners, key-idea boxes, worked examples, questions, working boxes).
- `src/styles.css`: the visual design. Fonts and artwork are in `src/fonts` and `src/img`.
- `AUTHORING.md`: the conventions every lesson follows. Read it before changing a lesson.

## Rebuild the PDF

```
NODE_PATH=$(npm root -g) node build.mjs --png              # whole workbook -> ../Chapter 1 Ratios and Rates Workbook.pdf
NODE_PATH=$(npm root -g) node build.mjs --lesson 5 --png   # one lesson -> build/lesson05/
NODE_PATH=$(npm root -g) node build.mjs --review --png     # the chapter review -> build/review/
NODE_PATH=$(npm root -g) node build.mjs --answers --png    # the answers pages -> build/answers/
```

Needs Node and Playwright with Chromium. `--png` also writes page previews (`preview/` for the
whole workbook). The build stops with an error if any page's content runs into the footer or past
the right margin, and every lesson must stay exactly 3 pages.
