import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const configured = isAdminAuthConfigured();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <Image
        src="/brand/freight-logistics-hero.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(42,212,232,0.22),transparent_50%),linear-gradient(165deg,rgba(4,24,47,0.88)_0%,rgba(6,36,69,0.84)_55%,rgba(10,58,102,0.78)_100%)]"
      />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[var(--shadow)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden min-h-[420px] lg:block">
          <Image
            src="/brand/globe-marble.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="520px"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,24,47,0.25)_0%,rgba(4,24,47,0.78)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-cyan uppercase">
              Northgo
            </p>
            <p className="mt-3 max-w-sm font-display text-2xl font-bold text-white">
              全球物流營運，後台多人協作
            </p>
            <p className="mt-2 text-sm text-white/70">
              每位管理員可獨立登入，共同處理詢問、內容與帳號權限。
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-cyan uppercase lg:hidden">
            Northgo
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">
            後台登入
          </h1>
          <p className="mt-3 text-sm text-white/70">
            使用你的後台帳號登入，管理網站內容、CMS 與客戶詢問。
          </p>
          <AdminLoginForm configured={configured} />
        </div>
      </div>
    </div>
  );
}
