// Verify a git-archive export without installing dependencies or building there.
// The browser test driver uses the original repository's Playwright installation.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { hash } from '../../../scripts/lib.mjs';

const root = path.resolve(process.argv[2] || '');
assert.ok(process.argv[2], 'Pass the directory exported from the candidate Git tree');
const out = 'docs/experiments/gpt-6-astra-max-20261016';
const entries = fs.readdirSync(root, { recursive: true, withFileTypes: true });
assert.ok(!entries.some(entry => entry.isDirectory() && ['node_modules', 'dist', '.cache'].includes(entry.name)));
const generated = fs.readFileSync(path.join(root, 'assets/generated/catalog.js'), 'utf8');
const data = JSON.parse(generated.match(/window\.ARCHIVE = ([\s\S]*);\s*$/)[1]);
const runs = data.runs.filter(run => run.runId === 'gpt-6-astra-max-r01');
assert.equal(runs.length, 11);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'text/plain' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
let browser;
try {
  let checkedEntries = 0;
  for (const run of runs) {
    assert.equal(run.status, 'ready');
    for (const entry of run.preview.pages) {
      assert.equal((await fetch(base + entry.href)).status, 200, entry.href);
      checkedEntries++;
    }
    const input = await fetch(base + run.directory + '/' + run.input.file);
    assert.equal(input.status, 200);
    assert.equal(hash(await input.text()), run.input.hash);
    assert.ok(fs.existsSync(path.join(root, run.directory, 'evidence/first-pass.zip')));
  }
  browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [], failedLocalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) failedLocalRequests.push(response.url());
  });
  await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.match(await page.locator('#stats').innerText(), /11/);
  await page.goto(base + 'previews/bluebook/gpt-6-astra-max-r01/index.html', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.post-card').count(), 20);
  assert.equal(await page.locator('.post-card img').first().evaluate(image => image.complete && image.naturalWidth > 0), true);
  await page.screenshot({ path: out + '/screenshots/bluebook-clean-checkout.png' });
  assert.deepEqual(errors, []);
  assert.deepEqual(failedLocalRequests, []);
  const report = {
    date: new Date().toISOString(), candidateTree: process.argv[3] || null,
    status: 'passed', checkedEntries, checkedInputs: runs.length,
    noNodeModulesDistOrCache: true, noInstallOrBuildInExport: true,
    homepageAndBluebookRenderedWithExternalRequestsBlocked: true,
    pageErrors: errors, failedLocalRequests,
  };
  fs.writeFileSync(out + '/clean-checkout-verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
