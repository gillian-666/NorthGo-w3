"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { serviceSlugs } from "@/lib/site";
import { assetPath } from "@/lib/paths";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const ts = useTranslations("services");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/about" as const, label: t("about") },
    { href: "/locations" as const, label: t("locations") },
    { href: "/news" as const, label: t("news") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--navy-deep)]/90 text-white backdrop-blur-md">
      <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center" aria-label="Northgo">
          <img
            src={assetPath("/brand/logo-teal-blue.svg")}
            alt="Northgo"
            width={160}
            height={31}
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div className="group relative">
            <button
              type="button"
              className="text-sm text-white/85 transition hover:text-cyan"
            >
              {t("services")}
            </button>
            <div className="invisible absolute left-0 top-full z-20 min-w-[220px] translate-y-2 rounded-xl border border-[color:var(--line)] bg-[color:var(--navy)] p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-1 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {serviceSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/5 hover:text-cyan"
                >
                  {ts(slug)}
                </Link>
              ))}
            </div>
          </div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-cyan ${
                pathname === link.href ? "text-cyan" : "text-white/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link
            href="/contact#enquiry"
            className="rounded-full border border-cyan px-4 py-2 text-sm font-semibold text-cyan transition hover:bg-cyan hover:text-[color:var(--navy-deep)]"
          >
            {t("enquire")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("close") : t("menu")}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-[color:var(--navy-deep)] lg:hidden"
        >
          <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col gap-1 py-3">
            <p className="px-2 text-xs tracking-wide text-white/50 uppercase">
              {t("services")}
            </p>
            {serviceSlugs.map((slug) => (
              <Link
                key={slug}
                href={`/services/${slug}`}
                className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {ts(slug)}
              </Link>
            ))}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact#enquiry"
              className="mt-2 rounded-full border border-cyan px-4 py-2 text-center text-sm font-semibold text-cyan"
              onClick={() => setOpen(false)}
            >
              {t("enquire")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
