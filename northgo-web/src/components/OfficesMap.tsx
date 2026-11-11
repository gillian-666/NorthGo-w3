"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Office } from "@/content/offices";
import type { Locale } from "@/i18n/routing";

type Region = "all" | "taiwan" | "japan" | "sea" | "americas" | "apac";

type Props = {
  offices: Office[];
};

export function OfficesMap({ offices }: Props) {
  const t = useTranslations("locations");
  const locale = useLocale() as Locale;
  const [region, setRegion] = useState<Region>("all");
  const [selected, setSelected] = useState<string | null>(
    offices.find((o) => o.hq)?.id ?? offices[0]?.id ?? null,
  );

  const filtered = useMemo(
    () =>
      region === "all"
        ? offices
        : offices.filter((o) => o.regions.includes(region)),
    [offices, region],
  );

  const filters: Array<{ id: Region; label: string }> = [
    { id: "all", label: t("filterAll") },
    { id: "taiwan", label: t("filterTaiwan") },
    { id: "japan", label: t("filterJapan") },
    { id: "sea", label: t("filterSea") },
    { id: "americas", label: t("filterAmericas") },
    { id: "apac", label: t("filterApac") },
  ];

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled) return;

      const el = document.getElementById("offices-map");
      if (!el) return;

      map = L.map(el, { scrollWheelZoom: true, worldCopyJump: true }).setView(
        [20, 130],
        3,
      );

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        },
      ).addTo(map);

      const layer = L.layerGroup().addTo(map);
      const markers: Record<string, import("leaflet").Marker> = {};

      const sync = (list: Office[], activeId: string | null) => {
        layer.clearLayers();
        const bounds: import("leaflet").LatLngExpression[] = [];

        list.forEach((o) => {
          const icon = L.divIcon({
            className: "",
            html: `<span style="display:block;width:14px;height:14px;border-radius:999px;border:2px solid ${
              o.hq ? "#f4c95d" : "#2ad4e8"
            };background:${o.hq ? "#f4c95d" : "#2ad4e8"};box-shadow:0 0 0 4px rgba(42,212,232,0.2)"></span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const marker = L.marker([o.lat, o.lng], { icon }).addTo(layer);
          marker.bindPopup(
            `<strong>${o.names[locale] ?? o.names.en}</strong><div style="margin-top:0.35rem;color:#b7c9d8;font-size:0.9rem">${o.addresses[locale] ?? o.addresses.en}</div><div style="margin-top:0.45rem"><a href="tel:${o.tel}">${o.tel}</a><br/><a href="mailto:${o.email}">${o.email}</a></div>`,
          );
          marker.on("click", () => setSelected(o.id));
          markers[o.id] = marker;
          bounds.push([o.lat, o.lng]);
        });

        if (bounds.length > 1) {
          map?.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, {
            padding: [40, 40],
          });
        } else if (bounds.length === 1) {
          map?.setView(bounds[0] as import("leaflet").LatLngExpression, 8);
        }

        if (activeId && markers[activeId]) {
          markers[activeId].openPopup();
        }
      };

      (el as HTMLElement & { __sync?: typeof sync }).__sync = sync;
      sync(filtered, selected);

      return () => {
        map?.remove();
      };
    }

    const cleanupPromise = init();

    return () => {
      cancelled = true;
      void cleanupPromise.then((cleanup) => cleanup?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map bootstrap once; sync via effect below
  }, []);

  useEffect(() => {
    const el = document.getElementById("offices-map") as
      | (HTMLElement & {
          __sync?: (list: Office[], activeId: string | null) => void;
        })
      | null;
    el?.__sync?.(filtered, selected);
  }, [filtered, selected, locale]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Regions">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setRegion(f.id)}
              aria-pressed={region === f.id}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                region === f.id
                  ? "border-cyan bg-[color:var(--cyan-dim)] text-cyan"
                  : "border-white/15 text-white/75 hover:border-cyan/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="max-h-[520px] space-y-2 overflow-auto pr-1">
          {filtered.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => setSelected(o.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected === o.id
                    ? "border-cyan bg-white/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {o.names[locale] ?? o.names.en}
                  </span>
                  {o.hq ? (
                    <span className="rounded-full bg-[color:var(--warn)]/20 px-2 py-0.5 text-[11px] font-semibold text-[color:var(--warn)]">
                      {t("hq")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-white/65">
                  {o.addresses[locale] ?? o.addresses.en}
                </p>
                <p className="mt-2 text-sm text-cyan">
                  {t("tel")} {o.tel}
                </p>
                <a
                  href={`mailto:${o.email}`}
                  className="mt-1 inline-block text-sm text-cyan hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {o.email}
                </a>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="offices-map"
        role="application"
        aria-label={t("mapLabel")}
        className="min-h-[420px] overflow-hidden rounded-2xl border border-white/10 lg:min-h-[640px]"
      />
    </div>
  );
}
