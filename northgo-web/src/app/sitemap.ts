import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { legalSlugs, serviceSlugs, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function localizedUrl(locale: string, path: string) {
  const normalized = path === "/" ? "" : path;
  if (locale === "en") return `${siteConfig.url}${normalized || "/"}`;
  return `${siteConfig.url}/${locale}${normalized}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about",
    "/contact",
    "/locations",
    "/news",
    ...serviceSlugs.map((s) => `/services/${s}`),
    ...legalSlugs.map((s) => `/legal/${s}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
