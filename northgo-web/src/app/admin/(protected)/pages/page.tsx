import Link from "next/link";
import { getAbout } from "@/content/about";
import { getLegal } from "@/content/legal";
import { getAllServices } from "@/content/services";
import { legalSlugs } from "@/lib/site";

type PageRow = {
  group: string;
  title: string;
  path: string;
};

export default function AdminPagesPage() {
  const about = getAbout("zh-tw");
  const services = getAllServices("zh-tw");
  const rows: PageRow[] = [
    { group: "主要頁面", title: "首頁", path: "/zh-tw" },
    { group: "主要頁面", title: about.title, path: "/zh-tw/about" },
    { group: "主要頁面", title: "據點", path: "/zh-tw/locations" },
    { group: "主要頁面", title: "新聞", path: "/zh-tw/news" },
    { group: "主要頁面", title: "聯絡我們", path: "/zh-tw/contact" },
    ...services.map((service) => ({
      group: "服務",
      title: service.title,
      path: `/zh-tw/services/${service.slug}`,
    })),
    ...legalSlugs.map((slug) => ({
      group: "法務",
      title: getLegal("zh-tw", slug).title,
      path: `/zh-tw/legal/${slug}`,
    })),
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--navy-mid)] uppercase">
          Pages
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
          動態頁面
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-ink)]">
          前台目前可開啟的頁面。內容由網站文案與 CMS 提供，這裡可直接查看每個網址。
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[color:var(--navy)]/8 bg-white shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[linear-gradient(180deg,#f4fafc_0%,#eef4f8_100%)] text-xs tracking-wide text-[color:var(--muted-ink)] uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">分類</th>
              <th className="px-4 py-3 font-semibold">頁面</th>
              <th className="px-4 py-3 font-semibold">路徑</th>
              <th className="px-4 py-3 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.path}
                className="border-t border-[color:var(--navy)]/6"
              >
                <td className="px-4 py-3 text-[color:var(--muted-ink)]">
                  {row.group}
                </td>
                <td className="px-4 py-3 font-medium text-[color:var(--navy)]">
                  {row.title}
                </td>
                <td className="px-4 py-3 text-[color:var(--navy-mid)]">
                  {row.path}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={row.path}
                    className="rounded-full border border-[color:var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--navy)]"
                  >
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
