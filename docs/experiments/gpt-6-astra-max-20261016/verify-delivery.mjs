// Start `node scripts/serve.mjs --read-only` at the repository root first.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { loadCatalog, hash } from '../../../scripts/lib.mjs';

const out = 'docs/experiments/gpt-6-astra-max-20261016';
const base = 'http://127.0.0.1:4173/';
const data = loadCatalog();
const runs = data.runs.filter(run => run.runId === 'gpt-6-astra-max-r01');
const results = [], links = new Set();
const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const run of runs) {
    const response = await fetch(base + run.directory + '/' + run.input.file);
    assert.equal(response.status, 200);
    assert.equal(hash(await response.text()), run.input.hash);
    for (const entry of run.preview.pages) {
      const errors = [];
      const onError = error => errors.push(error.message);
      page.on('pageerror', onError);
      await page.goto(base + entry.href, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.deepEqual(errors, [], entry.href);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), entry.href + ' horizontal overflow');
      const localResources = await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel="stylesheet"],img[src]')].map(element => element.src || element.href).filter(url => url?.startsWith(location.origin)));
      for (const resource of localResources) links.add(resource);
      page.off('pageerror', onError);
      const record = { topic: run.topicId, page: entry.id, http: 'passed', width390: 'passed', file: 'not-applicable-build' };
      if (run.preview.kind === 'static') {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, offline: run.preview.network === 'offline' });
        const filePage = await context.newPage(), fileErrors = [];
        filePage.on('pageerror', error => fileErrors.push(error.message));
        await filePage.goto(pathToFileURL(path.resolve(run.directory, entry.path)).href, { waitUntil: 'networkidle', timeout: 60000 });
        assert.deepEqual(fileErrors, [], 'file:// ' + entry.href);
        record.file = 'passed';
        record.fileNetwork = run.preview.network;
        await context.close();
      }
      results.push(record);
      console.log(run.topicId + ' / ' + entry.id + ': HTTP, 390px and applicable file:// passed');
    }
  }
  for (const route of ['', ...data.topics.map(topic => 'topic.html?id=' + topic.id)]) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    if (!route) {
      await page.locator('[data-testing="all"]').click();
      while (await page.locator('#load-more').isVisible()) await page.locator('#load-more').click();
    }
    for (const href of await page.locator('a[href]').evaluateAll(elements => elements.map(element => element.href).filter(url => url.startsWith(location.origin)))) links.add(href);
  }
  for (const href of links) {
    const response = await fetch(href);
    assert.equal(response.status, 200, href);
  }
  assert.equal(results.length, 16);
  const report = { date: new Date().toISOString(), registeredEntries: results.length, inputHashesChecked: runs.length, localLinksChecked: links.size, results };
  fs.writeFileSync(out + '/delivery-verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ registeredEntries: results.length, inputHashesChecked: runs.length, localLinksChecked: links.size }));
} finally {
  await browser.close();
}
