import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const configured = isAdminAuthConfigured();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(42,212,232,0.18),transparent_50%),linear-gradient(165deg,#04182f_0%,#062445_55%,#0a3a66_100%)]"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[var(--shadow)] backdrop-blur-sm">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-cyan uppercase">
          Northgo
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold">Admin sign in</h1>
        <p className="mt-3 text-sm text-white/70">
          Manage site content, CMS access, and enquiry inbox.
        </p>
        <AdminLoginForm configured={configured} />
      </div>
    </div>
  );
}
