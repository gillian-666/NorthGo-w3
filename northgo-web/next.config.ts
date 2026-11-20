import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

function readBump() {
  try {
    return readFileSync(path.join(process.cwd(), "BUMP"), "utf8").trim();
  } catch {
    return "";
  }
}

const appVersion = process.env.NEXT_PUBLIC_APP_VERSION?.trim() || readBump();

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGithubPages = process.env.GITHUB_PAGES === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        ...(basePath
          ? {
              basePath,
              assetPrefix: basePath,
            }
          : {}),
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "cdn.prod.website-files.com",
            },
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
            },
          ],
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);

// Bindings (D1) for local `next dev`. Skipped for GitHub Pages static export.
if (!isGithubPages) {
  initOpenNextCloudflareForDev();
}
