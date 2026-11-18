import Link from "next/link";
import { countEnquiries, countEnquiriesByStatus } from "@/lib/enquiries";
import { isSanityConfigured } from "@/lib/sanity";
import { isAdminAuthConfigured } from "@/lib/admin-auth";
import { getAllServices } from "@/content/services";
import { offices } from "@/content/offices";
import { legalSlugs, serviceSlugs } from "@/lib/site";

export default async function AdminDashboardPage() {
  const [enquiryCount, enquiryCounts] = await Promise.all([
    countEnquiries(),
    countEnquiriesByStatus(),
  ]);
  const services = getAllServices("zh-tw");
  const sanityReady = isSanityConfigured();
  const authReady = isAdminAuthConfigured();

  const cards = [
    {
      label: "服務項目",
      value: String(serviceSlugs.length),
      detail: services.map((s) => s.title).join(" · "),
      href: "/admin/content",
    },
    {
      label: "據點",
      value: String(offices.length),
      detail: "Taipei HQ + regional offices",
      href: "/admin/content",
    },
    {
      label: "客戶詢問",
      value: String(enquiryCount),
      detail: `新進 ${enquiryCounts.new} · 處理中 ${enquiryCounts.in_progress}`,
      href: "/admin/enquiries",
    },
    {
      label: "法務頁面",
      value: String(legalSlugs.length),
      detail: "Privacy, terms, cookies, disclaimer",
      href: "/admin/content",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
        總覽
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted-ink)]">
        Northgo 後台：網站內容、CMS 與客戶詢問收件匣。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-5 shadow-[0_10px_30px_rgba(6,36,69,0.05)] transition hover:border-[color:var(--navy-mid)]/35 hover:shadow-[0_14px_34px_rgba(6,36,69,0.08)]"
          >
            <p className="text-sm text-[color:var(--muted-ink)]">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-[color:var(--navy)]">
              {card.value}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted-ink)]">
              {card.detail}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
          <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
            系統狀態
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-[color:var(--muted-ink)]">後台驗證</span>
              <span
                className={
                  authReady
                    ? "font-medium text-emerald-700"
                    : "font-medium text-amber-700"
                }
              >
                {authReady ? "已設定" : "缺少環境變數"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-[color:var(--muted-ink)]">Sanity CMS</span>
              <span
                className={
                  sanityReady
                    ? "font-medium text-emerald-700"
                    : "font-medium text-[color:var(--muted-ink)]"
                }
              >
                {sanityReady ? "已連線" : "選用／未設定"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-[color:var(--muted-ink)]">詢問信箱 (Resend)</span>
              <span
                className={
                  process.env.RESEND_API_KEY
                    ? "font-medium text-emerald-700"
                    : "font-medium text-[color:var(--muted-ink)]"
                }
              >
                {process.env.RESEND_API_KEY ? "已啟用" : "僅記錄模式"}
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
          <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
            快速操作
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/enquiries"
              className="rounded-full bg-[color:var(--navy-mid)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--navy)]"
            >
              客戶詢問
            </Link>
            <Link
              href="/studio"
              className="rounded-full border border-[color:var(--navy)]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--navy)] transition hover:border-[color:var(--navy)]/35"
            >
              開啟 CMS Studio
            </Link>
            <Link
              href="/zh-tw"
              className="rounded-full border border-[color:var(--navy)]/15 bg-white px-5 py-2.5 text-sm text-[color:var(--navy)]/80 transition hover:border-[color:var(--navy)]/35"
            >
              查看網站
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
