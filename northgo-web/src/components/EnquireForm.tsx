"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { serviceSlugs } from "@/lib/site";

export function EnquireForm() {
  const t = useTranslations("contact");
  const ts = useTranslations("services");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-[color:var(--line)] bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan";

  return (
    <form
      id="enquiry"
      onSubmit={onSubmit}
      className="scroll-mt-28 space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/[0.04] p-6 shadow-[var(--shadow)]"
    >
      <h2 className="font-display text-2xl text-white">{t("formTitle")}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/80">
          {t("name")}
          <input name="name" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm text-white/80">
          {t("company")}
          <input name="company" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm text-white/80">
          {t("email")}
          <input
            name="email"
            type="email"
            required
            className={`mt-1.5 ${fieldClass}`}
          />
        </label>
        <label className="block text-sm text-white/80">
          {t("phone")}
          <input name="phone" className={`mt-1.5 ${fieldClass}`} />
        </label>
      </div>

      <label className="block text-sm text-white/80">
        {t("service")}
        <select name="service" className={`mt-1.5 ${fieldClass}`}>
          <option value="general">{t("serviceAny")}</option>
          {serviceSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {ts(slug)}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-white/80">
        {t("tradeLane")}
        <input name="tradeLane" className={`mt-1.5 ${fieldClass}`} />
      </label>

      <label className="block text-sm text-white/80">
        {t("message")}
        <textarea
          name="message"
          required
          rows={5}
          className={`mt-1.5 ${fieldClass}`}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-cyan px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110 disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      {status === "ok" ? (
        <p className="text-sm text-emerald-300" role="status">
          {t("success")}
        </p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-amber-300" role="alert">
          {t("error")}
        </p>
      ) : null}
    </form>
  );
}
