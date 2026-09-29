import { generatedFiles, loadCatalog, write } from "./lib.mjs";
for (const [file, content] of generatedFiles(loadCatalog()))
  write(file, content);
console.log(
  "Generated catalog, topic indexes and README blocks. Commit these files with the source.",
);
