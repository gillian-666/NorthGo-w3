import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/paths";
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
  const isFreight = slug === "freight-logistics";
  const freightHeroImage = `url("${assetPath("/brand/freight-logistics-hero.jpg")}")`;

  return (
    <div>
      {isFreight ? (
        <section
          className="hero-freight relative overflow-hidden text-white"
          aria-label={service.title}
          style={{ ["--hero-freight-image" as string]: freightHeroImage }}
        >
          <div className="relative z-[1] mx-auto flex w-[min(1180px,calc(100%-2rem))] min-h-[68vh] flex-col justify-end py-20 sm:min-h-[74vh] lg:min-h-[80vh] lg:py-28">
            <div className="hero-freight-copy max-w-2xl">
              <p className="font-display text-2xl font-semibold tracking-[0.08em] text-cyan sm:text-3xl">
                Northgo
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/80 sm:text-xl">
                {service.hero}
              </p>
              <div className="mt-8">
                <Link
                  href="/contact#enquiry"
                  className="inline-flex rounded-full bg-cyan px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110"
                >
                  {t("ctaEnquire")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
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
      )}

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
