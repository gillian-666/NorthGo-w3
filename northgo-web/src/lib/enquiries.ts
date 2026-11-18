import type { D1Database } from "@cloudflare/workers-types";
import { getD1 } from "@/lib/cloudflare";

export const enquiryStatuses = [
  "new",
  "in_progress",
  "replied",
  "closed",
] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  service?: string;
  tradeLane?: string;
  message: string;
  delivery: "email" | "log";
  status: EnquiryStatus;
  notes: string;
};

export type EnquiryUpdateInput = Partial<
  Pick<
    EnquiryRecord,
    | "name"
    | "company"
    | "email"
    | "phone"
    | "service"
    | "tradeLane"
    | "message"
    | "status"
    | "notes"
  >
>;

type Store = { items: EnquiryRecord[] };

type EnquiryRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  service: string | null;
  trade_lane: string | null;
  message: string;
  delivery: string;
  status: string;
  notes: string;
};

function normalize(
  item: Partial<EnquiryRecord> & Pick<EnquiryRecord, "id">,
): EnquiryRecord {
  const createdAt = item.createdAt || new Date().toISOString();
  return {
    id: item.id,
    createdAt,
    updatedAt: item.updatedAt || createdAt,
    name: item.name || "",
    company: item.company || "",
    email: item.email || "",
    phone: item.phone || undefined,
    service: item.service || undefined,
    tradeLane: item.tradeLane || undefined,
    message: item.message || "",
    delivery: item.delivery === "email" ? "email" : "log",
    status: enquiryStatuses.includes(item.status as EnquiryStatus)
      ? (item.status as EnquiryStatus)
      : "new",
    notes: item.notes || "",
  };
}

function rowToRecord(row: EnquiryRow): EnquiryRecord {
  return normalize({
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone || undefined,
    service: row.service || undefined,
    tradeLane: row.trade_lane || undefined,
    message: row.message,
    delivery: row.delivery === "email" ? "email" : "log",
    status: row.status as EnquiryStatus,
    notes: row.notes || "",
  });
}

async function filePaths() {
  const path = await import("node:path");
  const dataDir = path.join(process.cwd(), "data");
  return {
    dataDir,
    dataFile: path.join(dataDir, "enquiries.json"),
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

async function listFromD1(db: D1Database, limit: number, status?: EnquiryStatus) {
  if (status) {
    const { results } = await db
      .prepare(
        `SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC LIMIT ?`,
      )
      .bind(status, limit)
      .all<EnquiryRow>();
    return (results || []).map(rowToRecord);
  }

  const { results } = await db
    .prepare(`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ?`)
    .bind(limit)
    .all<EnquiryRow>();
  return (results || []).map(rowToRecord);
}

async function getFromD1(db: D1Database, id: string) {
  const row = await db
    .prepare(`SELECT * FROM enquiries WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<EnquiryRow>();
  return row ? rowToRecord(row) : null;
}

async function insertD1(db: D1Database, record: EnquiryRecord) {
  await db
    .prepare(
      `INSERT INTO enquiries (
        id, created_at, updated_at, name, company, email, phone, service,
        trade_lane, message, delivery, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      record.id,
      record.createdAt,
      record.updatedAt,
      record.name,
      record.company,
      record.email,
      record.phone || null,
      record.service || null,
      record.tradeLane || null,
      record.message,
      record.delivery,
      record.status,
      record.notes,
    )
    .run();
  return record;
}

async function updateD1(db: D1Database, id: string, patch: EnquiryUpdateInput) {
  const current = await getFromD1(db, id);
  if (!current) return null;
  const next = normalize({
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
    delivery: current.delivery,
  });
  await db
    .prepare(
      `UPDATE enquiries SET
        updated_at = ?, name = ?, company = ?, email = ?, phone = ?, service = ?,
        trade_lane = ?, message = ?, status = ?, notes = ?
      WHERE id = ?`,
    )
    .bind(
      next.updatedAt,
      next.name,
      next.company,
      next.email,
      next.phone || null,
      next.service || null,
      next.tradeLane || null,
      next.message,
      next.status,
      next.notes,
      id,
    )
    .run();
  return next;
}

async function deleteFromD1(db: D1Database, id: string) {
  const result = await db
    .prepare(`DELETE FROM enquiries WHERE id = ?`)
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

async function countFromD1(db: D1Database, status?: EnquiryStatus) {
  if (status) {
    const row = await db
      .prepare(`SELECT COUNT(*) as total FROM enquiries WHERE status = ?`)
      .bind(status)
      .first<{ total: number }>();
    return Number(row?.total || 0);
  }
  const row = await db
    .prepare(`SELECT COUNT(*) as total FROM enquiries`)
    .first<{ total: number }>();
  return Number(row?.total || 0);
}

async function countByStatusFromD1(db: D1Database) {
  const counts: Record<EnquiryStatus, number> = {
    new: 0,
    in_progress: 0,
    replied: 0,
    closed: 0,
  };
  const { results } = await db
    .prepare(`SELECT status, COUNT(*) as total FROM enquiries GROUP BY status`)
    .all<{ status: string; total: number }>();
  for (const row of results || []) {
    if (enquiryStatuses.includes(row.status as EnquiryStatus)) {
      counts[row.status as EnquiryStatus] = Number(row.total || 0);
    }
  }
  return counts;
}

export async function listEnquiries(limit = 100, status?: EnquiryStatus) {
  const db = await getD1();
  if (db) return listFromD1(db, limit, status);

  const store = await readStore();
  const items = status
    ? store.items.filter((item) => item.status === status)
    : store.items;
  return items.slice(0, limit);
}

export async function getEnquiry(id: string) {
  const db = await getD1();
  if (db) return getFromD1(db, id);

  const store = await readStore();
  return store.items.find((item) => item.id === id) ?? null;
}

export async function addEnquiry(
  input: Omit<EnquiryRecord, "id" | "createdAt" | "updatedAt" | "status" | "notes"> &
    Partial<Pick<EnquiryRecord, "status" | "notes">>,
) {
  const now = new Date().toISOString();
  const record = normalize({
    id: `enq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    status: input.status || "new",
    notes: input.notes || "",
    ...input,
  });

  const db = await getD1();
  if (db) return insertD1(db, record);

  const store = await readStore();
  store.items.unshift(record);
  store.items = store.items.slice(0, 500);
  try {
    await writeStore(store);
  } catch (error) {
    console.warn("[enquiries] persist failed", error);
  }
  return record;
}

export async function updateEnquiry(id: string, patch: EnquiryUpdateInput) {
  const db = await getD1();
  if (db) return updateD1(db, id, patch);

  const store = await readStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = store.items[index];
  const next = normalize({
    ...current,
    ...patch,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
    delivery: current.delivery,
  });
  store.items[index] = next;
  await writeStore(store);
  return next;
}

export async function deleteEnquiry(id: string) {
  const db = await getD1();
  if (db) return deleteFromD1(db, id);

  const store = await readStore();
  const nextItems = store.items.filter((item) => item.id !== id);
  if (nextItems.length === store.items.length) return false;
  store.items = nextItems;
  await writeStore(store);
  return true;
}

export async function countEnquiries(status?: EnquiryStatus) {
  const db = await getD1();
  if (db) return countFromD1(db, status);

  const store = await readStore();
  if (!status) return store.items.length;
  return store.items.filter((item) => item.status === status).length;
}

export async function countEnquiriesByStatus() {
  const db = await getD1();
  if (db) return countByStatusFromD1(db);

  const store = await readStore();
  const counts: Record<EnquiryStatus, number> = {
    new: 0,
    in_progress: 0,
    replied: 0,
    closed: 0,
  };
  for (const item of store.items) {
    counts[item.status] += 1;
  }
  return counts;
}
