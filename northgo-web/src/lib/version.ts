import { readFileSync } from "node:fs";
import path from "node:path";

function readBumpFile(): string | null {
  const candidates = [
    path.join(process.cwd(), "BUMP"),
    path.join(process.cwd(), "..", "BUMP"),
  ];
  for (const file of candidates) {
    try {
      const value = readFileSync(file, "utf8").trim();
      if (value) return value;
    } catch {
      // try next candidate
    }
  }
  return null;
}

/** Release marker shown in the site footer copyright line. */
export function getAppVersion() {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
    readBumpFile() ||
    process.env.npm_package_version ||
    "0.0.0"
  );
}
