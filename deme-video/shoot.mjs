// Usage : node shoot.mjs outDir t1 t2 ...  -> captures PNG pour contrôle
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'path';
const [out, ...times] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
p.on('pageerror', e => console.log('PAGEERR', e.message));
await p.goto('file://' + path.resolve('index.html') + '?render=1');
await p.evaluate(() => window.READY);
for (const t of times) { await p.evaluate(t => renderAt(+t), t); await p.screenshot({ path: `${out}/t${t}.png` }); }
await b.close();
