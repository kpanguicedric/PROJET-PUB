// Moteur d'animation déterministe : window.seek(t) dessine l'image à l'instant t (secondes).
(function () {
  const T = window.TIMINGS;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const backOut = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  window.EASE = { clamp, easeOut, easeInOut, backOut };

  const root = document.getElementById('scenes');
  const scenes = [];

  function resolver(sc) {
    return function (expr) {
      if (expr == null || expr === '') return null;
      const m = String(expr).trim().match(/^(b\d+|e\d+|s|end)?\s*([+-]\s*[\d.]+)?$/);
      if (!m) throw new Error('bad time ' + expr);
      let base = sc.start;
      const k = m[1] || 's';
      if (k === 'end') base = sc.end;
      else if (k[0] === 'b') base = sc.beats[+k.slice(1)].start;
      else if (k[0] === 'e') base = sc.beats[+k.slice(1)].end;
      return base + (m[2] ? parseFloat(m[2].replace(/\s/g, '')) : 0);
    };
  }

  T.scenes.forEach((sc, i) => {
    const def = window.SCENES[sc.id];
    if (!def) throw new Error('scene manquante ' + sc.id);
    const el = document.createElement('div');
    el.className = 'scene';
    el.id = 'sc-' + sc.id;
    el.innerHTML = def.html;
    root.appendChild(el);
    const at = resolver(sc);
    const items = [...el.querySelectorAll('[data-in],[data-out],[data-type],[data-count]')].map(node => {
      const d = node.dataset;
      const it = {
        node, anim: d.anim || 'up', tin: at(d.in), tout: at(d.out), dur: parseFloat(d.dur || '0.6'),
        dist: parseFloat(d.dist || '50'),
      };
      if (d.type) { it.full = node.textContent; it.ttype = at(d.type); it.tdur = parseFloat(d.tdur || '1'); }
      if (d.count) { it.count = parseFloat(d.count); it.tcount = at(d.countat || d.in); it.cdur = parseFloat(d.cdur || '1.6'); it.suffix = d.suffix || ''; }
      if (it.anim === 'draw') { node.setAttribute('pathLength', '1'); node.style.strokeDasharray = '1'; }
      return it;
    });
    scenes.push({ sc, el, items, at, def, idx: i });
  });

  function applyItem(it, t) {
    const s = it.node.style;
    if (it.tin != null || it.tout != null) {
      let p = it.tin == null ? 1 : clamp((t - it.tin) / it.dur);
      let q = it.tout == null ? 0 : clamp((t - it.tout) / 0.45);
      const e = easeOut(p);
      let op = e * (1 - q), tr = '';
      switch (it.anim) {
        case 'up': tr = `translateY(${(1 - e) * it.dist}px)`; break;
        case 'down': tr = `translateY(${-(1 - e) * it.dist}px)`; break;
        case 'left': tr = `translateX(${-(1 - e) * it.dist * 1.6}px)`; break;
        case 'right': tr = `translateX(${(1 - e) * it.dist * 1.6}px)`; break;
        case 'pop': tr = `scale(${0.4 + 0.6 * backOut(p)})`; op = clamp(p * 3) * (1 - q); break;
        case 'zoom': tr = `scale(${1.25 - 0.25 * e})`; break;
        case 'draw': s.strokeDashoffset = String(1 - easeInOut(p)); op = 1 - q; break;
        case 'fade': break;
        case 'none': op = 1 - q; break;
      }
      s.opacity = op;
      if (tr) s.transform = tr;
    }
    if (it.full != null) {
      const p = clamp((t - it.ttype) / it.tdur);
      it.node.textContent = it.full.slice(0, Math.round(p * it.full.length));
    }
    if (it.count != null) {
      const p = easeOut(clamp((t - it.tcount) / it.cdur));
      it.node.textContent = Math.round(p * it.count).toLocaleString('fr-FR') + it.suffix;
    }
  }

  const subs = document.getElementById('subs');
  const chap = document.getElementById('chapter');
  const prog = document.getElementById('progress');
  const allBeats = [];
  T.scenes.forEach(sc => sc.beats.forEach(b => (b.subs || [b]).forEach(c => allBeats.push(c))));
  const nb = x => x.replace(/(\d) (\d{3})/g, '$1\u00a0$2').replace(/ ([:?!;%])/g, '\u00a0$1');

  window.seek = function (t) {
    for (const S of scenes) {
      const { sc, el } = S;
      const vis = t >= sc.start - 0.4 && t <= sc.end + 0.4;
      el.style.display = vis ? 'block' : 'none';
      if (!vis) continue;
      const fin = clamp((t - (sc.start - 0.3)) / 0.5);
      const fout = S.idx === scenes.length - 1 ? 0 : clamp((t - (sc.end - 0.2)) / 0.45);
      el.style.opacity = easeInOut(fin) * (1 - easeInOut(fout));
      for (const it of S.items) applyItem(it, t);
      if (S.def.update) S.def.update(t, S.at, S.el);
    }
    // sous-titres
    let cur = null;
    for (let i = 0; i < allBeats.length; i++) {
      const b = allBeats[i], nx = allBeats[i + 1];
      const until = nx ? Math.min(nx.start - 0.1, b.end + 1.2) : b.end + 1.5;
      if (t >= b.start - 0.12 && t < until) { cur = b; break; }
    }
    const txt = cur ? nb(cur.text) : '';
    if (subs.textContent !== txt) subs.textContent = txt;
    // chapitre + progression
    const S = scenes.find(s => t < s.sc.end + 0.2) || scenes[scenes.length - 1];
    const lab = `<b>${S.idx + 1}/${scenes.length}</b>${S.sc.chapter}`;
    if (chap.innerHTML !== lab) chap.innerHTML = lab;
    prog.style.width = (clamp(t / T.duration) * 1920).toFixed(1) + 'px';
  };

  document.getElementById('brandIcon').innerHTML = window.ICON('bolt', 26, '#fff');
  window.DURATION = T.duration;
  window.seek(0);
  window.READY = true;

  // aperçu dans un navigateur : ?play ou ?t=42
  const q = new URLSearchParams(location.search);
  if (q.has('t')) window.seek(parseFloat(q.get('t')));
  if (q.has('play')) {
    const a = new Audio('build/narration.wav'); const t0 = parseFloat(q.get('play') || '0');
    a.currentTime = t0; a.play();
    (function loop() { window.seek(a.currentTime); requestAnimationFrame(loop); })();
  }
})();
