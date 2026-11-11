import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Outfit, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { routing, localeHtmlLang, type Locale } from "@/i18n/routing";
import "../globals.css";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const htmlLang = localeHtmlLang[locale as Locale];

  return (
    <html lang={htmlLang} className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="skip-link">
            {(messages as { nav?: { skip?: string } }).nav?.skip ??
              "Skip to content"}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <OrganizationJsonLd />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
