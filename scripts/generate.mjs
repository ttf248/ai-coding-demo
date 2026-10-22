import fs from "node:fs";
import { generatedFiles, loadCatalog, write, resolveLocal } from "./lib.mjs";
import { obsoleteDocumentReaders } from "./site-output.mjs";
import { prepareSiteAssets } from "./site-assets.mjs";
const catalog = loadCatalog();
await prepareSiteAssets(catalog);
const outputs = generatedFiles(catalog);
for (const [file, content] of outputs) write(file, content);
for (const file of obsoleteDocumentReaders(outputs))
  fs.unlinkSync(resolveLocal(file));
console.log(
  "Generated catalog, topic indexes and README blocks. Commit these files with the source.",
);
