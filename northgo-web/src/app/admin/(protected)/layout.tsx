import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e8eef4_0%,#f4f7fa_40%,#eef3f7_100%)] text-[color:var(--text-ink)]">
      <header className="border-b border-[color:var(--navy)]/8 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-5">
            <div>
              <Link
                href="/admin"
                className="font-display text-xl font-bold tracking-tight text-[color:var(--navy)]"
              >
                Back-end
              </Link>
              <p className="text-xs text-[color:var(--muted-ink)]">Northgo Admin</p>
            </div>
            <AdminNav />
          </div>
          <div className="flex items-center gap-3 text-sm text-[color:var(--muted-ink)]">
            <span className="hidden sm:inline">{session.u}</span>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-[min(1180px,calc(100%-2rem))] py-8">{children}</main>
    </div>
  );
}
