import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getLegal } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";
import { legalSlugs, type LegalSlug } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!legalSlugs.includes(slug as LegalSlug)) return {};
  const page = getLegal(locale as Locale, slug as LegalSlug);
  return pageMetadata({
    locale: locale as Locale,
    title: `${page.title} | Northgo`,
    description: page.metaDescription,
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!legalSlugs.includes(slug as LegalSlug)) notFound();
  const page = getLegal(locale as Locale, slug as LegalSlug);

  return (
    <article className="mx-auto w-[min(800px,calc(100%-2rem))] py-16">
      <h1 className="font-display text-4xl text-[color:var(--navy)]">
        {page.title}
      </h1>
      <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
        Updated {page.updated}
      </p>
      <div className="mt-10 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl text-[color:var(--navy)]">
              {section.heading}
            </h2>
            {section.paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="mt-3 text-[color:var(--muted-ink)]"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
