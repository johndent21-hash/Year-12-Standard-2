# -*- coding: utf-8 -*-
"""Boys' summer revision booklet: summer holidays theme with an XP / levelling system."""
import boy                                    # dark sporty theme + icons from the earlier booklet
from boy import bolt, lock, trophy, conf
import summer_common as sc

FOOT = "Summer XP • Year 12 Mathematics Standard 2"
ORANGE, GOLD, NAVY, TEAL = "#ff7b29", "#ffd166", "#0b2240", "#0f7c88"

# ---------- XP and levels ----------
LEVELS = [(0, "Last Bell Rookie"), (100, "Thongs On"), (250, "Esky Captain"), (400, "Backyard Cricket Legend"),
          (600, "Servo Pie Connoisseur"), (800, "Sandbar Scout"), (1050, "Wave Catcher"), (1300, "Barrel Hunter"),
          (1550, "Sunset Session Pro"), (1800, "Summer GOAT")]
REWARDS = {2: "an hour of gaming, guilt-free", 4: "a proper feed: burger, kebab, whatever you’re into",
           6: "a surf, skate or fishing session", 8: "a night out with your mates", 10: "something big. You earned it!"}


def on_track_xp(day):          # day = 1..30
    return 50 * day + 50 * (day // 5)


def level_of(xp):
    return max(i for i, (t, _) in enumerate(LEVELS) if t <= xp) + 1


LEVEL_UP_DAY = {}
for d in range(1, 31):
    if level_of(on_track_xp(d)) > level_of(on_track_xp(d - 1)):
        LEVEL_UP_DAY[d - 1] = level_of(on_track_xp(d))     # day index -> new level

# ---------- words ----------
QUOTES = [
    "Holidays on. Brain still on.", "Four questions. Then the beach.", "Show up. Do four. Done.",
    "Nobody gets good without reps.", "Week one banked. Go enjoy it.", "Stay sharp while others switch off.",
    "Discipline in summer, freedom in Year 12.", "Small sets. Big gains.", "Mistakes now mean fewer in the HSC.",
    "Two weeks straight. That’s a streak.", "Early session, then the waves.", "You don’t have to feel like it. Just start.",
    "One percent better, every day.", "Hot days, cool head.", "Halfway. Don’t paddle in now.",
    "Lock in for fifteen. Then you’re free.", "Consistency beats cramming.", "Do the work nobody sees.",
    "Keep the streak alive.", "Four weeks. Most people quit by now.", "Ride the momentum.",
    "Calm head. Draw it. Solve it.", "Small wins stack up.", "Future you says thanks.", "Five weeks down. Respect.",
    "Last week. Finish the set.", "Year 12 is coming. You’re ready.", "Trust the training.",
    "One more after this. Stay locked in.", "Summer complete. Level maxed.",
]
TIPS = {
    1: "Get it done early. Four questions before the beach, then you’re free.",
    2: "Draw a big labelled diagram first. That’s half the work done.",
    3: "Busy day? Smash one question now and the rest tonight. XP is XP.",
    4: "Week bonus day. Finish all four for +50 XP on top.",
    6: "Missed a day over the break? No drama. Pick it up today.",
    7: "Stuck? Skip it, check the help sheets at the back, then come back.",
    8: "One step per line, equals signs lined up. Easier to check, easier marks.",
    9: "Week bonus day. Lock it in.",
    11: "Networks: highlight the saturated edges and draw cuts in a different colour.",
    12: "Check the units first: mm → m, minutes → hours, W → kW.",
    13: "Unlock day if you’re on track: Level 6 is waiting.",
    14: "Week bonus day, and you’re halfway through summer.",
    16: "Hot day? Do your four in the morning before it gets cooked.",
    17: "Mark it straight away. Fixing a mistake now locks in the method.",
    18: "Part marks are real marks. Write every step.",
    19: "Week bonus day. Brain fried? Box breathing: in 4, hold 4, out 4, hold 4.",
    21: "Call the play before you start: formula, ratio, rate, trig or network?",
    22: "Sense check: is the answer realistic? A pool doesn’t hold 3 litres.",
    23: "The questions you circle are gold. Take them to class in Term 1.",
    24: "Week bonus day. 1500 XP is in sight.",
    26: "Last week. Four a day, then enjoy every minute.",
    27: "Pack your bag early: calculator in degrees mode, ruler, this booklet.",
    28: "Look how much you remember. Year 12 is going to feel easy.",
    29: "Final session. Max out and claim your reward.",
}
WEEKS = [
    ("Last bell", "Holidays just started. Four quick questions a day keeps your brain from switching off completely."),
    ("Heatwave", "Cricket’s on and the pool’s open. Get your four done early and the day is yours. Public holidays off."),
    ("New year, new level", "New year. Same streak. You’re stacking XP now."),
    ("Peak summer", "Morning session, then the beach. Simple."),
    ("Sunset sessions", "You’re in rhythm. These feel easier than Week 1 did."),
    ("Final set", "Last week before Year 12. Finish the set and max out."),
]

THEME = r"""
:root{--blue:#e2621b;--or:#ff7b29;--lime:#ffd166;--ink:#0b2240;--slate:#13315c}
.banner{background:#0b2240 url(bg2_bband.jpg) center/cover no-repeat}
.bcover{background:#151a3a url(bg2_bcover.jpg) center/cover no-repeat}
.fin{background:#151a3a url(bg2_bcover.jpg) center 12%/cover no-repeat}
.bcover h1 span{color:var(--or)}
.bcover .sub{top:150mm}
.bcover .stats{top:172mm}
.bcover .motto{top:192mm;color:#fff}
.xpbadge{position:absolute;right:44mm;top:50%;transform:translateY(-50%);font-family:Bebas;font-size:20pt;color:var(--lime);border:2px solid var(--lime);border-radius:4px;padding:1mm 3mm 0;line-height:1}
.page.day{display:flex;flex-direction:column}
.page.day>*{flex-shrink:0}
.page.day>.scene{flex-shrink:1}
.page.day .btxt{max-width:82mm}
.scene{flex:0 1 46mm;min-height:0;margin:3mm 0 23mm;margin-top:auto;background:url(scene_sboy.jpg) center bottom/contain no-repeat}
.xpf{display:inline-block;border-bottom:1px solid #7a8594;width:12mm;margin:0 1mm}
.levelup{position:absolute;left:15mm;right:15mm;bottom:16mm;border-radius:6px;background:linear-gradient(90deg,#0b2240,#13315c);padding:2.2mm 4mm;display:flex;gap:3.5mm;align-items:center;font-family:Poppins;font-weight:300;font-size:8.4pt;color:#cfd6df;border-left:6px solid var(--or)}
.levelup .h{font-family:Bebas;font-size:15pt;letter-spacing:.6px;color:var(--or);line-height:1}
.levelup .h span{color:#fff}
.ladder{width:100%;border-collapse:collapse}
.ladder td{padding:1.5mm 2mm;border-bottom:1px solid #e3e6ea;vertical-align:middle;font-size:9.8pt}
.ladder td.lv{font-family:Bebas;font-size:22pt;color:var(--ink);width:14mm;line-height:1}
.ladder td.nm{font-family:Bebas;font-size:16pt;letter-spacing:.5px;color:var(--ink)}
.ladder td.xp{font-family:Bebas;font-size:14pt;color:#e2621b;white-space:nowrap}
.ladder tr.u td{background:#fff6ec}
.chk{display:inline-block;width:13px;height:13px;border:1.6px solid #8a94a3;border-radius:3px;vertical-align:middle}
.xpbar{position:relative;height:13mm;margin:4mm 0 9mm;border:2px solid var(--ink);border-radius:4px;background:repeating-linear-gradient(90deg,#fff 0,#fff calc(100%/36 - 1px),#c9d1db calc(100%/36 - 1px),#c9d1db calc(100%/36))}
.xpbar i{position:absolute;top:-2px;bottom:-2px;width:2px;background:#e2621b}
.xpbar b{position:absolute;top:100%;transform:translateX(-50%);font-family:Bebas;font-weight:400;font-size:10pt;color:#e2621b;margin-top:1mm;font-style:normal;white-space:nowrap}
.log{width:100%;border-collapse:collapse;font-size:9pt}
.log th{font-family:Poppins;font-weight:500;font-size:7.6pt;color:#fff;background:var(--ink);padding:1.2mm 1.5mm;text-align:left}
.log td{padding:.45mm 1.5mm;border-bottom:1px solid #e3e6ea;height:6.7mm}
.log td.s{font-family:Bebas;font-size:11pt;color:var(--ink)}
.log tr.wk td{background:#fff6ec;font-family:Bebas;font-size:10.5pt;color:#e2621b;height:auto;padding:.6mm 1.5mm}
.qbx{display:inline-block;width:12px;height:12px;border:1.4px solid #9aa4b2;border-radius:2px;margin-right:1.5px;vertical-align:middle}
"""
CSS = boy.CSS + THEME + sc.EXTRA_CSS
CSS_ALL = CSS + sc.HELP_CSS


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


pages = []
# ---------- cover ----------
pages.append(f"""<div class="page bcover">
<img class="logo" src="kingscliff-logo.png">
<div class="tag">YEAR 12 MATHEMATICS STANDARD 2 • SUMMER HOLIDAYS</div>
<h1>Level up<br><span>this</span><br>summer</h1>
<div class="sub">Four questions a day. Earn XP. Unlock rewards.<br>Walk into Year 12 at max level.</div>
<div class="stats"><div>120<small>QUESTIONS</small></div><div>1800<small>XP</small></div><div>10<small>LEVELS</small></div></div>
<div class="motto">Four questions. Then the beach.</div>
<div class="name">NAME<div></div></div>
</div>""")

# ---------- game plan ----------
pages.append(f"""<div class="page">
<div class="banner slim"><h1>How it works <span>the summer XP challenge</span></h1></div>
<div class="cols2" style="grid-template-columns:1.05fr 1fr;gap:7mm">
<div class="plan">
<p>Six weeks of holidays. <b>Four questions a day, Monday to Friday</b>, about 15 minutes. That’s 20 a week and 120 by the end of January.</p>
<p>The questions are <b>core skills, not killers</b>. They keep Year 11 (formulas and equations, measurement) and the start of Year 12 (ratios and rates, trigonometry, network flow) fresh, so Term 1 is easy.</p>
<p>Do the working in your exercise book, mark it with the answers at the back, then log your XP on page 4. Help sheets for every topic are at the back.</p>
<p>Every question earns XP. Stack enough XP and you <b>level up</b>. Every second level <b>unlocks a reward</b>. You pick the reward and write it in.</p>
</div>
<div><div class="panel"><h3>XP rules {bolt(11, GOLD)}</h3><div class="pb">
<table class="rw">
<tr><td class="q">+10</td><td><b>EACH QUESTION</b><br>finished, marked and corrected</td></tr>
<tr><td class="q">+10</td><td><b>DAY BONUS</b><br>all four questions done in a session</td></tr>
<tr><td class="q">+50</td><td><b>WEEK BONUS</b><br>all five sessions of a week done</td></tr>
<tr><td class="q">1800</td><td><b>MAX XP</b><br>everything done = Level 10</td></tr></table></div></div></div>
</div>
<div class="cols2" style="margin-top:3mm;gap:5mm">
<div class="weekbox"><b class="k">Reset</b>
<ul style="margin:1mm 0 0;padding-left:4.5mm;font-size:9.9pt">
<li>Four questions, then you’re done. Don’t overdo it.</li>
<li>Public holidays are days off. Catch up later.</li>
<li>Stuck for 5 minutes? Skip it, check the help sheets, come back.</li>
<li>Sleep, sun and getting outside are part of the plan.</li>
<li>If something’s weighing on you, talk to someone you trust, or your Year Adviser or school counsellor once school’s back.</li>
</ul></div>
<div class="sandbox"><span class="lab">What’s inside</span>
<table style="margin-top:1mm;width:100%;font-size:10pt;border-collapse:collapse">
<tr><td>Level ladder and rewards</td><td style="text-align:right">3</td></tr>
<tr><td>XP log</td><td style="text-align:right">4</td></tr>
<tr><td>Weeks 1–6: Sessions 01–30</td><td style="text-align:right">5–34</td></tr>
<tr><td>Max level + Term 1 plan</td><td style="text-align:right">35</td></tr>
<tr><td>Help sheets</td><td style="text-align:right">36–40</td></tr>
<tr><td>Answers</td><td style="text-align:right">41–43</td></tr></table>
<p style="font-size:9pt;margin:1.5mm 0 0;color:#5a6472">Kit: calculator in <b>degrees</b> mode, ruler, pencil, exercise book.</p></div>
</div>
<p style="font-size:8.4pt;color:#7a8492;margin-top:3mm">We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. &nbsp;Outcomes: MST-11-01, MST-11-05, MST-12-S2-04, MST-12-S2-05, MST-12-S2-06, MAO-WM-01 (NSW Mathematics Standard 11–12 Syllabus, 2024).</p>
{foot(2)}</div>""")

# ---------- level ladder ----------
rows = []
for i in range(len(LEVELS) - 1, -1, -1):
    t, name = LEVELS[i]
    lv = i + 1
    rw = REWARDS.get(lv)
    unlock = (f'{lock(16, True, ORANGE)} <b style="font-family:Poppins;font-size:8.4pt">UNLOCK</b> {rw}<br>'
              f'<span style="font-size:8.6pt;color:#5a6472">My reward: <span class="xpf" style="width:45mm"></span></span>') if rw else ""
    rows.append(f'<tr class="{"u" if rw else ""}"><td class="lv">{lv:02d}</td><td class="nm">{name}</td><td class="xp">{t} XP</td><td>{unlock}</td><td><span class="chk"></span></td></tr>')
ticks = "".join(f'<i style="left:{t/1800*100:.2f}%"></i><b style="left:{t/1800*100:.2f}%">L{k+1}</b>' for k, (t, _) in enumerate(LEVELS) if 0 < t < 1800)
pages.append(f"""<div class="page">
<div class="banner slim"><h1>The level ladder <span>tick each level as you reach it</span></h1></div>
<div class="bebas" style="font-size:13pt;color:#0b2240">XP bar: shade one block for every 50 XP</div>
<div class="xpbar">{ticks}</div>
<table class="ladder">{"".join(rows)}</table>
{foot(3)}</div>""")

# ---------- XP log ----------
log = []
for w in range(6):
    log.append(f'<tr class="wk"><td colspan="6">Week {w+1}: {WEEKS[w][0]}</td></tr>')
    for d in range(5):
        di = 5 * w + d
        bonus = "+10 day" + (" +50 week" if d == 4 else "")
        log.append(f'<tr><td class="s">Session {di+1:02d}</td><td>{"<span class=qbx></span>" * 4}</td><td style="font-size:7.8pt;color:#5a6472">{bonus}</td>'
                   f'<td></td><td></td><td style="font-size:7.8pt;color:#5a6472">{on_track_xp(di+1)}</td></tr>')
pages.append(f"""<div class="page">
<div class="banner slim"><h1>XP log <span>tick each question • add your XP • compare with the on-track total</span></h1></div>
<table class="log"><tr><th>Session</th><th>Questions</th><th>Bonus</th><th>XP today</th><th>Total XP</th><th>On track</th></tr>{"".join(log)}</table>
{foot(4)}</div>""")

# ---------- sessions ----------
for di in range(30):
    w = di // 5
    tot = sc.day_marks(di)
    if di % 5 == 0:
        box = f'<div class="weekbox"><b class="k">Week {w+1}: {WEEKS[w][0]} {bolt(12, GOLD)}</b><br>{WEEKS[w][1]}</div>'
    else:
        box = f'<div class="sandbox" style="padding:2mm 4.5mm"><span class="lab">Coach’s note</span> &nbsp;{TIPS[di]}</div>'
    maxxp = 50 + (50 if di % 5 == 4 else 0)
    xpline = f'XP today <span class="xpf"></span>/ {maxxp} &nbsp; Total <span class="xpf"></span>'
    lv = LEVEL_UP_DAY.get(di)
    if lv and lv in REWARDS:
        bottom = (f'<div class="unlock">{lock(30, True, GOLD)}<div style="flex:1"><div class="h">Level {lv}: <span>{LEVELS[lv-1][1]}</span> &nbsp;{LEVELS[lv-1][0]} XP</div>'
                  f'<div style="margin-top:.8mm">Unlock: {REWARDS[lv]}{"" if REWARDS[lv].endswith("!") else "."} &nbsp;My reward: <span class="line" style="width:38mm"></span> Claimed <span class="tick"></span></div>'
                  f'<div style="margin-top:.6mm">{xpline}</div></div></div>')
    elif lv:
        bottom = (f'<div class="levelup">{bolt(28, ORANGE)}<div style="flex:1"><div class="h">Level up: <span>Level {lv}, {LEVELS[lv-1][1]}</span></div>'
                  f'<div style="margin-top:.8mm">On track, you hit {LEVELS[lv-1][0]} XP today. &nbsp;{xpline}</div></div></div>')
    else:
        bottom = (f'<div class="checkin"><span><b>Session {di+1:02d}</b> &nbsp; {xpline}</span>'
                  f'<span>Confidence {conf()}</span></div>')
    pages.append(f"""<div class="page day">
<div class="banner"><div class="bnum"><small>SESSION</small>{di+1:02d}</div><div class="btxt"><h1>Week {w+1} • Day {di % 5 + 1}</h1>
<div>Questions {4*di+1}–{4*di+4} &nbsp;•&nbsp; {tot} marks &nbsp;•&nbsp; about 15 minutes</div>
<div class="bq">{QUOTES[di]}</div></div>
<div class="xpbadge">+{maxxp} XP</div></div>
{box}
<div class="qs">{sc.day_questions(di)}</div>
<div class="scene"></div>
{bottom}
{foot(5 + di)}</div>""")

# ---------- max level ----------
pages.append(f"""<div class="page">
<div class="fin">
<div style="display:flex;justify-content:space-between;align-items:flex-start">
<div><div class="big">Max level.<br><span>Summer GOAT.</span></div>
<p style="font-family:Bebas;font-size:24pt;color:#fff;letter-spacing:.8px;margin-top:5mm">120 questions • 1800 XP</p>
<p>You kept your skills sharp all summer while everyone else switched off. Year 12, you’re ready.</p></div>
<div style="margin-top:4mm">{trophy(92)}</div></div>
<div class="sig"><div><div style="width:58mm"></div>NAME</div><div><div style="width:45mm"></div>TEACHER</div><div><div style="width:30mm"></div>DATE</div></div>
</div>
<div class="cols2" style="position:absolute;left:15mm;right:15mm;top:152mm;gap:6mm">
<div class="panel"><h3>Before Term 1</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Pack your kit: calculator (check it’s in <b>degrees</b>), ruler, pens, pencil, exercise book.</li>
<li>Get back into a school sleep routine a few days early.</li>
<li>Bring this booklet. Your circled questions are your first questions for class.</li>
</ul></div></div>
<div class="panel"><h3>Week 1 of Year 12</h3><div class="pb" style="font-size:10.2pt">
<ul style="margin:0;padding-left:4.5mm">
<li>Ask about the questions you circled.</li>
<li>Keep the habit: a few questions a day beats cramming.</li>
<li>Use the help sheets whenever a topic comes back.</li>
<li>You’ve already done the work. Back yourself.</li>
</ul></div></div>
</div>
<div style="position:absolute;left:0;right:0;top:236mm;text-align:center">
<div class="bebas" style="font-size:40pt;color:#0b2240;line-height:1">Year 12. <span style="color:#ff7b29">Let’s go.</span></div>
<div style="font-family:Poppins;font-weight:300;font-size:10pt;color:#5a6472;margin-top:2mm">Have a great summer.</div></div>
{foot(35)}</div>""")

pages += sc.help_pages(FOOT, 36)
for k, rng in enumerate((range(0, 10), range(10, 20), range(20, 30))):
    sub = "mark it, then log your XP" if k == 0 else "continued"
    pages.append(f"""<div class="page ansp">
<div class="banner slim"><h1>Answers <span>{sub}</span></h1></div>
<div class="ans">{sc.ans_html(rng)}</div>
{foot(41 + k)}</div>""")

html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Summer XP</title><style>{CSS_ALL}</style></head><body>{"".join(pages)}</body></html>"""
open("boy2.html", "w").write(html)
print("pages", len(pages))
