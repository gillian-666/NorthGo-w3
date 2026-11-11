import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllServices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale: locale as Locale,
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: "/",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const services = getAllServices(locale as Locale);

  return (
    <>
      <section
        className="hero-pattern relative overflow-hidden text-white"
        aria-label="Earth globe background"
      >
        <div className="relative mx-auto flex w-[min(1180px,calc(100%-2rem))] min-h-[70vh] flex-col justify-end py-20 lg:min-h-[78vh] lg:py-28">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold tracking-[0.2em] text-cyan uppercase">
              Northgo
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl lg:text-7xl">
              {t("heroTitle")}{" "}
              <span className="text-cyan">{t("heroAccent")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">{t("heroLead")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact#enquiry"
                className="rounded-full bg-cyan px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)]"
              >
                {t("ctaEnquire")}
              </Link>
              <Link
                href="/services/freight-logistics"
                className="rounded-full border border-cyan px-6 py-3 text-sm font-semibold text-cyan"
              >
                {t("ctaServices")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--surface-soft)] py-16">
        <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
          <p className="text-sm font-semibold tracking-wider text-[color:var(--navy-mid)] uppercase">
            {t("purposeEyebrow")}
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl text-[color:var(--navy)] sm:text-4xl">
            {t("purposeTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-[color:var(--muted-ink)]">
            {t("purposeBody")}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              [t("statsYears"), t("statsYearsLabel")],
              [t("statsOffices"), t("statsOfficesLabel")],
              [t("statsServices"), t("statsServicesLabel")],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-black/5 bg-white p-6"
              >
                <p className="font-display text-3xl font-bold text-[color:var(--navy)]">
                  {value}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
          <h2 className="font-display text-3xl text-[color:var(--navy)] sm:text-4xl">
            {t("servicesTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-[color:var(--muted-ink)]">
            {t("servicesLead")}
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.slug}
                className="rounded-2xl border border-black/8 bg-[color:var(--surface-soft)] p-6 transition hover:border-cyan/40"
              >
                <h3 className="font-display text-xl text-[color:var(--navy)]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-[color:var(--muted-ink)]">
                  {service.intro}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-[color:var(--navy-mid)] hover:text-cyan"
                >
                  {t("learnMore")} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-northgo" className="bg-[color:var(--navy)] py-16 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
          <h2 className="font-display text-3xl sm:text-4xl">{t("whyTitle")}</h2>
          <p className="mt-4 max-w-3xl text-white/75">{t("whyBody")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {(
              ["experts", "flexible", "people", "committed"] as const
            ).map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="font-display text-lg text-cyan">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {t(`pillars.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(900px,calc(100%-2rem))] text-center">
          <h2 className="font-display text-3xl text-[color:var(--navy)] sm:text-4xl">
            {t("partnerTitle")}
          </h2>
          <p className="mt-4 text-[color:var(--muted-ink)]">{t("partnerBody")}</p>
          <Link
            href="/contact#enquiry"
            className="mt-8 inline-flex rounded-full bg-[color:var(--navy)] px-6 py-3 text-sm font-bold text-white hover:bg-[color:var(--navy-mid)]"
          >
            {t("partnerCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
