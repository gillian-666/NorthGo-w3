import { defineRouting } from "next-intl/routing";

export const locales = ["en", "zh-tw", "ja", "vi"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "EN",
  "zh-tw": "繁中",
  ja: "日本語",
  vi: "TIẾNG VIỆT",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  "zh-tw": "zh-Hant",
  ja: "ja",
  vi: "vi",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
