"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EnquiryRecord, EnquiryStatus } from "@/lib/enquiries";
import { serviceSlugs } from "@/lib/site";

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "新進",
  in_progress: "處理中",
  replied: "已回覆",
  closed: "已結案",
};

const STATUS_BADGE: Record<EnquiryStatus, string> = {
  new: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  in_progress: "bg-amber-50 text-amber-800 ring-amber-200",
  replied: "bg-sky-50 text-sky-800 ring-sky-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_OPTIONS: Array<EnquiryStatus | "all"> = [
  "all",
  "new",
  "in_progress",
  "replied",
  "closed",
];

const PAGE_SIZES = [10, 20, 50] as const;

const SERVICE_OPTIONS = [
  { value: "general", label: "一般諮詢" },
  ...serviceSlugs.map((slug) => ({
    value: slug,
    label: slug,
  })),
];

type SortKey = "createdAt" | "name" | "company" | "email" | "status";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[color:var(--navy)]/12 bg-white px-3 py-2 text-sm text-[color:var(--text-ink)] outline-none transition focus:border-[color:var(--navy-mid)]";

const btnSecondary =
  "rounded-full border border-[color:var(--navy)]/12 bg-white px-4 py-2 text-sm font-medium text-[color:var(--navy)]/80 transition hover:border-[color:var(--navy)]/30 hover:text-[color:var(--navy)] disabled:opacity-50";

const btnPrimary =
  "rounded-full bg-[color:var(--navy-mid)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--navy)] disabled:opacity-50";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
}

function buildCounts(items: EnquiryRecord[]) {
  const counts: Record<EnquiryStatus, number> = {
    new: 0,
    in_progress: 0,
    replied: 0,
    closed: 0,
  };
  for (const item of items) counts[item.status] += 1;
  return counts;
}

function compareValues(a: EnquiryRecord, b: EnquiryRecord, key: SortKey) {
  const left = String(a[key] ?? "");
  const right = String(b[key] ?? "");
  if (key === "createdAt") {
    return new Date(left).getTime() - new Date(right).getTime();
  }
  return left.localeCompare(right, "zh-Hant", { sensitivity: "base" });
}

type Props = {
  initialItems: EnquiryRecord[];
  counts: Record<EnquiryStatus, number>;
};

export function AdminEnquiryManager({ initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    setPage(1);
  }, [filter, query, pageSize]);

  const counts = useMemo(() => buildCounts(items), [items]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!q) return true;
      return [
        item.name,
        item.company,
        item.email,
        item.phone,
        item.service,
        item.tradeLane,
        item.message,
        item.notes,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [items, filter, query]);

  const sortedItems = useMemo(() => {
    const next = [...filteredItems];
    next.sort((a, b) => {
      const result = compareValues(a, b, sortKey);
      return sortDir === "asc" ? result : -result;
    });
    return next;
  }, [filteredItems, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sortedItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "createdAt" ? "desc" : "asc");
  }

  function sortMark(key: SortKey) {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  }

  async function reload() {
    setReloading(true);
    setError(null);
    try {
      router.refresh();
    } finally {
      setTimeout(() => setReloading(false), 400);
    }
  }

  async function createEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.name || ""),
          company: String(data.company || ""),
          email: String(data.email || ""),
          phone: String(data.phone || ""),
          service: String(data.service || ""),
          tradeLane: String(data.tradeLane || ""),
          message: String(data.message || ""),
          notes: String(data.notes || ""),
          status: String(data.status || "new"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        item?: EnquiryRecord;
        error?: string;
      };
      if (!res.ok || !json.item) {
        throw new Error(json.error || "新增失敗");
      }
      setItems((prev) => [json.item!, ...prev]);
      form.reset();
      setShowCreate(false);
      setFilter("all");
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "新增失敗");
    } finally {
      setCreating(false);
    }
  }

  async function patchEnquiry(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as {
        item?: EnquiryRecord;
        error?: string;
      };
      if (!res.ok || !json.item) {
        throw new Error(json.error || "更新失敗");
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? json.item! : item)),
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setBusyId(null);
    }
  }

  async function removeEnquiry(id: string) {
    if (!window.confirm("確定刪除此筆客戶詢問？此操作無法復原。")) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error || "刪除失敗");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((key) => {
          const active = filter === key;
          const label =
            key === "all"
              ? `全部 ${items.length}`
              : `${STATUS_LABELS[key]} ${counts[key]}`;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                active
                  ? "bg-[color:var(--navy)] text-white"
                  : "bg-white text-[color:var(--muted-ink)] ring-1 ring-[color:var(--navy)]/10 hover:text-[color:var(--navy)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <section className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-4 shadow-[0_10px_30px_rgba(6,36,69,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              搜尋
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="姓名、公司、Email"
                className={`${fieldClass} mt-1`}
              />
            </label>
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              狀態
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as EnquiryStatus | "all")
                }
                className={`${fieldClass} mt-1`}
              >
                <option value="all">全部</option>
                {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              每頁
              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(Number(e.target.value) as (typeof PAGE_SIZES)[number])
                }
                className={`${fieldClass} mt-1`}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reload}
              disabled={reloading}
              className={btnSecondary}
            >
              {reloading ? "載入中…" : "重新載入"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate((v) => !v)}
              className={btnPrimary}
            >
              {showCreate ? "關閉新增" : "新增詢問"}
            </button>
          </div>
        </div>

        {showCreate ? (
          <form
            onSubmit={createEnquiry}
            className="mt-5 grid gap-3 rounded-xl border border-[color:var(--navy-mid)]/15 bg-[color:var(--surface-soft)] p-4 sm:grid-cols-2"
          >
            <h2 className="font-display text-lg font-semibold text-[color:var(--navy)] sm:col-span-2">
              新增客戶詢問
            </h2>
            <EnquiryFields />
            <label className="text-sm text-[color:var(--muted-ink)]">
              狀態
              <select name="status" defaultValue="new" className={fieldClass}>
                {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button type="submit" disabled={creating} className={btnPrimary}>
                {creating ? "新增中…" : "建立紀錄"}
              </button>
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--navy)]/8">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[color:var(--surface-soft)] text-xs tracking-wide text-[color:var(--muted-ink)] uppercase">
              <tr>
                {(
                  [
                    ["createdAt", "時間"],
                    ["name", "姓名"],
                    ["company", "公司"],
                    ["email", "電子郵件"],
                    ["status", "狀態"],
                  ] as Array<[SortKey, string]>
                ).map(([key, label]) => (
                  <th key={key} className="px-4 py-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort(key)}
                      className="inline-flex items-center gap-1.5 transition hover:text-[color:var(--navy)]"
                    >
                      {label}
                      <span className="text-[10px] opacity-70">{sortMark(key)}</span>
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-[color:var(--muted-ink)]"
                  >
                    尚無符合條件的客戶詢問。可從前台聯絡表單送出，或點「新增詢問」。
                  </td>
                </tr>
              ) : (
                pageItems.map((item) => {
                  const editing = editingId === item.id;
                  const busy = busyId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="border-t border-[color:var(--navy)]/6 align-top transition hover:bg-[color:var(--surface-soft)]/70"
                    >
                      <td className="whitespace-nowrap px-4 py-3.5 text-[color:var(--muted-ink)]">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[color:var(--navy)]">
                        {item.name}
                      </td>
                      <td className="px-4 py-3.5 text-[color:var(--text-ink)]/85">
                        {item.company}
                      </td>
                      <td className="px-4 py-3.5">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-[color:var(--navy-mid)] hover:underline"
                        >
                          {item.email}
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE[item.status]}`}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setEditingId(editing ? null : item.id)
                            }
                            className={btnSecondary}
                          >
                            {editing ? "收合" : "編輯"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => removeEnquiry(item.id)}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {editingId
          ? (() => {
              const item = items.find((row) => row.id === editingId);
              if (!item) return null;
              const busy = busyId === item.id;
              return (
                <form
                  className="mt-4 grid gap-3 rounded-xl border border-[color:var(--navy)]/10 bg-[color:var(--surface-soft)] p-4 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(
                      new FormData(e.currentTarget).entries(),
                    );
                    patchEnquiry(item.id, {
                      name: String(data.name || ""),
                      company: String(data.company || ""),
                      email: String(data.email || ""),
                      phone: String(data.phone || ""),
                      service: String(data.service || ""),
                      tradeLane: String(data.tradeLane || ""),
                      message: String(data.message || ""),
                      notes: String(data.notes || ""),
                      status: String(data.status || item.status),
                    });
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
                    <h2 className="font-display text-lg font-semibold text-[color:var(--navy)]">
                      編輯 · {item.name}
                    </h2>
                    <p className="text-xs text-[color:var(--muted-ink)]">
                      更新於 {formatDateTime(item.updatedAt)}
                    </p>
                  </div>
                  <EnquiryFields item={item} />
                  <label className="text-sm text-[color:var(--muted-ink)]">
                    狀態
                    <select
                      name="status"
                      defaultValue={item.status}
                      className={fieldClass}
                    >
                      {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map(
                        (status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <div className="flex flex-wrap items-end gap-2">
                    <button type="submit" disabled={busy} className={btnPrimary}>
                      {busy ? "儲存中…" : "儲存變更"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setEditingId(null)}
                      className={btnSecondary}
                    >
                      取消
                    </button>
                  </div>
                </form>
              );
            })()
          : null}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--muted-ink)]">
          <p>
            共 {sortedItems.length} 筆．第 {currentPage} / {totalPages} 頁
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一頁
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              下一頁
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function EnquiryFields({ item }: { item?: EnquiryRecord }) {
  return (
    <>
      <label className="text-sm text-[color:var(--muted-ink)]">
        姓名
        <input
          name="name"
          defaultValue={item?.name || ""}
          required
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)]">
        公司
        <input
          name="company"
          defaultValue={item?.company || ""}
          required
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)]">
        Email
        <input
          name="email"
          type="email"
          defaultValue={item?.email || ""}
          required
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)]">
        電話
        <input
          name="phone"
          defaultValue={item?.phone || ""}
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)]">
        服務
        <select
          name="service"
          defaultValue={item?.service || "general"}
          className={fieldClass}
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-[color:var(--muted-ink)]">
        航線 / 貿易線
        <input
          name="tradeLane"
          defaultValue={item?.tradeLane || ""}
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)] sm:col-span-2">
        詢問內容
        <textarea
          name="message"
          rows={4}
          defaultValue={item?.message || ""}
          required
          className={fieldClass}
        />
      </label>
      <label className="text-sm text-[color:var(--muted-ink)] sm:col-span-2">
        內部備註
        <textarea
          name="notes"
          rows={item ? 3 : 2}
          defaultValue={item?.notes || ""}
          className={fieldClass}
          placeholder="跟進進度、負責人、回覆摘要…"
        />
      </label>
    </>
  );
}
