import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { AdminNav } from "@/components/admin/AdminNav";
import { getAdminSession } from "@/lib/admin-auth";
import {
  ensureBootstrapOwner,
  getAdminUserByUsername,
  type AdminRole,
} from "@/lib/admin-users";

async function resolveRole(username: string, role?: AdminRole) {
  if (role) return role;
  await ensureBootstrapOwner();
  const user = await getAdminUserByUsername(username);
  return (user?.role || "owner") as AdminRole;
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const role = await resolveRole(session.u, session.role);

  const roleLabel =
    role === "owner" ? "擁有者" : role === "admin" ? "管理員" : "編輯者";
  const initial = (session.u || "?").slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_420px_at_0%_-10%,rgba(42,212,232,0.16),transparent_55%),linear-gradient(180deg,#e7eef5_0%,#f6f8fb_42%,#eef3f7_100%)] text-[color:var(--text-ink)]">
      <header className="sticky top-0 z-40 border-b border-[color:var(--navy)]/8 bg-white/80 shadow-[0_8px_24px_rgba(6,36,69,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--navy)] font-display text-sm font-bold text-cyan shadow-[0_8px_16px_rgba(6,36,69,0.18)]">
                N
              </span>
              <span>
                <span className="block font-display text-lg font-bold leading-none tracking-tight text-[color:var(--navy)]">
                  後端
                </span>
                <span className="mt-1 block text-[11px] text-[color:var(--muted-ink)]">
                  Northgo 行政管理
                </span>
              </span>
            </Link>
            <AdminNav role={role} />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-white py-1 pr-3 pl-1 sm:inline-flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan/30 text-xs font-bold text-[color:var(--navy)]">
                {initial}
              </span>
              <span className="text-sm font-medium text-[color:var(--navy)]">
                {session.u}
              </span>
              <span className="rounded-full bg-[color:var(--surface-soft)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--navy-mid)]">
                {roleLabel}
              </span>
            </span>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-[min(1180px,calc(100%-2rem))] py-8">{children}</main>
    </div>
  );
}
