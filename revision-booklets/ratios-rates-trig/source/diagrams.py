from fig import *
from math import *

D = degrees


def law_sines_tri(A_ang, B_ang, c):
    """Triangle with base AB=c along x-axis, angles A,B; returns A,B,C points."""
    C_ang = 180 - A_ang - B_ang
    b = c * sin(rad(B_ang)) / sin(rad(C_ang))
    A = (0, 0)
    B = (c, 0)
    C = (b * cos(rad(A_ang)), b * sin(rad(A_ang)))
    return A, B, C


def q2():  # right triangle hyp 15, 34 deg, x opposite
    A = (0, 0); C = (15 * cos(rad(34)), 0); B = (C[0], 15 * sin(rad(34)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none")
    f.right(C, A, B); f.angle(A, C, B, "34°", r=20, loff=13)
    f.side(A, B, "15 cm", g); f.side(B, C, "x", g, italic=True)
    return f.render(230, 150)


def q8():  # legs adj 11.2, opp 7.5, theta
    A = (0, 0); C = (11.2, 0); B = (11.2, 7.5)
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.right(C, A, B)
    f.angle(A, C, B, "θ", r=22, italic=True, loff=10)
    f.side(B, C, "7.5 m", g); f.side(A, C, "11.2 m", g)
    return f.render(230, 160)


def q10():  # PQR: P=52, Q=61, PQ=20, find QR
    P, Q, R = law_sines_tri(52, 61, 20)
    f = Fig(); g = centroid(P, Q, R)
    f.poly([P, Q, R], fill="none")
    f.angle(P, Q, R, "52°", r=18, loff=13); f.angle(Q, R, P, "61°", r=18, loff=13)
    f.side(P, Q, "20 m", g); f.side(Q, R, "x", g, italic=True)
    for v, n in ((P, "P"), (Q, "Q"), (R, "R")):
        f.vname(v, n, g)
    return f.render(240, 175)


def q12():  # area 9, 12, 58
    A = (0, 0); B = (12, 0); C = (9 * cos(rad(58)), 9 * sin(rad(58)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.angle(A, B, C, "58°", r=20, loff=13)
    f.side(A, B, "12 cm", g); f.side(A, C, "9 cm", g)
    return f.render(240, 160)


def q14():  # cosine 8, 11, 52
    A = (0, 0); B = (11, 0); C = (8 * cos(rad(52)), 8 * sin(rad(52)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.angle(A, B, C, "52°", r=20, loff=13)
    f.side(A, B, "11 m", g); f.side(A, C, "8 m", g); f.side(B, C, "x", g, italic=True)
    return f.render(240, 160)


def q19():  # paddock offsets 24,31,18, 20 m apart
    pts = [(0, 24), (20, 31), (40, 18)]
    curve = smooth(pts)
    f = Fig(pad=22)
    f.poly([(0, 0)] + curve + [(40, 0)], fill="#eef3f9")
    for x, y in pts:
        f.line((x, 0), (x, y), dash=True, w=1)
        f.text((x, y / 2), f"{y} m", dx=4, anchor="start", size=11.5)
    f.text((10, 0), "20 m", dy=14, size=11.5); f.text((30, 0), "20 m", dy=14, size=11.5)
    return f.render(250, 150)


def q20():  # two triangles: A-D-C, B above D
    BD = 12 * sin(rad(35)); AD = 12 * cos(rad(35)); DC = BD / tan(rad(62))
    A = (0, 0); D_ = (AD, 0); C = (AD + DC, 0); B = (AD, BD)
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none"); f.line(B, D_)
    f.right(D_, A, B); f.angle(A, D_, B, "35°", r=22, loff=13); f.angle(C, B, D_, "62°", r=13, loff=12)
    f.side(A, B, "12 m", g)
    for v, n in ((A, "A"), (B, "B"), (C, "C")):
        f.vname(v, n, g)
    f.text(D_, "D", dy=16, italic=True)
    return f.render(250, 160)


def q22():  # x opp 40, 18 opp 75
    A, B, C = law_sines_tri(40, 75, 18 * sin(rad(65)) / sin(rad(75)))
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none")
    f.angle(A, B, C, "40°", r=20, loff=13); f.angle(B, C, A, "75°", r=17, loff=13)
    f.side(A, C, "18 cm", g); f.side(B, C, "x", g, italic=True)
    return f.render(230, 170)


def q26():  # sides 7,9,12 theta opposite 12
    a, b, c = 7, 9, 12
    C_ang = D(acos((a * a + b * b - c * c) / (2 * a * b)))
    Cp = (0, 0); A = (b, 0); B = (a * cos(rad(C_ang)), a * sin(rad(C_ang)))
    f = Fig(); g = centroid(A, B, Cp)
    f.poly([A, B, Cp], fill="none"); f.angle(Cp, A, B, "θ", r=14, italic=True, loff=9)
    f.side(Cp, A, "9", g); f.side(Cp, B, "7", g); f.side(A, B, "12", g)
    return f.render(240, 150)


def q30():  # radial survey A 035 48, B 125 36, C 250 40
    O = (0, 0); A = pol(48, 35); B = pol(36, 125); C = pol(40, 250)
    f = Fig(pad=18)
    f.poly([A, B, C], fill="#eef3f9")
    for P_, n, d in ((A, "A", "48 m"), (B, "B", "36 m"), (C, "C", "40 m")):
        f.line(O, P_, dash=True, w=1)
        away = {"A": (-12, 40), "B": (0, -30), "C": (-20, 6)}[n]
        f.side(O, P_, d, away, size=11)
    for P_, n in ((A, "A"), (B, "B"), (C, "C")):
        f.vname(P_, n, O)
    f.arrow(O, (0, 30)); f.text((0, 30), "N", dy=-5, size=11)
    f.dot(O); f.text(O, "O", dx=4, dy=16, italic=True)
    return f.render(230, 210)


def q34():  # obtuse C: AB=15, BC=9, A=32
    C_ang = 180 - D(asin(15 * sin(rad(32)) / 9)); B_ang = 180 - 32 - C_ang
    b = 9 * sin(rad(B_ang)) / sin(rad(32))
    A = (0, 0); Cp = (b, 0); B = (15 * cos(rad(32)), 15 * sin(rad(32)))
    f = Fig(); g = centroid(A, B, Cp)
    f.poly([A, B, Cp], fill="none"); f.angle(A, Cp, B, "32°", r=24, loff=13)
    f.side(A, B, "15 cm", g); f.side(B, Cp, "9 cm", g)
    for v, n in ((A, "A"), (B, "B"), (Cp, "C")):
        f.vname(v, n, g)
    return f.render(250, 150)


def q35():  # distance-time graph
    W, H = 312, 210
    x0, y0, x1, y1 = 40, 180, 285, 18
    sx = (x1 - x0) / 2.0; sy = (y0 - y1) / 15.0
    X = lambda t: x0 + t * sx
    Y = lambda d: y0 - d * sy
    o = []
    for i in range(0, 9):
        t = i * 0.25
        o.append(f'<line x1="{X(t):.1f}" y1="{Y(0):.1f}" x2="{X(t):.1f}" y2="{Y(15):.1f}" stroke="#d6dde6" stroke-width="{1 if i%2==0 else 0.6}"/>')
    for i in range(0, 16):
        o.append(f'<line x1="{X(0):.1f}" y1="{Y(i):.1f}" x2="{X(2):.1f}" y2="{Y(i):.1f}" stroke="#d6dde6" stroke-width="{1 if i%5==0 else 0.5}"/>')
    o.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(2)+6}" y2="{Y(0)}" stroke="#222" stroke-width="1.2"/>')
    o.append(f'<line x1="{X(0)}" y1="{Y(0)}" x2="{X(0)}" y2="{Y(15)-8}" stroke="#222" stroke-width="1.2"/>')
    for t in (0.5, 1, 1.5, 2):
        o.append(f'<text x="{X(t):.1f}" y="{Y(0)+15:.1f}" text-anchor="middle" font-size="11" font-family="{FONT}">{t:g}</text>')
    for d_ in (5, 10, 15):
        o.append(f'<text x="{X(0)-6:.1f}" y="{Y(d_)+4:.1f}" text-anchor="end" font-size="11" font-family="{FONT}">{d_}</text>')
    o.append(f'<text x="{X(0)-6:.1f}" y="{Y(0)+4:.1f}" text-anchor="end" font-size="11" font-family="{FONT}">0</text>')
    o.append(f'<text x="{X(2)+12:.1f}" y="{Y(0)+4:.1f}" text-anchor="start" font-size="10.5" font-family="{FONT}" font-style="italic">t</text><text x="{X(2)+12:.1f}" y="{Y(0)+15:.1f}" text-anchor="start" font-size="9.5" font-family="{FONT}">(h)</text>')
    o.append(f'<text x="{X(0)-4:.1f}" y="{Y(15)-10:.1f}" text-anchor="middle" font-size="10.5" font-family="{FONT}">km</text>')
    o.append(f'<polyline points="{X(0)},{Y(0)} {X(2)},{Y(10)}" stroke="#3f7cc0" stroke-width="2" fill="none"/>')
    o.append(f'<polyline points="{X(0)},{Y(0)} {X(0.5)},{Y(0)} {X(1.5)},{Y(15)} {X(2)},{Y(15)}" stroke="#7b1f4b" stroke-width="2" fill="none"/>')
    o.append(f'<text x="{X(1.68):.1f}" y="{Y(7.0):.1f}" font-size="11.5" font-family="{FONT}" fill="#3f7cc0">Sam</text>')
    o.append(f'<text x="{X(1.06):.1f}" y="{Y(10.6):.1f}" text-anchor="end" font-size="11.5" font-family="{FONT}" fill="#7b1f4b">Kim</text>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(o)}</svg>'


def q40():  # tower: A, B 30 m apart, 26 and 41
    h = 30 / (1 / tan(rad(26)) - 1 / tan(rad(41)))
    F = (0, 0); T = (0, h); B = (-h / tan(rad(41)), 0); A = (-h / tan(rad(26)), 0)
    f = Fig(); g = centroid(A, T, F)
    f.line(A, (6, 0)); f.line(F, T, w=2.4); f.line(A, T); f.line(B, T)
    f.right(F, A, T); f.angle(A, F, T, "26°", r=26, loff=14); f.angle(B, F, T, "41°", r=18, loff=13)
    f.side(A, B, "30 m", (A[0], 10), off=12)
    f.text(A, "A", dy=16, italic=True); f.text(B, "B", dy=16, italic=True); f.text(T, "T", dy=-6, italic=True)
    f.text((0, h / 2), "h", dx=8, anchor="start", italic=True)
    return f.render(270, 140)


def q45():  # aerial photo offsets 3.2 4.6 3.8 cm, 2.4 apart
    pts = [(0, 3.2), (2.4, 4.6), (4.8, 3.8)]
    curve = smooth(pts)
    f = Fig(pad=22)
    f.poly([(0, 0)] + curve + [(4.8, 0)], fill="#eef3f9")
    for x, y in pts:
        f.line((x, 0), (x, y), dash=True, w=1)
        f.text((x, y / 2), f"{y} cm", dx=4, anchor="start", size=11.5)
    f.text((1.2, 0), "2.4 cm", dy=14, size=11.5); f.text((3.6, 0), "2.4 cm", dy=14, size=11.5)
    return f.render(250, 150)


def q46():  # acute theta: 14 opp 70, 10 opp theta
    th = D(asin(10 * sin(rad(70)) / 14)); third = 180 - 70 - th
    c = 14 * sin(rad(third)) / sin(rad(70))
    A, B, C = law_sines_tri(70, th, c)  # angle A=70 at A, theta at B
    f = Fig(); g = centroid(A, B, C)
    f.poly([A, B, C], fill="none")
    f.angle(A, B, C, "70°", r=17, loff=13); f.angle(B, C, A, "θ", r=20, italic=True, loff=10)
    f.side(B, C, "14", g); f.side(A, C, "10", g)
    return f.render(220, 175)


def q60():  # lifeguard towers
    A, B, S = law_sines_tri(58, 66, 350)
    f = Fig(pad=22); g = centroid(A, B, S)
    f.poly([(-40, -40), (390, -40), (390, 0), (-40, 0)], fill="#f5f3eb", stroke="none", w=0)
    f.line((-40, 0), (390, 0), w=1.2)
    f.line(A, S); f.line(B, S); f.line(A, B, w=1.8)
    f.angle(A, B, S, "58°", r=20, loff=13); f.angle(B, S, A, "66°", r=20, loff=13)
    f.side(A, B, "350 m", g, off=12)
    f.dot(S, r=3, col="#3f7cc0"); f.text(S, "swimmer S", dy=-9)
    f.text(A, "A", dy=18, italic=True); f.text(B, "B", dy=18, italic=True)
    return f.render(260, 190)


def q70():  # quadrilateral ABCD
    AB, BC, Bang = 85, 60, 110
    AC = sqrt(AB ** 2 + BC ** 2 - 2 * AB * BC * cos(rad(Bang)))
    BAC = D(asin(BC * sin(rad(Bang)) / AC))
    AD = AC * sin(rad(72)) / sin(rad(68))
    A = (0, 0); C = (AC, 0)
    B = (AB * cos(rad(-BAC)), AB * sin(rad(-BAC)))
    D_ = (AD * cos(rad(40)), AD * sin(rad(40)))
    f = Fig(); g = centroid(A, B, C, D_)
    f.poly([A, B, C, D_], fill="#eef3f9"); f.line(A, C, w=1.1)
    f.angle(B, C, A, "110°", r=16, loff=14)
    f.angle(A, C, D_, "40°", r=26, loff=13); f.angle(C, D_, A, "72°", r=18, loff=13)
    f.side(A, B, "85 m", g); f.side(B, C, "60 m", g)
    for v, n in ((A, "A"), (B, "B"), (C, "C"), (D_, "D")):
        f.vname(v, n, g)
    return f.render(250, 220)


def q73():  # creek cross-section
    xs = [0, 4, 8, 12, 16]; ds = [0, 1.2, 2.0, 1.5, 0]
    k = 2.6  # vertical exaggeration (diagram is not to scale)
    pts = [(x, -d * k) for x, d in zip(xs, ds)]
    curve = smooth(pts)
    f = Fig(pad=22)
    f.poly([(0, 0)] + curve + [(16, 0)], fill="#dce8f5")
    f.line((-1, 0), (17, 0), w=1.4)
    for (x, y), d in zip(pts, ds):
        if 0 < x < 16:
            f.line((x, 0), (x, y), dash=True, w=1)
            f.text((x, y * 0.3), f"{d} m", dx=3, anchor="start", size=11)
    for i in range(4):
        f.text((xs[i] + 2, 0), "4 m", dy=-6, size=10.5)
    f.text((8, 0), "water surface", dy=-19, size=10, col="#555")
    return f.render(270, 130)
