// Génère assets.js : icônes, QR WhatsApp, points des continents pour le globe
import fs from 'fs';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import QRCode from 'qrcode';

const icons = ['shopping-cart','search','graduation-cap','container','phone','mail','shield-check','badge-percent','route','handshake','ship','plane','truck','package','shirt','smartphone','armchair','laptop','check','star','factory','play','map-pin','headset','sparkles','watch','lamp','headphones','circle-check-big','book-open','award','clock','trending-up','message-circle'];
const ICONS = {};
for (const n of icons) {
  const s = fs.readFileSync(`node_modules/lucide-static/icons/${n}.svg`, 'utf8');
  ICONS[n] = s.slice(s.indexOf('>', s.indexOf('<svg')) + 1, s.lastIndexOf('</svg>')).replace(/\s+/g, ' ').trim();
}
const wa = fs.readFileSync('node_modules/simple-icons/icons/whatsapp.svg', 'utf8').match(/ d="([^"]+)"/)[1];

const qr = await QRCode.toString('https://wa.me/2250711114984', { type: 'svg', margin: 0, errorCorrectionLevel: 'H', color: { dark: '#0A1F5C', light: '#FFFFFF' } });

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topo, topo.objects.land);
const dots = [];
const step = 1.5;
for (let lat = -58; lat <= 80; lat += step) {
  const lonStep = step / Math.max(0.25, Math.cos(lat * Math.PI / 180));
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(2), +lat.toFixed(2)]);
  }
}
fs.writeFileSync('assets.js',
  `window.ICONS=${JSON.stringify(ICONS)};\nwindow.WA_PATH=${JSON.stringify(wa)};\nwindow.QR_SVG=${JSON.stringify(qr)};\nwindow.LAND_DOTS=${JSON.stringify(dots)};\n`);
console.log('icons', Object.keys(ICONS).length, 'dots', dots.length);
