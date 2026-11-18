import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "northgo_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

type SessionPayload = {
  u: string;
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME?.trim() &&
      process.env.ADMIN_PASSWORD?.trim() &&
      getSecret(),
  );
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${body}.${sign(body)}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature || !getSecret()) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload?.u || typeof payload.exp !== "number") return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME?.trim() ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!expectedUser || !expectedPass || !getSecret()) return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

export function createAdminSessionToken(username: string) {
  return encodeSession({
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  });
}

export function readAdminSessionFromToken(token: string | undefined) {
  if (!token) return null;
  return decodeSession(token);
}

export async function getAdminSession() {
  const jar = await cookies();
  return readAdminSessionFromToken(jar.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
