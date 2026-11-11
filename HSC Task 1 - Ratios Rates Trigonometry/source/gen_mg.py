import sys
OUT = sys.argv[1]

mc = [
 (1, "B", "1.2 L = 1200 mL; 1200 : 400 = 3 : 1", "MST-12-S2-05", "Easy – core/support"),
 (2, "C", "4 cm : 2 km = 4 cm : 200 000 cm = 1 : 50 000", "MST-12-S2-05", "Easy – core/support"),
 (3, "D", "SθW → 180° + θ = 180° + 35° = 215°", "MST-12-S2-04", "Easy – core/support"),
 (4, "A", "x is adjacent to 35°, 20 is the hypotenuse: x = 20 cos 35°", "MST-12-S2-04", "Easy – core"),
 (5, "B", "Unit prices: A $13.60/L, B $13.20/L, C $13.50/L, D $13.40/L → B lowest", "MST-12-S2-05", "Core"),
 (6, "D", "6/50 = 60/N → N = 60 × 50 ÷ 6 = 500", "MST-12-S2-05", "Core"),
 (7, "C", "Final stage: (45 − 20) km in (2.5 − 1.5) h = 25 km/h. (18 = whole-trip average; 20 = first stage)", "MST-12-S2-05", "Core"),
 (8, "A", "2.4 kW × 3 h = 7.2 kWh; 7.2 × $0.30 = $2.16", "MST-12-S2-05", "Core"),
 (9, "D", "Third angle = 70°; x/sin 70° = 12/sin 50° → x = 14.72… ≈ 14.7 cm", "MST-12-S2-04", "Medium – core"),
 (10, "C", "30 = ½ × 8 × 10 × sin θ → sin θ = 0.75 → θ = 48.59…° ≈ 49° (22° omits the ½; 131° is obtuse)", "MST-12-S2-04", "Challenging – Band 5"),
]

# (question, marks, outcome, content, level, solution html, criteria list)
s2 = [
 ("11", 2, "MST-12-S2-05", "Dividing in a ratio", "Easy – core/support",
  "Ratio 3 : 5 : 7, total 15 parts. One part = $1200 ÷ 15 = $80. Cal = 7 × $80 = <b>$560</b>",
  [("2", "Correct answer"), ("1", "Finds total parts (15) or value of one part ($80), or equivalent merit")]),
 ("12(a)", 1, "MST-12-S2-04", "True → compass bearing", "Easy – core/support",
  "360° − 290° = 70° → <b>N70°W</b>", [("1", "Correct answer")]),
 ("12(b)", 1, "MST-12-S2-04", "Reverse bearing", "Easy – core",
  "052° + 180° = <b>232°</b>", [("1", "Correct answer")]),
 ("13", 2, "MST-12-S2-04", "Angle of elevation (right-angled)", "Easy – core",
  "tan 23° = h/85 → h = 85 tan 23° = 36.08… ≈ <b>36 m</b>",
  [("2", "Correct answer"), ("1", "Correct trig equation, e.g. h = 85 tan 23°")]),
 ("14(a)", 1, "MST-12-S2-05", "Fuel consumption", "Core",
  "820 ÷ 100 × 7.4 = <b>60.68 L</b>", [("1", "Correct answer")]),
 ("14(b)", 1, "MST-12-S2-05", "Fuel cost; justify", "Core",
  "60.68 × $2.06 = $125.00, which is more than $120, so <b>Jordan is not correct</b>.",
  [("1", "Correct cost AND a conclusion consistent with it (accept follow-through from (a))")]),
 ("15", 2, "MST-12-S2-05", "Energy (W → kW, kWh) and cost", "Core",
  "2500 W = 2.5 kW. Energy = 2.5 × 6 × 90 = 1350 kWh. Cost = 1350 × $0.32 = <b>$432</b>",
  [("2", "Correct answer"), ("1", "Correct energy in kWh (1350), or correct method with one error (e.g. not converting W to kW)")]),
 ("16(a)", 1, "MST-12-S2-05", "Map scale", "Core",
  "14.6 × 25 000 = 365 000 cm = <b>3.65 km</b>", [("1", "Correct answer")]),
 ("16(b)", 2, "MST-12-S2-05", "Speed, distance, time", "Core – medium",
  "T = D ÷ S = 3.65 ÷ 4.5 = 0.8111… h; × 60 = 48.67 min ≈ <b>49 minutes</b>",
  [("2", "Correct answer (follow-through from (a))"), ("1", "Correct time in hours, or correct method with incorrect conversion to minutes")]),
 ("17", 2, "MST-12-S2-05", "Trapezoidal rule (two applications)", "Core – medium",
  "A ≈ 20/2 (32 + 41) + 20/2 (41 + 28) = 730 + 690 = <b>1420 m²</b>",
  [("2", "Correct answer"), ("1", "One correct application of the trapezoidal rule, or equivalent merit")]),
 ("18", 2, "MST-12-S2-05", "Rainfall volume, % collected", "Core – medium",
  "A = 8 × 5.5 = 44 m²; 24 mm = 0.024 m; V = 44 × 0.024 = 1.056 m³; 90% → 0.9504 m³ = <b>950.4 L</b> (accept ≈ 950 L)",
  [("2", "Correct answer"), ("1", "Correct volume of rain before 90% (1.056 m³ or 1056 L), or correct method with one error (e.g. mm not converted)")]),
 ("19", 2, "MST-12-S2-04", "Cosine rule – angle (obtuse)", "Medium",
  "cos θ = (7² + 9² − 12²)/(2 × 7 × 9) = −14/126 = −0.1111… → θ = 96.38…° ≈ <b>96°</b>",
  [("2", "Correct answer"), ("1", "Correct substitution into the cosine rule")]),
 ("20", 3, "MST-12-S2-05", "Changing ratios (mixtures)", "Challenging – Band 5/6",
  "Remaining drink: 6 − 1.5 = 4.5 L, cordial = 4.5 × 1/6 = 0.75 L, water = 3.75 L. Add 1.5 L water → water = 5.25 L. Ratio 0.75 : 5.25 = <b>1 : 7</b>",
  [("3", "Correct answer"), ("2", "Finds amounts of cordial (0.75 L) and water (5.25 L) after refilling, or equivalent merit"),
   ("1", "Finds cordial and water in the remaining 4.5 L, or finds the original amounts (1 L and 5 L), or equivalent merit")]),
 ("21(a)", 1, "MST-12-S2-04", "Bearings – angle in a triangle", "Medium",
  "Bearing of P from Q = 060° + 180° = 240°. ∠PQR = 240° − 150° = 90°. (Or: using the south line at Q, QP is 60° west of south (alternate angles) and QR is 180° − 150° = 30° east of south, so ∠PQR = 60° + 30° = 90°.)",
  [("1", "Valid reasoning showing 90°")]),
 ("21(b)", 1, "MST-12-S2-04", "Pythagoras", "Core",
  "PR = √(18² + 25²) = √949 = 30.805… ≈ <b>30.8 km</b>", [("1", "Correct answer")]),
 ("21(c)", 2, "MST-12-S2-04", "Bearings with right-angled trig", "Challenging – Band 5",
  "tan ∠QPR = 25/18 → ∠QPR = 54.25…°. Bearing of R from P = 060° + 54.25° = 114.25…° ≈ <b>114°</b>",
  [("2", "Correct answer"), ("1", "Finds ∠QPR ≈ 54°, or equivalent merit")]),
 ("22(a)", 1, "MST-12-S2-04", "Radial survey – angle from bearings", "Core",
  "∠BOC = 245° − 130° = 115°", [("1", "Correct working")]),
 ("22(b)", 2, "MST-12-S2-04", "Area of a triangle ½ab sin C", "Medium",
  "∠AOB = 130° − 25° = 105°. A = ½ × 40 × 55 × sin 105° = 1062.5… ≈ <b>1063 m²</b>",
  [("2", "Correct answer"), ("1", "Finds ∠AOB = 105°, or correct substitution into A = ½ab sin C with an incorrect angle")]),
 ("22(c)", 2, "MST-12-S2-04", "Cosine rule – side", "Medium – challenging",
  "AB² = 40² + 55² − 2 × 40 × 55 × cos 105° = 5763.8… → AB = 75.92… ≈ <b>75.9 m</b>",
  [("2", "Correct answer"), ("1", "Correct substitution into the cosine rule")]),
 ("23(a)", 1, "MST-12-S2-04", "Angle reasoning", "Medium",
  "∠ABT = 180° − 47° = 133° (angles on a straight line). ∠ATB = 180° − 31° − 133° = 16° (angle sum of △ABT). Accept: exterior angle 47° = 31° + ∠ATB.",
  [("1", "Valid reasoning")]),
 ("23(b)", 2, "MST-12-S2-04", "Sine rule – side", "Challenging – Band 6",
  "BT/sin 31° = 40/sin 16° → BT = 40 sin 31° / sin 16° = 74.74… ≈ <b>74.7 m</b>",
  [("2", "Correct answer"), ("1", "Correct sine rule statement with BT opposite 31° and 40 opposite 16°")]),
 ("23(c)", 1, "MST-12-S2-04", "Right-angled trig", "Challenging – Band 6",
  "h = BT sin 47° = 74.74… × sin 47° = 54.66… ≈ <b>55 m</b> (using 74.7 gives 54.63 → 55 m)",
  [("1", "Correct answer (follow-through from (b))")]),
]

s2tot = sum(r[1] for r in s2)
assert s2tot == 35, s2tot
o4 = sum(1 for r in mc if r[3].endswith("04")) + sum(r[1] for r in s2 if r[2].endswith("04"))
o5 = sum(1 for r in mc if r[3].endswith("05")) + sum(r[1] for r in s2 if r[2].endswith("05"))

CSS = """
@page { size: A4; margin: 14mm 15mm 16mm 15mm; }
body { font-family: "Liberation Sans", Arial, sans-serif; font-size: 10pt; color:#000; }
h1 { font-size: 17pt; margin: 0 0 1mm 0; } h2 { font-size: 12.5pt; margin: 6mm 0 2mm 0; border-bottom: 2px solid #000; padding-bottom: 1mm; }
table { border-collapse: collapse; width: 100%; table-layout: auto; } td, th { border: 1px solid #777; padding: 3px 5px; vertical-align: top; text-align:left; }
th { background: #e8eef6; } tr { page-break-inside: avoid; }
.c { text-align:center; } .sub { color:#333; margin-bottom: 4mm; }
.crit td { border: none; padding: 1px 4px; } .crit td:first-child { width: 7mm; font-weight:bold; text-align:center; }
"""
rows_mc = "".join(f"<tr><td class=c>{n}</td><td class=c><b>{a}</b></td><td>{w}</td><td>{o}</td><td>{l}</td></tr>" for n, a, w, o, l in mc)
rows_s2 = ""
for qn, m, o, c, l, sol, crit in s2:
    ct = "<table class=crit>" + "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in crit) + "</table>"
    rows_s2 += f"<tr><td class=c><b>{qn}</b></td><td class=c>{m}</td><td>{sol}</td><td>{ct}</td><td style='font-size:8.5pt'>{c}<br><i>{l}</i><br>{o}</td></tr>"

html = f"""<!doctype html><html><head><meta charset=utf-8><title>Task 1 Marking Guidelines</title><style>{CSS}</style></head><body>
<h1>2026 Year 12 Mathematics Standard 2 – HSC Task 1</h1>
<div class=sub><b>Marking guidelines and solutions</b> (teacher copy) &nbsp;•&nbsp; Ratios and rates &amp; Trigonometry &nbsp;•&nbsp; 45 marks, 1 hour<br>
NSW Mathematics Standard 11–12 Syllabus (2024), Standard 2 pathway, Year 12</div>
<h2>Outcome and mark summary</h2>
<table><tr><th>Outcome</th><th class=c>Section I</th><th class=c>Section II</th><th class=c>Total</th></tr>
<tr><td>MST-12-S2-05 solves practical problems involving ratios and rates</td><td class=c>6</td><td class=c>{o5-6}</td><td class=c><b>{o5}</b></td></tr>
<tr><td>MST-12-S2-04 applies trigonometry to solve problems involving right-angled and non-right-angled triangles</td><td class=c>4</td><td class=c>{o4-4}</td><td class=c><b>{o4}</b></td></tr>
<tr><td>MAO-WM-01 (working mathematically) – assessed throughout, especially the “show”, “justify” and multi-step items: 14(b), 20, 21(a), 22(a), 23(a)</td><td class=c colspan=3>—</td></tr>
<tr><th>Total</th><th class=c>10</th><th class=c>{s2tot}</th><th class=c>{o4+o5}</th></tr></table>
<p style="margin:2mm 0">Difficulty runs from easy (core/support – nearly all students unaided) through core and medium to challenging (Band 5–6, extension-level within Standard 2). No content beyond the Standard 2 Year 12 focus areas is included.</p>
<h2>Section I – Multiple choice (1 mark each)</h2>
<table><tr><th class=c>Q</th><th class=c>Ans</th><th>Working</th><th>Outcome</th><th>Level</th></tr>{rows_mc}</table>
<p style="margin:2mm 0">Answer spread: A ×2, B ×2, C ×3, D ×3.</p>
<h2>Section II – Written response (35 marks)</h2>
<table><tr><th class=c style="width:12mm">Q</th><th class=c style="width:10mm">Marks</th><th style="width:60mm">Sample answer</th><th style="width:66mm">Criteria</th><th style="width:30mm">Content / level / outcome</th></tr>{rows_s2}</table>
<p style="margin-top:3mm"><b>General marking notes.</b> Accept follow-through errors in later parts where the method is correct. Accept answers that differ in the last place only because of a correct but earlier-rounded intermediate value, unless the question requires a specific rounding. Do not penalise missing units more than once across the paper.</p>
</body></html>"""
open(OUT, "w").write(html)
print("S2", s2tot, "o4", o4, "o5", o5)
