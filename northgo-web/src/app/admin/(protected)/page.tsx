import Link from "next/link";
import Image from "next/image";
import { countEnquiries, countEnquiriesByStatus } from "@/lib/enquiries";
import { isSanityConfigured } from "@/lib/sanity";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth";
import {
  canManageUsers,
  ensureBootstrapOwner,
  listAdminUsers,
  type AdminRole,
} from "@/lib/admin-users";
import { getAllServices } from "@/content/services";
import { offices } from "@/content/offices";
import { legalSlugs, serviceSlugs } from "@/lib/site";

export default async function AdminDashboardPage() {
  await ensureBootstrapOwner();
  const [enquiryCount, enquiryCounts, users, session] = await Promise.all([
    countEnquiries(),
    countEnquiriesByStatus(),
    listAdminUsers(),
    getAdminSession(),
  ]);
  const services = getAllServices("zh-tw");
  const sanityReady = isSanityConfigured();
  const authReady = isAdminAuthConfigured();
  const role = (session?.role || "owner") as AdminRole;
  const showUsers = canManageUsers(role);
  const roleLabel = (value: AdminRole) =>
    value === "owner" ? "擁有者" : value === "admin" ? "管理員" : "編輯者";
  const activeUsers = users.filter((user) => user.status === "active");
  const adminNames = activeUsers
    .filter((user) => user.role === "admin")
    .map((user) => user.displayName);

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
      label: "後台使用者",
      value: String(users.length),
      detail:
        adminNames.length > 0
          ? `啟用 ${activeUsers.length} · ${adminNames.join("、")}`
          : `啟用 ${activeUsers.length} · 尚無管理員`,
      href: showUsers ? "/admin/users" : "/admin",
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
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--navy)]">
        <Image
          src="/brand/globe-light-ocean-v2.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
          sizes="(max-width: 1180px) 100vw, 1180px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,24,47,0.92)_0%,rgba(6,36,69,0.72)_55%,rgba(10,58,102,0.45)_100%)]" />
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">
            Northgo Admin
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            總覽
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75">
            網站內容、CMS、客戶詢問與多人後台帳號，集中管理。
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden rounded-2xl border border-[color:var(--navy)]/8 bg-white p-5 shadow-[0_10px_30px_rgba(6,36,69,0.05)] transition hover:-translate-y-0.5 hover:border-cyan/50 hover:shadow-[0_16px_36px_rgba(6,36,69,0.1)]"
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan to-[color:var(--navy-mid)]" />
            <p className="text-sm text-[color:var(--muted-ink)]">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-[color:var(--navy)]">
              {card.value}
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
              {card.detail}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
              後台團隊
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
              這些帳號可登入後台，使用詢問、內容與總覽。
            </p>
          </div>
          {showUsers ? (
            <Link
              href="/admin/users"
              className="rounded-full border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--navy)] transition hover:border-[color:var(--navy)]/35"
            >
              管理使用者
            </Link>
          ) : null}
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 rounded-2xl border border-[color:var(--navy)]/8 bg-[color:var(--surface-soft)] px-4 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan/30 text-sm font-bold text-[color:var(--navy)]">
                {(user.displayName || user.username).slice(0, 1)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-[color:var(--navy)]">
                  {user.displayName}
                </span>
                <span className="block truncate text-xs text-[color:var(--muted-ink)]">
                  {user.username} · {roleLabel(user.role)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
          <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
            系統狀態
          </h2>
          <ul className="mt-4 divide-y divide-[color:var(--navy)]/6 text-sm">
            {[
              {
                label: "後台驗證",
                ok: authReady,
                text: authReady ? "已設定" : "缺少環境變數",
              },
              {
                label: "Sanity CMS",
                ok: sanityReady,
                text: sanityReady ? "已連線" : "選用／未設定",
              },
              {
                label: "詢問信箱",
                ok: Boolean(process.env.RESEND_API_KEY),
                text: process.env.RESEND_API_KEY ? "已啟用" : "僅記錄模式",
              },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-[color:var(--muted-ink)]">{item.label}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.ok
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-[color:var(--surface-soft)] text-[color:var(--muted-ink)] ring-1 ring-[color:var(--navy)]/10"
                  }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-6 shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
          <h2 className="font-display text-xl font-semibold text-[color:var(--navy)]">
            快速操作
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/enquiries"
              className="rounded-full border border-[color:var(--navy)]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--navy)] transition hover:border-[color:var(--navy)]/35"
            >
              客戶詢問
            </Link>
            {showUsers ? (
              <Link
                href="/admin/users"
                className="rounded-full border border-[color:var(--navy)]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--navy)] transition hover:border-[color:var(--navy)]/35"
              >
                使用者管理
              </Link>
            ) : null}
            <Link
              href="/studio"
              className="rounded-full bg-cyan px-5 py-2.5 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110"
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
