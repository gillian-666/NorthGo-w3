"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  match: string;
  exact?: boolean;
  external?: boolean;
  roles?: ReadonlyArray<"owner" | "admin">;
};

const nav: NavItem[] = [
  { href: "/admin/enquiries", label: "客戶詢問", match: "/admin/enquiries" },
  { href: "/admin/content", label: "網站內容", match: "/admin/content" },
  { href: "/admin/media", label: "媒體", match: "/admin/media" },
  { href: "/admin/pages", label: "動態頁面", match: "/admin/pages" },
  {
    href: "/admin/users",
    label: "使用者",
    match: "/admin/users",
    roles: ["owner", "admin"],
  },
  { href: "/admin", label: "總覽", match: "/admin", exact: true },
];

type Props = {
  role?: string;
};

export function AdminNav({ role }: Props) {
  const pathname = usePathname();
  const visibleNav = nav.filter((item) => {
    if (!item.roles) return true;
    return role === "owner" || role === "admin"
      ? item.roles.includes(role)
      : false;
  });

  return (
    <nav
      className="flex flex-wrap gap-1 rounded-full border border-[color:var(--navy)]/8 bg-[color:var(--surface-soft)] p-1"
      aria-label="後台導覽"
    >
      {visibleNav.map((item) => {
        const active = item.exact
          ? pathname === item.match
          : pathname === item.match || pathname.startsWith(`${item.match}/`);
        const className = `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
          active
            ? "bg-white text-[color:var(--navy)] shadow-[0_4px_12px_rgba(6,36,69,0.08)] ring-1 ring-cyan/80"
            : "text-[color:var(--navy)]/65 hover:bg-white/80 hover:text-[color:var(--navy)]"
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
