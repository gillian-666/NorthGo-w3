import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EnquireForm } from "@/components/EnquireForm";
import { offices } from "@/content/offices";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale: locale as Locale,
    title: `${t("title")} | Northgo`,
    description: t("lead"),
    path: "/contact",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const loc = locale as Locale;

  return (
    <div className="bg-[color:var(--navy-deep)] text-white">
      <div className="mx-auto grid w-[min(1100px,calc(100%-2rem))] gap-10 py-16 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-white/75">{t("lead")}</p>
          <EnquireForm />
        </div>

        <aside className="space-y-4 lg:pt-24">
          <h2 className="font-display text-2xl">{t("officesTitle")}</h2>
          <ul className="space-y-3">
            {offices.slice(0, 4).map((o) => (
              <li
                key={o.id}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
              >
                <p className="font-semibold">{o.names[loc] ?? o.names.en}</p>
                <p className="mt-1 text-sm text-white/65">
                  {o.addresses[loc] ?? o.addresses.en}
                </p>
                <a href={`tel:${o.tel}`} className="mt-2 block text-sm text-cyan">
                  {o.tel}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/locations"
            className="inline-flex text-sm font-semibold text-cyan hover:underline"
          >
            {t("officesCta")} →
          </Link>
        </aside>
      </div>
    </div>
  );
}
