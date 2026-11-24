# Ratios, rates and trigonometry: 3-week revision booklet (Year 12 Standard 2)

75 questions (5 a day, 5 days a week, 3 weeks), mixing the Ratios and rates and Trigonometry workbooks.

- `content.py`: every question, its marks, level, topic tags and worked answer. Edit questions here.
- `diagrams.py`, `fig.py`: diagrams drawn from each question's real measurements.
- `check.py`: independent calculation of every answer.
- `build.py`: writes `booklet.html`; `render.js` checks page overflow and prints `booklet.pdf` (Playwright/Chromium).

Needs the TeX Gyre Pagella font (`apt-get install fonts-texgyre`). Build: `python3 build.py && node render.js`.

## Help sheet

`helpsheet.py` builds `helpsheet.html` (one trigonometry page, one ratios and rates page); `render_hs.js` checks fit and prints `helpsheet.pdf`. Build: `python3 helpsheet.py && node render_hs.js`.
