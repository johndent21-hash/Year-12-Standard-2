# -*- coding: utf-8 -*-
"""Two-page help sheet to go with the ratios, rates and trigonometry revision booklet."""
import re
from math import *
from fig import Fig, centroid, pol, add, mul
from diagrams import law_sines_tri

CSS = re.search(r'CSS = r"""(.*?)"""', open("build.py").read(), re.S).group(1)
FOOT = "Kingscliff High School • Mathematics Standard 2 • Ratios, rates and trigonometry • Help sheet"

CSS += r"""
.hs{padding:12mm 13mm 16mm}
.hs .foot{left:13mm;right:13mm;bottom:7mm}
.hs .banner{height:16mm;margin-bottom:2.6mm}
.hs .bnum{height:11.5mm;width:11.5mm;font-size:16pt}
.hs .btxt h1{font-size:14.5pt}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:2.2mm 4mm}
.hs .panel{margin:0}
.hs .panel h3{font-size:9pt;padding:1.2mm 3.2mm}
.hs .panel .pb{padding:1.6mm 3mm 1.8mm;font-size:9.15pt;line-height:1.27}
.hs p{margin:0 0 .9mm}
.hs ul{margin:0;padding-left:4.2mm}
.hs li{margin:0 0 .45mm}
.eg{color:#555;font-style:italic}
.eg i{font-style:normal}
.fx{display:flex;gap:3mm;align-items:center}
.fx>div:first-child{flex:1;min-width:0}
.fx>div:last-child{flex:none}
.key{background:var(--pale);border-radius:4px;padding:.8mm 2.2mm;margin:.8mm 0;font-size:9.3pt}
.hs .sandbox{margin:0;padding:2mm 3.2mm;font-size:9.3pt;line-height:1.33}
.hs .weekbox{margin:0;padding:2mm 3.2mm;font-size:9.3pt;line-height:1.33}
table.rule{width:100%;border-collapse:collapse;font-size:8.9pt}
table.rule td,table.rule th{border-bottom:1px solid #dfe6ef;padding:.5mm 1.2mm;text-align:left;vertical-align:top}
table.rule th{font-family:Poppins;font-weight:400;font-size:7.8pt;color:var(--blue)}
.span2{grid-column:1 / span 2}
"""


def frac(a, b):
    return f'<span class="frac"><span>{a}</span><span>{b}</span></span>'


def foot(n):
    return f'<div class="foot"><span>{FOOT}</span><span class="pno">{n}</span></div>'


def panel(title, body, sub="", cls=""):
    s = f" <span>{sub}</span>" if sub else ""
    return f'<div class="panel {cls}"><h3>{title}{s}</h3><div class="pb">{body}</div></div>'


# ---------------- diagrams ----------------
def d_soh():
    A = (0, 0); C = (8, 0); B = (8, 5)
    f = Fig(pad=10); g = centroid(A, B, C)
    f.poly([A, B, C], fill="#eef3f9"); f.right(C, A, B)
    f.angle(A, C, B, "θ", r=20, italic=True, loff=9)
    f.side(A, B, "hypotenuse (H)", g, size=10)
    f.side(B, C, "opposite (O)", g, size=10)
    f.side(A, C, "adjacent (A)", g, size=10)
    return f.render(150, 88, nts=False)


def d_elev():
    f = Fig(pad=8)
    top = (0, 4); boat = (7, 0)
    f.poly([(-1.2, 0), (0, 0), (0, 4), (-1.2, 4)], fill="#e9e4d6", stroke="#999", w=1)
    f.line((-1.2, 0), (8.2, 0), w=1.1)
    f.line(top, (8.2, 4), dash=True, w=1)
    f.line(top, boat, w=1.4)
    f.angle(top, (8.2, 4), boat, "", r=20)
    f.angle(boat, (0, 0), top, "", r=20)
    f.text(top, "depression", dx=24, dy=12, anchor="start", size=9.5, col="#7b1f4b")
    f.text(boat, "elevation", dx=-24, dy=-5, anchor="end", size=9.5, col="#3f7cc0")
    f.text((8.2, 4), "horizontal", dy=-4, anchor="end", size=8.5, col="#777")
    f.text((-0.6, 2), "cliff", size=8.5, col="#666")
    return f.render(250, 74, nts=False)


def d_rose():
    W = 150; c = W / 2; R = 58
    o = [f'<circle cx="{c}" cy="{c}" r="{R}" fill="#f7f9fc" stroke="#c9d6e6"/>']
    lab = {0: "N 000°", 90: "E 090°", 180: "S 180°", 270: "W 270°"}
    for b in range(0, 360, 45):
        x = c + R * sin(radians(b)); y = c - R * cos(radians(b))
        o.append(f'<line x1="{c}" y1="{c}" x2="{x:.1f}" y2="{y:.1f}" stroke="{"#333" if b % 90 == 0 else "#bbb"}" stroke-width="{1.1 if b % 90 == 0 else .8}"/>')
    pos = {0: (c, c - R - 5, "middle"), 90: (c + R + 3, c + 4, "start"), 180: (c, c + R + 13, "middle"), 270: (c - R - 3, c + 4, "end")}
    for b, t in lab.items():
        x, y, an = pos[b]
        o.append(f'<text x="{x}" y="{y}" text-anchor="{an}" font-size="12.5" font-family="TeX Gyre Pagella">{t}</text>')
    # example S35°W = 215°T
    b = 215; x = c + R * 0.95 * sin(radians(b)); y = c - R * 0.95 * cos(radians(b))
    o.append(f'<line x1="{c}" y1="{c}" x2="{x:.1f}" y2="{y:.1f}" stroke="#7b1f4b" stroke-width="1.8"/>')
    o.append(f'<path d="M{c},{c+22} A22,22 0 0 1 {c+22*sin(radians(215)):.1f},{c-22*cos(radians(215)):.1f}" fill="none" stroke="#7b1f4b"/>')
    o.append(f'<text x="{c-14}" y="{c+38}" font-size="12" font-family="TeX Gyre Pagella" fill="#7b1f4b">35°</text>')
    o.append(f'<text x="{x-22:.1f}" y="{y+12:.1f}" text-anchor="middle" font-size="12" font-family="TeX Gyre Pagella" fill="#7b1f4b">S35°W = 215°T</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{(W+76)*0.75:.0f}" height="{(W+22)*0.75:.0f}" viewBox="-38 0 {W+76} {W+22}">{"".join(o)}</svg>'


def d_abc():
    A, B, C = law_sines_tri(48, 64, 10)
    f = Fig(pad=10); g = centroid(A, B, C)
    f.poly([A, B, C], fill="#eef3f9")
    for v, n in ((A, "A"), (B, "B"), (C, "C")):
        f.vname(v, n, g, off=9)
    f.side(B, C, "a", g, italic=True); f.side(A, C, "b", g, italic=True); f.side(A, B, "c", g, italic=True)
    return f.render(118, 88, nts=False)


def d_radial():
    O = (0, 0); A = pol(40, 40); B = pol(36, 130)
    f = Fig(pad=10)
    f.poly([O, A, B], fill="#eef3f9")
    f.arrow(O, (0, 34)); f.text((0, 34), "N", dy=-4, size=10)
    f.angle(O, A, B, "90°", r=12, loff=10)
    f.dot(O); f.text(O, "O", dx=-8, dy=4, italic=True)
    f.vname(A, "A 040°", O, off=12); f.vname(B, "B 130°", O, off=14)
    return f.render(118, 100, nts=False)


def d_bar():
    o = []
    for i in range(5):
        col = "#9dbbe0" if i < 2 else "#d9d3bd"
        o.append(f'<rect x="{6+i*30}" y="16" width="28" height="20" fill="{col}" stroke="#777" stroke-width=".7"/>')
        o.append(f'<text x="{20+i*30}" y="30" text-anchor="middle" font-size="9.5" font-family="TeX Gyre Pagella">$8</text>')
    o.append('<text x="81" y="10" text-anchor="middle" font-size="9" font-family="TeX Gyre Pagella" fill="#555">$40 shared in the ratio 2 : 3</text>')
    o.append('<text x="35" y="50" text-anchor="middle" font-size="9.5" font-family="TeX Gyre Pagella">$16</text><text x="111" y="50" text-anchor="middle" font-size="9.5" font-family="TeX Gyre Pagella">$24</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="130" height="45" viewBox="0 0 162 56">{"".join(o)}</svg>'


def d_trap():
    from fig import smooth
    pts = [(0, 3.0), (3, 4.2), (6, 2.6)]
    f = Fig(pad=10)
    f.poly([(0, 0)] + smooth(pts) + [(6, 0)], fill="#eef3f9")
    f.line((0, 0), (6, 0), w=1.2)
    for (x, y), n in zip(pts, ("d₁", "d₂", "d₃")):
        f.line((x, 0), (x, y), dash=True, w=1)
        f.text((x, y / 2), n, dx=4, anchor="start", size=12, italic=True)
    f.text((1.5, 0), "h", dy=13, size=12, italic=True); f.text((4.5, 0), "h", dy=13, size=12, italic=True)
    return f.render(140, 82, nts=False)


def d_dt():
    W, H = 165, 100; x0, y0 = 22, 82
    o = [f'<line x1="{x0}" y1="{y0}" x2="{W-6}" y2="{y0}" stroke="#222"/>', f'<line x1="{x0}" y1="{y0}" x2="{x0}" y2="8" stroke="#222"/>']
    pts = [(x0, y0), (x0 + 40, y0 - 50), (x0 + 75, y0 - 50), (x0 + 95, y0 - 70), (x0 + 135, y0 - 20)]
    o.append('<polyline points="' + " ".join(f"{x},{y}" for x, y in pts) + '" fill="none" stroke="#3f7cc0" stroke-width="2"/>')
    o.append(f'<text x="{x0+57}" y="{y0-38}" text-anchor="middle" font-size="10.5" font-family="TeX Gyre Pagella">stopped</text>')
    o.append(f'<text x="{x0+2}" y="{y0-34}" font-size="10.5" font-family="TeX Gyre Pagella" transform="rotate(-50 {x0+2} {y0-34})"></text>')
    o.append(f'<text x="{x0+82}" y="{y0-62}" font-size="10.5" font-family="TeX Gyre Pagella" text-anchor="end">faster</text>')
    o.append(f'<text x="{x0+104}" y="{y0-18}" text-anchor="end" font-size="10.5" font-family="TeX Gyre Pagella">returning</text>')
    o.append(f'<text x="8" y="14" font-size="10.5" font-family="TeX Gyre Pagella">km</text>')
    o.append(f'<text x="{W-6}" y="{y0+11}" text-anchor="end" font-size="10.5" font-family="TeX Gyre Pagella">time (h)</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*0.85:.0f}" height="{H*0.85:.0f}" viewBox="0 0 {W} {H}">{"".join(o)}</svg>'


def d_conv():
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="118" height="36" viewBox="0 0 150 46">'
            '<text x="20" y="27" text-anchor="middle" font-size="11" font-family="TeX Gyre Pagella">km/h</text>'
            '<text x="130" y="27" text-anchor="middle" font-size="11" font-family="TeX Gyre Pagella">m/s</text>'
            '<path d="M42,16 Q75,2 108,16" fill="none" stroke="#3f7cc0" stroke-width="1.2" marker-end="url(#ah)"/>'
            '<path d="M108,32 Q75,46 42,32" fill="none" stroke="#7b1f4b" stroke-width="1.2" marker-end="url(#ah2)"/>'
            '<text x="75" y="9" text-anchor="middle" font-size="10" font-family="TeX Gyre Pagella" fill="#3f7cc0">÷ 3.6</text>'
            '<text x="75" y="46" text-anchor="middle" font-size="10" font-family="TeX Gyre Pagella" fill="#7b1f4b">× 3.6</text>'
            '<defs><marker id="ah" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#3f7cc0"/></marker>'
            '<marker id="ah2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#7b1f4b"/></marker></defs></svg>')


# ---------------- page 1: trigonometry ----------------
trig = [
    panel("Right-angled triangles", f"""
<div class="key">sin θ = {frac('<i>O</i>','<i>H</i>')} &nbsp;&nbsp; cos θ = {frac('<i>A</i>','<i>H</i>')} &nbsp;&nbsp; tan θ = {frac('<i>O</i>','<i>A</i>')}</div>
<div class="fx"><div>
<p>The hypotenuse is opposite the right angle and is the longest side.</p>
<p>Pythagoras (not on the reference sheet): <i>c</i>² = <i>a</i>² + <i>b</i>²</p></div>
<div>{d_soh()}</div></div>
<ul>
<li><b>Unknown on top:</b> multiply. <span class="eg">e.g. <i>x</i> = 15 sin 34° ≈ 8.39</span></li>
<li><b>Unknown on the bottom:</b> divide. <span class="eg">e.g. <i>x</i> = 9 ÷ tan 38° ≈ 11.52</span></li>
<li><b>Unknown angle:</b> use sin⁻¹, cos⁻¹ or tan⁻¹. <span class="eg">e.g. θ = tan⁻¹(7/11) ≈ 32°28′</span></li>
<li><b>Degrees and minutes:</b> 1° = 60′. 30″ or more rounds up: 34°12′32″ ≈ 34°13′.</li>
</ul>""", "SOH CAH TOA and Pythagoras"),
    panel("Angles of elevation and depression", f"""
<ul>
<li>Both are measured from the <b>horizontal</b>, never from the vertical.</li>
<li>Elevation = looking <b>up</b>. Depression = looking <b>down</b>.</li>
<li>They are <b>equal</b> (alternate angles between parallel horizontal lines). Move a depression angle inside the triangle before you use trig.</li>
<li>Add the observer’s <b>eye height</b> at the end.</li>
</ul><div style="text-align:center">{d_elev()}</div>
<p class="eg">e.g. Eyes 1.6 m high, 30 m from a tree, elevation 40°: height = 30 tan 40° + 1.6 ≈ 26.8 m</p>""", "measured from the horizontal"),
    panel("Bearings", f"""
<div class="fx" style="gap:4mm;align-items:flex-start"><div>
<p><b>True bearing:</b> clockwise from north, 3 digits, e.g. 045°T.</p>
<p><b>Compass bearing:</b> start at N or S, then turn towards E or W, e.g. N40°E.</p>
<p><b>Reverse bearing</b> (<i>A</i> from <i>B</i>): add or subtract 180°. <span class="eg">064°T ↔ 244°T</span></p>
<p>The word <b>from</b> tells you where to stand. Draw a north line at <b>every</b> point; co-interior angles between north lines add to 180°.</p>
</div><div style="width:38mm"><table class="rule"><tr><th colspan="2">compass → true</th></tr><tr><td>N θ E</td><td>θ</td></tr><tr><td>S θ E</td><td>180° − θ</td></tr><tr><td>S θ W</td><td>180° + θ</td></tr><tr><td>N θ W</td><td>360° − θ</td></tr></table></div>
<div>{d_rose()}</div></div>""", "draw a north line at every point", cls="span2"),
    panel("Non-right-angled triangles", f"""
<div class="fx"><div>
<p>Side <i>a</i> is opposite angle <i>A</i>, and so on.</p>
<div class="key"><b>Sine rule</b> &nbsp; {frac('<i>a</i>','sin <i>A</i>')} = {frac('<i>b</i>','sin <i>B</i>')} &nbsp; or &nbsp; {frac('sin <i>A</i>','<i>a</i>')} = {frac('sin <i>B</i>','<i>b</i>')}</div>
<div class="key"><b>Cosine rule</b> &nbsp; <i>c</i>² = <i>a</i>² + <i>b</i>² − 2<i>ab</i> cos <i>C</i><br>cos <i>C</i> = {frac('<i>a</i>² + <i>b</i>² − <i>c</i>²','2<i>ab</i>')}</div>
<div class="key"><b>Area</b> &nbsp; <i>A</i> = ½<i>ab</i> sin <i>C</i> &nbsp;(<i>C</i> is the angle between <i>a</i> and <i>b</i>)</div>
</div><div>{d_abc()}</div></div>
<ul>
<li><b>Obtuse angle?</b> sin⁻¹ only gives the acute angle. If told the angle is obtuse, use 180° − (calculator angle). <span class="eg">sin <i>B</i> = 0.6 → 36.9° or 143.1°</span></li>
<li>If cos <i>C</i> is <b>negative</b>, angle <i>C</i> is obtuse.</li>
<li>Take the <b>square root</b> at the end of the cosine rule.</li>
<li>Working backwards from an area: sin <i>C</i> = 2 × area ÷ (<i>ab</i>).</li>
</ul>""", "on the HSC reference sheet"),
    panel("Which rule do I use?", """
<table class="rule"><tr><th>I know…</th><th>use</th></tr>
<tr><td>a right angle</td><td>SOH CAH TOA or Pythagoras</td></tr>
<tr><td>a matching side and angle (+ one more)</td><td>sine rule</td></tr>
<tr><td>two sides and the angle between them</td><td>cosine rule (side) or ½<i>ab</i> sin <i>C</i> (area)</td></tr>
<tr><td>all three sides</td><td>cosine rule (angle)</td></tr></table>""", ""),
    panel("Compass radial surveys", f"""
<div class="fx"><div>
<ul>
<li>The angle at <i>O</i> = the <b>difference</b> between the two bearings. <span class="eg">130° − 040° = 90°</span></li>
<li>For the angle that crosses north, use 360° minus the difference.</li>
<li><b>Area</b> of the field = sum of ½<i>ab</i> sin <i>O</i> for each triangle.</li>
<li><b>Boundary</b> length = cosine rule. <b>Perimeter</b> = sum of the boundaries.</li>
</ul></div><div>{d_radial()}</div></div>""", ""),
    '''<div class="weekbox"><b class="k">Before you hand it in</b><br>
Calculator in <b>DEG</b> mode? Labelled diagram drawn? Full calculator value kept until the last line? Longest side opposite the largest angle? Rounded as asked, with units? Bearing matches your sketch?</div>''',
]

# ---------------- page 2: ratios and rates ----------------
rr = [
    panel("Ratios", f"""
<ul>
<li>Use the <b>same units</b> first, then divide by the HCF. <span class="eg">40 cm : 2 m = 40 : 200 = 1 : 5</span></li>
<li>Remove decimals by multiplying. <span class="eg">1.5 : 2 = 3 : 4</span></li>
<li>In <i>a</i> : <i>b</i>, the first part is {frac('<i>a</i>','<i>a</i> + <i>b</i>')} of the whole.</li>
</ul>
<p><b>Dividing in a ratio:</b> add the parts → find one part → multiply. Check that the shares add to the total. <span class="eg">$40 in 2 : 3: 5 parts of $8, so $16 and $24</span></p>
<p><b>Combining:</b> <i>a</i> : <i>b</i> = 2 : 3 and <i>b</i> : <i>c</i> = 4 : 5 → make the <i>b</i> parts equal (12): <i>a</i> : <i>b</i> : <i>c</i> = 8 : 12 : 15.</p>
<p><b>Changing ratios:</b> find the actual amounts, make the change, then write the new ratio.</p>""", "same kind of quantity, no units"),
    panel("Capture–recapture", f"""
<div class="key">{frac('tagged in 2nd sample','size of 2nd sample')} = {frac('number tagged at first','population <i>N</i>')}</div>
<p class="eg">e.g. 80 tagged; later 120 caught, 15 tagged: 15/120 = 80/<i>N</i>, so <i>N</i> = 640</p>
<p><b>Assumptions:</b> no births, deaths or migration between samples; tags stay on; tagged animals mix back in and are as easy to catch.</p>
<p><b>Fewer</b> tagged caught (tags fall off) → estimate too <b>high</b>. <b>More</b> tagged caught → too <b>low</b>. Average several samples.</p>""", ""),
    panel("Scales, maps and plans", """
<ul>
<li>Scale 1 : <i>n</i>: actual = map × <i>n</i>; map = actual ÷ <i>n</i>. Then convert units.</li>
<li><b>Areas</b> scale by <i>n</i>². <span class="eg">On 1 : 20 000, 1 cm² = 40 000 m² = 4 ha</span></li>
<li>Plans are in <b>millimetres</b>. Round <b>up</b> for tins, boxes and rolls, and add wastage first.</li>
</ul>
<table class="rule"><tr><td>1 m = 100 cm = 1000 mm</td><td>1 km = 1000 m = 100 000 cm</td></tr>
<tr><td>1 ha = 10 000 m²</td><td>1 km² = 100 ha</td></tr></table>""", "write the scale as 1 : n"),
    panel("Area from surveys", f"""
<div class="key">Trapezoidal rule: &nbsp;<i>A</i> ≈ {frac('<i>h</i>','2')}(<i>d<sub>f</sub></i> + <i>d<sub>l</sub></i>)</div>
<div class="fx"><div>
<p><i>d<sub>f</sub></i>, <i>d<sub>l</sub></i> = first and last measurements; <i>h</i> = the distance between them. For two or more strips, apply the rule to each and add.</p>
<p>From a photo or plan, convert to <b>real lengths first</b>.</p>
</div><div>{d_trap()}</div></div>
<p><b>Radial surveys:</b> area = sum of ½<i>ab</i> sin <i>O</i>; see the trigonometry page.</p>""", ""),
    panel("Rainfall and volume", """
<div class="key"><i>V</i> = <i>Ah</i> &nbsp;with <i>A</i> in m² and <i>h</i> in <b>metres</b> (mm ÷ 1000)</div>
<table class="rule"><tr><td>1 m³ = 1000 L = 1 kL</td><td>1 ML = 1 000 000 L</td></tr>
<tr><td colspan="2">1 mm of rain on 1 m² = exactly 1 L</td></tr></table>
<ul style="margin-top:1mm">
<li>Use the roof’s <b>plan area</b> (seen from above). Cylindrical tank: <i>V</i> = π<i>r</i>²<i>h</i>.</li>
<li>Only 90% collected? Multiply by 0.9. Rain needed to fill a tank: <i>h</i> = <i>V</i> ÷ <i>A</i>.</li>
</ul>
<p class="eg">e.g. 20 mm on a 150 m² roof: 150 × 0.02 = 3 m³ = 3000 L</p>""", ""),
    panel("Rates and best buys", f"""
<div class="fx"><div>
<p>A <b>rate</b> compares different kinds of quantity, so it has units (km/h, $/kg, L/min).</p>
<p>Convert the top and bottom units separately.</p></div><div>{d_conv()}</div></div>
<ul>
<li><b>Best buy:</b> find each unit price with the <b>same unit</b>, e.g. $/kg. The lowest wins. Apply any discount first.</li>
<li><b>Inverse rates:</b> find the total work first. <span class="eg">4 painters × 15 h = 60 painter-hours, so 6 painters take 10 h</span></li>
</ul>""", "units always matter"),
    panel("Speed and distance–time graphs", f"""
<div class="fx"><div>
<div class="key"><i>S</i> = {frac('<i>D</i>','<i>T</i>')} &nbsp; <i>D</i> = <i>ST</i> &nbsp; <i>T</i> = {frac('<i>D</i>','<i>S</i>')}</div>
<p>Minutes ÷ 60 = hours: 45 min = 0.75 h.</p>
<p><b>Average speed</b> = total distance ÷ total time, including stops. It is <b>not</b> the average of the speeds.</p></div>
<div>{d_dt()}</div></div>
<p>Gradient = speed. Flat = stopped. Two lines crossing = where and when people meet.</p>""", ""),
    panel("Fuel and energy", f"""
<ul>
<li>Fuel used = {frac('distance','100')} × rate (L/100 km). <span class="eg">640 km at 7.5 L/100 km = 48 L</span></li>
<li>Rate = {frac('fuel used','distance')} × 100. <span class="eg">14 km/L → 100 ÷ 14 ≈ 7.1 L/100 km</span></li>
<li>Smaller L/100 km = <b>more</b> efficient.</li>
<li><b>Energy:</b> kWh = kW × hours. W ÷ 1000 = kW. Cost = kWh × price.</li>
<li><b>Payback period</b> = extra cost ÷ saving per year.</li>
<li><b>Solar:</b> bill = bought × price + supply charge − exported × feed-in tariff.</li>
</ul>""", ""),
]


def page(num, title, sub, body, pno):
    return f"""<div class="page hs">
<div class="banner"><div class="bnum">{num}</div><div class="btxt"><h1>{title}</h1><div>{sub}</div></div></div>
<div class="grid">{body}</div>{foot(pno)}</div>"""


p1 = page("T", "Help sheet: Trigonometry", "Year 12 Standard 2 • MST-12-S2-04 • goes with the 3-week revision booklet",
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{trig[0]}{trig[1]}{trig[6]}</div>'
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{trig[3]}{trig[4]}{trig[5]}</div>{trig[2]}', 1)
p2 = page("R", "Help sheet: Ratios and rates", "Year 12 Standard 2 • MST-12-S2-05 • goes with the 3-week revision booklet",
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{rr[0]}{rr[1]}{rr[2]}{rr[3]}</div>'
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{rr[4]}{rr[5]}{rr[6]}{rr[7]}</div>'
          '<div class="weekbox span2"><b class="k">Common mistakes</b><br>'
          'Rain in mm must be changed to metres before <i>V</i> = <i>Ah</i>. &nbsp;1 h 45 min is 1.75 h, not 1.45 h. &nbsp;'
          'Average speed is total distance ÷ total time, not the average of the speeds. &nbsp;Areas scale by <i>n</i>², not <i>n</i>. &nbsp;'
          'Round <b>up</b> for bags, tins and boxes. &nbsp;Compare unit prices in the <b>same</b> unit. &nbsp;W must be changed to kW before finding kWh.</div>', 2)

html = f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Ratios, rates and trigonometry help sheet</title><style>{CSS}</style></head><body>{p1}{p2}</body></html>"""
open("helpsheet.html", "w").write(html)
print("ok")
