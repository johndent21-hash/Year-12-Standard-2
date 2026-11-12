"""Generate Year 12 Standard 2 HSC Task 1 (Ratios & rates + Trigonometry) as HTML."""
import base64, math, sys
from math import sin, cos, tan, radians as rad, degrees as deg

OUT = sys.argv[1]
SOL = len(sys.argv) > 3 and sys.argv[3] == "solutions"
from solutions import LINE_SOLS, MC_ANS, MC_NOTES
LOGO = base64.b64encode(open(sys.argv[2], 'rb').read()).decode()
FOOT_L = "Mathematics Standard 2 HSC Task 1"
FOOT_R = "Kingscliff High School"

# ---------------------------------------------------------------- svg helpers
class Svg:
    """Maths coordinates (y up) mapped onto an SVG canvas."""
    def __init__(self, w, h, xmin, xmax, ymin, ymax, pad=0):
        self.w, self.h = w, h
        self.xmin, self.ymin = xmin, ymin
        self.sx = (w - 2 * pad) / (xmax - xmin)
        self.sy = (h - 2 * pad) / (ymax - ymin)
        self.s = min(self.sx, self.sy)
        self.pad = pad
        self.items = []
    def P(self, x, y):
        return (self.pad + (x - self.xmin) * self.s, self.h - self.pad - (y - self.ymin) * self.s)
    def line(self, a, b, dash=False, w=1.4, col="#000"):
        (x1, y1), (x2, y2) = self.P(*a), self.P(*b)
        d = ' stroke-dasharray="4 3"' if dash else ''
        self.items.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{w}"{d}/>')
    def poly(self, pts, fill="none", w=1.4, close=True):
        s = " ".join(f"{x:.1f},{y:.1f}" for x, y in (self.P(*p) for p in pts))
        tag = "polygon" if close else "polyline"
        self.items.append(f'<{tag} points="{s}" fill="{fill}" stroke="#000" stroke-width="{w}"/>')
    def text(self, p, t, dx=0, dy=0, anchor="middle", size=13, italic=False, bold=False, col="#000"):
        x, y = self.P(*p)
        st = (' font-style="italic"' if italic else '') + (' font-weight="bold"' if bold else '')
        self.items.append(f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" text-anchor="{anchor}" font-size="{size}" fill="{col}"{st}>{t}</text>')
    def raw_text(self, x, y, t, anchor="start", size=12, col="#000", italic=False):
        st = ' font-style="italic"' if italic else ''
        self.items.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" fill="{col}"{st}>{t}</text>')
    def arc(self, v, r_px, a1, a2):
        """Arc at vertex v from maths-angle a1 to a2 (degrees, anticlockwise), radius in px."""
        cx, cy = self.P(*v)
        p1 = (cx + r_px * cos(rad(a1)), cy - r_px * sin(rad(a1)))
        p2 = (cx + r_px * cos(rad(a2)), cy - r_px * sin(rad(a2)))
        large = 1 if (a2 - a1) % 360 > 180 else 0
        self.items.append(f'<path d="M{p1[0]:.1f},{p1[1]:.1f} A{r_px},{r_px} 0 {large} 0 {p2[0]:.1f},{p2[1]:.1f}" fill="none" stroke="#000" stroke-width="1"/>')
    def right_angle(self, v, a1, a2, size_px=10):
        cx, cy = self.P(*v)
        u = (cos(rad(a1)), -sin(rad(a1))); w = (cos(rad(a2)), -sin(rad(a2)))
        p1 = (cx + u[0] * size_px, cy + u[1] * size_px)
        p3 = (cx + w[0] * size_px, cy + w[1] * size_px)
        p2 = (p1[0] + w[0] * size_px, p1[1] + w[1] * size_px)
        self.items.append(f'<polyline points="{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}" fill="none" stroke="#000" stroke-width="1"/>')
    def dot(self, p, r=2.5):
        x, y = self.P(*p)
        self.items.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#000"/>')
    def north(self, p, length_px=40, label=True):
        x, y = self.P(*p)
        self.items.append(f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x:.1f}" y2="{y-length_px:.1f}" stroke="#000" stroke-width="1" stroke-dasharray="3 2"/>')
        self.items.append(f'<polygon points="{x:.1f},{y-length_px-7:.1f} {x-4:.1f},{y-length_px+1:.1f} {x+4:.1f},{y-length_px+1:.1f}" fill="#000"/>')
        if label:
            self.items.append(f'<text x="{x:.1f}" y="{y-length_px-10:.1f}" text-anchor="middle" font-size="11">N</text>')
    def add(self, s):
        self.items.append(s)
    def render(self, note=True):
        n = '' if not note else f'<text x="{self.w-4}" y="14" text-anchor="end" font-size="10" fill="#444">NOT TO SCALE</text>'
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'font-family="Liberation Sans, Arial, sans-serif">{n}{"".join(self.items)}</svg>')

def side_label(svg, a, b, t, off_px=12, **kw):
    """Label at the midpoint of ab, pushed off_px to the left of a->b (maths orientation)."""
    (x1, y1), (x2, y2) = svg.P(*a), svg.P(*b)
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy)
    nx, ny = dy / L, -dx / L   # left normal in svg coords
    svg.raw_text(f"{mx+nx*off_px:.1f}", f"{my+ny*off_px+4:.1f}", t, anchor="middle", size=kw.get('size', 13))

# ---------------------------------------------------------------- diagrams
def d_mc4():
    adj = 20 * cos(rad(35)); opp = 20 * sin(rad(35))
    A, B, C = (0, 0), (adj, 0), (adj, opp)
    s = Svg(300, 170, -2, adj + 3, -3, opp + 2, pad=10)
    s.poly([A, B, C]); s.right_angle(B, 180, 90)
    s.arc(A, 34, 0, 35); s.text(A, "35°", dx=52, dy=-8, size=12)
    side_label(s, C, A, "20", -12); side_label(s, A, B, "<tspan font-style='italic'>x</tspan>", 14)
    return s.render()

def d_mc7():
    w, h = 360, 230
    L, R, T, Bm = 50, 340, 20, 190
    xmax, ymax = 3, 50
    X = lambda t: L + t / xmax * (R - L)
    Y = lambda d: Bm - d / ymax * (Bm - T)
    g = []
    for t in [i * 0.5 for i in range(7)]:
        g.append(f'<line x1="{X(t)}" y1="{T}" x2="{X(t)}" y2="{Bm}" stroke="#bbb" stroke-width="0.7"/>')
        g.append(f'<text x="{X(t)}" y="{Bm+15}" text-anchor="middle" font-size="11">{t:g}</text>')
    for d in range(0, 51, 5):
        g.append(f'<line x1="{L}" y1="{Y(d)}" x2="{R}" y2="{Y(d)}" stroke="#bbb" stroke-width="0.7"/>')
        if d % 10 == 0:
            g.append(f'<text x="{L-6}" y="{Y(d)+4}" text-anchor="end" font-size="11">{d}</text>')
    g.append(f'<line x1="{L}" y1="{Bm}" x2="{R}" y2="{Bm}" stroke="#000" stroke-width="1.3"/>')
    g.append(f'<line x1="{L}" y1="{Bm}" x2="{L}" y2="{T}" stroke="#000" stroke-width="1.3"/>')
    pts = [(0, 0), (1, 20), (1.5, 20), (2.5, 45)]
    g.append('<polyline points="' + " ".join(f"{X(a)},{Y(b)}" for a, b in pts) + '" fill="none" stroke="#000" stroke-width="2.2"/>')
    g.append(f'<text x="{(L+R)/2}" y="{h-5}" text-anchor="middle" font-size="12">Time (hours)</text>')
    g.append(f'<text x="14" y="{(T+Bm)/2}" text-anchor="middle" font-size="12" transform="rotate(-90 14 {(T+Bm)/2})">Distance from home (km)</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" font-family="Liberation Sans, Arial, sans-serif">{"".join(g)}</svg>'

def d_mc9():
    a = 12 * sin(rad(70)) / sin(rad(50)); c = 12 * sin(rad(60)) / sin(rad(50))
    B, C = (0, 0), (a, 0); A = (c * cos(rad(50)), c * sin(rad(50)))
    s = Svg(300, 200, -1.5, a + 1.5, -2.5, A[1] + 1.5, pad=10)
    s.poly([A, B, C])
    s.arc(B, 28, 0, 50); s.text(B, "50°", dx=44, dy=-9, size=12)
    s.arc(C, 26, 120, 180); s.text(C, "60°", dx=-42, dy=-8, size=12)
    side_label(s, C, A, "12 cm", -18); side_label(s, B, C, "<tspan font-style='italic'>x</tspan>", -14)
    return s.render()

def d_q13():
    hgt = 85 * tan(rad(23))
    P, F, T = (0, 0), (85, 0), (85, hgt)
    s = Svg(360, 140, -5, 112, -10, hgt + 6, pad=6)
    # headland silhouette behind the vertical
    s.add('')
    s.poly([F, T, (92, hgt), (100, hgt - 8), (106, 0)], fill="#e6e6e6", w=1)
    s.line(P, F); s.line(F, T, w=1.6); s.line(P, T)
    s.right_angle(F, 180, 90)
    s.arc(P, 40, 0, 23); s.text(P, "23°", dx=58, dy=-7, size=12)
    side_label(s, P, F, "85 m", -14); side_label(s, F, T, "<tspan font-style='italic'>h</tspan>", 12)
    s.dot(P); s.text(P, "P", dx=-8, dy=4, size=12)
    return s.render()

def d_q17():
    s = Svg(420, 230, -8, 52, -8, 50, pad=6)
    xs, ds = [0, 20, 40], [32, 41, 28]
    # creek boundary through offset tops, smooth curve via Catmull-Rom (passes through the tops)
    pts = [(-4, 27), (0, 32), (20, 41), (40, 28), (44, 24)]
    path = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for k in range(0, 21):
            t = k / 20
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t * t + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t ** 3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t ** 3)
            path.append((x, y))
    region = [(0, 0)] + path + [(40, 0)]
    s.poly(region, fill="#eef4fb", w=0)
    s.poly(path, close=False, w=1.8)
    s.line((0, 0), (40, 0), w=1.8)
    s.line((0, 0), (0, 32), w=1.8); s.line((40, 0), (40, 28), w=1.8)
    s.line((20, 0), (20, 41), dash=True)
    for x, d in zip(xs, ds):
        s.text((x, d / 2), f"{d} m", dx=(-24 if x == 0 else (24 if x == 40 else 22)), size=12)
    s.text((10, 0), "20 m", dy=16, size=12); s.text((30, 0), "20 m", dy=16, size=12)
    s.text((20, 46), "Creek", size=12, italic=True)
    s.text((20, 0), "Road", dy=30, size=12, italic=True)
    s.right_angle((0, 0), 0, 90, 8); s.right_angle((20, 0), 0, 90, 8); s.right_angle((40, 0), 90, 180, 8)
    return s.render()

def d_q19():
    x = (49 - 81 + 144) / 24; y = math.sqrt(49 - x * x)
    B, C, A = (0, 0), (12, 0), (x, y)
    s = Svg(300, 170, -1.5, 13.5, -2, y + 1.5, pad=8)
    s.poly([A, B, C])
    a1 = deg(math.atan2(B[1] - A[1], B[0] - A[0])); a2 = deg(math.atan2(C[1] - A[1], C[0] - A[0]))
    s.arc(A, 20, a1 % 360, a2 % 360)
    s.text(A, "<tspan font-style='italic'>θ</tspan>", dy=32, size=13)
    side_label(s, A, B, "7 m", -14); side_label(s, C, A, "9 m", -14); side_label(s, B, C, "12 m", -14)
    return s.render()

def d_q21():
    Q = (18 * sin(rad(60)), 18 * cos(rad(60)))
    R = (Q[0] + 25 * sin(rad(150)), Q[1] + 25 * cos(rad(150)))
    P = (0, 0)
    s = Svg(360, 300, -6, 34, -16, 18, pad=10)
    s.north(P, 55); s.north(Q, 50)
    s.line(P, Q, w=1.6); s.line(Q, R, w=1.6); s.line(P, R, dash=True)
    for p, n, dx, dy in [(P, "P", -12, 4), (Q, "Q", -12, -4), (R, "R", 10, 12)]:
        s.dot(p); s.text(p, n, dx=dx, dy=dy, size=13, bold=True)
    s.arc(P, 26, 30, 90); s.text(P, "60°", dx=22, dy=-30, size=11)
    s.arc(Q, 20, 300, 450); s.text(Q, "150°", dx=30, dy=-12, size=11)
    side_label(s, P, Q, "18 km", 13); side_label(s, Q, R, "25 km", -24)
    return s.render()

def d_q22():
    data = [("A", 25, 40), ("B", 130, 55), ("C", 245, 48)]
    O = (0, 0)
    pts = {n: (r * sin(rad(b)), r * cos(rad(b))) for n, b, r in data}
    s = Svg(440, 340, -75, 70, -60, 50, pad=6)
    s.poly([pts["A"], pts["B"], pts["C"]], fill="#f3f3f3", w=0)
    for a, b in [("A", "B"), ("B", "C"), ("C", "A")]:
        s.line(pts[a], pts[b], dash=True, w=1.1)
    for n, b, r in data:
        s.line(O, pts[n], w=1.6)
        lab = {"A": (8, -6, "start"), "B": (8, 14, "start"), "C": (-8, 16, "end")}[n]
        s.dot(pts[n])
        s.text(pts[n], f"{n} {b:03d}°", dx=lab[0], dy=lab[1], anchor=lab[2], size=13)
        side_label(s, O, pts[n], f"{r} m", {"A": -20, "B": 18, "C": 14}[n], size=12)
    s.north(O, 32)
    s.dot(O); s.text(O, "O", dx=-13, dy=-4, size=13, bold=True)
    return s.render()

def d_q23():
    h = 54.6624; BF = h / tan(rad(47)); AF = BF + 40
    A, B, F, T = (0, 0), (40, 0), (AF, 0), (AF, h)
    s = Svg(440, 230, -6, AF + 12, -9, h + 6, pad=8)
    s.line(A, F, w=1.6); s.line(F, T, w=3); s.line(A, T); s.line(B, T)
    s.right_angle(F, 180, 90)
    s.arc(A, 46, 0, 31); s.text(A, "31°", dx=62, dy=-8, size=12)
    s.arc(B, 30, 0, 47); s.text(B, "47°", dx=44, dy=-12, size=12)
    side_label(s, A, B, "40 m", -14); side_label(s, F, T, "<tspan font-style='italic'>h</tspan>", -12)
    for p, n, dx, dy in [(A, "A", -10, 5), (B, "B", 0, 18), (F, "F", 10, 14), (T, "T", 10, -4)]:
        s.dot(p); s.text(p, n, dx=dx, dy=dy, size=13, bold=True)
    return s.render()

def d_oil():
    items = [("A", "500 mL", "$6.80"), ("B", "750 mL", "$9.90"), ("C", "1 L", "$13.50"), ("D", "2 L", "$26.80")]
    cells = "".join(f'<td><div class="bottle"><b>{a}.</b><div class="lab">{v}<br><span>{p}</span></div></div></td>' for a, v, p in items)
    return f'<table class="oil"><tr>{cells}</tr></table>'

# ---------------------------------------------------------------- html pieces
_li = [0]
def lines(n, indent=0, gap=36):
    sol = LINE_SOLS[_li[0]]; _li[0] += 1
    assert len(sol) <= n, (sol, n)
    txt = (sol + [""] * n)[:n] if SOL else [""] * n
    return f'<div class="lines" style="margin-left:{indent}mm">' + "".join(f'<div class="ln" style="height:{gap}px"><span class="sol">{t}</span></div>' for t in txt) + '</div>'

def box(h_mm, w_mm=95):
    return f'<div class="drawbox" style="height:{h_mm}mm;width:{w_mm}mm"></div>'

def q(num, body, marks=None):
    m = f'<div class="mk">{marks}</div>' if marks is not None else ''
    return f'<div class="q"><div class="qn">{num}</div><div class="qb">{body}</div>{m}</div>'

def part(letter, body, marks=None):
    m = f'<div class="mk">{marks}</div>' if marks is not None else ''
    return f'<div class="part"><div class="pl">{letter}.</div><div class="pb">{body}</div>{m}</div>'

_oi = [0]
MC_ORDER = [1, 2, 3, 4, 6, 7, 8, 9, 10]
def mc_note(qn):
    return f'<div class="mcnote">{MC_NOTES[qn]} &nbsp;<b>Answer: {MC_ANS[qn]}</b></div>' if SOL else ''
def opts(*o):
    qn = MC_ORDER[_oi[0]]; _oi[0] += 1
    a = "ABCD".index(MC_ANS[qn]) if SOL else -1
    return '<div class="opts">' + "".join(f'<div><span class="ol{" ring" if i == a else ""}">{"ABCD"[i]}.</span> {x}</div>' for i, x in enumerate(o)) + '</div>' + mc_note(qn)

page_no = [0]
def page(content, footer=True):
    page_no[0] += 1
    f = (f'<div class="foot"><span>{FOOT_L}</span><span>{page_no[0]}</span><span>{FOOT_R}</span></div>' if footer else '')
    return f'<section class="page">{content}{f}</section>'

CSS = r"""
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Liberation Serif", "Times New Roman", serif; font-size: 12.5pt; color:#000; }
.page { width:210mm; height:297mm; padding:16mm 18mm 20mm 18mm; position:relative; overflow:hidden; page-break-after:always; }
.foot { position:absolute; left:18mm; right:18mm; bottom:9mm; display:flex; justify-content:space-between; font-family:"Carlito","Liberation Sans",sans-serif; font-size:10pt; color:#777; }
.sans { font-family: "Liberation Sans", Arial, sans-serif; }
.q { display:flex; margin: 0 0 7mm 0; page-break-inside: avoid; }
.qn { width:9mm; font-weight:bold; flex:none; }
.qb { flex:1; line-height:1.55; }
.mk { width:8mm; text-align:right; font-weight:bold; flex:none; }
.part { display:flex; margin: 3mm 0 0 0; }
.pl { width:7mm; flex:none; }
.pb { flex:1; }
.opts { margin: 3mm 0 0 8mm; line-height: 2.0; }
.ol { display:inline-block; width:7mm; }
.lines .ln { border-bottom: 1px solid #888; position:relative; }
.sol { position:absolute; left:2mm; bottom:2px; color:#c00000; font-family:"Liberation Sans",Arial,sans-serif; font-size:11pt; white-space:nowrap; }
.mcnote { color:#c00000; font-family:"Liberation Sans",Arial,sans-serif; font-size:10.5pt; margin: 1mm 0 0 8mm; }
.ring { color:#c00000; font-weight:bold; border:1.6px solid #c00000; border-radius:50%; width:6mm !important; text-align:center; margin-right:1mm; }
.oval.r { background:#c00000; border-color:#c00000; }
.solbanner { color:#c00000; font-family:"Liberation Sans",Arial,sans-serif; font-weight:bold; }
.drawbox { border:1.2px solid #000; margin: 3mm auto; }
.fig { text-align:center; margin: 3mm 0; }
.sechead { margin-bottom: 6mm; }
.sechead h2 { font-size: 14pt; margin: 0 0 4mm 0; }
.sechead p { margin: 0; font-weight: bold; font-size: 11pt; line-height: 1.6; }
.sechead hr { border:0; border-top: 3px solid #000; margin-top: 5mm; }
.oil { margin: 3mm auto; border-collapse: separate; border-spacing: 8mm 0; }
.oil td { vertical-align: bottom; }
.bottle { width: 30mm; height: 36mm; border: 1.5px solid #000; border-radius: 6mm 6mm 2mm 2mm; position:relative; text-align:center; font-family:"Liberation Sans",sans-serif; font-size:11pt; padding-top:3mm; background:#fafaf0;}
.bottle .lab { position:absolute; left:3mm; right:3mm; top:11mm; border:1px solid #000; background:#fff; padding:2mm 0; line-height:1.4; }
.bottle .lab span { font-weight: bold; }
.mcs table { border-collapse: collapse; width:100%; font-size: 11.5pt; }
.mcs td { border: 1px solid #000; padding: 3px 6px; height: 7mm; }
.oval { display:inline-block; width:15px; height:11px; border:1.6px solid #000; border-radius:50%; vertical-align:middle; margin-left:6px; }
.oval.f { background:#000; }
.mcgrid { margin-top: 10mm; font-family:"Carlito","Liberation Sans",sans-serif; font-size: 13pt; }
.mcgrid div { display:flex; height: 10mm; align-items:center; }
.mcgrid span { width: 30mm; }
.mcgrid span:first-child { width: 18mm; }
.extra { border-collapse: collapse; width:100%; }
.extra td { border:1px solid #000; height: 9.3mm; }
.cover h1 { font-family:"Liberation Sans",Arial,sans-serif; font-weight: normal; font-size: 34pt; margin: 14mm 0 14mm 0; }
.cv-row { display:flex; border-top:1.5px solid #000; padding-top:2mm; margin-top: 7mm; }
.cv-l { width: 52mm; font-weight:bold; font-family:"Liberation Sans",Arial,sans-serif; font-size: 11.5pt; }
.cv-r { flex:1; font-family:"Liberation Sans",Arial,sans-serif; font-size: 11.5pt; line-height:1.55; }
.cv-r ul { margin: 0 0 4mm 0; padding-left: 7mm; }
.namebox { border:1px solid #000; width: 62mm; height: 10mm; font-size: 9pt; padding: 3mm 2mm; font-family:"Liberation Serif",serif; margin-bottom: 9mm; }
"""

pages = []

# ---- cover
cover = f'''
<div class="cover">
 <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-top:6mm">
  <img src="data:image/jpeg;base64,{LOGO}" style="width:62mm; margin-left:10mm">
  <div style="margin-right:20mm"><div class="namebox">NAME:{' <span class="solbanner">WORKED SOLUTIONS</span>' if SOL else ''}</div><div class="namebox">TEACHER:</div></div>
 </div>
 <div style="display:flex; align-items:center; margin: 14mm 0 0 25mm;" class="sans">
  <div style="font-size:24pt; font-weight:bold; padding-right:3mm">2026</div>
  <div style="border-left:1.5px solid #000; padding: 4mm 0 10mm 2mm; font-size:12pt; line-height:1.3">YEAR 12<br>HSC TASK 1</div>
 </div>
 <h1>Mathematics Standard 2</h1>
 <div class="sans" style="font-size:11pt; margin:-10mm 0 4mm 0; color:#333">Ratios and rates &nbsp;•&nbsp; Trigonometry{' &nbsp;•&nbsp; <span class="solbanner">WORKED SOLUTIONS – TEACHER COPY</span>' if SOL else ''}</div>
 <div class="cv-row"><div class="cv-l">General Instructions</div><div class="cv-r"><ul>
  <li>Working time – 1 hour</li><li>Write using black pen</li><li>Calculators approved by NESA may be used</li>
  <li>A reference sheet is provided at the back of this paper</li>
  <li>For questions in Section II, show relevant mathematical reasoning and/or calculations</li></ul></div></div>
 <div class="cv-row"><div class="cv-l">Total Marks: 45</div><div class="cv-r">
  <b>Section I – 10 marks (pages 3–6)</b><ul><li>Attempt Questions 1–10</li><li>Allow about 15 minutes for this section</li></ul>
  <b>Section II – 35 marks (pages 7–13)</b><ul><li>Attempt Questions 11–23</li><li>Allow about 45 minutes for this section</li></ul></div></div>
 <div class="cv-row"><div class="cv-l">Outcomes assessed</div><div class="cv-r" style="font-size:10pt">
  MST-12-S2-04 applies trigonometry to solve problems involving right-angled and non-right-angled triangles<br>
  MST-12-S2-05 solves practical problems involving ratios and rates<br>
  MAO-WM-01 develops understanding and fluency in mathematics through exploring and connecting mathematical concepts, choosing and applying mathematical techniques to solve problems, and communicating their thinking and reasoning coherently and clearly</div></div>
</div>'''
pages.append(page(cover, footer=False))

# ---- MC answer sheet
mc = '''<h3 style="text-align:center; font-size:14pt; margin-top:4mm">Section I – Multiple Choice Answer Sheet</h3>
<p>Select the alternative A, B, C or D that best answers the question. Fill in the response oval completely.</p>
<div class="mcs"><table><tr><td><b>Sample:</b></td><td>2 + 4 =</td><td>(A) 2</td><td>(B) 6</td><td>(C) 8</td><td>(D) 9</td></tr>
<tr><td></td><td></td><td>A<span class="oval"></span></td><td>B<span class="oval f"></span></td><td>C<span class="oval"></span></td><td>D<span class="oval"></span></td></tr></table></div>
<p>If you think you have made a mistake, put a cross through the incorrect answer and fill in the new answer.</p>
<div class="mcs"><table><tr><td style="width:16%"></td><td style="width:16%"></td><td>A<span class="oval f"></span></td><td>B<span class="oval f" style="outline:none">&#x2715;</span></td><td>C<span class="oval"></span></td><td>D<span class="oval"></span></td></tr></table></div>
<p>If you change your mind and have crossed out what you consider to be the correct answer, then indicate the correct answer by writing the word <b>correct</b> and drawing an arrow as follows.</p>
<div class="mcs"><table><tr><td style="width:16%"></td><td style="width:16%"></td><td>A<span class="oval f"></span></td><td>B<span class="oval f"></span> <small style="font-size:8pt">&#8601; correct</small></td><td>C<span class="oval"></span></td><td>D<span class="oval"></span></td></tr></table></div>
<div class="mcgrid">''' + "".join(
    f'<div><span>{i}.</span>' + "".join(f'<span>{L} <i class="oval{" r" if SOL and MC_ANS[i] == L else ""}"></i></span>' for L in "ABCD") + '</div>'
    for i in range(1, 11)) + '</div>'
pages.append(page(mc))

# ---- Section I
s1head = '''<div class="sechead"><h2>Section I</h2><p>10 marks<br>Attempt Questions 1–10<br>Allow about 15 minutes for this section</p>
<p style="font-weight:normal; margin-top:4mm">Use the multiple-choice answer sheet for Questions 1–10.</p><hr></div>'''

Q1 = q(1, "What is the ratio 1.2 L : 400 mL in simplest form?" + opts("1 : 3", "3 : 1", "3 : 10", "30 : 1"))
Q2 = q(2, "On a map, a distance of 4 cm represents an actual distance of 2 km. What is the scale of the map?" + opts("1 : 500", "1 : 5000", "1 : 50 000", "1 : 500 000"))
Q3 = q(3, "What is the compass bearing S35°W written as a true bearing?" + opts("035°", "145°", "235°", "215°"))
pages.append(page(s1head + Q1 + Q2 + Q3))

Q4 = q(4, "Which expression gives the value of <i>x</i> in the triangle shown?" + f'<div class="fig">{d_mc4()}</div>' +
       opts("20 cos 35°", "20 sin 35°", "20 ÷ cos 35°", "20 tan 35°"))
Q5 = q(5, "Olive oil is sold in four bottle sizes. Which bottle is the best value for money?" + d_oil() +
       '<div style="margin-left:8mm">A. &nbsp;500 mL for $6.80 &nbsp;&nbsp; B. &nbsp;750 mL for $9.90 &nbsp;&nbsp; C. &nbsp;1 L for $13.50 &nbsp;&nbsp; D. &nbsp;2 L for $26.80</div>' + mc_note(5))
Q6 = q(6, "Fisheries officers catch, tag and release 60 bream in Cudgen Creek. A week later they catch 50 bream, and 6 of these are tagged. What is the best estimate of the number of bream in the creek?" +
       opts("110", "300", "360", "500"))
pages.append(page(Q4 + Q5 + Q6))

Q7 = q(7, "The distance–time graph shows Mia’s bike ride from home to Hastings Point.<div class='fig'>" + d_mc7() + "</div>What was Mia’s speed during the final stage of her ride?" +
       opts("18 km/h", "20 km/h", "25 km/h", "45 km/h"))
Q8 = q(8, "A 2400 W heater is used for 3 hours. Electricity costs 30 c/kWh. What does it cost to run the heater for this time?" +
       opts("$2.16", "$7.20", "$21.60", "$216.00"))
pages.append(page(Q7 + Q8))

Q9 = q(9, "What is the value of <i>x</i>, correct to one decimal place?" + f'<div class="fig">{d_mc9()}</div>' +
       opts("9.8 cm", "10.6 cm", "13.6 cm", "14.7 cm"))
Q10 = q(10, "A triangle has an area of 30 m<sup>2</sup>. Two of its sides are 8 m and 10 m, and the angle between these two sides is acute. What is the size of this angle, correct to the nearest degree?" +
        opts("22°", "41°", "49°", "131°"))
pages.append(page(Q9 + Q10))

# ---- Section II
s2head = '''<div class="sechead"><h2>Section II</h2><p>35 marks<br>Attempt Questions 11–23<br>Allow about 45 minutes for this section</p>
<p style="font-weight:normal; margin-top:4mm">Answer each question in the spaces provided. Your responses should include relevant mathematical reasoning and/or calculations.</p><hr></div>'''

Q11 = q(11, "Ava, Ben and Cal buy a raffle ticket together. Ava pays $3, Ben pays $5 and Cal pays $7. The ticket wins a prize of $1200, which they share in the same ratio as the amounts they paid. How much does Cal receive?" + lines(3), 2)
Q12 = q(12, part("a", "Write the true bearing 290° as a compass bearing.", 1) + lines(1, 7) +
        part("b", "The bearing of Cook Island from Fingal Head is 052°. What is the bearing of Fingal Head from Cook Island?", 1) + lines(1, 7))
Q13 = q(13, "From a point P on the sand, 85 m from the base of a headland, the angle of elevation of the top of the headland is 23°. Find the height, <i>h</i>, of the headland, correct to the nearest metre." +
        f'<div class="fig">{d_q13()}</div>' + lines(3), 2)
pages.append(page(s2head + Q11 + Q12 + Q13))

Q14 = q(14, "Jordan drives from Kingscliff to Sydney, a distance of approximately 820 km. Jordan’s car uses 7.4 L/100 km." +
        part("a", "How many litres of fuel will Jordan’s car use for this trip?", 1) + lines(2, 7) +
        part("b", "Fuel costs $2.06 per litre. Jordan says the fuel for the trip will cost less than $120. Is Jordan correct? Justify your answer with a calculation.", 1) + lines(2, 7))
Q15 = q(15, "A 2500 W air conditioner runs for 6 hours a day for the 90 days of summer. Electricity costs 32 c/kWh. Find the cost of running the air conditioner for the summer." + lines(3), 2)
Q16 = q(16, "On a map with a scale of 1 : 25 000, the coastal walking track from Kingscliff to Cudgen Headland measures 14.6 cm." +
        part("a", "Find the actual length of the track in kilometres.", 1) + lines(2, 7) +
        part("b", "Ella walks the track at an average speed of 4.5 km/h. How long does the walk take, correct to the nearest minute?", 2) + lines(3, 7))
pages.append(page(Q14 + Q15 + Q16))

Q17 = q(17, "A block of land lies between a straight road and a creek. Measurements taken from the road are shown in the diagram. Use two applications of the trapezoidal rule to estimate the area of the block." +
        f'<div class="fig">{d_q17()}</div>' + lines(3), 2)
Q18 = q(18, "A garden shed has a flat roof that is 8 m long and 5.5 m wide. During a storm, 24 mm of rain falls on the roof, and 90% of this rain is collected in a tank. How many litres of water are collected?" + lines(3), 2)
pages.append(page(Q17 + Q18))

Q19 = q(19, "Find the size of angle <i>θ</i> in the triangle below, correct to the nearest degree." + f'<div class="fig">{d_q19()}</div>' + lines(3), 2)
Q20 = q(20, "A 6 L container is full of a drink made from cordial and water mixed in the ratio 1 : 5. Then 1.5 L of the drink is poured out, and the container is filled back up to 6 L with water only. What is the new ratio of cordial to water, in simplest form?" + lines(5), 3)
pages.append(page(Q19 + Q20))

Q21 = q(21, "A boat sails 18 km from port P to Q on a bearing of 060°. It then sails 25 km from Q to R on a bearing of 150°." +
        f'<div class="fig">{d_q21()}</div>' +
        part("a", "Show that ∠PQR = 90°.", 1) + lines(2, 7) +
        part("b", "Find the distance PR, correct to one decimal place.", 1) + lines(2, 7) +
        part("c", "Find the bearing of R from P, correct to the nearest degree.", 2) + lines(3, 7))
pages.append(page(Q21))

Q22 = q(22, "A compass radial survey of a triangular field ABC is shown. The bearing and distance of each corner from the point O are given." +
        f'<div class="fig">{d_q22()}</div>' +
        part("a", "Show that the size of ∠BOC is 115°.", 1) + lines(1, 7) +
        part("b", "Find the area of triangle AOB, correct to the nearest square metre.", 2) + lines(3, 7) +
        part("c", "A fence is to be built along the boundary AB. Find the length of the fence, correct to one decimal place.", 2) + lines(3, 7))
pages.append(page(Q22))

Q23 = q(23, "From point A on level ground, the angle of elevation of the top, T, of a telecommunications tower is 31°. From point B, 40 m closer to the base F of the tower, the angle of elevation of T is 47°." +
        f'<div class="fig">{d_q23()}</div>' +
        part("a", "Show that ∠ATB = 16°.", 1) + lines(1, 7) +
        part("b", "Use the sine rule in triangle ABT to find the length of BT, correct to one decimal place.", 2) + lines(3, 7) +
        part("c", "Hence find the height, <i>h</i>, of the tower, correct to the nearest metre.", 1) + lines(2, 7))
end = '<div style="text-align:center; font-family:Carlito,Liberation Sans,sans-serif; font-size:24pt; margin-top:6mm">End of Exam</div>'
pages.append(page(Q23 + end))

extra = '<table class="extra"><tr><td style="height:22mm; vertical-align:top; padding:2mm">Section II &nbsp; Extra writing space<br><br>If you use this space, clearly indicate which question you are answering.</td></tr>' + "<tr><td></td></tr>" * 23 + '</table>'
pages.append(page(extra))

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Year 12 Standard 2 HSC Task 1</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'
assert _li[0] == len(LINE_SOLS) and _oi[0] == 9
open(OUT, 'w').write(html)
print("pages:", page_no[0])
