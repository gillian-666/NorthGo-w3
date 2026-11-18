"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin/enquiries", label: "客戶詢問", match: "/admin/enquiries" },
  { href: "/admin/content", label: "網站內容", match: "/admin/content" },
  { href: "/studio", label: "媒體 / CMS", match: "/studio", external: true },
  { href: "/admin", label: "總覽", match: "/admin", exact: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2" aria-label="後台導覽">
      {nav.map((item) => {
        const active = item.exact
          ? pathname === item.match
          : pathname === item.match || pathname.startsWith(`${item.match}/`);
        const className = `rounded-full px-4 py-2 text-sm font-medium transition ${
          active
            ? "bg-[color:var(--navy)] text-white shadow-sm"
            : "bg-white text-[color:var(--navy)]/70 ring-1 ring-[color:var(--navy)]/10 hover:text-[color:var(--navy)] hover:ring-[color:var(--navy)]/25"
        }`;

        if (item.external) {
          return (
            <a key={item.href} href={item.href} className={className}>
              {item.label}
            </a>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
