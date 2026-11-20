import Link from "next/link";
import { getAllServices } from "@/content/services";
import { getAbout } from "@/content/about";
import { offices } from "@/content/offices";
import { isSanityConfigured } from "@/lib/sanity";
import { locales } from "@/i18n/routing";

export default function AdminContentPage() {
  const services = getAllServices("zh-tw");
  const about = getAbout("zh-tw");
  const sanityReady = isSanityConfigured();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--navy-mid)] uppercase">
          Content
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
          網站內容
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-ink)]">
          目前網站由本機 TypeScript 內容驅動。連上 Sanity 後可在 Studio 編輯相同結構，無需重新部署文案檔。
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
          CMS Studio
        </h2>
        <p className="mt-2 text-sm text-[color:var(--muted-ink)]">
          {sanityReady
            ? "Sanity 專案已設定。可開啟 Studio 管理頁面、服務、據點、法務與新聞。"
            : "Sanity 為選用。設定 NEXT_PUBLIC_SANITY_PROJECT_ID 與 NEXT_PUBLIC_SANITY_DATASET 即可啟用 Studio。"}
        </p>
        <Link
          href="/studio"
          className="mt-4 inline-flex rounded-full bg-cyan px-5 py-2.5 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110"
        >
          開啟 Studio
        </Link>
      </div>

      <section className="mt-8 rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
          語系
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {locales.map((locale) => (
            <span
              key={locale}
              className="rounded-full bg-[color:var(--surface-soft)] px-3 py-1 text-sm font-medium text-[color:var(--navy)] ring-1 ring-[color:var(--navy)]/10"
            >
              {locale}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
          服務
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <li
              key={service.slug}
              className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-5 shadow-[0_8px_24px_rgba(6,36,69,0.04)] transition hover:border-cyan/40 hover:shadow-[0_14px_30px_rgba(6,36,69,0.08)]"
            >
              <p className="font-medium text-[color:var(--navy)]">{service.title}</p>
              <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
                {service.metaDescription}
              </p>
              <Link
                href={`/zh-tw/services/${service.slug}`}
                className="mt-3 inline-block text-sm font-medium text-[color:var(--navy-mid)] hover:underline"
              >
                查看頁面
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
          關於我們摘要
        </h2>
        <p className="mt-2 text-sm text-[color:var(--muted-ink)]">{about.lead}</p>
      </section>

      <section className="mt-8 rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
          據點
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted-ink)]">
          {offices.map((office) => (
            <li key={office.id}>
              <span className="font-medium text-[color:var(--navy)]">
                {office.names["zh-tw"]}
              </span>
              <span> — {office.addresses["zh-tw"]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
