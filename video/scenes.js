// Contenu visuel des scènes. Temps relatifs : bN = début de la phrase N, eN = fin, s = début de scène, end = fin.
(function () {
  const P = {
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    bank: '<path d="M3 21h18M4 10h16M12 3l8 5H4z M6 10v8M10 10v8M14 10v8M18 10v8"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    shop: '<path d="M3 9l1.5-5h15L21 9M3 9h18M3 9a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0M5 12v9h14v-9M10 21v-5h4v5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c3 .3 5.5 2.4 5.5 5.8"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5-7-5 0 3 2.5 5 7 5z"/>',
    hourglass: '<path d="M6 2h12M6 22h12M7 2c0 6 10 6 10 10S7 16 7 22M17 2c0 6-10 6-10 10s10 4 10 10"/>',
    detour: '<path d="M4 20V10a4 4 0 0 1 4-4h9M14 3l3 3-3 3"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.6 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    doc: '<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6"/>',
  };
  const ICON = (n, s = 48, c = 'currentColor', w = 2.2) =>
    `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
  window.ICON = ICON;

  const circ = (n, size, bg, fg = '#fff', is = 0.5) =>
    `<div class="center" style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};flex:none">${ICON(n, size * is, fg)}</div>`;

  // QR décoratif (non scannable)
  function qr(size, seed = 7, color = '#14213D') {
    const n = 21, c = size / n; let r = seed, out = '';
    const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    const finder = (x, y) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      if (rnd() > 0.52) out += `<rect x="${x * c}" y="${y * c}" width="${c + .4}" height="${c + .4}"/>`;
    }
    const f = (x, y) => `<rect x="${x * c + c / 2}" y="${y * c + c / 2}" width="${6 * c}" height="${6 * c}" fill="none" stroke="${color}" stroke-width="${c}"/><rect x="${(x + 2) * c}" y="${(y + 2) * c}" width="${3 * c}" height="${3 * c}"/>`;
    return `<svg width="${size}" height="${size}" fill="${color}">${out}${f(0, 0)}${f(n - 7, 0)}${f(0, n - 7)}</svg>`;
  }

  function avatar(kind, s = 84) {
    const skin = kind === 'awa' ? '#8D5524' : kind === 'adjoua' ? '#A0663A' : '#6B3E1E';
    const cloth = kind === 'awa' ? '#F77F00' : kind === 'adjoua' ? '#7C3AED' : '#009E60';
    const hair = kind === 'awa'
      ? `<path d="M22 30c0-14 10-22 18-22s18 8 18 22c-4-6-10-9-18-9s-14 3-18 9z" fill="#F77F00"/><circle cx="40" cy="9" r="7" fill="#F77F00"/>`
      : kind === 'adjoua' ? `<path d="M22 32c0-14 8-22 18-22s18 8 18 22c-3-7-10-10-18-10s-15 3-18 10z" fill="#2B1A10"/>`
        : `<path d="M24 26c2-10 9-14 16-14s14 4 16 14c-5-4-10-5-16-5s-11 1-16 5z" fill="#1E120A"/>`;
    return `<svg width="${s}" height="${s}" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#FFE2BF"/>
      <path d="M14 80c2-16 13-24 26-24s24 8 26 24z" fill="${cloth}"/>
      <circle cx="40" cy="34" r="18" fill="${skin}"/>${hair}
      <circle cx="33.5" cy="34" r="2.2" fill="#1B1B1B"/><circle cx="46.5" cy="34" r="2.2" fill="#1B1B1B"/>
      <path d="M33 41.5c4 3.5 10 3.5 14 0" stroke="#1B1B1B" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
  }

  const miniPhone = (label, color, x, y, inner = '') => `
    <div class="abs" style="left:${x}px;top:${y}px;width:130px;text-align:center">
      <div style="width:130px;height:230px;border-radius:24px;background:#1B2333;padding:8px">
        <div style="width:100%;height:100%;border-radius:18px;background:#F7F8FB;overflow:hidden">
          <div style="height:44px;background:${color}"></div>
          <div class="center" style="height:160px">${inner}</div>
        </div>
      </div>
      <div class="chip" style="margin-top:12px;font-size:21px;padding:6px 12px">${label}</div>
    </div>`;
  const qmark = (x, y, s = 84) => `<div class="abs center" data-anim="pop" data-in="s+0" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:var(--red);color:#fff;font-weight:900;font-size:${s * .6}px">?</div>`;

  function phone(id, title, color, x, y, screens, w = 280, h = 560) {
    return `<div class="phone" id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="scr"><div class="notch"></div>
      <div class="bar" style="background:${color}">${title}</div>${screens}</div></div>`;
  }

  const flags = {
    'Bénin': '<rect width="48" height="32" fill="#E8112D"/><rect width="48" height="16" fill="#FCD116"/><rect width="19" height="32" fill="#008751"/>',
    'Burkina Faso': '<rect width="48" height="32" fill="#009E49"/><rect width="48" height="16" fill="#EF2B2D"/><circle cx="24" cy="16" r="5" fill="#FCD116"/>',
    "Côte d'Ivoire": '<rect width="16" height="32" fill="#F77F00"/><rect x="16" width="16" height="32" fill="#fff"/><rect x="32" width="16" height="32" fill="#009E60"/>',
    'Guinée-Bissau': '<rect width="48" height="32" fill="#009E49"/><rect width="48" height="16" fill="#FCD116"/><rect width="18" height="32" fill="#CE1126"/><circle cx="9" cy="16" r="4" fill="#000"/>',
    'Mali': '<rect width="16" height="32" fill="#14B53A"/><rect x="16" width="16" height="32" fill="#FCD116"/><rect x="32" width="16" height="32" fill="#CE1126"/>',
    'Niger': '<rect width="48" height="11" fill="#E05206"/><rect y="11" width="48" height="10" fill="#fff"/><rect y="21" width="48" height="11" fill="#0DB02B"/><circle cx="24" cy="16" r="3.5" fill="#E05206"/>',
    'Sénégal': '<rect width="16" height="32" fill="#00853F"/><rect x="16" width="16" height="32" fill="#FDEF42"/><rect x="32" width="16" height="32" fill="#E31B23"/><circle cx="24" cy="16" r="3.5" fill="#00853F"/>',
    'Togo': '<rect width="48" height="32" fill="#006A4E"/><rect y="6.4" width="48" height="6.4" fill="#FFCE00"/><rect y="19.2" width="48" height="6.4" fill="#FFCE00"/><rect width="19" height="19.2" fill="#D21034"/><circle cx="9.5" cy="9.6" r="3.5" fill="#fff"/>',
  };
  const flag = (n, s = 1) => `<svg width="${48 * s}" height="${32 * s}" viewBox="0 0 48 32" style="border-radius:4px;box-shadow:0 0 0 1.5px #0002;flex:none">${flags[n]}</svg>`;

  const S = {};

  /* ---------------- 1. INTRO ---------------- */
  S.intro = {
    html: `
    <div class="abs card" data-in="b0-0.3" data-out="b3-0.2" style="left:100px;top:170px;width:520px;height:600px">
      ${miniPhone('Wave', '#5B8DEF', 70, 70, ICON('send', 60, '#5B8DEF'))}
      ${miniPhone('Orange Money', '#F29A3D', 320, 70, ICON('coin', 60, '#F29A3D'))}
      <svg class="abs" style="left:205px;top:180px" width="110" height="20"><path d="M0 10H110" stroke="#C9CFDA" stroke-width="6" stroke-dasharray="12 10"/></svg>
      ${qmark(218, 145)}
      <div class="abs h3" style="left:0;right:0;top:450px;text-align:center;padding:0 30px">Wave → Orange&nbsp;Money&nbsp;?</div>
    </div>
    <div class="abs card" data-in="b1-0.2" data-out="b3-0.2" style="left:700px;top:170px;width:520px;height:600px">
      <div class="abs center" style="left:60px;top:90px;width:200px;height:200px;border-radius:40px;background:#FFF1DE">${ICON('shop', 130, '#F77F00', 1.8)}</div>
      ${miniPhone('Mon appli', '#7C3AED', 320, 70, ICON('qr', 64, '#7C3AED'))}
      <div class="abs" style="left:228px;top:290px">${qmark(0, 0, 76).replace('data-in="s+0"', 'data-in="b1+0.3"')}</div>
      <div class="abs h3" style="left:0;right:0;top:450px;text-align:center;padding:0 30px">Payer un commerçant ?</div>
    </div>
    <div class="abs card" data-in="b2-0.2" data-out="b3-0.2" style="left:1300px;top:170px;width:520px;height:600px">
      <div class="abs center" style="left:50px;top:90px;width:200px;height:200px;border-radius:40px;background:#E3EEFF">${ICON('bank', 130, '#2563EB', 1.8)}</div>
      ${miniPhone('Mobile money', '#0E9AA7', 320, 70, ICON('phone', 64, '#0E9AA7'))}
      <div class="abs" style="left:228px;top:290px">${qmark(0, 0, 76).replace('data-in="s+0"', 'data-in="b2+0.3"')}</div>
      <div class="abs h3" style="left:0;right:0;top:450px;text-align:center;padding:0 30px">Banque → Mobile money ?</div>
    </div>

    <div class="abs col" style="left:0;right:0;top:170px;align-items:center">
      <div data-in="b3" data-anim="pop">${circ('bolt', 150, 'var(--orange)', '#fff', .55)}</div>
      <div data-in="b3+0.35" data-anim="zoom" style="font-size:230px;font-weight:900;letter-spacing:-6px;line-height:1;margin-top:20px">
        <span class="orange">PI</span><span style="color:#C9CFDA">-</span><span class="green">SPI</span></div>
      <div data-in="b3+0.9" class="h3 muted" style="margin-top:22px">Le paiement instantané, pour tout le monde</div>
      <div data-in="b4" data-anim="pop" class="pill" style="margin-top:44px;background:var(--ink);color:#fff">${ICON('clock', 34, '#fff')} Tout comprendre en 5 minutes</div>
    </div>`,
  };

  /* ---------------- 2. AVANT ---------------- */
  S.avant = {
    html: `
    <div class="abs" data-in="b0-0.4" data-anim="fade" data-out="b2-0.2" style="left:140px;top:130px;width:1640px;height:720px;border-radius:44px;background:#CFE6FF;overflow:hidden">
      <svg class="abs" style="left:0;top:0" width="1640" height="720">
        ${[120, 300, 480, 640].map(y => `<path d="M40 ${y} q40 -18 80 0 t80 0 t80 0" stroke="#A9CCF5" stroke-width="5" fill="none"/>`).join('')}
        ${[200, 420, 560].map(y => `<path d="M1300 ${y} q40 -18 80 0 t80 0 t80 0" stroke="#A9CCF5" stroke-width="5" fill="none"/>`).join('')}
      </svg>
    </div>
    <div class="island" data-in="b0+0.2" data-anim="pop" data-out="b2-0.2" style="left:250px;top:190px">${ICON('bank', 56, '#2563EB')}Banque A</div>
    <div class="island" data-in="b0+0.6" data-anim="pop" data-out="b2-0.2" style="left:1410px;top:200px">${ICON('phone', 56, '#0E9AA7')}Mobile money 1</div>
    <div class="island" data-in="b0+1.0" data-anim="pop" data-out="b2-0.2" style="left:280px;top:600px">${ICON('phone', 56, '#7C3AED')}Mobile money 2</div>
    <div class="island" data-in="b0+1.4" data-anim="pop" data-out="b2-0.2" style="left:1390px;top:610px">${ICON('bank', 56, '#009E60')}Banque B</div>
    <svg class="abs" style="left:0;top:0" width="1920" height="1080" data-out="b2-0.2" data-anim="none">
      <path data-in="b1" data-anim="draw" data-dur="3" d="M520 290 C 760 300, 560 520, 760 560 S 1000 230, 1120 330 S 1150 650, 1390 690" stroke="#E63946" stroke-width="8" stroke-dasharray="1" fill="none" stroke-linecap="round"/>
    </svg>
    <div class="abs pill" data-in="b1+0.7" data-anim="pop" data-out="b2-0.2" style="left:560px;top:470px;background:#fff;color:var(--red)">${ICON('detour', 34)} Détours</div>
    <div class="abs pill" data-in="b1+1.6" data-anim="pop" data-out="b2-0.2" style="left:870px;top:200px;background:#fff;color:var(--red)">${ICON('cash', 34)} Frais</div>
    <div class="abs pill" data-in="b1+2.6" data-anim="pop" data-out="b2-0.2" style="left:1080px;top:560px;background:#fff;color:var(--red)">${ICON('hourglass', 34)} Attente</div>

    <div class="abs card" data-in="b2" style="left:260px;top:150px;width:1400px;height:680px;overflow:hidden">
      <div class="abs" style="left:0;right:0;top:0;height:110px;background:repeating-linear-gradient(90deg,#F77F00 0 100px,#fff 100px 200px)"></div>
      <div class="abs h3" style="left:0;right:0;top:140px;text-align:center">Chez le commerçant : un QR code par opérateur…</div>
      ${[0, 1, 2, 3].map(i => `<div class="abs col" data-in="b2+${0.4 + i * 0.35}" data-anim="pop" style="left:${70 + i * 235}px;top:240px;align-items:center;gap:10px">
          <div class="card center" style="width:200px;height:200px;border:6px solid ${['#5B8DEF', '#F29A3D', '#E2B100', '#7C3AED'][i]}">${qr(160, 11 + i * 7)}</div>
          <div class="chip" style="font-size:22px">Opérateur ${i + 1}</div></div>`).join('')}
      <div class="abs" style="left:0;right:0;top:520px;height:160px;background:#8B5A2B"></div>
      <div class="abs" data-in="b2+1.8" data-anim="up" style="left:1150px;top:250px">${avatar('koffi', 170)}</div>
      <div class="abs card h3" data-in="b2+2.2" data-anim="pop" style="left:1030px;top:440px;padding:16px 24px;font-size:30px;background:#FFF6EA">Lequel je scanne ?</div>
    </div>`,
  };

  /* ---------------- 3. DEFINITION ---------------- */
  S.definition = {
    html: `
    <div class="abs col" data-out="b3-0.2" style="left:220px;top:170px;gap:34px">
      <div class="row" data-in="b0" data-anim="left" style="gap:30px">
        <div class="center" style="width:210px;height:120px;border-radius:26px;background:var(--orange);color:#fff;font-size:80px;font-weight:900">PI</div>
        <div class="h2"><span class="orange">P</span>lateforme <span id="w-interop" style="padding:0 8px;border-radius:12px"><span class="orange">I</span>nteropérable</span></div>
      </div>
      <div class="row" data-in="b0+1.2" data-anim="left" style="gap:30px">
        <div class="center" style="width:210px;height:120px;border-radius:26px;background:var(--green);color:#fff;font-size:80px;font-weight:900">SPI</div>
        <div class="h2"><span class="green">S</span>ystème de <span class="green">P</span>aiement <span id="w-inst" style="padding:0 8px;border-radius:12px"><span class="green">I</span>nstantané</span></div>
      </div>
    </div>
    <div class="abs card row" data-in="b1+0.3" data-out="b2-0.2" style="left:220px;top:520px;width:1480px;height:230px;padding:0 50px;gap:44px">
      <svg width="190" height="150" viewBox="0 0 190 150" style="flex:none">
        <path d="M35 40L155 40L95 120Z" stroke="#F77F00" stroke-width="6" fill="none" stroke-dasharray="10 8"/>
        <circle cx="35" cy="40" r="28" fill="#2563EB"/><circle cx="155" cy="40" r="28" fill="#0E9AA7"/><circle cx="95" cy="120" r="28" fill="#7C3AED"/>
      </svg>
      <div><div class="h2 orange">Interopérable</div><div class="h3" style="font-weight:700;margin-top:8px">= tout le monde échange avec tout le monde</div></div>
    </div>
    <div class="abs card row" data-in="b2" data-out="b3-0.2" style="left:220px;top:520px;width:1480px;height:230px;padding:0 50px;gap:44px">
      <div style="position:relative;flex:none">${circ('clock', 150, 'var(--green)', '#fff', .6)}</div>
      <div><div class="h2 green">Instantané</div><div class="h3" style="font-weight:700;margin-top:8px">= l'argent arrive en quelques secondes</div></div>
    </div>

    <div class="abs" data-in="b3-0.1" data-anim="fade" data-out="b4-0.2" style="left:0;top:0;width:1920px;height:1080px">
      <div class="abs" style="left:0;right:0;top:640px;height:240px;background:#CFE6FF"></div>
      <div class="island" style="left:110px;top:520px;width:360px;height:220px">${ICON('phone', 64, '#2563EB')}Mon compte</div>
      <div class="island" style="left:1450px;top:520px;width:360px;height:220px">${ICON('phone', 64, '#009E60')}Son compte</div>
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        <path data-in="b3+0.1" data-anim="draw" data-dur="1.4" d="M420 600 Q 960 180 1500 600" stroke="#F77F00" stroke-width="26" fill="none" stroke-linecap="round"/>
        <path data-in="b3+0.9" data-anim="draw" data-dur="1" d="M560 520 V640 M760 420 V660 M960 390 V660 M1160 420 V660 M1360 520 V640" stroke="#C26300" stroke-width="10" fill="none"/>
      </svg>
      <div class="abs pill" data-in="b3+1.2" data-anim="pop" style="left:830px;top:250px;background:var(--ink);color:#fff;font-size:40px;padding:12px 30px">PI-SPI</div>
      <div class="abs" id="bridgeCoin" style="left:0;top:0;opacity:0">${circ('coin', 70, 'var(--yellow)', '#7A5200', .7)}</div>
    </div>

    <div class="abs col" style="left:0;right:0;top:170px;align-items:center">
      <div class="card col" data-in="b4" data-anim="pop" style="width:1240px;padding:44px 60px;align-items:center;gap:18px">
        ${circ('bank', 140, 'var(--ink)', '#fff', .55)}
        <div class="h1">BCEAO</div>
        <div class="h3 muted" style="font-weight:700;text-align:center">Banque Centrale des États de l'Afrique de l'Ouest</div>
        <div class="row" data-in="b4+2.6" style="gap:18px;margin-top:10px">
          <div class="pill" style="background:#FFF1DE;color:var(--orange)">${ICON('globe', 34)} 8 pays de l'UEMOA</div>
          <div class="pill" style="background:#E4F6EE;color:var(--green)">${flag("Côte d'Ivoire", 1)} dont la Côte d'Ivoire</div>
        </div>
      </div>
      <div class="pill" data-in="b5" data-anim="pop" style="margin-top:34px;background:var(--orange);color:#fff;font-size:36px;padding:16px 34px">${ICON('calendar', 40, '#fff')} Lancé le 30 septembre 2025</div>
    </div>`,
    update(t, at, el) {
      const { clamp, easeInOut } = window.EASE;
      const hi = (id, a, b, col) => {
        const n = el.querySelector(id); const on = t >= a && t < b;
        n.style.background = on ? col : 'transparent';
      };
      hi('#w-interop', at('b1'), at('b2'), '#FFE2BF');
      hi('#w-inst', at('b2'), at('b3'), '#CDEFE0');
      const c = el.querySelector('#bridgeCoin');
      const t0 = at('b3+1.6'), per = 2.4;
      if (t > t0 && t < at('b4')) {
        const u = easeInOut(((t - t0) % per) / per);
        const x = 420 + 1080 * u, y = (1 - u) * (1 - u) * 600 + 2 * (1 - u) * u * 180 + u * u * 600;
        c.style.opacity = 1; c.style.transform = `translate(${x - 35}px,${y - 80}px)`;
      } else c.style.opacity = 0;
    },
  };

  /* ---------------- 4. QUI ---------------- */
  const QL = [[680, 280], [1240, 300], [680, 695], [1240, 705]];
  S.qui = {
    html: `
    <div class="abs" data-out="b3-0.2" data-anim="none" style="left:0;top:0;width:1920px;height:1080px">
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        ${QL.map((p, i) => `<path data-in="${['b0', 'b1', 'b2', 'b2+1.4'][i]}" data-anim="draw" data-dur="0.8" d="M960 480 L${p[0]} ${p[1]}" stroke="#F2C894" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
        <g id="pulses">${QL.map(() => '<circle r="11" fill="#F77F00" opacity="0"/>').join('')}</g>
      </svg>
      <div class="abs center" data-in="s+0.1" data-anim="pop" style="left:830px;top:350px;width:260px;height:260px;border-radius:50%;background:var(--orange);color:#fff;font-size:56px;font-weight:900;box-shadow:0 0 0 22px #FFE2BF">PI-SPI</div>
      <div class="abs card row" data-in="b0" data-anim="left" style="left:160px;top:180px;width:520px;height:200px;padding:0 36px;gap:28px">
        ${circ('bank', 120, '#2563EB')}<div class="h2">Banques</div></div>
      <div class="abs card col" data-in="b1" data-anim="right" style="left:1240px;top:150px;width:560px;height:310px;padding:30px 34px;gap:18px">
        <div class="row" style="gap:22px">${circ('phone', 90, 'var(--teal)')}<div class="h2">Mobile money</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave'].map((n, i) => `<div class="chip" data-in="b1+${1.3 + i * 0.5}" data-anim="pop" style="justify-content:center">${n}</div>`).join('')}
        </div></div>
      <div class="abs card row" data-in="b2" data-anim="left" style="left:160px;top:600px;width:520px;height:190px;padding:0 36px;gap:28px">
        ${circ('sprout', 110, 'var(--green)')}<div class="h2">Microfinance</div></div>
      <div class="abs card row" data-in="b2+1.4" data-anim="right" style="left:1240px;top:615px;width:560px;height:180px;padding:0 36px;gap:28px">
        ${circ('doc', 110, 'var(--violet)')}<div class="h2">Trésor public</div></div>
    </div>
    <div class="abs col" style="left:0;right:0;top:190px;align-items:center">
      <div class="card col" data-in="b3" data-anim="pop" style="width:1100px;padding:50px;align-items:center">
        <div style="font-size:200px;font-weight:900;line-height:1;letter-spacing:-6px" class="orange"><span data-count="170" data-countat="b3+0.2" data-cdur="2">0</span>+</div>
        <div class="h3" style="text-align:center;margin-top:14px">établissements autorisés à proposer PI-SPI<br>dans l'UEMOA</div>
        <div class="p" style="margin-top:14px">au 30 septembre 2026</div>
      </div>
    </div>`,
    update(t, at, el) {
      const cs = el.querySelectorAll('#pulses circle');
      const starts = [at('b0+0.8'), at('b1+0.8'), at('b2+0.8'), at('b2+2.2')];
      cs.forEach((c, i) => {
        if (t < starts[i]) { c.setAttribute('opacity', 0); return; }
        const u = ((t - starts[i]) * 0.55 + i * 0.25) % 1;
        const dir = Math.floor((t - starts[i]) * 0.55 + i * 0.25) % 2 ? 1 - u : u;
        const [x, y] = QL[i];
        c.setAttribute('cx', 960 + (x - 960) * dir); c.setAttribute('cy', 480 + (y - 480) * dir);
        c.setAttribute('opacity', 1);
      });
    },
  };

  /* ---------------- 5. EXEMPLE ---------------- */
  const steps = ['Ouvrir l’appli', 'Numéro + montant', 'Vérifier', 'Confirmer'];
  const awaScreens = `
    <div class="view" data-out="b3-0.1" data-anim="none">
      <div style="font-size:20px;font-weight:700" class="muted">Bonjour Awa</div>
      <div style="font-size:34px;font-weight:900;margin:6px 0 22px">25 000 F</div>
      <div class="btn" id="btnSend" style="background:#5B8DEF;position:relative">Envoyer de l'argent</div>
      <div class="btn" style="background:#E7ECF5;color:#5B6476;margin-top:14px">Payer</div>
      <div class="btn" style="background:#E7ECF5;color:#5B6476;margin-top:14px">Historique</div>
      <div id="tap" class="abs" style="left:150px;top:120px;width:60px;height:60px;border-radius:50%;border:5px solid #5B8DEF;opacity:0"></div>
    </div>
    <div class="view col" data-in="b3" data-anim="right" data-out="b4" style="gap:16px">
      <div style="font-size:24px;font-weight:900">Envoyer de l'argent</div>
      <div class="field"><label>Numéro du bénéficiaire</label><span data-type="b3+0.9" data-tdur="1.3">07 01 02 03 04</span></div>
      <div class="pill" data-in="b3+2.3" style="font-size:16px;padding:6px 12px;background:#FFF1DE;color:#C26300;align-self:flex-start">Réseau : Orange Money</div>
      <div class="field"><label>Montant</label><span data-type="b3+2.4" data-tdur="0.7">5 000 F</span></div>
    </div>
    <div class="view col" data-in="b4" data-anim="right" data-out="b5" style="gap:14px">
      <div style="font-size:24px;font-weight:900">Vérifiez bien</div>
      ${[['Bénéficiaire', 'Koffi K.'], ['Montant', '5 000 F'], ['Frais', '0 F']].map(([a, b], i) => `
        <div class="field row" style="justify-content:space-between"><div><label>${a}</label>${b}</div>
        <div data-in="b4+${0.6 + i * 0.6}" data-anim="pop">${circ('check', 34, 'var(--green)', '#fff', .7)}</div></div>`).join('')}
    </div>
    <div class="view col" data-in="b5" data-anim="right" data-out="b6+0.2" style="align-items:center;gap:22px">
      <div style="font-size:24px;font-weight:900">Code secret</div>
      <div class="row" style="gap:16px">${[0, 1, 2, 3].map(i => `<div style="width:26px;height:26px;border-radius:50%;border:3px solid #14213D;position:relative"><div data-in="b5+${0.6 + i * 0.3}" data-anim="pop" style="position:absolute;inset:3px;border-radius:50%;background:#14213D"></div></div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(3,62px);gap:10px">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''].map(n => `<div class="center" style="height:52px;border-radius:12px;background:${n === '' ? 'transparent' : '#E7ECF5'};font-size:24px;font-weight:800">${n}</div>`).join('')}</div>
    </div>
    <div class="view col" data-in="b6+0.2" data-anim="pop" style="align-items:center;justify-content:center;gap:16px">
      ${circ('check', 120, 'var(--green)', '#fff', .6)}<div style="font-size:30px;font-weight:900">Envoyé !</div><div class="muted" style="font-size:20px;font-weight:700">5 000 F à Koffi K.</div>
    </div>`;
  const koffiScreens = `
    <div class="view">
      <div style="font-size:20px;font-weight:700" class="muted">Bonjour Koffi</div>
      <div style="font-size:34px;font-weight:900;margin:6px 0 22px" id="kBal">10 000 F</div>
      <div class="btn" style="background:#E7ECF5;color:#5B6476">Envoyer</div>
      <div class="btn" style="background:#E7ECF5;color:#5B6476;margin-top:14px">Payer</div>
      <div class="card row" data-in="b6+1.6" data-anim="down" style="margin-top:22px;padding:14px;gap:12px;border:3px solid var(--green)">
        ${circ('bell', 46, 'var(--green)', '#fff', .55)}<div style="font-size:19px;font-weight:800">+5 000 F reçus<div class="muted" style="font-size:16px">de Awa</div></div></div>
    </div>`;
  S.exemple = {
    html: `
    <div class="abs row" data-in="b0" data-anim="down" style="left:80px;top:150px;gap:18px">${avatar('awa', 110)}
      <div><div class="h2">Awa</div><div class="p">Abidjan · Wave</div></div></div>
    <div class="abs" style="left:560px;top:140px;transform:scale(1.2);transform-origin:0 0">
      ${phone('pAwa', 'Wave', '#5B8DEF', 0, 0, awaScreens, 280, 580).replace('class="phone"', 'class="phone" data-in="b0+0.3"')}</div>
    <div class="abs col" data-in="b1" data-anim="down" style="left:1700px;top:150px;gap:10px;align-items:center;width:190px;text-align:center">${avatar('koffi', 110)}
      <div><div class="h2">Koffi</div><div class="p" style="font-size:26px">Bouaké<br>Orange Money</div></div></div>
    <div class="abs" style="left:1330px;top:140px;transform:scale(1.2);transform-origin:0 0">
      ${phone('pKoffi', 'Orange Money', '#F29A3D', 0, 0, koffiScreens, 280, 580).replace('class="phone"', 'class="phone" data-in="b1+0.3"')}</div>

    <div class="abs card center col" data-in="b1+1.0" data-anim="pop" data-out="b2" style="left:925px;top:390px;width:370px;height:200px;gap:8px">
      ${ICON('cash', 70, 'var(--green)')}<div class="h2">5 000 F</div></div>

    <svg class="abs" style="left:0;top:0" width="1920" height="1080">
      <path data-in="b6" data-anim="draw" data-dur="0.8" d="M905 490 H1320" stroke="#F2C894" stroke-width="10" stroke-linecap="round" fill="none"/>
    </svg>
    <div class="abs center" data-in="b6" data-anim="pop" style="left:1030px;top:410px;width:160px;height:160px;border-radius:50%;background:var(--orange);color:#fff;font-size:32px;font-weight:900;box-shadow:0 0 0 14px #FFE2BF">PI-SPI</div>
    <div class="abs" id="exCoin" style="left:0;top:0;opacity:0">${circ('coin', 76, 'var(--yellow)', '#7A5200', .7)}</div>
    <div class="abs pill" data-in="b6+1.8" data-anim="pop" style="left:935px;top:640px;background:var(--green);color:#fff;font-size:30px">${ICON('bolt', 34, '#fff')} quelques secondes</div>

    <div class="abs col" data-in="b2-0.3" data-anim="left" style="left:60px;top:330px;gap:20px">
      ${steps.map((s, i) => `<div class="row step" data-i="${i}" style="gap:16px;width:420px;padding:14px 18px;border-radius:20px">
        <div class="center num" style="width:56px;height:56px;border-radius:50%;font-size:28px;font-weight:900;flex:none">${i + 1}</div>
        <div style="font-size:28px;font-weight:800">${s}</div></div>`).join('')}
    </div>`,
    update(t, at, el) {
      const { clamp, easeInOut } = window.EASE;
      const cur = t >= at('b5') ? 3 : t >= at('b4') ? 2 : t >= at('b3') ? 1 : t >= at('b2') ? 0 : -1;
      const fin = t >= at('b6');
      el.querySelectorAll('.step').forEach((n, i) => {
        const done = i < cur || fin, on = i === cur && !fin;
        n.style.background = on ? '#fff' : 'transparent';
        n.style.boxShadow = on ? '0 10px 30px rgba(20,33,61,.12)' : 'none';
        n.style.opacity = on || done ? 1 : 0.45;
        const num = n.querySelector('.num');
        num.style.background = done ? 'var(--green)' : on ? 'var(--orange)' : '#E2E6EE';
        num.style.color = done || on ? '#fff' : '#5B6476';
        num.innerHTML = done ? window.ICON('check', 30, '#fff', 3) : String(i + 1);
      });
      // tap sur "Envoyer"
      const tap = el.querySelector('#tap'), t0 = at('b2+1.2'), u = clamp((t - t0) / 0.7);
      tap.style.opacity = t > t0 && u < 1 ? 1 - u : 0;
      tap.style.transform = `scale(${0.5 + u * 1.6})`;
      el.querySelector('#btnSend').style.filter = t > t0 && t < at('b3') ? 'brightness(0.85)' : 'none';
      // pièce qui voyage
      const c = el.querySelector('#exCoin'), c0 = at('b6+0.6'), cu = clamp((t - c0) / 1.1);
      if (t > c0 && cu < 1) { const x = 900 + 425 * easeInOut(cu); c.style.opacity = 1; c.style.transform = `translate(${x - 38}px,${490 - 38 - Math.sin(cu * Math.PI) * 130}px)`; }
      else c.style.opacity = 0;
      // solde de Koffi
      const k = el.querySelector('#kBal'), ku = clamp((t - at('b6+1.6')) / 0.8);
      k.textContent = (10000 + Math.round(ku * 5000)).toLocaleString('fr-FR') + ' F';
      k.style.color = ku > 0 ? 'var(--green)' : 'var(--ink)';
    },
  };

  /* ---------------- 6. OUTILS ---------------- */
  const tool = (i, title, color, body) => `
    <div class="abs" data-in="b0+${0.3 + i * 0.3}" style="left:${90 + i * 600}px;top:240px;width:540px;height:590px">
      <div class="card tool col" data-i="${i}" style="width:100%;height:100%;padding:34px;align-items:center;border:5px solid transparent">
        <div class="row" style="gap:18px;align-self:flex-start">
          <div class="center" style="width:70px;height:70px;border-radius:50%;background:${color};color:#fff;font-size:38px;font-weight:900">${i + 1}</div>
          <div class="h3" style="font-size:36px">${title}</div></div>
        ${body}
      </div></div>`;
  S.outils = {
    html: `
    <div class="abs h2" data-in="s+0.2" style="left:0;right:0;top:130px;text-align:center">3 façons simples de payer</div>
    ${tool(0, "L'alias", 'var(--orange)', `
      <div class="col" data-in="b1+0.6" style="margin-top:40px;align-items:center;gap:16px;width:100%">
        <div class="p" style="font-size:22px">Avant : un long numéro de compte</div>
        <div style="position:relative;font-family:'JetBrains Mono';font-size:23px;font-weight:700;background:#F1F3F7;border-radius:12px;padding:14px 16px;color:#5B6476">CI093 01001 012345678901 23
          <svg class="abs" style="left:0;top:0" width="100%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none"><path data-in="b1+2.2" data-anim="draw" data-dur="0.5" d="M2 5H98" stroke="#E63946" stroke-width="1.6" vector-effect="non-scaling-stroke" style="stroke-width:5px"/></svg></div>
        <div data-in="b1+2.8" data-anim="pop">${ICON('detour', 56, '#C9CFDA')}</div>
        <div class="p" data-in="b1+3.2" style="font-size:22px">Maintenant : un identifiant simple</div>
        <div class="pill" data-in="b1+3.4" data-anim="pop" style="background:#E4F6EE;color:var(--green);font-size:34px;padding:16px 28px">${ICON('phone', 38)} 07 01 02 03 04</div>
      </div>`)}
    ${tool(1, 'Le QR code unique', 'var(--green)', `
      <div class="col" data-in="b2+0.8" style="margin-top:34px;align-items:center;gap:20px">
        <div class="card center" style="width:250px;height:250px;border:6px solid var(--green)">${qr(200, 99)}</div>
        <div class="row" style="gap:14px">${['Banque', 'Appli 1', 'Appli 2'].map((n, i) => `<div class="chip" data-in="b2+${2.8 + i * 0.4}" data-anim="pop" style="font-size:20px;gap:6px">${ICON('check', 22, 'var(--green)', 3)}${n}</div>`).join('')}</div>
        <div class="p" data-in="b2+4.3" style="font-size:24px;text-align:center">Un seul code, pour tout le monde</div>
      </div>`)}
    ${tool(2, 'La demande de paiement', 'var(--blue)', `
      <div class="col" data-in="b3+1.4" style="margin-top:40px;width:100%;gap:18px">
        <div class="card col" style="padding:22px;gap:14px;border:2px solid #E2E6EE">
          <div class="row" style="gap:14px">${avatar('adjoua', 64)}<div><div style="font-size:22px;font-weight:900">Boutique Adjoua</div><div class="muted" style="font-size:19px;font-weight:700">vous demande</div></div></div>
          <div style="font-size:52px;font-weight:900">2 000 F</div>
          <div class="row" style="gap:12px">
            <div class="btn" style="flex:1;background:#FDE8EA;color:var(--red)">Refuser</div>
            <div class="btn" id="acc" style="flex:1;background:var(--green)">Accepter</div></div>
        </div>
        <div class="pill" data-in="b3+5" data-anim="pop" style="align-self:center;background:#E4F6EE;color:var(--green)">${ICON('check', 32, 'var(--green)', 3)} Payé en un clic</div>
      </div>`)}`,
    update(t, at, el) {
      const act = t >= at('b3') ? 2 : t >= at('b2') ? 1 : t >= at('b1') ? 0 : -1;
      el.querySelectorAll('.tool').forEach((n, i) => {
        const on = i === act;
        n.style.opacity = act < 0 || on ? 1 : 0.4;
        n.style.transform = `scale(${act < 0 ? 1 : on ? 1.03 : 0.96})`;
        n.style.borderColor = on ? ['#F77F00', '#009E60', '#2563EB'][i] : 'transparent';
        n.style.transition = 'none';
      });
      const a = el.querySelector('#acc'), on = t > at('b3+4.4');
      a.style.boxShadow = on ? '0 0 0 8px #BFEBD8' : 'none';
    },
  };

  /* ---------------- 7. 24h/24 ---------------- */
  const countries = ['Sénégal', 'Mali', 'Niger', 'Burkina Faso', 'Bénin', 'Togo', "Côte d'Ivoire", 'Guinée-Bissau'];
  S.toujours = {
    html: `
    <div class="abs" data-out="b1-0.2" data-anim="none" style="left:0;top:0;width:1920px;height:1080px">
      <div class="abs card center" data-in="b0" data-anim="pop" style="left:200px;top:180px;width:560px;height:560px;border-radius:50%">
        <svg width="460" height="460" viewBox="-100 -100 200 200">
          <circle r="92" fill="#FFF6EA" stroke="#14213D" stroke-width="6"/>
          ${[...Array(12)].map((_, i) => `<line x1="0" y1="-80" x2="0" y2="-70" stroke="#14213D" stroke-width="5" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}
          <line id="hH" x1="0" y1="0" x2="0" y2="-42" stroke="#14213D" stroke-width="9" stroke-linecap="round"/>
          <line id="hM" x1="0" y1="0" x2="0" y2="-64" stroke="#F77F00" stroke-width="6" stroke-linecap="round"/>
          <circle r="8" fill="#14213D"/>
        </svg></div>
      <div class="abs col" style="left:860px;top:200px;gap:26px">
        <div class="row" style="gap:30px"><div data-in="b0+0.6" data-anim="pop" class="orange" style="font-size:150px;font-weight:900;letter-spacing:-4px;line-height:1">24h/24</div></div>
        <div data-in="b0+1.6" data-anim="pop" class="green" style="font-size:150px;font-weight:900;letter-spacing:-4px;line-height:1">7j/7</div>
        <div class="row" style="gap:12px;margin-top:10px">
          ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => `<div class="center" data-in="b0+${2.2 + i * 0.18}" data-anim="pop" style="width:110px;height:76px;border-radius:18px;background:${i === 6 ? 'var(--orange)' : 'var(--green)'};color:#fff;font-size:28px;font-weight:800">${d}</div>`).join('')}
        </div>
        <div class="pill" data-in="b0+3.8" data-anim="pop" style="background:#fff;color:var(--ink);align-self:flex-start">${ICON('check', 34, 'var(--green)', 3)} Même le dimanche et les jours fériés</div>
      </div>
    </div>
    <div class="abs" data-in="b1-0.1" data-anim="fade" style="left:0;top:0;width:1920px;height:1080px">
      <svg class="abs" style="left:0;top:0" width="1920" height="1080">
        ${countries.map((c, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 8, x = 960 + 600 * Math.cos(a), y = 470 + 275 * Math.sin(a); return `<path data-in="b1+${2.4 + i * 0.6}" data-anim="draw" data-dur="0.5" d="M960 470 L${x.toFixed(0)} ${y.toFixed(0)}" stroke="#F2C894" stroke-width="8" fill="none"/>`; }).join('')}
      </svg>
      <div class="abs center col" data-in="b1" data-anim="pop" style="left:800px;top:310px;width:320px;height:320px;border-radius:50%;background:var(--orange);color:#fff;box-shadow:0 0 0 22px #FFE2BF">
        <div style="font-size:120px;font-weight:900;line-height:1">8</div><div style="font-size:30px;font-weight:800">pays de l'UEMOA</div></div>
      ${countries.map((c, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 8, x = 960 + 600 * Math.cos(a), y = 470 + 275 * Math.sin(a); const ci = c === "Côte d'Ivoire";
        return `<div class="abs" style="left:${(x - 170).toFixed(0)}px;top:${(y - 42).toFixed(0)}px;width:340px" ><div class="chip" data-in="b1+${2.4 + i * 0.6}" data-anim="pop" style="width:340px;height:84px;justify-content:center;gap:14px;font-size:30px;${ci ? 'border-color:var(--orange);background:#FFF1DE' : ''}">${flag(c, 1.1)}${c}</div></div>`; }).join('')}
    </div>`,
    update(t, at, el) {
      const u = Math.max(0, t - at('b0'));
      el.querySelector('#hM').setAttribute('transform', `rotate(${u * 360})`);
      el.querySelector('#hH').setAttribute('transform', `rotate(${u * 30})`);
    },
  };

  /* ---------------- 8. REGLES ---------------- */
  const rule = (i, at, badge, bg, fg, title, sub, wide) => {
    const col = i % 2, row = Math.floor(i / 2);
    return `<div class="abs" data-in="${at}" data-anim="${col ? 'right' : 'left'}" style="left:${110 + col * 870}px;top:${280 + row * 190}px;width:830px;height:170px">
      <div class="card row rule" data-i="${i}" style="width:100%;height:100%;padding:0 30px;gap:28px;border:4px solid transparent">
        <div class="center" style="width:150px;height:110px;border-radius:24px;background:${bg};color:${fg};font-size:${badge.length > 4 ? 36 : 50}px;font-weight:900;flex:none">${badge}</div>
        <div><div style="font-size:32px;font-weight:850;line-height:1.15">${title}</div><div class="muted" style="font-size:25px;font-weight:700;margin-top:6px">${sub}</div></div>
      </div></div>`;
  };
  S.regles = {
    html: `
    <div class="abs row" style="left:110px;top:130px;gap:26px">
      <div class="pill" data-in="b0" data-anim="pop" style="background:var(--orange);color:#fff;font-size:34px;padding:14px 28px">${ICON('calendar', 38, '#fff')} Depuis le 2 novembre 2026</div>
      <div class="h2" data-in="b0+0.6" data-anim="left">Ce qui change</div>
    </div>
    ${rule(0, 'b1', ICON('swap', 64, '#fff', 2.6), 'var(--blue)', '#fff', 'Transferts entre opérateurs différents', 'Passage obligatoire par PI-SPI')}
    ${rule(1, 'b2', '0 F', '#E4F6EE', 'var(--green)', 'Envois gratuits jusqu’à 8&nbsp;000&nbsp;F par jour', 'Montant cumulé sur la journée')}
    ${rule(2, 'b3', '0,8 %', '#FFF1DE', 'var(--orange)', 'Au-delà : frais plafonnés à 0,8 % (HT)', 'Ex. : 50 000 F envoyés → 400 F maximum')}
    ${rule(3, 'b4', '0 F', '#E4F6EE', 'var(--green)', 'Recevoir de l’argent : gratuit', 'Quel que soit le montant')}
    ${rule(4, 'b5', '4 M', '#E3EEFF', 'var(--blue)', 'Compte mobile money identifié', 'Jusqu’à 4 millions F (au lieu de 2 millions)')}
    ${rule(5, 'b6', ICON('warn', 64, '#7A5200', 2.4), 'var(--yellow)', '#7A5200', 'Retraits chez les agents', 'Non concernés par ces règles')}`,
    update(t, at, el) {
      const beats = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'].map(at);
      let act = -1; beats.forEach((b, i) => { if (t >= b) act = i; });
      el.querySelectorAll('.rule').forEach((n, i) => {
        n.style.borderColor = i === act ? (i === 5 ? '#FFC233' : '#F77F00') : 'transparent';
      });
    },
  };

  /* ---------------- 9. BANQUES ---------------- */
  const ring = (cx, cy, r, n) => [...Array(n)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const nodesL = ring(410, 250, 170, 6), nodesR = ring(410, 250, 180, 6);
  const benefit = (i, at, icon, color, title, sub) => {
    const col = i % 2, row = Math.floor(i / 2);
    return `<div class="abs card row" data-in="${at}" data-anim="up" style="left:${110 + col * 870}px;top:${270 + row * 280}px;width:830px;height:250px;padding:0 40px;gap:34px">
      ${circ(icon, 140, color, '#fff', .5)}<div><div class="h3" style="font-size:40px">${title}</div><div class="p" style="margin-top:8px">${sub}</div></div></div>`;
  };
  S.banques = {
    html: `
    <div class="abs row" data-in="b0" data-anim="left" style="left:110px;top:120px;gap:24px">${circ('bank', 100, '#2563EB')}<div class="h2">Et pour les banques ?</div></div>
    <div class="abs" data-in="b1" data-out="b2-0.2" style="left:110px;top:260px;width:820px;height:590px">
      <div class="card" style="position:absolute;inset:0;overflow:hidden">
        <div class="abs h3" style="left:30px;top:24px;font-size:32px">Sans plateforme commune</div>
        <svg class="abs" style="left:0;top:40px" width="820" height="560">
          ${nodesL.map(([x, y], i) => nodesL.slice(i + 1).map(([x2, y2]) => `<path d="M${x} ${y} L${x2} ${y2}" stroke="#F4B4B9" stroke-width="4"/>`).join('')).join('')}
          ${nodesL.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i ? 34 : 44}" fill="${i ? '#94A3B8' : '#2563EB'}"/>`).join('')}
        </svg>
        <div class="abs pill" style="left:30px;bottom:24px;background:#FDE8EA;color:var(--red);font-size:26px">${ICON('doc', 30)} Un accord par partenaire</div>
      </div></div>
    <div class="abs" data-in="b1+2.6" data-out="b2-0.2" style="left:990px;top:260px;width:820px;height:590px">
      <div class="card" style="position:absolute;inset:0;overflow:hidden;border:4px solid var(--green)">
        <div class="abs h3" style="left:30px;top:24px;font-size:32px">Avec PI-SPI</div>
        <svg class="abs" style="left:0;top:40px" width="820" height="560">
          ${nodesR.map(([x, y]) => `<path d="M410 250 L${x} ${y}" stroke="#A7E1C8" stroke-width="6"/>`).join('')}
          ${nodesR.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i ? 34 : 44}" fill="${i ? '#94A3B8' : '#2563EB'}"/>`).join('')}
          <circle cx="410" cy="250" r="70" fill="#F77F00"/><text x="410" y="262" text-anchor="middle" font-size="30" font-weight="900" fill="#fff" font-family="Inter">PI-SPI</text>
        </svg>
        <div class="abs pill" style="left:30px;bottom:24px;background:#E4F6EE;color:var(--green);font-size:26px">${ICON('link', 30)} Un seul raccordement</div>
      </div></div>
    ${benefit(0, 'b2', 'swap', 'var(--teal)', 'Banque ⇄ mobile money', 'Envoyer et recevoir, instantanément')}
    ${benefit(1, 'b3', 'qr', 'var(--orange)', 'Nouveaux services', 'QR marchand, salaires, factures… en temps réel')}
    ${benefit(2, 'b4', 'users', 'var(--violet)', 'Des millions de clients', 'qui utilisent déjà le mobile money')}
    ${benefit(3, 'b5', 'shield', 'var(--green)', 'Moins d’espèces', 'Plus de sécurité pour tout le monde')}`,
  };

  /* ---------------- 10. SECURITE ---------------- */
  const tip = (i, at, icon, color, title, sub) => `
    <div class="abs card row" data-in="${at}" data-anim="right" style="left:700px;top:${200 + i * 215}px;width:1110px;height:190px;padding:0 40px;gap:34px">
      ${circ(icon, 120, color, '#fff', .5)}<div><div class="h3" style="font-size:40px">${title}</div><div class="p" style="margin-top:8px">${sub}</div></div></div>`;
  S.securite = {
    html: `
    <div class="abs col" style="left:140px;top:220px;align-items:center;gap:30px;width:460px">
      <div data-in="b0" data-anim="pop" class="center" style="width:340px;height:340px;border-radius:50%;background:#E4F6EE">${ICON('shield', 220, 'var(--green)', 1.8)}</div>
      <div class="h2" data-in="b0+0.4" style="text-align:center">Payer en sécurité</div>
    </div>
    ${tip(0, 'b1', 'eye', 'var(--green)', 'Vérifiez le nom et le montant', 'Un paiement instantané part tout de suite !')}
    ${tip(1, 'b2', 'lock', 'var(--orange)', 'Votre code secret reste secret', 'Ni l’opérateur, ni la banque, ni la BCEAO ne le demandent')}
    ${tip(2, 'b3', 'ban', 'var(--red)', 'Demande inconnue ? Refusez-la', 'En cas de doute, ne validez pas')}`,
  };

  /* ---------------- 11. RECAP ---------------- */
  const tile = (i, at, icon, color, word, sub) => `
    <div class="abs card col" data-in="${at}" data-anim="pop" style="left:${110 + i * 440}px;top:250px;width:400px;height:360px;padding:36px;align-items:center;gap:18px;text-align:center">
      ${circ(icon, 120, color, '#fff', .5)}<div class="h2" style="font-size:50px">${word}</div><div class="p" style="font-size:26px">${sub}</div></div>`;
  S.recap = {
    html: `
    <div class="abs h2" data-in="b0" style="left:0;right:0;top:130px;text-align:center">En résumé, <span class="orange">PI</span>-<span class="green">SPI</span> c'est…</div>
    ${tile(0, 'b1', 'bolt', 'var(--orange)', 'Rapide', 'L’argent arrive en quelques secondes')}
    ${tile(1, 'b2', 'link', 'var(--blue)', 'Ouvert', 'Banques et mobile money échangent')}
    ${tile(2, 'b3', 'phone', 'var(--violet)', 'Simple', 'Un numéro ou un QR code suffit')}
    ${tile(3, 'b4', 'coin', 'var(--green)', 'Moins cher', 'Envois gratuits jusqu’à 8&nbsp;000&nbsp;F/jour, réception gratuite')}
    <div class="abs col" style="left:0;right:0;top:650px;align-items:center;gap:22px">
      <div class="pill" data-in="b5" data-anim="up" data-out="b6-0.1" style="background:#fff;color:var(--ink);font-size:30px;padding:16px 30px;box-shadow:0 6px 20px rgba(20,33,61,.08)">${ICON('info', 36, 'var(--blue)')} Frais exacts : renseignez-vous auprès de votre banque ou de votre opérateur</div>
    </div>
    <div class="abs col" style="left:0;right:0;top:640px;align-items:center;gap:20px">
      <div class="pill" data-in="b6" data-anim="pop" style="background:var(--orange);color:#fff;font-size:42px;padding:18px 40px">${ICON('share', 44, '#fff')} Partagez cette vidéo !</div>
      <div class="p" data-in="b6+0.8" style="font-size:22px">Informations à jour au 25 novembre 2026 · Sources : BCEAO et presse économique</div>
    </div>`,
  };

  window.SCENES = S;
})();
