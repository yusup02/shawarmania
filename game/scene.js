// ===== scene: kitchen, cooks, equipment, street backdrops =====
const SCENE_KIND = ['metro','park','mall','station','night','sea','stadium','airport'];
const INTERIOR = [
  {tile:'#eef3f4', grout:'#d3dde1'}, {tile:'#eef6ee', grout:'#d2e3d3'}, {tile:'#f6efe4', grout:'#e6d9c6'}, {tile:'#edf0f4', grout:'#d5dae2'},
  {tile:'#3b3354', grout:'#2e2842'}, {tile:'#eaf6f6', grout:'#cfe5e5'}, {tile:'#eef5ea', grout:'#d4e4cc'}, {tile:'#f1f1f3', grout:'#dcdce2'},
];
const APRONS = ['#d63f2a','#e0863a','#2c78b5','#7a55b5','#c98a10'];
const DRINK_COLORS = ['#f6f4ea','#f5d84a','#f6b3c8','#c4793a','#b0303f','#9fe0b2','#5a3a22','#6b4423'];
const work = [0, 0, 0, 0, 0];
const steam = [];

function rr(x, y, w, h, r){ r = Math.max(0, Math.min(r, w/2, h/2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function circle(x, y, r){ ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU); ctx.fill(); }
function fitFont(text, weight, family, maxSize, maxW){ let s = maxSize; ctx.font = `${weight} ${s}px ${family}`; while (s > 7 && ctx.measureText(text).width > maxW){ s -= 1; ctx.font = `${weight} ${s}px ${family}`; } return s; }
const topItem = () => { let i = 0; G.pt.st.forEach((s, k) => { if (s.lvl) i = k; }); return i; };
function sky(x0, w, h, a, b){ const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); ctx.fillStyle = g; ctx.fillRect(x0, 0, w, h); }

function resize(){
  const r = cv.getBoundingClientRect(); W = Math.max(200, r.width); H = Math.max(160, r.height);
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W*dpr); cv.height = Math.round(H*dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  M.awning = Math.max(26, H*0.12); M.postX = W*0.64; M.counterY = H*0.68; M.topDepth = H*0.1;
  M.tile = Math.max(14, Math.round(W/20));
  M.bw = Math.min(50, W*0.1); M.spacing = M.bw*1.45; M.frontX = M.postX + M.bw*0.9;
  const tw = Math.min(64, W*0.14);
  M.spit = {cx:W*0.1, yt:M.awning + H*0.09, yb:M.counterY - H*0.03, tw, bw:tw*0.56};
  M.cook0 = {x:M.spit.cx + tw*0.5 + M.bw*0.55};
  const x0 = M.cook0.x + M.bw*0.55, x1 = M.postX - 6, sw = (x1 - x0)/4;
  M.eqH = Math.min(H*0.17, 54);
  M.slots = [1, 2, 3, 4].map((i, k) => ({i, x:x0 + sw*(k + 0.5), w:Math.min(sw*0.88, 46)}));
  M.board = {x:x0 + 2, y:M.awning + H*0.05, w:x1 - x0 - 4, h:H*0.15};
  M.lav = {x:W*0.31, y:M.counterY + M.topDepth*0.52, rx:Math.min(48, W*0.1), ry:M.topDepth*0.3};
  let seed = 7; const rnd = () => (seed = (seed*16807) % 2147483647)/2147483647;
  M.blds = []; let x = M.postX - 10;
  while (x < W){ const w = W*0.08 + rnd()*W*0.1, h = H*0.2 + rnd()*H*0.3; M.blds.push({x, w, h, c:['#d9c8b4','#c7d4dc','#e2d0be','#b8c6ce','#d4cbe0'][Math.floor(rnd()*5)]}); x += w + 4; }
  M.nstars = Array.from({length:22}, () => ({x:M.postX + rnd()*(W - M.postX), y:rnd()*M.counterY*0.6, p:rnd()*TAU}));
  M.crowd = Array.from({length:70}, () => ({x:rnd(), y:rnd(), c:['#d63f2a','#2c78b5','#f5b52e','#ffffff','#2f8a4a'][Math.floor(rnd()*5)]}));
}

// ---------- backdrops (drawn clipped to the street window) ----------
const BACKDROPS = {
  metro(x0, w, h){
    sky(x0, w, h, '#bde2f2', '#eef7ef');
    for (const b of M.blds){
      const top = h - b.h; ctx.fillStyle = b.c; ctx.fillRect(b.x, top, b.w, b.h + 20);
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      for (let wy = top + 8; wy < h - 6; wy += 14) for (let wx = b.x + 5; wx < b.x + b.w - 7; wx += 11) ctx.fillRect(wx, wy, 5, 7);
    }
    const px = x0 + w*0.84, py = M.awning + h*0.16;
    ctx.fillStyle = '#5a5f66'; ctx.fillRect(px - 2, py, 4, h);
    ctx.fillStyle = '#d63f2a'; circle(px, py, 11);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 12px Unbounded, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('M', px, py + 1);
  },
  park(x0, w, h){
    sky(x0, w, h, '#bfe6f5', '#f2fbe9');
    ctx.fillStyle = '#ffffff';
    for (let k = 0; k < 3; k++){ const cx = x0 + ((k*97 + t*6) % (w + 80)) - 40, cy = M.awning + 14 + k*16; ctx.globalAlpha = 0.9; circle(cx, cy, 9); circle(cx + 10, cy - 4, 11); circle(cx + 22, cy, 8); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#a9d18e'; ctx.beginPath(); ctx.ellipse(x0 + w*0.3, h, w*0.7, h*0.32, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#93c47a'; ctx.beginPath(); ctx.ellipse(x0 + w*0.9, h, w*0.6, h*0.26, 0, 0, TAU); ctx.fill();
    [[0.18, 1], [0.58, 0.8], [0.92, 1.1]].forEach(([fx, s]) => {
      const tx = x0 + w*fx, ty = h*0.62;
      ctx.fillStyle = '#7a5230'; ctx.fillRect(tx - 3*s, ty, 6*s, h*0.4);
      ctx.fillStyle = '#5aa36a'; circle(tx, ty - 6*s, 18*s); ctx.fillStyle = '#4b8f57'; circle(tx + 9*s, ty + 2*s, 12*s); circle(tx - 10*s, ty + 3*s, 11*s);
    });
    const lx = x0 + w*0.4; ctx.fillStyle = '#3b4148'; ctx.fillRect(lx - 1.5, h*0.35, 3, h); ctx.fillStyle = '#f5d84a'; circle(lx, h*0.35, 5);
  },
  mall(x0, w, h){
    ctx.fillStyle = '#f3e6d3'; ctx.fillRect(x0, 0, w, h);
    ctx.fillStyle = '#e2d2bb'; ctx.fillRect(x0, 0, w, M.awning + 18);
    for (let lx = x0 + 12; lx < x0 + w; lx += 30){ ctx.fillStyle = 'rgba(255,230,160,.5)'; circle(lx, M.awning + 12, 7); ctx.fillStyle = '#fff7d6'; circle(lx, M.awning + 12, 3); }
    const signs = [[T('s_shop1'),'#2c78b5'],[T('s_shop2'),'#d63f2a'],[T('s_shop3'),'#2f8a4a']];
    const sw = w/2.3;
    signs.forEach(([txt, c], k) => {
      const sx = x0 + k*(sw + 8) - 6, top = h*0.34;
      ctx.fillStyle = c; ctx.fillRect(sx, top, sw, 16);
      ctx.fillStyle = '#ffffff'; fitFont(txt, 800, 'Unbounded, sans-serif', 9, sw - 6); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, sx + sw/2, top + 8.5);
      ctx.fillStyle = '#cfe8f2'; ctx.fillRect(sx, top + 18, sw, h - top - 18);
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + sw*0.2, h); ctx.lineTo(sx + sw*0.55, top + 22); ctx.stroke();
    });
    for (let fx = x0; fx < x0 + w; fx += 16){ ctx.fillStyle = ((fx - x0)/16) % 2 ? '#d9c9b2' : '#e8dcc8'; ctx.fillRect(fx, h*0.88, 16, h*0.12); }
  },
  station(x0, w, h){
    sky(x0, w, h, '#c3def0', '#f1f3ea');
    const by = h*0.32;
    ctx.fillStyle = '#d9b98f'; ctx.fillRect(x0, by, w, h - by);
    ctx.fillStyle = '#8a5a32'; ctx.beginPath(); ctx.moveTo(x0 - 10, by); ctx.lineTo(x0 + w/2, by - h*0.14); ctx.lineTo(x0 + w + 10, by); ctx.fill();
    ctx.fillStyle = '#9fc3d6';
    for (let k = 0; k < 4; k++){ const wx = x0 + 8 + k*(w - 16)/4, ww = (w - 16)/4 - 8; rr(wx, by + 16, ww, h*0.2, ww/2); ctx.fill(); }
    // clock with the real time
    const cx = x0 + w/2, cy = by - h*0.03, cr = Math.min(12, w*0.08), d = new Date();
    ctx.fillStyle = '#ffffff'; circle(cx, cy, cr); ctx.strokeStyle = '#2b1e18'; ctx.lineWidth = 1.5; ctx.stroke();
    const hand = (a, l) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a)*l, cy - Math.cos(a)*l); ctx.stroke(); };
    hand(((d.getHours() % 12) + d.getMinutes()/60)/12*TAU, cr*0.5); hand(d.getMinutes()/60*TAU, cr*0.8);
    ctx.fillStyle = '#9aa3ab'; ctx.fillRect(x0, h*0.86, w, h*0.14);
    const ph = (t % 22)/22;
    if (ph < 0.4){
      const L = w*1.6, p = ph/0.4, tx = x0 + w + 20 - p*(w + L + 40), ty = h*0.56;
      ctx.fillStyle = '#2f8a4a'; rr(tx, ty, L, h*0.3, 10); ctx.fill();
      ctx.fillStyle = '#f5b52e'; ctx.fillRect(tx, ty + h*0.2, L, 4);
      ctx.fillStyle = '#cfe8f2'; for (let k = tx + 14; k < tx + L - 16; k += 22) rr(k, ty + 8, 15, h*0.09, 3), ctx.fill();
    }
  },
  night(x0, w, h){
    sky(x0, w, h, '#1d2340', '#3d3160');
    for (const s of M.nstars){ ctx.globalAlpha = 0.4 + 0.6*Math.abs(Math.sin(t*1.5 + s.p)); ctx.fillStyle = '#ffffff'; circle(s.x, s.y, 1.2); }
    ctx.globalAlpha = 1; ctx.fillStyle = '#fff3c4'; circle(x0 + w*0.8, M.awning + h*0.14, 9);
    ctx.fillStyle = '#3d3160'; circle(x0 + w*0.8 + 4, M.awning + h*0.14 - 3, 8);
    [[0.12,'#d63f2a'],[0.55,'#f5b52e'],[0.95,'#2b9585']].forEach(([fx, c]) => {
      const tx = x0 + w*fx, top = h*0.5;
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(tx - 30, h*0.78); ctx.lineTo(tx, top); ctx.lineTo(tx + 30, h*0.78); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(tx - 26, h*0.78, 52, h*0.22);
      ctx.fillStyle = 'rgba(255,220,140,.7)'; ctx.fillRect(tx - 18, h*0.8, 36, h*0.08);
    });
    const ly = M.awning + 14, sag = 18, cols = ['#ff6b6b','#ffd166','#6bd4ff','#8dff9e','#ff9ff3'];
    ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.quadraticCurveTo(x0 + w/2, ly + sag*2, x0 + w, ly - 4); ctx.stroke();
    for (let k = 0; k <= 9; k++){
      const p = k/9, bx = x0 + w*p, byy = (1-p)*(1-p)*ly + 2*(1-p)*p*(ly + sag*2) + p*p*(ly - 4);
      ctx.globalAlpha = 0.6 + 0.4*Math.sin(t*3 + k*1.7); ctx.fillStyle = cols[k % cols.length]; circle(bx, byy + 4, 3.2);
    }
    ctx.globalAlpha = 1;
  },
  sea(x0, w, h){
    sky(x0, w, h, '#9fd6f0', '#e8f6fb');
    const sx = x0 + w*0.72, sy = M.awning + h*0.16;
    ctx.fillStyle = 'rgba(255,214,107,.35)'; circle(sx, sy, 20); ctx.fillStyle = '#ffd66b'; circle(sx, sy, 12);
    const seaY = h*0.52;
    ctx.fillStyle = '#3b9cc4'; ctx.fillRect(x0, seaY, w, h - seaY);
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5;
    for (let r = 0; r < 3; r++){
      const y = seaY + 8 + r*12; ctx.beginPath();
      for (let x = x0; x <= x0 + w; x += 6){ const yy = y + Math.sin(x*0.08 + t*1.6 + r)*2; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
      ctx.stroke();
    }
    const bx = x0 + ((t*9) % (w + 80)) - 40, byy = seaY - 2;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(bx - 14, byy); ctx.lineTo(bx + 14, byy); ctx.lineTo(bx + 9, byy + 6); ctx.lineTo(bx - 9, byy + 6); ctx.fill();
    ctx.fillStyle = '#d63f2a'; ctx.beginPath(); ctx.moveTo(bx, byy - 22); ctx.lineTo(bx, byy - 2); ctx.lineTo(bx + 12, byy - 2); ctx.fill();
    ctx.fillStyle = '#3b4148'; ctx.fillRect(x0, h*0.8, w, 3);
    for (let px = x0 + 6; px < x0 + w; px += 18) ctx.fillRect(px, h*0.8, 2.5, h*0.2);
  },
  stadium(x0, w, h){
    sky(x0, w, h, '#9ec7e8', '#f4e2c6');
    const top = h*0.3;
    ctx.fillStyle = '#6b7480'; ctx.beginPath(); ctx.moveTo(x0 - 10, h); ctx.lineTo(x0 - 10, top + 20); ctx.quadraticCurveTo(x0 + w/2, top - 18, x0 + w + 10, top + 20); ctx.lineTo(x0 + w + 10, h); ctx.fill();
    const wave = (t*0.25) % 1.4;
    for (const c of M.crowd){
      const cx = x0 + c.x*w, cy = top + 22 + c.y*(h*0.5), jump = Math.max(0, 1 - Math.abs(c.x - wave)*8)*4;
      ctx.fillStyle = c.c; circle(cx, cy - jump, 2.4);
    }
    ctx.fillStyle = '#4aa35a'; ctx.fillRect(x0, h*0.86, w, h*0.14);
    [x0 + 8, x0 + w - 8].forEach(fx => {
      ctx.fillStyle = '#3b4148'; ctx.fillRect(fx - 1.5, M.awning, 3, top);
      ctx.fillStyle = 'rgba(255,250,210,.5)'; circle(fx, M.awning + 8, 12); ctx.fillStyle = '#fffbe0'; ctx.fillRect(fx - 7, M.awning + 3, 14, 9);
    });
  },
  airport(x0, w, h){
    sky(x0, w, h, '#bfe3f7', '#eef7fb');
    ctx.fillStyle = '#9aa3ab'; ctx.fillRect(x0 + w*0.75, h*0.38, 10, h*0.4); ctx.fillStyle = '#5d6d7c'; rr(x0 + w*0.75 - 7, h*0.32, 24, 12, 4); ctx.fill();
    ctx.fillStyle = '#7d858d'; ctx.fillRect(x0, h*0.72, w, h*0.14);
    ctx.fillStyle = '#ffffff'; for (let dx = x0 + ((t*30) % 24) - 24; dx < x0 + w; dx += 24) ctx.fillRect(dx, h*0.785, 12, 2);
    const ph = (t % 26)/26;
    if (ph < 0.5){
      const p = ph/0.5, px = x0 - 50 + p*(w + 100), py = h*0.7 - p*p*h*0.5;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-0.12 - p*0.2);
      ctx.fillStyle = '#ffffff'; rr(-24, -4, 48, 9, 4.5); ctx.fill();
      ctx.fillStyle = '#2c78b5'; ctx.fillRect(-20, 0, 40, 2);
      ctx.fillStyle = '#dfe6ec'; ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(6, 0); ctx.lineTo(-6, 12); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-22, -3); ctx.lineTo(-17, -3); ctx.lineTo(-24, -12); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#a9b4bd'; for (let k = 1; k < 3; k++) ctx.fillRect(x0 + w*k/3 - 1, 0, 2, h);
    ctx.fillRect(x0, h*0.5, w, 2);
  },
};

// ---------- kitchen ----------
function drawCook(x, base, apron, wk, knife){
  const cw = M.bw*0.78, bh = cw*1.05, r = cw*0.34;
  const bob = (reduced ? 0 : Math.sin(t*2.4 + x*0.1)*1.2) - wk*2;
  const top = base - bh + bob, hy = top - r*0.72;
  // working arm (behind body when idle)
  const sx = knife ? x - cw*0.38 : x + cw*0.38, sy = top + bh*0.28;
  const swing = reduced ? 0 : Math.sin(t*(knife ? 22 : 14))*0.6*wk;
  const ang = knife ? Math.PI + 0.5 + swing : -0.5 + swing, al = cw*0.6;
  const ex = sx + Math.cos(ang)*al, ey = sy + Math.sin(ang)*al*0.6 - (knife ? cw*0.25 : 0);
  ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.lineWidth = cw*0.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#f0c9a2'; circle(ex, ey, cw*0.1);
  if (knife){ ctx.strokeStyle = '#c9d1d8'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - cw*0.35, ey - cw*0.3); ctx.stroke(); }
  rr(x - cw/2, top, cw, bh + 40, cw*0.35); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = 'rgba(43,30,24,.18)'; ctx.lineWidth = 1; ctx.stroke();
  rr(x - cw*0.32, top + bh*0.38, cw*0.64, bh + 40, 4); ctx.fillStyle = apron; ctx.fill();
  ctx.fillStyle = '#f0c9a2'; circle(x, hy, r);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = 'rgba(43,30,24,.22)'; ctx.lineWidth = 1;
  rr(x - r*0.85, hy - r*1.15, r*1.7, r*0.5, 2); ctx.fill(); ctx.stroke();
  [[-0.5, -1.4, 0.5], [0, -1.7, 0.62], [0.5, -1.4, 0.5]].forEach(([a, b, s]) => { ctx.beginPath(); ctx.arc(x + a*r, hy + b*r, s*r, 0, TAU); ctx.fill(); });
  const look = knife ? -r*0.25 : r*0.05;
  ctx.fillStyle = '#2b1e18'; circle(x - r*0.3 + look, hy + r*0.08, r*0.12); circle(x + r*0.3 + look, hy + r*0.08, r*0.12);
  ctx.strokeStyle = '#2b1e18'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x + look, hy + r*0.3, r*0.28, 0.15*Math.PI, 0.85*Math.PI); ctx.stroke();
}
function drawFryer(x, base, w, h, wk){
  const bx = x - w/2, by = base - h*0.58;
  const g = ctx.createLinearGradient(bx, 0, bx + w, 0); g.addColorStop(0, '#9aa3ab'); g.addColorStop(0.5, '#e3e8ec'); g.addColorStop(1, '#8d969e');
  rr(bx, by, w, h*0.58 + 6, 3); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#e8b64a'; ctx.fillRect(bx + 3, by + 3, w - 6, h*0.1);
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  for (let k = 0; k < 4; k++) circle(bx + 5 + ((k*13 + t*18) % (w - 10)), by + 4 + (k % 2)*2, 1.4 + (k % 2));
  const lift = wk*h*0.28, kx = bx + w*0.14, ky = by - h*0.16 - lift, kw = w*0.56, kh = h*0.24;
  ctx.fillStyle = '#f2c14e'; for (let k = 0; k < 5; k++) ctx.fillRect(kx + 2 + k*kw/5, ky - 3 - (k % 2)*2, 2.5, kh*0.8);
  ctx.strokeStyle = '#6f7880'; ctx.lineWidth = 1.5; ctx.strokeRect(kx, ky, kw, kh);
  ctx.beginPath(); ctx.moveTo(kx + kw, ky + 2); ctx.lineTo(bx + w*0.98, ky - h*0.16); ctx.stroke();
  ctx.fillStyle = '#2b1e18'; ctx.fillRect(bx + w*0.94, ky - h*0.2, 4, h*0.08);
}
function drawDispenser(x, base, w, h, color){
  const bx = x - w/2;
  rr(bx, base - h*0.3, w, h*0.3 + 6, 3); ctx.fillStyle = '#3b4148'; ctx.fill();
  const tx = bx + w*0.1, ty = base - h*0.98, tw = w*0.8, th = h*0.66;
  ctx.save(); rr(tx, ty, tw, th, 6); ctx.fillStyle = 'rgba(210,235,248,.7)'; ctx.fill(); ctx.clip();
  const lvl = ty + th*0.32;
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(tx, ty + th);
  for (let xx = tx; xx <= tx + tw; xx += 3) ctx.lineTo(xx, lvl + Math.sin(xx*0.3 + t*3)*1.2);
  ctx.lineTo(tx + tw, ty + th); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let k = 0; k < 3; k++) circle(tx + tw*(0.25 + k*0.25), ty + th - ((t*20 + k*17) % (th*0.6)), 1.3);
  ctx.restore();
  ctx.strokeStyle = '#9aa3ab'; ctx.lineWidth = 1.5; rr(tx, ty, tw, th, 6); ctx.stroke();
  ctx.fillStyle = '#3b4148'; rr(tx - 2, ty - 5, tw + 4, 6, 3); ctx.fill();
  ctx.fillStyle = '#c9d1d8'; ctx.fillRect(x - 3, base - h*0.34, 6, 6);
}
function drawPress(x, base, w, h, wk){
  const bx = x - w/2, by = base - h*0.32;
  rr(bx, by, w, h*0.32 + 6, 3); ctx.fillStyle = '#3b4148'; ctx.fill();
  ctx.fillStyle = `rgba(255,120,40,${0.5 + 0.3*Math.sin(t*3)})`; ctx.fillRect(bx + 3, by - 3, w - 6, 3);
  const open = 0.18 + wk*0.7;
  ctx.save(); ctx.translate(bx + 3, by - 3); ctx.rotate(-open);
  rr(0, -h*0.16, w - 6, h*0.16, 3); ctx.fillStyle = '#4a4f55'; ctx.fill();
  ctx.fillStyle = '#c9d1d8'; ctx.fillRect(w*0.6, -h*0.24, w*0.3, 3);
  ctx.restore();
  ctx.fillStyle = '#f0d7a3'; rr(bx + w*0.2, by - 6, w*0.6, 5, 2); ctx.fill();
}
function drawMiniSpit(x, base, w, h, gold){
  const top = base - h*1.05, cw = w*0.62;
  rr(x - w*0.45, top - 4, w*0.9, h*1.05 + 8, 5); ctx.fillStyle = '#4a4f55'; ctx.fill();
  ctx.fillStyle = `rgba(255,140,40,${0.45 + 0.25*Math.sin(t*2.2 + 1)})`; ctx.fillRect(x - w*0.4, top + 4, w*0.8, h*0.85);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(x - cw/2, top + 4); ctx.lineTo(x + cw/2, top + 4); ctx.lineTo(x + cw*0.28, base - 6); ctx.lineTo(x - cw*0.28, base - 6); ctx.closePath();
  const g = ctx.createLinearGradient(x - cw/2, 0, x + cw/2, 0);
  if (gold){ g.addColorStop(0, '#a8741a'); g.addColorStop(0.35, '#ffd66b'); g.addColorStop(1, '#8a5e12'); }
  else { g.addColorStop(0, '#6a3416'); g.addColorStop(0.3, '#c98545'); g.addColorStop(1, '#552a11'); }
  ctx.fillStyle = g; ctx.fill(); ctx.clip();
  for (let k = 0; k < 5; k++){
    const ph = (reduced ? 0 : t*1.5) + k*TAU/5, c = Math.cos(ph); if (c <= 0) continue;
    ctx.fillStyle = `rgba(255,230,180,${0.3*c})`; ctx.fillRect(x + Math.sin(ph)*cw*0.4 - 1.5, top, 3, h);
  }
  ctx.restore();
}
function drawEquip(sl){
  const i = sl.i, base = M.counterY + 2, w = sl.w, h = M.eqH, kind = ST_KIND[i];
  if (kind === 'side') drawFryer(sl.x, base, w, h, work[i]);
  else if (kind === 'drink') drawDispenser(sl.x, base, w, h, DRINK_COLORS[G.meta.point] || '#f6f4ea');
  else if (i === 3) drawPress(sl.x, base, w, h, work[i]);
  else drawMiniSpit(sl.x, base, w, h, G.meta.point === NUM_POINTS - 1);
}
function drawSpit(){
  const s = M.spit, glow = 0.55 + 0.25*Math.sin(t*2.2);
  rr(s.cx - s.tw*0.66, s.yt - 12, s.tw*1.32, s.yb - s.yt + 24, 8); ctx.fillStyle = '#4a4f55'; ctx.fill();
  for (let i = 0; i < 4; i++){ const y = s.yt + (s.yb - s.yt)*(i + 0.5)/4 - 4; ctx.fillStyle = `rgba(255,${120 + i*10},40,${glow})`; rr(s.cx - s.tw*0.6, y, s.tw*1.2, 8, 4); ctx.fill(); }
  const halo = ctx.createRadialGradient(s.cx, (s.yt + s.yb)/2, 4, s.cx, (s.yt + s.yb)/2, s.tw*1.3);
  halo.addColorStop(0, `rgba(255,140,50,${0.25*glow})`); halo.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.fillStyle = halo; ctx.fillRect(s.cx - s.tw*1.4, s.yt - 20, s.tw*2.8, s.yb - s.yt + 40);
  ctx.strokeStyle = '#8d969e'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(s.cx, s.yt - 18); ctx.lineTo(s.cx, s.yb + 14); ctx.stroke();
  const hw = y => (s.tw + (s.bw - s.tw)*(y - s.yt)/(s.yb - s.yt))/2;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(s.cx - s.tw/2, s.yt); ctx.quadraticCurveTo(s.cx, s.yt - s.tw*0.2, s.cx + s.tw/2, s.yt);
  ctx.lineTo(s.cx + s.bw/2, s.yb); ctx.quadraticCurveTo(s.cx, s.yb + s.bw*0.25, s.cx - s.bw/2, s.yb); ctx.closePath();
  const mg = ctx.createLinearGradient(s.cx - s.tw/2, 0, s.cx + s.tw/2, 0);
  mg.addColorStop(0, '#6a3416'); mg.addColorStop(0.28, '#c98545'); mg.addColorStop(0.6, '#a65c2b'); mg.addColorStop(1, '#552a11');
  ctx.fillStyle = mg; ctx.fill(); ctx.clip();
  ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(70,30,10,.35)';
  for (let y = s.yt + 5; y < s.yb + 4; y += 7){ const w = hw(y); ctx.beginPath(); ctx.moveTo(s.cx - w, y); ctx.quadraticCurveTo(s.cx, y + 3, s.cx + w, y); ctx.stroke(); }
  const spin = reduced ? 0 : t*1.3;
  for (let k = 0; k < 7; k++){
    const ph = spin + k*TAU/7, c = Math.cos(ph); if (c <= 0) continue;
    const sx = Math.sin(ph);
    ctx.strokeStyle = k % 3 === 0 ? `rgba(60,24,8,${0.4*c})` : `rgba(255,214,160,${0.3*c})`; ctx.lineWidth = 1 + 3*c;
    ctx.beginPath(); for (let y = s.yt - 4; y <= s.yb + 4; y += 6){ const x = s.cx + sx*hw(y)*0.9; y === s.yt - 4 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = '#9aa3ab'; ctx.beginPath(); ctx.ellipse(s.cx, s.yb + 14, s.bw*0.95, 4, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#7b848c'; ctx.beginPath(); ctx.ellipse(s.cx, s.yt - 18, 6, 3, 0, 0, TAU); ctx.fill();
}
function drawBoard(){
  const B = M.board, ti = topItem();
  rr(B.x, B.y, B.w, B.h, 6); ctx.fillStyle = '#2f3330'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#8a5a32'; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const rn = itemName(ti);
  ctx.fillStyle = '#f5b52e'; const mn = T('s_menu'); fitFont(mn, 800, 'Unbounded, sans-serif', Math.round(B.h*0.2), B.w - 12); ctx.fillText(mn, B.x + B.w/2, B.y + B.h*0.24);
  ctx.fillStyle = '#ffffff'; fitFont(rn, 800, 'Nunito, sans-serif', Math.round(B.h*0.21), B.w - 12); ctx.fillText(rn, B.x + B.w/2, B.y + B.h*0.52);
  const pr = fmt(E.profit(ti));
  const ps = fitFont(pr, 800, 'Unbounded, sans-serif', Math.round(B.h*0.2), B.w - 30);
  const pw = ctx.measureText(pr).width, cx0 = B.x + B.w/2 - (pw + ps)/2;
  ctx.fillStyle = '#f5b52e'; circle(cx0 + ps*0.4, B.y + B.h*0.79, ps*0.38);
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left'; ctx.fillText(pr, cx0 + ps, B.y + B.h*0.8);
}

function draw(){
  const loc = P(), kind = SCENE_KIND[G.meta.point] || 'metro', inn = INTERIOR[G.meta.point] || INTERIOR[0];
  ctx.save(); ctx.beginPath(); ctx.rect(M.postX, 0, W - M.postX, M.counterY + 4); ctx.clip();
  BACKDROPS[kind](M.postX, W - M.postX, M.counterY + 4);
  ctx.restore();
  ctx.fillStyle = inn.tile; ctx.fillRect(0, 0, M.postX, M.counterY + 4);
  ctx.strokeStyle = inn.grout; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x <= M.postX; x += M.tile){ ctx.moveTo(Math.round(x) + .5, 0); ctx.lineTo(Math.round(x) + .5, M.counterY + 4); }
  for (let y = 0; y <= M.counterY + 4; y += M.tile){ ctx.moveTo(0, Math.round(y) + .5); ctx.lineTo(M.postX, Math.round(y) + .5); }
  ctx.stroke();
  drawBoard();
  drawSpit();
  const firstLocked = G.pt.st.findIndex(s => !s.lvl);
  for (const sl of M.slots){
    if (G.pt.st[sl.i].lvl){ drawCook(sl.x, M.counterY - M.eqH*0.42, APRONS[sl.i], work[sl.i], false); drawEquip(sl); }
    else if (sl.i === firstLocked){
      ctx.setLineDash([4, 4]); ctx.strokeStyle = inn.tile === '#3b3354' ? 'rgba(255,255,255,.35)' : 'rgba(43,30,24,.25)'; ctx.lineWidth = 1.5;
      rr(sl.x - sl.w/2, M.counterY - M.eqH*0.8, sl.w, M.eqH*0.8, 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = ctx.strokeStyle; ctx.font = `800 ${Math.round(sl.w*0.4)}px Unbounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('?', sl.x, M.counterY - M.eqH*0.4);
    }
  }
  drawCook(M.cook0.x, M.counterY - 2, APRONS[0], work[0], true);
  for (const s of steam){ ctx.globalAlpha = Math.max(0, s.life)*0.5; ctx.fillStyle = '#ffffff'; circle(s.x, s.y, s.r); }
  ctx.globalAlpha = 1;
  for (const c of customers) drawCustomer(c);
  ctx.fillStyle = '#5a5f66'; ctx.fillRect(M.postX - 4, 0, 8, M.counterY);
  const n = 10, sw = W/n, ah = M.awning;
  for (let i = 0; i <= n; i++){ ctx.fillStyle = i % 2 ? loc.b : loc.a; ctx.fillRect(i*sw, 0, sw + 0.5, ah); ctx.beginPath(); ctx.arc(i*sw + sw/2, ah, sw/2, 0, Math.PI); ctx.fill(); }
  const sh = ctx.createLinearGradient(0, ah, 0, ah + sw);
  sh.addColorStop(0, 'rgba(43,30,24,.16)'); sh.addColorStop(1, 'rgba(43,30,24,0)');
  ctx.fillStyle = sh; ctx.fillRect(0, ah + sw*0.3, W, sw);
  ctx.fillStyle = '#2b1e18'; ctx.fillRect(0, 0, W, 3);
  const cy = M.counterY, d = M.topDepth;
  const tg = ctx.createLinearGradient(0, cy, 0, cy + d); tg.addColorStop(0, '#eef2f5'); tg.addColorStop(1, '#c2cad1');
  ctx.fillStyle = tg; ctx.fillRect(0, cy, W, d);
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(0, cy, W, 2);
  ctx.fillStyle = loc.panel; ctx.fillRect(0, cy + d, W, H - cy - d);
  ctx.fillStyle = 'rgba(0,0,0,.1)'; for (let x = W/8; x < W; x += W/8) ctx.fillRect(x, cy + d, 2, H);
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(0, cy + d, W, 3);
  const ph = H - cy - d;
  if (ph > 22){
    const label = loc.name.toUpperCase();
    ctx.fillStyle = loc.b; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = 0.92;
    fitFont(label, 800, 'Unbounded, sans-serif', Math.min(16, ph*0.32), W - 40); ctx.fillText(label, W/2, cy + d + ph/2 + 1); ctx.globalAlpha = 1;
  }
  const L = M.lav, sc = 1 + 0.12*pop;
  ctx.fillStyle = '#b98149'; ctx.beginPath(); ctx.ellipse(L.x, L.y + 2, L.rx*1.18, L.ry*1.35, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#d29d62'; ctx.beginPath(); ctx.ellipse(L.x, L.y, L.rx*1.12, L.ry*1.22, 0, 0, TAU); ctx.fill();
  if (step >= 1){
    ctx.save(); ctx.translate(L.x, L.y); ctx.scale(sc, sc);
    ctx.fillStyle = '#f0d7a3'; ctx.beginPath(); ctx.ellipse(0, 0, L.rx, L.ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#d8b676'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(190,140,70,.55)';
    [[-.55,-.2],[.4,.3],[.6,-.35],[-.2,.45],[.05,-.5]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(a*L.rx, b*L.ry, 3, 1.6, 0, 0, TAU); ctx.fill(); });
    if (step >= 2){
      ctx.fillStyle = '#8a4a22';
      [[-.35,-.1],[-.1,.15],[.15,-.15],[.35,.1],[0,-.05],[-.2,.25],[.25,.28]].forEach(([a, b]) => { ctx.beginPath(); ctx.ellipse(a*L.rx, b*L.ry, L.rx*0.12, L.ry*0.28, a, 0, TAU); ctx.fill(); });
    }
    if (step >= 3){
      [[-.3,.05,'#4a9b4f'],[.05,.25,'#4a9b4f'],[.3,-.1,'#e05a3c'],[-.05,-.2,'#e05a3c'],[.42,.2,'#4a9b4f']].forEach(([a, b, c]) => { ctx.fillStyle = c; circle(a*L.rx, b*L.ry, Math.max(2, L.rx*0.06)); });
    }
    ctx.restore();
  }
  for (let i = 0; i < STEPS; i++){
    const px = L.x + L.rx*1.35 + 6 + i*11, py = L.y;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, TAU);
    if (i < step){ ctx.fillStyle = '#f5b52e'; ctx.fill(); } else { ctx.strokeStyle = '#8d969e'; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  for (const f of flies){
    const p = Math.min(1, f.p), e = 1 - Math.pow(1 - p, 2);
    const tx = f.c.x - M.bw*0.55, ty = M.counterY - M.bw*0.9;
    drawWrap(f.x0 + (tx - f.x0)*e, f.y0 + (ty - f.y0)*e - Math.sin(Math.PI*p)*H*0.16, 0.9, p*TAU*0.5);
  }
  for (const p of parts){
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life*1.5));
    ctx.fillStyle = p.kind === 'coin' ? '#f5b52e' : '#8a4a22';
    circle(p.x, p.y, p.r);
    if (p.kind === 'coin'){ ctx.strokeStyle = '#c98a10'; ctx.lineWidth = 1; ctx.stroke(); }
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (const x of texts){
    ctx.globalAlpha = Math.min(1, x.life*2);
    ctx.font = `800 ${x.big ? 20 : 15}px Unbounded, sans-serif`;
    const half = ctx.measureText(x.text).width/2;
    const tx = Math.min(W - half - 6, Math.max(half + 6, x.x));
    ctx.lineWidth = 5; ctx.strokeStyle = '#ffffff'; ctx.strokeText(x.text, tx, x.y);
    ctx.fillStyle = x.color; ctx.fillText(x.text, tx, x.y);
  }
  ctx.globalAlpha = 1;
}
function updateScene(dt){
  for (let i = 0; i < work.length; i++) work[i] = Math.max(0, work[i] - dt*2.2);
  if (!reduced && Math.random() < dt*3){ const s = M.spit; steam.push({x:s.cx + (Math.random() - 0.5)*s.tw*0.6, y:s.yt - 10, r:3 + Math.random()*3, life:1, vx:(Math.random() - 0.5)*6}); }
  for (const s of steam){ s.y -= dt*18; s.x += s.vx*dt; s.r += dt*4; s.life -= dt*0.9; }
  for (let k = steam.length - 1; k >= 0; k--) if (steam[k].life <= 0) steam.splice(k, 1);
}
function pulseKitchen(){
  G.pt.st.forEach((s, i) => { if (s.lvl) setTimeout(() => { work[i] = 1; }, i*90); });
}
function drawWrap(x, y, s, rot){
  const w = M.bw*0.42*s, h = M.bw*0.82*s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot*0.15);
  const g = ctx.createLinearGradient(-w/2, 0, w/2, 0); g.addColorStop(0, '#aab3bb'); g.addColorStop(0.4, '#eef2f5'); g.addColorStop(1, '#9aa3ab');
  rr(-w/2, -h/2 + h*0.18, w, h*0.82, w*0.3); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#f0d7a3'; ctx.beginPath(); ctx.ellipse(0, -h/2 + h*0.18, w*0.55, w*0.25, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = itemFill(topItem()); ctx.beginPath(); ctx.ellipse(0, -h/2 + h*0.15, w*0.38, w*0.16, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#4a9b4f'; circle(-w*0.15, -h/2 + h*0.12, w*0.09);
  ctx.restore();
}
function drawCustomer(c){
  const bw = M.bw, x = c.x, base = M.counterY + M.topDepth*0.4 + c.sink;
  const bob = c.state === 'queue' && !reduced ? Math.sin(t*3 + c.seed)*1.6 : 0;
  const bodyH = bw*1.35, hr = bw*0.36, hy = base - bodyH - hr*0.75 + bob;
  ctx.globalAlpha = Math.max(0, c.alpha);
  rr(x - bw/2, base - bodyH + bob, bw, bodyH + 30, bw*0.42); ctx.fillStyle = c.shirt; ctx.fill();
  ctx.fillStyle = c.skin; circle(x, hy, hr);
  if (c.cap && !c.vip){
    ctx.fillStyle = c.capC; ctx.beginPath(); ctx.arc(x, hy - hr*0.15, hr*1.02, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - hr*1.55, hy - hr*0.2, hr*0.9, hr*0.22);
  } else {
    ctx.fillStyle = c.hair; ctx.beginPath(); ctx.arc(x, hy - hr*0.12, hr*1.03, Math.PI*1.02, -0.02); ctx.fill();
  }
  ctx.fillStyle = '#2b1e18';
  ctx.beginPath(); ctx.arc(x - hr*0.42, hy + hr*0.12, hr*0.11, 0, TAU); ctx.arc(x + hr*0.05, hy + hr*0.12, hr*0.11, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#2b1e18'; ctx.lineWidth = 1.6; ctx.beginPath();
  if (c.happy) ctx.arc(x - hr*0.2, hy + hr*0.35, hr*0.26, 0.15*Math.PI, 0.85*Math.PI);
  else { ctx.moveTo(x - hr*0.38, hy + hr*0.52); ctx.lineTo(x - hr*0.02, hy + hr*0.52); }
  ctx.stroke();
  if (c.vip){
    const cy = hy - hr*1.05;
    ctx.fillStyle = '#f5b52e'; ctx.strokeStyle = '#c98a10'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x - hr*0.7, cy + hr*0.3); ctx.lineTo(x - hr*0.75, cy - hr*0.35); ctx.lineTo(x - hr*0.35, cy); ctx.lineTo(x, cy - hr*0.5); ctx.lineTo(x + hr*0.35, cy); ctx.lineTo(x + hr*0.75, cy - hr*0.35); ctx.lineTo(x + hr*0.7, cy + hr*0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (c.state === 'queue'){
      const pat = vipPatience(c), label = pat === null ? T('c_special') : T('c_make');
      ctx.font = `800 ${Math.max(10, Math.round(bw*0.24))}px Nunito, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = ctx.measureText(label).width + 14, bx = Math.min(W - tw/2 - 4, x), by = cy - hr*1.1 + Math.sin(t*4)*1.5;
      rr(bx - tw/2, by - 11, tw, 22, 11); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = '#2b1e18'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#2b1e18'; ctx.fillText(label, bx, by + 1);
      if (pat !== null){
        ctx.fillStyle = 'rgba(43,30,24,.25)'; rr(bx - tw/2 + 6, by + 12, tw - 12, 4, 2); ctx.fill();
        ctx.fillStyle = pat > 0.3 ? '#2f8a4a' : '#d63f2a'; rr(bx - tw/2 + 6, by + 12, (tw - 12)*pat, 4, 2); ctx.fill();
      }
    }
  }
  if (c.group >= 1.5 && !c.vip){
    const g = '×' + (c.group < 10 ? fr2(Math.round(c.group*10)/10) : fmt(c.group));
    ctx.font = `800 ${Math.max(10, Math.round(bw*0.24))}px Unbounded, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tw = ctx.measureText(g).width + 12, by = hy - hr*1.75;
    rr(x - tw/2, by - 10, tw, 20, 10); ctx.fillStyle = '#2b1e18'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.fillText(g, x, by + 1);
  }
  if (c.hasWrap) drawWrap(x - bw*0.55, base - bodyH*0.55, 0.8, 0);
  ctx.globalAlpha = 1;
}
