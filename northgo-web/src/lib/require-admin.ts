import { NextResponse } from "next/server";
import { getAdminSession, type AdminSession } from "@/lib/admin-auth";
import {
  canManageUsers,
  ensureBootstrapOwner,
  getAdminUserByUsername,
  type AdminRole,
} from "@/lib/admin-users";

async function resolveSessionRole(session: AdminSession): Promise<AdminRole> {
  if (session.role) return session.role;
  await ensureBootstrapOwner();
  const user = await getAdminUserByUsername(session.u);
  if (user?.role) return user.role;
  // Legacy single-admin cookies (pre multi-user) keep full access.
  return "owner";
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null as AdminSession | null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const role = await resolveSessionRole(session);
  return {
    session: { ...session, role, id: session.id },
    error: null,
  };
}

export async function requireUserManager() {
  const result = await requireAdmin();
  if (result.error) return result;

  const role = (result.session?.role || "editor") as AdminRole;
  if (!canManageUsers(role)) {
    return {
      session: result.session,
      error: NextResponse.json(
        { error: "Forbidden: user management requires owner or admin" },
        { status: 403 },
      ),
    };
  }

  return result;
}
