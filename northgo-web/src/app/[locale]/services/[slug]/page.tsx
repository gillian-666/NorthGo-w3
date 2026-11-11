import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { serviceSlugs, type ServiceSlug } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!serviceSlugs.includes(slug as ServiceSlug)) return {};
  const service = getService(locale as Locale, slug as ServiceSlug);
  return pageMetadata({
    locale: locale as Locale,
    title: `${service.title} | Northgo`,
    description: service.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!serviceSlugs.includes(slug as ServiceSlug)) notFound();

  const service = getService(locale as Locale, slug as ServiceSlug);
  const t = await getTranslations("home");

  return (
    <div>
      <section className="hero-pattern relative text-white">
        <div className="relative mx-auto w-[min(900px,calc(100%-2rem))] py-20">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{service.hero}</p>
          <Link
            href="/contact#enquiry"
            className="mt-8 inline-flex rounded-full bg-cyan px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)]"
          >
            {t("ctaEnquire")}
          </Link>
        </div>
      </section>

      <div className="mx-auto w-[min(900px,calc(100%-2rem))] py-14">
        <p className="text-lg text-[color:var(--muted-ink)]">{service.intro}</p>

        <div className="mt-12 space-y-10">
          {service.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-2xl border border-black/5 bg-[color:var(--surface-soft)] p-6"
            >
              <h2 className="font-display text-2xl text-[color:var(--navy)]">
                {section.title}
              </h2>
              <p className="mt-3 text-[color:var(--muted-ink)]">{section.body}</p>
              {section.bullets ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color:var(--muted-ink)]">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
