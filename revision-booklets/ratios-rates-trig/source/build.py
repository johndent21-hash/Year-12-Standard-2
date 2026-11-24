# -*- coding: utf-8 -*-
import math
import diagrams
from content import DAYS, WEEKS, TOPICS, qmarks, NS

TITLE = "Ratios, rates and trigonometry"
FOOT = "Kingscliff High School • Mathematics Standard 2 • Ratios, rates and trigonometry • Revision booklet"
DOTS = {1: "●", 2: "●●", 3: "●●●"}
LET = "abcdefgh"

CSS = r"""
@font-face{font-family:Poppins;font-weight:300;font-style:normal;src:url(fonts/poppins-300-normal.woff2)}
@font-face{font-family:Poppins;font-weight:300;font-style:italic;src:url(fonts/poppins-300-italic.woff2)}
@font-face{font-family:Poppins;font-weight:400;src:url(fonts/poppins-400-normal.woff2)}
@font-face{font-family:Poppins;font-weight:500;src:url(fonts/poppins-500-normal.woff2)}
@font-face{font-family:Poppins;font-weight:600;src:url(fonts/poppins-600-normal.woff2)}
:root{--blue:#3f7cc0;--char:#3d3d3d;--sand:#f5f3eb;--maroon:#7b1f4b;--pink:#f4edf1;--pale:#e7eff7;--grey:#8a8a8a}
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff}
body{font-family:'TeX Gyre Pagella',serif;color:#222;font-size:11.6pt;line-height:1.38}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:15mm 15mm 18mm}
.page:last-child{page-break-after:auto}
.sans{font-family:Poppins,sans-serif}
.foot{position:absolute;left:15mm;right:15mm;bottom:8mm;font-family:Poppins;font-weight:300;font-size:7.6pt;color:#9a9a9a;display:flex;justify-content:space-between;align-items:center}
.pno{width:22px;height:22px;border-radius:50%;background:var(--blue);color:#fff;font-weight:500;font-size:8pt;display:flex;align-items:center;justify-content:center}
/* banner */
.banner{height:27mm;background:var(--char) url(band.jpg) right center/62% auto no-repeat;position:relative;display:flex;align-items:center;margin-bottom:5mm}
.banner:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#3d3d3d 0%,#3d3d3d 34%,rgba(61,61,61,.55) 62%,rgba(61,61,61,0) 100%)}
.banner>*{position:relative}
.bnum{margin-left:4mm;width:16mm;height:19mm;background:rgba(80,80,80,.85);color:#e8e8e8;font-family:Poppins;font-weight:300;font-size:25pt;display:flex;align-items:center;justify-content:center}
.btxt{margin-left:5mm;color:#fff}
.btxt h1{font-family:Poppins;font-weight:400;font-size:16.5pt;margin:0;line-height:1.2}
.btxt div{font-family:Poppins;font-weight:300;font-size:7.6pt;color:#cfcfcf;margin-top:1mm}
.banner.slim{height:14mm}
.banner.slim h1{font-size:12pt;margin-left:5mm;color:#fff;font-family:Poppins;font-weight:400}
.banner.slim h1 span{font-weight:300;font-size:8pt;color:#cfcfcf;margin-left:2mm}
/* boxes */
.sandbox{background:var(--sand);border-radius:6px;padding:3mm 4.5mm;margin-bottom:4mm;font-size:10.4pt;line-height:1.4}
.lab{font-family:Poppins;font-weight:400;color:var(--maroon);font-size:9.5pt}
.weekbox{background:var(--pink);border-left:3px solid var(--maroon);border-radius:0 6px 6px 0;padding:2.6mm 4.5mm;margin-bottom:4mm;font-size:10.3pt}
.weekbox b.k{font-family:Poppins;font-weight:500;color:var(--maroon);font-size:8.6pt;letter-spacing:.3px;text-transform:uppercase}
.panel{border:1px solid #b9cde6;border-radius:6px;overflow:hidden;margin-bottom:4mm}
.panel h3{margin:0;background:var(--blue);color:#fff;font-family:Poppins;font-weight:400;font-size:9.6pt;padding:1.6mm 4mm}
.panel h3 span{font-weight:300;opacity:.9}
.panel .pb{padding:3mm 4mm;font-size:10.2pt}
/* questions */
.day .qs{font-size:12.1pt;line-height:1.38}
.q{padding:2.9mm 0 3mm;border-bottom:1px solid #e3e3e3}
.q:last-of-type{border-bottom:none}
.hsch{display:flex;justify-content:space-between;font-family:Poppins;font-size:8.4pt;color:var(--maroon);margin:0 0 1mm 9mm;font-weight:400}
.hsch .mk{color:#666;font-weight:300}
.qrow{display:flex;gap:4mm;align-items:flex-start}
.qn{font-family:Poppins;color:var(--blue);font-size:12.5pt;width:9mm;flex:none;line-height:1.25;font-weight:400}
.qb{flex:1}
.qfig{flex:none;padding-top:1mm}
.meta{font-family:Poppins;font-weight:300;font-size:8pt;color:#777;white-space:nowrap;margin-left:1.5mm}
.dots{color:var(--blue);font-size:7.5pt;letter-spacing:1px;margin-left:1mm}
.parts{margin:1mm 0 0;padding:0;list-style:none}
.parts li{display:flex;gap:2mm;margin:.6mm 0}
.parts li .pl{width:6mm;flex:none}
.parts li .pt{flex:1}
.parts li .pm{font-family:Poppins;font-weight:300;font-size:8.6pt;color:#555;width:6mm;text-align:right;flex:none}
.mc{display:flex;gap:9mm;margin-top:1.2mm}
.mc b{font-weight:700;margin-right:1.2mm}
.checkin{position:absolute;left:15mm;right:15mm;bottom:17mm;border:1px solid #d9d9d9;border-radius:6px;padding:2.4mm 4mm;display:flex;justify-content:space-between;align-items:center;font-family:Poppins;font-weight:300;font-size:8.2pt;color:#555}
.checkin b{font-weight:500;color:var(--blue)}
.circ{display:inline-flex;gap:1.2mm;margin:0 1.5mm;vertical-align:-1px}
.circ i{width:9px;height:9px;border-radius:50%;border:1.3px solid;display:inline-block}
.blank{display:inline-block;border-bottom:1px solid #888;width:14mm;margin:0 1mm}
/* cover */
.cover{padding:0}
.cover .art{position:absolute;left:0;top:0;width:100%;height:58%;background:url(cover.jpg) center 30%/cover no-repeat}
.cover .card{position:absolute;left:9mm;right:9mm;top:47.5%;height:41.5%;background:#fff;box-shadow:3px 4px 0 #d5d5d5,0 0 0 1px #eee;border-radius:6px;padding:11mm 11mm}
.cover .logo{width:58mm}
.cover .tr{position:absolute;right:11mm;top:12mm;text-align:right;font-family:Poppins;font-weight:300;font-size:10pt;color:#444;line-height:1.35}
.badge{display:inline-block;margin-top:3mm;background:var(--maroon);color:#fff;font-family:Poppins;font-weight:500;font-size:9pt;padding:1.2mm 3mm;border-radius:3px;letter-spacing:.3px}
.cover h1{font-family:Poppins;font-weight:400;font-size:37pt;line-height:1.08;margin:7mm 0 3mm;color:#3a3a3a;letter-spacing:-.3px}
.cover .sub{font-family:Poppins;font-weight:300;color:var(--blue);font-size:13pt}
.cover .syl{font-family:Poppins;font-weight:300;font-size:7.8pt;color:#666;margin-top:2mm}
.cover .fields{display:flex;gap:6mm;margin-top:10mm;font-family:Poppins;font-weight:300;font-size:7.6pt;color:#666}
.cover .fields div{border-bottom:1px solid #777;padding-bottom:7mm}
.cover .credit{position:absolute;bottom:12mm;left:0;right:0;text-align:center;font-family:Poppins;font-weight:300;font-size:7.8pt;color:#555}
.cover .credit i{font-family:'TeX Gyre Pagella';font-size:9pt}
/* about */
.cols2{display:grid;grid-template-columns:1fr 1fr;gap:7mm}
.about p{margin:0 0 2.3mm;font-size:10.1pt;line-height:1.4}
.bar{border-left:3px solid var(--maroon);padding-left:2.5mm}
.bar.b{border-left-color:var(--blue)}
.toc{width:100%;border-collapse:collapse;font-size:10pt}
.toc td{padding:.75mm 0}
.toc td:first-child{color:var(--blue);font-family:Poppins;font-weight:300;width:13mm;font-size:9pt}
.toc td:last-child{text-align:right;white-space:nowrap}
.outc{display:grid;grid-template-columns:30mm 1fr;row-gap:1mm;font-size:9.6pt;line-height:1.32}
.outc .c{font-family:Poppins;font-weight:400;color:var(--blue);font-size:9pt}
.form{display:grid;grid-template-columns:1fr 1fr;column-gap:8mm;row-gap:1.3mm;font-size:9.9pt;align-items:center}
.frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.1;margin:0 1px}
.frac>span:first-child{border-bottom:1px solid #222;padding:0 2px}
h2.sec{font-family:Poppins;font-weight:400;color:var(--char);font-size:11.5pt;margin:2mm 0 1.5mm}
/* planner */
table.trk{width:100%;border-collapse:collapse;font-size:9.6pt}
table.trk th{font-family:Poppins;font-weight:400;font-size:8.2pt;color:#fff;background:var(--blue);padding:1.4mm 2mm;text-align:left}
table.trk td{border-bottom:1px solid #e0e0e0;padding:1.25mm 2mm;height:6.4mm}
table.trk tr.wk td{background:var(--sand);font-family:Poppins;font-weight:400;font-size:8.4pt;color:var(--maroon);height:auto;padding:1mm 2mm}
table.map{width:100%;border-collapse:collapse;font-size:9.4pt}
table.map td{padding:.8mm 1.5mm;border-bottom:1px solid #eee;vertical-align:top}
table.map td.l{color:var(--blue);font-family:Poppins;font-weight:300;font-size:8.2pt;white-space:nowrap}
table.map td.n{font-family:Poppins;font-weight:300;font-size:8.6pt;color:#333}
/* answers */
.ans{column-count:2;column-gap:8mm;font-size:10pt;line-height:1.4;column-fill:auto;height:245mm}
.ans h4{font-family:Poppins;font-weight:400;color:var(--blue);font-size:10.5pt;margin:2.6mm 0 1mm;break-after:avoid}
.ans h4:first-child{margin-top:0}
.ans p{margin:0 0 1.6mm;break-inside:avoid}
.ans p b{font-weight:700}
.ans .tot{font-family:Poppins;font-weight:300;font-size:7.4pt;color:#777}
"""


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


def frac(a, b):
    return f'<span class="frac"><span>{a}</span><span>{b}</span></span>'


def mins(m):
    return int(math.ceil(1.5 * m / 5.0) * 5)


def q_html(num, q):
    m = qmarks(q)
    out = ['<div class="q">']
    if q["hsc"]:
        out.append(f'<div class="hsch"><span>HSC-style question</span><span class="mk">{m} mark{"s" if m > 1 else ""}</span></div>')
    body = [q["text"]]
    if q["parts"]:
        lis = []
        for i, (t, pm) in enumerate(q["parts"]):
            pmh = f'<span class="pm">{pm}</span>' if (q["hsc"] and pm) else ""
            lis.append(f'<li><span class="pl">({LET[i]})</span><span class="pt">{t}</span>{pmh}</li>')
        body.append(f'<ul class="parts">{"".join(lis)}</ul>')
    if q["mc"]:
        body.append('<div class="mc">' + "".join(f"<span><b>{L}.</b>{o}</span>" for L, o in zip("ABCD", q["mc"])) + "</div>")
    meta = f'<span class="dots">{DOTS[q["lvl"]]}</span>'
    if not q["hsc"]:
        meta = f'<span class="meta">[{m} mark{"s" if m > 1 else ""}]</span>' + meta
    if q["parts"] or q["mc"]:
        body.append(f'<div style="text-align:right;margin-top:-.5mm">{meta}</div>')
    else:
        body[0] = body[0] + " " + meta
    fig = ""
    if q["fig"]:
        fig = f'<div class="qfig">{getattr(diagrams, q["fig"])()}</div>'
    out.append(f'<div class="qrow"><div class="qn">{num}</div><div class="qb">{"".join(body)}</div>{fig}</div></div>')
    return "".join(out)


def circles():
    return '<span class="circ"><i style="color:#d9534f"></i><i style="color:#e6a23c"></i><i style="color:#3c9a5f"></i></span>'


pages = []

# ---------- cover ----------
pages.append(f"""<div class="page cover">
<div class="art"></div>
<div class="card">
 <img class="logo" src="kingscliff-logo.png">
 <div class="tr">Mathematics Standard 2<br>Year 12<br><span class="badge">REVISION BOOKLET</span></div>
 <h1>{TITLE}</h1>
 <div class="sub">Year 12 Standard 2 &nbsp;•&nbsp; 3-week revision booklet</div>
 <div class="syl">NSW Mathematics Standard 11–12 Syllabus (2024) &nbsp;•&nbsp; Outcomes MST-12-S2-04, MST-12-S2-05, MAO-WM-01</div>
 <div class="fields"><div style="flex:2.2">Name</div><div style="flex:1">Class</div><div style="flex:1.1">Teacher</div></div>
</div>
<div class="credit">Cover and banner artwork: <i>Kingscliff High School Vision Statement</i> by local Indigenous artist Marni Tuala.</div>
</div>""")

# ---------- about ----------
PAGE_OF_DAY = {}
first_day_page = 4
for i in range(15):
    PAGE_OF_DAY[i] = first_day_page + i
ANS_PAGE = first_day_page + 15

toc_rows = []
for w in range(3):
    toc_rows.append(f'<tr><td>W{w+1}</td><td>Week {w+1}: {WEEKS[w][0].lower()} &nbsp;<span style="color:#888;font-size:8.6pt">Days {5*w+1}–{5*w+5}</span></td><td>{PAGE_OF_DAY[5*w]}</td></tr>')
toc = "".join(toc_rows)

pages.append(f"""<div class="page about">
<div class="banner slim"><h1>About this booklet</h1></div>
<div class="cols2">
<div>
<p>This booklet revises <b>everything</b> in your two Year 12 workbooks, <b>Ratios and rates</b> and <b>Trigonometry</b>, from the NSW <i>Mathematics Standard 11–12 Syllabus (2024)</i>, Standard 2 pathway.</p>
<p>There are <b>75 questions</b>: <b>5 a day, 5 days a week, for 3 weeks</b>. Every day mixes ratios and rates with trigonometry, just like an HSC paper.</p>
<p class="bar"><b>Work in your exercise book.</b> Write the day and question number, draw a large labelled diagram for every trigonometry and survey question, and show every step. In the HSC, working earns marks even when the final answer is wrong.</p>
<p class="bar"><b>HSC-style questions.</b> At least two questions each day are HSC-style, with mark values. They are new questions written in the style of the HSC exam, not past papers.</p>
<p class="bar b"><b>Getting harder.</b> Each day starts easy and builds up. Each week is harder than the last. Questions are graded <span class="dots">●</span> foundation, <span class="dots">●●</span> developing and <span class="dots">●●●</span> extending.</p>
<p>Mark your work with the answers at the back, record your score in the planner on page 3, and use the topic map to find the workbook lesson for anything you got wrong.</p>
</div>
<div>
<div class="panel"><h3>Contents</h3><div class="pb" style="padding-top:2mm;padding-bottom:2mm"><table class="toc">
<tr><td>P</td><td>Revision planner and topic map</td><td>3</td></tr>{toc}
<tr><td>A</td><td>Answers</td><td>{ANS_PAGE}–{ANS_PAGE+1}</td></tr></table></div></div>
<div class="weekbox"><b class="k">How long?</b><br>Each day is worth 11–16 marks. Allow 20–25 minutes: about 1.5 minutes a mark, as in the HSC.</div>
<div class="sandbox"><span class="lab">You will need</span><br>A calculator set to <b>degrees</b>, a ruler, a protractor, a pencil and your exercise book.</div>
<h2 class="sec" style="margin-top:0">Acknowledgement of Country</h2>
<p style="font-size:9.4pt;line-height:1.36">We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. The artwork on the cover and throughout this booklet is our school vision statement, created by local Indigenous artist Marni Tuala.</p>
</div>
</div>
<div class="panel"><h3>Syllabus outcomes</h3><div class="pb"><div class="outc">
<span class="c">MST-12-S2-04</span><span>applies trigonometry to solve problems involving right-angled and non-right-angled triangles</span>
<span class="c">MST-12-S2-05</span><span>solves practical problems involving ratios and rates</span>
<span class="c">MAO-WM-01</span><span>develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly</span>
</div></div></div>
<div class="panel"><h3>Formulas you’ll use <span>(all but Pythagoras’ theorem are on the HSC reference sheet)</span></h3><div class="pb"><div class="form">
<span>Trig ratios: sin θ = {frac('<i>O</i>','<i>H</i>')} &nbsp; cos θ = {frac('<i>A</i>','<i>H</i>')} &nbsp; tan θ = {frac('<i>O</i>','<i>A</i>')}</span>
<span>Sine rule: {frac('<i>a</i>','sin <i>A</i>')} = {frac('<i>b</i>','sin <i>B</i>')} = {frac('<i>c</i>','sin <i>C</i>')}</span>
<span>Cosine rule: <i>c</i>² = <i>a</i>² + <i>b</i>² − 2<i>ab</i> cos <i>C</i></span>
<span>cos <i>C</i> = {frac('<i>a</i>² + <i>b</i>² − <i>c</i>²','2<i>ab</i>')}</span>
<span>Area of a triangle: <i>A</i> = ½<i>ab</i> sin <i>C</i></span>
<span>Pythagoras’ theorem: <i>c</i>² = <i>a</i>² + <i>b</i>²</span>
<span>Trapezoidal rule: <i>A</i> ≈ {frac('<i>h</i>','2')}(<i>d<sub>f</sub></i> + <i>d<sub>l</sub></i>)</span>
<span>Rainfall volume: <i>V</i> = <i>Ah</i> &nbsp; (1 m³ = 1000 L)</span>
<span>Speed: <i>S</i> = {frac('<i>D</i>','<i>T</i>')}</span>
<span>Energy: kWh = kW × hours &nbsp; (1 kW = 1000 W)</span>
</div></div></div>
{foot(2)}</div>""")

# ---------- planner + topic map ----------
trk = []
for w in range(3):
    trk.append(f'<tr class="wk"><td colspan="5">Week {w+1}: {WEEKS[w][0]}</td></tr>')
    for d in range(5):
        di = 5 * w + d
        tot = sum(qmarks(q) for q in DAYS[di])
        trk.append(f'<tr><td>Day {di+1}</td><td>Q{5*di+1}–{5*di+5}</td><td></td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {tot}</td><td>{circles()}</td></tr>')
topic_q = {k: [] for k in TOPICS}
for di, day in enumerate(DAYS):
    for qi, q in enumerate(day):
        for t in q["tags"]:
            topic_q[t].append(5 * di + qi + 1)
maprows = []
for k, (book, les, name) in TOPICS.items():
    if k in ("R1", "T1"):
        maprows.append(f'<tr><td colspan="3" style="font-family:Poppins;font-weight:500;color:var(--maroon);font-size:8.6pt;padding-top:2mm">{book} workbook</td></tr>')
    maprows.append(f'<tr><td class="l">Lesson {les}</td><td>{name}</td><td class="n">{", ".join(map(str, topic_q[k]))}</td></tr>')

pages.append(f"""<div class="page">
<div class="banner slim"><h1>Revision planner <span>record your progress and find your weak spots</span></h1></div>
<div class="cols2" style="grid-template-columns:1fr 1.08fr">
<div>
<table class="trk"><tr><th>Day</th><th>Questions</th><th>Date</th><th>Marks</th><th>Rate it</th></tr>{"".join(trk)}</table>
<p style="font-family:Poppins;font-weight:300;font-size:7.8pt;color:#666;margin-top:1.5mm">Rate it: {circles()} not yet / getting there / got it</p>
</div>
<div>
<div class="panel" style="margin-bottom:3mm"><h3>Topic map <span>which questions revise each workbook lesson</span></h3><div class="pb" style="padding:1mm 3mm 2mm">
<table class="map">{"".join(maprows)}</table></div></div>
</div></div>
<div class="weekbox" style="margin-top:1mm"><b class="k">Levels</b> &nbsp;
<b>Week 1</b> core skills for every student (support and core). &nbsp;<b>Week 2</b> multi-step core questions (core, aiming for Band 4–5). &nbsp;<b>Week 3</b> exam-ready problems (Band 5–6, with extending ●●● questions). Every student should attempt every day: start with questions 1–3, then try the HSC-style questions.</div>
{foot(3)}</div>""")

# ---------- day pages ----------
for di, day in enumerate(DAYS):
    w = di // 5
    tot = sum(qmarks(q) for q in day)
    pno = PAGE_OF_DAY[di]
    weekbox = ""
    if di % 5 == 0:
        weekbox = f'<div class="weekbox"><b class="k">Week {w+1}: {WEEKS[w][0]}</b><br>{WEEKS[w][1]}</div>'
    else:
        weekbox = ('<div class="sandbox" style="padding:2mm 4.5mm"><span class="lab">Remember</span> &nbsp;Do your working and diagrams in your exercise book. '
                   'For each question, first decide <i>which</i> method you need, then solve it.</div>')
    qs = "".join(q_html(5 * di + i + 1, q) for i, q in enumerate(day))
    pages.append(f"""<div class="page day">
<div class="banner"><div class="bnum">{di+1}</div><div class="btxt"><h1>Week {w+1} &nbsp;•&nbsp; Day {di % 5 + 1}</h1>
<div>Questions {5*di+1}–{5*di+5} &nbsp;•&nbsp; {tot} marks &nbsp;•&nbsp; about {mins(tot)} minutes</div></div></div>
{weekbox}
<div class="qs">{qs}</div>
<div class="checkin"><span><b>Day {di+1} check-in</b> &nbsp; Marks: <span class="blank"></span>/ {tot}</span>
<span>How did it go? {circles()} not yet / getting there / got it</span></div>
{foot(pno)}</div>""")

# ---------- answers ----------
def ans_block(rng):
    ans = []
    for di in rng:
        day = DAYS[di]
        tot = sum(qmarks(q) for q in day)
        ans.append(f'<h4>Day {di+1} <span class="tot">({tot} marks)</span></h4>')
        for i, q in enumerate(day):
            ans.append(f'<p><b>{5*di+i+1}</b> {q["ans"]}</p>')
    return "".join(ans)
for k, rng in enumerate((range(0, 8), range(8, 15))):
    sub = "check your working, not just the final answer" if k == 0 else "continued"
    pages.append(f"""<div class="page ansp">
<div class="banner slim"><h1>Answers <span>{sub}</span></h1></div>
<div class="ans">{ans_block(rng)}</div>
{foot(ANS_PAGE + k)}</div>""")

html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>{TITLE}</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>"""
open("booklet.html", "w").write(html)
print("pages", len(pages))
