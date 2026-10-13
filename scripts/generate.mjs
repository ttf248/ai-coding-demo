import { generatedFiles, loadCatalog, write } from "./lib.mjs";
import { prepareSiteAssets } from "./site-assets.mjs";
const catalog = loadCatalog();
await prepareSiteAssets(catalog);
for (const [file, content] of generatedFiles(catalog)) write(file, content);
console.log(
  "Generated catalog, topic indexes and README blocks. Commit these files with the source.",
);
