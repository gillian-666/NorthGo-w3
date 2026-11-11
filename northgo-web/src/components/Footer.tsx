import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("services");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[color:var(--navy-deep)] text-white">
      <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" aria-label="Northgo">
            <img
              src="/brand/logo-teal-white.svg"
              alt="Northgo"
              width={160}
              height={31}
              className="h-8 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-white/70">{t("tagline")}</p>
        </div>

        <div>
          <p className="text-xs tracking-wider text-white/50 uppercase">
            {t("services")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {serviceSlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/services/${slug}`} className="hover:text-cyan">
                  {ts(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-wider text-white/50 uppercase">
            {t("company")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-cyan">
                {tn("about")}
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:text-cyan">
                {tn("locations")}
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-cyan">
                {tn("news")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan">
                {tn("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-wider text-white/50 uppercase">
            {t("legal")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/legal/privacy-policy" className="hover:text-cyan">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-cyan">
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/legal/cookie-policy" className="hover:text-cyan">
                {t("cookie")}
              </Link>
            </li>
            <li>
              <Link href="/legal/disclaimer" className="hover:text-cyan">
                {t("disclaimer")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/45">
        {t("rights", { year })}
      </div>
    </footer>
  );
}
