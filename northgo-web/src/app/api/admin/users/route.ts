import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserManager } from "@/lib/require-admin";
import {
  adminRoles,
  adminUserStatuses,
  avatarKeys,
  createAdminUser,
  ensureBootstrapOwner,
  listAdminUsers,
  toPublicUser,
} from "@/lib/admin-users";

const createSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-zA-Z0-9._-]+$/, "Invalid username"),
  displayName: z.string().min(1).max(120),
  email: z.string().email().max(160).optional().or(z.literal("")),
  role: z.enum(adminRoles).optional(),
  status: z.enum(adminUserStatuses).optional(),
  password: z.string().min(8).max(200),
  avatarKey: z.enum(avatarKeys).optional(),
});

export async function GET() {
  const { session, error } = await requireUserManager();
  if (error) return error;

  await ensureBootstrapOwner();
  const items = (await listAdminUsers()).map(toPublicUser);
  return NextResponse.json({
    items,
    actor: {
      username: session?.u,
      id: session?.id,
      role: session?.role,
    },
  });
}

export async function POST(request: Request) {
  const { session, error } = await requireUserManager();
  if (error) return error;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.role === "owner" && session?.role !== "owner") {
    return NextResponse.json(
      { error: "Only owners can create another owner" },
      { status: 403 },
    );
  }

  try {
    const item = await createAdminUser({
      username: data.username,
      displayName: data.displayName,
      email: data.email || "",
      role: data.role || "editor",
      status: data.status || "active",
      password: data.password,
      avatarKey: data.avatarKey || "navy",
    });
    return NextResponse.json({ item: toPublicUser(item) }, { status: 201 });
  } catch (err) {
    const code = err instanceof Error ? err.message : "CREATE_FAILED";
    if (code === "USERNAME_TAKEN") {
      return NextResponse.json({ error: "帳號名稱已被使用" }, { status: 409 });
    }
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }
}
