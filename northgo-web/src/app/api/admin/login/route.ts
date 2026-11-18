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
          "Admin auth is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.",
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
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = createAdminSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
  return response;
}
