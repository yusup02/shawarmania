// ===== game =====
const SAVE_KEY = 'shawarma-tycoon-v2', STEPS = 4;
const POINTS = [
  {name:'Ларёк у метро',      desc:'Толпы на выходе из метро',       a:'#d63f2a', b:'#fff4ea', panel:'#b23322',
   menu:[['Классическая','#8a4a22'],['Картошка фри'],['Айран'],['С сыром','#f2c94c'],['Двойное мясо','#6b3416']]},
  {name:'Фудтрак в парке',    desc:'Гуляющие семьи и спортсмены',    a:'#e58a1f', b:'#fff6e6', panel:'#b8650f',
   menu:[['Классическая','#8a4a22'],['Наггетсы'],['Лимонад'],['Острая','#d63f2a'],['Шаурма-бургер','#a0522d']]},
  {name:'Точка на фудкорте',  desc:'Голодные покупатели торгового центра', a:'#2c78b5', b:'#f2f8ff', panel:'#215d8d',
   menu:[['Классическая','#8a4a22'],['Фри с сыром'],['Молочный коктейль'],['Сырная двойная','#f2c94c'],['Шаурма XL','#8a4a22']]},
  {name:'Вокзал',             desc:'Пассажиры спешат на поезд',      a:'#5b6b7a', b:'#f1f4f7', panel:'#45525e',
   menu:[['Классическая','#8a4a22'],['Самса'],['Чай в дорогу'],['С картошкой внутри','#e8b64a'],['Шаурма в дорогу','#8a4a22']]},
  {name:'Ночной рынок',       desc:'Огни, музыка и очереди до утра', a:'#7a4fb3', b:'#f8f2ff', panel:'#5a3889',
   menu:[['Классическая','#8a4a22'],['Кукуруза'],['Морс'],['Фалафель-гриль','#7a8f3a'],['Огненная','#d63f2a']]},
  {name:'Кафе на набережной', desc:'Туристы и вид на воду',          a:'#2b9585', b:'#effaf8', panel:'#1f7266',
   menu:[['Классическая','#8a4a22'],['Креветки в кляре'],['Мохито без алкоголя'],['С лососем','#f08a6c'],['Королевская','#b0452e']]},
  {name:'Стадион',            desc:'Болельщики перед матчем',        a:'#2f8a4a', b:'#f1faf2', panel:'#22683a',
   menu:[['Классическая','#8a4a22'],['Хот-дог'],['Газировка'],['Двойная острая','#c4473a'],['Чемпионская','#8a4a22']]},
  {name:'Аэропорт',           desc:'Путешественники со всего мира',  a:'#2b211b', b:'#f5b52e', panel:'#2b211b',
   menu:[['Классическая','#8a4a22'],['Сэндвич'],['Кофе'],['Премиум','#6b3416'],['Золотая шаурма','#e9bb45']]},
];
POINTS.forEach((p, i) => {
  Object.defineProperty(p, 'name', {get:() => ptxt(i)[0]});
  Object.defineProperty(p, 'desc', {get:() => ptxt(i)[1]});
});
const ST_KIND = ['wrap','side','drink','wrap','wrap'];
const FR_INFO = {
  recipe:  {name:() => T('recipe_name'),  desc:() => T('recipe_desc'),  fx:l => T('recipe_fx', {v:l*20}), nx:l => `→ +${(l+1)*20}%`},
  radio:   {name:() => T('radio_name'),   desc:() => T('radio_desc'),   fx:l => T('radio_fx', {v:l*15}), nx:l => `→ +${(l+1)*15}%`},
  vip:     {name:() => T('vip_name'),     desc:() => T('vip_desc'),     fx:l => T('vip_fx', {v:10 + 5*l}), nx:l => `→ ×${15 + 5*l}`},
  fridge:  {name:() => T('fridge_name'),  desc:() => T('fridge_desc'),  fx:l => T('fridge_fx', {v:FRIDGE_H[l]}), nx:l => T('fridge_nx', {v:FRIDGE_H[l+1]})},
  capital: {name:() => T('capital_name'), desc:() => T('capital_desc'), fx:l => l ? T('capital_fx', {v:fmt(CAPITAL[l])}) : T('capital_zero'), nx:l => `→ ${fmt(CAPITAL[l+1])}`},
};
const HALL_INFO = {
  mkt:   {name:() => T('mkt_name'),   desc:() => T('mkt_desc'),   icon:'mkt'},
  hands: {name:() => T('hands_name'), desc:() => T('hands_desc'), icon:'knife'},
  neon:  {name:() => T('neon_name'),  desc:() => T('neon_desc'),  icon:'neon'},
};

// ---------- state ----------
const G = {meta:freshMeta(), pt:null, last:Date.now()};
G.pt = freshPoint(G.meta);
const now = () => Date.now();
const E = makeEcon(G, now);
let tab = 'kitchen', buyMode = 1, armed = '';
const P = () => POINTS[G.meta.point];
const itemName = i => ptxt(G.meta.point)[2][i];
const itemFill = i => P().menu[i][1] || '#8a4a22';

function fmt(n){
  if (!isFinite(n)) return '∞';
  const nf = NF(), d = nf.dec;
  const loc = x => x.replace('.', d);
  const trim = x => x.includes(d) ? x.replace(/0+$/,'').replace(new RegExp('\\' + d + '$'), '') : x;
  if (n < 1000) return n < 10 ? trim(loc(n.toFixed(n < 1 ? 2 : 1))) : String(Math.floor(n));
  const u = nf.units;
  let i = -1; while (n >= 1000 && i < u.length - 1){ n /= 1000; i++; }
  return trim(loc(n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : String(Math.floor(n)))) + u[i];
}
const fr2 = n => String(Math.round(n*100)/100).replace('.', NF().dec);
function dur(sec){
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec/3600), m = Math.floor(sec%3600/60), s = sec%60;
  if (h) return T('dur_h', {h, m});
  if (sec >= 600) return T('dur_m', {m});
  return `${m}:${String(s).padStart(2,'0')}`;
}
function save(){ G.last = now(); try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch(e) {} }
// Brings any saved or hot-reloaded state up to the current format and repairs broken numbers.
function normalize(src){
  const num = (v, d = 0) => (typeof v === 'number' && isFinite(v)) ? v : d;
  const m = Object.assign(freshMeta(), src.meta || {});
  m.fr = Object.assign(freshMeta().fr, (src.meta && src.meta.fr) || {});
  for (const k of Object.keys(freshMeta().fr)) m.fr[k] = Math.max(0, Math.min(FR[k].max, Math.floor(num(m.fr[k]))));
  m.point = Math.max(0, Math.min(NUM_POINTS - 1, Math.floor(num(m.point))));
  m.stars = num(m.stars); m.starsEver = num(m.starsEver); m.boostUntil = num(m.boostUntil);
  const ch = (src.meta && src.meta.chefs) || {}; m.chefs = {}; for (const c of CHEFS) m.chefs[c.id] = Math.max(0, Math.floor(num(ch[c.id])));
  const gf = (src.meta && src.meta.gift) || {}; m.gift = {last:typeof gf.last === 'string' ? gf.last : '', streak:Math.max(0, Math.min(7, Math.floor(num(gf.streak))))};
  const dl = src.meta && src.meta.daily;
  m.daily = dl && typeof dl.date === 'string' && Array.isArray(dl.q) && dl.q.every(q => q && QUESTS[q.k]) ? {date:dl.date, chest:!!dl.chest, q:dl.q.map(q => ({k:q.k, n:Math.max(1, num(q.n, 1)), p:num(q.p), claimed:!!q.claimed}))} : null;
  const base = freshPoint(m), p = src.pt || {};
  const pt = Object.assign(base, p);
  pt.coins = num(p.coins); pt.earned = num(p.earned, pt.coins); pt.served = num(p.served);
  for (const k of ['mkt','hands','neon']) pt[k] = Math.max(0, Math.min(HALL[k].max, Math.floor(num(p[k]))));
  pt.st = STATIONS.map((s, i) => ({lvl:Math.max(i === 0 ? 1 : 0, Math.min(MAX_LVL, Math.floor(num(p.st && p.st[i] && p.st[i].lvl, i === 0 ? 1 : 0))))}));
  const n = tasksFor(m.point).length;
  pt.done = Array.from({length:n}, (_, i) => !!(p.done && p.done[i]));
  return {meta:m, pt, last:num(src.last, now())};
}
function apply(src){ const x = normalize(src); G.meta = x.meta; G.pt = x.pt; G.last = x.last; }
function load(){
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (s && s.meta && s.pt) apply(s); } catch(e) {}
}
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch(e) {} };

// ---------- icons ----------
const bg = c => `<rect x="1" y="1" width="46" height="46" rx="12" fill="${c}" opacity=".16"/>`;
const wrapIcon = (fill, gold) => `<svg viewBox="0 0 48 48">${bg(fill)}<path d="M15 17h18l-3 26a3 3 0 0 1-3 2h-6a3 3 0 0 1-3-2z" fill="${gold?'#e9bb45':'#cfd6dc'}" stroke="${gold?'#b9861a':'#96a0a9'}" stroke-width="1.5"/><ellipse cx="24" cy="16" rx="10" ry="5" fill="#efd6a2"/><ellipse cx="24" cy="15" rx="7" ry="3.2" fill="${fill}"/><circle cx="20" cy="14" r="1.6" fill="#4a9b4f"/><circle cx="27" cy="13.5" r="1.4" fill="#e05a3c"/><path d="M19 16l2-1 2 1 2-1 2 1 2-1" stroke="#fff" stroke-width="1.3" fill="none"/></svg>`;
const sideIcon = `<svg viewBox="0 0 48 48">${bg('#e0863a')}<g fill="#f2c14e" stroke="#c98a10" stroke-width="1"><rect x="15" y="8" width="4" height="18" rx="1.5" transform="rotate(-8 17 17)"/><rect x="21" y="6" width="4" height="20" rx="1.5"/><rect x="27" y="8" width="4" height="18" rx="1.5" transform="rotate(8 29 17)"/></g><path d="M12 20h24l-3 22H15z" fill="#d63f2a"/><path d="M18 30c2 3 10 3 12 0" stroke="#fff" stroke-width="2" fill="none"/></svg>`;
const drinkIcon = `<svg viewBox="0 0 48 48">${bg('#2c78b5')}<path d="M14 14h20l-3 29H17z" fill="#f4f8fb" stroke="#2c78b5" stroke-width="2"/><path d="M15.5 24h17l-1.6 17H17.1z" fill="#9fd2ea"/><path d="M27 14l4-9" stroke="#d63f2a" stroke-width="2.4" stroke-linecap="round"/><rect x="12" y="11" width="24" height="4" rx="2" fill="#2c78b5"/></svg>`;
const ICONS = {
  knife:`<svg viewBox="0 0 48 48">${bg('#6f5b4e')}<path d="M9 33L34 9c3 3 3 8 0 11L18 36z" fill="#d9dfe4" stroke="#8d969e" stroke-width="1.5"/><rect x="5" y="32" width="15" height="7" rx="3" transform="rotate(-45 12 35)" fill="#6b3416"/></svg>`,
  neon:`<svg viewBox="0 0 48 48">${bg('#c4486d')}<rect x="7" y="14" width="34" height="20" rx="5" fill="#2b1e18"/><path d="M14 28l4-8 4 8M26 20v8h6" stroke="#ff7aa8" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  mkt:`<svg viewBox="0 0 48 48">${bg('#d63f2a')}<path d="M10 20v8l6 1 14 8V11L16 19z" fill="#d63f2a"/><rect x="8" y="19" width="8" height="10" rx="2" fill="#2b1e18"/><path d="M34 18c3 2 3 10 0 12M37 14c6 4 6 16 0 20" stroke="#d63f2a" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`,
  recipe:`<svg viewBox="0 0 48 48">${bg('#c98a10')}<rect x="11" y="8" width="26" height="33" rx="3" fill="#fffaf0" stroke="#c98a10" stroke-width="2"/><path d="M16 17h16M16 23h16M16 29h10" stroke="#c98a10" stroke-width="2" stroke-linecap="round"/><circle cx="33" cy="36" r="7" fill="#f5b52e" stroke="#c98a10" stroke-width="1.5"/></svg>`,
  radio:`<svg viewBox="0 0 48 48">${bg('#7a55b5')}<circle cx="17" cy="20" r="6" fill="#7a55b5"/><circle cx="31" cy="20" r="6" fill="#b49ad9"/><path d="M7 40c0-7 4-11 10-11s10 4 10 11zM21 40c0-7 4-11 10-11s10 4 10 11z" fill="#7a55b5" opacity=".85"/></svg>`,
  vip:`<svg viewBox="0 0 48 48">${bg('#c98a10')}<path d="M9 34l-2-18 10 8 7-12 7 12 10-8-2 18z" fill="#f5b52e" stroke="#c98a10" stroke-width="2" stroke-linejoin="round"/><rect x="9" y="35" width="30" height="5" rx="2" fill="#c98a10"/></svg>`,
  fridge:`<svg viewBox="0 0 48 48">${bg('#2c78b5')}<rect x="13" y="6" width="22" height="37" rx="4" fill="#eef4f8" stroke="#2c78b5" stroke-width="2"/><path d="M13 19h22" stroke="#2c78b5" stroke-width="2"/><path d="M17 11v4M17 23v7" stroke="#2c78b5" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  capital:`<svg viewBox="0 0 48 48">${bg('#2f8a4a')}<ellipse cx="24" cy="34" rx="13" ry="5" fill="#c98a10"/><ellipse cx="24" cy="30" rx="13" ry="5" fill="#f5b52e" stroke="#c98a10"/><ellipse cx="24" cy="23" rx="13" ry="5" fill="#f5b52e" stroke="#c98a10"/><ellipse cx="24" cy="16" rx="13" ry="5" fill="#ffd66b" stroke="#c98a10"/></svg>`,
};
const stIcon = i => ST_KIND[i] === 'side' ? sideIcon : ST_KIND[i] === 'drink' ? drinkIcon : wrapIcon(itemFill(i), i === 4);
const lockIcon = `<svg viewBox="0 0 48 48">${bg('#6f5b4e')}<rect x="14" y="21" width="20" height="16" rx="3" fill="#6f5b4e"/><path d="M18 21v-4a6 6 0 0 1 12 0v4" stroke="#6f5b4e" stroke-width="3" fill="none"/></svg>`;
const STAR = '<span class="star" aria-hidden="true"></span>';
const COIN = '<span class="coin" aria-hidden="true"></span>';

// ---------- UI helpers ----------
const $ = id => document.getElementById(id);
const listEl = $('list');
let updaters = [];
function el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
function buyBtn(id, cur = 'coin'){ return `<button class="buy" id="${id}"><span class="bl"></span><span class="bc">${cur === 'star' ? STAR : COIN}<b></b></span></button>`; }
function setBtn(b, label, cost, can, curFmt = fmt){ b.querySelector('.bl').textContent = label; b.querySelector('b').textContent = curFmt(cost); b.disabled = !can; }
function pay(cost){ if (G.pt.coins < cost) return false; G.pt.coins -= cost; return true; }
function after(){ buzz(12); SFX.buy(); const got = E.checkTasks(); if (got) taskToast(got); save(); renderList(); refresh(); }

function renderList(){
  listEl.textContent = ''; updaters = [];
  ({kitchen:renderKitchen, hall:renderHall, tasks:renderTasks, fr:renderFranchise, chefs:renderChefs})[tab]();
  refresh();
}

function renderKitchen(){
  const seg = el(`<div class="seg"><span>${T('k_mode')}</span>${[1,10,'max'].map(m => `<button id="mode-${m}" data-mode="${m}" aria-pressed="${buyMode===m}">${m==='max'?T('k_max'):'×'+m}</button>`).join('')}</div>`);
  seg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; buyMode = b.dataset.mode === 'max' ? 'max' : +b.dataset.mode; renderList(); });
  listEl.append(seg);
  const sum = el(`<p class="note left"></p>`); listEl.append(sum);
  updaters.push(() => { sum.textContent = T('k_summary', {check:fmt(E.check()), pm:perMin(E.demand())}); });
  const firstLocked = G.pt.st.findIndex(s => !s.lvl);
  STATIONS.forEach((S0, i) => {
    const st = G.pt.st[i];
    if (!st.lvl){
      if (i !== firstLocked){
        if (i === firstLocked + 1) listEl.append(el(`<div class="card locked"><div class="ico">${lockIcon}</div><div class="info"><div class="t">${T('k_new')}</div><div class="s">${T('k_afterPrev')}</div></div></div>`));
        return;
      }
      const c = el(`<div class="card"><div class="ico">${stIcon(i)}</div><div class="info"><div class="t">${itemName(i)}</div><div class="s">${T('k_newDesc')}</div><div class="m"></div></div>${buyBtn('unlock-' + i)}</div>`);
      const b = c.querySelector('.buy');
      b.addEventListener('click', () => { if (pay(E.unlockCost(i))){ st.lvl = 1; celebrate(T('k_inMenu', {item:itemName(i)})); after(); } });
      updaters.push(() => { c.querySelector('.m').textContent = T('k_priceEach', {v:fmt(E.profit(i, true, 1))}); setBtn(b, T('k_open'), E.unlockCost(i), G.pt.coins >= E.unlockCost(i)); });
      listEl.append(c); return;
    }
    const c = el(`<div class="card"><div class="ico">${stIcon(i)}</div>
      <div class="info"><div class="t"></div><div class="m"></div><div class="s"></div><div class="bar"><i></i></div></div>${buyBtn('lvl-' + i)}</div>`);
    const lvlB = c.querySelector('.buy');
    const k = () => buyMode === 'max' ? Math.max(1, E.lvlMaxK(i)) : Math.min(buyMode, MAX_LVL - st.lvl);
    lvlB.addEventListener('click', () => { if (st.lvl >= MAX_LVL) return; const kk = k(); if (pay(E.lvlCost(i, kk))){ const before = E.profitMult(st.lvl); st.lvl += kk; work[i] = 1; daily('upgrades', kk); after(); if (E.profitMult(st.lvl) > before){ celebrate(T('k_priceUp', {item:itemName(i), m:E.profitMult(st.lvl)/before})); SFX.star(); } } });
    updaters.push(() => {
      c.querySelector('.t').textContent = T('k_lvl', {name:itemName(i), l:st.lvl});
      const nx = PROFIT_MS.find(m => st.lvl < m);
      c.querySelector('.m').textContent = T('k_price', {v:fmt(E.profit(i))}) + (nx ? T('k_x2', {l:nx}) : '');
      c.querySelector('.s').textContent = T('k_brings', {v:fmt(E.profit(i)*E.demand())});
      const prev = [0, ...PROFIT_MS].filter(m => m <= st.lvl).pop();
      c.querySelector('.bar i').style.width = (nx ? Math.round((st.lvl - prev)/(nx - prev)*100) : 100) + '%';
      if (st.lvl >= MAX_LVL){ lvlB.disabled = true; lvlB.querySelector('.bl').textContent = T('max'); lvlB.querySelector('b').textContent = '—'; }
      else { const kk = k(); setBtn(lvlB, T('upgX', {k:kk}), E.lvlCost(i, kk), G.pt.coins >= E.lvlCost(i, kk)); }
    });
    listEl.append(c);
  });
}

function renderHall(){
  listEl.append(el(`<p class="note left">${T('h_note')}</p>`));
  Object.keys(HALL).forEach(key => {
    const H0 = HALL[key], info = HALL_INFO[key];
    const c = el(`<div class="card"><div class="ico">${ICONS[info.icon]}</div><div class="info"><div class="t"></div><div class="s">${info.desc()}</div><div class="m"></div></div>${buyBtn('hall-' + key)}</div>`);
    const b = c.querySelector('.buy');
    b.addEventListener('click', () => { if (G.pt[key] >= H0.max) return; if (pay(E.hallCost(key))){ G.pt[key]++; after(); } });
    updaters.push(() => {
      const l = G.pt[key];
      c.querySelector('.t').textContent = l ? T('k_lvl', {name:info.name(), l}) : info.name();
      let m = '';
      if (key === 'mkt') m = T('h_perMin', {v:perMin(E.demand())}) + (l < H0.max ? ` → ${perMin(E.demand(l + 1))}` : '');
      if (key === 'hands') m = T('h_steps', {n:1 + l}) + (l < H0.max ? ` → ${2 + l}` : '');
      if (key === 'neon') m = T('h_vip', {s:Math.round(E.vipInterval(l))}) + (l < H0.max ? ` → ${Math.round(E.vipInterval(l + 1))}` : '');
      c.querySelector('.m').textContent = m;
      if (l >= H0.max){ b.disabled = true; b.querySelector('.bl').textContent = T('max'); b.querySelector('b').textContent = '—'; }
      else setBtn(b, T('upg'), E.hallCost(key), G.pt.coins >= E.hallCost(key));
    });
    listEl.append(c);
  });
}

function taskText(t){
  switch (t.k){
    case 'lvl': return T('task_lvl', {item:itemName(t.st), n:t.n});
    case 'unlock': return T('task_unlock', {item:itemName(t.st)});
    case 'served': return T('task_served', {n:t.n});
    case 'mkt': return T('task_mkt', {n:t.n});
    case 'earn': return T('task_earn', {v:fmt(t.n)});
  }
}
function renderTasks(){
  renderDaily();
  const p = G.meta.point, ts = tasksFor(p), last = p >= NUM_POINTS - 1;
  listEl.append(el(`<div class="pointhead"><b>${T('t_pointOf', {n:p + 1, total:NUM_POINTS})}</b><span>${P().name}</span></div>`));
  const mv = el(`<div class="move"><div class="mt"></div><div class="ms"></div><div class="mrow"></div></div>`);
  listEl.append(mv);
  const drawMove = () => {
    const done = E.allDone(), next = POINTS[p + 1];
    mv.classList.toggle('ready', done);
    if (last && done){ mv.querySelector('.mt').textContent = T('t_empire'); mv.querySelector('.ms').textContent = T('t_empireSub'); mv.querySelector('.mrow').innerHTML = ''; return; }
    mv.querySelector('.mt').textContent = T('t_next', {name:next.name});
    mv.querySelector('.ms').innerHTML = done
      ? T('t_moveReady', {n:moveBonus(p)}).replace('★', STAR)
      : T('t_moveNot', {n:moveBonus(p)}).replace('★', STAR);
    const row = mv.querySelector('.mrow');
    if (armed === 'move' && done) row.innerHTML = `<button class="pbtn go" id="moveYes">${T('t_moveYes')}</button><button class="pbtn ghost" id="moveNo">${T('t_moveNo')}</button>`;
    else row.innerHTML = `<button class="pbtn go" id="moveAsk" ${done ? '' : 'disabled'}>${T('t_move')}</button>`;
  };
  mv.addEventListener('click', e => {
    if (e.target.id === 'moveAsk'){ armed = 'move'; drawMove(); }
    if (e.target.id === 'moveNo'){ armed = ''; drawMove(); }
    if (e.target.id === 'moveYes'){ armed = ''; movePoint(); }
  });
  drawMove();
  let shownDone = E.allDone();
  updaters.push(() => { if (E.allDone() !== shownDone){ shownDone = E.allDone(); drawMove(); } });
  ts.forEach((t, i) => {
    const c = el(`<div class="card task"><div class="tick" aria-hidden="true"></div><div class="info"><div class="t">${taskText(t)}</div><div class="m"></div><div class="bar"><i></i></div></div><span class="reward">+${t.r} ${STAR}</span></div>`);
    updaters.push(() => {
      const d = G.pt.done[i], [a, b] = E.taskProgress(t);
      c.classList.toggle('done', d);
      c.querySelector('.m').textContent = d ? T('t_done') : t.k === 'unlock' ? T('t_notInMenu') : t.k === 'earn' ? T('t_of', {a:fmt(a), b:fmt(b)}) : T('t_of', {a:Math.floor(a), b});
      c.querySelector('.bar i').style.width = Math.min(100, a/b*100) + '%';
    });
    listEl.append(c);
  });
  listEl.append(el(`<div class="map">${POINTS.map((q, i) => `<span class="${i < p ? 'past' : i === p ? 'cur' : ''}" title="${q.name}">${i + 1}</span>`).join('')}</div>`));
}

function renderFranchise(){
  listEl.append(el(`<div class="pointhead"><b>${STAR} <span id="frStars"></span></b><span>${T('fr_head')}</span></div>`));
  updaters.push(() => { $('frStars').textContent = T('fr_stars', {n:G.meta.stars}); });
  Object.keys(FR).forEach(key => {
    const F = FR[key], info = FR_INFO[key];
    const c = el(`<div class="card"><div class="ico">${ICONS[key]}</div><div class="info"><div class="t"></div><div class="s">${info.desc()}</div><div class="m"></div></div>${buyBtn('fr-' + key, 'star')}</div>`);
    const b = c.querySelector('.buy');
    b.addEventListener('click', () => {
      const l = G.meta.fr[key]; if (l >= F.max || G.meta.stars < F.cost(l)) return;
      G.meta.stars -= F.cost(l); G.meta.fr[key]++; after();
    });
    updaters.push(() => {
      const l = G.meta.fr[key];
      c.querySelector('.t').textContent = l ? T('k_lvl', {name:info.name(), l}) : info.name();
      c.querySelector('.m').textContent = info.fx(l) + (l < F.max ? ' ' + info.nx(l) : '');
      if (l >= F.max){ b.disabled = true; b.querySelector('.bl').textContent = T('max'); b.querySelector('b').textContent = '—'; }
      else setBtn(b, T('upg'), F.cost(l), G.meta.stars >= F.cost(l), String);
    });
    listEl.append(c);
  });
  const r = el(`<div class="reset"></div>`);
  const drawR = () => { r.innerHTML = armed === 'reset'
    ? `<span>${T('reset_confirm')}</span><button class="danger" id="resetYes">${T('reset_yes')}</button><button id="resetNo">${T('reset_no')}</button>`
    : `<button id="resetAsk">${T('reset_ask')}</button>`; };
  r.addEventListener('click', e => {
    if (e.target.id === 'resetAsk'){ armed = 'reset'; drawR(); }
    if (e.target.id === 'resetNo'){ armed = ''; drawR(); }
    if (e.target.id === 'resetYes'){ armed = ''; if (order){ order = null; orderEl().hidden = true; } G.meta = freshMeta(); G.pt = freshPoint(G.meta); save(); initCustomers(); tab = 'kitchen'; syncTabs(); renderList(); }
  });
  drawR(); listEl.append(r);
  const lb = el(`<div class="reset"><button id="langOpen">${T('lang_btn')}: ${(LANGS.find(l => l[0] === LANG) || LANGS[1])[1]}</button></div>`);
  lb.querySelector('button').addEventListener('click', openLang); listEl.append(lb);
  listEl.append(el(`<p class="note">${T('proto')}</p>`));
}

function movePoint(){
  const p = G.meta.point; if (!E.allDone() || p >= NUM_POINTS - 1) return;
  G.meta.stars += moveBonus(p); G.meta.starsEver += moveBonus(p);
  if (order){ order = null; orderEl().hidden = true; }
  G.meta.point = p + 1; G.pt = freshPoint(G.meta);
  save(); initCustomers(); tab = 'kitchen'; syncTabs(); renderList(); SFX.big();
  modal(`<h2>${P().name}</h2><p>${T('mv_body', {desc:P().desc})}</p>
    <div class="big">+${moveBonus(p)} ${STAR}</div><p>${T('mv_tip')}</p>
    <div class="row"><button class="pbtn go" id="mvOk">${T('mv_ok')}</button></div>`, pn => pn.querySelector('#mvOk').addEventListener('click', closeModal));
}
function taskToast(got){ celebrate(T('toast_task', {n:got})); SFX.star(); }

// ---------- HUD ----------
const hud = {coins:$('coins'), rate:$('rate'), loc:$('locName'), boost:$('boost'), hint:$('hint'), adBtn:$('adBtn'), adTitle:$('adTitle'), adSub:$('adSub'), tasks:$('tasksChip')};
function tabDeal(t){
  const c = G.pt.coins;
  if (t === 'kitchen') return G.pt.st.some((s, i) => !s.lvl && G.pt.st.findIndex(x => !x.lvl) === i && c >= E.unlockCost(i));
  if (t === 'hall') return G.pt.mkt < HALL.mkt.max && c >= E.hallCost('mkt');
  if (t === 'tasks') return (E.allDone() && G.meta.point < NUM_POINTS - 1) || dailyClaimable();
  if (t === 'chefs') return false;
  return Object.keys(FR).some(k => G.meta.fr[k] < FR[k].max && G.meta.stars >= FR[k].cost(G.meta.fr[k]));
}
function refresh(){
  for (const u of updaters) u();
  document.querySelectorAll('.tab').forEach(b => { b.querySelector('.dot').hidden = b.dataset.tab === tab || !tabDeal(b.dataset.tab); });
  hud.loc.textContent = T('hud_point', {n:G.meta.point + 1, name:P().name});
  const done = G.pt.done.filter(Boolean).length, all = G.pt.done.length;
  hud.tasks.querySelector('b').textContent = `${done}/${all}`;
  hud.tasks.classList.toggle('ready', E.allDone());
  $('giftBtn').classList.toggle('ready', !giftState().claimed);
  const left = (G.meta.boostUntil - now())/1000;
  hud.boost.hidden = left <= 0;
  if (left > 0) hud.boost.textContent = `×2 · ${dur(left)}`;
  hud.adBtn.disabled = left > 480;
  hud.adTitle.textContent = left > 0 ? T('ad_extend') : T('ad_title');
  hud.adSub.textContent = left > 480 ? T('ad_later') : T('ad_sub');
  let h = '';
  if (G.meta.point === 0 && handMade < 2 && G.pt.served < 15) h = T('hint_tap');
  else if (G.meta.point === 0 && G.pt.st[0].lvl < 3 && G.pt.coins >= E.lvlCost(0)) h = T('hint_upgrade', {item:itemName(0)});
  hud.hint.hidden = !h; if (h) hud.hint.textContent = h;
}
function syncTabs(){ document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x.dataset.tab === tab)); }
document.querySelector('.tabs').addEventListener('click', e => {
  const b = e.target.closest('.tab'); if (!b) return;
  tab = b.dataset.tab; armed = ''; syncTabs(); renderList(); listEl.scrollTop = 0;
});
hud.tasks.addEventListener('click', () => { tab = 'tasks'; armed = ''; syncTabs(); renderList(); listEl.scrollTop = 0; });

// ---------- modal & ad mock ----------
const overlay = $('overlay'), panel = $('panel');
function modal(html, bind){ panel.innerHTML = html; overlay.hidden = false; bind && bind(panel); }
const closeModal = () => { overlay.hidden = true; panel.innerHTML = ''; };
function watchAd(onReward){
  modal(`<div class="adtag">${T('ad_tag')}</div>
    <div class="adscreen"><b>${T('ad_screen')}</b><span>${T('ad_screenSub')}</span></div>
    <div class="adbar"><i id="adFill"></i></div>
    <button class="pbtn go" id="adDone" disabled>${T('ad_wait', {n:3})}</button>`, pn => {
    const fill = pn.querySelector('#adFill'), btn = pn.querySelector('#adDone'), t0 = performance.now();
    const tick = () => {
      if (overlay.hidden) return;
      const k = Math.min(1, (performance.now() - t0)/3000);
      fill.style.width = (k*100) + '%';
      if (k < 1){ btn.textContent = T('ad_wait', {n:Math.ceil(3 - k*3)}); requestAnimationFrame(tick); }
      else { btn.disabled = false; btn.textContent = T('ad_claim'); }
    };
    tick();
    btn.addEventListener('click', () => { closeModal(); daily('ads'); onReward(); });
  });
}
hud.adBtn.addEventListener('click', () => watchAd(() => {
  G.meta.boostUntil = Math.max(now(), G.meta.boostUntil) + 120000; save(); celebrate(T('ad_rush')); refresh();
}));
function offlineReward(sec){
  const capH = FRIDGE_H[G.meta.fr.fridge], eff = Math.min(sec, capH*3600);
  const amount = E.income(false)*eff;
  if (sec < 60 || amount <= 0) return;
  modal(`<h2>${T('off_title')}</h2>
    <p>${T('off_body', {t:dur(eff)})}${sec > eff ? T('off_fridge', {h:capH}) : ''}.</p>
    <div class="big">${COIN}${fmt(amount)}</div>
    <div class="row">${ADS ? `<button class="pbtn ad" id="offAd">${T('off_x2')}</button>` : ''}<button class="pbtn go" id="offTake">${T('off_take')}</button></div>`, pn => {
    pn.querySelector('#offTake').addEventListener('click', () => { E.earn(amount); closeModal(); after(); celebrate(`+${fmt(amount)}`); });
    if (ADS) pn.querySelector('#offAd').addEventListener('click', () => watchAd(() => { E.earn(amount*2); after(); celebrate(`+${fmt(amount*2)}`); }));
  });
}

// ---------- scene ----------
const cv = $('scene'), ctx = cv.getContext('2d');
let W = 360, H = 300, dpr = 1;
const M = {};
let customers = [], flies = [], texts = [], parts = [];
let t = 0, pop = 0, autoT = 0, autoPending = 0, step = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TAU = Math.PI*2;
const SHIRTS = ['#3d7cc9','#e0863a','#5aa36a','#c4486d','#7a5bb5','#2b9585','#d9a72b'];
const SKINS = ['#f3cfa9','#e3b48b','#c98e63','#9b6a45','#f6dcc2'];
const HAIRS = ['#2b1e18','#6b3d1f','#c58a3c','#1d1d1d','#8a8f96','#a8452e'];
const pick = a => a[Math.floor(Math.random()*a.length)];
const perMin = d => { const v = d*60; return v < 100 ? fr2(Math.round(v*10)/10) : fmt(v); };
let handMade = 0, arriveAcc = 0, kitchenCd = 0;
// test-only speed-up (remove before release)
const SPEEDS = [1, 2, 5, 10, 50];
let speed = 1; try { speed = SPEEDS.includes(+localStorage.getItem('shawarma-speed')) ? +localStorage.getItem('shawarma-speed') : 1; } catch(e) {}
if (!DEV){ speed = 1; $('speedBtn').hidden = true; }
function drawSpeed(){ const b = $('speedBtn'); b.textContent = T('speed', {v:speed}); b.classList.toggle('on', speed > 1); }
$('speedBtn').addEventListener('click', () => {
  speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
  try { localStorage.setItem('shawarma-speed', speed); } catch(e) {}
  drawSpeed();
});
drawSpeed();
const VIS_MAX = 2;

function spawn(forceVip = false){
  const q = customers.filter(c => c.state === 'queue');
  const lastX = q.length ? q[q.length - 1].x : W;
  const vip = forceVip;
  const d = E.demand(), group = Math.max(1, d/Math.min(d, VIS_MAX));
  customers.push({x:Math.max(W + M.bw, lastX + M.spacing), sink:0, alpha:1, state:'queue', reserved:false, happy:0, hasWrap:false, wait:0, group: vip ? 1 : group,
    seed:Math.random()*TAU, vip, shirt:vip ? '#2b211b' : pick(SHIRTS), skin:pick(SKINS), hair:pick(HAIRS), cap:Math.random() < 0.3, capC:pick(SHIRTS)});
}
function initCustomers(){ customers = []; flies = []; for (let i = 0; i < 2; i++){ spawn(); customers[i].x = M.frontX + i*M.spacing; } }
const nextFront = () => customers.find(c => c.state === 'queue' && !c.reserved);
const atWindow = c => c.state === 'queue' && Math.abs(c.x - c.tx) < 6 && c.tx < M.frontX + M.spacing*3;
function serve(c, from, value, color, big, label = ''){
  c.reserved = true;
  flies.push({x0:from.x, y0:from.y, c, p:0, value, color, big, label});
}
function addText(x, y, text, color = '#2b1e18', big = false){ texts.push({x, y, text, color, life:1, big}); }
function burst(x, y, n = 6){ for (let i = 0; i < n; i++) parts.push({x, y, vx:(Math.random() - 0.5)*160, vy:-80 - Math.random()*120, r:3 + Math.random()*2, life:1, kind:'coin'}); }
function celebrate(msg){ addText(W/2, H*0.42, msg, '#d63f2a', true); burst(W/2, H*0.45, 14); }
// a coin flies from the scene into the wallet in the header
let lastCoinFx = 0;
function flyCoin(x, y){
  if (reduced) return;
  const nowT = performance.now(); if (nowT - lastCoinFx < 140) return; lastCoinFx = nowT;
  const r = cv.getBoundingClientRect(), tgt = document.querySelector('.wallet .coin').getBoundingClientRect();
  const sx = r.left + x, sy = r.top + y, dx = tgt.left + tgt.width/2 - sx, dy = tgt.top + tgt.height/2 - sy;
  const el = document.createElement('span'); el.className = 'coin flycoin'; el.style.left = sx + 'px'; el.style.top = sy + 'px';
  document.body.append(el);
  const a = el.animate([
    {transform:'translate(-50%,-50%) scale(1)'},
    {transform:`translate(calc(-50% + ${dx*0.3}px), calc(-50% + ${dy*0.3 - 30}px)) scale(1.25)`, offset:0.35},
    {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.7)`}
  ], {duration:620, easing:'cubic-bezier(.45,0,.75,1)'});
  a.onfinish = () => { el.remove(); const w = document.querySelector('.wallet .amt'); w.classList.remove('bump'); void w.offsetWidth; w.classList.add('bump'); };
}
// sound toggle
const SOUND_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const SOUND_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function drawSound(){ const b = $('soundBtn'); b.innerHTML = SFX.on ? SOUND_ON : SOUND_OFF; b.setAttribute('aria-label', SFX.on ? T('sound_off') : T('sound_on')); b.classList.toggle('off', !SFX.on); }
$('soundBtn').addEventListener('click', () => { SFX.toggle(); drawSound(); });
drawSound();
const MUSIC_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3" fill="currentColor"/><circle cx="17.5" cy="15.5" r="3" fill="currentColor"/></svg>';
const MUSIC_OFF_SVG = MUSIC_SVG.replace('</svg>', '<path d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>');
function drawMusic(){ const b = $('musicBtn'); b.innerHTML = SFX.musicOn ? MUSIC_SVG : MUSIC_OFF_SVG; b.setAttribute('aria-label', SFX.musicOn ? T('music_off') : T('music_on')); b.classList.toggle('off', !SFX.musicOn); }
$('musicBtn').addEventListener('click', () => { SFX.toggleMusic(); drawMusic(); });
drawMusic();
document.addEventListener('pointerdown', () => SFX.unlock(), {passive:true});
// ---------- language ----------
function applyStatic(){
  document.documentElement.lang = LANG; document.title = T('title');
  document.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = T(e.dataset.i18n); });
  cv.setAttribute('aria-label', T('canvasAria'));
  $('giftBtn').setAttribute('aria-label', T('gift_aria'));
  $('langBtn').setAttribute('aria-label', T('lang_btn'));
  document.querySelectorAll('.ingr button').forEach(b => { const sp = b.querySelector('span'); if (sp) sp.textContent = ingrName(b.dataset.id); });
  drawSound(); drawMusic(); drawSpeed();
}
function openLang(){
  modal(`<h2>${T('lang_title')}</h2><div class="langs">${LANGS.map(([c, n]) => `<button data-lang="${c}" id="lang-${c}" aria-pressed="${c === LANG}">${n}</button>`).join('')}</div>
    <div class="row"><button class="pbtn ghost" id="langClose">${T('close')}</button></div>`, pn => {
    pn.querySelector('#langClose').addEventListener('click', closeModal);
    pn.querySelector('.langs').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      setLang(b.dataset.lang); closeModal(); applyStatic(); renderList(); refresh(); buzz(10);
    });
  });
}
$('langBtn').addEventListener('click', openLang);

function cook(){
  step += 1 + G.pt.hands; pop = 1; buzz(8); work[0] = 1; SFX.chop();
  const s = M.spit;
  for (let i = 0; i < 3; i++) parts.push({x:s.cx + s.tw*0.45, y:s.yt + (s.yb - s.yt)*(0.3 + Math.random()*0.5), vx:60 + Math.random()*90, vy:-40 - Math.random()*60, r:2 + Math.random()*1.5, life:0.7, kind:'meat'});
  let n = 0; while (step >= STEPS){ step -= STEPS; n++; }
  if (!n) return;
  handMade += n; daily('hand', n);
  const f = customers.find(c => c.state === 'queue' && !c.reserved && !c.vip);
  if (f){
    // hand-made order: the customer pays for the full menu, plus a tip for the shawarma
    const value = E.check()*f.group + E.profit(0)*n;
    serve(f, {x:M.lav.x, y:M.lav.y}, value, '#2f8a4a', false);
  } else {
    const v = E.profit(0)*n; E.earn(v); addText(M.lav.x, M.lav.y - 24, T('takeaway', {v:fmt(v)}), '#2f8a4a');
  }
}
cv.addEventListener('pointerdown', e => { e.preventDefault(); if (overlay.hidden) cook(); });
cv.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); cook(); } });

function update(dt){
  t += dt; pop = Math.max(0, pop - dt*5); updateScene(dt);
  const edt = dt*speed; // game time (test speed-up); animations stay in real time
  // customers arrive as often as demand says; at high demand they come in groups
  const d = E.demand(), vis = Math.min(d, VIS_MAX);
  arriveAcc += vis*edt;
  let queued = customers.filter(c => c.state === 'queue').length;
  while (arriveAcc >= 1){
    arriveAcc -= 1;
    if (queued < 6){ spawn(); queued++; }
    else { E.earn(E.check()*d/vis); G.pt.served += d/vis; daily('served', d/vis); }
  }
  kitchenCd -= edt;
  if (kitchenCd <= 0){
    const f = customers.find(c => !c.reserved && !c.vip && atWindow(c));
    if (f){ kitchenCd = 0.55; pulseKitchen(); serve(f, {x:M.spit.cx + M.spit.tw*0.5, y:M.counterY - 6}, E.check()*f.group, '#2b1e18', false); }
  }
  updateOrders(dt, edt);
  for (const f of flies){
    f.p += dt/0.35;
    if (f.p >= 1 && !f.done){
      f.done = true; const c = f.c;
      c.state = 'leaving'; c.hasWrap = true; c.happy = 1;
      E.earn(f.value); G.pt.served += c.group; daily('served', c.group);
      addText(c.x, M.counterY - M.bw*2.6, `${f.label}+${fmt(f.value)}`, f.color, f.big); burst(c.x, M.counterY - M.bw*1.6, f.big ? 14 : 5);
      flyCoin(c.x, M.counterY - M.bw*1.6); SFX.coin(); if (f.big) SFX.star();
    }
  }
  flies = flies.filter(f => !f.done);
  let qi = 0;
  for (const c of customers){
    if (c.state === 'queue'){ c.tx = M.frontX + qi*M.spacing; qi++; c.x += (c.tx - c.x)*Math.min(1, dt*5); }
    else { c.sink += dt*M.bw*2.4; c.x += dt*M.bw*0.8; c.alpha -= dt*1.4; }
  }
  customers = customers.filter(c => c.alpha > 0);
  for (const x of texts){ x.life -= dt*(x.big ? 0.7 : 1); x.y -= dt*(x.big ? 26 : 42); }
  texts = texts.filter(x => x.life > 0);
  for (const p of parts){ p.vy += 420*dt; p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt*(p.kind === 'meat' ? 1.6 : 1.1); }
  parts = parts.filter(p => p.life > 0);
}

// ---------- loop ----------
let lastT = performance.now(), uiT = 0, saveT = 0;
function frame(nowT){
  const dt = Math.min(0.1, (nowT - lastT)/1000); lastT = nowT;
  update(dt); draw();
  hud.coins.textContent = fmt(G.pt.coins);
  uiT += dt; saveT += dt;
  if (uiT > 0.2){
    uiT = 0;
    hud.rate.innerHTML = `${T('hud_rate', {v:fmt(E.income())})} · ${STAR}${G.meta.stars}`;
    const got = E.checkTasks(); if (got){ taskToast(got); if (tab === 'tasks') renderList(); }
    refresh();
  }
  if (saveT > 5){ saveT = 0; save(); }
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) save();
  else { const away = (now() - G.last)/1000; lastT = performance.now(); if (away > 60 && overlay.hidden) offlineReward(away); }
});
addEventListener('pagehide', save);
new ResizeObserver(() => resize()).observe(cv);

function start(data){
  if (!ADS){ $('adBtn').hidden = true; document.body.classList.add('no-ads'); }
  const hot = data && data.G;
  if (hot) apply(data.G); else load();
  resize(); initLive(); applyStatic(); initCustomers(); syncTabs(); renderList();
  if (!hot){ offlineReward((now() - G.last)/1000); if (overlay.hidden && !giftState().claimed) setTimeout(() => { if (overlay.hidden) openGift(); }, 900); }
  save(); requestAnimationFrame(frame);
}
try { window.claude?.hot?.snapshot?.(() => ({G})); } catch(e) {}
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
