# -*- coding: utf-8 -*-
"""All 120 summer questions. Topic codes:
C1 Earning money (MST-11-03)      C2 Formulas and equations (MST-11-01)
C3 Applications of measurement (MST-11-05)   C4 Data analysis 1 (MST-11-08)
C5 Linear relationships (MST-11-02)  C6 Data analysis 2 (MST-11-08)
C7 Time and location (MST-11-06)  C8 Managing money (MST-11-04)
C9 Networks, paths and trees (MST-11-07)
TR Trigonometry (MST-12-S2-04)  RR Ratios and rates (MST-12-S2-05)  NF Network flow (MST-12-S2-06)
"""
import diagrams as D

def i(s):
    return f'<i>{s}</i>'

def frac(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'

def table(head, rows, cls=''):
    h = ''.join(f'<th>{x}</th>' for x in head)
    b = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table class="tbl {cls}"><tr>{h}</tr>{b}</table>'

# ---------------- network diagrams ----------------
NET_A = dict(nodes={'S': (16, 52), 'A': (100, 12), 'B': (100, 92), 'T': (184, 52)},
             edges=[('S', 'A', 8, (-6, -6)), ('S', 'B', 6, (-6, 6)), ('A', 'B', 4, (7, 0)),
                    ('A', 'T', 5, (6, -6)), ('B', 'T', 9, (6, 6))])
NET_24 = dict(nodes={'S': (16, 52), 'A': (100, 12), 'B': (100, 92), 'T': (184, 52)},
              edges=[('S', 'A', 7, (-6, -6)), ('S', 'B', 6, (-6, 6)), ('A', 'T', 5, (6, -6)), ('B', 'T', 8, (6, 6))])
NET_52 = dict(nodes={'S': (16, 52), 'A': (100, 12), 'B': (100, 92), 'T': (184, 52)},
              edges=[('S', 'A', 6, (-6, -6)), ('S', 'B', 5, (-6, 6)), ('A', 'B', 3, (7, 0)),
                     ('A', 'T', 4, (6, -6)), ('B', 'T', 7, (6, 6))])
NET_64 = dict(nodes={'S': (16, 52), 'A': (100, 12), 'B': (100, 92), 'T': (184, 52)},
              edges=[('S', 'A', 9, (-6, -6)), ('S', 'B', 7, (-6, 6)), ('A', 'B', 4, (7, 0)),
                     ('A', 'T', 10, (6, -6)), ('B', 'T', 5, (6, 6))])
NET_84 = dict(nodes={'S': (14, 60), 'A': (80, 12), 'B': (80, 108), 'C': (128, 60), 'T': (196, 60)},
              edges=[('S', 'A', 12, (-7, -5)), ('S', 'B', 10, (-7, 5)), ('A', 'C', 8, (6, -4)),
                     ('A', 'T', 6, (8, -7), 0.55), ('B', 'C', 4, (6, 4)), ('B', 'T', 5, (8, 7), 0.55),
                     ('C', 'T', 15, (0, -7))])
NET_116 = dict(nodes={'S': (14, 60), 'A': (70, 60), 'B': (130, 14), 'C': (130, 106), 'T': (196, 60)},
               edges=[('S', 'A', 15, (0, -8)), ('A', 'B', 6, (-6, -6)), ('A', 'C', 7, (-6, 6)),
                      ('B', 'T', 9, (6, -6)), ('C', 'T', 5, (6, 6))])
# Year 11 networks (undirected unless stated)
NET_25 = dict(nodes={'A': (14, 50), 'B': (70, 12), 'C': (70, 88), 'D': (136, 12), 'E': (136, 88)},
              edges=[('A', 'B', ''), ('A', 'C', ''), ('B', 'C', ''), ('B', 'D', ''), ('C', 'D', ''),
                     ('C', 'E', ''), ('D', 'E', '')])
NET_48 = dict(nodes={'A': (14, 54), 'B': (74, 12), 'C': (74, 96), 'D': (146, 12), 'E': (146, 96), 'F': (206, 54)},
              edges=[('A', 'B', 7, (-6, -6)), ('A', 'C', 5, (-6, 6)), ('B', 'C', 6, (-7, 0)),
                     ('B', 'D', 9, (0, -7)), ('C', 'D', 8, (-9, -2), 0.42), ('C', 'E', 4, (0, 7)),
                     ('D', 'E', 3, (7, 0)), ('D', 'F', 10, (6, -6)), ('E', 'F', 11, (6, 6))])
NET_76 = dict(nodes={'A': (12, 56), 'B': (66, 12), 'C': (66, 100), 'D': (126, 12), 'E': (126, 100),
                     'F': (180, 56), 'G': (226, 56)},
              edges=[('A', 'B', 4, (-6, -6)), ('A', 'C', 2, (-6, 6)), ('B', 'C', 1, (-7, 0)),
                     ('B', 'D', 5, (0, -7)), ('C', 'D', 8, (-9, -3), 0.4), ('C', 'E', 10, (0, 7)),
                     ('D', 'E', 2, (7, 0)), ('D', 'F', 6, (6, -6)), ('E', 'F', 3, (6, 6)),
                     ('E', 'G', 7, (2, 8), 0.62), ('F', 'G', 1, (0, -7))])
NET_119 = dict(nodes={'A': (14, 56), 'B': (84, 12), 'C': (84, 100), 'D': (160, 12), 'E': (160, 100)},
               edges=[('A', 'B', 5, (-6, -6)), ('A', 'C', 3, (-6, 6)), ('C', 'B', 1, (-7, 0)),
                      ('B', 'D', 6, (0, -7)), ('C', 'E', 12, (0, 7)), ('D', 'E', 2, (7, 0))])

def net(spec, w, h, directed=True):
    return D.network(w, h, spec['nodes'], spec['edges'], directed=directed)

# ---------------- other diagrams ----------------
TRI_3 = D.right_triangle(110, 78, {'P': (8, 66), 'Q': (96, 66), 'R': (96, 8)}, 'Q',
                         labels=[(44, 28, '12 m'), (104, 38, 'x', True)],
                         angles=[('P', '40°', 16, 9)])
TRI_23 = D.right_triangle(130, 62, {'P': (8, 52), 'Q': (120, 52), 'R': (120, 8)}, 'Q',
                          labels=[(62, 22, '13'), (127, 30, '5')], angles=[('P', 'θ', 18, 8)])
BOX_41 = D.boxplots(210, 62, [('', (24, 27, 28, 30, 35))], 22, 36, 1, 2, 'Daily maximum temperature (°C)')
BOX_88 = D.boxplots(220, 92, [('Class A', (42, 55, 63, 70, 88)), ('Class B', (35, 60, 72, 78, 92))],
                    30, 100, 5, 2, 'Test mark (%)', label_w=34)
DOT_98 = D.dotplot(200, 82, {0: 3, 1: 6, 2: 5, 3: 3, 4: 2, 5: 1, 6: 0, 7: 1}, 0, 7, 'Goals scored per game')
DT_66 = D.graph(200, 120, (0, 3), (0, 50), 0.5, 10, lines=[[(0, 0), (1, 20), (1.5, 20), (2.5, 45)]],
                xlabel='Time (hours)', ylabel='Distance (km)', xlab_every=2, ylab_every=1)
LINE_85 = D.graph(150, 140, (-1, 5), (-3, 6), 1, 1, lines=[[(-2 / 3, -3), (5, 5.5)]], points=[(0, -2), (4, 4)], origin_axes=True)
DECK_50 = D.pool_deck()

# ---------------- questions ----------------
Q = []
def q(n, topic, marks, dots, ans, stem='', parts=None, hsc=False, diag=None, diagw=0, nts=False,
      table_html=None, mc=None, partmarks=None, after=''):
    Q.append(dict(n=n, topic=topic, marks=marks, dots=dots, ans=ans, stem=stem, parts=parts, hsc=hsc,
                  diag=diag, diagw=diagw, nts=nts, table=table_html, mc=mc, partmarks=partmarks, after=after))

# Session 01
q(1, 'C3', 3, 1, '(a) 3500 m (b) 2.4 L (c) 600 kg', 'Convert:',
  ['3.5 km to metres', '2400 mL to litres', '0.6 t to kilograms'])
q(2, 'C1', 2, 1, 'Weekly: 35 × $28.40 = $994; yearly: 52 × $994 = $51 688',
  'Jess earns $28.40 per hour and works 35 hours a week. Find her weekly wage and her yearly income (1 year = 52 weeks).')
q(3, 'TR', 2, 1, f'{i("x")} = 12 sin 40° ≈ 7.7 m', f'Find the value of {i("x")}, correct to one decimal place.',
  diag=TRI_3, diagw=110, nts=True)
q(4, 'NF', 1, 1, 'C (6 + 4 = 10)', f'The diagram shows a network of water pipes.<br>What is the inflow capacity of vertex {i("B")}?',
  hsc=True, mc=['6', '9', '10', '15'], diag=net(NET_A, 200, 104), diagw=200)

# Session 02
q(5, 'C2', 1, 1, f'{i("C")} = 20 + 12 × 3.5 = $62',
  f'A kayak hire shop charges {i("C")} = 20 + 12{i("h")} dollars for {i("h")} hours. Find the cost of hiring a kayak for 3.5 hours.')
q(6, 'RR', 2, 1, '9 parts, $40 each: $200 and $160', 'Share $360 in the ratio 5 : 4.')
q(7, 'C4', 2, 1, '(a) numerical, discrete (b) numerical, continuous (c) categorical, ordinal (d) categorical, nominal',
  'Classify each variable as numerical (discrete or continuous) or categorical (nominal or ordinal).',
  ['the number of siblings a student has', 'the time taken to swim 50 m',
   'T-shirt size (S, M, L, XL)', 'favourite surf beach'])
q(8, 'NF', 2, 2, 'Edges from the source side to the sink side: S→B 6, A→B 4, A→T 5; capacity = 15',
  f'For the network shown, a cut has {i("S")} and {i("A")} on the source side, and {i("B")} and {i("T")} on the sink side. Find the capacity of the cut.',
  hsc=True, diag=net(NET_A, 200, 104), diagw=200)

# Session 03
q(9, 'C2', 2, 1, f'(a) {i("x")} = 6 (b) {i("x")} = 19', 'Solve:',
  [f'3{i("x")} + 7 = 25', f'{frac(i("x") + " − 4", "5")} = 3'])
q(10, 'C7', 2, 1, '(a) 2 h 45 min (b) 2120 (or 21:20)', 'Convert:',
  ['2.75 hours to hours and minutes', '9:20 pm to 24-hour time.'])
q(11, 'TR', 2, 1, f'{i("h")} = 25 tan 32° ≈ 15.6 m',
  'From a point on level ground 25 m from the base of a tree, the angle of elevation of the top of the tree is 32°. Find the height of the tree, correct to one decimal place.')
q(12, 'NF', 2, 1, 'Network: S→A 10, S→B 7, A→B 3, A→T 8, B→T 9; outflow of S = 10 + 7 = 17 L/min',
  f'The table shows the capacities, in litres per minute, of the pipes in a network. Draw the network, and find the outflow capacity of the source, {i("S")}.',
  hsc=True, table_html=table(['From', 'To', 'Capacity'], [['S', 'A', 10], ['S', 'B', 7], ['A', 'B', 3], ['A', 'T', 8], ['B', 'T', 9]]))

# Session 04
q(13, 'C1', 2, 1, 'Deductions = $296 + $12 + $38 = $346; net pay = $1480 − $346 = $1134',
  'Kai’s gross weekly pay is $1480. Each week $296 PAYG tax, $12 union fees and $38 private health insurance are deducted. Find his net pay.')
q(14, 'C8', 2, 1, '(a) $660 ÷ 11 = $60 (b) $45 × 1.1 = $49.50', '',
  ['A surfboard costs $660, including GST. How much GST is included?',
   'A haircut costs $45 before GST. Find the price including GST.'])
q(15, 'C5', 2, 1, 'Gradient −2, y-intercept 4',
  f'Write down the gradient and the {i("y")}-intercept of the line {i("y")} = 4 − 2{i("x")}.')
q(16, 'NF', 1, 1, 'A (the smallest capacity limits the flow)',
  'Three pipes with capacities of 12, 9 and 15 L/min are joined one after the other. What is the flow capacity of the line of pipes?',
  hsc=True, mc=['9 L/min', '12 L/min', '15 L/min', '36 L/min'])

# Session 05
q(17, 'C2', 2, 1, f'{i("a")} = ({i("v")} − {i("u")}) ÷ {i("t")} = (20 − 5) ÷ 3 = 5',
  f'Make {i("a")} the subject of {i("v")} = {i("u")} + {i("at")}. Then find {i("a")} when {i("v")} = 20, {i("u")} = 5 and {i("t")} = 3.')
q(18, 'C3', 2, 1, '√(12² + 9²) = √225 = 15 m',
  'A rectangular pool is 12 m long and 9 m wide. Find the length of its diagonal.')
q(19, 'RR', 2, 1, f'12/60 = 50/{i("N")}, so {i("N")} = 250 possums',
  'Rangers catch, tag and release 50 possums. Later they catch 60 possums, and 12 of them are tagged. Estimate the possum population.', hsc=True)
q(20, 'C6', 3, 1, 'Mean = 80 ÷ 8 = 10; median = (8 + 10) ÷ 2 = 9; mode = 7',
  'The number of waves caught by eight surfers in a session were:<br><span class="data">4, 7, 7, 8, 10, 12, 15, 17</span>',
  ['Find the mean.', 'Find the median.', 'Find the mode.'])

# Session 06
q(21, 'C3', 3, 1, '(a) 4.5 × 10⁷ (b) 7.2 × 10⁻⁴ (c) 3.14', 'Write in scientific notation:',
  ['45 000 000', '0.000 72', '3.14159, correct to 3 significant figures (write it as a decimal).'])
q(22, 'C1', 2, 1, 'Saturday: 6 × $39 = $234; Sunday: 4 × $52 = $208; total $442',
  'Liam earns $26 an hour. On Saturday he works 6 hours at time-and-a-half, and on Sunday he works 4 hours at double time. Find his pay for the weekend.')
q(23, 'TR', 2, 1, 'sin θ = 5/13, θ ≈ 22°37′', 'Find θ, correct to the nearest minute.', diag=TRI_23, diagw=130, nts=True)
q(24, 'NF', 2, 1, 'Two separate paths: S→A→T can carry 5 and S→B→T can carry 6; maximum flow = 11',
  f'Find the maximum flow from {i("S")} to {i("T")} in the network shown.', hsc=True, diag=net(NET_24, 200, 104), diagw=200)

# Session 07
q(25, 'C9', 2, 1, '(a) A 2, B 3, C 4, D 3, E 2 (b) 7 edges; sum of degrees = 14 (twice the number of edges)',
  'For the network shown:', ['write down the degree of each vertex', 'find the number of edges and the sum of the degrees.'],
  diag=net(NET_25, 150, 100, directed=False), diagw=150)
q(26, 'RR', 2, 1, '2 L: $2.40/L; 3 L: $2.20/L; the 3 L bottle is better value',
  'Iced tea is sold in 2 L bottles for $4.80 and 3 L bottles for $6.60. Which is better value? Show the unit price of each.')
q(27, 'C4', 2, 1, '(a) 150/360 × 360 = 150 students (b) 54/360 = 15%',
  'A sector graph shows how 360 students travel to school. The bus sector has an angle of 150°, and the walk sector has an angle of 54°.',
  ['How many students catch the bus?', 'What percentage of students walk?'])
q(28, 'C7', 2, 1, '(a) 7:30 am Tuesday (b) 9:30 am Tuesday',
  'In January it is 10:30 am on Tuesday in Sydney (AEDT, UTC+11). What time is it in:', ['Perth (AWST, UTC+8)', 'Brisbane (AEST, UTC+10)?'], hsc=True)

# Session 08
q(29, 'C8', 2, 1, '(a) £96 ÷ 1.2 = £80 (b) £96 − £80 = £16',
  'In the United Kingdom, VAT is charged at 20%. A jacket costs £96, including VAT.',
  ['Find the price before VAT.', 'How much VAT is included?'])
q(30, 'C5', 2, 1, f'(a) {i("y")} = −3, −1, 1, 3, 5 (b) No: 2 × 4 − 1 = 7, not 8',
  f'For the line {i("y")} = 2{i("x")} − 1:',
  [f'complete a table of values for {i("x")} = −1, 0, 1, 2, 3', 'does the point (4, 8) lie on the line? Explain.'])
q(31, 'C4', 2, 2, 'Years 7–8: 480/1200 × 80 = 32; Years 9–10: 28; Years 11–12: 20',
  'A school has 480 students in Years 7–8, 420 in Years 9–10 and 300 in Years 11–12. A stratified sample of 80 students is chosen. How many students should come from each group?', hsc=True)
q(32, 'TR', 2, 2, 'cos θ = (5² + 8² − 7²) ÷ (2 × 5 × 8) = 0.5, so θ = 60°',
  'A triangle has sides of 5 cm, 7 cm and 8 cm. Use the cosine rule to find the angle opposite the 7 cm side.')

# Session 09
q(33, 'C2', 2, 2, 'Reaction distance = (60 ÷ 3.6) × 1.5 = 25 m; stopping distance = 25 + 20 = 45 m',
  'A driver’s reaction time is 1.5 seconds. The car is travelling at 60 km/h (about 16.7 m/s), and its braking distance is 20 m. Use stopping distance = reaction distance + braking distance to find the stopping distance.')
q(34, 'C8', 2, 1, 'Terms: $180 + 24 × $79 = $2076, which is $276 more than cash',
  'A fridge costs $1800 cash. On terms, it costs a 10% deposit and 24 monthly repayments of $79. Find the total cost on terms, and how much more this is than the cash price.')
q(35, 'C6', 3, 2, 'Min 3, Q₁ = 7, median = 11, Q₃ = 16.5, max 41; IQR = 9.5',
  'The numbers of fish caught by 12 anglers were:<br><span class="data">3, 5, 6, 8, 9, 10, 12, 13, 15, 18, 20, 41</span>',
  ['Find the five-number summary.', 'Find the interquartile range.'])
q(36, 'NF', 2, 1, 'Inflow of Q = 9 + 5 = 14; outflow of Q = 13',
  f'The table shows the capacities of the edges in a network. Find the inflow capacity and the outflow capacity of vertex {i("Q")}.',
  hsc=True, table_html=table(['From', 'To', 'Capacity'], [['S', 'P', 12], ['S', 'Q', 9], ['P', 'Q', 5], ['P', 'T', 8], ['Q', 'T', 13]]))

# Session 10
q(37, 'C1', 2, 1, '(85 + 92 + 78) kg = 255 kg; 255 × $1.20 = $306',
  'A strawberry picker is paid $1.20 per kilogram. She picks 85 kg on Monday, 92 kg on Tuesday and 78 kg on Wednesday. Find her pay for the three days.')
q(38, 'C3', 2, 2, '2π × 5² + 2π × 5 × 12 = 170π ≈ 534.1 cm²',
  'Find the surface area of a closed cylinder with a radius of 5 cm and a height of 12 cm, correct to one decimal place.')
q(39, 'C5', 2, 1, '(a) $85 is the call-out fee (the C-intercept); $70 is the cost per hour (the gradient) (b) 85 + 70 × 2.5 = $260',
  f'A plumber’s charge is {i("C")} = 85 + 70{i("h")} dollars for {i("h")} hours of work.',
  ['What do the 85 and the 70 represent?', 'Find the charge for a 2.5-hour job.'])
q(40, 'TR', 2, 1, '½ × 8 × 11 × sin 35° ≈ 25.2 m²',
  'Find the area of a triangle with sides of 8 m and 11 m and an included angle of 35°, correct to one decimal place.', hsc=True)

# Session 11
q(41, 'C6', 2, 1, '(a) Median 28 °C; IQR = 30 − 27 = 3 °C (b) 25% of 40 = 10 days',
  'The box plot shows the daily maximum temperature at Kingscliff over 40 summer days.',
  ['Find the median and the interquartile range.', 'On about how many days was the maximum above 30 °C?'],
  diag=BOX_41, diagw=210)
q(42, 'RR', 2, 1, '120 × 0.015 = 1.8 m³ = 1800 L',
  'During a storm, 15 mm of rain falls on a shed roof with an area of 120 m². How many litres of water fall on the roof?')
q(43, 'C1', 2, 2, '2.5% × $600 000 = $15 000; 1.5% × $350 000 = $5250; total $20 250',
  'A real estate agent earns 2.5% commission on the first $600 000 of a sale price and 1.5% on the amount above $600 000. Find the commission on a house that sells for $950 000.')
q(44, 'NF', 1, 1, 'B', 'In a flow network, the maximum flow from source to sink is equal to:', hsc=True,
  mc=['the capacity of the largest cut', 'the capacity of the minimum cut', 'the number of edges', 'the inflow of the source'])

# Session 12
q(45, 'C8', 2, 2, '(a) $480 ÷ 4 = $120 (b) $480 + 2 × $10 = $500; $20 ÷ $480 ≈ 4.2% more',
  'Headphones cost $480. With a buy now, pay later scheme, the price is paid in 4 equal fortnightly instalments, with a $10 late fee for each missed payment.',
  ['Find the amount of each instalment.', 'Zoe misses two payments. Find the total she pays, and how much more this is than the price, as a percentage (one decimal place).'])
q(46, 'RR', 2, 1, '1.5 kW × 4 h = 6 kWh; 6 × $0.32 = $1.92',
  'A 1500 W fan heater runs for 4 hours. Electricity costs 32 c/kWh. Find the cost.')
q(47, 'TR', 2, 1, f'{i("d")} = 40 ÷ tan 25° ≈ 85.8 m',
  'From the top of a 40 m cliff, the angle of depression of a boat is 25°. How far is the boat from the base of the cliff? Answer to one decimal place.', hsc=True)
q(48, 'C9', 2, 2, 'Edges DE 3, CE 4, AC 5, BC 6, DF 10; minimum spanning tree length = 28',
  'Use Kruskal’s or Prim’s algorithm to find a minimum spanning tree for the network. State its length.',
  diag=net(NET_48, 220, 108, directed=False), diagw=220)

# Session 13
q(49, 'C2', 2, 1, f'{i("x")} + ({i("x")} + 4) = 32, so {i("x")} = 14: Sam is 14 and Ella is 18',
  'Ella is 4 years older than Sam. Their ages add to 32. Write an equation and solve it to find their ages.')
q(50, 'C3', 2, 2, '10 × 6 + ½ × π × 3² ≈ 74.1 m²',
  'A pool deck is a 10 m by 6 m rectangle with a semicircle on one 6 m end, as shown. Find its area, correct to one decimal place.',
  diag=DECK_50, diagw=170, nts=True)
q(51, 'C7', 2, 1, '(a) Tokyo (N means north of the equator) (b) Cairns is 28 − 17 = 11° of latitude north of Kingscliff', '',
  ['Kingscliff is at 28°S 154°E and Tokyo is at 36°N 140°E. Which city is in the Northern Hemisphere?',
   'Cairns is at 17°S 146°E. Is Cairns north or south of Kingscliff, and by how many degrees of latitude?'])
q(52, 'NF', 2, 1, 'No. The maximum flow (11) is less than the demand (12) kL/min',
  'The network shown has a maximum flow of 11 kL/min. A town needs 12 kL/min. Can the network meet the demand? Explain.',
  hsc=True, diag=net(NET_52, 200, 104), diagw=200)

# Session 14
q(53, 'C2', 2, 2, f'{i("x")} = √(({i("y")} − 2) ÷ 3); {i("y")} = 50: {i("x")} = √16 = 4',
  f'Make {i("x")} the subject of {i("y")} = 3{i("x")}² + 2 ({i("x")} &gt; 0). Then find {i("x")} when {i("y")} = 50.')
q(54, 'C4', 2, 2, '(a) 4.5, 14.5, 24.5, 34.5 (b) (18 + 130.5 + 122.5 + 69) ÷ 20 = 17 minutes',
  'The table shows the time 20 students spent on homework last night.',
  ['Write down the class centre of each class.', 'Estimate the mean time.'],
  diagw=130, diag=table(['Time (min)', 'Frequency'], [['0–9', 4], ['10–19', 9], ['20–29', 5], ['30–39', 2]]))
q(55, 'RR', 2, 1, '6 parts of 100 kg: cement 100 kg, sand 200 kg, gravel 300 kg',
  'Concrete is mixed from cement, sand and gravel in the ratio 1 : 2 : 3 by mass. How much of each is in 600 kg of concrete?')
q(56, 'C6', 2, 2, '(a) IQR = 12 − 6 = 6 (b) 12 + 1.5 × 6 = 21; 25 &gt; 21, so 25 is an outlier',
  'The five-number summary for a dataset is 2, 6, 9, 12, 25.',
  ['Find the interquartile range.', f'Use Q₃ + 1.5 × IQR to decide whether 25 is an outlier.'], hsc=True)

# Session 15
q(57, 'C2', 2, 1, 'BAC = (40 − 15) ÷ (6.8 × 80) ≈ 0.046; not zero, so he cannot drive on P-plates',
  f'BAC<sub>male</sub> = {frac("10" + i("N") + " − 7.5" + i("H"), "6.8" + i("M"))}. A man weighing 80 kg has 4 standard drinks over 2 hours. Find his BAC, correct to 3 decimal places. P-plate drivers must have a BAC of zero. Could he drive on P-plates?', hsc=True)
q(58, 'C3', 2, 2, 'Arc = 120/360 × 2π × 6 ≈ 12.6 cm; perimeter ≈ 12.6 + 12 = 24.6 cm',
  'A sector has a radius of 6 cm and an angle of 120°. Find its arc length and its perimeter, correct to one decimal place.')
q(59, 'C1', 3, 2, '(a) $4288 + 0.30 × ($68 400 − $45 000) = $11 308 (b) 2% × $68 400 = $1368',
  'Use the tax table to find, for a taxable income of $68 400:',
  ['the tax payable', 'the Medicare levy of 2%.'],
  table_html=table(['Taxable income', 'Tax on this income'],
                   [['$0 – $18 200', 'Nil'], ['$18 201 – $45 000', '16c for each $1 over $18 200'],
                    ['$45 001 – $135 000', '$4288 plus 30c for each $1 over $45 000'],
                    ['$135 001 – $190 000', '$31 288 plus 37c for each $1 over $135 000']], 'wide'))
q(60, 'C5', 2, 2, f'(a) Gradient = −300 ÷ 15 = −20, so {i("V")} = 1200 − 20{i("t")} (b) 1200 − 20{i("t")} = 0, {i("t")} = 60 minutes',
  'A tank holds 1200 L of water. It drains at a constant rate, and after 15 minutes it holds 900 L.',
  [f'Write an equation for the volume {i("V")} litres after {i("t")} minutes.', 'After how many minutes will the tank be empty?'])

# Session 16
q(61, 'C8', 2, 1, '(a) $1850 × 0.65 = $1202.50 (b) $3200 − $750 = $2450',
  'Ruby’s comprehensive car insurance costs $1850 before her 35% no-claim bonus discount.',
  ['Find the premium she pays.', 'She has an accident that causes $3200 of damage. Her excess is $750. How much does the insurer pay?'])
q(62, 'RR', 2, 1, '4.5 m × 3.2 m = 14.4 m²; 14.4 × $45 = $648',
  'On a 1 : 100 plan, a room is 4.5 cm by 3.2 cm. Tiles cost $45 per m². Find the cost of tiling the room.')
q(63, 'C4', 3, 1, '(a) 42 − 16 = 26 years (b) 8th value: 25 years (c) 25 years',
  'The stem-and-leaf plot shows the ages of 15 surf club volunteers. Find:',
  ['the range', 'the median', 'the mode.'],
  diagw=150, diag=('<table class="tbl stem"><tr><th>Stem</th><th>Leaf</th></tr>'
              '<tr><td>1</td><td>6 7 8 8 9</td></tr><tr><td>2</td><td>0 3 5 5 5 7</td></tr>'
              '<tr><td>3</td><td>1 4 8</td></tr><tr><td>4</td><td>2</td></tr></table>'
              '<div class="key">Key: 2 | 3 = 23 years</div>'))
q(64, 'NF', 2, 2, 'Edges crossing from the source side: S→B 7, A→B 4, A→T 10; capacity = 21',
  f'For the network shown, find the capacity of the cut that has {i("S")} and {i("A")} on the source side.',
  hsc=True, diag=net(NET_64, 200, 104), diagw=200)

# Session 17
q(65, 'C6', 2, 1, '(a) Mean = 135 ÷ 7 ≈ 19.3; median = 15 (b) The median: the outlier 45 pulls the mean above most of the scores',
  'The ages of the people at a family picnic table were:<br><span class="data">12, 14, 15, 15, 16, 18, 45</span>',
  ['Find the mean (one decimal place) and the median.', 'Which is the better measure of centre? Explain.'])
q(66, 'RR', 2, 1, '(a) 30 minutes (from 1 h to 1.5 h) (b) 25 km ÷ 1 h = 25 km/h',
  'The distance–time graph shows a bike ride.',
  ['For how long did the rider stop?', 'Find the speed for the last part of the ride.'], diag=DT_66, diagw=200)
q(67, 'TR', 2, 1, '140° + 180° = 320°T, which is N40°W',
  f'The bearing of {i("B")} from {i("A")} is 140°T. Find the bearing of {i("A")} from {i("B")}, as a true bearing and as a compass bearing.', hsc=True)
q(68, 'C8', 2, 2, 'Round up to $28 800: 288 × $3 = $864',
  'Stamp duty on a car in NSW is $3 for every $100, or part of $100, of its value (for cars up to $45 000). Find the stamp duty on a car worth $28 750.')

# Session 18
q(69, 'C2', 2, 1, '18 × 300 ÷ 150 = 36 mg',
  f'Fried’s formula gives a dose for children aged 1 to 2: dosage = {frac("age (months) × adult dosage", "150")}. Find the dose for an 18-month-old if the adult dose is 300 mg.')
q(70, 'C3', 2, 1, '5/2 × (12 + 16) + 5/2 × (16 + 10) = 70 + 65 = 135 m²',
  'The widths of a garden bed are 12 m, 16 m and 10 m, measured 5 m apart. Use two applications of the trapezoidal rule to estimate its area.')
q(71, 'C5', 2, 1, f'(a) {i("k")} = 78 ÷ 40 = 1.95, so {i("C")} = 1.95{i("L")} (b) 1.95 × 55 = $107.25',
  f'The cost, {i("C")} dollars, of fuel varies directly with the number of litres, {i("L")}. 40 L costs $78.',
  [f'Find {i("k")} and write the equation {i("C")} = {i("kL")}.', 'Find the cost of 55 L.'])
q(72, 'NF', 1, 1, 'B', 'An edge with a capacity of 20 carries a flow of 20. The edge is:', hsc=True,
  mc=['empty', 'saturated', 'a cut', 'the sink'])

# Session 19
q(73, 'C1', 2, 1, 'Income $72 840 − deductions $1710 = $71 130',
  'Ava’s salary was $72 500 and she earned $340 bank interest. She has $1260 of work-related deductions and gave $450 in donations. Find her taxable income.')
q(74, 'C3', 2, 1, '⅓ × π × 3² × 8 = 24π ≈ 75.4 cm³',
  'Find the volume of a cone with a radius of 3 cm and a height of 8 cm, correct to one decimal place.')
q(75, 'RR', 2, 2, '25 pop, 15 rock; after adding 4 rock: 25 : 19',
  'A playlist has 40 songs, with pop to rock songs in the ratio 5 : 3. Four more rock songs are added. What is the new ratio of pop to rock?', hsc=True)
q(76, 'C9', 2, 2, 'A→C→B→D→E→F→G: 2 + 1 + 5 + 2 + 3 + 1 = 14',
  f'Find the shortest path from {i("A")} to {i("G")} and its length.',
  diag=net(NET_76, 238, 112, directed=False), diagw=238)

# Session 20
q(77, 'C9', 2, 1, '(a) Edges PQ 12, PR 7, QR 4, QS 9, RS 15 (b) P→R→Q→S: 7 + 4 + 9 = 20 km',
  'The table shows the lengths (km) of the roads between four towns. A dash means there is no direct road.',
  ['Draw a weighted network to show the roads.', f'Find the shortest distance from {i("P")} to {i("S")}.'],
  diagw=150, diag=table(['', 'P', 'Q', 'R', 'S'], [['P', '–', 12, 7, '–'], ['Q', 12, '–', 4, 9], ['R', 7, 4, '–', 15], ['S', '–', 9, 15, '–']], 'grid'))
q(78, 'C3', 2, 1, '(a) ⁴⁄₃π × 6³ ≈ 904.8 cm³ (b) 4π × 6² ≈ 452.4 cm²', 'A ball is a sphere with a radius of 6 cm.',
  ['Find its volume, correct to one decimal place.', 'Find its surface area, correct to one decimal place.'],
  hsc=True, partmarks=[1, 1])
q(79, 'C7', 2, 2, '(a) 150 − 75 = 75°; 75 ÷ 15 = 5 hours (b) B is west, so 5 hours behind: 9 am',
  'Town A is at longitude 150°E and town B is at 75°E.',
  ['Use 15° = 1 hour to find the time difference between them.', 'It is 2 pm in town A. What time is it in town B?'])
q(80, 'TR', 2, 2, '1.6 + 20 tan 40° ≈ 18.4 m',
  'Sam’s eyes are 1.6 m above level ground. He stands 20 m from a flagpole and the angle of elevation of the top is 40°. Find the height of the flagpole, correct to one decimal place.')

# Session 21
q(81, 'C6', 2, 1, 'Same mean, but Class A has a much smaller standard deviation, so its results were more consistent',
  'Two classes did the same test. Class A had a mean of 68 and a standard deviation of 4.2. Class B had a mean of 68 and a standard deviation of 11.5. Which class performed more consistently? Explain.')
q(82, 'C1', 2, 1, '4 × $1240 = $4960; loading 17.5% × $4960 = $868; total $5828',
  'Sam’s normal weekly pay is $1240. He takes 4 weeks of annual leave and is paid a leave loading of 17.5%. Find his total holiday pay.')
q(83, 'TR', 2, 2, f'{i("d")}² = 5² + 7² − 2 × 5 × 7 × cos 80°, {i("d")} ≈ 7.9 km',
  'Two hikers leave a campsite. One walks 5 km and the other walks 7 km, and the angle between their paths is 80°. How far apart are they? Answer to one decimal place.', hsc=True)
q(84, 'NF', 3, 2, 'Maximum flow = 21. Cut through S→A 12, B→C 4, B→T 5 = 21 (the minimum cut)',
  f'Find the maximum flow from {i("S")} to {i("T")}. Show a cut that proves your answer.',
  diag=net(NET_84, 210, 120), diagw=210)

# Session 22
q(85, 'C5', 2, 1, f'Gradient = 6 ÷ 4 = 1.5, {i("y")}-intercept −2, so {i("y")} = 1.5{i("x")} − 2',
  f'Find the gradient and the {i("y")}-intercept of the line shown, and write its equation in the form {i("y")} = {i("mx")} + {i("c")}.',
  diag=LINE_85, diagw=150)
q(86, 'C4', 2, 1, '(a) Self-selected (b) Only people who follow the page (mostly skaters) will answer, so the sample is biased',
  'A council wants to know what residents think of a new skate park. It posts a survey on the skate park’s Instagram page.',
  ['Name this type of sampling.', 'Explain why the sample is unlikely to be representative of all residents.'])
q(87, 'TR', 2, 2, f'∠C = 70°; {i("a")} = 15 sin 48° ÷ sin 70° ≈ 11.9 cm',
  f'In △{i("ABC")}, ∠{i("A")} = 48°, ∠{i("B")} = 62° and {i("c")} = 15 cm. Find {i("a")}, correct to one decimal place.')
q(88, 'C6', 2, 2, 'Class B has the higher median (72 vs 63), so it did better overall. Class A has the smaller IQR (15 vs 18), so its marks were less spread out',
  'The parallel box plots show the test marks of two classes. Compare the classes using the medians and the interquartile ranges.',
  hsc=True, diag=BOX_88, diagw=220)

# Session 23
q(89, 'C8', 2, 2, '620 × $0.345 + 410 × $0.182 + 91 × $0.98 = $213.90 + $74.62 + $89.18 = $377.70',
  'A quarterly electricity bill charges 34.5 c/kWh for 620 kWh of peak use, 18.2 c/kWh for 410 kWh of off-peak use, and a supply charge of 98 c per day for 91 days. Find the total bill.', hsc=True)
q(90, 'C3', 2, 2, '½ × (1.2 + 0.8) × 0.5 × 4 = 2 m³',
  'A garden bed is a prism. Its cross-section is a trapezium with parallel sides of 1.2 m and 0.8 m and a height of 0.5 m, and the bed is 4 m long. Find the volume of soil needed.')
q(91, 'C7', 2, 1, '(a) 4 h 27 min (b) 0025 the next day', '',
  ['A train leaves at 10:48 am and arrives at 3:15 pm. How long is the trip?',
   'A bus leaves at 2135 and the trip takes 2 h 50 min. When does it arrive (24-hour time)?'])
q(92, 'C8', 2, 1, 'Savings 15% × $1150 = $172.50; $1150 − $550 − $172.50 = $427.50',
  'Mia’s take-home pay is $1150 a fortnight. Her fixed expenses are rent $420, phone $40 and transport $90 a fortnight, and she saves 15% of her pay. How much is left for discretionary spending each fortnight?')

# Session 24
q(93, 'C2', 2, 2, 'Clark: 16 ÷ 70 × 600 ≈ 137 mg; Young: 4 ÷ 16 × 600 = 150 mg',
  f'A 4-year-old weighs 16 kg. The adult dose of a medicine is 600 mg. Find the child’s dose using Clark’s formula, dosage = {frac("weight (kg)", "70")} × adult dosage, and using Young’s formula, dosage = {frac("age", "age + 12")} × adult dosage. Answer to the nearest mg.', hsc=True)
q(94, 'C5', 2, 1, f'Gradient = 8 ÷ 4 = 2, so {i("y")} = 2{i("x")} + 3; 2 × 10 + 3 = 23 ≠ 25, so no',
  f'A line passes through (0, 3) and (4, 11). Find its equation, then decide whether the point (10, 25) lies on the line.')
q(95, 'RR', 2, 1, '$9.00, $7.50 and $7.00 per 100 mL; the 500 mL bottle is the best buy',
  'Sunscreen is sold as 110 mL for $9.90, 250 mL for $18.75 and 500 mL for $35.00. Which is the best buy? Show the price per 100 mL.')
q(96, 'C7', 2, 2, 'Departs 10:45 am Friday UTC; arrives 1:15 am Saturday UTC = 5:15 pm Friday in Los Angeles',
  'A flight leaves Sydney (UTC+11) at 9:45 pm on Friday and takes 14 h 30 min to reach Los Angeles (UTC−8). Find the local time and day it arrives.')

# Session 25
q(97, 'C1', 2, 1, '$9842 + $1096 = $10 938 owed; $10 938 − $10 500 = $438, so Noah owes $438',
  'Noah’s tax payable is $9842 and his Medicare levy is $1096. His employer withheld $10 500 in PAYG tax during the year. Does he get a refund or owe tax? How much?')
q(98, 'C6', 2, 1, '(a) 1 goal (b) Positively skewed (tail to the right); 7 is a possible outlier',
  'The dot plot shows the number of goals a team scored in each game of a season.',
  ['What is the mode?', 'Describe the shape of the distribution.'], diag=DOT_98, diagw=200)
q(99, 'C1', 2, 1, '12% × $34.95 × 8400 = $35 229.60',
  'An author is paid royalties of 12% of the $34.95 retail price of each book sold. Find her royalties when 8400 books are sold.', hsc=True)
q(100, 'TR', 3, 2, '(a) √(8² + 6²) = 10 km (b) tan⁻¹(6/8) ≈ 37°, so 037°T',
  f'Town {i("A")} is 8 km north and 6 km east of town {i("B")}.',
  [f'Find the distance {i("AB")}.', f'Find the true bearing of {i("A")} from {i("B")}, to the nearest degree.'])

# Session 26
q(101, 'C9', 2, 1, '(a) (1 + 2 + 2 + 3 + 3 + 5) ÷ 2 = 8 edges (b) The degrees add to 15, which is odd; every edge adds 2 to the total, so the sum must be even',
  '', ['A network has 6 vertices with degrees 1, 2, 2, 3, 3 and 5. How many edges does it have?',
       'Explain why no network can have vertices with degrees 1, 2, 2, 3, 3 and 4.'])
q(102, 'C6', 2, 1, 'Mean = 572 ÷ 8 = 71.5; σ ≈ 2.29',
  'The scores of eight golfers were:<br><span class="data">72, 75, 70, 68, 74, 71, 69, 73</span><br>Find the mean and the population standard deviation, correct to two decimal places.')
q(103, 'TR', 2, 2, '∠AOB = 110° − 20° = 90°; area = ½ × 30 × 40 × sin 90° = 600 m²',
  f'In a compass radial survey from {i("O")}, point {i("A")} is 30 m away on a bearing of 020° and point {i("B")} is 40 m away on a bearing of 110°. Find the area of △{i("AOB")}.')
q(104, 'C9', 3, 2, 'Choose ST 3, QR 4, PR 5, QT 6 (QS 7 would make a cycle); minimum length = 18 km',
  'Cable is to connect five towns. The table shows the distances (km) between them. Find the minimum length of cable needed to connect all the towns.',
  hsc=True, table_html=table(['', 'P', 'Q', 'R', 'S', 'T'],
                             [['P', '–', 8, 5, 9, 12], ['Q', 8, '–', 4, 7, 6], ['R', 5, 4, '–', 10, 11],
                              ['S', 9, 7, 10, '–', 3], ['T', 12, 6, 11, 3, '–']], 'grid'))

# Session 27
q(105, 'RR', 2, 1, '(a) 400 ÷ 400 s = 1 m/s (b) 1 × 3.6 = 3.6 km/h', 'A swimmer swims 400 m in 6 minutes 40 seconds.',
  ['Find her speed in m/s.', 'Convert this speed to km/h.'])
q(106, 'RR', 2, 2, 'Make b equal: 8 : 12 and 12 : 15, so a : b : c = 8 : 12 : 15',
  f'If {i("a")} : {i("b")} = 2 : 3 and {i("b")} : {i("c")} = 4 : 5, find {i("a")} : {i("b")} : {i("c")}.')
q(107, 'C8', 2, 2, 'Price $180 × 1.35 = $243; sale price $243 × 0.8 = $194.40; profit $14.40',
  'A shop buys a wetsuit for $180 and marks it up by 35%. In a sale, the marked price is reduced by 20%. Find the sale price, and the profit or loss.')
q(108, 'NF', 2, 1, 'Source P (only in the From column), sink S (only in the To column); inflow of R = 5 + 2 = 7',
  f'Use the table to find the source and the sink, and the inflow capacity of {i("R")}.',
  hsc=True, table_html=table(['From', 'To', 'Capacity'], [['P', 'Q', 7], ['P', 'R', 5], ['Q', 'R', 2], ['Q', 'S', 6], ['R', 'S', 8]]))

# Session 28
q(109, 'C2', 2, 2, 'BAC = (30 − 15) ÷ (5.5 × 60) ≈ 0.045; time = 0.045 ÷ 0.015 ≈ 3 hours',
  f'BAC<sub>female</sub> = {frac("10" + i("N") + " − 7.5" + i("H"), "5.5" + i("M"))} and time to reach zero = BAC ÷ 0.015 hours. A 60 kg woman has 3 standard drinks over 2 hours. Find her BAC (3 decimal places), and how long until it is zero.', hsc=True)
q(110, 'C4', 2, 1, '(a) It is a leading question: it pushes people to agree (b) e.g. “Should the canteen sell more healthy food? Yes / No / Unsure”',
  'A survey asks: “Don’t you agree the canteen should sell healthier food?”',
  ['What is wrong with this question?', 'Rewrite it so it is fair.'])
q(111, 'C4', 2, 2, '(a) 6, 15, 22, 27, 30 (b) 15th and 16th scores are 1 and 2: median = 1.5',
  'The table shows the number of pets owned by 30 students.',
  ['Write down the cumulative frequencies.', 'Find the median.'],
  diagw=110, diag=table(['Pets', 'Frequency'], [[0, 6], [1, 9], [2, 7], [3, 5], [4, 3]]))
q(112, 'C7', 2, 1, 'Arrive 4:35 pm NSW time = 3:35 pm Queensland time',
  'In January, NSW is on daylight saving time (UTC+11) but Queensland is not (UTC+10). A family leaves Kingscliff at 4:15 pm and drives 20 minutes to Coolangatta, Queensland. What is the Queensland time when they arrive?')

# Session 29
q(113, 'C7', 2, 1, '(a) 8845 s = 2 h 27 min 25 s (b) 0.4 × 60 = 24 min', 'Convert:',
  ['8845 seconds to hours, minutes and seconds', '0.4 hours to minutes.'])
q(114, 'C3', 3, 2, '(a) 8 × 4 × 1.5 = 48 m³ = 48 000 L (b) 48 000 ÷ 30 = 1600 min = 26 h 40 min',
  'A rectangular pool is 8 m long, 4 m wide and 1.5 m deep.',
  ['Find its capacity in litres.', 'A hose fills it at 30 L/min. How long does it take to fill, in hours and minutes?'],
  hsc=True, partmarks=[2, 1])
q(115, 'C5', 2, 1, '(a) 1.5 × 6 + 4 = 13 cm (b) 10 years is far beyond the data (extrapolation): the model gives 784 cm, but plants don’t keep growing at a constant rate',
  f'The height of a seedling, {i("h")} cm, after {i("t")} weeks is modelled by {i("h")} = 1.5{i("t")} + 4.',
  ['Predict its height after 6 weeks.', 'Explain why the model should not be used to predict its height after 10 years.'])
q(116, 'NF', 2, 2, 'No. The minimum cut A→B 6 + C→T 5 = 11 does not include A→C, so the maximum flow stays at 11',
  'In the network shown, the maximum flow is 11. The capacity of A→C is increased from 7 to 9. Does the maximum flow change? Explain.',
  hsc=True, diag=net(NET_116, 210, 120), diagw=210)

# Session 30
q(117, 'C8', 2, 2, 'Fuel: 150 × 7.2 = 1080 L × $2.05 = $2214; total $2214 + $2780 = $4994',
  'A car uses 7.2 L/100 km and travels 15 000 km a year. Fuel costs $2.05/L. Registration is $420, CTP insurance $560, comprehensive insurance $1150 and servicing $650 a year. Find the yearly cost of running the car.')
q(118, 'C9', 2, 1, '(a) 7 − 1 = 6 edges (b) e.g. traffic, tolls, road works, steep hills or lower speed limits can make it slower or dearer',
  '', ['A network has 7 vertices. How many edges does a spanning tree of the network have?',
       'Give one reason why the shortest path between two places might not be the best path to take.'])
q(119, 'C9', 2, 2, '(a) No: the road goes from C to B only (b) A→C→B→D→E: 3 + 1 + 6 + 2 = 12 minutes',
  'The directed network shows one-way roads and travel times in minutes.',
  [f'Can a car travel directly from {i("B")} to {i("C")}? Explain.', f'Find the shortest time from {i("A")} to {i("E")}.'],
  diag=net(NET_119, 176, 112), diagw=176)
q(120, 'TR', 2, 2, '30 = ½ × 8 × 10 × sin θ, so sin θ = 0.75 and θ ≈ 49°',
  'A triangle has an area of 30 cm², and two of its sides are 8 cm and 10 cm. Find the acute angle between these sides, to the nearest degree.', hsc=True)

assert [x['n'] for x in Q] == list(range(1, 121)), 'numbering'
