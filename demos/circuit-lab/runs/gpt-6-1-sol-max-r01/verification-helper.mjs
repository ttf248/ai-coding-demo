// Acceptance runner archived with this single-file experiment.
// Run from the repository with root @playwright/test tooling installed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

export async function touchDrag(page, a, b, steps = 8) {
  const session = await page.context().newCDPSession(page);
  const point = (p) => ({ x: p.x, y: p.y, radiusX: 3, radiusY: 3, force: 1, id: 0 });
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(a)] });
  for (let i = 1; i <= steps; i++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point({ x: a.x + (b.x - a.x) * i / steps, y: a.y + (b.y - a.y) * i / steps })] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

export async function verifyDemo(moduleUrl, scenario) {
  const directory = path.dirname(fileURLToPath(moduleUrl));
  const root = path.resolve(directory, '../../../..');
  const relative = path.relative(root, directory).split(path.sep).join('/');
  const server = spawn(process.execPath, ['scripts/serve.mjs', '--read-only'], {
    cwd: root, env: { ...process.env, PORT: '0' }, windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let browser;
  const passed = [];
  const started = new Date().toISOString();
  try {
    const base = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('Static server did not start')), 10000);
      let output = '';
      server.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/Archive: (http:\/\/127\.0\.0\.1:\d+\/)/);
        if (match) { clearTimeout(timer); resolve(match[1]); }
      });
      server.on('error', error => { clearTimeout(timer); reject(error); });
      server.on('exit', code => { clearTimeout(timer); reject(Error('Static server exited: ' + code)); });
    });
    browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [], external = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if (/^https?:/.test(r.url()) && !r.url().startsWith(base)) external.push(r.url()); });
    const url = base + relative + '/index.html';
    await page.goto(url);
    const check = async (label, fn) => { await fn(); passed.push(label); console.log('PASS ' + label); };
    await scenario({ page, context, browser, base, url, check, directory });
    await check('HTTP 页面无脚本错误或外部资源请求', async () => { assert.deepEqual(errors, []); assert.deepEqual(external, []); });
    await page.screenshot({ path: path.join(directory, 'evidence-desktop.png'), fullPage: true });
    const filePage = await context.newPage(), fileErrors = [];
    filePage.on('pageerror', e => fileErrors.push(e.message));
    await filePage.goto(pathToFileURL(path.join(directory, 'index.html')).href);
    await check('file:// 可直接打开', async () => {
      await filePage.waitForFunction(() => document.getElementById('status')?.textContent.length > 0);
      assert.deepEqual(fileErrors, []);
      if (relative.includes('/fluid-simulation/')) { await filePage.waitForFunction(() => ready, null, { timeout: 10000 }); assert.equal(await filePage.locator('#fallback').isVisible(), false); }
    });
    await filePage.close();
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, acceptDownloads: true });
    const mobile = await mobileContext.newPage(), mobileErrors = [];
    mobile.on('pageerror', e => mobileErrors.push(e.message));
    await mobile.goto(url);
    await check('390px 无页面水平溢出', async () => assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true));
    if (relative.includes('/circuit-lab/')) {
      await check('触摸两个端子完成连线', async () => {
        const before = await mobile.evaluate(() => state.wires.length);
        for (const pin of ['c1:a', 'c1:b']) {
          const box = await mobile.locator('[data-pin="' + pin + '"] circle').first().boundingBox();
          await mobile.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
        }
        assert.equal(await mobile.evaluate(() => state.wires.length), before + 1);
        assert.match(await mobile.locator('#status').textContent(), /短路/);
      });
    } else if (relative.includes('/fantasy-map-generator/')) {
      await check('触摸画笔修改地形', async () => {
        await mobile.locator('[data-tool="raise"]').click();
        await mobile.locator('#map').scrollIntoViewIfNeeded();
        const box = await mobile.locator('#map').boundingBox(), sum = await mobile.evaluate(() => heights.reduce((a,b) => a+b,0));
        await touchDrag(mobile, {x:box.x+box.width*.45,y:box.y+box.height*.5}, {x:box.x+box.width*.6,y:box.y+box.height*.5});
        assert.ok(await mobile.evaluate(() => heights.reduce((a,b) => a+b,0)) > sum);
      });
    } else if (relative.includes('/fluid-simulation/')) {
      await check('移动布局下触摸注入且 WebGL 正常', async () => {
        await mobile.waitForFunction(() => ready, null, { timeout: 10000 });
        assert.equal(await mobile.locator('#fallback').isVisible(), false);
        await mobile.locator('#clear').click();
        await mobile.locator('#fluid').scrollIntoViewIfNeeded();
        const box = await mobile.locator('#fluid').boundingBox();
        const before = await mobile.evaluate(() => canvas.toDataURL());
        await touchDrag(mobile, {x:box.x+box.width*.25,y:box.y+box.height*.45}, {x:box.x+box.width*.75,y:box.y+box.height*.5});
        assert.notEqual(await mobile.evaluate(() => canvas.toDataURL()), before);
      });
    } else {
      await check('触摸编辑障碍与移动起点', async () => {
        await mobile.locator('[data-tool="wall"]').click();
        await mobile.locator('#grid').scrollIntoViewIfNeeded();
        const box = await mobile.locator('#grid').boundingBox();
        const cell = (x,y) => ({x:box.x+(x+.5)*box.width/24,y:box.y+(y+.5)*box.height/18});
        const p = cell(2,2); await mobile.touchscreen.tap(p.x,p.y);
        assert.equal(await mobile.evaluate(() => terrain[2*COLS+2]), 1);
        await touchDrag(mobile, cell(3,9), cell(4,9));
        assert.equal(await mobile.evaluate(() => start), 9*24+4);
      });
    }
    await check('移动布局无脚本错误', async () => assert.deepEqual(mobileErrors, []));
    await mobile.screenshot({ path: path.join(directory, 'evidence-mobile.png'), fullPage: true });
    const version = browser.version();
    fs.writeFileSync(path.join(directory, 'verification.json'), JSON.stringify({ started, browser: 'Chromium ' + version, renderer: 'Headless; --enable-unsafe-swiftshader', viewport: ['1440 × 1050', '390 × 844'], passed }, null, 2) + '\n');
    console.log('Verified ' + relative + ': ' + passed.length + ' checks.');
  } finally {
    await browser?.close();
    server.kill();
  }
}
