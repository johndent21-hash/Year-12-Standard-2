# -*- coding: utf-8 -*-
"""Personalised, encouraging version of the revision booklet (same questions and answers)."""
import re
import build          # reuses q_html, CSS, mins (rebuilds booklet.html as a side effect)
import helpsheet      # reuses help sheet pages
from content import DAYS, qmarks

NAME = ""
FOOT = f"My revision booklet • Ratios, rates and trigonometry • Year 12 Standard 2"

# ---------- little drawings ----------
HEART = "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.2 5.6 3.4C14 6.2 15.6 5 17.6 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z"
SPARK = "M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"


def heart(size=14, fill="#f4a6c4", stroke="none", sw=1.4, inner=""):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" style="vertical-align:middle">'
            f'<path d="{HEART}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>{inner}</svg>')


def spark(size=12, fill="#c9a7ee"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" style="vertical-align:middle"><path d="{SPARK}" fill="{fill}"/></svg>'


def gift(size=26):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 32 32" style="vertical-align:middle">'
            '<rect x="4" y="13" width="24" height="16" rx="2" fill="#f7c6d9" stroke="#c2477a" stroke-width="1.5"/>'
            '<rect x="2.5" y="9" width="27" height="6" rx="1.5" fill="#f4a6c4" stroke="#c2477a" stroke-width="1.5"/>'
            '<rect x="14" y="9" width="4" height="20" fill="#b48ae0"/>'
            '<path d="M16 9C12 2 6 4 9 8.5M16 9C20 2 26 4 23 8.5" fill="none" stroke="#c2477a" stroke-width="1.6" stroke-linecap="round"/></svg>')


def face(kind, size=17):
    mouth = {"low": "M8 17q4-3.2 8 0", "mid": "M8 16h8", "high": "M8 14.5q4 4 8 0"}[kind]
    col = {"low": "#b9c7e8", "mid": "#ffd9a8", "high": "#f7b6cf"}[kind]
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" style="vertical-align:middle">'
            f'<circle cx="12" cy="12" r="10.5" fill="{col}" stroke="#7a4fa3" stroke-width="1.1"/>'
            '<circle cx="8.6" cy="9.6" r="1.2" fill="#5a3d7a"/><circle cx="15.4" cy="9.6" r="1.2" fill="#5a3d7a"/>'
            f'<path d="{mouth}" fill="none" stroke="#5a3d7a" stroke-width="1.4" stroke-linecap="round"/></svg>')


def faces():
    return (f'<span class="faces">{face("low")}<small>wobbly</small>{face("mid")}<small>okay</small>'
            f'{face("high")}<small>great</small></span>')


# decorative background for banners and the cover (scattered sparkles and hearts)
def deco_svg(w, h, seed=1, n=16, opacity=0.55):
    import random
    rnd = random.Random(seed)
    items = []
    for i in range(n):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        s = rnd.uniform(6, 16)
        col = rnd.choice(["#ffffff", "#fde3ee", "#efe3ff", "#ffe9dc"])
        path = HEART if i % 3 == 0 else SPARK
        items.append(f'<path d="{path}" fill="{col}" transform="translate({x:.0f},{y:.0f}) scale({s/24:.2f})"/>')
    for i in range(8):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        items.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rnd.uniform(1.5,3.5):.1f}" fill="#ffffff"/>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" opacity="{opacity}">{"".join(items)}</svg>'
    import urllib.parse
    return "url(\"data:image/svg+xml;utf8," + urllib.parse.quote(svg) + "\")"


BAND_DECO = deco_svg(700, 100, seed=3, n=18, opacity=0.7)
COVER_DECO = deco_svg(800, 1130, seed=7, n=60, opacity=0.8)

# ---------- words ----------
QUOTES = [
    "Small steps every day add up to big results.",
    "You don’t have to be perfect. You just have to keep going.",
    "Mistakes are proof that you’re trying.",
    "One question at a time. That’s all it takes.",
    "Week 1 done today. Look how far you’ve come!",
    "Progress, not perfection.",
    "Breathe in, breathe out. You know more than you think.",
    "More than halfway there. Keep going!",
    "Every question you try makes the next one easier.",
    "Two weeks of hard work. Be proud of yourself!",
    "Believe in the work you’ve put in.",
    "You can do hard things.",
    "Calm mind, clear diagram, one step at a time.",
    "Nearly there. Keep shining!",
    "Last day! Finish strong.",
]
TIPS = {
    1: "Stuck? Circle it, move on and come back later. You can still earn marks on the next question.",
    2: "Draw a big, labelled diagram before you calculate. It does half the thinking for you.",
    3: "Before you start, say the method out loud: ratio, rate, SOH CAH TOA, sine rule or cosine rule?",
    4: "Last day of Week 1! Finish these five and claim your treat.",
    6: "Keep the full calculator value until the last line. Round once, at the end.",
    7: "Check the units before you start: mm → m, minutes → hours, W → kW.",
    8: "Part marks are real marks. Write down every step, even if you’re unsure.",
    9: "Week 2 finishes today! Flick back to Day 1. It already feels easier, doesn’t it?",
    11: "Feeling wobbly? Box breathing: in for 4, hold for 4, out for 4, hold for 4. Then start with the easiest question.",
    12: "These questions are meant to be hard. Getting part of one right is a win.",
    13: "Quick check: is the longest side opposite the largest angle? Does the bearing match your sketch?",
    14: "Final day! Finish strong, then go and celebrate.",
}
WEEKS = [
    ("Warm up", "This week is all about building confidence. Most questions are ● and ●● level, and the HSC-style ones are short. You’ve got this."),
    ("Level up", "The questions now have two or more steps. Take your time, draw the diagram first, and use your help sheet."),
    ("Exam ready", "The hardest questions, like the last ones on the HSC paper. Getting part marks here is a great result."),
]
# milestone: day index -> (questions done, headline, treat idea)
MILES = {
    1: (10, "First 10 questions done!", "your favourite snack or drink"),
    4: (25, "Week 1 complete: 25 questions!", "a walk on the beach, or an episode of your favourite show"),
    7: (40, "40 questions: more than halfway!", "a bubble tea or café treat"),
    9: (50, "Week 2 complete: 50 questions!", "a movie night or a pamper night"),
    12: (65, "65 questions: the finish line is in sight!", "catching up with a friend"),
    14: (75, "ALL 75 QUESTIONS DONE!", "something special. You’ve earned it!"),
}

THEME = r"""
@font-face{font-family:'TeX Gyre Pagella';font-weight:400;font-style:normal;src:url(fonts/pagella-regular.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:400;font-style:italic;src:url(fonts/pagella-italic.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:700;font-style:normal;src:url(fonts/pagella-bold.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:700;font-style:italic;src:url(fonts/pagella-bolditalic.ttf)}
@font-face{font-family:Caveat;font-weight:400 700;src:url(fonts/caveat-700-static.ttf)}
:root{--blue:#c2477a;--maroon:#7a4fa3;--sand:#fff1f6;--pink:#f3ecfd;--pale:#fde8f0;--berry:#c2477a;--plum:#7a4fa3;--rose:#f7c6d9;--lav:#e4d6f7;--peach:#ffe4d4}
body{color:#3a2a40}
.foot{color:#b58aa6}
.pno{background:#e27fab}
.banner{background:#e3b0d8 url(bg_band.jpg) center/cover no-repeat;border-radius:14px;overflow:hidden}
.banner:before{display:none}
.bnum{background:#fff;color:var(--berry);border-radius:50%;width:18mm;height:18mm;font-weight:500;box-shadow:0 2px 0 rgba(122,79,163,.25)}
.btxt h1,.banner.slim h1{color:#4a2d5c !important}
.btxt div,.banner.slim h1 span{color:#6b4a80 !important}
.bq{position:absolute;right:6mm;top:50%;transform:translateY(-50%) rotate(-2deg);max-width:70mm;text-align:right;font-family:Caveat;font-weight:700;font-size:17pt;line-height:1.05;color:#8a2f63}
.banner.slim{height:15mm}

.panel{border:1.5px solid #f1c9dc;border-radius:12px}
.panel h3{background:#d98ab6}
.sandbox{background:#fff1f6;border-radius:12px;border:1.5px solid #f6cfe0}
.weekbox{background:#f3ecfd;border-left:none;border-radius:12px;border:1.5px solid #dccbf5}
.weekbox b.k,.lab{color:var(--plum)}
.qn{color:var(--berry);font-weight:500}
.dots{color:#b48ae0}
.hsch{color:var(--plum)}
.q{border-bottom:1.5px solid #f6dbe7}
.checkin{border:1.5px solid #f1c9dc;border-radius:12px;background:#fffafc}
.checkin b{color:var(--berry)}
.faces{display:inline-flex;align-items:center;gap:1.2mm;margin-left:2mm}
.faces small{font-size:7.4pt;margin-right:1.8mm;color:#7a6a80}
.coupon{position:absolute;left:15mm;right:15mm;bottom:16mm;border:2px dashed #e07aa6;border-radius:14px;background:#fff2f8;padding:2mm 4mm;display:flex;gap:3.5mm;align-items:center;font-family:Poppins;font-weight:300;font-size:8.4pt;color:#5a3d6a}
.coupon .h{font-weight:600;color:var(--berry);font-size:10pt}
.coupon .c{font-family:Caveat;font-size:13pt;color:var(--plum);font-weight:700}
.coupon .line{display:inline-block;border-bottom:1px solid #b58aa6;width:52mm;margin:0 1mm}
.tick{display:inline-block;width:10px;height:10px;border:1.4px solid var(--berry);border-radius:3px;vertical-align:-1px;margin-left:1mm}
.tipbox{display:flex;gap:2.5mm;align-items:flex-start}
.hand{font-family:Caveat;font-weight:700}
/* help sheet + answers banners keep the theme */
.hs .banner{border-radius:14px}
/* cover */
.scover{padding:0;background:#f6e6f5 url(bg_cover.jpg) center/cover no-repeat}
.scover .dec{display:none}
.scover .card{position:absolute;left:16mm;right:16mm;top:52mm;bottom:40mm;background:#fff;border-radius:26px;box-shadow:0 6px 0 #f2c3d8;padding:14mm 14mm;text-align:center}
.scover .logo{width:46mm}
.scover .hi{font-family:Caveat;font-weight:700;font-size:46pt;color:var(--berry);line-height:1;margin-top:9mm}
.scover h1{font-family:Poppins;font-weight:500;font-size:25pt;color:#4a3354;margin:4mm 0 2mm;line-height:1.15}
.scover .sub{font-family:Poppins;font-weight:300;font-size:11.5pt;color:var(--plum)}
.scover .pill{display:inline-block;margin-top:7mm;background:#d98ab6;color:#fff;font-family:Poppins;font-weight:500;font-size:10pt;padding:2mm 6mm;border-radius:20px}
.scover .q{border:none;font-family:Caveat;font-weight:700;font-size:20pt;color:var(--plum);margin-top:12mm;padding:0}
.scover .credit{position:absolute;bottom:14mm;left:0;right:0;text-align:center;font-family:Poppins;font-weight:300;font-size:8pt;color:#8a6a90}
/* welcome + tracker */
.letter{font-size:11pt;line-height:1.5}
.letter p{margin:0 0 2.6mm}
.sig{font-family:Caveat;font-weight:700;font-size:17pt;color:var(--berry)}
.rewards{width:100%;border-collapse:separate;border-spacing:0 1.6mm;font-size:9.8pt}
.rewards td{background:#fff5f9;padding:1.6mm 2.5mm}
.rewards td:first-child{border-radius:10px 0 0 10px;font-family:Poppins;font-weight:600;color:var(--berry);white-space:nowrap}
.rewards td:last-child{border-radius:0 10px 10px 0}
.hgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm}
.wk h4{font-family:Poppins;font-weight:500;color:var(--plum);font-size:10pt;margin:0 0 1.5mm}
.drow{display:flex;align-items:center;gap:.5mm;margin:1.1mm 0;font-family:Poppins;font-weight:300;font-size:7.6pt;color:#6a5070}
.drow .dl{width:9mm}
.hn{position:relative;display:inline-block;width:25px;height:25px}
.hn span{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;font-family:Poppins;font-weight:400;font-size:6.1pt;line-height:1;color:#8a5a7a;padding-top:9.4px}
.cert{position:absolute;left:18mm;right:18mm;top:20mm;height:128mm;border-radius:26px;background:#f6e6f5 url(bg_cover.jpg) center/cover no-repeat;text-align:center;padding:12mm}
.cert .dec{display:none}
.cert>*{position:relative}
.cert .big{font-family:Caveat;font-weight:700;font-size:44pt;color:var(--berry);line-height:1}
.cert p{font-size:12pt;margin:3mm 0}
"""
THEME = THEME.replace("BAND", BAND_DECO).replace("COVER", COVER_DECO)
CSS = build.CSS + THEME


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


pages = []

# ---------- cover ----------
pages.append(f"""<div class="page scover"><div class="dec"></div>
<div class="card">
<img class="logo" src="kingscliff-logo.png">
<div class="hi">You’ve got this!</div>
<h1>Ratios, rates and trigonometry</h1>
<div class="sub">Your 3-week revision plan &nbsp;{heart(13, "#f08bb3")}&nbsp; Year 12 Mathematics Standard 2</div>
<div class="pill">5 questions a day &nbsp;•&nbsp; 15 days &nbsp;•&nbsp; 6 treats along the way</div>
<div class="q">“Small steps every day add up to big results.”</div>
<div style="margin:9mm auto 0;width:110mm;text-align:left;font-family:Poppins;font-weight:300;font-size:9pt;color:#8a6a90">Name<div style="border-bottom:1px solid #d9b3c8;height:8mm"></div></div>
</div>
<div class="credit">Made especially for you &nbsp;{spark(10, "#c2477a")}&nbsp; Kingscliff High School</div>
</div>""")

# ---------- welcome page ----------
rew_rows = "".join(
    f'<tr><td>{gift(20)} Q{q}</td><td><b>{h}</b><br><span style="color:#7a6a80">Treat idea: {t}</span></td></tr>'
    for _, (q, h, t) in sorted(MILES.items()))
pages.append(f"""<div class="page">
<div class="banner slim"><h1>Hi there! {heart(15, "#c2477a")}</h1></div>
<div class="cols2" style="grid-template-columns:1.05fr 1fr;gap:7mm">
<div class="letter">
<p>Exams can feel big and scary, and it’s completely normal to feel stressed. Feeling stressed usually means you care, and that’s a good thing.</p>
<p>This booklet breaks <b>everything</b> from Ratios and rates and Trigonometry into <b>tiny pieces</b>: just <b>5 questions a day</b>, 5 days a week, for 3 weeks. Do today’s five, then stop. That’s enough for today.</p>
<p>The questions start easy and slowly get harder, so by Week 3 you’ll be ready for HSC-style questions. Do your working and diagrams in your exercise book, then mark them with the answers at the back.</p>
<p>Along the way there are <b>6 milestones</b>. Each time you reach one, you’ve earned a treat. Fill in your own treat on the coupon, then go and enjoy it!</p>
<p>Colour in a heart on page 3 for every question you finish, and watch them fill up.</p>
<p>I believe in you.</p>
<div style="border-bottom:1px solid #d9b3c8;width:60mm;height:10mm"></div>
</div>
<div>
<div class="panel"><h3>Your treats {spark(10,"#fff")}</h3><div class="pb" style="padding:1.5mm 3mm"><table class="rewards">{rew_rows}</table></div></div>
</div></div>
<div class="cols2" style="margin-top:3mm;gap:5mm">
<div class="weekbox"><b class="k">When it feels like a lot</b>
<ul style="margin:1mm 0 0;padding-left:4.5mm;font-size:9.9pt">
<li>Just do today’s five. You don’t have to do it all at once.</li>
<li>Stuck for 5 minutes? Circle it, check the help sheet, then move on.</li>
<li>Try box breathing: in for 4, hold for 4, out for 4, hold for 4.</li>
<li>Sleep, water and a walk outside help your brain more than cramming.</li>
<li>If the stress ever feels like too much, please talk to someone: me, your Year Adviser or the school counsellor.</li>
</ul></div>
<div class="sandbox"><span class="lab">What’s inside</span>
<table style="margin-top:1mm;width:100%;font-size:10pt;border-collapse:collapse">
<tr><td>Heart tracker and planner</td><td style="text-align:right">3</td></tr>
<tr><td>Week 1: Warm up (Days 1–5)</td><td style="text-align:right">4</td></tr>
<tr><td>Week 2: Level up (Days 6–10)</td><td style="text-align:right">9</td></tr>
<tr><td>Week 3: Exam ready (Days 11–15)</td><td style="text-align:right">14</td></tr>
<tr><td>You did it! + exam-day tips</td><td style="text-align:right">19</td></tr>
<tr><td>Help sheets</td><td style="text-align:right">20–21</td></tr>
<tr><td>Answers</td><td style="text-align:right">22–23</td></tr></table>
<p style="font-size:9pt;margin:1.5mm 0 0;color:#7a6a80">You’ll need a calculator in <b>degrees</b> mode, a ruler, a pencil and your exercise book.</p></div>
</div>
<p style="font-size:8.6pt;color:#8a7a90;margin-top:3mm">We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. &nbsp;Outcomes: MST-12-S2-04, MST-12-S2-05, MAO-WM-01 (NSW Mathematics Standard 11–12 Syllabus, 2024).</p>
{foot(2)}</div>""")

# ---------- heart tracker ----------
def heart_num(n, mile=False):
    stroke = "#c2477a" if mile else "#e39abb"
    fill = "#fff0f6" if mile else "#ffffff"
    return f'<span class="hn">{heart(25, fill, stroke, 1.25)}<span>{n}</span></span>'


weeks_html = []
for w in range(3):
    rows = []
    for d in range(5):
        di = 5 * w + d
        hs = "".join(heart_num(5 * di + k + 1, (5 * di + k + 1) in [m[0] for m in MILES.values()]) for k in range(5))
        g = f'&nbsp;{gift(17)}' if di in MILES else ""
        rows.append(f'<div class="drow"><span class="dl">Day {di+1}</span>{hs}{g}</div>')
    weeks_html.append(f'<div class="wk"><h4>Week {w+1}: {WEEKS[w][0]}</h4>{"".join(rows)}</div>')

trk = []
for di, day in enumerate(DAYS):
    tot = sum(qmarks(q) for q in day)
    trk.append(f'<tr><td>Day {di+1}</td><td></td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {tot}</td><td>{faces()}</td></tr>')

pages.append(f"""<div class="page">
<div class="banner slim"><h1>My heart tracker {spark(12,"#7a4fa3")} <span>colour in a heart for every question you finish</span></h1></div>
<div class="panel" style="margin-bottom:4mm"><div class="pb"><div class="hgrid">{"".join(weeks_html)}</div>
<p style="font-family:Poppins;font-weight:300;font-size:8pt;color:#7a6a80;margin:2mm 0 0">{gift(15)} = treat time! The hearts with a darker outline are your milestones.</p></div></div>
<div class="cols2" style="grid-template-columns:1.25fr 1fr;gap:6mm">
<div><table class="trk"><tr><th>Day</th><th>Date</th><th>Marks</th><th>How I felt</th></tr>{"".join(trk)}</table></div>
<div>
<div class="weekbox" style="margin-bottom:3mm"><b class="k">Why track it?</b><br>On a stressful day, look back at this page. Every coloured heart is proof of the work you’ve done.</div>
<div class="sandbox"><span class="lab">Questions to ask my teacher</span>
<div style="height:62mm;background:repeating-linear-gradient(#fff1f6,#fff1f6 8.4mm,#efc7da 8.4mm,#efc7da 8.7mm)"></div></div>
</div></div>
{foot(3)}</div>""")

# ---------- day pages ----------
for di, day in enumerate(DAYS):
    w = di // 5
    tot = sum(qmarks(q) for q in day)
    pno = 4 + di
    if di % 5 == 0:
        box = f'<div class="weekbox"><b class="k">Week {w+1}: {WEEKS[w][0]} {spark(10,"#7a4fa3")}</b><br>{WEEKS[w][1]}</div>'
    else:
        box = f'<div class="sandbox tipbox" style="padding:2mm 4.5mm">{heart(15,"#f08bb3")}<span><span class="lab">Tip for today</span> &nbsp;{TIPS[di]}</span></div>'
    qs = "".join(build.q_html(5 * di + i + 1, q) for i, q in enumerate(day))
    if di in MILES:
        n, h, t = MILES[di]
        bottom = (f'<div class="coupon">{gift(34)}<div style="flex:1"><div class="h">{h}</div>'
                  f'<div>Treat idea: {t}{"" if t.endswith("!") else "."} &nbsp;My treat: <span class="line"></span> Claimed <span class="tick"></span></div></div>'
                  f'<div class="c">You earned<br>this one!</div></div>')
    else:
        bottom = (f'<div class="checkin"><span><b>Day {di+1} check-in</b> &nbsp; Marks: <span class="blank"></span>/ {tot}</span>'
                  f'<span>How do I feel? {faces()}</span></div>')
    pages.append(f"""<div class="page day">
<div class="banner"><div class="bnum">{di+1}</div><div class="btxt"><h1>Week {w+1} &nbsp;•&nbsp; Day {di % 5 + 1}</h1>
<div>Questions {5*di+1}–{5*di+5} &nbsp;•&nbsp; {tot} marks &nbsp;•&nbsp; about {build.mins(tot)} minutes</div></div>
<div class="bq">“{QUOTES[di]}”</div></div>
{box}
<div class="qs">{qs}</div>
{bottom}
{foot(pno)}</div>""")

# ---------- you did it + exam tips ----------
pages.append(f"""<div class="page">
<div class="cert"><div class="dec"></div>
<div style="margin-top:4mm">{heart(46,"#f08bb3")}</div>
<div class="big">You did it!</div>
<p style="font-family:Poppins;font-weight:500;color:#4a3354;font-size:13pt">75 questions. 15 days. Ratios, rates and trigonometry: done.</p>
<p>All that practice is in your head now, and it will be there on exam day.<br>Be really proud of yourself.</p>
<div style="display:flex;justify-content:center;gap:10mm;margin-top:10mm;font-family:Poppins;font-weight:300;font-size:9pt;color:#6a5070">
<div><div style="border-bottom:1px solid #b58aa6;width:52mm;height:9mm"></div>Name</div>
<div><div style="border-bottom:1px solid #b58aa6;width:45mm;height:9mm"></div>Teacher</div>
<div><div style="border-bottom:1px solid #b58aa6;width:30mm;height:9mm"></div>Date</div></div>
</div>
<div class="cols2" style="position:absolute;left:15mm;right:15mm;top:156mm;gap:6mm">
<div class="panel"><h3>The night before</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Look over your help sheets, not new questions.</li>
<li>Pack: calculator (check it’s in <b>degrees</b>!), spare batteries, pens, pencil, ruler, eraser and water.</li>
<li>Do something relaxing, and get a good night’s sleep. Sleep helps you remember.</li>
</ul></div></div>
<div class="panel"><h3>In the exam</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Take three slow breaths before you start.</li>
<li>Use the reference sheet. The trig rules are on it!</li>
<li>Start with questions you feel good about.</li>
<li>Draw a diagram and show every step. Working earns marks.</li>
<li>Never leave a question blank. Write what you know.</li>
</ul></div></div>
</div>
<div style="position:absolute;left:0;right:0;top:238mm;text-align:center" class="hand"><span style="font-size:24pt;color:#7a4fa3">“Believe in the work you’ve put in.”</span><br>
<span style="font-size:15pt;color:#c2477a">Good luck. You’ve got this. {heart(16,"#f08bb3")}</span></div>
{foot(19)}</div>""")

# ---------- help sheets (re-footed and re-numbered) ----------
for k, p in enumerate((helpsheet.p1, helpsheet.p2)):
    p = p.replace(helpsheet.FOOT, FOOT)
    p = re.sub(r'<span class="pno">\d+</span>', f'<span class="pno">{20+k}</span>', p)
    pages.append(p)

# ---------- answers ----------
for k, rng in enumerate((range(0, 8), range(8, 15))):
    sub = "mark your work, then colour in your hearts" if k == 0 else "continued"
    pages.append(f"""<div class="page ansp">
<div class="banner slim"><h1>Answers <span>{sub}</span></h1></div>
<div class="ans">{build.ans_block(rng)}</div>
{foot(22 + k)}</div>""")

CSS_ALL = CSS + helpsheet.CSS[len(build.CSS):] if helpsheet.CSS.startswith(build.CSS) else CSS + helpsheet.CSS
html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>My revision booklet</title><style>{CSS_ALL}</style></head><body>{"".join(pages)}</body></html>"""
open("girl.html", "w").write(html)
print("pages", len(pages))
