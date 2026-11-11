import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { siteConfig } from "./site";

export function buildAlternates(path: string): Metadata["alternates"] {
  const normalized = path === "/" ? "" : path;
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    languages[locale === "zh-tw" ? "zh-TW" : locale] =
      `${siteConfig.url}${prefix}${normalized || "/"}`;
  }
  languages["x-default"] = `${siteConfig.url}${normalized || "/"}`;

  return {
    canonical: `${siteConfig.url}${normalized || "/"}`,
    languages,
  };
}

export function pageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const urlPath = path.startsWith("/") ? path : `/${path}`;
  const localizedPath =
    locale === "en" ? urlPath : `/${locale}${urlPath === "/" ? "" : urlPath}`;

  return {
    title,
    description,
    alternates: buildAlternates(urlPath),
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${localizedPath === "/" ? "" : localizedPath}`,
      siteName: siteConfig.name,
      locale: locale === "zh-tw" ? "zh_TW" : locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
