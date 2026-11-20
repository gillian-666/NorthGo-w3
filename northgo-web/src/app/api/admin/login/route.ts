import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const schema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin auth is not configured. Set ADMIN_SESSION_SECRET (and bootstrap ADMIN_USERNAME / ADMIN_PASSWORD).",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const verified = await verifyAdminCredentials(username, password);
  if (!verified) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const token = createAdminSessionToken(verified.username, {
    id: verified.user?.id,
    role: verified.user?.role || "owner",
  });
  const response = NextResponse.json({
    ok: true,
    user: verified.user
      ? {
          id: verified.user.id,
          username: verified.user.username,
          displayName: verified.user.displayName,
          role: verified.user.role,
        }
      : { username: verified.username, role: "owner" },
  });
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return response;
}
