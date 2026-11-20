import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserManager } from "@/lib/require-admin";
import {
  adminRoles,
  adminUserStatuses,
  avatarKeys,
  canMutateTarget,
  countAdminUsersByRole,
  deleteAdminUser,
  getAdminUser,
  toPublicUser,
  updateAdminUser,
  type AdminRole,
} from "@/lib/admin-users";

type Props = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  displayName: z.string().min(1).max(120).optional(),
  email: z.string().email().max(160).optional().or(z.literal("")),
  role: z.enum(adminRoles).optional(),
  status: z.enum(adminUserStatuses).optional(),
  password: z.string().min(8).max(200).optional().or(z.literal("")),
  avatarKey: z.enum(avatarKeys).optional(),
});

export async function GET(_request: Request, { params }: Props) {
  const { error } = await requireUserManager();
  if (error) return error;

  const { id } = await params;
  const item = await getAdminUser(id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item: toPublicUser(item) });
}

export async function PATCH(request: Request, { params }: Props) {
  const { session, error } = await requireUserManager();
  if (error) return error;

  const { id } = await params;
  const current = await getAdminUser(id);
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const actorRole = (session?.role || "editor") as AdminRole;
  if (!canMutateTarget(actorRole, current)) {
    return NextResponse.json(
      { error: "無權限修改此帳號" },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  if (parsed.data.role === "owner" && actorRole !== "owner") {
    return NextResponse.json(
      { error: "Only owners can assign the owner role" },
      { status: 403 },
    );
  }

  if (
    current.role === "owner" &&
    parsed.data.role &&
    parsed.data.role !== "owner"
  ) {
    const owners = await countAdminUsersByRole("owner");
    if (owners <= 1) {
      return NextResponse.json(
        { error: "至少需保留一位擁有者" },
        { status: 400 },
      );
    }
  }

  if (
    current.role === "owner" &&
    parsed.data.status === "disabled"
  ) {
    const owners = await countAdminUsersByRole("owner");
    if (owners <= 1) {
      return NextResponse.json(
        { error: "無法停用最後一位擁有者" },
        { status: 400 },
      );
    }
  }

  const item = await updateAdminUser(id, {
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    role: parsed.data.role,
    status: parsed.data.status,
    avatarKey: parsed.data.avatarKey,
    password: parsed.data.password || undefined,
  });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item: toPublicUser(item) });
}

export async function DELETE(_request: Request, { params }: Props) {
  const { session, error } = await requireUserManager();
  if (error) return error;

  const { id } = await params;
  if (session?.id && session.id === id) {
    return NextResponse.json({ error: "無法刪除目前登入的帳號" }, { status: 400 });
  }

  const current = await getAdminUser(id);
  if (!current) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const actorRole = (session?.role || "editor") as AdminRole;
  if (!canMutateTarget(actorRole, current)) {
    return NextResponse.json(
      { error: "無權限刪除此帳號" },
      { status: 403 },
    );
  }

  try {
    const ok = await deleteAdminUser(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = err instanceof Error ? err.message : "DELETE_FAILED";
    if (code === "LAST_OWNER") {
      return NextResponse.json(
        { error: "無法刪除最後一位擁有者" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 });
  }
}
