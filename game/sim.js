// Balance simulation: a greedy "always buy the best value" bot, no tapping.
const fs = require('fs');
const vm = require('vm'); const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/econ.js', 'utf8') + '\n' + (process.argv[2]||'') + '\nthis.X={STATIONS,HALL,FR,MAX_LVL,NUM_POINTS,tasksFor,moveBonus,freshPoint,freshMeta,makeEcon,scale};', ctx);
const {STATIONS, HALL, FR, MAX_LVL, NUM_POINTS, tasksFor, moveBonus, freshPoint, freshMeta, makeEcon} = ctx.X;

const G = {meta:freshMeta(), pt:null};
let T = 0; const E = makeEcon(G, () => 0);
G.pt = freshPoint(G.meta);

function actions(){
  const out = [], pt = G.pt, ts = tasksFor(G.meta.point);
  const need = (pred) => ts.some((t, i) => !pt.done[i] && pred(t));
  const base = E.income();
  const trial = (apply, undo) => { apply(); const v = E.income(); undo(); return v - base; };
  STATIONS.forEach((s, i) => {
    const st = pt.st[i];
    if (!st.lvl){
      const c = E.unlockCost(i);
      const d = trial(() => { st.lvl = 1; }, () => { st.lvl = 0; });
      out.push({c, d, bonus: need(t => t.k === 'unlock' && t.st === i) ? 4 : 1, run: () => { st.lvl = 1; }});
      return;
    }
    if (st.lvl < MAX_LVL){
      const c = E.lvlCost(i, 1);
      const d = trial(() => st.lvl++, () => st.lvl--);
      out.push({c, d, bonus: need(t => t.k === 'lvl' && t.st === i && st.lvl < t.n) ? 3 : 1, run: () => st.lvl++});
    }
  });
  if (pt.mkt < HALL.mkt.max){
    const c = E.hallCost('mkt'); const d = trial(() => pt.mkt++, () => pt.mkt--);
    out.push({c, d, bonus: need(t => t.k === 'mkt' && pt.mkt < t.n) ? 3 : 1, run: () => pt.mkt++});
  }
  return out;
}

function spendStars(){
  const order = ['recipe','radio','capital','recipe','fridge'];
  let bought = true;
  while (bought){
    bought = false;
    for (const k of order){
      const f = FR[k], l = G.meta.fr[k];
      if (l < f.max && G.meta.stars >= f.cost(l)){ G.meta.stars -= f.cost(l); G.meta.fr[k]++; bought = true; break; }
    }
  }
}

const fmtT = s => s < 3600 ? (s/60).toFixed(0) + ' мин' : (s/3600).toFixed(1) + ' ч';
let total = 0;
for (let p = 0; p < NUM_POINTS; p++){
  G.meta.point = p; spendStars(); G.pt = freshPoint(G.meta);
  let t = 0; const marks = [];
  const ts = tasksFor(p);
  while (!E.allDone() && t < 3600*200){
    // manual cooking proxy for station 0 before first hire: 1 sale per 2.5s
    E.earn(E.income()); G.pt.served += E.demand();
    const before = G.pt.done.slice();
    E.checkTasks();
    G.pt.done.forEach((d, i) => { if (d && !before[i]) marks.push(`${i}@${fmtT(t)}`); });
    // buy loop
    for (let guard = 0; guard < 50; guard++){
      const acts = actions().filter(a => a.c > 0);
      if (!acts.length) break;
      acts.forEach(a => a.v = (Math.max(a.d, 1e-12)/a.c)*a.bonus);
      acts.sort((a, b) => b.v - a.v);
      const best = acts[0];
      if (G.pt.coins >= best.c){ G.pt.coins -= best.c; best.run(); continue; }
      // buy a cheap affordable action if it's within 60% of best value
      const alt = acts.find(a => G.pt.coins >= a.c && a.v >= best.v*0.6);
      if (alt){ G.pt.coins -= alt.c; alt.run(); continue; }
      break;
    }
    t += 1;
  }
  G.meta.stars += moveBonus(p); G.meta.starsEver += moveBonus(p);
  total += t;
  console.log(`Точка ${p+1}: ${fmtT(t)} (итого ${fmtT(total)}), звёзд всего ${G.meta.starsEver}, fr=${JSON.stringify(G.meta.fr)}`);
  console.log('   задания:', marks.join('  '));
  console.log('   уровни:', G.pt.st.map(s => s.lvl).join(' '), 'mkt', G.pt.mkt);
}
