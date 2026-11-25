from diagrams import *          # existing triangle/graph diagrams
from fig import Fig, centroid, add, mul, sub, norm
from math import *
from nets import NETS

FONT = "'TeX Gyre Pagella', serif"


def s_q3():
    A = (0, 0); C = (12 * cos(radians(40)), 0); B = (C[0], 12 * sin(radians(40)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.right(C, A, B); f.angle(A, C, B, "40°", r=20, loff=13)
    f.side(A, B, "12 m", g); f.side(B, C, "x", g, italic=True)
    return f.render(220, 140)


def s_q23():
    A = (0, 0); C = (12, 0); B = (12, 5)
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.right(C, A, B); f.angle(A, C, B, "θ", r=26, italic=True, loff=9)
    f.side(A, B, "13", g); f.side(B, C, "5", g)
    return f.render(230, 120)


def s_q27():
    A, B, C = law_sines_tri(50, 70, 14 * sin(radians(60)) / sin(radians(70)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.angle(A, B, C, "50°", r=18, loff=13); f.angle(B, C, A, "70°", r=16, loff=13)
    f.side(A, C, "14 m", g); f.side(B, C, "x", g, italic=True)
    return f.render(220, 160)


def s_q31():
    A = (0, 0); B = (10, 0); C = (7 * cos(radians(60)), 7 * sin(radians(60)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.angle(A, B, C, "60°", r=18, loff=13)
    f.side(A, B, "10 m", g); f.side(A, C, "7 m", g); f.side(B, C, "x", g, italic=True)
    return f.render(220, 150)


def s_q51():
    A = (0, 0); C = (8 / tan(radians(35)), 0); B = (C[0], 8)
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.right(C, A, B); f.angle(A, C, B, "35°", r=22, loff=13)
    f.side(B, C, "8 cm", g); f.side(A, B, "x", g, italic=True)
    return f.render(230, 130)


def s_q50():
    from fig import smooth
    f = Fig(pad=14)
    arc = [(10 + 3 * sin(radians(t)), 3 - 3 * cos(radians(t))) for t in range(0, 181, 6)]
    f.poly([(0, 0)] + arc + [(0, 6)], fill="#eef3f9")
    f.line((10, 0), (10, 6), dash=True, w=1)
    f.text((5, 0), "10 m", dy=14, size=11.5); f.text((0, 3), "6 m", dx=-5, dy=4, anchor="end", size=11.5)
    return f.render(230, 120)


def network(key, W=270, H=150):
    pos, edges = NETS[key]
    xs = [p[0] for p in pos.values()]; ys = [p[1] for p in pos.values()]
    pad = 22
    sx = (W - 2 * pad) / (max(xs) - min(xs)); sy = (H - 2 * pad) / (max(ys) - min(ys))
    s = min(sx, sy * 1.0) if max(ys) > min(ys) else sx
    T = lambda p: (pad + (p[0] - min(xs)) * sx, pad + (max(ys) - p[1]) * sy)
    R = 11
    o = []
    for u, v, c in edges:
        a, b = T(pos[u]), T(pos[v])
        d = norm(sub(b, a))
        a2 = add(a, mul(d, R)); b2 = sub(b, mul(d, R + 1))
        n = (-d[1], d[0])
        h1 = add(sub(b2, mul(d, 8)), mul(n, 3.5)); h2 = add(sub(b2, mul(d, 8)), mul(n, -3.5))
        o.append(f'<line x1="{a2[0]:.1f}" y1="{a2[1]:.1f}" x2="{b2[0]:.1f}" y2="{b2[1]:.1f}" stroke="#333" stroke-width="1.3"/>')
        o.append(f'<polygon points="{b2[0]:.1f},{b2[1]:.1f} {h1[0]:.1f},{h1[1]:.1f} {h2[0]:.1f},{h2[1]:.1f}" fill="#333"/>')
        m = add(a, mul(sub(b, a), 0.45))
        if n[1] > 0 or (abs(n[1]) < 1e-9 and n[0] > 0):
            n = (-n[0], -n[1])           # put labels above / right of the edge
        L = add(m, mul(n, 9))
        o.append(f'<rect x="{L[0]-8:.1f}" y="{L[1]-8:.1f}" width="16" height="14" rx="3" fill="#fff"/>')
        o.append(f'<text x="{L[0]:.1f}" y="{L[1]+3.5:.1f}" text-anchor="middle" font-size="11.5" font-family="{FONT}" font-weight="700" fill="#222">{c}</text>')
    for k, p in pos.items():
        q = T(p)
        fill = "#fff"
        o.append(f'<circle cx="{q[0]:.1f}" cy="{q[1]:.1f}" r="{R}" fill="{fill}" stroke="#333" stroke-width="1.4"/>')
        o.append(f'<text x="{q[0]:.1f}" y="{q[1]+4:.1f}" text-anchor="middle" font-size="12" font-family="{FONT}" font-style="italic" fill="#222">{k}</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(o)}</svg>'


def s_netA(): return network("A")
def s_netC(): return network("C")
def s_netD(): return network("D", 290, 160)
def s_netE(): return network("E")
def s_netG(): return network("G")
def s_netH(): return network("H", 290, 170)
def s_netK(): return network("K", 290, 140)
