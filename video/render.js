// Rendu de la vidéo : node render.js            -> out/pi-spi-explication.mp4
//                     node render.js --stills 3,12.5,40  -> build/stills/*.png (contrôle visuel)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const FPS = 30;
const WORKERS = parseInt(process.env.WORKERS || '4', 10);
const URL = 'file://' + path.join(HERE, 'index.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGE ERROR', e); process.exit(1); });
  await page.goto(URL);
  await page.waitForFunction(() => window.READY === true);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function stills(times) {
  const browser = await chromium.launch();
  const page = await openPage(browser);
  const dir = path.join(HERE, 'build', 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of times) {
    await page.evaluate(t => window.seek(t), t);
    const f = path.join(dir, `t${String(t).padStart(6, '0')}.png`);
    await page.screenshot({ path: f });
    console.log(f);
  }
  await browser.close();
}

async function renderRange(browser, k, f0, f1, out) {
  const page = await openPage(browser);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`worker ${k}: ${f - f0}/${f1 - f0}`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg ' + c))));
  await page.close();
}

async function full() {
  const T = JSON.parse(fs.readFileSync(path.join(HERE, 'build', 'timings.json'), 'utf8'));
  const total = Math.ceil(T.duration * FPS);
  const browser = await chromium.launch();
  const per = Math.ceil(total / WORKERS);
  const segs = [];
  const jobs = [];
  for (let k = 0; k < WORKERS; k++) {
    const f0 = k * per, f1 = Math.min(total, f0 + per);
    if (f0 >= f1) break;
    const out = path.join(HERE, 'build', `seg${k}.mp4`);
    segs.push(out);
    jobs.push(renderRange(browser, k, f0, f1, out));
  }
  await Promise.all(jobs);
  await browser.close();
  const list = path.join(HERE, 'build', 'segs.txt');
  fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
  fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
  const out = path.join(HERE, 'out', 'pi-spi-explication.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-i', path.join(HERE, 'build', 'narration.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-af', 'apad', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('OK ->', out);
}

const i = process.argv.indexOf('--stills');
if (i > 0) stills(process.argv[i + 1].split(',').map(Number));
else full();
