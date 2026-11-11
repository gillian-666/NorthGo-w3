import { getTranslations, setRequestLocale } from "next-intl/server";
import { OfficesMap } from "@/components/OfficesMap";
import { offices } from "@/content/offices";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "locations" });
  return pageMetadata({
    locale: locale as Locale,
    title: `${t("title")} | Northgo`,
    description: t("lead"),
    path: "/locations",
  });
}

export default async function LocationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("locations");

  return (
    <div className="bg-[color:var(--navy)] text-white">
      <div className="mx-auto w-[min(1200px,calc(100%-2rem))] py-14">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">{t("lead")}</p>
        <div className="mt-10">
          <OfficesMap offices={offices} />
        </div>
      </div>
    </div>
  );
}
