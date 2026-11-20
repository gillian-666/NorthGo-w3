import Link from "next/link";

const media = [
  { file: "logo-teal-blue.png", label: "標誌（藍）" },
  { file: "logo-teal-white.png", label: "標誌（白）" },
  { file: "logo-teal-blue.svg", label: "標誌向量（藍）" },
  { file: "logo-teal-white.svg", label: "標誌向量（白）" },
  { file: "favicon.png", label: "網站圖示" },
  { file: "webclip.jpg", label: "分享縮圖" },
  { file: "globe-light-ocean-v2.jpg", label: "海洋地球" },
  { file: "globe-light-ocean.jpg", label: "淺色地球" },
  { file: "globe-marble.jpg", label: "大理石地球" },
  { file: "globe-night.jpg", label: "夜色地球" },
  { file: "globe-sphere.png", label: "地球球體" },
  { file: "freight-logistics-hero.jpg", label: "貨運主視覺" },
];

export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--navy-mid)] uppercase">
            Media
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-[color:var(--navy)] sm:text-3xl">
            媒體
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-ink)]">
            網站正在使用的標誌與主視覺。文案與圖片結構可在 CMS Studio 維護。
          </p>
        </div>
        <Link
          href="/studio"
          className="rounded-full bg-cyan px-5 py-2.5 text-sm font-bold text-[color:var(--navy-deep)] transition hover:brightness-110"
        >
          開啟 Studio
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => {
          const src = `/brand/${item.file}`;
          const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(item.file);
          return (
            <li
              key={item.file}
              className="overflow-hidden rounded-2xl border border-[color:var(--navy)]/8 bg-white shadow-[0_10px_30px_rgba(6,36,69,0.05)]"
            >
              <div className="flex h-40 items-center justify-center bg-[color:var(--surface-soft)]">
                {isImage ? (
                  // Brand files are local static assets.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={item.label}
                    className="max-h-36 max-w-[80%] object-contain"
                  />
                ) : (
                  <span className="text-sm text-[color:var(--muted-ink)]">
                    {item.file}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[color:var(--navy)]">
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-[color:var(--muted-ink)]">
                    {item.file}
                  </p>
                </div>
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full border border-[color:var(--navy)]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--navy)]"
                >
                  開啟
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
