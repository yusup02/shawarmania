// ===== live features: VIP orders, daily gift & quests, chef collection =====
// (only declarations at top level; DOM wiring happens in initLive)
const IS = (inner, c) => `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="${c}" opacity=".16"/>${inner}</svg>`;
const INGR = [
  {id:'meat',           svg:IS('<path d="M7 13c3-5 15-6 18 0s-2 10-9 10S4 18 7 13z" fill="#8a4a22"/><path d="M10 14c3-2 9-2 12 0" stroke="#c98545" stroke-width="2" fill="none" stroke-linecap="round"/>', '#8a4a22')},
  {id:'cucumber',     svg:IS('<circle cx="16" cy="16" r="9" fill="#4a9b4f"/><circle cx="16" cy="16" r="6.5" fill="#bfe3a3"/><g fill="#7fb56a"><circle cx="16" cy="13" r="1"/><circle cx="13.5" cy="17" r="1"/><circle cx="18.5" cy="17" r="1"/></g>', '#4a9b4f')},
  {id:'tomato',     svg:IS('<circle cx="16" cy="17" r="9" fill="#e05a3c"/><path d="M12 9l4 3 4-3-1 4h-6z" fill="#4a9b4f"/><circle cx="13" cy="15" r="1.6" fill="#ffb3a0"/>', '#e05a3c')},
  {id:'cheese',          svg:IS('<path d="M6 21l18-11v11z" fill="#f2c94c"/><path d="M6 21l18-11" stroke="#d9a72b" stroke-width="1.5"/><g fill="#d9a72b"><circle cx="17" cy="17" r="1.6"/><circle cx="21" cy="19" r="1.1"/><circle cx="13" cy="19.5" r="1"/></g>', '#f2c94c')},
  {id:'onion',           svg:IS('<circle cx="16" cy="16" r="9" fill="none" stroke="#9b5fb5" stroke-width="2.5"/><circle cx="16" cy="16" r="5" fill="none" stroke="#c99ad9" stroke-width="2.5"/>', '#9b5fb5')},
  {id:'chili',        svg:IS('<path d="M9 22c4 1 12-2 14-10 1-3-2-3-3-1-2 5-6 8-11 9z" fill="#d63f2a"/><path d="M20 10c0-2 1-3 3-3" stroke="#4a9b4f" stroke-width="2" fill="none" stroke-linecap="round"/>', '#d63f2a')},
  {id:'garlic',    svg:IS('<path d="M16 6c4 6 7 9 7 13a7 7 0 0 1-14 0c0-4 3-7 7-13z" fill="#fffdf6" stroke="#cbbca4" stroke-width="1.5"/>', '#cbbca4')},
  {id:'fries',      svg:IS('<g fill="#f2c14e" stroke="#c98a10" stroke-width=".8"><rect x="10" y="6" width="3" height="14" rx="1"/><rect x="14.5" y="5" width="3" height="15" rx="1"/><rect x="19" y="6" width="3" height="14" rx="1"/></g><path d="M8 14h16l-2 12H10z" fill="#d63f2a"/>', '#f2c14e')},
];
const ingrName = id => T('ing_' + id);
const face = (skin, extra, eyes = '<circle cx="24" cy="30" r="2" fill="#2b1e18"/><circle cx="36" cy="30" r="2" fill="#2b1e18"/>', mouth = '<path d="M25 38c3 3 7 3 10 0" stroke="#2b1e18" stroke-width="2" fill="none" stroke-linecap="round"/>') =>
  `<circle cx="30" cy="32" r="16" fill="${skin}"/>${eyes}${mouth}${extra}`;
const AVATARS = {
  zina: face('#f3cfa9', '<path d="M12 30c0-14 8-20 18-20s18 6 18 20c-3-6-8-10-18-10S15 24 12 30z" fill="#d63f2a"/><g fill="#fff"><circle cx="20" cy="18" r="1.6"/><circle cx="30" cy="14" r="1.6"/><circle cx="40" cy="18" r="1.6"/></g><circle cx="24" cy="30" r="5" fill="none" stroke="#6f5b4e" stroke-width="1.6"/><circle cx="36" cy="30" r="5" fill="none" stroke="#6f5b4e" stroke-width="1.6"/><path d="M29 30h2" stroke="#6f5b4e" stroke-width="1.6"/>'),
  timur: face('#e3b48b', '<path d="M13 26c0-10 8-15 17-15s17 5 17 15z" fill="#2c78b5"/><rect x="38" y="23" width="13" height="4" rx="2" fill="#2c78b5"/>'),
  leyla: face('#c98e63', '<path d="M12 36c-2-16 6-25 18-25s20 9 18 25c-2-9-6-15-18-15S14 27 12 36z" fill="#2b1e18"/><rect x="14" y="19" width="32" height="4" rx="2" fill="#2f8a4a"/><circle cx="14" cy="38" r="2" fill="#f5b52e"/><circle cx="46" cy="38" r="2" fill="#f5b52e"/>'),
  marko: face('#f3cfa9', '<rect x="17" y="12" width="26" height="6" rx="2" fill="#fff" stroke="#cbbca4"/><path d="M18 13c-4-9 6-11 8-6 2-5 10-4 9 1 6-3 9 4 6 6z" fill="#fff" stroke="#cbbca4"/><path d="M22 36c3-2 5-2 8 0 3-2 5-2 8 0" stroke="#2b1e18" stroke-width="3" fill="none" stroke-linecap="round"/>', undefined, ''),
  ashot: face('#d9a37a', '<path d="M19 24l8-2M33 22l8 2" stroke="#2b1e18" stroke-width="3" stroke-linecap="round"/><path d="M20 38c4-4 7-4 10-1 3-3 6-3 10 1-4 2-7 1-10-1-3 2-6 3-10 1z" fill="#2b1e18"/>', undefined, ''),
  bot: '<rect x="14" y="16" width="32" height="28" rx="7" fill="#9aa6b1"/><rect x="19" y="23" width="22" height="11" rx="5" fill="#2b1e18"/><circle cx="25" cy="28.5" r="3" fill="#6bd4ff"/><circle cx="35" cy="28.5" r="3" fill="#6bd4ff"/><path d="M30 16V9" stroke="#5d6d7c" stroke-width="2.5"/><circle cx="30" cy="8" r="3" fill="#d63f2a"/><rect x="24" y="38" width="12" height="2.5" rx="1" fill="#5d6d7c"/>',
};
const avatarSvg = (id, locked) => `<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" rx="14" fill="${locked ? '#cbbca4' : '#f6e7cd'}"/><g ${locked ? 'opacity=".25" style="filter:grayscale(1)"' : ''}>${AVATARS[id]}</g></svg>`;

// ---------- dates ----------
const dayKey = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const todayKey = () => dayKey(new Date());
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };

// ---------- chef cards ----------
function chefName(id){ return T('chef_' + id); }
const chefHint = id => T('chef_' + id + '_h');
function chefBonusText(c, lvl){
  const v = Math.max(1, lvl);
  return c.st >= 0 ? T('ch_bonusItem', {item:itemName(c.st), v:v*20}) : T('ch_bonusCust', {v:v*4});
}
function grantFrags(n){
  const got = {};
  for (let k = 0; k < n; k++){
    const pool = CHEFS.filter(c => (G.meta.chefs[c.id] || 0) < CHEF_STEPS[CHEF_STEPS.length - 1]);
    if (!pool.length) break;
    const c = pool[Math.floor(Math.random()*pool.length)];
    const before = chefLvl(G.meta.chefs[c.id]);
    G.meta.chefs[c.id] = (G.meta.chefs[c.id] || 0) + 1;
    got[c.id] = (got[c.id] || 0) + 1;
    const after = chefLvl(G.meta.chefs[c.id]);
    if (after > before){
      setTimeout(() => { celebrate(after === 1 ? T('ch_new', {name:chefName(c.id)}) : T('ch_up', {name:chefName(c.id), l:after})); SFX.big(); }, 700);
    }
  }
  return got;
}
const fragsText = got => Object.entries(got).map(([id, n]) => `${chefName(id)} +${n}`).join(', ');

// ---------- daily quests ----------
const QUESTS = {
  served:   {n:p => 150*(1 + p), text:n => T('q_served', {n})},
  vip:      {n:() => 3,  text:n => T('q_vip', {n})},
  upgrades: {n:() => 30, text:n => T('q_upgrades', {n})},
  hand:     {n:() => 40, text:n => T('q_hand', {n})},
  ads:      {n:() => 2,  text:n => T('q_ads', {n})},
};
function ensureDaily(){
  const d = todayKey();
  if (G.meta.daily && G.meta.daily.date === d && (ADS || !G.meta.daily.q.some(q => q.k === 'ads'))) return;
  const keys = Object.keys(QUESTS).filter(k => ADS || k !== 'ads');
  for (let i = keys.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i + 1)); [keys[i], keys[j]] = [keys[j], keys[i]]; }
  G.meta.daily = {date:d, q:keys.slice(0, 3).map(k => ({k, n:QUESTS[k].n(G.meta.point), p:0, claimed:false})), chest:false};
}
function daily(k, n = 1){
  ensureDaily();
  for (const q of G.meta.daily.q) if (q.k === k && !q.claimed) q.p = Math.min(q.n, q.p + n);
}
const dailyClaimable = () => { ensureDaily(); const dl = G.meta.daily; return dl.q.some(q => !q.claimed && q.p >= q.n) || (!dl.chest && dl.q.every(q => q.claimed)); };

function renderDaily(){
  ensureDaily();
  const dl = G.meta.daily;
  listEl.append(el(`<div class="pointhead"><b>${T('d_head')}</b><span>${T('d_sub')}</span></div>`));
  dl.q.forEach((q, i) => {
    const c = el(`<div class="card task"><div class="tick" aria-hidden="true"></div><div class="info"><div class="t">${QUESTS[q.k].text(q.n)}</div><div class="m"></div><div class="bar"><i></i></div></div><button class="buy small" id="dq-${i}"><span class="bl">${T('claim')}</span><span class="bc">+1 ${STAR}</span></button></div>`);
    const b = c.querySelector('.buy');
    b.addEventListener('click', () => {
      if (q.claimed || q.p < q.n) return;
      q.claimed = true; G.meta.stars += 1; G.meta.starsEver += 1;
      const got = grantFrags(2); celebrate('+1 ★'); SFX.star();
      addText(W/2, H*0.55, fragsText(got), '#2b1e18');
      save(); renderList();
    });
    updaters.push(() => {
      c.classList.toggle('done', q.claimed);
      c.querySelector('.m').textContent = q.claimed ? T('d_claimed') : T('d_prog', {a:Math.floor(q.p), b:q.n});
      c.querySelector('.bar i').style.width = Math.min(100, q.p/q.n*100) + '%';
      b.hidden = q.claimed; b.disabled = q.p < q.n;
    });
    listEl.append(c);
  });
  const chest = el(`<div class="card chest"><div class="ico">${CHEST_SVG}</div><div class="info"><div class="t">${T('chest_name')}</div><div class="s">${T('chest_desc').replace('★', STAR)}</div></div><button class="buy" id="dchest"><span class="bl">${T('chest_open')}</span><span class="bc">${STAR}<b>3</b></span></button></div>`);
  const cb = chest.querySelector('.buy');
  cb.addEventListener('click', () => {
    if (dl.chest || !dl.q.every(q => q.claimed)) return;
    dl.chest = true; G.meta.stars += 3; G.meta.starsEver += 3;
    const coins = Math.max(E.income(false)*900, 50*E.S()); E.earn(coins);
    const got = grantFrags(5); celebrate(T('chest_toast', {v:fmt(coins)})); SFX.big();
    addText(W/2, H*0.58, fragsText(got), '#2b1e18');
    save(); renderList();
  });
  updaters.push(() => { chest.classList.toggle('done', dl.chest); cb.hidden = dl.chest; cb.disabled = !dl.q.every(q => q.claimed); if (dl.chest) chest.querySelector('.s').textContent = T('chest_done'); });
  listEl.append(chest);
}
const CHEST_SVG = `<svg viewBox="0 0 48 48"><rect x="1" y="1" width="46" height="46" rx="12" fill="#c98a10" opacity=".16"/><rect x="8" y="20" width="32" height="20" rx="3" fill="#a0522d"/><path d="M8 20a16 9 0 0 1 32 0z" fill="#c4793a"/><rect x="8" y="19" width="32" height="4" fill="#f5b52e"/><rect x="21" y="18" width="6" height="9" rx="2" fill="#f5b52e" stroke="#c98a10"/></svg>`;

// ---------- daily gift (7-day streak) ----------
const GIFTS = [{min:5}, {min:10}, {stars:1, frags:3}, {min:20}, {stars:2}, {min:30}, {stars:3, frags:10}];
const giftCoins = min => Math.max(E.income(false)*min*60, 40*min*E.S());
function giftState(){
  const g = G.meta.gift, today = todayKey();
  const claimed = g.last === today;
  const day = claimed ? g.streak : (g.last === yesterdayKey() ? g.streak % 7 + 1 : 1);
  return {claimed, day};
}
const giftLabel = r => r.min ? `${COIN}${fmt(giftCoins(r.min))}` : `${STAR}${r.stars}${r.frags ? ' ' + T('gift_cards', {n:r.frags}) : ''}`;
function openGift(){
  const s = giftState();
  modal(`<h2>${T('gift_title')}</h2><p>${T('gift_desc')}</p>
    <div class="gifts">${GIFTS.map((r, i) => `<div class="gday ${i + 1 < s.day || (s.claimed && i + 1 === s.day) ? 'got' : ''} ${i + 1 === s.day ? 'cur' : ''}"><small>${T('gift_day', {n:i + 1})}</small><span>${giftLabel(r)}</span></div>`).join('')}</div>
    <div class="row"><button class="pbtn go" id="giftTake" ${s.claimed ? 'disabled' : ''}>${s.claimed ? T('gift_tomorrow') : T('gift_take')}</button><button class="pbtn ghost" id="giftClose">${T('close')}</button></div>`, pn => {
    pn.querySelector('#giftClose').addEventListener('click', closeModal);
    pn.querySelector('#giftTake').addEventListener('click', () => {
      const st = giftState(); if (st.claimed) return;
      const r = GIFTS[st.day - 1];
      G.meta.gift = {last:todayKey(), streak:st.day};
      closeModal();
      if (r.min){ const c = giftCoins(r.min); E.earn(c); celebrate(T('gift_toast', {v:fmt(c)})); }
      if (r.stars){ G.meta.stars += r.stars; G.meta.starsEver += r.stars; celebrate(T('gift_toast', {v:r.stars + ' ★'})); }
      if (r.frags){ const got = grantFrags(r.frags); addText(W/2, H*0.58, fragsText(got), '#2b1e18'); }
      SFX.big(); save(); renderList(); refresh();
    });
  });
}

// ---------- chefs tab ----------
function renderChefs(){
  const total = CHEFS.filter(c => E.chefLvl(c.id) > 0).length;
  listEl.append(el(`<div class="pointhead"><b>${T('ch_head', {a:total, b:CHEFS.length})}</b><span>${T('ch_sub')}</span></div>`));
  const grid = el('<div class="chefs"></div>');
  CHEFS.forEach(c => {
    const f = G.meta.chefs[c.id] || 0, lvl = chefLvl(f), next = CHEF_STEPS.find(s => f < s);
    const prev = [0, ...CHEF_STEPS].filter(s => s <= f).pop();
    grid.append(el(`<div class="chef ${lvl ? '' : 'locked'}"><div class="av">${avatarSvg(c.id, !lvl)}</div>
      <div class="cn">${chefName(c.id)}</div>
      <div class="cl">${lvl ? T('ch_lvl', {l:lvl}) : T('ch_locked')}</div>
      <div class="cb">${chefBonusText(c, lvl)}${lvl ? '' : T('ch_fromLvl1')}</div>
      <div class="bar"><i style="width:${next ? Math.round((f - prev)/(next - prev)*100) : 100}%"></i></div>
      <div class="cf">${next ? T('ch_cards', {a:f, b:next}) : T('ch_max')}</div>
      <div class="ch">${chefHint(c.id)}</div></div>`));
  });
  listEl.append(grid);
}

// ---------- VIP orders ----------
let order = null, vipT = 20;
const orderEl = () => $('order');
function orderSize(){ return Math.min(5, 3 + Math.floor(G.meta.point/3)); }
function startOrder(c){
  const ids = INGR.map(x => x.id);
  for (let i = ids.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
  order = {c, need:ids.slice(0, orderSize()), got:new Set(), t:0, mistakes:0};
  c.reserved = true;
  const o = orderEl();
  o.querySelector('.need').innerHTML = order.need.map(id => `<span data-id="${id}">${INGR.find(x => x.id === id).svg}</span>`).join('');
  o.querySelectorAll('.ingr button').forEach(b => b.classList.remove('hit', 'miss'));
  o.hidden = false; SFX.star(); buzz(20);
}
function tapIngr(id, btn){
  if (!order) return;
  if (order.need.includes(id) && !order.got.has(id)){
    order.got.add(id); SFX.chop(); work[0] = 1; buzz(8);
    orderEl().querySelector(`.need span[data-id="${id}"]`).classList.add('ok');
    btn.classList.remove('hit'); void btn.offsetWidth; btn.classList.add('hit');
    if (order.got.size === order.need.length) completeOrder();
  } else if (!order.got.has(id)){
    order.mistakes++; SFX.sad(); buzz(40);
    btn.classList.remove('miss'); void btn.offsetWidth; btn.classList.add('miss');
  }
}
function completeOrder(){
  const o = order, left = Math.max(0, VIP_TIME - o.t);
  const stars = o.mistakes === 0 && left > VIP_TIME*0.4 ? 3 : o.mistakes <= 1 ? 2 : 1;
  const value = E.check()*E.vipMult()*(1 + left/VIP_TIME);
  order = null; orderEl().hidden = true;
  o.c.reserved = false;
  serve(o.c, {x:M.lav.x, y:M.lav.y}, value, '#c98a10', true, `VIP ${'★'.repeat(stars)} `);
  daily('vip'); daily('hand');
  const got = grantFrags(stars === 3 || Math.random() < 0.4 ? 1 : 0);
  if (Object.keys(got).length) setTimeout(() => addText(o.c.x - M.bw, M.counterY - M.bw*3.4, T('ch_card', {list:fragsText(got)}), '#2b1e18'), 450);
}
function failOrder(msg = T('c_gone')){
  if (!order) return;
  const c = order.c; order = null; orderEl().hidden = true;
  c.state = 'leaving'; addText(c.x, M.counterY - M.bw*2.6, msg, '#6f5b4e'); SFX.sad();
}
function updateOrders(dt, edt){
  vipT -= edt;
  if (vipT <= 0){
    vipT = E.vipInterval()*(0.7 + Math.random()*0.6);
    if (!customers.some(c => c.vip)) spawn(true);
  }
  if (!order){
    if (overlay.hidden){ const v = customers.find(c => c.vip && c.state === 'queue' && !c.reserved && atWindow(c)); if (v) startOrder(v); }
    return;
  }
  if (!overlay.hidden) return;
  order.t += dt;
  const k = Math.max(0, 1 - order.t/VIP_TIME);
  const bar = orderEl().querySelector('.otimer i'); bar.style.width = (k*100) + '%'; bar.classList.toggle('low', k < 0.3);
  if (order.t >= VIP_TIME) failOrder();
}
// share of patience left for a VIP's bubble (null when the order has not started)
const vipPatience = c => order && order.c === c ? Math.max(0, 1 - order.t/VIP_TIME) : null;

function initLive(){
  const o = orderEl();
  o.querySelector('.ingr').innerHTML = INGR.map(x => `<button data-id="${x.id}" id="ingr-${x.id}">${x.svg}<span>${ingrName(x.id)}</span></button>`).join('');
  o.querySelector('.ingr').addEventListener('click', e => { const b = e.target.closest('button'); if (b) tapIngr(b.dataset.id, b); });
  o.querySelector('#orderSkip').addEventListener('click', () => failOrder(T('c_left')));
  $('giftBtn').addEventListener('click', openGift);
  ensureDaily();
}
