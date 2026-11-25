from math import *
from itertools import combinations
from nets import NETS
r=radians
def maxflow(edges,s="S",t="T"):
    from collections import defaultdict,deque
    cap=defaultdict(int); adj=defaultdict(set)
    for u,v,c in edges: cap[(u,v)]+=c; adj[u].add(v); adj[v].add(u)
    f=0
    while True:
        par={s:None}; q=deque([s])
        while q:
            u=q.popleft()
            for v in adj[u]:
                if v not in par and cap[(u,v)]>0: par[v]=u; q.append(v)
        if t not in par: return f
        v=t; b=1e9
        while par[v] is not None: b=min(b,cap[(par[v],v)]); v=par[v]
        v=t
        while par[v] is not None: cap[(par[v],v)]-=b; cap[(v,par[v])]+=b; v=par[v]
        f+=b
def mincut(edges):
    nodes=sorted({u for u,_,_ in edges}|{v for _,v,_ in edges}-{"S","T"})
    best=None
    for k in range(len(nodes)+1):
        for c in combinations(nodes,k):
            side={"S",*c}; cap=sum(w for u,v,w in edges if u in side and v not in side)
            if best is None or cap<best[0]: best=(cap,sorted(side))
    return best
for k,(pos,e) in NETS.items(): print("net",k,"maxflow",maxflow(e),"mincut",mincut(e))
E=NETS["E"][1]; E2=[(u,v,6 if (u,v)==("A","T") else c) for u,v,c in E]; print("E with A->T 6:",maxflow(E2))
H=NETS["H"][1]; H2=[(u,v,15 if (u,v)==("S","B") else c) for u,v,c in H]; print("H with S->B 15:",maxflow(H2))
K=NETS["K"][1]; K2=[(u,v,9 if (u,v)==("A","C") else c) for u,v,c in K]; print("K with A->C 9:",maxflow(K2))
A=NETS["A"][1]; print("A cut {S,A}:",sum(w for u,v,w in A if u in{"S","A"} and v not in{"S","A"}))
G=NETS["G"][1]; print("G cut {S,A}:",sum(w for u,v,w in G if u in{"S","A"} and v not in{"S","A"}))
print("tableQ68",maxflow([("S","A",5),("S","B",8),("B","A",3),("A","T",6),("B","T",4)]))
def dm(x): d=int(x); m=round((x-d)*60); return f"{d+(m==60)}°{(m%60):02d}'"
P=print
P("3",12*sin(r(40)))
P("7a",dm(37.45),"7b",dm(degrees(atan(0.8))))
P("11",25*tan(r(32)))
P("14",2*pi*7,pi*49)
P("23",dm(degrees(asin(5/13))))
P("27",14*sin(r(50))/sin(r(70)))
P("30",72/360*pi*100)
P("31",sqrt(49+100-140*cos(r(60))))
P("33",60/3.6*1.5)
P("38",170*pi)
P("39",4.2*6.5,4.2*6.5*2.1)
P("40",.5*8*11*sin(r(35)))
P("43",degrees(atan(15/20)))
P("47",40/tan(r(25)))
P("50",60+.5*pi*9)
P("51",8/sin(r(35)))
P("54",pi*.64*1.5)
P("57",(40-15)/(6.8*80))
P("58",120/360*2*pi*6,120/360*2*pi*6+12)
P("63",9*sin(r(65))/12,dm(degrees(asin(9*sin(r(65))/12))))
P("71",.5*15*9*sin(r(120)))
P("74",pi*9*8/3)
P("78",4/3*pi*216,4*pi*36)
P("80",20*tan(r(40))+1.6)
P("83",25+49-70*cos(r(80)),sqrt(25+49-70*cos(r(80))))
P("87",15*sin(r(48))/sin(r(70)))
P("93",16/70*600,4/16*600)
P("100",degrees(atan(6/8)))
P("107",dm(degrees(asin(32/50))))
P("109",15/330,(15/330)/0.015)
P("118",5*pi+10)
P("120",degrees(asin(.75)))
