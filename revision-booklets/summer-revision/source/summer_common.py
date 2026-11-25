# -*- coding: utf-8 -*-
"""Shared pieces for the summer booklets (girls and boys): questions, answers, help sheets."""
import re
import build, helpsheet, helpsheet2, diagrams2
from content2 import DAYS, TOPIC_NAMES
from content import qmarks

build.diagrams = diagrams2      # q_html looks diagrams up here

EXTRA_CSS = r"""
table.nt{border-collapse:collapse;margin:1.6mm 0 .5mm;font-size:10.5pt}
table.nt th{font-family:Poppins;font-weight:500;font-size:8pt;padding:.8mm 4mm;border-bottom:1.5px solid #888;text-align:center}
table.nt td{padding:.5mm 4mm;text-align:center;border-bottom:1px solid #e2e2e2}
.day .qs{font-size:12.2pt;line-height:1.42}
.day .q{padding:4.2mm 0 4.4mm}
"""


def day_questions(di):
    return "".join(build.q_html(4 * di + i + 1, q) for i, q in enumerate(DAYS[di]))


def day_marks(di):
    return sum(qmarks(q) for q in DAYS[di])


def topics_of_day(di):
    seen = []
    for q in DAYS[di]:
        for t in q["tags"]:
            if TOPIC_NAMES[t][1] not in seen:
                seen.append(TOPIC_NAMES[t][1])
    return seen


def ans_html(rng):
    out = []
    for di in rng:
        out.append(f'<h4>Day {di+1} <span class="tot">({day_marks(di)} marks)</span></h4>')
        for i, q in enumerate(DAYS[di]):
            out.append(f'<p><b>{4*di+i+1}</b> {q["ans"]}</p>')
    return "".join(out)


def help_pages(foot_text, first_pno):
    pages = []
    src = [helpsheet2.p3, helpsheet2.p4, helpsheet2.p5, helpsheet.p1, helpsheet.p2]
    for k, p in enumerate(src):
        p = p.replace(helpsheet.FOOT, foot_text).replace("goes with the 3-week revision booklet", "goes with your summer revision booklet")
        p = re.sub(r'<span class="pno">\d+</span>', f'<span class="pno">{first_pno+k}</span>', p)
        pages.append(p)
    return pages


HELP_CSS = helpsheet.CSS[len(build.CSS):]
