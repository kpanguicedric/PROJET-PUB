/* DEME TRADING COMPANY — motion design 1920x1080, timeline déterministe (seek par image) */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DURATION = 40;
window.DURATION = DURATION;

/* ---------- utilitaires ---------- */
function iconSVG(name, draw) {
  let inner = ICONS[name] || '';
  if (draw) inner = inner.replace(/<(path|circle|rect|line|polyline|polygon|ellipse)/g, '<$1 pathLength="1"');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
function emblemSVG(id, text = true) {
  return `<svg viewBox="0 0 200 200">
  <defs>
    <linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1F57DA"/><stop offset="1" stop-color="#071a55"/></linearGradient>
    <linearGradient id="${id}or" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FF7A00"/><stop offset="1" stop-color="#FFB13B"/></linearGradient>
  </defs>
  <rect class="e-bg" width="200" height="200" rx="36" fill="url(#${id}bg)"/>
  <rect x="2" y="2" width="196" height="196" rx="34" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2"/>
  <path class="e-blue" d="M58.4 114 A48 48 0 0 1 141.6 66" fill="none" stroke="#6E9DFF" stroke-width="13" stroke-linecap="round" pathLength="1"/>
  <path class="e-or" d="M44 128 C 82 154, 132 140, 156 84" fill="none" stroke="url(#${id}or)" stroke-width="15" stroke-linecap="round" pathLength="1"/>
  <polygon class="e-arrow" points="165,62 168,92 142,80" fill="#FFB13B" stroke="#FFB13B" stroke-width="3" stroke-linejoin="round"/>
  ${text ? '<text class="e-txt" x="100" y="182" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="34" letter-spacing="1" fill="#fff">DEME</text>' : ''}
</svg>`;
}
function splitWords(el) {
  const out = [];
  [...el.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      n.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { out.push(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'w';
        w.innerHTML = `<span class="wi">${tok}</span>`; out.push(w);
      });
    } else {
      const w = document.createElement('span'); w.className = 'w';
      const wi = document.createElement('span'); wi.className = 'wi';
      wi.appendChild(n.cloneNode(true)); w.appendChild(wi); out.push(w);
    }
  });
  el.innerHTML = ''; out.forEach(n => el.appendChild(n));
}
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- construction du DOM ---------- */
$$('[data-i]').forEach(el => {
  el.innerHTML = iconSVG(el.dataset.i, el.classList.contains('draw')) + el.innerHTML;
  if (el.dataset.s) { el.style.width = el.dataset.s + 'px'; el.style.height = el.dataset.s + 'px'; el.style.display = 'inline-block'; }
});
$$('.split').forEach(splitWords);
$('#emblemWrap').innerHTML = emblemSVG('big');
$$('.emb').forEach((el, i) => el.innerHTML = emblemSVG('m' + i));
$('#waP').setAttribute('d', WA_PATH);
$('.waq').setAttribute('d', WA_PATH);
$('.qrsvg').innerHTML = QR_SVG.replace('<svg', '<svg class="qr" shape-rendering="crispEdges"');
// étoiles fournisseurs
$$('#v2 .stars').forEach((s, r) => { for (let i = 0; i < 5; i++) s.insertAdjacentHTML('beforeend', `<span class="ico">${iconSVG('star')}</span>`); });
// soulignement "Chine" (après chargement des polices)
function placeUnderline() {
  const w = $$('#s1 .lineA .w'); const last = w[w.length - 1];
  const r = last.getBoundingClientRect(), st = $('#stage').getBoundingClientRect();
  const ul = $('#s1 .ulA'); ul.style.left = (r.left - st.left + 4) + 'px'; ul.style.top = (r.bottom - st.top + 2) + 'px'; ul.style.width = (r.width - 70) + 'px';
}

gsap.set('.sweep', { skewX: -12, x: 2600 });
gsap.set('.toast', { xPercent: -50, y: 200 });
gsap.set('.cursor', { x: 640, y: 720 });
gsap.set('.lens', { x: 560, y: 245, scale: 0 });

/* ---------- état piloté par la timeline ---------- */
const G = { a: 0, rot: -108, tilt: -16, arc: 0, p1: 0, p2: 0, net: 0 };
const FX = { a: 0 };
const P = { t1: 0, t2: 0, pc: 0, plane: 0, ship: 0 };
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

function show(sel, tin, tout) { tl.set(sel, { visibility: 'visible' }, tin); if (tout != null) tl.set(sel, { visibility: 'hidden' }, tout); }
function sweep(t0) {
  tl.fromTo('#sweepA', { x: 2600 }, { x: -2700, duration: .82, ease: 'power2.inOut', immediateRender: false }, t0);
  tl.fromTo('#sweepB', { x: 2600 }, { x: -2700, duration: .82, ease: 'power2.inOut', immediateRender: false }, t0 + .08);
  return t0 + .45;
}
function words(sel, t, st = .07, d = .8) { tl.fromTo(sel + ' .wi', { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: d, stagger: st, ease: 'power4.out', immediateRender: true }, t); }
function draw(sel, t, d = .9, st = 0) { tl.fromTo(sel, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, stagger: st, ease: 'power2.inOut', immediateRender: true }, t); }

/* ===== S1 — ACCROCHE (0 → 4) ===== */
show('#s1', 0, 4.1);
tl.fromTo('#s1 .cam', { scale: 1.0 }, { scale: 1.07, duration: 4.1, ease: 'none' }, 0);
tl.fromTo(FX, { a: 0 }, { a: 1, duration: 1.2, ease: 'power1.out' }, 0);
words('#s1 .lineA', .25, .08, .9);
tl.to('#s1 .ulA', { scaleX: 1, duration: .6, ease: 'expo.out' }, .95);
tl.to('#s1 .lineA .wi', { yPercent: -115, duration: .4, stagger: .03, ease: 'power3.in' }, 1.6);
tl.to('#s1 .ulA', { scaleX: 0, transformOrigin: '100% 50%', duration: .35, ease: 'power3.in' }, 1.62);
tl.fromTo('#s1 .kick', { opacity: 0, y: 20, letterSpacing: '22px' }, { opacity: 1, y: 0, letterSpacing: '10px', duration: .7 }, 1.85);
['Simple', 'Rapide', 'Sécurisé'].forEach((_, i) => {
  tl.fromTo(`#s1 .lineB span:nth-child(${i + 1})`, { opacity: 0, scale: 2.4, filter: 'blur(24px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .42, ease: 'expo.out', immediateRender: true }, 2.0 + i * .5);
});
tl.to('#s1 .lineB', { scale: .9, opacity: 0, filter: 'blur(12px)', duration: .3, ease: 'power3.in' }, 3.42);
tl.to('#s1 .kick', { opacity: 0, duration: .3 }, 3.5);
tl.fromTo('#ring1', { scale: 0 }, { scale: 26, duration: .55, ease: 'power3.in', immediateRender: true }, 3.42);

tl.to('#vignette', { opacity: .35, duration: .4 }, 3.7);
/* ===== S2 — LOGO (3.7 → 7.95) ===== */
show('#s2', 3.6, 7.97);
tl.fromTo('#s2', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(80% at 50% 50%)', duration: .5, ease: 'power3.in', immediateRender: true }, 3.62);
tl.to(FX, { a: 0, duration: .3 }, 3.8);
tl.fromTo('#s2 .cam', { scale: 1.06 }, { scale: 1.0, duration: 4.2, ease: 'power2.out' }, 3.8);
$$('#s2 .shock').forEach((s, i) => tl.fromTo(s, { scale: .3, opacity: .9 }, { scale: 3.2, opacity: 0, duration: 1.6, ease: 'expo.out', immediateRender: true }, 4.0 + i * .18));
tl.fromTo('#emblemWrap', { scale: 0, rotate: -25 }, { scale: 1, rotate: 0, duration: .9, ease: 'back.out(1.8)', immediateRender: true }, 3.95);
tl.fromTo('#emblemShadow', { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .8, immediateRender: true }, 4.1);
draw('#emblemWrap .e-blue', 4.15, .75);
draw('#emblemWrap .e-or', 4.35, .7);
tl.fromTo('#emblemWrap .e-arrow', { scale: 0, transformOrigin: '50% 60%', x: -16, y: 16 }, { scale: 1, x: 0, y: 0, duration: .5, ease: 'back.out(3)', immediateRender: true }, 4.9);
tl.fromTo('#emblemWrap .e-txt', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, immediateRender: true }, 4.95);
tl.to('#emblemWrap', { x: -440, y: 6, scale: .92, duration: .9, ease: 'power3.inOut' }, 5.35);
tl.to('#emblemShadow', { x: -440, opacity: .7, duration: .9, ease: 'power3.inOut' }, 5.35);
tl.set('#wordmark', { x: -110 }, 0);
tl.fromTo('#wordmark .deme span', { yPercent: 110, opacity: 0, rotateX: -70 }, { yPercent: 0, opacity: 1, rotateX: 0, duration: .8, stagger: .07, ease: 'expo.out', immediateRender: true }, 5.6);
tl.fromTo('#wordmark .tc', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .8, ease: 'power3.inOut', immediateRender: true }, 5.95);
tl.to('#wordmark .bar', { scaleX: 1, duration: .9, ease: 'expo.out' }, 6.2);
tl.fromTo('#wordmark .svcs', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .7, immediateRender: true }, 6.45);
tl.fromTo('#wordmark .deme span', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: .9, stagger: .09, ease: 'power2.inOut', immediateRender: true }, 6.55);
tl.fromTo('#s2 .waves', { y: 280 }, { y: 0, duration: 1.1, ease: 'expo.out', immediateRender: true }, 4.2);
draw('#s2 .wv3', 4.5, 1.4);

/* ===== S3 — GLOBE (7.95 → 11.95) ===== */
let sw = sweep(7.5);
show('#s3', sw, 11.97);
tl.set(FX, { a: .8 }, sw); tl.set('#vignette', { opacity: 1 }, sw);
tl.fromTo('#s3 .cam', { scale: 1.0 }, { scale: 1.05, duration: 4.1, ease: 'none' }, sw);
tl.fromTo('#globe', { scale: .72, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.3, ease: 'expo.out', immediateRender: true }, sw);
tl.set(G, { a: 1 }, sw);
tl.fromTo(G, { rot: -112 }, { rot: -56, duration: 4.2, ease: 'sine.inOut', immediateRender: true }, sw);
tl.fromTo(G, { p1: 0 }, { p1: 1, duration: .6, ease: 'back.out(2)', immediateRender: true }, 8.55);
tl.fromTo(G, { arc: 0 }, { arc: 1, duration: 1.9, ease: 'power2.inOut', immediateRender: true }, 8.85);
tl.fromTo(G, { p2: 0 }, { p2: 1, duration: .6, ease: 'back.out(2)', immediateRender: true }, 10.6);
tl.fromTo(G, { net: 0 }, { net: 1, duration: 1.2, ease: 'power1.out', immediateRender: true }, 9.6);
tl.fromTo('#s3 .kicker i', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'expo.out', immediateRender: true }, 8.2);
tl.fromTo('#s3 .kicker span', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .6, immediateRender: true }, 8.3);
words('#s3 h2', 8.4, .07, .85);
tl.fromTo('#s3 p', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, immediateRender: true }, 9.35);

/* ===== S4 — SERVICES (11.95 → 27.95) ===== */
sw = sweep(11.5);
show('#s4', sw, 27.97);
tl.set(FX, { a: 0 }, sw); tl.set(G, { a: 0 }, sw); tl.set('#vignette', { opacity: .35 }, sw);
tl.fromTo('#s4 .hdr', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .8, immediateRender: true }, sw + .1);
const svcT = [12, 16, 20, 24];
svcT.forEach((T, i) => {
  const id = '#v' + (i + 1);
  const tin = i === 0 ? sw : sweep(T - .45);
  show(id, tin, i < 3 ? svcT[i + 1] - .45 + .45 : null);
  tl.fromTo(`#s4 .seg:nth-child(${i + 1}) i`, { scaleX: 0 }, { scaleX: 1, duration: 4, ease: 'none', immediateRender: true }, T - .05);
  tl.fromTo(id + ' .num', { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out', immediateRender: true }, T + .0);
  tl.fromTo(id + ' .icn', { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: .7, ease: 'back.out(2)', immediateRender: true }, T + .1);
  draw(id + ' .icn .draw [pathLength]', T + .35, .8, .05);
  words(id + ' h3', T + .2, .07, .85);
  tl.to(id + ' .bar', { scaleX: 1, duration: .8, ease: 'expo.out' }, T + .55);
  tl.fromTo(id + ' p', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .8, immediateRender: true }, T + .55);
  tl.fromTo(id + ' .card', { opacity: 0, x: 140, rotateY: -22, scale: .94 }, { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 1.1, ease: 'expo.out', immediateRender: true }, T + .1);
  tl.fromTo(id + ' .card', { y: 0 }, { y: -14, duration: 3.5, ease: 'sine.inOut', immediateRender: false }, T + .6);
});

// 01 — Achat / Vente
{ const T = 12, c = '#v1 ';
  tl.fromTo(P, { t1: 0 }, { t1: 1, duration: .8, ease: 'none', immediateRender: true }, T + .85);
  tl.fromTo(c + '.tile', { opacity: 0, y: 30, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .55, stagger: .08, ease: 'back.out(1.6)', immediateRender: true }, T + 1.0);
  tl.to(c + '.cursor', { x: 567, y: 262, duration: .6, ease: 'power2.inOut' }, T + 1.7);
  tl.to(c + '.cursor', { scale: .8, duration: .08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, T + 2.32);
  tl.set(c + '.ripple', { x: 576, y: 268 }, T + 2.3);
  tl.fromTo(c + '.ripple', { scale: .3, opacity: 1 }, { scale: 2.2, opacity: 0, duration: .55, ease: 'power2.out', immediateRender: false }, T + 2.35);
  tl.to(c + '.tile:nth-child(2)', { borderColor: '#FF8A00', boxShadow: '0 20px 40px -14px rgba(255,138,0,.55)', scale: 1.03, duration: .35 }, T + 2.38);
  tl.to(c + '.tile:nth-child(2) .chk', { scale: 1, duration: .45, ease: 'back.out(3)' }, T + 2.42);
  tl.to(c + '.cursor', { x: 381, y: 622, duration: .45, ease: 'power2.inOut' }, T + 2.6);
  tl.to(c + '.cursor', { scale: .8, duration: .08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, T + 3.07);
  tl.set(c + '.ripple', { x: 390, y: 628 }, T + 3.05);
  tl.fromTo(c + '.ripple', { scale: .3, opacity: 1 }, { scale: 2.6, opacity: 0, duration: .55, ease: 'power2.out', immediateRender: false }, T + 3.1);
  tl.to(c + '.btn', { scale: .97, duration: .08, yoyo: true, repeat: 1 }, T + 3.08);
  tl.to(c + '.toast', { y: 0, duration: .6, ease: 'back.out(1.6)' }, T + 3.18);
  tl.to(c + '.cursor', { opacity: 0, duration: .3 }, T + 3.3);
  tl.to(c + '.badge', { scale: 1, duration: .4, ease: 'back.out(3)' }, T + 3.25);
}
// 02 — Sourcing
{ const T = 16, c = '#v2 ';
  tl.fromTo(P, { t2: 0 }, { t2: 1, duration: .95, ease: 'none', immediateRender: true }, T + .85);
  tl.fromTo(c + '.row', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: .6, stagger: .1, ease: 'expo.out', immediateRender: true }, T + .95);
  [4, 5, 3].forEach((n, r) => tl.to(`${c}.row:nth-child(${r + 1}) .stars .ico:nth-child(-n+${n})`, { color: '#FFB13B', duration: .2, stagger: .06 }, T + 1.25 + r * .12));
  tl.to(c + '.lens', { scale: 1, duration: .45, ease: 'back.out(2)' }, T + 1.35);
  tl.to(c + '.lens', { keyframes: [{ x: 560, y: 245, duration: .01 }, { x: 560, y: 389, duration: .4 }, { x: 560, y: 533, duration: .4 }, { x: 360, y: 400, duration: .45 }], ease: 'power2.inOut' }, T + 1.45);
  tl.to(c + '.lens', { scale: 0, duration: .35, ease: 'back.in(2)' }, T + 2.75);
  tl.to(c + '.row:nth-child(2)', { borderColor: '#FF8A00', scale: 1.035, boxShadow: '0 24px 50px -16px rgba(255,138,0,.5)', duration: .4 }, T + 2.7);
  tl.to([c + '.row:nth-child(1)', c + '.row:nth-child(3)'], { opacity: .35, duration: .4 }, T + 2.7);
  tl.to(c + '.ver', { scale: 1, duration: .5, ease: 'back.out(3)' }, T + 2.8);
  tl.fromTo(c + '.chip', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, stagger: .12, ease: 'back.out(2)', immediateRender: true }, T + 3.0);
}
// 03 — Formation
{ const T = 20, c = '#v3 ';
  tl.fromTo(c + '.playb', { scale: 0 }, { scale: 1, duration: .6, ease: 'back.out(2.5)', immediateRender: true }, T + .7);
  tl.fromTo(c + '.mod', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: .55, stagger: .1, ease: 'expo.out', immediateRender: true }, T + .9);
  tl.to(c + '.pbar .tr i', { scaleX: 1, duration: 2.0, ease: 'power1.inOut' }, T + 1.05);
  tl.fromTo(P, { pc: 0 }, { pc: 100, duration: 2.0, ease: 'power1.inOut', immediateRender: true }, T + 1.05);
  [1.4, 1.9, 2.4, 2.95].forEach((d, i) => tl.to(`${c}.mod:nth-child(${i + 1}) .f`, { scale: 1, duration: .4, ease: 'back.out(2.5)' }, T + d));
  tl.to(c + '.award', { scale: 1, rotate: 3, duration: .6, ease: 'back.out(2.2)' }, T + 3.1);
}
// 04 — Logistique
{ const T = 24, c = '#v4 ';
  tl.to(c + '.pin', { scale: 1, duration: .5, stagger: .15, ease: 'back.out(2.5)' }, T + .85);
  draw(c + '#airPathDraw', T + 1.1, 1.7);
  tl.fromTo(P, { plane: 0 }, { plane: 1, duration: 1.7, ease: 'power2.inOut', immediateRender: true }, T + 1.1);
  tl.fromTo('#vPlane', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .35, immediateRender: true }, T + 1.05);
  tl.to('#vPlane', { opacity: 0, scale: .4, duration: .3, ease: 'power2.in' }, T + 2.7);
  tl.fromTo('#vShip', { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .35, immediateRender: true }, T + .95);
  tl.fromTo(P, { ship: 0 }, { ship: 1, duration: 2.4, ease: 'power1.inOut', immediateRender: true }, T + 1.0);
  tl.to(c + '.steps .ln i', { scaleX: 1, duration: 2.2, ease: 'power1.inOut' }, T + 1.0);
  [1.0, 1.75, 2.5, 3.2].forEach((d, i) => {
    tl.to(`${c}.step:nth-child(${i + 2}) .on`, { scale: 1, duration: .45, ease: 'back.out(2.5)' }, T + d);
    tl.to(`${c}.step:nth-child(${i + 2}) .sc`, { color: '#FFFFFF', borderColor: '#1A4FD0', duration: .2 }, T + d);
    tl.to(`${c}.step:nth-child(${i + 2})`, { color: '#0A1F5C', duration: .2 }, T + d);
  });
}

/* ===== S5 — POURQUOI (27.95 → 31.95) ===== */
sw = sweep(27.5);
show('#s5', sw, 31.97);
tl.set(FX, { a: .9 }, sw); tl.set('#vignette', { opacity: 1 }, sw);
tl.fromTo('#s5 .cam', { scale: 1.0 }, { scale: 1.05, duration: 4.1, ease: 'none' }, sw);
tl.fromTo('#s5 .kicker i', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'expo.out', immediateRender: true }, 28.05);
tl.fromTo('#s5 .kicker span', { opacity: 0 }, { opacity: 1, duration: .6, immediateRender: true }, 28.1);
words('#s5 h2', 28.12, .07, .85);
$$('#s5 .vt4').forEach((el, i) => {
  tl.fromTo(el, { opacity: 0, y: 140, rotateX: -55 }, { opacity: 1, y: 0, rotateX: 0, duration: .85, ease: 'back.out(1.5)', immediateRender: true }, 28.5 + i * .25);
  draw(`#s5 .vt4:nth-child(${i + 1}) [pathLength]`, 28.75 + i * .25, .8, .05);
});
tl.fromTo('#s5 .glow', { opacity: .4, scale: .8 }, { opacity: 1, scale: 1.15, duration: 4, ease: 'sine.inOut', immediateRender: true }, 28);

/* ===== S6 — CONTACT (31.95 → 40) ===== */
sw = sweep(31.5);
show('#s6', sw);
tl.set(FX, { a: 0 }, sw); tl.set('#vignette', { opacity: .35 }, sw);
tl.fromTo('#s6 .cam', { scale: 1.04 }, { scale: 1.0, duration: 8, ease: 'power2.out' }, sw);
tl.fromTo('#s6 .waves', { y: 320 }, { y: 0, duration: 1.1, ease: 'expo.out', immediateRender: true }, 32.0);
draw('#s6 .wv3', 32.4, 1.4);
tl.fromTo('#s6 .brand6', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .8, immediateRender: true }, 32.1);
tl.fromTo('#s6 .kicker i', { scaleX: 0 }, { scaleX: 1, duration: .6, ease: 'expo.out', immediateRender: true }, 32.25);
tl.fromTo('#s6 .kicker span', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .6, immediateRender: true }, 32.3);
words('#s6 h2', 32.35, .06, .85);
$$('#s6 .ct').forEach((el, i) => {
  tl.fromTo(el, { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: .8, ease: 'expo.out', immediateRender: true }, 33.0 + i * .28);
  tl.fromTo(el.querySelector('.ci'), { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: .6, ease: 'back.out(2.5)', immediateRender: true }, 33.0 + i * .28);
});
tl.fromTo('#s6 .qrc', { opacity: 0, y: 80, rotateY: 35, transformPerspective: 1400 }, { opacity: 1, y: 0, rotateY: 0, duration: 1.1, ease: 'expo.out', immediateRender: true }, 32.7);
tl.fromTo('#s6 .cor', { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, stagger: .06, ease: 'back.out(2)', immediateRender: true }, 33.3);
tl.fromTo('#s6 .tag', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power1.inOut', immediateRender: true }, 34.0);
tl.fromTo('#s6 .qrc', { y: 0 }, { y: -12, duration: 3, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, 33.8);
tl.to('#fade', { opacity: 1, duration: .5, ease: 'power1.in' }, 39.5);
tl.set({}, {}, DURATION);

/* ---------- mises à jour dérivées (texte, trajets) ---------- */
const typed = $$('.typed');
const airPath = $('#airPath'), airLen = airPath.getTotalLength();
const seaPath = $('#seaPath'), seaLen = seaPath.getTotalLength();
const plane = $('#vPlane'), ship = $('#vShip');
function updaters(t) {
  typed[0].textContent = typed[0].dataset.text.slice(0, Math.round(P.t1 * typed[0].dataset.text.length));
  typed[1].textContent = typed[1].dataset.text.slice(0, Math.round(P.t2 * typed[1].dataset.text.length));
  $$('.caret').forEach(c => c.style.opacity = (Math.floor(t * 2.6) % 2 === 0 || (t > 12.8 && t < 13.7) || (t > 16.8 && t < 17.8)) ? 1 : 0);
  $('#v3 .pc').textContent = Math.round(P.pc) + '%';
  $('#v3 .playb').style.boxShadow = `0 0 0 ${10 + 12 * (0.5 + 0.5 * Math.sin(t * 6))}px rgba(255,138,0,.22)`;
  const a = airPath.getPointAtLength(P.plane * airLen), b = airPath.getPointAtLength(Math.min(airLen, P.plane * airLen + 2));
  const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  plane.style.transform = `translate(${a.x - 33}px,${a.y - 33}px)`;
  plane.firstElementChild.style.transform = `rotate(${ang + 45}deg)`;
  const s = seaPath.getPointAtLength(P.ship * seaLen);
  ship.style.transform = `translate(${s.x - 33}px,${s.y - 33 + Math.sin(t * 5) * 3}px)`;
  const st = $('#v4 .st');
  st.textContent = t < 25.0 ? 'Suivi de votre colis' : t < 27.2 ? 'En transit…' : 'Livré à destination ✓';
  const sc = $('#s6 .scan');
  if (t > 33.9) { sc.style.opacity = 1; const ph = (t - 33.9) / 1.6; sc.style.top = (16 + 292 * (0.5 - 0.5 * Math.cos(ph * Math.PI * 2 + Math.PI))) + 'px'; } else sc.style.opacity = 0;
  const pn = t < 15.95 ? '01' : t < 19.95 ? '02' : t < 23.95 ? '03' : '04';
  $('#s4 .pn').textContent = pn;
}

/* ---------- particules / réseau (scènes sombres) ---------- */
const fx = $('#fx'), fctx = fx.getContext('2d');
fx.style.mixBlendMode = 'screen';
const rnd = mulberry(7);
const parts = Array.from({ length: 80 }, () => ({ x: rnd() * 2120, y: rnd() * 1280, vx: (rnd() - .5) * 40, vy: (rnd() - .5) * 30, r: .8 + rnd() * 2.4, o: .25 + rnd() * .6, ph: rnd() * 6.28 }));
function drawFX(t) {
  fctx.clearRect(0, 0, 1920, 1080);
  if (FX.a <= 0.001) return;
  const pts = parts.map(p => [((p.x + p.vx * t) % 2120 + 2120) % 2120 - 100, ((p.y + p.vy * t) % 1280 + 1280) % 1280 - 100, p]);
  fctx.lineWidth = 1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], d = Math.hypot(dx, dy);
    if (d < 200) { fctx.strokeStyle = `rgba(120,165,255,${(1 - d / 200) * .18 * FX.a})`; fctx.beginPath(); fctx.moveTo(pts[i][0], pts[i][1]); fctx.lineTo(pts[j][0], pts[j][1]); fctx.stroke(); }
  }
  for (const [x, y, p] of pts) {
    const tw = .6 + .4 * Math.sin(t * 2 + p.ph);
    fctx.fillStyle = `rgba(170,200,255,${p.o * tw * FX.a})`; fctx.beginPath(); fctx.arc(x, y, p.r, 0, 6.283); fctx.fill();
  }
}

/* ---------- globe ---------- */
const gc = $('#globe'), g = gc.getContext('2d');
const R = 400, CX = 500, CY = 500;
const proj = d3.geoOrthographic().scale(R).translate([CX, CY]).clipAngle(90).precision(.3);
const gpath = d3.geoPath(proj, g);
const grat = d3.geoGraticule10();
const CHN = [113.26, 23.13], CIV = [-4.02, 5.35];
const extra = [[[121.47, 31.23], [3.38, 6.52]], [[120.07, 29.31], [-17.45, 14.69]], [[114.06, 22.54], [55.27, 25.2]], [[116.4, 39.9], [36.82, -1.29]]];
function arcPts(a, b, n = 90) { const ip = d3.geoInterpolate(a, b); return Array.from({ length: n + 1 }, (_, i) => ip(i / n)); }
const mainArc = arcPts(CHN, CIV, 140), extraArcs = extra.map(([a, b]) => arcPts(a, b, 80));
function lifted(pt, s, center, h = .16) {
  if (d3.geoDistance(pt, center) > Math.PI / 2 + .12) return null;
  const p = proj.clipAngle(null)(pt); proj.clipAngle(90);
  const k = 1 + h * Math.sin(Math.PI * s);
  return [CX + (p[0] - CX) * k, CY + (p[1] - CY) * k];
}
function drawArc(pts, prog, center, style, width, h) {
  const n = Math.floor((pts.length - 1) * prog); if (n < 1) return null;
  g.beginPath(); let started = false, last = null;
  for (let i = 0; i <= n; i++) {
    const q = lifted(pts[i], i / (pts.length - 1), center, h);
    if (!q) { started = false; continue; }
    if (!started) { g.moveTo(q[0], q[1]); started = true; } else g.lineTo(q[0], q[1]);
    last = q;
  }
  g.strokeStyle = style; g.lineWidth = width; g.stroke();
  return last;
}
function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function pin(ll, k, label, t, center, side) {
  if (k <= 0 || d3.geoDistance(ll, center) > Math.PI / 2) return;
  const [x, y] = proj(ll);
  for (let i = 0; i < 2; i++) {
    const ph = ((t * .9 + i * .5) % 1);
    g.strokeStyle = `rgba(255,160,40,${(1 - ph) * .8 * Math.min(1, k)})`; g.lineWidth = 3;
    g.beginPath(); g.arc(x, y, 8 + ph * 46, 0, 6.283); g.stroke();
  }
  g.save(); g.translate(x, y); g.scale(k, k);
  g.shadowColor = 'rgba(255,138,0,.9)'; g.shadowBlur = 24;
  g.fillStyle = '#FF8A00'; g.beginPath(); g.arc(0, 0, 11, 0, 6.283); g.fill();
  g.shadowBlur = 0; g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 4.5, 0, 6.283); g.fill();
  g.font = '800 24px Montserrat'; const tw = g.measureText(label).width + 36;
  const lx = side > 0 ? 24 : -24 - tw, ly = -62;
  g.fillStyle = 'rgba(255,255,255,.96)'; rr(lx, ly, tw, 46, 14); g.fill();
  g.fillStyle = '#0A1F5C'; g.fillText(label, lx + 18, ly + 32);
  g.restore();
}
function drawGlobe(t) {
  g.clearRect(0, 0, 1000, 1000);
  if (G.a <= 0) return;
  proj.rotate([G.rot, G.tilt]);
  const center = [-G.rot, -G.tilt];
  // halo
  let gr = g.createRadialGradient(CX, CY, R * .9, CX, CY, R * 1.22);
  gr.addColorStop(0, 'rgba(70,130,255,.45)'); gr.addColorStop(1, 'rgba(70,130,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, R * 1.25, 0, 6.283); g.fill();
  // sphère
  gr = g.createRadialGradient(CX - 140, CY - 160, 20, CX, CY, R);
  gr.addColorStop(0, '#2457cf'); gr.addColorStop(.55, '#0e2b78'); gr.addColorStop(1, '#06143f');
  g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, R, 0, 6.283); g.fill();
  g.beginPath(); gpath(grat); g.strokeStyle = 'rgba(140,180,255,.10)'; g.lineWidth = 1; g.stroke();
  // continents (points)
  for (const d of LAND_DOTS) {
    const dist = d3.geoDistance(d, center); if (dist > 1.5708) continue;
    const p = proj(d); const c = Math.cos(dist);
    g.fillStyle = `rgba(${150 + 80 * c | 0},${190 + 50 * c | 0},255,${.25 + .7 * c})`;
    g.fillRect(p[0] - 1.9, p[1] - 1.9, 3.8, 3.8);
  }
  // reflet + bord
  gr = g.createRadialGradient(CX - 160, CY - 180, 0, CX - 160, CY - 180, R * 1.1);
  gr.addColorStop(0, 'rgba(255,255,255,.16)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(CX, CY, R, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(150,190,255,.45)'; g.lineWidth = 2; g.beginPath(); g.arc(CX, CY, R, 0, 6.283); g.stroke();
  // arcs secondaires
  if (G.net > 0) extraArcs.forEach((pts, i) => drawArc(pts, Math.min(1, G.net * 1.3 - i * .1), center, `rgba(120,170,255,${.45 * G.net})`, 2, .1));
  // arc principal
  if (G.arc > 0) {
    g.save(); g.shadowColor = 'rgba(255,138,0,.9)'; g.shadowBlur = 18; g.lineCap = 'round';
    const head = drawArc(mainArc, G.arc, center, '#FF9A1F', 5, .2);
    g.restore();
    if (head && G.arc < 1) {
      g.save(); g.shadowColor = '#fff'; g.shadowBlur = 30; g.fillStyle = '#fff';
      g.beginPath(); g.arc(head[0], head[1], 8, 0, 6.283); g.fill(); g.restore();
    }
  }
  pin(CHN, G.p1, 'CHINE', t, center, -1);
  pin(CIV, G.p2, "CÔTE D'IVOIRE", t, center, 1);
}

/* ---------- grain ---------- */
const gn = $('#grain'), gnx = gn.getContext('2d');
const grains = Array.from({ length: 6 }, (_, k) => {
  const r = mulberry(100 + k), im = gnx.createImageData(960, 540);
  for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255 | 0; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  return im;
});

/* ---------- rendu ---------- */
window.renderAt = (t) => {
  tl.seek(t, true);
  updaters(t);
  drawFX(t);
  drawGlobe(t);
  gnx.putImageData(grains[Math.floor(t * 30) % grains.length], 0, 0);
};
window.READY = Promise.all([document.fonts.load('900 60px Montserrat'), document.fonts.load('500 60px Montserrat'), document.fonts.load('700 60px Dancing')]).then(() => document.fonts.ready).then(() => { placeUnderline(); renderAt(0); return true; });

if (!/render/.test(location.search)) {
  window.READY.then(() => {
    const m = location.hash.match(/t=([\d.]+)/); let t0 = performance.now() - (m ? +m[1] * 1000 : 0);
    const loop = () => { const t = ((performance.now() - t0) / 1000) % DURATION; renderAt(t); requestAnimationFrame(loop); };
    loop();
  });
}
})();
