# Summer revision booklets (girls and boys versions)

120 core questions for the summer holidays: 4 a day, 5 days a week, 6 weeks (20 a week).
Topics: Year 11 Formulas and equations (MST-11-01) and Applications of measurement (MST-11-05);
Year 12 Standard 2 Ratios and rates (MST-12-S2-05), Trigonometry (MST-12-S2-04) and Network flow (MST-12-S2-06).

- `content2.py`: all 120 questions, marks, levels, topic tags and worked answers (24 per topic, 4 topics a day).
- `nets.py`: the flow networks, shared by the diagrams and the checker. `check2.py` recomputes every answer (max-flow solver for networks).
- `diagrams2.py`, `helpsheet2.py`: new diagrams and the formulas/measurement/network-flow help sheets.
- `girl2.py`: Christmas (weeks 1-2) blending into summer, with treats. `boy2.py`: summer theme with XP and 10 levels.
- Needs the files in `../../ratios-rates-trig/source/` (build.py, content.py, fig.py, diagrams.py, helpsheet.py, girl.py, boy.py, fonts, images) in the same folder.

Build: `python3 girl2.py && node render_v.js girl2`, or `python3 boy2.py && node render_v.js boy2`.
