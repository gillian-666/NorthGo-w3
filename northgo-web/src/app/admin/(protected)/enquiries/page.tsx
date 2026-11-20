import { AdminEnquiryManager } from "@/components/admin/AdminEnquiryManager";
import { countEnquiriesByStatus, listEnquiries } from "@/lib/enquiries";

export default async function AdminEnquiriesPage() {
  const [items, counts] = await Promise.all([
    listEnquiries(200),
    countEnquiriesByStatus(),
  ]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--navy-mid)] uppercase">
          Inbox
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
          客戶詢問
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--muted-ink)]">
          前台聯絡表單送出的資料會出現在此。可搜尋、篩選、排序、分頁，並編輯狀態與備註。
        </p>
      </div>

      <AdminEnquiryManager
        initialItems={items}
        counts={counts}
        notifyEmail={process.env.ENQUIRE_TO_EMAIL || ""}
      />
    </div>
  );
}
