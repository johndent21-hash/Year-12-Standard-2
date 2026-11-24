"""Small SVG figure builder: geometry is given in real units, then auto-scaled."""
from math import *

FONT = "'TeX Gyre Pagella', 'Palatino Linotype', serif"


def rad(a):
    return radians(a)


def pol(r, bearing):
    """Point at distance r on a true bearing (x east, y north)."""
    return (r * sin(rad(bearing)), r * cos(rad(bearing)))


def add(p, q):
    return (p[0] + q[0], p[1] + q[1])


def sub(p, q):
    return (p[0] - q[0], p[1] - q[1])


def mul(p, k):
    return (p[0] * k, p[1] * k)


def norm(p):
    l = hypot(*p)
    return (p[0] / l, p[1] / l)


class Fig:
    def __init__(self, pad=20):
        self.items = []
        self.pts = []
        self.pad = pad

    # all coordinates are in maths units (y up)
    def line(self, p, q, dash=False, w=1.3, col="#222"):
        self.items.append(("line", p, q, dash, w, col))
        self.pts += [p, q]

    def poly(self, pts, fill="#eef3f9", stroke="#222", w=1.3, close=True):
        self.items.append(("poly", list(pts), fill, stroke, w, close))
        self.pts += list(pts)

    def text(self, p, s, dx=0, dy=0, anchor="middle", size=12.5, italic=False, col="#222", font=None):
        self.items.append(("text", p, s, dx, dy, anchor, size, italic, col, font))
        self.pts.append(p)

    def dot(self, p, r=2.2, col="#222"):
        self.items.append(("dot", p, r, col))
        self.pts.append(p)

    def side(self, p, q, s, centroid, off=7, italic=False, size=12.5):
        m = mul(add(p, q), 0.5)
        d = sub(q, p)
        n = norm((-d[1], d[0]))
        if (n[0] * (m[0] - centroid[0]) + n[1] * (m[1] - centroid[1])) < 0:
            n = (-n[0], -n[1])
        self.items.append(("sidetext", m, s, n, off, size, italic))
        self.pts.append(m)

    def angle(self, v, p1, p2, label="", r=17, italic=False, loff=12):
        self.items.append(("arc", v, p1, p2, label, r, italic, loff))
        self.pts.append(v)

    def right(self, v, p1, p2, s=8):
        self.items.append(("right", v, p1, p2, s))

    def vname(self, v, s, centroid, off=11):
        d = norm(sub(v, centroid))
        self.items.append(("text", v, s, d[0] * off, -d[1] * off + 4, "middle", 12.5, True, "#222", None))

    def arrow(self, p, q, w=1.1, col="#222"):
        self.items.append(("arrow", p, q, w, col))
        self.pts += [p, q]

    def render(self, W, H, nts=True):
        xs = [p[0] for p in self.pts]
        ys = [p[1] for p in self.pts]
        minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
        pad = self.pad
        top = pad + (8 if nts else 0)
        s = min((W - 2 * pad) / max(maxx - minx, 1e-9), (H - pad - top) / max(maxy - miny, 1e-9))
        w_used = (maxx - minx) * s + 2 * pad
        h_used = (maxy - miny) * s + pad + top

        def T(p):
            return (pad + (p[0] - minx) * s, top + (maxy - p[1]) * s)

        out = []
        tb = []  # text pixel boxes

        def tw(txt, size):
            import re
            plain = re.sub(r"<[^>]+>", "", txt)
            return 0.5 * size * len(plain)

        for it in self.items:
            k = it[0]
            if k == "line":
                _, p, q, dash, w, col = it
                a, b = T(p), T(q)
                da = ' stroke-dasharray="4 3"' if dash else ""
                out.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{col}" stroke-width="{w}"{da} stroke-linecap="round"/>')
            elif k == "poly":
                _, pts, fill, stroke, w, close = it
                d = " ".join(f"{T(p)[0]:.1f},{T(p)[1]:.1f}" for p in pts)
                tag = "polygon" if close else "polyline"
                out.append(f'<{tag} points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linejoin="round"/>')
            elif k == "sidetext":
                _, p, txt, n, off, size, italic = it
                a = T(p)
                w = tw(txt, size)
                # push the label clear of the line, allowing for its width and height
                dist = off + abs(n[0]) * w / 2 + abs(n[1]) * size * 0.42
                cx, cy = a[0] + n[0] * dist, a[1] - n[1] * dist
                st = ' font-style="italic"' if italic else ""
                out.append(f'<text x="{cx:.1f}" y="{cy + size*0.35:.1f}" text-anchor="middle" font-size="{size}" font-family="{FONT}" fill="#222"{st}>{txt}</text>')
                tb.append((cx - w / 2, cy - size / 2, cx + w / 2, cy + size / 2))
            elif k == "text":
                _, p, txt, dx, dy, anchor, size, italic, col, font = it
                a = T(p)
                w = tw(txt, size)
                x0 = a[0] + dx - (w / 2 if anchor == "middle" else (w if anchor == "end" else 0))
                tb.append((x0, a[1] + dy - size * 0.8, x0 + w, a[1] + dy + size * 0.2))
                st = ' font-style="italic"' if italic else ""
                ff = font or FONT
                out.append(f'<text x="{a[0]+dx:.1f}" y="{a[1]+dy:.1f}" text-anchor="{anchor}" font-size="{size}" font-family="{ff}" fill="{col}"{st}>{txt}</text>')
            elif k == "dot":
                _, p, r, col = it
                a = T(p)
                out.append(f'<circle cx="{a[0]:.1f}" cy="{a[1]:.1f}" r="{r}" fill="{col}"/>')
            elif k == "arc":
                _, v, p1, p2, label, r, italic, loff = it
                V, P1, P2 = T(v), T(p1), T(p2)
                u1 = norm(sub(P1, V))
                u2 = norm(sub(P2, V))
                a = add(V, mul(u1, r))
                b = add(V, mul(u2, r))
                cross = u1[0] * u2[1] - u1[1] * u2[0]
                sweep = 1 if cross > 0 else 0
                out.append(f'<path d="M{a[0]:.1f},{a[1]:.1f} A{r},{r} 0 0 {sweep} {b[0]:.1f},{b[1]:.1f}" fill="none" stroke="#222" stroke-width="1"/>')
                if label:
                    bis = norm(add(u1, u2))
                    L = add(V, mul(bis, r + loff))
                    st = ' font-style="italic"' if italic else ""
                    out.append(f'<text x="{L[0]:.1f}" y="{L[1]+4:.1f}" text-anchor="middle" font-size="11.5" font-family="{FONT}" fill="#222"{st}>{label}</text>')
            elif k == "right":
                _, v, p1, p2, sz = it
                V, P1, P2 = T(v), T(p1), T(p2)
                u1 = norm(sub(P1, V))
                u2 = norm(sub(P2, V))
                a = add(V, mul(u1, sz))
                c = add(V, mul(u2, sz))
                b = add(a, mul(u2, sz))
                out.append(f'<polyline points="{a[0]:.1f},{a[1]:.1f} {b[0]:.1f},{b[1]:.1f} {c[0]:.1f},{c[1]:.1f}" fill="none" stroke="#222" stroke-width="1"/>')
            elif k == "arrow":
                _, p, q, w, col = it
                a, b = T(p), T(q)
                u = norm(sub(b, a))
                n = (-u[1], u[0])
                h1 = add(sub(b, mul(u, 7)), mul(n, 3.2))
                h2 = add(sub(b, mul(u, 7)), mul(n, -3.2))
                out.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{col}" stroke-width="{w}"/>')
                out.append(f'<polygon points="{b[0]:.1f},{b[1]:.1f} {h1[0]:.1f},{h1[1]:.1f} {h2[0]:.1f},{h2[1]:.1f}" fill="{col}"/>')
        # expand canvas so every label fits
        X0 = min([0] + [b[0] - 3 for b in tb]); Y0 = min([0] + [b[1] - 3 for b in tb])
        X1 = max([w_used] + [b[2] + 3 for b in tb]); Y1 = max([h_used] + [b[3] + 3 for b in tb])
        out = [f'<g transform="translate({-X0:.1f},{-Y0:.1f})">'] + out + ["</g>"]
        w_used, h_used = X1 - X0, Y1 - Y0
        nt = ""
        if nts:
            nt = f'<text x="{w_used-4:.1f}" y="9" text-anchor="end" font-size="6.5" letter-spacing="0.4" font-family="Poppins" fill="#9a9a9a">NOT TO SCALE</text>'
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w_used:.0f}" height="{h_used:.0f}" '
                f'viewBox="0 0 {w_used:.1f} {h_used:.1f}">{nt}{"".join(out)}</svg>')


def centroid(*pts):
    return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))


def smooth(pts, n=12):
    """Catmull-Rom through pts -> dense list."""
    out = []
    P = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    out.append(pts[-1])
    return out
