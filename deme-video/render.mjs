// Rendu image par image -> MP4 (H.264) en parallèle, puis assemblage + musique.
// Usage : node render.mjs [fps=30] [workers=4] [sortie=DEME_Trading_Company.mp4]
import { createRequire } from 'module';
import { spawn, execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const { chromium } = createRequire(import.meta.url)('playwright');

const FPS = +(process.argv[2] || 30), W = +(process.argv[3] || 4);
const OUT = process.argv[4] || 'DEME_Trading_Company.mp4';
const DUR = 40, TOTAL = DUR * FPS;
const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'deme-'));
const url = 'file://' + path.resolve('index.html') + '?render=1';

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
const t0 = Date.now();
let done = 0;
async function worker(k) {
  const a = Math.floor(TOTAL * k / W), b = Math.floor(TOTAL * (k + 1) / W);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  await page.goto(url);
  await page.evaluate(() => window.READY);
  const seg = path.join(tmp, `seg${k}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-x264-params', 'keyint=60', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    await page.evaluate(t => renderAt(t), f / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (++done % 100 === 0) console.log(`${done}/${TOTAL} images — ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
  return seg;
}
const segs = await Promise.all(Array.from({ length: W }, (_, k) => worker(k)));
await browser.close();
fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map(s => `file '${s}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-i', 'music.wav',
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-ar', '48000',
  '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
fs.rmSync(tmp, { recursive: true, force: true });
console.log('OK ->', OUT, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
