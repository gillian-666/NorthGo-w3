import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

type Store = { items: EnquiryRecord[] };

function normalize(item: Partial<EnquiryRecord> & Pick<EnquiryRecord, "id">): EnquiryRecord {
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

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
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
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function listEnquiries(limit = 100, status?: EnquiryStatus) {
  const store = await readStore();
  const items = status
    ? store.items.filter((item) => item.status === status)
    : store.items;
  return items.slice(0, limit);
}

export async function getEnquiry(id: string) {
  const store = await readStore();
  return store.items.find((item) => item.id === id) ?? null;
}

export async function addEnquiry(
  input: Omit<EnquiryRecord, "id" | "createdAt" | "updatedAt" | "status" | "notes"> &
    Partial<Pick<EnquiryRecord, "status" | "notes">>,
) {
  const store = await readStore();
  const now = new Date().toISOString();
  const record = normalize({
    id: `enq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    status: input.status || "new",
    notes: input.notes || "",
    ...input,
  });
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
  const store = await readStore();
  const nextItems = store.items.filter((item) => item.id !== id);
  if (nextItems.length === store.items.length) return false;
  store.items = nextItems;
  await writeStore(store);
  return true;
}

export async function countEnquiries(status?: EnquiryStatus) {
  const store = await readStore();
  if (!status) return store.items.length;
  return store.items.filter((item) => item.status === status).length;
}

export async function countEnquiriesByStatus() {
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
