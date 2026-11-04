// ===== sound & music: everything is synthesized, no audio files =====
const SFX = (() => {
  let ac = null, sfxBus = null, musicBus = null, noiseBuf = null, lastCoin = 0;
  let on = true, musicOn = true, timer = null, step = 0, nextT = 0;
  try { on = localStorage.getItem('shawarma-sound') !== 'off'; musicOn = localStorage.getItem('shawarma-music') !== 'off'; } catch(e) {}
  function ctx(){
    if (!ac){
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        sfxBus = ac.createGain(); sfxBus.gain.value = on ? 0.5 : 0; sfxBus.connect(ac.destination);
        musicBus = ac.createGain(); musicBus.gain.value = musicOn ? 0.16 : 0; musicBus.connect(ac.destination);
      } catch(e){ ac = null; return null; }
    }
    if (ac.state === 'suspended' && !document.hidden) ac.resume().catch(() => {});
    return ac;
  }
  function noise(){
    if (!noiseBuf){ noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2 - 1; }
    return noiseBuf;
  }
  function tone(f, t0, dur, type = 'sine', g = 0.15, f2, bus = sfxBus){
    const o = ac.createOscillator(), v = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(g, t0 + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(v); v.connect(bus); o.start(t0); o.stop(t0 + dur + 0.03);
  }
  function burst(t0, dur, freq, q, g, bus = sfxBus){
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), v = ac.createGain();
    s.buffer = noise(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    v.gain.setValueAtTime(g, t0); v.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(v); v.connect(bus); s.start(t0, Math.random()*0.5); s.stop(t0 + dur + 0.03);
  }

  // ---------- background music: original 8-bar loop in A harmonic minor ----------
  const BPM = 104, STEP = 60/BPM/2;  // eighth notes
  const _ = null;
  const MELODY = [
    69, 72, 76, 74, 72, _, 71, 72,   74, _, 77, 76, 74, 72, 74, _,
    71, 68, 71, 74, 76, _, 74, 71,   72, 71, 69, _, 64, _, _, _,
    76, 76, 77, 76, 74, 72, 74, 76,  77, _, 74, _, 72, 74, 72, 69,
    68, 71, 74, 71, 76, 74, 71, 68,  69, _, _, _, 69, 72, 76, _,
  ];
  const CHORDS = [[57,60,64],[57,62,65],[56,59,64],[57,60,64]];
  const ROOTS = [45, 50, 52, 45];
  const DRUM = ['D', _, 'T', _, 'D', 'T', _, 'T'];
  const hz = m => 440*Math.pow(2, (m - 69)/12);
  function pluck(m, t0, dur){
    // a soft oud-like pluck: two slightly detuned triangles with a fast decay
    [0, 4].forEach(det => {
      const o = ac.createOscillator(), v = ac.createGain();
      o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = det;
      v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(0.5, t0 + 0.01); v.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(v); v.connect(musicBus); o.start(t0); o.stop(t0 + dur + 0.05);
    });
  }
  function pad(notes, t0, dur){
    notes.forEach(m => {
      const o = ac.createOscillator(), v = ac.createGain();
      o.type = 'sine'; o.frequency.value = hz(m);
      v.gain.setValueAtTime(0.0001, t0); v.gain.linearRampToValueAtTime(0.09, t0 + 0.25); v.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      o.connect(v); v.connect(musicBus); o.start(t0); o.stop(t0 + dur + 0.05);
    });
  }
  function scheduleStep(s, t0){
    const bar = Math.floor(s/8) % 4, inBar = s % 8;
    const m = MELODY[s % MELODY.length];
    if (m) pluck(m, t0, STEP*1.8);
    if (inBar === 0) pad(CHORDS[bar], t0, STEP*8);
    if (inBar === 0 || inBar === 4) tone(hz(ROOTS[bar]), t0, STEP*1.6, 'triangle', 0.35, undefined, musicBus);
    if (inBar === 6) tone(hz(ROOTS[bar] + 12), t0, STEP*0.9, 'triangle', 0.2, undefined, musicBus);
    const d = DRUM[inBar];
    if (d === 'D') tone(110, t0, 0.16, 'sine', 0.5, 55, musicBus);
    if (d === 'T') burst(t0, 0.04, 3200, 3, 0.25, musicBus);
  }
  function tick(){
    if (!ac || !musicOn || document.hidden) return;
    if (nextT < ac.currentTime) nextT = ac.currentTime + 0.05;
    while (nextT < ac.currentTime + 0.15){ scheduleStep(step, nextT); step = (step + 1) % MELODY.length; nextT += STEP; }
  }
  function startMusic(){ if (timer || !ctx()) return; nextT = ac.currentTime + 0.1; timer = setInterval(tick, 30); }
  function stopMusic(){ clearInterval(timer); timer = null; }
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend().catch(() => {}); else if (on || musicOn) ac.resume().catch(() => {});
  });

  const play = fn => { if (!on) return; const a = ctx(); if (a) fn(a.currentTime); };
  return {
    get on(){ return on; },
    get musicOn(){ return musicOn; },
    unlock(){ if (on || musicOn) ctx(); if (musicOn) startMusic(); },
    toggle(){
      on = !on;
      try { localStorage.setItem('shawarma-sound', on ? 'on' : 'off'); } catch(e) {}
      if (sfxBus) sfxBus.gain.value = on ? 0.5 : 0;
      if (on) ctx();
      return on;
    },
    toggleMusic(){
      musicOn = !musicOn;
      try { localStorage.setItem('shawarma-music', musicOn ? 'on' : 'off'); } catch(e) {}
      if (musicOn){ ctx(); if (musicBus) musicBus.gain.value = 0.16; startMusic(); }
      else { if (musicBus) musicBus.gain.value = 0; stopMusic(); }
      return musicOn;
    },
    chop(){ play(t0 => burst(t0, 0.05, 2600 + Math.random()*1400, 2.5, 0.3)); },
    coin(){
      const n = performance.now(); if (n - lastCoin < 90) return; lastCoin = n;
      play(t0 => { tone(1318, t0, 0.07, 'square', 0.035); tone(1976, t0 + 0.05, 0.14, 'square', 0.035); });
    },
    buy(){ play(t0 => [523, 659, 784].forEach((f, k) => tone(f, t0 + k*0.05, 0.12, 'triangle', 0.12))); },
    star(){ play(t0 => [784, 988, 1175, 1568].forEach((f, k) => tone(f, t0 + k*0.07, 0.2, 'triangle', 0.11))); },
    big(){ play(t0 => { [523, 659, 784, 1046].forEach((f, k) => tone(f, t0 + k*0.11, 0.35, 'triangle', 0.13)); tone(1046, t0 + 0.5, 0.6, 'sine', 0.1); }); },
    sad(){ play(t0 => tone(330, t0, 0.3, 'sine', 0.06, 220)); },
  };
})();
