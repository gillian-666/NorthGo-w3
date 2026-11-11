import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return pageMetadata({
    locale: locale as Locale,
    title: `${t("title")} | Northgo`,
    description: t("metaDescription"),
    path: "/news",
  });
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const posts = await getPosts(locale as Locale);

  return (
    <div className="bg-[color:var(--surface-soft)]">
      <div className="mx-auto w-[min(900px,calc(100%-2rem))] py-16">
        <h1 className="font-display text-4xl text-[color:var(--navy)]">
          {t("title")}
        </h1>
        <p className="mt-4 text-[color:var(--muted-ink)]">{t("lead")}</p>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--navy)]/20 bg-white p-10 text-center">
            <p className="text-[color:var(--muted-ink)]">{t("empty")}</p>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="rounded-2xl border border-black/5 bg-white p-6"
              >
                <p className="text-xs text-[color:var(--muted-ink)]">
                  {post.publishedAt}
                </p>
                <h2 className="mt-2 font-display text-xl text-[color:var(--navy)]">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
                  {post.excerpt}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
