// scripts/generate-images.mjs
// Copy 35 known-valid JPEG placeholders from the minimax-m2 reference run.
// Browsers only render content with the correct MIME / magic bytes; we use real
// JPEG bytes from a sibling run rather than hand-crafting an entropy stream.

import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SRC = resolve(
  __dirname,
  '..',
  '..',
  'minimax-m2-unknown-r01',
  'public',
  'images',
)
const OUT_DIR = resolve(__dirname, '..', 'public', 'images')
mkdirSync(OUT_DIR, { recursive: true })

const files = readdirSync(SRC).filter((f) => /^\d+\.jpg$/.test(f)).sort()
let count = 0
for (const f of files) {
  copyFileSync(resolve(SRC, f), resolve(OUT_DIR, f))
  count++
}

console.log(`Copied ${count} JPEG placeholders from ${SRC} to ${OUT_DIR}`)