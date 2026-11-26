# -*- coding: utf-8 -*-
"""Rebuild the summer booklets: keep every original page design, replace the question
areas, add Year 11 help sheets and a new answer key.
usage: python3 build.py boys|girls"""
import sys, re, json, os, html
import pymupdf
from playwright.sync_api import sync_playwright
from content import Q
from helpsheets import SHEETS

HERE = os.path.dirname(os.path.abspath(__file__))
SCR = os.path.dirname(HERE)
FONTS = os.path.join(SCR, 'fonts')
VER = sys.argv[1]
SRC = os.path.join(SCR, 'src', f'{VER}.pdf')
OUT = os.path.join(SCR, 'out')
os.makedirs(OUT, exist_ok=True)
PW, PH = 594.96, 841.92

T = dict(
    boys=dict(text='#1b1f26', dot='#ff7b29', sep='#e3e6ea', sess_off=4,
              qn="font-family:Bebas;font-size:19pt;color:#ff7b29;line-height:22pt",
              hsc_l="font-family:Poppins;font-weight:600;font-size:7.6pt;color:#13315c;letter-spacing:0.6pt;text-transform:uppercase",
              hsc_r="font-family:Poppins;font-weight:300;font-size:7.6pt;color:#666;letter-spacing:0.5pt;text-transform:uppercase",
              hsc_text='HSC-style question',
              hdr_marks=dict(css="font-family:Poppins;font-weight:300;font-size:7.6pt;color:#aab4c2"),
              day='#e2621b', boxhead='#0b2240', boxhead_font='font-weight:500', boxborder='#d6dbe2', tag='#aab4c2',
              letter="font-family:Bebas;font-size:16pt;color:#ffd166",
              title="font-family:Bebas;font-size:21pt;color:#ffffff;letter-spacing:0.3pt",
              sub="font-family:Poppins;font-weight:300;font-size:7.6pt;color:#aab4c2",
              pnum="font-family:Bebas;font-size:10.99pt;color:#ffd166",
              help_tpl=36, ans_tpl=(40, 41), maxlevel=34, first_help=35),
    girls=dict(text='#3a2a40', dot='#b48ae0', sep='#f6dbe7', sess_off=3,
               qn="font-family:Poppins;font-weight:500;font-size:12.49pt;color:#c2477a;line-height:17.5pt",
               hsc_l="font-family:Poppins;font-weight:400;font-size:8.4pt;color:#7a4fa3",
               hsc_r="font-family:Poppins;font-weight:300;font-size:8.4pt;color:#666",
               hsc_text='HSC-style question',
               hdr_marks=dict(css="font-family:Poppins;font-weight:300;font-size:7.6pt;color:#6b4a80"),
               day='#c2477a', boxhead='#d98ab6', boxhead_font='font-weight:400', boxborder='#f1c9dc', tag='#ffffff',
               letter="font-family:Poppins;font-weight:500;font-size:16pt;color:#c2477a",
               title="font-family:Poppins;font-weight:400;font-size:14.5pt;color:#4a2d5c",
               sub="font-family:Poppins;font-weight:300;font-size:7.6pt;color:#6b4a80",
               pnum="font-family:Poppins;font-weight:500;font-size:7.99pt;color:#ffffff",
               help_tpl=35, ans_tpl=(39, 40), maxlevel=33, first_help=34),
)[VER]

src = pymupdf.open(SRC)

def spans(page):
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                if s['text'].strip():
                    yield s

def esc(s):
    return html.escape(s, quote=False)

# ------------------------------------------------------------------ analyse session pages
sessions = []
for k in range(30):
    pno = k + T['sess_off']
    pg = src[pno]
    drs = pg.get_drawings()
    note_bottom = max(d['rect'].y1 for d in drs if 125 < d['rect'].y0 < 140 and d['rect'].width > 400)
    imgs = [(x[0], pg.get_image_rects(x[0])[0]) for x in pg.get_images(full=True)]
    art_xref, art = [(x, r) for x, r in imgs if r.y0 > 300][0]
    foot_top = min([d['rect'].y0 for d in drs if d['rect'].y0 > art.y0 and d['rect'].width > 300] + [800])
    hdr = [s for s in spans(pg) if re.search(r'Questions \d+–\d+', s['text'])][0]
    old_marks = int(re.search(r'(\d+) marks', hdr['text']).group(1))
    foot_marks = [s for s in spans(pg) if s['bbox'][1] > 760 and re.fullmatch(r'/ ?\d+', s['text'].strip())]
    foot_marks = [s for s in foot_marks if VER == 'girls']
    sessions.append(dict(k=k, pno=pno, note_bottom=note_bottom, art_xref=art_xref, art=art,
                         foot_top=foot_top, hdr=hdr, old_marks=old_marks, foot_marks=foot_marks))

# ------------------------------------------------------------------ HTML building blocks
def fontfaces():
    f = lambda n: 'file://' + os.path.join(FONTS, n)
    return f"""
@font-face{{font-family:Pagella;src:url('{f('tex-gyre-pagella-400.ttf')}');font-weight:400;font-style:normal}}
@font-face{{font-family:Pagella;src:url('{f('tex-gyre-pagella-700.ttf')}');font-weight:700;font-style:normal}}
@font-face{{font-family:Pagella;src:url('{f('tex-gyre-pagella-400italic.ttf')}');font-weight:400;font-style:italic}}
@font-face{{font-family:Pagella;src:url('{f('tex-gyre-pagella-700italic.ttf')}');font-weight:700;font-style:italic}}
@font-face{{font-family:'TeX Gyre Pagella';src:url('{f('tex-gyre-pagella-400.ttf')}');font-weight:400}}
@font-face{{font-family:'TeX Gyre Pagella';src:url('{f('tex-gyre-pagella-700.ttf')}');font-weight:700}}
@font-face{{font-family:'TeX Gyre Pagella';src:url('{f('tex-gyre-pagella-400italic.ttf')}');font-style:italic}}
@font-face{{font-family:Poppins;src:url('{f('poppins-latin-300-normal.woff2')}');font-weight:300}}
@font-face{{font-family:Poppins;src:url('{f('poppins-latin-400-normal.woff2')}');font-weight:400}}
@font-face{{font-family:Poppins;src:url('{f('poppins-latin-500-normal.woff2')}');font-weight:500}}
@font-face{{font-family:Poppins;src:url('{f('poppins-latin-600-normal.woff2')}');font-weight:600}}
@font-face{{font-family:Bebas;src:url('{f('bebas-neue-latin-400-normal.woff2')}')}}
"""

SERIF = "Pagella,'Liberation Serif',serif"

CSS = fontfaces() + f"""
@page {{ size: {PW}pt {PH}pt; margin: 0 }}
html, body {{ margin:0; padding:0; background:transparent }}
.page {{ position:relative; width:{PW}pt; height:{PH}pt; overflow:hidden; break-after:page }}
.abs {{ position:absolute; white-space:nowrap }}
.qarea {{ position:absolute; left:42.75pt; width:510pt; font-family:{SERIF}; color:{T['text']} }}
.q {{ padding:11pt 0 11.5pt; border-top:0.75pt solid {T['sep']} }}
.q:first-child {{ border-top:none; padding-top:0 }}
.hscrow {{ display:flex; justify-content:space-between; padding-left:25.25pt; margin-bottom:0.5pt; line-height:11pt }}
.hscrow .l {{ {T['hsc_l']} }} .hscrow .r {{ {T['hsc_r']} }}
.qrow {{ display:flex; align-items:baseline }}
.qn {{ width:36.65pt; flex:none; {T['qn']} }}
.qb {{ flex:1; min-width:0; font-size:12.19pt; line-height:17.3pt }}
.split {{ display:flex; align-items:flex-start; gap:14pt }}
.split .txt {{ flex:1; min-width:0 }}
.dg {{ flex:none; margin-top:2pt }}
.dg svg {{ display:block }}
.dg .tbl {{ margin-top:0 }}
.nts {{ font-family:Poppins; font-size:4.88pt; color:#9a9a9a; letter-spacing:0.6pt; text-align:right; line-height:7pt; margin-bottom:2pt }}
.pt {{ display:flex; margin-top:2.2pt }}
.pt .lab {{ width:22.6pt; flex:none }}
.pt .ptx {{ flex:1 }}
.pt .pm {{ flex:none; width:30pt; text-align:right; font-family:Poppins; font-weight:300; font-size:7.99pt; color:#777 }}
.stemgap {{ height:0 }}
.mk {{ font-family:Poppins; font-weight:300; font-size:7.99pt; color:#777; white-space:nowrap; margin-left:3.5pt }}
.dot {{ font-size:7.5pt; color:{T['dot']}; margin-left:3pt; white-space:nowrap; font-family:{SERIF} }}
.mkline {{ text-align:right; margin-top:3pt; line-height:11pt }}
.mc {{ display:flex; gap:24pt; margin-top:6pt; flex-wrap:wrap }}
.mc.grid {{ display:grid; grid-template-columns:repeat(4, 1fr); gap:10pt; font-size:11pt; line-height:14pt }}
.mc b {{ font-weight:700 }}
.data {{ letter-spacing:0.2pt }}
.fr {{ display:inline-flex; flex-direction:column; vertical-align:middle; text-align:center; line-height:1.18; margin:0 1.5pt }}
.fr > span:first-child {{ border-bottom:0.75pt solid currentColor; padding:0 2pt }}
.tbl {{ border-collapse:collapse; margin-top:8pt; font-size:10.5pt; line-height:14pt }}
.tbl th {{ font-family:Poppins; font-weight:500; font-size:7.99pt; text-align:center; padding:2pt 11pt 3pt; border-bottom:0.75pt solid #888; color:{T['text']} }}
.tbl td {{ text-align:center; padding:1.9pt 11pt 2.1pt; border-bottom:0.7pt solid #e2e2e2 }}
.tbl.wide td, .tbl.wide th {{ text-align:left; padding:1.6pt 9pt 1.8pt 4pt; font-size:9.6pt; line-height:12pt }}
.tbl.wide th {{ font-size:7.99pt }}
.tbl.grid td, .tbl.grid th {{ padding:1.4pt 7pt 1.6pt; min-width:16pt }}
.tbl.grid td:first-child {{ font-family:Poppins; font-weight:500; font-size:7.99pt }}
.tbl.stem td:first-child {{ border-right:0.75pt solid #888; padding-right:8pt }}
.tbl.stem td:last-child {{ text-align:left; letter-spacing:1.6pt }}
.key {{ font-size:9pt; color:#555; margin-top:3pt; font-style:italic }}
/* answers */
.ans {{ position:absolute; left:42.5pt; top:94pt; width:510pt; height:700pt; column-count:2; column-gap:18pt; column-fill:auto;
        font-family:{SERIF}; color:{T['text']}; font-size:10pt; line-height:14.3pt }}
.ans .day {{ font-family:Poppins; font-size:10.5pt; color:{T['day']}; margin-top:5pt; line-height:15pt; break-after:avoid }}
.ans .day small {{ font-weight:300; font-size:7.39pt; color:#777; margin-left:3pt }}
.ans .a {{ margin-top:4.4pt; break-inside:avoid }}
.ans .a b {{ margin-right:3pt }}
/* help sheets */
.hcol {{ position:absolute; top:87.4pt; width:255pt; font-family:{SERIF}; color:{T['text']} }}
.hbox {{ border:0.75pt solid {T['boxborder']}; margin-bottom:7pt; break-inside:avoid }}
.hh {{ background:{T['boxhead']}; color:#fff; font-family:Poppins; {T['boxhead_font']}; font-size:9pt; line-height:18.7pt; padding:0 8.5pt }}
.hh .tag {{ font-weight:300; color:{T['tag']}; margin-left:2pt }}
.hbody {{ padding:5pt 8.5pt 6pt; font-size:9.15pt; line-height:12pt }}
.hbody ul {{ margin:0; padding-left:11pt }}
.hbody li {{ margin:1.5pt 0 }}
.ht {{ border-collapse:collapse; width:100%; font-size:8.89pt; line-height:11.3pt; margin:1pt 0 3pt }}
.ht td {{ border-bottom:0.75pt solid #dfe6ef; padding:2.2pt 3pt 2.6pt; vertical-align:top }}
.ht td:first-child {{ white-space:nowrap; padding-right:8pt }}
.eg {{ font-style:italic; color:#555; margin:3pt 0 0 }}
"""

def marks_html(m):
    return f'<span class="mk">[{m} mark{"s" if m != 1 else ""}]</span>'

def dots_html(d):
    return f'<span class="dot">{"●" * d}</span>'

def render_q(x):
    m, d = x['marks'], x['dots']
    hsc = x['hsc']
    has_parts = bool(x['parts'])
    has_block = has_parts or x['table'] or x['mc']
    tail_inline = '' if has_block else ((dots_html(d) if hsc else marks_html(m) + dots_html(d)))
    body = ''
    if x['stem']:
        body += f'<div>{x["stem"]}{tail_inline}</div>'
    if has_parts:
        if x['stem']:
            body += '<div class="stemgap"></div>'
        for j, p in enumerate(x['parts']):
            pm = f'<span class="pm">{x["partmarks"][j]}</span>' if x['partmarks'] else ''
            body += f'<div class="pt"><span class="lab">({"abcdef"[j]})</span><span class="ptx">{p}</span>{pm}</div>'
    if x['mc']:
        long = max(len(o) for o in x['mc']) > 12
        opts = ''.join(f'<span><b>{"ABCD"[j]}.</b> {o}</span>' for j, o in enumerate(x['mc']))
        body += f'<div class="mc{" grid" if long else ""}">{opts}</div>'
    if x['table']:
        body += x['table']
    if has_block:
        body += f'<div class="mkline">{"" if hsc else marks_html(m)}{dots_html(d)}</div>'
    if x['diag']:
        nts = '<div class="nts">NOT TO SCALE</div>' if x['nts'] else ''
        body = f'<div class="split"><div class="txt">{body}</div><div class="dg" style="width:{x["diagw"]}pt">{nts}{x["diag"]}</div></div>'
    hscrow = ''
    if hsc:
        hscrow = f'<div class="hscrow"><span class="l">{T["hsc_text"]}</span><span class="r">{m} mark{"s" if m != 1 else ""}</span></div>'
    return f'<div class="q">{hscrow}<div class="qrow"><span class="qn">{x["n"]}</span><div class="qb">{body}</div></div></div>'

def abs_text(bbox, text, css, align='left', width=None):
    x0, y0, x1, y1 = bbox
    h = y1 - y0
    if align == 'right':
        return f'<div class="abs" style="right:{PW - x1:.2f}pt;top:{y0:.2f}pt;line-height:{h:.2f}pt;{css}">{text}</div>'
    if align == 'center':
        w = width or 300
        return f'<div class="abs" style="left:{(x0 + x1) / 2 - w / 2:.2f}pt;width:{w}pt;text-align:center;top:{y0:.2f}pt;line-height:{h:.2f}pt;{css}">{text}</div>'
    return f'<div class="abs" style="left:{x0:.2f}pt;top:{y0:.2f}pt;line-height:{h:.2f}pt;{css}">{text}</div>'

def span_css(s):
    f = s['font']
    c = f"color:#{s['color']:06x};font-size:{s['size']:.2f}pt;"
    if 'Pagella' in f:
        c += f"font-family:{SERIF};" + ('font-weight:700;' if 'Bold' in f else '') + ('font-style:italic;' if 'Italic' in f else '')
    elif 'Poppins' in f:
        w = {'Light': 300, 'Regular': 400, 'Medium': 500, 'SemiBold': 600}[f.split('-')[1]]
        c += f"font-family:Poppins;font-weight:{w};"
    elif 'Bebas' in f:
        c += "font-family:Bebas;"
    return c

# ------------------------------------------------------------------ overlay pages spec
# Each overlay page: dict(kind, target, html)
def build_overlays(n_answer_pages):
    help_pages = 9
    first_help = T['first_help']              # 0-based page index of first help sheet
    ans_first = first_help + help_pages       # 0-based
    ov = []
    redact = {}  # target key -> list of (rect, mode)

    # ---- session pages
    for s in sessions:
        qs = Q[s['k'] * 4: s['k'] * 4 + 4]
        top = s['note_bottom'] + 19.5
        inner = ''.join(render_q(x) for x in qs)
        h = f'<div class="qarea" id="qa{s["k"]}" style="top:{top:.2f}pt">{inner}</div>'
        new_marks = sum(x['marks'] for x in qs)
        if new_marks != s['old_marks']:
            hd = s['hdr']
            txt = hd['text'].replace(f"{s['old_marks']} marks", f"{new_marks} marks")
            h += abs_text(hd['bbox'], esc(txt).replace(' ', '&nbsp;'), span_css(hd))
            for fm in s['foot_marks']:
                h += abs_text(fm['bbox'], f'/ {new_marks}', span_css(fm))
        ov.append(dict(key=('sess', s['k']), html=h))

    # ---- page 2 (intro) and girls cover / tracker
    p2 = src[1]
    sp = list(spans(p2))
    h = ''
    if VER == 'boys':
        para = [s for s in sp if 150 < s['bbox'][1] < 215 and s['bbox'][0] < 300]
        top = para[0]['bbox'][1]
        h += (f'<div class="abs" style="left:42.5pt;top:{top:.2f}pt;width:252pt;white-space:normal;line-height:15.95pt;{span_css(para[0])}">'
              'The questions are core skills, not killers. They keep every Year 11 topic fresh, plus the start of Year 12 (ratios and rates, trigonometry, network flow), so Term 1 is easy.</div>')
    else:
        para = [s for s in sp if 188 < s['bbox'][1] < 255 and s['bbox'][0] < 300]
        top = para[0]['bbox'][1]
        h += (f'<div class="abs" style="left:42.5pt;top:{top:.2f}pt;width:252pt;white-space:normal;line-height:16.5pt;{span_css(para[0])}">'
              'It keeps your core skills fresh from every Year 11 topic and the start of Year 12 (ratios and rates, trigonometry, network flow), so Term 1 feels easy.</div>')
    para_rects = [s['bbox'] for s in para]
    ack = [s for s in sp if 'Traditional Custodians' in s['text'] or 'Outcomes:' in s['text'] or s['text'].startswith('11–12 Syllabus')]
    ack_top = min(s['bbox'][1] for s in ack)
    h += (f'<div class="abs" style="left:42.5pt;top:{ack_top:.2f}pt;width:506pt;white-space:normal;line-height:11.6pt;{span_css(ack[0])}">'
          'We acknowledge the Traditional Custodians of the land on which we learn, the Bundjalung people, and pay our respects to Elders past and present. '
          'Outcomes: MST-11-01, MST-11-02, MST-11-03, MST-11-04, MST-11-05, MST-11-06, MST-11-07, MST-11-08, MST-12-S2-04, MST-12-S2-05, MST-12-S2-06, MAO-WM-01 '
          '(NSW Mathematics Standard 11–12 Syllabus, 2024).</div>')
    contents = []
    for s in sp:
        t = s['text'].strip()
        if re.fullmatch(r'\d+–\d+', t) and s['bbox'][0] > 500:
            a, b = map(int, t.split('–'))
            if a == T['first_help'] + 1:   # help sheets
                new = f'{first_help + 1}–{first_help + help_pages}'
            elif a > T['first_help'] + 1:   # answers
                new = f'{ans_first + 1}–{ans_first + n_answer_pages}'
            else:
                continue
            h += abs_text(s['bbox'], new, span_css(s), align='right')
            contents.append(s['bbox'])
    ov.append(dict(key=('p2',), html=h))
    redact[('p2',)] = para_rects + [s['bbox'] for s in ack] + contents

    if VER == 'girls':
        p1 = src[0]
        lines = [s for s in spans(p1) if 'Formulas and equations' in s['text'] or 'Network flow' in s['text']]
        c = span_css(lines[0])
        y0 = lines[0]['bbox'][1] - 7
        txt = ['All Year 11 topics: money, formulas, measurement, data,',
               'linear relationships, time and location, networks',
               'Ratios and rates • Trigonometry • Network flow']
        h = ''.join(abs_text((150, y0 + 13.6 * j, 445, y0 + 13.6 * j + 12.6), t, c, align='center', width=400) for j, t in enumerate(txt))
        ov.append(dict(key=('p1',), html=h))
        redact[('p1',)] = [s['bbox'] for s in lines]
        # tracker marks
        p3 = src[2]
        ms = [s for s in spans(p3) if re.fullmatch(r'/ \d+', s['text'].replace('\xa0', ' ').strip())]
        ms.sort(key=lambda s: (s['bbox'][0] > 300, s['bbox'][1]))
        assert len(ms) == 30
        h = ''
        rects = []
        for k, s in enumerate(ms):
            nm = sum(x['marks'] for x in Q[k * 4:k * 4 + 4])
            if f'/ {nm}' != s['text'].replace('\xa0', ' ').strip():
                h += abs_text(s['bbox'], '&nbsp;&nbsp;&nbsp;&nbsp;/ ' + str(nm), span_css(s))
                rects.append(s['bbox'])
        ov.append(dict(key=('p3',), html=h))
        redact[('p3',)] = rects

    # ---- help sheets: four new pages (after the M sheet) + renumber moved sheets
    tpl = src[T['help_tpl']]
    tsp = list(spans(tpl))
    let = [s for s in tsp if s['text'].strip() == 'M'][0]
    tit = [s for s in tsp if s['text'].startswith('Help sheet')][0]
    sub = [s for s in tsp if s['text'].startswith('Year 11 Standard')][0]
    pn = [s for s in tsp if s['bbox'][1] > 800 and re.fullmatch(r'\d+', s['text'].strip())][0]
    for j, sh in enumerate(SHEETS):
        newno = T['help_tpl'] + 2 + j    # 1-based page number
        h = abs_text(let['bbox'], sh['letter'], span_css(let), align='center', width=30)
        h += abs_text(tit['bbox'], esc(sh['title']), span_css(tit))
        h += abs_text(sub['bbox'], esc(sh['sub']), span_css(sub))
        h += abs_text(pn['bbox'], str(newno), span_css(pn), align='center', width=30)
        h += f'<div class="hcol" style="left:37.1pt">{"".join(sh["left"])}</div>'
        h += f'<div class="hcol" style="left:303.4pt">{"".join(sh["right"])}</div>'
        ov.append(dict(key=('help', j), html=h))
    for j in range(3):  # N, T, R sheets move back 4 pages
        opg = src[T['help_tpl'] + 1 + j]
        pns = [s for s in spans(opg) if s['bbox'][1] > 800 and re.fullmatch(r'\d+', s['text'].strip())][0]
        newno = T['help_tpl'] + 2 + 4 + j
        ov.append(dict(key=('renum', j), html=abs_text(pns['bbox'], str(newno), span_css(pns), align='center', width=30)))
        redact[('renum', j)] = [pns['bbox']]

    # ---- answers
    items = ''
    for k in range(30):
        qs = Q[k * 4:k * 4 + 4]
        mk = sum(x['marks'] for x in qs)
        items += f'<div class="day">Day {k + 1}<small>({mk} marks)</small></div>'
        for x in qs:
            items += f'<div class="a"><b>{x["n"]}</b>{x["ans"]}</div>'
    for j in range(n_answer_pages):
        tplp = src[T['ans_tpl'][0 if j == 0 else 1]]
        pns = [s for s in spans(tplp) if s['bbox'][1] > 800 and re.fullmatch(r'\d+', s['text'].strip())][0]
        h = abs_text(pns['bbox'], str(ans_first + 1 + j), span_css(pns), align='center', width=30)
        h += f'<div class="ans" id="ans{j}">{items if j == 0 else ""}</div>'
        ov.append(dict(key=('ans', j), html=h))
    return ov, redact

PAGINATE_JS = """
() => {
  const pages = [...document.querySelectorAll('.ans')];
  const first = pages[0];
  let p = 0;
  const kids = [...first.children];
  kids.forEach(k => k.remove());
  // keep a 'day' heading with the answer after it
  for (const el of kids) {
    pages[p].appendChild(el);
    if (pages[p].scrollWidth > pages[p].clientWidth + 1) {
      p += 1;
      if (p >= pages.length) return {overflow: true, used: p};
      const prev = el.previousElementSibling;
      if (prev && prev.classList.contains('day')) pages[p].appendChild(prev);
      pages[p].appendChild(el);
    }
  }
  return {overflow: false, used: p + 1};
}
"""

MEASURE_JS = """
() => [...document.querySelectorAll('.qarea')].map(e => ({id: e.id, top: e.getBoundingClientRect().top, h: e.getBoundingClientRect().height}))
"""

def render(ov, pdf_path):
    for o in ov:
        parts = re.split(r'(<svg.*?</svg>|<[^>]+>)', o['html'], flags=re.S)
        o['html'] = ''.join(p if p.startswith('<') else re.sub(r'(?<=\d) (?=\d{3}\b)', '&#160;', p) for p in parts)
    body = ''.join(f'<div class="page">{o["html"]}</div>' for o in ov)
    doc = f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
    hp = os.path.join(OUT, f'{VER}_overlay.html')
    open(hp, 'w').write(doc)
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        pg = b.new_page(viewport=dict(width=900, height=1200))
        pg.goto('file://' + hp)
        pg.evaluate('document.fonts.ready')
        pg.wait_for_timeout(300)
        res = pg.evaluate(PAGINATE_JS)
        meas = pg.evaluate(MEASURE_JS)
        pg.pdf(path=pdf_path, width=f'{PW/72:.5f}in', height=f'{PH/72:.5f}in', print_background=True, prefer_css_page_size=True,
               margin=dict(top='0', bottom='0', left='0', right='0'))
        b.close()
    return res, meas

# pass 1: find how many answer pages are needed
ov, red = build_overlays(6)
res, meas = render(ov, os.path.join(OUT, f'{VER}_pass1.pdf'))
n_ans = res['used']
print('answer pages needed', n_ans, res)
ov, red = build_overlays(n_ans)
res, meas = render(ov, os.path.join(OUT, f'{VER}_overlay.pdf'))
assert not res['overflow'] and res['used'] == n_ans, res
PX = 0.75  # css px -> pt
qa_h = {m['id']: m['h'] * PX for m in meas}

# ------------------------------------------------------------------ assemble
ovdoc = pymupdf.open(os.path.join(OUT, f'{VER}_overlay.pdf'))
assert len(ovdoc) == len(ov), (len(ovdoc), len(ov))
ovidx = {o['key']: j for j, o in enumerate(ov)}

out = pymupdf.open()
out.insert_pdf(src, from_page=0, to_page=T['help_tpl'])                    # cover .. M sheet
for j in range(4):
    out.insert_pdf(src, from_page=T['help_tpl'], to_page=T['help_tpl'])     # copies of M sheet as templates
out.insert_pdf(src, from_page=T['help_tpl'] + 1, to_page=T['help_tpl'] + 3)  # N, T, R
for j in range(n_ans):
    t = T['ans_tpl'][0 if j == 0 else 1]
    out.insert_pdf(src, from_page=t, to_page=t)

def text_redact(page, rects):
    for r in rects:
        r = pymupdf.Rect(r)
        page.add_redact_annot(pymupdf.Rect(r.x0 - 0.3, r.y0 + 1.2, r.x1 + 0.3, r.y1 - 1.2), fill=False)
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
                          text=pymupdf.PDF_REDACT_TEXT_REMOVE)

def stamp(page, key):
    page.show_pdf_page(page.rect, ovdoc, ovidx[key])

report = []
# session pages
for s in sessions:
    page = out[s['pno']]
    k = s['k']
    hd = [s['hdr']['bbox']] if ('<' not in '' and sum(x['marks'] for x in Q[k*4:k*4+4]) != s['old_marks']) else []
    fm = [f['bbox'] for f in s['foot_marks']] if hd else []
    if hd or fm:
        text_redact(page, hd + fm)
    top = s['note_bottom'] + 19.5
    content_bottom = top + qa_h[f'qa{k}']
    art = s['art']
    out_art = [x[0] for x in page.get_images(full=True) if page.get_image_rects(x[0]) and page.get_image_rects(x[0])[0].y0 > 300]
    assert len(out_art) == 1
    art_x = out_art[0]
    art_bottom = min(art.y1, s['foot_top'] - 1.5) if s['foot_top'] < art.y1 else art.y1
    region = pymupdf.Rect(30, s['note_bottom'] + 3, 565.5, min(art.y1, s['foot_top'] - 0.6))
    page.add_redact_annot(region, fill=(1, 1, 1))
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_REMOVE,
                          graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
                          text=pymupdf.PDF_REDACT_TEXT_REMOVE)
    stamp(page, ('sess', k))
    avail = art_bottom - (content_bottom + 14)
    full_w, full_h = 510.0, 510.0 * 340 / 1400
    ah = min(full_h, avail)
    if ah >= 40:
        aw = ah * 1400 / 340
        rect = pymupdf.Rect(297.75 - aw / 2, art_bottom - ah, 297.75 + aw / 2, art_bottom)
        page.insert_image(rect, xref=art_x)
    report.append((k + 1, round(content_bottom, 1), round(art_bottom, 1), round(ah, 1)))
    if content_bottom > s['foot_top'] - 4:
        print('!!! OVERFLOW session', k + 1, content_bottom, s['foot_top'])

# page 2 / 1 / 3
text_redact(out[1], red[('p2',)]); stamp(out[1], ('p2',))
if VER == 'girls':
    text_redact(out[0], red[('p1',)]); stamp(out[0], ('p1',))
    if red[('p3',)]:
        text_redact(out[2], red[('p3',)]); stamp(out[2], ('p3',))

# help sheets
first_new = T['help_tpl'] + 1
for j in range(4):
    page = out[first_new + j]
    sp = list(spans(page))
    hdr_rects = [s['bbox'] for s in sp if s['bbox'][1] < 85 or s['bbox'][1] > 800]
    text_redact(page, [r for r in hdr_rects if not (pymupdf.Rect(r).y0 > 800 and pymupdf.Rect(r).x0 < 300)])
    page.add_redact_annot(pymupdf.Rect(30, 85, 566, 796), fill=(1, 1, 1))
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED)
    stamp(page, ('help', j))
for j in range(3):
    page = out[first_new + 4 + j]
    text_redact(page, red[('renum', j)])
    stamp(page, ('renum', j))
# answers
a0 = first_new + 7
for j in range(n_ans):
    page = out[a0 + j]
    sp = list(spans(page))
    text_redact(page, [s['bbox'] for s in sp if s['bbox'][1] > 800 and re.fullmatch(r'\d+', s['text'].strip())])
    page.add_redact_annot(pymupdf.Rect(30, 86, 566, 797), fill=(1, 1, 1))
    page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED)
    stamp(page, ('ans', j))

name = {'boys': 'Yr12_Std2_Summer_Revision_Booklet_Boys_Version_v2.pdf',
        'girls': 'Yr12_Std2_Summer_Revision_Booklet_Girls_Version_v2.pdf'}[VER]
out.set_metadata(src.metadata)
out.save(os.path.join(OUT, name), garbage=4, deflate=True, clean=True)
print('pages', len(out), 'size', os.path.getsize(os.path.join(OUT, name)))
json.dump(report, open(os.path.join(OUT, f'{VER}_report.json'), 'w'))
for r in report:
    print('session %2d content bottom %6.1f art bottom %6.1f art h %5.1f' % r)
