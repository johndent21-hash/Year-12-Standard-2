# -*- coding: utf-8 -*-
"""Three extra help-sheet pages for the summer booklet: formulas & equations, measurement, network flow."""
from helpsheet import panel, frac, page
import diagrams2
from nets import NETS

SUB = "goes with your summer revision booklet"


def net_with_cut():
    """Network A with the cut around S drawn as a dashed line."""
    svg = diagrams2.network("A", 230, 128)
    # cut around S: between S (x≈22) and A/B (x≈115)
    cut = ('<path d="M70,8 C60,50 60,80 72,122" fill="none" stroke="#c2477a" stroke-width="2" stroke-dasharray="5 4"/>'
           '<text x="2" y="126" font-size="10.5" font-family="TeX Gyre Pagella" fill="#c2477a">cut: 8 + 6 = 14</text>')
    return svg.replace("</svg>", cut + "</svg>")


# ---------------- Formulas and equations ----------------
fe = [
    panel("Substitution", f"""
<ul>
<li>Write the formula, then substitute, then work it out: one step to a line.</li>
<li>Put negative numbers in <b>brackets</b>: if <i>a</i> = −2, then 3<i>a</i>² = 3 × (−2)² = 12.</li>
<li>Order of operations: brackets, powers and roots, × and ÷, then + and −.</li>
</ul>""", "MST-11-01"),
    panel("Solving linear equations", f"""
<ul>
<li>Do the <b>same thing to both sides</b> to undo each operation, in reverse order.</li>
<li>Expand brackets first and collect the pronumerals on one side.</li>
</ul>
<p class="eg">e.g. 5(<i>x</i> − 2) = 3<i>x</i> + 6 → 5<i>x</i> − 10 = 3<i>x</i> + 6 → 2<i>x</i> = 16 → <i>x</i> = 8</p>
<p><b>Check</b> by substituting your answer back in. <b>Worded problems:</b> let <i>x</i> = the unknown, write the equation, solve, then answer in words with units.</p>""", ""),
    panel("Changing the subject", f"""
<ul>
<li>Undo the operations around the new subject, in reverse order.</li>
<li><i>y</i> = <i>ax</i>² + <i>c</i> → <i>x</i> = √{frac('<i>y</i> − <i>c</i>', '<i>a</i>')} &nbsp;(take the positive root when <i>x</i> must be positive, such as a length or speed).</li>
</ul>
<p class="eg">e.g. <i>v</i> = <i>u</i> + <i>at</i> → <i>a</i> = {frac('<i>v</i> − <i>u</i>', '<i>t</i>')}</p>""", ""),
    panel("Speed and stopping distance", f"""
<div class="key"><i>S</i> = {frac('<i>D</i>', '<i>T</i>')} &nbsp;&nbsp; <i>D</i> = <i>ST</i> &nbsp;&nbsp; <i>T</i> = {frac('<i>D</i>', '<i>S</i>')}</div>
<ul>
<li>Match units: km with km/h and hours; m with m/s and seconds. km/h ÷ 3.6 = m/s.</li>
<li><b>Stopping distance</b> = reaction distance + braking distance.</li>
<li>Reaction distance = speed (m/s) × reaction time (s). <span class="eg">60 km/h for 1.5 s: 16.7 × 1.5 = 25 m</span></li>
</ul>""", ""),
    panel("Blood alcohol content (BAC)", f"""
<div class="key">BAC<sub>male</sub> = {frac('10<i>N</i> − 7.5<i>H</i>', '6.8<i>M</i>')} &nbsp;&nbsp; BAC<sub>female</sub> = {frac('10<i>N</i> − 7.5<i>H</i>', '5.5<i>M</i>')}</div>
<p><i>N</i> = standard drinks, <i>H</i> = hours of drinking, <i>M</i> = mass in kg. &nbsp;Time to reach zero = {frac('BAC', '0.015')} hours.</p>
<p><b>Limitations:</b> it is only an estimate. Food, health, metabolism and drink sizes all change a real BAC. Learner and P-plate drivers in NSW must have a BAC of zero.</p>""", ""),
    panel("Medication dosages", f"""
<table class="rule">
<tr><th>Formula</th><th>Use for</th><th>Child’s dosage</th></tr>
<tr><td>Fried’s</td><td>1 to 2 years</td><td>{frac('age (months) × adult dosage', '150')}</td></tr>
<tr><td>Young’s</td><td>1 to 12 years</td><td>{frac('age (years)', 'age (years) + 12')} × adult dosage</td></tr>
<tr><td>Clark’s</td><td>by weight</td><td>{frac('weight (kg)', '70')} × adult dosage</td></tr></table>
<p style="margin-top:1mm">Check the units (mg or mL) and that the child’s dose is <b>less</b> than the adult dose.</p>""", ""),
]

# ---------------- Measurement ----------------
me = [
    panel("Converting units", """
<table class="rule">
<tr><td>Length</td><td>mm ×10 → cm ×100 → m ×1000 → km &nbsp;(÷ to go back)</td></tr>
<tr><td>Area</td><td>1 cm² = 100 mm², 1 m² = 10 000 cm², 1 ha = 10 000 m², 1 km² = 1 000 000 m²</td></tr>
<tr><td>Volume</td><td>1 cm³ = 1000 mm³, 1 m³ = 1 000 000 cm³</td></tr>
<tr><td>Capacity</td><td>1 cm³ = 1 mL, 1 m³ = 1000 L = 1 kL, 1000 kL = 1 ML</td></tr>
<tr><td>Mass</td><td>mg ×1000 → g ×1000 → kg ×1000 → t</td></tr></table>
<p style="margin-top:1mm">Going to a <b>smaller</b> unit, multiply. Going to a <b>bigger</b> unit, divide.</p>""", "MST-11-05"),
    panel("Scientific notation and prefixes", """
<p><i>a</i> × 10<sup><i>n</i></sup> with 1 ≤ <i>a</i> &lt; 10. <span class="eg">45 000 000 = 4.5 × 10<sup>7</sup>; 0.00072 = 7.2 × 10<sup>−4</sup></span></p>
<table class="rule"><tr><td>nano n 10<sup>−9</sup></td><td>micro µ 10<sup>−6</sup></td><td>milli m 10<sup>−3</sup></td><td>centi c 10<sup>−2</sup></td></tr>
<tr><td>kilo k 10<sup>3</sup></td><td>mega M 10<sup>6</sup></td><td>giga G 10<sup>9</sup></td><td>tera T 10<sup>12</sup></td></tr></table>
<p style="margin-top:1mm"><b>Significant figures:</b> start counting at the first non-zero digit. <span class="eg">0.004 56 has 3 sig. figs.</span></p>""", ""),
    panel("Pythagoras’ theorem", """
<div class="key"><i>c</i>² = <i>a</i>² + <i>b</i>², where <i>c</i> is the hypotenuse (opposite the right angle)</div>
<p>Hypotenuse: add the squares. Shorter side: subtract. A triangle is right-angled if the sides fit <i>c</i>² = <i>a</i>² + <i>b</i>².</p>""", ""),
    panel("Perimeter and area", f"""
<table class="rule">
<tr><td>Rectangle</td><td><i>A</i> = <i>lw</i></td><td>Triangle</td><td><i>A</i> = ½<i>bh</i></td></tr>
<tr><td>Parallelogram</td><td><i>A</i> = <i>bh</i></td><td>Trapezium</td><td><i>A</i> = ½<i>h</i>(<i>a</i> + <i>b</i>)</td></tr>
<tr><td>Circle</td><td><i>A</i> = π<i>r</i>², <i>C</i> = 2π<i>r</i></td><td>Sector</td><td><i>A</i> = {frac('θ', '360')} × π<i>r</i>²</td></tr>
<tr><td>Arc length</td><td><i>l</i> = {frac('θ', '360')} × 2π<i>r</i></td><td>Composite</td><td>add or subtract parts</td></tr></table>
<p style="margin-top:1mm"><b>Trapezoidal rule:</b> <i>A</i> ≈ {frac('<i>h</i>', '2')}(<i>d<sub>f</sub></i> + <i>d<sub>l</sub></i>), applied to each strip (up to four) and added.</p>""", ""),
    panel("Surface area", """
<ul>
<li><b>Prism:</b> add the areas of all the faces (draw the net).</li>
<li><b>Cylinder:</b> <i>SA</i> = 2π<i>r</i>² + 2π<i>rh</i> (closed). Leave out a circle if it is open.</li>
<li><b>Sphere:</b> <i>SA</i> = 4π<i>r</i>².</li>
</ul>""", ""),
    panel("Volume and capacity", """
<table class="rule">
<tr><td>Prism</td><td><i>V</i> = <i>Ah</i></td><td>Cylinder</td><td><i>V</i> = π<i>r</i>²<i>h</i></td></tr>
<tr><td>Pyramid</td><td><i>V</i> = ⅓<i>Ah</i></td><td>Cone</td><td><i>V</i> = ⅓π<i>r</i>²<i>h</i></td></tr>
<tr><td>Sphere</td><td colspan="3"><i>V</i> = ⁴⁄₃π<i>r</i>³ &nbsp;&nbsp;(<i>A</i> = area of the cross-section or base)</td></tr></table>
<p style="margin-top:1mm">Capacity: 1 cm³ = 1 mL and 1 m³ = 1000 L. Keep the full calculator value and round at the end.</p>""", ""),
]

# ---------------- Network flow ----------------
nf = [
    panel("Key words", """
<table class="rule">
<tr><td><b>Flow network</b></td><td>a directed, weighted network that carries something (water, cars, people)</td></tr>
<tr><td><b>Source</b> (<i>S</i>)</td><td>where the flow starts. <b>Sink</b> (<i>T</i>): where the flow ends.</td></tr>
<tr><td><b>Capacity</b></td><td>the most that can flow along an edge</td></tr>
<tr><td><b>Inflow / outflow</b></td><td>total capacity of the edges into / out of a vertex</td></tr>
<tr><td><b>Saturated edge</b></td><td>flow = capacity (no excess capacity left)</td></tr>
<tr><td><b>Cut</b></td><td>a line separating the source from the sink, crossing every path from <i>S</i> to <i>T</i></td></tr></table>""", "MST-12-S2-06"),
    panel("Tables to networks", """
<ul>
<li>Each row is a directed edge: <b>From</b> → <b>To</b>, with its capacity.</li>
<li>The source only appears in the <b>From</b> column. The sink only appears in the <b>To</b> column.</li>
<li>Put the source on the left and the sink on the right, then add the other vertices between them.</li>
</ul>""", ""),
    panel("Capacity of a cut", f"""
<p>Add the capacities of the edges the cut crosses that flow <b>from the source side to the sink side</b>. An edge going back from the sink side to the source side counts as <b>0</b>.</p>
<div style="text-align:center">{net_with_cut()}</div>""", ""),
    panel("Saturated edges method", """
<ol style="margin:0;padding-left:4.5mm">
<li>Choose a path from <i>S</i> to <i>T</i>. Its flow is the <b>smallest</b> capacity on the path.</li>
<li>Subtract this flow from every edge on the path and write the excess capacity.</li>
<li>An edge with 0 left is saturated: it can’t be used again.</li>
<li>Repeat until every path from <i>S</i> to <i>T</i> has a saturated edge. Add the path flows.</li>
</ol>""", ""),
    panel("Maximum-flow minimum-cut theorem", """
<div class="key">Maximum flow = capacity of the <b>minimum cut</b></div>
<p>Check a few cuts (around <i>S</i>, around <i>T</i>, and through the middle). The smallest is the maximum flow, and it should match the saturated edges method.</p>""", ""),
    panel("Changing capacities and demand", """
<ul>
<li>Increasing an edge that is <b>not</b> in the minimum cut does <b>not</b> change the maximum flow.</li>
<li>Increasing an edge <b>in</b> the minimum cut can raise the maximum flow, but only until another cut becomes the smallest.</li>
<li>A network <b>meets demand</b> if its maximum flow is at least the demand.</li>
</ul>""", ""),
]

p3 = page("F", "Help sheet: Formulas and equations", f"Year 11 Standard • MST-11-01 • {SUB}",
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{fe[0]}{fe[1]}{fe[2]}</div>'
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{fe[3]}{fe[4]}{fe[5]}</div>', 3)
p4 = page("M", "Help sheet: Applications of measurement", f"Year 11 Standard • MST-11-05 • {SUB}",
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{me[0]}{me[1]}{me[2]}</div>'
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{me[3]}{me[4]}{me[5]}</div>', 4)
p5 = page("N", "Help sheet: Network flow", f"Year 12 Standard 2 • MST-12-S2-06 • {SUB}",
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{nf[0]}{nf[1]}{nf[2]}</div>'
          f'<div style="display:flex;flex-direction:column;gap:2.2mm">{nf[3]}{nf[4]}{nf[5]}</div>', 5)
