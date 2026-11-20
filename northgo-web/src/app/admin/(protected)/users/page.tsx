import { redirect } from "next/navigation";
import { AdminUserManager } from "@/components/admin/AdminUserManager";
import { getAdminSession } from "@/lib/admin-auth";
import {
  canManageUsers,
  ensureBootstrapOwner,
  getAdminUserByUsername,
  listAdminUsers,
  toPublicUser,
  type AdminRole,
} from "@/lib/admin-users";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  await ensureBootstrapOwner();
  const actorUser = await getAdminUserByUsername(session.u);
  const role = (session.role || actorUser?.role || "owner") as AdminRole;
  if (!canManageUsers(role)) {
    redirect("/admin");
  }

  const items = (await listAdminUsers()).map(toPublicUser);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--navy-mid)] uppercase">
          Team
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
          使用者管理
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--muted-ink)]">
          建立與維護後台帳號，支援擁有者、管理員與編輯者三種角色，讓團隊可同時登入協作。
        </p>
      </div>

      <AdminUserManager
        initialItems={items}
        actor={{
          id: session.id || actorUser?.id,
          username: session.u,
          role,
        }}
      />
    </div>
  );
}
