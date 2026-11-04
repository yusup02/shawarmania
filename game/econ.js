// ===== economy (shared by the game and the balance simulation) =====
// Every customer buys one of each item on the menu. Income = customers per second × sum of item prices.
const STATIONS = [
  {profit:1,    unlock:0,     lvl:4},
  {profit:7,    unlock:250,   lvl:40},
  {profit:45,   unlock:5000,  lvl:350},
  {profit:300,  unlock:1e5,   lvl:2800},
  {profit:2000, unlock:2e6,   lvl:22000},
];
const LVL_R = 1.12, MAX_LVL = 200;
const PROFIT_MS = [10,25,50,75,100,125,150,175,200];
const HALL = {
  mkt:   {max:40, cost:l => 25*Math.pow(1.6, l)},
  hands: {max:8,  cost:l => 20*Math.pow(3, l)},
  neon:  {max:5,  cost:l => 3000*Math.pow(6, l)},
};
const FR = {
  recipe:  {max:30, cost:l => 2 + l},
  radio:   {max:15, cost:l => 3 + l},
  vip:     {max:10, cost:l => 3 + l},
  fridge:  {max:4,  cost:l => [3,6,10,15][l]},
  capital: {max:6,  cost:l => 4 + 2*l},
};
const FRIDGE_H = [2,4,8,12,24];
const CAPITAL = [0, 300, 3000, 3e4, 3e5, 3e6, 3e7];
const POINT_SCALE = 40;
const NUM_POINTS = 8;
var COST_K = 4, TASK_LG = 0.6, TASK_E0 = 8e8, TASK_EG = 7, TASK_C0 = 300, TASK_LCAP = 150;

const scale = p => Math.pow(POINT_SCALE, p);
// collectible chefs: card fragments raise their level; each boosts one menu slot (or customers)
const CHEFS = [
  {id:'zina', st:0}, {id:'timur', st:1}, {id:'leyla', st:2}, {id:'marko', st:3}, {id:'ashot', st:4}, {id:'bot', st:-1},
];
const CHEF_STEPS = [10, 25, 50, 100, 200];
const chefLvl = f => CHEF_STEPS.filter(s => (f || 0) >= s).length;
const VIP_TIME = 15;
function tasksFor(p){
  const g = p, L = a => Math.min(TASK_LCAP, Math.round(a*(1 + TASK_LG*g)));
  return [
    {k:'lvl', st:0, n:L(10), r:1},
    {k:'unlock', st:1, r:1},
    {k:'served', n:Math.round(TASK_C0*(1 + g)), r:1},
    {k:'mkt', n:L(5), r:1},
    {k:'unlock', st:2, r:1},
    {k:'lvl', st:1, n:L(25), r:2},
    {k:'unlock', st:3, r:2},
    {k:'served', n:Math.round(TASK_C0*10*(1 + g)), r:2},
    {k:'mkt', n:Math.min(HALL.mkt.max, L(15)), r:2},
    {k:'unlock', st:4, r:3},
    {k:'lvl', st:0, n:L(50), r:3},
    {k:'lvl', st:4, n:L(10), r:3},
    {k:'earn', n:TASK_E0*scale(p)*Math.pow(TASK_EG, g), r:5},
  ];
}
const moveBonus = p => 5 + 2*p;

function freshPoint(meta){
  const p = meta.point;
  return {coins:CAPITAL[meta.fr.capital]*scale(p), earned:0, st:STATIONS.map((s, i) => ({lvl:i === 0 ? 1 : 0})),
    mkt:0, hands:0, neon:0, done:tasksFor(p).map(() => false), served:0};
}
function freshMeta(){ return {point:0, stars:0, starsEver:0, fr:{recipe:0,radio:0,vip:0,fridge:0,capital:0}, boostUntil:0, chefs:{}, gift:{last:'', streak:0}, daily:null}; }

function makeEcon(G, nowFn){
  const S = () => scale(G.meta.point);
  const boost = () => nowFn() < G.meta.boostUntil ? 2 : 1;
  const cnt = (arr, l) => arr.filter(m => l >= m).length;
  const E = {
    S,
    profitMult: l => Math.pow(2, cnt(PROFIT_MS, l)),
    starMult: () => 1 + 0.2*G.meta.fr.recipe,
    chefLvl: id => chefLvl((G.meta.chefs || {})[id]),
    chefMult(i){ const c = CHEFS.find(c => c.st === i); return 1 + 0.2*E.chefLvl(c.id); },
    profit(i, withBoost = true, lvl){ const l = lvl ?? G.pt.st[i].lvl; return l ? STATIONS[i].profit*l*E.profitMult(l)*S()*E.starMult()*E.chefMult(i)*(withBoost ? boost() : 1) : 0; },
    // what one customer pays for the whole menu
    check(withBoost = true){ let x = 0; for (let i = 0; i < STATIONS.length; i++) x += E.profit(i, withBoost); return x; },
    demand(mkt){ mkt = mkt ?? G.pt.mkt; return 0.3*(1 + 0.3*mkt)*(1 + 0.15*G.meta.fr.radio)*(1 + 0.04*E.chefLvl('bot')); },
    income(withBoost = true){ return E.demand()*E.check(withBoost); },
    vipInterval: (lvl = G.pt.neon) => 50*Math.pow(0.85, lvl),
    vipMult: () => 10 + 5*G.meta.fr.vip,
    lvlCost(i, k = 1){ const L = G.pt.st[i].lvl; return COST_K*STATIONS[i].lvl*S()*Math.pow(LVL_R, L - 1)*(Math.pow(LVL_R, k) - 1)/(LVL_R - 1); },
    lvlMaxK(i){ const L = G.pt.st[i].lvl, c0 = COST_K*STATIONS[i].lvl*S()*Math.pow(LVL_R, L - 1);
      return Math.min(MAX_LVL - L, Math.max(0, Math.floor(Math.log(G.pt.coins*(LVL_R - 1)/c0 + 1)/Math.log(LVL_R)))); },
    unlockCost: i => COST_K*STATIONS[i].unlock*S(),
    hallCost: k => COST_K*HALL[k].cost(G.pt[k])*S(),
    taskProgress(t){
      const pt = G.pt;
      switch (t.k){
        case 'lvl': return [pt.st[t.st].lvl, t.n];
        case 'unlock': return [pt.st[t.st].lvl ? 1 : 0, 1];
        case 'served': return [pt.served, t.n];
        case 'mkt': return [pt.mkt, t.n];
        case 'earn': return [pt.earned, t.n];
      }
    },
    checkTasks(){
      const ts = tasksFor(G.meta.point); let got = 0;
      ts.forEach((t, i) => { if (!G.pt.done[i]){ const [a, b] = E.taskProgress(t); if (a >= b){ G.pt.done[i] = true; got += t.r; } } });
      if (got){ G.meta.stars += got; G.meta.starsEver += got; }
      return got;
    },
    allDone: () => G.pt.done.every(Boolean),
    earn(v){ if (!isFinite(v) || v <= 0) return; G.pt.coins += v; G.pt.earned += v; },
  };
  return E;
}
