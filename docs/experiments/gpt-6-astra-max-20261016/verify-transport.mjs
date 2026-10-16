import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const output = 'docs/experiments/gpt-6-astra-max-20261016';
const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const graphicsMessages = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (/context lost|GL_INVALID|shader error/i.test(message.text())) graphicsMessages.push(message.text());
});
const results = [];
try {
  await page.goto('http://127.0.0.1:4173/demos/voxel-construction-site/runs/gpt-6-astra-max-r01/index.html', { waitUntil: 'networkidle' });
  for (const scene of ['tower', 'bridge']) {
    await page.selectOption('#location', scene);
    const result = await page.evaluate(() => {
      const observed = new Map(), transitions = [];
      let minimumGap = Infinity, maximumX = 0, maximumZ = 0;
      for (let i = 0; i < 900; i++) {
        window.siteLab.advance(0.2);
        const state = window.siteLab.state();
        state.vehicles.forEach(vehicle => {
          if (vehicle.type !== 'dump') return;
          const previous = observed.get(vehicle.offset);
          if (previous !== undefined && previous !== vehicle.loaded) {
            transitions.push({ offset: vehicle.offset, loaded: vehicle.loaded, routePosition: (state.pathTime + vehicle.offset) % 64 });
          }
          observed.set(vehicle.offset, vehicle.loaded);
        });
        for (const p of state.vehiclePositions) {
          maximumX = Math.max(maximumX, Math.abs(p[0]));
          maximumZ = Math.max(maximumZ, Math.abs(p[2]));
        }
        for (let a = 0; a < state.vehiclePositions.length; a++) {
          for (let b = a + 1; b < state.vehiclePositions.length; b++) {
            const p = state.vehiclePositions[a], q = state.vehiclePositions[b];
            minimumGap = Math.min(minimumGap, Math.hypot(p[0] - q[0], p[2] - q[2]));
          }
        }
      }
      return { transitions, minimumGap, maximumX, maximumZ };
    });
    for (const offset of [0, 16]) {
      const transitions = result.transitions.filter(t => t.offset === offset);
      assert.ok(transitions.some(t => t.loaded), 'Each dump truck must collect soil');
      assert.ok(transitions.some(t => !t.loaded), 'Each dump truck must unload soil');
      for (const t of transitions) assert.ok(Math.abs(t.routePosition - (t.loaded ? 57 : 34)) < 0.25);
      for (let i = 1; i < transitions.length; i++) assert.notEqual(transitions[i - 1].loaded, transitions[i].loaded);
    }
    assert.ok(result.minimumGap > 6);
    assert.ok(result.maximumX <= 10.01 && result.maximumZ <= 6.01);
    results.push({ scene, status: 'passed', simulatedSeconds: 180, ...result });
  }
  assert.deepEqual(errors, []);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await page.evaluate(() => document.querySelector('#scene canvas').getContext('webgl2').isContextLost()), false);
  assert.deepEqual(graphicsMessages, []);
  await page.screenshot({ path: output + '/screenshots/voxel-construction-site-mobile-final.png' });
  await page.goto('http://127.0.0.1:4173/demos/neo-gothic-tower-city/runs/gpt-6-astra-max-r01/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: output + '/screenshots/neo-gothic-tower-city-mobile-final.png' });
  assert.deepEqual(errors, []);
  const report = { date: new Date().toISOString(), scope: 'Vehicle centers, shared single-lane route and load/unload transitions. Not a proof of all articulated geometry being collision-free.', graphicsMessages, results };
  fs.writeFileSync(output + '/transport-verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
