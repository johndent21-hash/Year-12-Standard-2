# Chapter 1 Ratios and rates: simplified key ideas and review

A simplified, write-in version of the textbook's *Chapter 1 key ideas and review*
(`../Chapter 1 Key Ideas and Review.pdf`), set out like the Year 10 Cambridge chapter
reviews and styled like the Kingscliff *Ratios and rates* Band 3–4 workbook.

- `sample.pdf`: the sample (cover, about, key ideas, Lesson 1 Ratios, answers).
- `src/pages.mjs`: all the booklet content, one object per A4 page.
- `src/parts.mjs`: reusable pieces (banners, key-idea boxes, worked examples, questions, working boxes).
- `src/styles.css`: the visual design. Fonts and artwork are in `src/fonts` and `src/img`.

## Rebuild the PDF

```
NODE_PATH=$(npm root -g) node build.mjs sample.pdf --png
```

Needs Node and Playwright with Chromium. `--png` also writes page previews to `preview/`.
The build stops with an error if any page's content runs into the footer.
