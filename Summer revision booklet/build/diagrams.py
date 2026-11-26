"""SVG diagram helpers, styled to match the original booklet diagrams.
All coordinates are in pt (1 SVG unit = 1 pt)."""
import math

INK = '#222222'
LINE = '#333333'
FONT = "font-family:'TeX Gyre Pagella','Liberation Serif',serif"


def _svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}pt" height="{h}pt" '
            f'viewBox="0 0 {w} {h}" style="overflow:visible">{body}</svg>')


def _txt(x, y, s, size=9, italic=False, bold=False, anchor='middle', color=INK, bg=False):
    st = f"{FONT};font-size:{size}px;fill:{color}"
    if italic:
        st += ';font-style:italic'
    if bold:
        st += ';font-weight:700'
    out = ''
    if bg:
        wdt = 5.2 * len(str(s)) + 4
        out += f'<rect x="{x - wdt / 2:.1f}" y="{y - size * 0.62:.1f}" width="{wdt:.1f}" height="{size * 1.2:.1f}" fill="#fff"/>'
    out += f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" dominant-baseline="central" style="{st}">{s}</text>'
    return out


def network(w, h, nodes, edges, directed=True, r=8.25):
    """nodes: {name: (x, y)}; edges: (u, v, weight[, (dx, dy) label offset, t])."""
    body = ''
    for e in edges:
        u, v, wt = e[0], e[1], e[2]
        off = e[3] if len(e) > 3 and e[3] is not None else (0, 0)
        t = e[4] if len(e) > 4 else 0.5
        (x1, y1), (x2, y2) = nodes[u], nodes[v]
        d = math.hypot(x2 - x1, y2 - y1)
        ux, uy = (x2 - x1) / d, (y2 - y1) / d
        sx, sy = x1 + ux * r, y1 + uy * r
        ex, ey = x2 - ux * r, y2 - uy * r
        if directed:
            ah = 6.5
            lx, ly = ex - ux * ah, ey - uy * ah
            body += f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{lx:.1f}" y2="{ly:.1f}" stroke="{LINE}" stroke-width="0.975"/>'
            px, py = -uy, ux
            body += (f'<polygon points="{ex:.1f},{ey:.1f} {lx + px * 3.1:.1f},{ly + py * 3.1:.1f} '
                     f'{lx - px * 3.1:.1f},{ly - py * 3.1:.1f}" fill="{LINE}"/>')
        else:
            body += f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{LINE}" stroke-width="0.975"/>'
        if wt is not None and wt != '':
            mx, my = x1 + (x2 - x1) * t + off[0], y1 + (y2 - y1) * t + off[1]
            body += _txt(mx, my, wt, size=8.6, bold=True, bg=True)
    for n, (x, y) in nodes.items():
        body += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{LINE}" stroke-width="1.05"/>'
        body += _txt(x, y + 0.3, n, size=9, italic=True)
    return _svg(w, h, body)


def right_triangle(w, h, pts, right_at, labels=(), angles=()):
    """pts: dict of 3 named points; right_at: name of right-angle vertex;
    labels: (x, y, text, italic) ; angles: (vertex, text, radius, label_dx, label_dy)."""
    names = list(pts)
    body = '<polygon points="' + ' '.join(f'{pts[n][0]},{pts[n][1]}' for n in names) + \
        f'" fill="none" stroke="{INK}" stroke-width="0.975"/>'
    # right-angle box
    if right_at:
        cx, cy = pts[right_at]
        o = [pts[n] for n in names if n != right_at]
        v = []
        for (x, y) in o:
            d = math.hypot(x - cx, y - cy)
            v.append(((x - cx) / d * 6, (y - cy) / d * 6))
        p1 = (cx + v[0][0], cy + v[0][1]); p2 = (cx + v[1][0], cy + v[1][1])
        p3 = (cx + v[0][0] + v[1][0], cy + v[0][1] + v[1][1])
        body += f'<polyline points="{p1[0]:.1f},{p1[1]:.1f} {p3[0]:.1f},{p3[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}" fill="none" stroke="{INK}" stroke-width="0.75"/>'
    body += _angles(pts, angles)
    for lab in labels:
        x, y, s = lab[0], lab[1], lab[2]
        it = lab[3] if len(lab) > 3 else False
        body += _txt(x, y, s, size=9.4, italic=it)
    return _svg(w, h, body)


def _angles(pts, angles):
    body = ''
    for a in angles:
        vtx, text, rad = a[0], a[1], a[2]
        cx, cy = pts[vtx]
        others = [p for n, p in pts.items() if n != vtx]
        angs = [math.atan2(y - cy, x - cx) for (x, y) in others]
        a1, a2 = angs
        # draw the smaller arc between the two rays
        diff = (a2 - a1) % (2 * math.pi)
        if diff > math.pi:
            a1, a2 = a2, a1
            diff = 2 * math.pi - diff
        x1, y1 = cx + rad * math.cos(a1), cy + rad * math.sin(a1)
        x2, y2 = cx + rad * math.cos(a2), cy + rad * math.sin(a2)
        body += f'<path d="M{x1:.1f},{y1:.1f} A{rad},{rad} 0 0 1 {x2:.1f},{y2:.1f}" fill="none" stroke="{INK}" stroke-width="0.75"/>'
        mid = a1 + diff / 2
        lr = rad + (a[3] if len(a) > 3 else 9)
        it = text in ('θ', 'α')
        body += _txt(cx + lr * math.cos(mid), cy + lr * math.sin(mid), text, size=8.6, italic=it)
    return body


def triangle(w, h, pts, labels=(), angles=()):
    body = '<polygon points="' + ' '.join(f'{p[0]},{p[1]}' for p in pts.values()) + \
        f'" fill="none" stroke="{INK}" stroke-width="0.975"/>'
    body += _angles(pts, angles)
    for lab in labels:
        it = lab[3] if len(lab) > 3 else False
        body += _txt(lab[0], lab[1], lab[2], size=9.4, italic=it)
    return _svg(w, h, body)


def axis_scale(x0, x1, y, lo, hi, step, label_every=1, unit=''):
    """horizontal number line with ticks; returns (svg, f) where f maps value->x."""
    f = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    s = f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{INK}" stroke-width="0.75"/>'
    k = 0
    v = lo
    while v <= hi + 1e-9:
        x = f(v)
        s += f'<line x1="{x:.1f}" y1="{y}" x2="{x:.1f}" y2="{y + 3.5}" stroke="{INK}" stroke-width="0.6"/>'
        if k % label_every == 0:
            lab = f'{v:g}'
            s += _txt(x, y + 10, lab, size=7.6)
        v += step
        k += 1
    if unit:
        s += _txt((x0 + x1) / 2, y + 21, unit, size=7.6)
    return s, f


def boxplots(w, h, rows, lo, hi, step, label_every=1, unit='', label_w=0):
    """rows: [(label, (mn, q1, med, q3, mx))]"""
    x0, x1 = 8 + label_w, w - 8
    n = len(rows)
    ax_y = h - 26 if unit else h - 16
    body, f = axis_scale(x0, x1, ax_y, lo, hi, step, label_every, unit)
    gap = (ax_y - 6) / n
    for i, (lab, (mn, q1, md, q3, mx)) in enumerate(rows):
        cy = 6 + gap * (i + 0.5)
        bh = min(18, gap * 0.55)
        body += f'<line x1="{f(mn):.1f}" y1="{cy}" x2="{f(q1):.1f}" y2="{cy}" stroke="{INK}" stroke-width="0.9"/>'
        body += f'<line x1="{f(q3):.1f}" y1="{cy}" x2="{f(mx):.1f}" y2="{cy}" stroke="{INK}" stroke-width="0.9"/>'
        for v in (mn, mx):
            body += f'<line x1="{f(v):.1f}" y1="{cy - bh / 3}" x2="{f(v):.1f}" y2="{cy + bh / 3}" stroke="{INK}" stroke-width="0.9"/>'
        body += f'<rect x="{f(q1):.1f}" y="{cy - bh / 2:.1f}" width="{f(q3) - f(q1):.1f}" height="{bh:.1f}" fill="#fff" stroke="{INK}" stroke-width="0.9"/>'
        body += f'<line x1="{f(md):.1f}" y1="{cy - bh / 2:.1f}" x2="{f(md):.1f}" y2="{cy + bh / 2:.1f}" stroke="{INK}" stroke-width="1.2"/>'
        if lab:
            body += _txt(4, cy, lab, size=8, anchor='start')
    return _svg(w, h, body)


def dotplot(w, h, counts, lo, hi, unit=''):
    x0, x1 = 12, w - 12
    ax_y = h - 26 if unit else h - 16
    body, f = axis_scale(x0, x1, ax_y, lo, hi, 1, 1, unit)
    for v, c in counts.items():
        for k in range(c):
            body += f'<circle cx="{f(v):.1f}" cy="{ax_y - 6 - k * 8.5:.1f}" r="3.2" fill="{LINE}"/>'
    return _svg(w, h, body)


def graph(w, h, xr, yr, xstep, ystep, lines=(), points=(), xlabel='', ylabel='', xlab_every=1, ylab_every=1,
          grid=True, origin_axes=False):
    """xr=(xmin,xmax), yr=(ymin,ymax). lines: list of [(x,y),...] polylines."""
    L, R, T, B = 30, 10, 8, 26
    X = lambda v: L + (v - xr[0]) / (xr[1] - xr[0]) * (w - L - R)
    Y = lambda v: h - B - (v - yr[0]) / (yr[1] - yr[0]) * (h - T - B)
    body = ''
    if grid:
        v = xr[0]
        while v <= xr[1] + 1e-9:
            body += f'<line x1="{X(v):.1f}" y1="{Y(yr[0]):.1f}" x2="{X(v):.1f}" y2="{Y(yr[1]):.1f}" stroke="#d9dde3" stroke-width="0.5"/>'
            v += xstep
        v = yr[0]
        while v <= yr[1] + 1e-9:
            body += f'<line x1="{X(xr[0]):.1f}" y1="{Y(v):.1f}" x2="{X(xr[1]):.1f}" y2="{Y(v):.1f}" stroke="#d9dde3" stroke-width="0.5"/>'
            v += ystep
    ax_x = 0 if origin_axes else xr[0]
    ax_y = 0 if origin_axes else yr[0]
    body += f'<line x1="{X(xr[0]):.1f}" y1="{Y(ax_y):.1f}" x2="{X(xr[1]):.1f}" y2="{Y(ax_y):.1f}" stroke="{INK}" stroke-width="0.8"/>'
    body += f'<line x1="{X(ax_x):.1f}" y1="{Y(yr[0]):.1f}" x2="{X(ax_x):.1f}" y2="{Y(yr[1]):.1f}" stroke="{INK}" stroke-width="0.8"/>'
    k = 0
    v = xr[0]
    while v <= xr[1] + 1e-9:
        if k % xlab_every == 0 and not (origin_axes and abs(v) < 1e-9):
            body += _txt(X(v), Y(ax_y) + 8, f'{v:g}', size=7.4)
        v += xstep; k += 1
    k = 0
    v = yr[0]
    while v <= yr[1] + 1e-9:
        if k % ylab_every == 0 and not (origin_axes and abs(v) < 1e-9):
            body += _txt(X(ax_x) - 4, Y(v), f'{v:g}', size=7.4, anchor='end')
        v += ystep; k += 1
    if origin_axes:
        body += _txt(X(0) - 5, Y(0) + 7, 'O', size=7.4, anchor='end')
    for pl in lines:
        body += '<polyline points="' + ' '.join(f'{X(x):.1f},{Y(y):.1f}' for x, y in pl) + \
            f'" fill="none" stroke="{INK}" stroke-width="1.4"/>'
    for (x, y) in points:
        body += f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="2.2" fill="{INK}"/>'
    if xlabel:
        body += _txt((X(xr[0]) + X(xr[1])) / 2, h - 5, xlabel, size=7.6)
    if ylabel:
        body += f'<text x="9" y="{(Y(yr[0]) + Y(yr[1])) / 2:.1f}" transform="rotate(-90 9 {(Y(yr[0]) + Y(yr[1])) / 2:.1f})" text-anchor="middle" dominant-baseline="central" style="{FONT};font-size:7.6px;fill:{INK}">{ylabel}</text>'
    return _svg(w, h, body)


def pool_deck(w=170, h=86):
    # 10 m x 6 m rectangle with a semicircle (diameter 6 m) on the right-hand 6 m end
    x0, y0, rw, rh = 22, 12, 100, 60
    r = rh / 2
    body = (f'<path d="M{x0},{y0} H{x0 + rw} A{r},{r} 0 0 1 {x0 + rw},{y0 + rh} H{x0} Z" '
            f'fill="none" stroke="{INK}" stroke-width="0.975"/>')
    body += f'<line x1="{x0 + rw}" y1="{y0}" x2="{x0 + rw}" y2="{y0 + rh}" stroke="{INK}" stroke-width="0.6" stroke-dasharray="3,2"/>'
    body += _txt(x0 - 10, y0 + rh / 2, '6 m', size=9.4)
    body += _txt(x0 + rw / 2, y0 + rh + 9, '10 m', size=9.4)
    return _svg(w, h, body)


def not_to_scale():
    return '<div class="nts">NOT TO SCALE</div>'
