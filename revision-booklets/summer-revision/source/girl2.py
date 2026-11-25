# -*- coding: utf-8 -*-
"""Girls' summer revision booklet: Christmas (weeks 1-2) blending into summer (weeks 3-6)."""
import girl                                   # pastel theme + icons from the earlier booklet
from girl import heart, spark, gift, faces
import build
import summer_common as sc
from content2 import DAYS

FOOT = "My summer revision booklet • Year 12 Mathematics Standard 2"


# ---------- extra icons ----------
def tree(s=16):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" style="vertical-align:middle">'
            '<path d="M12 3 4.5 13h3.2L4 19h16l-3.7-6h3.2z" fill="#6fb38a"/><rect x="10.6" y="19" width="2.8" height="3" fill="#a5714b"/>'
            '<path d="M12 .6l.8 1.7 1.8.2-1.4 1.2.4 1.8-1.6-.9-1.6.9.4-1.8L9.4 2.5l1.8-.2z" fill="#f2c14e"/></svg>')


def bauble(s=16, col="#e0506e"):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" style="vertical-align:middle">'
            f'<rect x="9.5" y="2.5" width="5" height="3.5" rx="1" fill="#f2c14e"/><circle cx="12" cy="14" r="8.5" fill="{col}"/>'
            '<path d="M6 12.5q6 3.5 12 0" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/></svg>')


def sunicon(s=16):
    rays = "".join(f'<line x1="{12+8.2*__import__("math").cos(a/57.3):.1f}" y1="{12+8.2*__import__("math").sin(a/57.3):.1f}" '
                   f'x2="{12+11*__import__("math").cos(a/57.3):.1f}" y2="{12+11*__import__("math").sin(a/57.3):.1f}" stroke="#f5a623" stroke-width="1.8" stroke-linecap="round"/>'
                   for a in range(0, 360, 45))
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" style="vertical-align:middle">{rays}<circle cx="12" cy="12" r="6" fill="#ffc94d"/></svg>'


def wave(s=16):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" style="vertical-align:middle">'
            '<path d="M2 15q3-4 6 0t6 0 6 0" stroke="#3fb6c0" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
            '<path d="M2 20q3-4 6 0t6 0 6 0" stroke="#86d5d9" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>')


def phase(di):
    return "xmas" if di < 10 else ("blend" if di < 15 else "summer")


def icon_for(di, s=16):
    return {"xmas": tree(s) if di % 2 == 0 else bauble(s), "blend": spark(s, "#f2c14e"), "summer": sunicon(s) if di % 2 == 0 else wave(s)}[phase(di)]


# ---------- words ----------
QUOTES = [
    "’Tis the season to keep your skills sparkling.",
    "A little practice is the best gift to your future self.",
    "Small steps, big sparkle.",
    "Be merry, be bright, be brilliant.",
    "Week 1, wrapped up with a bow!",
    "You don’t have to be perfect, just consistent.",
    "Leftover pavlova and four questions. Perfect.",
    "Shine brighter than the Christmas lights.",
    "Make this year’s resolution easy: four a day.",
    "Two weeks done. Sparklers out!",
    "Hello January. Hello sunshine.",
    "New year, same brilliant you.",
    "Mistakes are proof that you’re trying.",
    "Sunscreen on, skills sharp.",
    "Halfway there. Look at you go!",
    "Salty hair, sharp mind.",
    "Progress, not perfection.",
    "Good vibes and good working out.",
    "Every question makes the next one easier.",
    "Four weeks done. Beach day earned!",
    "Chase sunsets and solutions.",
    "Believe in the work you’ve put in.",
    "Calm mind, clear diagram, one step at a time.",
    "You’re building something great.",
    "Five weeks! Nearly there, superstar.",
    "Final week of summer. Let’s glow.",
    "Year 12 is going to be your year.",
    "Confidence comes from practice, and you’ve practised.",
    "Second last day. Keep shining!",
    "Summer: complete. Year 12: ready.",
]
TIPS = {
    1: "Keep it short and sweet: four questions, then go and enjoy the festive season.",
    2: "Draw a big, labelled diagram before you calculate. It does half the thinking for you.",
    3: "Busy day? Pick one question now and do the rest tonight. Every bit counts.",
    4: "Last day of Week 1! Finish these four and claim your treat.",
    6: "Lost your place over Christmas? No stress. Just start again today.",
    7: "Stuck? Circle it, check the help sheets at the back, then move on.",
    8: "Write one step per line, with the equals signs lined up. It’s easier to check.",
    9: "Two weeks done today. Flick back to Day 1. It already feels easier, right?",
    11: "Network questions: highlight the saturated edges and draw the cut in a different colour.",
    12: "Check the units before you start: mm → m, minutes → hours, W → kW.",
    13: "Keep the full calculator value until the last line. Round once, at the end.",
    14: "Halfway day! Treat yourself after this one.",
    16: "Do your four in the cool of the morning, then the day is yours.",
    17: "Mark your work straight away. Fixing a mistake now locks in the right method.",
    18: "Part marks are real marks. Write every step, even if you’re unsure.",
    19: "Feeling flat? Box breathing: in for 4, hold for 4, out for 4, hold for 4.",
    21: "Say the method out loud before you start: formula, ratio, rate, trig or network?",
    22: "Sense check: is your answer realistic? A pool won’t hold 3 litres!",
    23: "Questions you circled are gold. Take them to your teacher in Week 1 of Term 1.",
    24: "Five weeks done today. Be proud of yourself!",
    26: "Last week of summer. Four questions, then enjoy every minute.",
    27: "Pack your school bag early: calculator in degrees mode, ruler, this booklet.",
    28: "Look how much you remember. Year 12 is going to feel so much easier.",
    29: "Final day! Finish strong, then go and celebrate.",
}
WEEKS = [
    ("Christmas countdown", "Easy does it. Four quick questions a day, then go and enjoy the festive season."),
    ("Merry and bright", "Between the pavlova and the fireworks, keep your skills sparkling. Take public holidays off and catch up later: no stress."),
    ("Hello January", "A brand-new year. Summer vibes are kicking in, and so is your confidence."),
    ("Beach days", "Sun, sand and sharp skills. Do your four, then hit the beach."),
    ("Golden hour", "You’re in the groove now. These feel easier than Week 1, don’t they?"),
    ("Back-to-school glow-up", "The final week of summer. Finish strong and walk into Year 12 ready."),
]
# day index -> (questions done, headline, treat idea)
MILES = {
    1: (8, "First 8 questions done!", "a candy cane or a gingerbread cookie"),
    4: (20, "Week 1, wrapped up!", "a Christmas movie night"),
    9: (40, "40 questions: hello New Year!", "a bowl of cherries or a mango smoothie"),
    14: (60, "Halfway: 60 questions!", "a beach day with your friends"),
    19: (80, "80 questions done!", "gelato or an açaí bowl"),
    24: (100, "100 questions!", "a sunset picnic"),
    29: (120, "ALL 120 QUESTIONS DONE!", "a big end-of-summer treat. You’ve earned it!"),
}

THEME2 = r"""
.banner.xmas,.banner.slim.xmas{background:#f5b9c8 url(bg2_xmas.jpg) center/cover no-repeat}
.banner.blend{background:#fbd0c3 url(bg2_blend.jpg) center/cover no-repeat}
.banner.summer,.banner.slim{background:#ffc7b3 url(bg2_summer.jpg) center/cover no-repeat}
.scover{background:#f9d6d8 url(bg2_gcover.jpg) center/cover no-repeat}
.hs .banner{background:#ffc7b3 url(bg2_summer.jpg) center/cover no-repeat}
.cert{background:#f9d6d8 url(bg2_gcover.jpg) center 70%/cover no-repeat}
.trk2{width:100%;border-collapse:collapse;font-size:9pt}
.trk2 td{padding:.55mm 1mm;border-bottom:1px solid #f1d9e4;vertical-align:middle}
.trk2 .dl{font-family:Poppins;font-weight:400;color:#7a4fa3;font-size:8pt;white-space:nowrap}
.trk2 h5{font-family:Poppins;font-weight:500;color:#c2477a;font-size:9pt;margin:2.4mm 0 .6mm}
.tk{position:relative;display:inline-block;width:23px;height:23px;margin-right:1px}
.tk b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Poppins;font-weight:500;font-size:6.3pt;color:#5a3d6a;padding-top:3px}
.faces.sm svg{width:14px;height:14px}
.coupon .ico{display:flex;flex-direction:column;align-items:center;gap:1mm}
.page.day{display:flex;flex-direction:column}
.page.day>*{flex-shrink:0}
.page.day>.scene{flex-shrink:1}
.scene{flex:0 1 50mm;min-height:0;margin:3mm 0 14mm;margin-top:auto;background:center bottom/contain no-repeat}
.scene.xmas{background-image:url(scene_sx.jpg)}
.scene.blend{background-image:url(scene_sb.jpg)}
.scene.summer{background-image:url(scene_ss.jpg)}
"""
CSS = girl.CSS + THEME2 + sc.EXTRA_CSS
CSS_ALL = CSS + sc.HELP_CSS


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


def mini_faces():
    from girl import face
    return f'<span class="faces sm">{face("low",14)}{face("mid",14)}{face("high",14)}</span>'


def track_icon(di, n):
    if di < 10:
        base = bauble(23, "#f6a7bd")
    elif di < 15:
        base = f'<svg width="23" height="23" viewBox="0 0 24 24"><path d="M12 1.5l2.9 6.4 7 .7-5.3 4.7 1.6 6.9L12 16.6l-6.2 3.6 1.6-6.9L2.1 8.6l7-.7z" fill="#fde6a6" stroke="#e8b84a" stroke-width="1"/></svg>'
    else:
        base = f'<svg width="23" height="23" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#ffe3b0" stroke="#f5a623" stroke-width="1.2"/></svg>'
    return f'<span class="tk">{base}<b>{n}</b></span>'


pages = []
# ---------- cover ----------
pages.append(f"""<div class="page scover"><div class="dec"></div>
<div class="card">
<img class="logo" src="kingscliff-logo.png">
<div class="hi" style="font-size:38pt">Jingle all the way to Year 12!</div>
<h1>Summer holiday revision</h1>
<div class="sub">Year 12 Mathematics Standard 2 &nbsp;{tree(14)}&nbsp; Christmas to January</div>
<div class="pill">4 questions a day &nbsp;•&nbsp; 6 weeks &nbsp;•&nbsp; 7 treats along the way</div>
<div style="margin-top:7mm;font-family:Poppins;font-weight:300;font-size:9pt;color:#7a5a80;line-height:1.6">Formulas and equations • Applications of measurement<br>Ratios and rates • Trigonometry • Network flow</div>
<div style="margin:8mm auto 0;width:110mm;text-align:left;font-family:Poppins;font-weight:300;font-size:9pt;color:#8a6a90">Name<div style="border-bottom:1px solid #d9b3c8;height:8mm"></div></div>
</div>
<div class="credit">Made especially for you &nbsp;{spark(10, "#c2477a")}&nbsp; Kingscliff High School</div>
</div>""")

# ---------- welcome ----------
rew_rows = "".join(f'<tr><td>{gift(18)} Q{q}</td><td><b>{h}</b><br><span style="color:#7a6a80">Treat idea: {t}</span></td></tr>'
                   for _, (q, h, t) in sorted(MILES.items()))
pages.append(f"""<div class="page">
<div class="banner slim xmas"><h1>Hi there! {heart(15, "#c2477a")}</h1></div>
<div class="cols2" style="grid-template-columns:1.05fr 1fr;gap:7mm">
<div class="letter">
<p>Merry Christmas, and welcome to summer! You’ve worked hard this year, so this booklet is <b>light on purpose</b>: just <b>4 quick questions a day</b>, Monday to Friday, for the 6 weeks of the holidays. That’s 20 a week and about 15 minutes a day.</p>
<p>It keeps your core skills fresh from <b>Year 11</b> (formulas and equations, measurement) and the start of <b>Year 12</b> (ratios and rates, trigonometry, network flow), so Term 1 feels easy.</p>
<p>Weeks 1 and 2 are Christmas-themed, then we slide into summer for January. Do your working in your exercise book, then mark it with the answers at the back. There are help sheets at the back too.</p>
<p>Along the way there are <b>7 treats</b> to earn. Write your own treat on each coupon, then go and enjoy it!</p>
<p>Colour in a bauble, star or sun on page 3 for every question you finish.</p>
<div style="border-bottom:1px solid #d9b3c8;width:60mm;height:9mm"></div>
</div>
<div><div class="panel"><h3>Your treats {spark(10,"#fff")}</h3><div class="pb" style="padding:1.5mm 3mm"><table class="rewards">{rew_rows}</table></div></div></div>
</div>
<div class="cols2" style="margin-top:3mm;gap:5mm">
<div class="weekbox"><b class="k">Holiday rules</b>
<ul style="margin:1mm 0 0;padding-left:4.5mm;font-size:9.9pt">
<li>Four questions, then stop. That’s enough for today.</li>
<li>Christmas Day, Boxing Day and New Year’s Day are days off. Catch up later.</li>
<li>Stuck for 5 minutes? Circle it, check the help sheets, then move on.</li>
<li>Rest, sunshine and sleep are part of the plan too.</li>
<li>If anything feels like too much, talk to someone you trust, or your Year Adviser or school counsellor when school is back.</li>
</ul></div>
<div class="sandbox"><span class="lab">What’s inside</span>
<table style="margin-top:1mm;width:100%;font-size:10pt;border-collapse:collapse">
<tr><td>My tracker</td><td style="text-align:right">3</td></tr>
<tr><td>Weeks 1–2: Christmas (Days 1–10)</td><td style="text-align:right">4</td></tr>
<tr><td>Week 3: Hello January (Days 11–15)</td><td style="text-align:right">14</td></tr>
<tr><td>Weeks 4–6: Summer (Days 16–30)</td><td style="text-align:right">19</td></tr>
<tr><td>Summer complete!</td><td style="text-align:right">34</td></tr>
<tr><td>Help sheets</td><td style="text-align:right">35–39</td></tr>
<tr><td>Answers</td><td style="text-align:right">40–42</td></tr></table>
<p style="font-size:9pt;margin:1.5mm 0 0;color:#7a6a80">You’ll need a calculator in <b>degrees</b> mode, a ruler, a pencil and your exercise book.</p></div>
</div>
<p style="font-size:8.4pt;color:#8a7a90;margin-top:3mm">We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. &nbsp;Outcomes: MST-11-01, MST-11-05, MST-12-S2-04, MST-12-S2-05, MST-12-S2-06, MAO-WM-01 (NSW Mathematics Standard 11–12 Syllabus, 2024).</p>
{foot(2)}</div>""")

# ---------- tracker ----------
def tracker_col(weeks):
    rows = []
    for w in weeks:
        rows.append(f'<tr><td colspan="4"><h5>Week {w+1}: {WEEKS[w][0]}</h5></td></tr>')
        for d in range(5):
            di = 5 * w + d
            icons = "".join(track_icon(di, 4 * di + k + 1) for k in range(4))
            g = gift(15) if di in MILES else ""
            rows.append(f'<tr><td class="dl">Day {di+1}</td><td style="white-space:nowrap">{icons} {g}</td>'
                        f'<td style="font-size:8.4pt;color:#7a6a80;white-space:nowrap">&nbsp;&nbsp;&nbsp;&nbsp;/ {sc.day_marks(di)}</td><td>{mini_faces()}</td></tr>')
    return f'<table class="trk2">{"".join(rows)}</table>'


pages.append(f"""<div class="page">
<div class="banner slim xmas"><h1>My summer tracker {spark(12,"#7a4fa3")} <span>colour one in for every question • write your marks • circle a face</span></h1></div>
<div class="cols2" style="gap:6mm">{tracker_col([0,1,2])}{tracker_col([3,4,5])}</div>
<p style="font-family:Poppins;font-weight:300;font-size:8pt;color:#7a6a80;margin-top:2mm">{gift(14)} = treat time! &nbsp;Baubles for Christmas, stars for New Year, suns for summer.</p>
{foot(3)}</div>""")

# ---------- days ----------
for di in range(30):
    w = di // 5
    tot = sc.day_marks(di)
    ph = phase(di)
    if di % 5 == 0:
        box = f'<div class="weekbox"><b class="k">Week {w+1}: {WEEKS[w][0]} {icon_for(di, 14)}</b><br>{WEEKS[w][1]}</div>'
    else:
        box = f'<div class="sandbox tipbox" style="padding:2mm 4.5mm">{icon_for(di, 17)}<span><span class="lab">Tip for today</span> &nbsp;{TIPS[di]}</span></div>'
    if di in MILES:
        n, h, t = MILES[di]
        bottom = (f'<div class="coupon">{gift(34)}<div style="flex:1"><div class="h">{h}</div>'
                  f'<div>Treat idea: {t}{"" if t.endswith("!") else "."} &nbsp;My treat: <span class="line"></span> Claimed <span class="tick"></span></div></div>'
                  f'<div class="c">You earned<br>this one!</div></div>')
    else:
        bottom = (f'<div class="checkin"><span><b>Day {di+1} check-in</b> &nbsp; Marks: <span class="blank"></span>/ {tot}</span>'
                  f'<span>How do I feel? {faces()}</span></div>')
    pages.append(f"""<div class="page day">
<div class="banner {ph}"><div class="bnum">{di+1}</div><div class="btxt"><h1>Week {w+1} &nbsp;•&nbsp; Day {di % 5 + 1}</h1>
<div>Questions {4*di+1}–{4*di+4} &nbsp;•&nbsp; {tot} marks &nbsp;•&nbsp; about 15 minutes</div></div>
<div class="bq">“{QUOTES[di]}”</div></div>
{box}
<div class="qs">{sc.day_questions(di)}</div>
<div class="scene {ph}"></div>
{bottom}
{foot(4 + di)}</div>""")

# ---------- summer complete ----------
pages.append(f"""<div class="page">
<div class="cert"><div class="dec"></div>
<div style="margin-top:2mm">{heart(42,"#f08bb3")}</div>
<div class="big">Summer: complete!</div>
<p style="font-family:Poppins;font-weight:500;color:#4a3354;font-size:13pt">120 questions. 6 weeks. All five topics: fresh.</p>
<p>You kept your skills sparkling all summer. Year 12 is going to feel so much easier.<br>Be really proud of yourself.</p>
<div style="display:flex;justify-content:center;gap:10mm;margin-top:9mm;font-family:Poppins;font-weight:300;font-size:9pt;color:#6a5070">
<div><div style="border-bottom:1px solid #b58aa6;width:52mm;height:9mm"></div>Name</div>
<div><div style="border-bottom:1px solid #b58aa6;width:45mm;height:9mm"></div>Teacher</div>
<div><div style="border-bottom:1px solid #b58aa6;width:30mm;height:9mm"></div>Date</div></div>
</div>
<div class="cols2" style="position:absolute;left:15mm;right:15mm;top:156mm;gap:6mm">
<div class="panel"><h3>Before Term 1</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Pack your bag: calculator (check it’s in <b>degrees</b>!), ruler, pens, pencil, exercise book.</li>
<li>Get back into a school sleep routine a few days early.</li>
<li>Put this booklet in your bag. Your circled questions are your first questions for class.</li>
</ul></div></div>
<div class="panel"><h3>Week 1 of Year 12</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Ask about the questions you circled.</li>
<li>Keep the habit: a few questions a day beats cramming.</li>
<li>Use your help sheets whenever a topic comes back.</li>
<li>You’ve got this. You’ve already done the work.</li>
</ul></div></div>
</div>
<div style="position:absolute;left:0;right:0;top:238mm;text-align:center" class="hand"><span style="font-size:24pt;color:#7a4fa3">“Year 12 is going to be your year.”</span><br>
<span style="font-size:15pt;color:#c2477a">Have the best summer. {heart(16,"#f08bb3")}</span></div>
{foot(34)}</div>""")

pages += sc.help_pages(FOOT, 35)
for k, rng in enumerate((range(0, 10), range(10, 20), range(20, 30))):
    sub = "mark your work, then colour in your tracker" if k == 0 else "continued"
    pages.append(f"""<div class="page ansp">
<div class="banner slim"><h1>Answers <span>{sub}</span></h1></div>
<div class="ans">{sc.ans_html(rng)}</div>
{foot(40 + k)}</div>""")

html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Summer revision</title><style>{CSS_ALL}</style></head><body>{"".join(pages)}</body></html>"""
open("girl2.html", "w").write(html)
print("pages", len(pages))
