import { writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = {
  ...process.env,
  GITHUB_PAGES: "1",
  NEXT_PUBLIC_STATIC_EXPORT: "1",
  NEXT_PUBLIC_BASE_PATH: "/NorthGo-w3",
  NEXT_PUBLIC_SITE_URL: "https://gillian-666.github.io/NorthGo-w3",
};

const result = spawnSync("npx", ["next", "build"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const outDir = path.join(root, "out");
await writeFile(path.join(outDir, ".nojekyll"), "");
const bumpSrc = path.join(root, "..", "BUMP");
if (existsSync(bumpSrc)) {
  await copyFile(bumpSrc, path.join(outDir, "BUMP"));
}
console.log("GitHub Pages static export ready in northgo-web/out");
