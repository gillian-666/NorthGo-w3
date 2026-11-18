import { rename, writeFile, copyFile, access } from "node:fs/promises";
import { constants, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Routes that require a Node server — skip for static GitHub Pages export. */
const moves = [
  ["src/app/api", "src/app/_api_skip"],
  ["src/app/admin", "src/app/_admin_skip"],
  ["src/app/studio", "src/app/_studio_skip"],
];

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function movePair(fromRel, toRel, restore = false) {
  const from = path.join(root, restore ? toRel : fromRel);
  const to = path.join(root, restore ? fromRel : toRel);
  if (await exists(from)) {
    await rename(from, to);
  }
}

async function stash() {
  for (const [from, to] of moves) {
    await movePair(from, to, false);
  }
}

async function restore() {
  for (const [from, to] of moves) {
    await movePair(from, to, true);
  }
}

const env = {
  ...process.env,
  GITHUB_PAGES: "1",
  NEXT_PUBLIC_STATIC_EXPORT: "1",
  NEXT_PUBLIC_BASE_PATH: "/NorthGo-w3",
  NEXT_PUBLIC_SITE_URL: "https://gillian-666.github.io/NorthGo-w3",
};

let exitCode = 0;
try {
  await stash();
  const result = spawnSync("npx", ["next", "build"], {
    cwd: root,
    env,
    stdio: "inherit",
    shell: true,
  });
  exitCode = result.status ?? 1;
} finally {
  await restore();
}

if (exitCode !== 0) {
  process.exit(exitCode);
}

const outDir = path.join(root, "out");
await writeFile(path.join(outDir, ".nojekyll"), "");
const bumpSrc = path.join(root, "..", "BUMP");
if (existsSync(bumpSrc)) {
  await copyFile(bumpSrc, path.join(outDir, "BUMP"));
}
console.log("GitHub Pages static export ready in northgo-web/out");
