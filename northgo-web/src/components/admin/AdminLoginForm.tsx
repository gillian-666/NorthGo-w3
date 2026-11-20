"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;

    setPending(true);
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(data.username || ""),
          password: String(data.password || ""),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error || "登入失敗");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("網路錯誤，請再試一次。");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/75">帳號</span>
        <input
          name="username"
          autoComplete="username"
          required
          disabled={!configured || pending}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-white/75">密碼</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={!configured || pending}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan disabled:opacity-50"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      {!configured ? (
        <p className="rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          請先在 <code>.env.local</code> 設定{" "}
          <code>ADMIN_SESSION_SECRET</code>，以及初始{" "}
          <code>ADMIN_USERNAME</code> / <code>ADMIN_PASSWORD</code>。
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!configured || pending}
        className="w-full rounded-full bg-cyan px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "登入中…" : "登入"}
      </button>
    </form>
  );
}
