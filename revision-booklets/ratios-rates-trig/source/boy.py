# -*- coding: utf-8 -*-
"""'Training block' version of the revision booklet for boys (same questions and answers)."""
import re
import build
import helpsheet
from content import DAYS, qmarks

FOOT = "Training block • Ratios, rates and trigonometry • Year 12 Standard 2"
ORANGE, LIME, INK, SLATE = "#ff5a1f", "#c6f135", "#12161d", "#232b38"


# ---------- icons ----------
def bolt(size=14, fill=ORANGE):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" style="vertical-align:middle">'
            f'<path d="M13.5 1 4 13.5h6.5L9 23l11-13.5h-6.7L13.5 1z" fill="{fill}"/></svg>')


def lock(size=22, open_=True, col=ORANGE):
    shackle = "M7 10V7a5 5 0 0 1 9.6-2" if open_ else "M7 10V7a5 5 0 0 1 10 0v3"
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" style="vertical-align:middle">'
            f'<path d="{shackle}" fill="none" stroke="{col}" stroke-width="2.2" stroke-linecap="round"/>'
            f'<rect x="4" y="10" width="16" height="12" rx="2.5" fill="{col}"/>'
            '<circle cx="12" cy="15.5" r="1.7" fill="#fff"/><rect x="11.2" y="16" width="1.6" height="3" fill="#fff"/></svg>')


def trophy(size=60):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 64 64">'
            f'<path d="M18 8h28v14c0 9-6 16-14 16s-14-7-14-16V8z" fill="{LIME}"/>'
            f'<path d="M18 12H9c0 9 4 14 10 15M46 12h9c0 9-4 14-10 15" fill="none" stroke="{LIME}" stroke-width="3.5"/>'
            f'<rect x="28" y="37" width="8" height="10" fill="{LIME}"/><rect x="19" y="47" width="26" height="7" rx="1.5" fill="{ORANGE}"/></svg>')


def conf():
    dots = "".join(f'<i>{k}</i>' for k in range(1, 6))
    return f'<span class="conf">{dots}</span>'


# ---------- words ----------
QUOTES = [
    "Show up. Do five. Done.",
    "Nobody gets good without reps.",
    "Mistakes here mean fewer in the exam.",
    "Lock in. Twenty minutes. Go.",
    "Week one’s in the bank.",
    "Discipline beats motivation.",
    "You don’t have to feel ready. Just start.",
    "Halfway. Don’t ease off now.",
    "One percent better every session.",
    "Two weeks straight. That’s a streak.",
    "Hard in training. Easy on game day.",
    "Do the work nobody sees.",
    "Calm head. Draw it. Solve it.",
    "One more. Stay locked in.",
    "Final session. Finish the job.",
]
TIPS = {
    1: "Stuck? Skip it and come back. Don’t let one question eat your whole session.",
    2: "Draw a big labelled diagram first. That’s half the work done.",
    3: "Call the play before you start: ratio, rate, SOH CAH TOA, sine rule or cosine rule?",
    4: "Last session of the week. Finish it and unlock your reward.",
    6: "Keep the full calculator value until the last line. Round once, at the end.",
    7: "Check the units first: mm → m, minutes → hours, W → kW. Easy marks otherwise lost.",
    8: "Part marks count. Write every step, even if you’re not sure it’s right.",
    9: "Flick back to Session 1. Easy now, right? That’s the training working.",
    11: "Head scrambled? Box breathing: in for 4, hold for 4, out for 4, hold for 4. Then start with the easiest one.",
    12: "These are meant to be hard. Grab the part marks and move on.",
    13: "Sanity check: longest side opposite the largest angle? Bearing matches your sketch?",
    14: "Final session. Finish it, then go and celebrate.",
}
WEEKS = [
    ("Pre-season", "Build the base and build the habit. Mostly ● and ●● questions, with short HSC-style questions to get you started."),
    ("Build", "Two or more steps per question now. Draw the diagram first and use the help sheet when you need it."),
    ("Match fitness", "Exam-level questions, like the last ones on the HSC paper. Picking up part marks here is a win."),
]
MILES = {
    1: (10, "Level 1 cleared", "an hour of gaming, guilt-free"),
    4: (25, "Pre-season done", "a proper feed: burger, kebab, whatever you’re into"),
    7: (40, "Past halfway", "a surf, a skate or a gym session"),
    9: (50, "Build phase done", "a night off: a movie, a game or your mates"),
    12: (65, "Final week loading", "a game of footy, basketball or whatever with your mates"),
    14: (75, "Block complete", "something big. You earned it"),
}

THEME = r"""
@font-face{font-family:'TeX Gyre Pagella';font-weight:400;font-style:normal;src:url(fonts/pagella-regular.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:400;font-style:italic;src:url(fonts/pagella-italic.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:700;font-style:normal;src:url(fonts/pagella-bold.ttf)}
@font-face{font-family:'TeX Gyre Pagella';font-weight:700;font-style:italic;src:url(fonts/pagella-bolditalic.ttf)}
@font-face{font-family:Bebas;src:url(fonts/bebas.woff2)}
:root{--blue:#e24c12;--maroon:#232b38;--sand:#f3f4f6;--pink:#eef0f3;--pale:#eef1f5;--or:#ff5a1f;--lime:#c6f135;--ink:#12161d;--slate:#232b38}
body{color:#1b1f26}
.foot{color:#9aa1ab}
.pno{background:var(--ink);color:var(--lime);font-family:Bebas;font-size:11pt;border-radius:4px}
.banner{background:#151a23 url(bgb_band.jpg) center/cover no-repeat;border-radius:6px;overflow:hidden}
.banner:before{display:none}
.bnum{background:transparent;border:2px solid var(--lime);border-radius:4px;width:20mm;height:19mm;flex-direction:column;color:var(--lime);font-family:Bebas;font-size:30pt;line-height:.85;padding-top:1mm}
.bnum small{font-family:Poppins;font-size:5.6pt;letter-spacing:1.5px;color:#cfd6df;font-weight:500}
.btxt h1{color:#fff !important;font-family:Bebas !important;font-size:21pt !important;line-height:1 !important;letter-spacing:.6px;font-weight:400 !important}
.btxt div,.banner.slim h1 span{color:#aab4c2 !important}
.banner.slim h1{color:#fff;font-family:Bebas;font-size:19pt;letter-spacing:.6px;font-weight:400}
.banner.slim h1 span{font-family:Poppins;font-size:8pt;letter-spacing:0}
.btxt .bq{font-family:Bebas;font-size:14.5pt;line-height:1;letter-spacing:.7px;color:var(--lime) !important;margin-top:1.4mm}
.panel{border:1.5px solid #d6dbe2;border-radius:6px}
.panel h3{background:var(--ink);color:#fff;font-family:Poppins;font-weight:500;letter-spacing:.2px}
.panel h3 span{color:#aab4c2}
.sandbox{background:#f3f4f6;border:none;border-left:4px solid var(--or);border-radius:4px}
.weekbox{background:var(--ink);color:#e7ebf0;border:none;border-radius:6px}
.weekbox b.k{color:var(--lime);font-family:Bebas;font-size:13pt;letter-spacing:.6px;font-weight:400;text-transform:none}
.lab{color:var(--or);font-family:Poppins;font-weight:600;letter-spacing:.5px;font-size:8.6pt;text-transform:uppercase}
.qn{color:var(--or);font-family:Bebas;font-size:19pt;line-height:1}
.dots{color:var(--or)}
.hsch{color:var(--slate);font-weight:600;text-transform:uppercase;letter-spacing:.6px;font-size:7.6pt}
.q{border-bottom:1.5px solid #e3e6ea}
.checkin{border:1.5px solid #d6dbe2;border-radius:6px;background:#fafbfc}
.checkin b{color:var(--ink);font-family:Bebas;font-size:12.5pt;font-weight:400;letter-spacing:.5px}
.conf{display:inline-flex;gap:1.4mm;margin-left:1.5mm;vertical-align:middle}
.conf i{font-style:normal;width:15px;height:15px;border:1.4px solid #8a94a3;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:7pt;color:#5a6472}
.unlock{position:absolute;left:15mm;right:15mm;bottom:16mm;border-radius:6px;background:var(--ink);padding:2.4mm 4mm;display:flex;gap:3.5mm;align-items:center;font-family:Poppins;font-weight:300;font-size:8.4pt;color:#cfd6df;border-left:6px solid var(--lime)}
.unlock .h{font-family:Bebas;font-size:15pt;letter-spacing:.6px;color:var(--lime);line-height:1}
.unlock .h span{color:#fff}
.unlock .line{display:inline-block;border-bottom:1px solid #7a8594;width:50mm;margin:0 1mm}
.unlock .tick{display:inline-block;width:10px;height:10px;border:1.4px solid var(--lime);border-radius:2px;vertical-align:-1px;margin-left:1mm}
.unlock .c{font-family:Bebas;font-size:16pt;color:var(--or);text-align:right;line-height:1}
.bebas{font-family:Bebas;letter-spacing:.5px}
.hs .banner{border-radius:6px}
.hs .bnum{width:12mm;height:12mm;font-size:18pt;padding-top:.6mm}
/* cover */
.bcover{padding:0;background:#151a23 url(bgb_cover.jpg) center/cover no-repeat;color:#fff}
.bcover .logo{position:absolute;left:18mm;top:18mm;width:44mm;background:#fff;padding:3mm 4mm;border-radius:6px}
.bcover .tag{position:absolute;left:18mm;top:70mm;font-family:Poppins;font-weight:500;font-size:9pt;letter-spacing:3px;color:var(--lime)}
.bcover h1{position:absolute;left:17mm;top:78mm;margin:0;font-family:Bebas;font-weight:400;font-size:78pt;line-height:.88;letter-spacing:1px}
.bcover h1 span{color:var(--or)}
.bcover .sub{position:absolute;left:18mm;top:166mm;font-family:Poppins;font-weight:300;font-size:12pt;color:#d5dbe3;line-height:1.5}
.bcover .stats{position:absolute;left:18mm;top:192mm;display:flex;gap:8mm}
.bcover .stats div{font-family:Bebas;font-size:36pt;line-height:.9;color:#fff}
.bcover .stats small{display:block;font-family:Poppins;font-size:7.5pt;letter-spacing:1.5px;color:var(--lime);font-weight:500}
.bcover .motto{position:absolute;left:18mm;top:226mm;font-family:Bebas;font-size:22pt;letter-spacing:1px;color:var(--lime)}
.bcover .name{position:absolute;left:18mm;top:250mm;width:92mm;font-family:Poppins;font-size:8pt;letter-spacing:1.5px;color:#aab4c2}
.bcover .name div{border-bottom:1.5px solid #6b7686;height:9mm}
/* plan page */
.plan p{margin:0 0 2.5mm;font-size:10.8pt;line-height:1.48}
.rw{width:100%;border-collapse:collapse;font-size:9.6pt}
.rw td{padding:1.8mm 2.2mm;border-bottom:1px solid #e3e6ea;vertical-align:middle}
.rw td.q{font-family:Bebas;font-size:15pt;color:var(--or);white-space:nowrap;border-bottom:1px solid #e3e6ea;padding-right:1mm}
.rw b{font-family:Poppins;font-weight:600;font-size:8.8pt;color:var(--ink)}
/* tracker */
.xp{display:flex;gap:2px;margin:1mm 0 3mm}
.xp i{font-style:normal;flex:1;height:9mm;border:1.2px solid #b8c0cb;border-radius:2px;position:relative}
.xp i.m{border:2px solid var(--or);background:#fff3ee}
.xp i b{font-style:normal;position:absolute;bottom:-4.2mm;left:50%;transform:translateX(-50%);font-family:Bebas;font-weight:400;font-size:9pt;color:var(--or);white-space:nowrap}
.sgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.srow{display:flex;align-items:center;gap:1.4mm;margin:1.4mm 0}
.srow .sl{font-family:Bebas;font-size:12pt;color:var(--ink);width:7mm;letter-spacing:.4px}
.sq{width:22px;height:22px;border:1.5px solid #9aa4b2;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-family:Poppins;font-size:6.6pt;color:#6a7482}
.sq.m{border-color:var(--or);border-width:2px;color:var(--or);font-weight:600}
/* finish */
.fin{position:absolute;left:15mm;right:15mm;top:15mm;height:128mm;border-radius:8px;background:#151a23 url(bgb_cover.jpg) center 30%/cover no-repeat;color:#fff;padding:14mm 14mm}
.fin .big{font-family:Bebas;font-size:66pt;line-height:.9;letter-spacing:1px}
.fin .big span{color:var(--lime)}
.fin p{font-size:12pt;color:#d5dbe3;margin:3mm 0;max-width:110mm}
.fin .sig{display:flex;gap:9mm;margin-top:12mm;font-family:Poppins;font-size:8pt;letter-spacing:1px;color:#aab4c2}
.fin .sig div div{border-bottom:1.5px solid #6b7686;height:9mm}
"""
CSS = build.CSS + THEME


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


pages = []

# ---------- cover ----------
pages.append(f"""<div class="page bcover">
<img class="logo" src="kingscliff-logo.png">
<div class="tag">YEAR 12 MATHEMATICS STANDARD 2</div>
<h1>The 3-week<br><span>training</span><br>block</h1>
<div class="sub">Ratios, rates and trigonometry<br>HSC exam preparation</div>
<div class="stats"><div>75<small>QUESTIONS</small></div><div>15<small>SESSIONS</small></div><div>6<small>UNLOCKS</small></div></div>
<div class="motto">Show up. Do five. Done.</div>
<div class="name">NAME<div></div></div>
</div>""")

# ---------- game plan ----------
rw = "".join(f'<tr><td class="q">Q{q}</td><td>{lock(17)}</td><td><b>{h.upper()}</b><br><span style="color:#5a6472">Reward idea: {t}{"" if t.endswith("!") else "."}</span></td></tr>'
             for _, (q, h, t) in sorted(MILES.items()))
pages.append(f"""<div class="page">
<div class="banner slim"><h1>The game plan <span>how this works</span></h1></div>
<div class="cols2" style="grid-template-columns:1.05fr 1fr;gap:7mm">
<div class="plan">
<p>This is a training block for your exam. <b>15 sessions, 5 questions each</b>, about 20–25 minutes a session. No marathon study nights. Just show up and do five.</p>
<p>It covers <b>everything</b> in Ratios and rates and Trigonometry. Each week steps up:</p>
<p><b class="bebas" style="font-size:13pt;color:#e24c12">Week 1 Pre-season:</b> the basics, and building the habit.<br>
<b class="bebas" style="font-size:13pt;color:#e24c12">Week 2 Build:</b> multi-step questions.<br>
<b class="bebas" style="font-size:13pt;color:#e24c12">Week 3 Match fitness:</b> HSC-level questions.</p>
<p>Do your working and diagrams in your exercise book, then mark it with the answers at the back. At least two questions every session are HSC-style, with marks shown.</p>
<p>Hit a milestone and you <b>unlock a reward</b>. The ideas are there, but you pick the reward and write it in.</p>
<p>Fill in a box on page 3 for every question you finish. Don’t break the streak.</p>
</div>
<div><div class="panel"><h3>Unlocks {bolt(11, LIME)}</h3><div class="pb" style="padding:1mm 3mm 2mm"><table class="rw">{rw}</table></div></div></div>
</div>
<div class="cols2" style="margin-top:3mm;gap:5mm">
<div class="weekbox"><b class="k">Reset</b>
<ul style="margin:1mm 0 0;padding-left:4.5mm;font-size:9.9pt">
<li>Stuck for 5 minutes? Skip it, check the help sheet, come back.</li>
<li>Brain fried? Get up and move for 10 minutes, then go again.</li>
<li>Box breathing: in for 4, hold for 4, out for 4, hold for 4.</li>
<li>Sleep beats all-nighters. Your brain locks in what you learnt while you sleep.</li>
<li>If the pressure is building, talk to someone: your teacher, Year Adviser or the school counsellor. Nobody does this alone.</li>
</ul></div>
<div class="sandbox"><span class="lab">What’s inside</span>
<table style="margin-top:1mm;width:100%;font-size:10pt;border-collapse:collapse">
<tr><td>Progress tracker and log</td><td style="text-align:right">3</td></tr>
<tr><td>Week 1: Pre-season (Sessions 1–5)</td><td style="text-align:right">4</td></tr>
<tr><td>Week 2: Build (Sessions 6–10)</td><td style="text-align:right">9</td></tr>
<tr><td>Week 3: Match fitness (Sessions 11–15)</td><td style="text-align:right">14</td></tr>
<tr><td>Block complete + exam-day plan</td><td style="text-align:right">19</td></tr>
<tr><td>Help sheets</td><td style="text-align:right">20–21</td></tr>
<tr><td>Answers</td><td style="text-align:right">22–23</td></tr></table>
<p style="font-size:9pt;margin:1.5mm 0 0;color:#5a6472">Kit: calculator in <b>degrees</b> mode, ruler, pencil, exercise book.</p></div>
</div>
<p style="font-size:8.6pt;color:#7a8492;margin-top:3mm">We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. &nbsp;Outcomes: MST-12-S2-04, MST-12-S2-05, MAO-WM-01 (NSW Mathematics Standard 11–12 Syllabus, 2024).</p>
{foot(2)}</div>""")

# ---------- tracker ----------
mq = [m[0] for m in MILES.values()]
xp = "".join(f'<i class="m"><b>{q}</b></i>' if q in mq else "<i></i>" for q in range(1, 76))
cols = []
for w in range(3):
    rows = []
    for d in range(5):
        di = 5 * w + d
        sq = "".join(f'<span class="sq{" m" if (5*di+k+1) in mq else ""}">{5*di+k+1}</span>' for k in range(5))
        lk = f'&nbsp;{lock(15)}' if di in MILES else ""
        rows.append(f'<div class="srow"><span class="sl">{di+1:02d}</span>{sq}{lk}</div>')
    cols.append(f'<div><div class="bebas" style="font-size:14pt;color:#e24c12">Week {w+1}: {WEEKS[w][0]}</div>{"".join(rows)}</div>')
log = "".join(f'<tr><td class="bebas" style="font-size:11.5pt">Session {di+1:02d}</td><td></td><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / {sum(qmarks(q) for q in day)}</td><td>{conf()}</td></tr>'
              for di, day in enumerate(DAYS))
pages.append(f"""<div class="page">
<div class="banner slim"><h1>Progress <span>one box per question, by session • orange = unlock</span></h1></div>
<div class="panel" style="margin-bottom:4mm"><div class="pb">
<div class="bebas" style="font-size:13pt;color:#12161d">XP bar: shade one block per question</div>
<div class="xp">{xp}</div>
<div class="sgrid" style="margin-top:5mm">{"".join(cols)}</div></div></div>
<div class="cols2" style="grid-template-columns:1.3fr 1fr;gap:6mm">
<div><table class="trk"><tr><th>Session</th><th>Date</th><th>Marks</th><th>Confidence (circle)</th></tr>{log}</table></div>
<div>
<div class="weekbox" style="margin-bottom:3mm"><b class="k">Why log it?</b><br>Watch your marks and confidence climb. On a flat day, look back here. The numbers don’t lie.</div>
<div class="sandbox"><span class="lab">Questions for my teacher</span>
<div style="height:56mm;background:repeating-linear-gradient(#f3f4f6,#f3f4f6 8.4mm,#d3d8df 8.4mm,#d3d8df 8.7mm)"></div></div>
</div></div>
{foot(3)}</div>""")

# ---------- sessions ----------
for di, day in enumerate(DAYS):
    w = di // 5
    tot = sum(qmarks(q) for q in day)
    if di % 5 == 0:
        box = f'<div class="weekbox"><b class="k">Week {w+1}: {WEEKS[w][0]} {bolt(12, LIME)}</b><br>{WEEKS[w][1]}</div>'
    else:
        box = f'<div class="sandbox" style="padding:2mm 4.5mm"><span class="lab">Coach’s note</span> &nbsp;{TIPS[di]}</div>'
    qs = "".join(build.q_html(5 * di + i + 1, q) for i, q in enumerate(day))
    if di in MILES:
        n, h, t = MILES[di]
        bottom = (f'<div class="unlock">{lock(30, True, LIME)}<div style="flex:1"><div class="h">Unlocked: <span>{h}</span> &nbsp;{n}/75</div>'
                  f'<div style="margin-top:.8mm">Reward idea: {t}{"" if t.endswith("!") else "."} &nbsp;My reward: <span class="line"></span> Claimed <span class="tick"></span></div></div>'
                  f'<div class="c">Earned<br>it.</div></div>')
    else:
        bottom = (f'<div class="checkin"><span><b>Session {di+1:02d} done</b> &nbsp; Marks: <span class="blank"></span>/ {tot}</span>'
                  f'<span>Confidence {conf()}</span></div>')
    pages.append(f"""<div class="page day">
<div class="banner"><div class="bnum"><small>SESSION</small>{di+1:02d}</div><div class="btxt"><h1>Week {w+1} • Day {di % 5 + 1}</h1>
<div>Questions {5*di+1}–{5*di+5} &nbsp;•&nbsp; {tot} marks &nbsp;•&nbsp; about {build.mins(tot)} minutes</div>
<div class="bq">{QUOTES[di]}</div></div></div>
{box}
<div class="qs">{qs}</div>
{bottom}
{foot(4 + di)}</div>""")

# ---------- block complete ----------
pages.append(f"""<div class="page">
<div class="fin">
<div style="display:flex;justify-content:space-between;align-items:flex-start">
<div><div class="big">Block<br><span>complete.</span></div>
<p style="font-family:Bebas;font-size:24pt;color:#fff;letter-spacing:.8px;margin-top:5mm">75 / 75 questions</p>
<p>You put in the reps. Ratios, rates and trigonometry are done, and that work is in the bank for exam day.</p></div>
<div style="margin-top:4mm">{trophy(92)}</div></div>
<div class="sig"><div><div style="width:58mm"></div>NAME</div><div><div style="width:45mm"></div>TEACHER</div><div><div style="width:30mm"></div>DATE</div></div>
</div>
<div class="cols2" style="position:absolute;left:15mm;right:15mm;top:152mm;gap:6mm">
<div class="panel"><h3>Night before</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Skim your help sheets. No new questions.</li>
<li>Pack your kit: calculator (check it’s in <b>degrees</b>), spare batteries, pens, pencil, ruler, eraser, water.</li>
<li>Switch off and get a proper sleep. It’s when your brain locks in what you’ve learnt.</li>
</ul></div></div>
<div class="panel"><h3>Game day</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Three slow breaths before you start.</li>
<li>Use the reference sheet. The trig rules are on it.</li>
<li>Start with the questions you’re confident on.</li>
<li>Draw the diagram and show every step. Working earns marks.</li>
<li>Never leave a blank. Write down what you know.</li>
</ul></div></div>
</div>
<div style="position:absolute;left:0;right:0;top:236mm;text-align:center">
<div class="bebas" style="font-size:40pt;color:#12161d;line-height:1">Trust the <span style="color:#ff5a1f">training.</span></div>
<div style="font-family:Poppins;font-weight:300;font-size:10pt;color:#5a6472;margin-top:2mm">Good luck. You’ve got this.</div></div>
{foot(19)}</div>""")

# ---------- help sheets ----------
for k, p in enumerate((helpsheet.p1, helpsheet.p2)):
    p = p.replace(helpsheet.FOOT, FOOT)
    p = re.sub(r'<span class="pno">\d+</span>', f'<span class="pno">{20+k}</span>', p)
    pages.append(p)

# ---------- answers ----------
for k, rng in enumerate((range(0, 8), range(8, 15))):
    sub = "mark it, then fill in your progress" if k == 0 else "continued"
    pages.append(f"""<div class="page ansp">
<div class="banner slim"><h1>Answers <span>{sub}</span></h1></div>
<div class="ans">{build.ans_block(rng)}</div>
{foot(22 + k)}</div>""")

CSS_ALL = CSS + helpsheet.CSS[len(build.CSS):]
html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Training block</title><style>{CSS_ALL}</style></head><body>{"".join(pages)}</body></html>"""
open("boy.html", "w").write(html)
print("pages", len(pages))
