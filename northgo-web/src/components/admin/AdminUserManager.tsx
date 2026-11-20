"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminRole,
  AdminUserPublic,
  AdminUserStatus,
  AvatarKey,
} from "@/lib/admin-users";

const ROLE_LABELS: Record<AdminRole, string> = {
  owner: "擁有者",
  admin: "管理員",
  editor: "編輯者",
};

const STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: "啟用",
  disabled: "停用",
};

const ROLE_BADGE: Record<AdminRole, string> = {
  owner: "bg-cyan/20 text-[color:var(--navy)] ring-cyan/40",
  admin: "bg-sky-50 text-sky-800 ring-sky-200",
  editor: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_BADGE: Record<AdminUserStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  disabled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const AVATAR_STYLES: Record<AvatarKey, string> = {
  navy: "from-[#062445] to-[#0a3a66]",
  cyan: "from-[#0a3a66] to-[#2ad4e8]",
  ocean: "from-[#04182f] to-[#1a6b8a]",
  slate: "from-[#334155] to-[#64748b]",
  teal: "from-[#0f766e] to-[#2dd4bf]",
  sky: "from-[#0369a1] to-[#7dd3fc]",
};

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-[color:var(--navy)]/12 bg-white px-3 py-2 text-sm text-[color:var(--text-ink)] outline-none transition focus:border-[color:var(--navy-mid)]";

const btnSecondary =
  "rounded-full border border-[color:var(--navy)]/12 bg-white px-4 py-2 text-sm font-medium text-[color:var(--navy)]/80 transition hover:border-[color:var(--navy)]/30 hover:text-[color:var(--navy)] disabled:opacity-50";

const btnPrimary =
  "rounded-full border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm font-semibold text-[color:var(--navy)] transition hover:border-[color:var(--navy)]/35 disabled:opacity-50";

type Actor = {
  id?: string;
  username?: string;
  role?: AdminRole;
};

type Props = {
  initialItems: AdminUserPublic[];
  actor: Actor;
};

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export function AdminUserManager({ initialItems, actor }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "all">(
    "all",
  );
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((u) => u.status === "active").length,
      owners: items.filter((u) => u.role === "owner").length,
      admins: items.filter((u) => u.role === "admin").length,
      editors: items.filter((u) => u.role === "editor").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (roleFilter !== "all" && item.role !== roleFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return [item.username, item.displayName, item.email, item.role]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, roleFilter, statusFilter]);

  async function createUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(data.username || ""),
          displayName: String(data.displayName || ""),
          email: String(data.email || ""),
          role: String(data.role || "editor"),
          status: String(data.status || "active"),
          password: String(data.password || ""),
          avatarKey: String(data.avatarKey || "navy"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        item?: AdminUserPublic;
        error?: string;
      };
      if (!res.ok || !json.item) {
        throw new Error(json.error || "新增失敗");
      }
      setItems((prev) => [...prev, json.item!]);
      form.reset();
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "新增失敗");
    } finally {
      setCreating(false);
    }
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as {
        item?: AdminUserPublic;
        error?: string;
      };
      if (!res.ok || !json.item) {
        throw new Error(json.error || "更新失敗");
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? json.item! : item)),
      );
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(id: string) {
    if (!window.confirm("確定刪除此後台帳號？此操作無法復原。")) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--navy)] shadow-[0_18px_40px_rgba(6,36,69,0.18)]">
        <Image
          src="/brand/freight-logistics-hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-45"
          sizes="(max-width: 1180px) 100vw, 1180px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(4,24,47,0.92)_0%,rgba(6,36,69,0.78)_48%,rgba(10,58,102,0.55)_100%)]" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan uppercase">
              Team access
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              多人協作後台帳號
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
              新增管理員與編輯者、調整角色權限、停用離職帳號。每位成員可獨立登入，共同管理
              Northgo 後台。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: "成員", value: counts.total },
              { label: "啟用中", value: counts.active },
              { label: "管理員", value: counts.admins + counts.owners },
              { label: "編輯者", value: counts.editors },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-[11px] tracking-wide text-white/65 uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[color:var(--navy)]/8 bg-white p-4 shadow-[0_10px_30px_rgba(6,36,69,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              搜尋
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="姓名、帳號、Email"
                className={`${fieldClass} mt-1`}
              />
            </label>
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              角色
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as AdminRole | "all")
                }
                className={`${fieldClass} mt-1`}
              >
                <option value="all">全部</option>
                <option value="owner">擁有者</option>
                <option value="admin">管理員</option>
                <option value="editor">編輯者</option>
              </select>
            </label>
            <label className="block text-xs font-semibold tracking-wide text-[color:var(--muted-ink)] uppercase">
              狀態
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AdminUserStatus | "all")
                }
                className={`${fieldClass} mt-1`}
              >
                <option value="all">全部</option>
                <option value="active">啟用</option>
                <option value="disabled">停用</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className={btnPrimary}
          >
            {showCreate ? "關閉表單" : "新增帳號"}
          </button>
        </div>

        {showCreate ? (
          <form
            onSubmit={createUser}
            className="mt-5 grid gap-3 rounded-2xl border border-[color:var(--navy)]/8 bg-[linear-gradient(180deg,#f7fafc_0%,#ffffff_100%)] p-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              帳號
              <input
                name="username"
                required
                minLength={3}
                pattern="[a-zA-Z0-9._-]+"
                placeholder="e.g. ops.taipei"
                className={fieldClass}
              />
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              顯示名稱
              <input
                name="displayName"
                required
                placeholder="台北營運"
                className={fieldClass}
              />
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              Email
              <input
                name="email"
                type="email"
                placeholder="name@northgo.com"
                className={fieldClass}
              />
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              角色
              <select name="role" defaultValue="editor" className={fieldClass}>
                {actor.role === "owner" ? (
                  <option value="owner">擁有者</option>
                ) : null}
                <option value="admin">管理員</option>
                <option value="editor">編輯者</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              狀態
              <select name="status" defaultValue="active" className={fieldClass}>
                <option value="active">啟用</option>
                <option value="disabled">停用</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase">
              頭像色系
              <select name="avatarKey" defaultValue="navy" className={fieldClass}>
                <option value="navy">Navy</option>
                <option value="cyan">Cyan</option>
                <option value="ocean">Ocean</option>
                <option value="slate">Slate</option>
                <option value="teal">Teal</option>
                <option value="sky">Sky</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[color:var(--muted-ink)] uppercase sm:col-span-2 lg:col-span-2">
              初始密碼（至少 8 碼）
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={fieldClass}
              />
            </label>
            <div className="flex items-end">
              <button type="submit" disabled={creating} className={btnPrimary}>
                {creating ? "建立中…" : "建立帳號"}
              </button>
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </section>

      {filtered.length === 0 ? (
        <section className="relative overflow-hidden rounded-3xl border border-[color:var(--navy)]/8 bg-white shadow-[0_10px_30px_rgba(6,36,69,0.05)]">
          <div className="relative h-44 w-full">
            <Image
              src="/brand/globe-light-ocean-v2.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1180px) 100vw, 1180px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.92)_100%)]" />
          </div>
          <div className="relative -mt-10 px-6 pb-8 text-center">
            <p className="font-display text-xl font-semibold text-[color:var(--navy)]">
              尚無符合條件的帳號
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--muted-ink)]">
              調整篩選條件，或新增第一位協作夥伴一起管理後台。
            </p>
          </div>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => {
            const editing = editingId === user.id;
            const busy = busyId === user.id;
            const isSelf = actor.id === user.id || actor.username === user.username;

            return (
              <article
                key={user.id}
                className="overflow-hidden rounded-2xl border border-[color:var(--navy)]/8 bg-white shadow-[0_10px_30px_rgba(6,36,69,0.05)]"
              >
                <div className="relative h-24">
                  <Image
                    src={
                      user.role === "owner"
                        ? "/brand/globe-marble.jpg"
                        : user.role === "admin"
                          ? "/brand/globe-light-ocean.jpg"
                          : "/brand/globe-night.jpg"
                    }
                    alt=""
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,47,0.15)_0%,rgba(4,24,47,0.55)_100%)]" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg ring-2 ring-white/80 ${AVATAR_STYLES[user.avatarKey]}`}
                    >
                      {initials(user.displayName || user.username)}
                    </div>
                    <div>
                      <p className="font-display text-base font-semibold text-white">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-white/75">@{user.username}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${ROLE_BADGE[user.role]}`}
                    >
                      {ROLE_LABELS[user.role]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${STATUS_BADGE[user.status]}`}
                    >
                      {STATUS_LABELS[user.status]}
                    </span>
                    {isSelf ? (
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[color:var(--navy)] ring-1 ring-[color:var(--navy)]/20">
                        目前登入
                      </span>
                    ) : null}
                  </div>

                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-[color:var(--muted-ink)]">Email</dt>
                      <dd className="truncate text-right text-[color:var(--navy)]">
                        {user.email || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-[color:var(--muted-ink)]">最近登入</dt>
                      <dd className="text-right text-[color:var(--navy)]">
                        {formatDateTime(user.lastLoginAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-[color:var(--muted-ink)]">建立時間</dt>
                      <dd className="text-right text-[color:var(--navy)]">
                        {formatDateTime(user.createdAt)}
                      </dd>
                    </div>
                  </dl>

                  {editing ? (
                    <form
                      className="space-y-2 border-t border-[color:var(--navy)]/8 pt-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(
                          new FormData(e.currentTarget).entries(),
                        );
                        void patchUser(user.id, {
                          displayName: String(data.displayName || ""),
                          email: String(data.email || ""),
                          role: String(data.role || user.role),
                          status: String(data.status || user.status),
                          avatarKey: String(data.avatarKey || user.avatarKey),
                          password: String(data.password || ""),
                        });
                      }}
                    >
                      <input
                        name="displayName"
                        defaultValue={user.displayName}
                        required
                        className={fieldClass}
                      />
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        className={fieldClass}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="role"
                          defaultValue={user.role}
                          className={fieldClass}
                        >
                          {actor.role === "owner" || user.role === "owner" ? (
                            <option value="owner">擁有者</option>
                          ) : null}
                          <option value="admin">管理員</option>
                          <option value="editor">編輯者</option>
                        </select>
                        <select
                          name="status"
                          defaultValue={user.status}
                          className={fieldClass}
                        >
                          <option value="active">啟用</option>
                          <option value="disabled">停用</option>
                        </select>
                      </div>
                      <select
                        name="avatarKey"
                        defaultValue={user.avatarKey}
                        className={fieldClass}
                      >
                        <option value="navy">Navy</option>
                        <option value="cyan">Cyan</option>
                        <option value="ocean">Ocean</option>
                        <option value="slate">Slate</option>
                        <option value="teal">Teal</option>
                        <option value="sky">Sky</option>
                      </select>
                      <input
                        name="password"
                        type="password"
                        minLength={8}
                        placeholder="新密碼（留空則不變更）"
                        autoComplete="new-password"
                        className={fieldClass}
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={busy}
                          className={btnPrimary}
                        >
                          {busy ? "儲存中…" : "儲存"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className={btnSecondary}
                        >
                          取消
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap gap-2 border-t border-[color:var(--navy)]/8 pt-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setEditingId(user.id)}
                        className={btnSecondary}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void patchUser(user.id, {
                            status:
                              user.status === "active" ? "disabled" : "active",
                          })
                        }
                        className={btnSecondary}
                      >
                        {user.status === "active" ? "停用" : "啟用"}
                      </button>
                      <button
                        type="button"
                        disabled={busy || isSelf}
                        onClick={() => void removeUser(user.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 disabled:opacity-50"
                      >
                        刪除
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
