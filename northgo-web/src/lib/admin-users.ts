import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { getD1 } from "@/lib/cloudflare";

export const adminRoles = ["owner", "admin", "editor"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const adminUserStatuses = ["active", "disabled"] as const;
export type AdminUserStatus = (typeof adminUserStatuses)[number];

export const avatarKeys = [
  "navy",
  "cyan",
  "ocean",
  "slate",
  "teal",
  "sky",
] as const;
export type AvatarKey = (typeof avatarKeys)[number];

export type AdminUserRecord = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
  passwordHash: string;
  avatarKey: AvatarKey;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type AdminUserPublic = Omit<AdminUserRecord, "passwordHash">;

export type AdminUserCreateInput = {
  username: string;
  displayName: string;
  email?: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  password: string;
  avatarKey?: AvatarKey;
};

export type AdminUserUpdateInput = {
  displayName?: string;
  email?: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  password?: string;
  avatarKey?: AvatarKey;
};

type Store = { items: AdminUserRecord[] };

type AdminUserRow = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  role: string;
  status: string;
  password_hash: string;
  avatar_key: string;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

function isRole(value: unknown): value is AdminRole {
  return adminRoles.includes(value as AdminRole);
}

function isStatus(value: unknown): value is AdminUserStatus {
  return adminUserStatuses.includes(value as AdminUserStatus);
}

function isAvatar(value: unknown): value is AvatarKey {
  return avatarKeys.includes(value as AvatarKey);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "base64url");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function toPublicUser(user: AdminUserRecord): AdminUserPublic {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarKey: user.avatarKey,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  };
}

function normalize(
  item: Partial<AdminUserRecord> &
    Pick<AdminUserRecord, "id" | "username" | "passwordHash">,
): AdminUserRecord {
  const createdAt = item.createdAt || new Date().toISOString();
  return {
    id: item.id,
    username: item.username.trim().toLowerCase(),
    displayName: (item.displayName || item.username || "").trim() || item.username,
    email: (item.email || "").trim(),
    role: isRole(item.role) ? item.role : "editor",
    status: isStatus(item.status) ? item.status : "active",
    passwordHash: item.passwordHash,
    avatarKey: isAvatar(item.avatarKey) ? item.avatarKey : "navy",
    createdAt,
    updatedAt: item.updatedAt || createdAt,
    lastLoginAt: item.lastLoginAt || undefined,
  };
}

function rowToRecord(row: AdminUserRow): AdminUserRecord {
  return normalize({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    email: row.email || "",
    role: row.role as AdminRole,
    status: row.status as AdminUserStatus,
    passwordHash: row.password_hash,
    avatarKey: row.avatar_key as AvatarKey,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at || undefined,
  });
}

function newId() {
  return `adm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function filePaths() {
  const path = await import("node:path");
  const dataDir = path.join(process.cwd(), "data");
  return {
    dataDir,
    dataFile: path.join(dataDir, "admin-users.json"),
  };
}

async function readStore(): Promise<Store> {
  try {
    const { readFile } = await import("node:fs/promises");
    const { dataFile } = await filePaths();
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as Store;
    const items = Array.isArray(parsed.items)
      ? parsed.items.map((item) => normalize(item))
      : [];
    return { items };
  } catch {
    return { items: [] };
  }
}

async function writeStore(store: Store) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const { dataDir, dataFile } = await filePaths();
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function listFromD1(db: D1Database) {
  const { results } = await db
    .prepare(`SELECT * FROM admin_users ORDER BY created_at ASC`)
    .all<AdminUserRow>();
  return (results || []).map(rowToRecord);
}

async function getFromD1(db: D1Database, id: string) {
  const row = await db
    .prepare(`SELECT * FROM admin_users WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<AdminUserRow>();
  return row ? rowToRecord(row) : null;
}

async function getByUsernameFromD1(db: D1Database, username: string) {
  const row = await db
    .prepare(`SELECT * FROM admin_users WHERE username = ? LIMIT 1`)
    .bind(username.trim().toLowerCase())
    .first<AdminUserRow>();
  return row ? rowToRecord(row) : null;
}

async function insertD1(db: D1Database, record: AdminUserRecord) {
  await db
    .prepare(
      `INSERT INTO admin_users (
        id, username, display_name, email, role, status, password_hash,
        avatar_key, created_at, updated_at, last_login_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      record.id,
      record.username,
      record.displayName,
      record.email,
      record.role,
      record.status,
      record.passwordHash,
      record.avatarKey,
      record.createdAt,
      record.updatedAt,
      record.lastLoginAt || null,
    )
    .run();
  return record;
}

async function updateD1(db: D1Database, record: AdminUserRecord) {
  await db
    .prepare(
      `UPDATE admin_users SET
        display_name = ?, email = ?, role = ?, status = ?, password_hash = ?,
        avatar_key = ?, updated_at = ?, last_login_at = ?
      WHERE id = ?`,
    )
    .bind(
      record.displayName,
      record.email,
      record.role,
      record.status,
      record.passwordHash,
      record.avatarKey,
      record.updatedAt,
      record.lastLoginAt || null,
      record.id,
    )
    .run();
  return record;
}

async function deleteFromD1(db: D1Database, id: string) {
  const result = await db
    .prepare(`DELETE FROM admin_users WHERE id = ?`)
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function listAdminUsers() {
  const db = await getD1();
  if (db) return listFromD1(db);
  const store = await readStore();
  return store.items;
}

export async function getAdminUser(id: string) {
  const db = await getD1();
  if (db) return getFromD1(db, id);
  const store = await readStore();
  return store.items.find((item) => item.id === id) ?? null;
}

export async function getAdminUserByUsername(username: string) {
  const db = await getD1();
  if (db) return getByUsernameFromD1(db, username);
  const store = await readStore();
  const key = username.trim().toLowerCase();
  return store.items.find((item) => item.username === key) ?? null;
}

export async function countAdminUsersByRole(role?: AdminRole) {
  const users = await listAdminUsers();
  if (!role) return users.length;
  return users.filter((user) => user.role === role).length;
}

export async function ensureBootstrapOwner() {
  const existing = await listAdminUsers();
  if (existing.length > 0) return existing[0];

  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase() || "";
  const password = process.env.ADMIN_PASSWORD?.trim() || "";
  if (!username || !password) return null;

  return createAdminUser({
    username,
    displayName: "系統擁有者",
    email: "",
    role: "owner",
    status: "active",
    password,
    avatarKey: "cyan",
  });
}

export async function createAdminUser(input: AdminUserCreateInput) {
  const username = input.username.trim().toLowerCase();
  if (!username) throw new Error("USERNAME_REQUIRED");

  const existing = await getAdminUserByUsername(username);
  if (existing) throw new Error("USERNAME_TAKEN");

  const now = new Date().toISOString();
  const record = normalize({
    id: newId(),
    username,
    displayName: input.displayName || username,
    email: input.email || "",
    role: input.role || "editor",
    status: input.status || "active",
    passwordHash: hashPassword(input.password),
    avatarKey: input.avatarKey || "navy",
    createdAt: now,
    updatedAt: now,
  });

  const db = await getD1();
  if (db) return insertD1(db, record);

  const store = await readStore();
  store.items.push(record);
  await writeStore(store);
  return record;
}

export async function updateAdminUser(id: string, patch: AdminUserUpdateInput) {
  const current = await getAdminUser(id);
  if (!current) return null;

  const next = normalize({
    ...current,
    displayName: patch.displayName ?? current.displayName,
    email: patch.email ?? current.email,
    role: patch.role ?? current.role,
    status: patch.status ?? current.status,
    avatarKey: patch.avatarKey ?? current.avatarKey,
    passwordHash: patch.password
      ? hashPassword(patch.password)
      : current.passwordHash,
    updatedAt: new Date().toISOString(),
  });

  const db = await getD1();
  if (db) return updateD1(db, next);

  const store = await readStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.items[index] = next;
  await writeStore(store);
  return next;
}

export async function touchAdminUserLogin(id: string) {
  const current = await getAdminUser(id);
  if (!current) return null;
  const next = normalize({
    ...current,
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const db = await getD1();
  if (db) return updateD1(db, next);

  const store = await readStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store.items[index] = next;
  await writeStore(store);
  return next;
}

export async function deleteAdminUser(id: string) {
  const current = await getAdminUser(id);
  if (!current) return false;

  if (current.role === "owner") {
    const owners = await countAdminUsersByRole("owner");
    if (owners <= 1) throw new Error("LAST_OWNER");
  }

  const db = await getD1();
  if (db) return deleteFromD1(db, id);

  const store = await readStore();
  const nextItems = store.items.filter((item) => item.id !== id);
  if (nextItems.length === store.items.length) return false;
  store.items = nextItems;
  await writeStore(store);
  return true;
}

export function canManageUsers(role: AdminRole | undefined) {
  return role === "owner" || role === "admin";
}

export function canMutateTarget(
  actorRole: AdminRole,
  target: Pick<AdminUserRecord, "role">,
) {
  if (actorRole === "owner") return true;
  if (actorRole === "admin") return target.role !== "owner";
  return false;
}
