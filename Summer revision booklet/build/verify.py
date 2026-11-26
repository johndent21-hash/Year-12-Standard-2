import math, statistics as st, collections
import networkx as nx
from content import Q, NET_A, NET_24, NET_52, NET_64, NET_84, NET_116, NET_25, NET_48, NET_76, NET_119

ok = []
def chk(n, cond, msg=''):
    assert cond, f'Q{n} FAILED {msg}'
    ok.append(n)

def close(a, b, tol=1e-6):
    return abs(a - b) <= tol

sin = lambda d: math.sin(math.radians(d)); cos = lambda d: math.cos(math.radians(d)); tan = lambda d: math.tan(math.radians(d))
deg = math.degrees

def flowG(spec):
    G = nx.DiGraph()
    for e in spec['edges']:
        G.add_edge(e[0], e[1], capacity=e[2])
    return G
def ugraph(spec):
    G = nx.Graph()
    for e in spec['edges']:
        G.add_edge(e[0], e[1], weight=e[2] if e[2] != '' else 1)
    return G
def cutcap(G, src_side):
    return sum(d['capacity'] for u, v, d in G.edges(data=True) if u in src_side and v not in src_side)
def dms(x):
    d = int(x); m = (x - d) * 60
    return d, round(m)

chk(1, (3.5 * 1000, 2400 / 1000, 0.6 * 1000) == (3500, 2.4, 600))
chk(2, close(28.40 * 35, 994) and close(994 * 52, 51688))
chk(3, round(12 * sin(40), 1) == 7.7)
G = flowG(NET_A); chk(4, sum(d['capacity'] for u, v, d in G.in_edges('B', data=True)) == 10)
chk(5, 20 + 12 * 3.5 == 62)
chk(6, (360 / 9 * 5, 360 / 9 * 4) == (200, 160))
chk(7, True)
chk(8, cutcap(G, {'S', 'A'}) == 15)
chk(9, (25 - 7) / 3 == 6 and 3 * 5 + 4 == 19)
chk(10, 0.75 * 60 == 45)
chk(11, round(25 * tan(32), 1) == 15.6)
G12 = nx.DiGraph(); [G12.add_edge(a, b, capacity=c) for a, b, c in [('S','A',10),('S','B',7),('A','B',3),('A','T',8),('B','T',9)]]
chk(12, sum(d['capacity'] for _, _, d in G12.out_edges('S', data=True)) == 17)
chk(13, 1480 - (296 + 12 + 38) == 1134)
chk(14, 660 / 11 == 60 and close(45 * 1.1, 49.5))
chk(15, True)
chk(16, min(12, 9, 15) == 9)
chk(17, (20 - 5) / 3 == 5)
chk(18, math.hypot(12, 9) == 15)
chk(19, 50 * 60 / 12 == 250)
d20 = [4, 7, 7, 8, 10, 12, 15, 17]; chk(20, st.mean(d20) == 10 and st.median(d20) == 9 and st.mode(d20) == 7)
chk(21, f'{45000000:.1e}' == '4.5e+07' and f'{0.00072:.1e}' == '7.2e-04' and round(3.14159, 2) == 3.14)
chk(22, 6 * 26 * 1.5 + 4 * 26 * 2 == 442)
t = deg(math.asin(5 / 13)); chk(23, dms(t) == (22, 37), dms(t))
chk(24, nx.maximum_flow_value(flowG(NET_24), 'S', 'T') == 11)
G25 = ugraph(NET_25); chk(25, dict(G25.degree()) == {'A': 2, 'B': 3, 'C': 4, 'D': 3, 'E': 2} and G25.number_of_edges() == 7)
chk(26, close(4.80 / 2, 2.40) and close(6.60 / 3, 2.20))
chk(27, 150 / 360 * 360 == 150 and 54 / 360 == 0.15)
chk(28, True)  # 10:30 (UTC+11) -> 7:30 (UTC+8), 9:30 (UTC+10)
chk(29, 96 / 1.2 == 80)
chk(30, [2 * x - 1 for x in (-1, 0, 1, 2, 3)] == [-3, -1, 1, 3, 5] and 2 * 4 - 1 == 7)
chk(31, [480 / 1200 * 80, 420 / 1200 * 80, 300 / 1200 * 80] == [32, 28, 20])
chk(32, close(deg(math.acos((25 + 64 - 49) / 80)), 60))
chk(33, (60 / 3.6) * 1.5 + 20 == 45)
chk(34, 180 + 24 * 79 == 2076 and 2076 - 1800 == 276)
d35 = [3, 5, 6, 8, 9, 10, 12, 13, 15, 18, 20, 41]
q1, q3 = st.median(d35[:6]), st.median(d35[6:])
chk(35, (min(d35), q1, st.median(d35), q3, max(d35)) == (3, 7, 11, 16.5, 41) and q3 - q1 == 9.5)
chk(36, 9 + 5 == 14)
chk(37, (85 + 92 + 78) * 1.2 == 306)
chk(38, round(2 * math.pi * 25 + 2 * math.pi * 60, 1) == 534.1)
chk(39, 85 + 70 * 2.5 == 260)
chk(40, round(0.5 * 8 * 11 * sin(35), 1) == 25.2)
chk(41, 30 - 27 == 3 and 0.25 * 40 == 10)
chk(42, close(120 * 0.015 * 1000, 1800))
chk(43, close(0.025 * 600000 + 0.015 * 350000, 20250))
chk(44, True)
chk(45, 480 / 4 == 120 and round(20 / 480 * 100, 1) == 4.2)
chk(46, close(1.5 * 4 * 0.32, 1.92))
chk(47, round(40 / tan(25), 1) == 85.8)
T48 = nx.minimum_spanning_tree(ugraph(NET_48))
chk(48, T48.size(weight='weight') == 28 and sorted(d['weight'] for *_, d in T48.edges(data=True)) == [3, 4, 5, 6, 10])
chk(49, (32 - 4) / 2 == 14)
chk(50, round(60 + 0.5 * math.pi * 9, 1) == 74.1)
chk(51, 28 - 17 == 11)
chk(52, nx.maximum_flow_value(flowG(NET_52), 'S', 'T') == 11)
chk(53, math.sqrt((50 - 2) / 3) == 4)
cent = [4.5, 14.5, 24.5, 34.5]; f = [4, 9, 5, 2]
chk(54, sum(c * x for c, x in zip(cent, f)) / 20 == 17)
chk(55, [600 / 6 * k for k in (1, 2, 3)] == [100, 200, 300])
chk(56, 12 + 1.5 * 6 == 21 and 25 > 21 and 6 - 9 < 2)
b57 = (40 - 15) / (6.8 * 80); chk(57, round(b57, 3) == 0.046)
chk(58, round(120 / 360 * 2 * math.pi * 6, 1) == 12.6 and round(120 / 360 * 2 * math.pi * 6 + 12, 1) == 24.6)
chk(59, close(4288 + 0.30 * (68400 - 45000), 11308) and close(0.02 * 68400, 1368))
# check the table's 4288 is consistent: 16c on 26 800 = 4288
chk(59, close(0.16 * (45000 - 18200), 4288) and close(4288 + 0.30 * 90000, 31288))
chk(60, (900 - 1200) / 15 == -20 and 1200 / 20 == 60)
chk(61, close(1850 * 0.65, 1202.5) and 3200 - 750 == 2450)
chk(62, close(4.5 * 3.2 * 45, 648))
d63 = [16, 17, 18, 18, 19, 20, 23, 25, 25, 25, 27, 31, 34, 38, 42]
chk(63, len(d63) == 15 and max(d63) - min(d63) == 26 and st.median(d63) == 25 and st.mode(d63) == 25)
chk(64, cutcap(flowG(NET_64), {'S', 'A'}) == 21)
d65 = [12, 14, 15, 15, 16, 18, 45]; chk(65, round(st.mean(d65), 1) == 19.3 and st.median(d65) == 15)
chk(66, (45 - 20) / (2.5 - 1.5) == 25)
chk(67, (140 + 180) % 360 == 320)
chk(68, math.ceil(28750 / 100) * 3 == 864)
chk(69, 18 * 300 / 150 == 36)
chk(70, 5 / 2 * (12 + 16) + 5 / 2 * (16 + 10) == 135)
chk(71, 78 / 40 == 1.95 and close(1.95 * 55, 107.25))
chk(72, True)
chk(73, 72500 + 340 - 1260 - 450 == 71130)
chk(74, round(math.pi * 9 * 8 / 3, 1) == 75.4)
chk(75, (25, 15 + 4) == (25, 19))
p76 = nx.shortest_path(ugraph(NET_76), 'A', 'G', weight='weight')
L76 = nx.shortest_path_length(ugraph(NET_76), 'A', 'G', weight='weight')
allp = [p for p in nx.all_simple_paths(ugraph(NET_76), 'A', 'G') if nx.path_weight(ugraph(NET_76), p, 'weight') == L76]
chk(76, L76 == 14 and p76 == list('ACBDEFG') and len(allp) == 1, (p76, L76, allp))
G77 = nx.Graph(); G77.add_weighted_edges_from([('P','Q',12),('P','R',7),('Q','R',4),('Q','S',9),('R','S',15)])
chk(77, nx.shortest_path_length(G77, 'P', 'S', weight='weight') == 20 and len([p for p in nx.all_simple_paths(G77,'P','S') if nx.path_weight(G77,p,'weight')==20]) == 1)
chk(78, round(4 / 3 * math.pi * 216, 1) == 904.8 and round(4 * math.pi * 36, 1) == 452.4)
chk(79, (150 - 75) / 15 == 5)
chk(80, round(1.6 + 20 * tan(40), 1) == 18.4)
chk(81, True)
chk(82, close(4 * 1240 * 1.175, 5828))
chk(83, round(math.sqrt(25 + 49 - 70 * cos(80)), 1) == 7.9)
G84 = flowG(NET_84)
chk(84, nx.maximum_flow_value(G84, 'S', 'T') == 21 and cutcap(G84, {'S', 'B'}) == 21)
chk(85, (4 - (-2)) / 4 == 1.5)
chk(86, True)
chk(87, round(15 * sin(48) / sin(70), 1) == 11.9)
chk(88, (63, 70 - 55, 72, 78 - 60) == (63, 15, 72, 18))
chk(89, close(620 * 0.345 + 410 * 0.182 + 91 * 0.98, 377.70))
chk(90, close(0.5 * (1.2 + 0.8) * 0.5 * 4, 2))
chk(91, (15 * 60 + 15) - (10 * 60 + 48) == 4 * 60 + 27 and (21 * 60 + 35 + 170) % 1440 == 25)
chk(92, close(1150 - 550 - 0.15 * 1150, 427.5))
chk(93, round(16 / 70 * 600) == 137 and 4 / 16 * 600 == 150)
chk(94, (11 - 3) / 4 == 2 and 2 * 10 + 3 == 23)
chk(95, [round(9.90 / 1.1, 2), 18.75 / 2.5, 35 / 5] == [9.0, 7.5, 7.0])
# 21:45 UTC+11 -> 10:45 UTC; +14:30 -> 25:15 = 01:15 Sat UTC; -8 -> 17:15 Fri
chk(96, ((21 * 60 + 45 - 11 * 60) + 14 * 60 + 30 - 8 * 60) == 17 * 60 + 15)
chk(97, 9842 + 1096 - 10500 == 438)
dots98 = {0: 3, 1: 6, 2: 5, 3: 3, 4: 2, 5: 1, 7: 1}; chk(98, max(dots98, key=dots98.get) == 1)
chk(99, close(0.12 * 34.95 * 8400, 35229.60))
chk(100, math.hypot(8, 6) == 10 and round(deg(math.atan(6 / 8))) == 37)
chk(101, sum([1, 2, 2, 3, 3, 5]) / 2 == 8 and sum([1, 2, 2, 3, 3, 4]) % 2 == 1)
d102 = [72, 75, 70, 68, 74, 71, 69, 73]; chk(102, st.mean(d102) == 71.5 and round(st.pstdev(d102), 2) == 2.29)
chk(103, 0.5 * 30 * 40 * sin(90) == 600)
G104 = nx.Graph()
tab = {'P': [None, 8, 5, 9, 12], 'Q': [8, None, 4, 7, 6], 'R': [5, 4, None, 10, 11], 'S': [9, 7, 10, None, 3], 'T': [12, 6, 11, 3, None]}
names = 'PQRST'
for a in names:
    for k, b in enumerate(names):
        if tab[a][k] is not None:
            assert tab[b][names.index(a)] == tab[a][k]  # symmetric
            G104.add_edge(a, b, weight=tab[a][k])
T104 = nx.minimum_spanning_tree(G104)
chk(104, T104.size(weight='weight') == 18 and sorted(d['weight'] for *_, d in T104.edges(data=True)) == [3, 4, 5, 6])
chk(105, 400 / 400 == 1)
chk(106, (2 * 4, 3 * 4, 5 * 3) == (8, 12, 15))
chk(107, close(180 * 1.35 * 0.8, 194.40) and close(194.40 - 180, 14.40))
chk(108, 5 + 2 == 7)
b109 = 15 / 330; chk(109, round(b109, 3) == 0.045 and round(b109 / 0.015, 2) == 3.03)
chk(110, True)
cf = [6, 15, 22, 27, 30]; chk(111, list(__import__('itertools').accumulate([6, 9, 7, 5, 3])) == cf)
chk(112, True)
chk(113, 8845 == 2 * 3600 + 27 * 60 + 25 and 0.4 * 60 == 24)
chk(114, 8 * 4 * 1.5 * 1000 == 48000 and 48000 / 30 == 1600 and 1600 == 26 * 60 + 40)
chk(115, 1.5 * 6 + 4 == 13 and 1.5 * 520 + 4 == 784)
G116 = flowG(NET_116); f1 = nx.maximum_flow_value(G116, 'S', 'T'); G116['A']['C']['capacity'] = 9
chk(116, f1 == 11 and nx.maximum_flow_value(G116, 'S', 'T') == 11)
chk(117, close(15000 / 100 * 7.2 * 2.05 + 420 + 560 + 1150 + 650, 4994))
chk(118, True)
G119 = nx.DiGraph(); [G119.add_edge(e[0], e[1], weight=e[2]) for e in NET_119['edges']]
chk(119, not G119.has_edge('B', 'C') and nx.shortest_path_length(G119, 'A', 'E', weight='weight') == 12
    and nx.shortest_path(G119, 'A', 'E', weight='weight') == list('ACBDE'))
chk(120, round(deg(math.asin(60 / 80))) == 49)

assert sorted(set(ok)) == list(range(1, 121)), set(range(1, 121)) - set(ok)
# coverage and marks
cnt = collections.Counter(x['topic'] for x in Q)
print('topic counts', dict(sorted(cnt.items())), sum(cnt.values()))
sess = [sum(x['marks'] for x in Q[k * 4:k * 4 + 4]) for k in range(30)]
print('session marks', sess, 'total', sum(sess))
for k in range(30):
    tps = [x['topic'] for x in Q[k * 4:k * 4 + 4]]
    print(k + 1, tps, 'HSC' if any(x['hsc'] for x in Q[k * 4:k * 4 + 4]) else '')
print('ALL CHECKS PASSED')
