# -*- coding: utf-8 -*-
"""New Year 11 help sheets (same box style as the existing help sheets)."""

def box(title, tag, body):
    t = f'<span class="tag">{tag}</span>' if tag else ''
    return f'<div class="hbox"><div class="hh">{title} {t}</div><div class="hbody">{body}</div></div>'

def ul(*items):
    return '<ul>' + ''.join(f'<li>{x}</li>' for x in items) + '</ul>'

def tb(rows, cls=''):
    return f'<table class="ht {cls}">' + ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows) + '</table>'

def eg(s):
    return f'<p class="eg">{s}</p>'

SHEETS = []

# ---------------- E: money ----------------
SHEETS.append(dict(
    letter='E', title='Help sheet: Earning and managing money',
    sub='Year 11 Standard • MST-11-03, MST-11-04 • goes with your summer revision booklet',
    left=[
        box('Wages and salaries', 'MST-11-03', tb([
            ['1 year', '52 weeks = 26 fortnights = 12 months'],
            ['Wage', 'hourly rate × hours worked'],
            ['Salary', 'a fixed yearly amount: ÷ 52 for a week'],
            ['Time-and-a-half', '1.5 × the hourly rate'],
            ['Double time', '2 × the hourly rate'],
            ['Leave loading', 'usually 17.5% of the normal pay for the leave'],
        ]) + eg('e.g. $26/h, 6 h at time-and-a-half: 6 × 39 = $234')),
        box('Other ways of earning', '', ul(
            '<b>Commission:</b> a percentage of sales. Sliding scale: a different % for each band of sales.',
            '<b>Piecework:</b> rate × number of items (or kg) produced.',
            '<b>Royalties:</b> % of the price × number of copies sold.',
            '<b>Bonus:</b> an extra one-off payment.')),
        box('Tax and net pay', '', ul(
            '<b>Taxable income</b> = gross income (wages, interest …) − allowable deductions.',
            '<b>Tax table:</b> tax = base amount + rate × (income − bottom of the bracket).',
            '<b>Medicare levy</b> = 2% of taxable income.',
            '<b>Net pay</b> = gross pay − tax − other deductions.',
            '<b>Refund or owe?</b> Compare the PAYG tax withheld with tax payable + Medicare levy.')
            + eg('e.g. $68 400: $4288 + 0.30 × (68 400 − 45 000) = $11 308')),
    ],
    right=[
        box('Buying goods', 'MST-11-04', ul(
            '% increase: × (1 + rate). % decrease: × (1 − rate).',
            'Profit = selling price − cost price (negative = loss).',
            '<b>GST</b> is 10%. Add GST: × 1.1. GST in a GST-inclusive price: ÷ 11. Price before GST: ÷ 1.1.',
            '<b>VAT</b> works the same way at another rate: 20% VAT → ÷ 1.2.')
            + eg('e.g. $660 including GST: GST = 660 ÷ 11 = $60')),
        box('Terms and buy now, pay later', '', ul(
            'Total on terms = deposit + number of repayments × repayment.',
            'Extra cost = total paid − cash price.',
            'BNPL: equal instalments with no interest, but late fees can add a lot to the cost.')),
        box('Owning a car', '', ul(
            '<b>Stamp duty</b> (NSW, cars up to $45 000): $3 per $100 or part of $100. Round the value <b>up</b> to the next $100 first.',
            '<b>Insurance:</b> CTP (green slip) is compulsory; comprehensive covers your car too. No-claim bonus = a discount. Excess = what you pay when you claim.',
            '<b>Fuel</b> = km ÷ 100 × L/100 km × price per litre.',
            'Running costs: fuel, rego, insurance, servicing, tyres.')),
        box('Bills and budgets', '', ul(
            'Bill = usage × rate + supply charge per day × days. Change cents to dollars.',
            'Budget: income − fixed expenses − savings = discretionary (spare) money.',
            'Emergency fund: aim for 3 to 6 months of living expenses.')),
    ]))

# ---------------- D: data ----------------
SHEETS.append(dict(
    letter='D', title='Help sheet: Data analysis',
    sub='Year 11 Standard • MST-11-08 • goes with your summer revision booklet',
    left=[
        box('Types of data', 'MST-11-08', tb([
            ['Numerical', '<b>discrete</b> (counted: siblings) or <b>continuous</b> (measured: time)'],
            ['Categorical', '<b>nominal</b> (no order: beach) or <b>ordinal</b> (order: S, M, L)'],
        ])),
        box('Samples and surveys', '', ul(
            '<b>Random:</b> everyone has the same chance. <b>Systematic:</b> every <i>n</i>th person.',
            '<b>Stratified:</b> each group in proportion: group size ÷ population × sample size.',
            '<b>Self-selected:</b> people choose to answer. Often biased.',
            'Good questions are clear, neutral (not leading) and have balanced choices.')),
        box('Tables and graphs', '', ul(
            'Sector angle = fraction × 360°. Fraction = angle ÷ 360°.',
            'Frequency table: mean = Σ<i>fx</i> ÷ Σ<i>f</i>. For grouped data use the class centres.',
            'Cumulative frequency = running total of the frequencies.',
            'Median position = (<i>n</i> + 1) ÷ 2. Stem-and-leaf: read the key.')),
        box('Measures of centre and spread', '', ul(
            '<b>Mean</b> is pulled by outliers. <b>Median</b> is better for skewed data or outliers. <b>Mode</b> is the most common value.',
            'Range = max − min. Standard deviation (σ<sub>x</sub> on the calculator) measures spread about the mean: smaller σ = more consistent.')),
    ],
    right=[
        box('Five-number summary and box plots', '', ul(
            'Min, Q₁, median, Q₃, max. Put the data in order first.',
            'Split the data into a lower and an upper half (leave out the median if <i>n</i> is odd). Q₁ is the median of the lower half, Q₃ of the upper half.',
            'IQR = Q₃ − Q₁. Each section of a box plot holds about 25% of the data.')
            + eg('e.g. 3 5 6 8 9 10 | 12 13 15 18 20 41: Q₁ = 7, Q₃ = 16.5')),
        box('Outliers', '', ul(
            'Outlier: below Q₁ − 1.5 × IQR or above Q₃ + 1.5 × IQR.',
            'Outliers change the mean and range a lot, but hardly change the median and IQR.')),
        box('Shape', '', ul(
            '<b>Symmetric:</b> both sides alike. <b>Positively skewed:</b> tail to the right. <b>Negatively skewed:</b> tail to the left.',
            'Look for clusters, gaps and outliers. Unimodal, bimodal or multimodal: the number of peaks.')),
        box('Comparing datasets', '', ul(
            'Compare a centre (median or mean) <b>and</b> a spread (IQR, range or σ).',
            'Quote the values, then say what they mean in context: “Class B’s median is higher, so …”')),
    ]))

# ---------------- L: linear + time ----------------
SHEETS.append(dict(
    letter='L', title='Help sheet: Linear relationships, time and location',
    sub='Year 11 Standard • MST-11-02, MST-11-06 • goes with your summer revision booklet',
    left=[
        box('Straight-line graphs', 'MST-11-02', ul(
            '<i>y</i> = <i>mx</i> + <i>c</i>: <i>m</i> is the gradient, <i>c</i> is the <i>y</i>-intercept.',
            'Gradient = rise ÷ run. Line goes up to the right: positive. Down: negative.',
            'Table of values: substitute each <i>x</i>. A point is on the line if it fits the equation.')
            + eg('e.g. through (0, 3) and (4, 11): <i>m</i> = 8 ÷ 4 = 2, so <i>y</i> = 2<i>x</i> + 3')),
        box('Linear models', '', ul(
            'Gradient = rate of change (e.g. $70 per hour). Intercept = starting value (e.g. a $85 call-out fee).',
            '<b>Interpolate</b> (inside the data): reliable. <b>Extrapolate</b> (outside the data): less reliable.',
            'Real situations don’t stay linear forever: say why the model breaks down.')),
        box('Direct variation', '', ul(
            '<i>y</i> = <i>kx</i>: a straight line through the origin with gradient <i>k</i>.',
            'Find <i>k</i> = <i>y</i> ÷ <i>x</i> from one pair of values, then use the formula.')),
    ],
    right=[
        box('Time', 'MST-11-06', ul(
            '1 h = 60 min = 3600 s. Decimal hours: 0.75 h × 60 = 45 min.',
            '24-hour time: 9:20 pm = 2120, 12:15 am = 0015.',
            'Elapsed time: count up to the next hour, then whole hours, then minutes.')),
        box('Latitude and longitude', '', ul(
            '<b>Latitude:</b> degrees N or S of the equator (0° to 90°). <b>Longitude:</b> degrees E or W of the prime meridian (0° to 180°).',
            'Write latitude first: Kingscliff ≈ 28°S 154°E.',
            '15° of longitude = 1 hour (1° = 4 min). Further east = later in the day.')),
        box('Time zones', '', tb([
            ['UTC+10', 'AEST: NSW, ACT, Vic, Tas, Qld'],
            ['UTC+9.5', 'ACST: SA, NT'],
            ['UTC+8', 'AWST: WA'],
        ]) + ul(
            'Daylight saving (October to April): NSW, ACT, Vic and Tas go to UTC+11, SA to UTC+10.5. Qld, NT and WA don’t change.',
            'Convert to UTC first, then to the new zone. Flights: add the flight time, then convert.')),
    ]))

# ---------------- P: networks ----------------
SHEETS.append(dict(
    letter='P', title='Help sheet: Networks, paths and trees',
    sub='Year 11 Standard • MST-11-07 • goes with your summer revision booklet',
    left=[
        box('Key words', 'MST-11-07', tb([
            ['Vertex, edge', 'a point; a line joining two vertices'],
            ['Degree', 'number of edges at a vertex'],
            ['Directed', 'edges have arrows (one way)'],
            ['Weighted', 'edges have numbers (km, minutes, $)'],
            ['Path', 'a route with no repeated vertices'],
            ['Tree', 'connected with no cycles: <i>n</i> vertices, <i>n</i> − 1 edges'],
            ['Spanning tree', 'a tree that reaches every vertex'],
        ]) + ul('Sum of the degrees = 2 × the number of edges, so it is always even.')),
        box('Tables to networks', '', ul(
            'Each cell gives the weight of the edge between the row and column vertices. A dash means no edge.',
            'Draw the vertices first, then add one edge for each pair, with its weight.')),
    ],
    right=[
        box('Minimum spanning trees', '', ul(
            '<b>Kruskal’s:</b> choose the shortest edge left that doesn’t make a cycle. Stop at <i>n</i> − 1 edges.',
            '<b>Prim’s:</b> start anywhere. Keep adding the shortest edge that joins a new vertex to your tree.',
            'Minimal connector problems (cable, pipes, paths) = find the minimum spanning tree and add the weights.')),
        box('Shortest path', '', ul(
            'Work out from the start. Label each vertex with the shortest distance to it so far, and update it if you find a shorter way.',
            'Check every route into the finish vertex. Write the path and its length.',
            'The shortest path isn’t always the best: traffic, tolls, road works, hills or speed limits can matter more.')),
    ]))
