"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, locales, type Locale } from "@/i18n/routing";

type Props = {
  compact?: boolean;
};

export function LanguageSwitcher({ compact }: Props) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex flex-wrap gap-1 rounded-full border border-white/15 bg-black/20 p-1 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={locale === code}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === code
              ? "bg-[color:var(--cyan-dim)] font-semibold text-cyan"
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => router.replace(pathname, { locale: code })}
        >
          {localeNames[code]}
        </button>
      ))}
    </div>
  );
}
