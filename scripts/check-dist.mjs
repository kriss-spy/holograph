import { readdir, readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
const files = await readdir("dist", { recursive: true });
assert(files.includes("index.html") && files.includes("about.html"));
for (const name of files.filter((f) => /\.(html|json|js|css|txt)$/.test(f))) {
  const text = await readFile(path.join("dist", name), "utf8");
  assert(
    !/\/home\/krisspy|obsidian:\/\/|file:\/\//.test(text),
    `Private reference in ${name}`,
  );
  if (name.endsWith(".html")) {
    for (const match of text.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const url = match[1];
      if (/^(https?:|#)/.test(url)) continue;
      assert(
        !url.startsWith("/"),
        `Root-only link fails GitHub project pages: ${url}`,
      );
      await access(path.resolve("dist", path.dirname(name), url.split("#")[0]));
    }
  }
}
assert(!files.some((f) => f.endsWith(".map") || f.includes("node_modules")));
console.log(
  "Public build: all local HTML links resolve; no private paths, source maps or node_modules.",
);
