import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import postcss from "postcss";
import tailwind from "tailwindcss";
import { transformSync } from "@babel/core";
import presetReact from "@babel/preset-react";
import { ROOT, resolveLocal, write } from "./lib.mjs";
export async function prepareSiteAssets(catalog) {
  const queue = catalog.runs.flatMap(
    (run) =>
      run.screenshotInfo?.variants.map((variant) => ({ run, variant })) || [],
  );
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < queue.length) {
        const { run, variant } = queue[cursor++];
        const destination = resolveLocal(variant.path);
        if (fs.existsSync(destination)) continue;
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        await sharp(resolveLocal(`${run.directory}/${run.screenshot}`))
          .resize({ width: variant.width, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(destination);
      }
    }),
  );
  for (const [file, content] of await siteResourceOutputs(catalog))
    write(file, content);
  console.log(
    `Prepared screenshot variants and local resources for ${catalog.guides.length} guides.`,
  );
}
export async function siteResourceOutputs(catalog) {
  const outputs = new Map();
  const vendorFiles = {
    "react.js": "react/umd/react.production.min.js",
    "react-dom.js": "react-dom/umd/react-dom.production.min.js",
    "vue.js": "vue/dist/vue.global.prod.js",
    "lucide.js": "lucide/dist/umd/lucide.min.js",
  };
  const licenses = [];
  for (const [file, source] of Object.entries(vendorFiles)) {
    outputs.set(
      `assets/generated/vendor/${file}`,
      fs.readFileSync(path.join(ROOT, "node_modules", source)),
    );
    const packageName = source.split("/")[0];
    const packageJson = JSON.parse(
      fs.readFileSync(
        path.join(ROOT, "node_modules", packageName, "package.json"),
        "utf8",
      ),
    );
    const licenseName = ["LICENSE", "LICENSE.md", "LICENSE.txt"].find((name) =>
      fs.existsSync(path.join(ROOT, "node_modules", packageName, name)),
    );
    if (licenseName)
      outputs.set(
        `assets/generated/vendor/${packageName}-LICENSE.txt`,
        fs.readFileSync(
          path.join(ROOT, "node_modules", packageName, licenseName),
        ),
      );
    licenses.push({
      package: packageName,
      version: packageJson.version,
      license: packageJson.license,
    });
  }
  outputs.set(
    "assets/generated/vendor/manifest.json",
    JSON.stringify(licenses, null, 2) + "\n",
  );
  const reactSource = resolveLocal("docs/react/demo.jsx");
  if (fs.existsSync(reactSource))
    outputs.set(
      "assets/generated/guide-react.js",
      transformSync(fs.readFileSync(reactSource, "utf8"), {
        presets: [presetReact],
        comments: false,
        compact: true,
      }).code + "\n",
    );
  const result = await postcss([
    tailwind({
      content: catalog.guides
        .map((guide) => resolveLocal(guide.example))
        .concat([reactSource]),
      corePlugins: { preflight: true },
      theme: {
        extend: {
          animation: {
            "fade-in": "fadeIn 0.5s ease-in-out",
            "slide-up": "slideUp 0.3s ease-out",
          },
          keyframes: {
            fadeIn: {
              "0%": { opacity: "0", transform: "translateY(10px)" },
              "100%": { opacity: "1", transform: "translateY(0)" },
            },
            slideUp: {
              "0%": { transform: "translateY(20px)", opacity: "0" },
              "100%": { transform: "translateY(0)", opacity: "1" },
            },
          },
        },
      },
    }),
  ]).process("@tailwind base;\n@tailwind components;\n@tailwind utilities;", {
    from: undefined,
  });
  outputs.set("assets/generated/guide-demos.css", result.css);
  return outputs;
}
