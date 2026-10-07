import { createHash } from "node:crypto";
import { themeStylesheet } from "../src/themes.js";
import { build } from "esbuild";
import { readFile, writeFile, rm, mkdir, cp } from "node:fs/promises";
import path from "node:path";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("data/hololive-relations.json", "dist/hololive-relations.json");
await cp("research/wiki-name-audit.json", "dist/wiki-name-audit.json");
await cp("research/holodex-name-audit.json", "dist/holodex-name-audit.json");
await cp("research/sora-name-audit.json", "dist/sora-name-audit.json");
// A synchronous, CSP-compatible script restores the theme before CSS and first paint.
const themeBundle = await build({
  entryPoints: ["src/theme-bootstrap.js"],
  bundle: true, minify: true, format: "iife", target: ["es2022"],
  outdir: "dist", entryNames: "assets/theme-[hash]", metafile: true,
});
const themeFile = Object.keys(themeBundle.metafile.outputs)[0];
const themeScript = `<script src="./${path.relative("dist", themeFile).split(path.sep).join("/")}"></script>`;
const themeCss = themeStylesheet();
const themeCssFile = `assets/themes-${createHash("sha256").update(themeCss).digest("hex").slice(0, 12)}.css`;
await writeFile(path.join("dist", themeCssFile), themeCss);
const themeStyles = `<link rel="stylesheet" href="./${themeCssFile}">`;
let about = await readFile("public/about.html", "utf8");
about = about.replace("<!-- THEME -->", themeScript).replace("<!-- THEME-STYLES -->", themeStyles);
await writeFile("dist/about.html", about);
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
  .replace("<!-- THEME -->", themeScript)
  .replace(
    "<!-- STYLES -->",
    `${themeStyles}<link rel="stylesheet" href="${relative(js[1].cssBundle)}">`,
  )
  .replace(
    "<!-- SCRIPTS -->",
    `<script type="module" src="${relative(js[0])}"></script>`,
  );
await writeFile("dist/index.html", html);
console.log(
  "Built deployable static site in dist/. JS/CSS filenames are content hashed.",
);
