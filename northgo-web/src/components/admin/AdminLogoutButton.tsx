"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onLogout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={pending}
      className="rounded-full border border-[color:var(--navy)]/15 bg-white px-4 py-2 text-sm font-medium text-[color:var(--navy)]/80 transition hover:border-[color:var(--navy)]/35 hover:text-[color:var(--navy)] disabled:opacity-60"
    >
      {pending ? "登出中…" : "登出"}
    </button>
  );
}
