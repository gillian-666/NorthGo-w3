import { setRequestLocale } from "next-intl/server";
import { getAbout } from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const about = getAbout(locale as Locale);
  return pageMetadata({
    locale: locale as Locale,
    title: `${about.title} | Northgo`,
    description: about.metaDescription,
    path: "/about",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const about = getAbout(locale as Locale);

  return (
    <div className="bg-[color:var(--surface-soft)]">
      <section className="hero-pattern relative text-white">
        <div className="relative mx-auto w-[min(900px,calc(100%-2rem))] py-20">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            {about.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{about.lead}</p>
        </div>
      </section>

      <div className="mx-auto w-[min(900px,calc(100%-2rem))] space-y-12 py-16">
        <section>
          <h2 className="font-display text-2xl text-[color:var(--navy)]">
            {about.visionTitle}
          </h2>
          <p className="mt-3 text-xl text-[color:var(--navy-mid)]">
            {about.vision}
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-[color:var(--navy)]">
            {about.missionTitle}
          </h2>
          <p className="mt-3 text-xl text-cyan">{about.mission}</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-[color:var(--navy)]">
            {about.valuesTitle}
          </h2>
          <p className="mt-3 text-[color:var(--muted-ink)]">{about.valuesIntro}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {about.values.map((v) => (
              <article
                key={v.title}
                className="rounded-2xl border border-black/5 bg-white p-5"
              >
                <h3 className="font-display text-lg text-[color:var(--navy)]">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-[color:var(--navy)]">
            {about.storyTitle}
          </h2>
          {about.story.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 text-[color:var(--muted-ink)]">
              {p}
            </p>
          ))}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[color:var(--navy)] p-5 text-white">
              <h3 className="font-display text-lg text-cyan">
                {about.changedTitle}
              </h3>
              <p className="mt-2 text-sm text-white/75">{about.changed}</p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <h3 className="font-display text-lg text-[color:var(--navy)]">
                {about.sameTitle}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
                {about.same}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-8 text-center">
          <h2 className="font-display text-2xl text-[color:var(--navy)]">
            {about.closingTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--muted-ink)]">
            {about.closing}
          </p>
        </section>
      </div>
    </div>
  );
}
