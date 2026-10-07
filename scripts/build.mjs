import { build } from "esbuild";
import { readFile, writeFile, rm, mkdir, cp } from "node:fs/promises";
import path from "node:path";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("data/hololive-relations.json", "dist/hololive-relations.json");
await cp("research/wiki-name-audit.json", "dist/wiki-name-audit.json");
const result = await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  splitting: true,
  format: "esm",
  target: ["es2022"],
  outdir: "dist",
  entryNames: "assets/app-[hash]",
  chunkNames: "assets/chunk-[hash]",
  assetNames: "assets/[name]-[hash]",
  metafile: true,
  legalComments: "linked",
});
const entries = Object.entries(result.metafile.outputs);
const js = entries.find(([, v]) => v.entryPoint === "src/main.js");
const relative = (p) =>
  "./" + path.relative("dist", p).split(path.sep).join("/");
let html = await readFile("src/index.html", "utf8");
html = html
  .replace(
    "<!-- STYLES -->",
    `<link rel="stylesheet" href="${relative(js[1].cssBundle)}">`,
  )
  .replace(
    "<!-- SCRIPTS -->",
    `<script type="module" src="${relative(js[0])}"></script>`,
  );
await writeFile("dist/index.html", html);
console.log(
  "Built deployable static site in dist/. JS/CSS filenames are content hashed.",
);
