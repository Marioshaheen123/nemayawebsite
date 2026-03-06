import type { Metadata } from "next";
import { Poppins, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { LayoutShell } from "@/components/LayoutShell";
import AccentColorInjector from "@/components/AccentColorInjector";
import JsonLd from "@/components/JsonLd";
import { getContentBlocks } from "@/lib/content";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-kufi-arabic",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://namaya.com";

export async function generateMetadata(): Promise<Metadata> {
  const blocks = await getContentBlocks(["seo.global"]);
  const seo = blocks["seo.global"] ?? {};

  return {
    metadataBase: new URL(SITE_URL),
    icons: {
      icon: "/images/small logo.png",
      apple: "/images/small logo.png",
    },
    title: {
      default: seo.defaultTitleAr || "نمايا - استثمر الآن بذكاء",
      template: `%s | ${seo.siteNameAr || "نمايا"}`,
    },
    description:
      seo.defaultDescriptionAr ||
      "كن ذكيًا واستثمر في أصولك بأمان. نمايا هي منصتك السعودية الآمنة للتداول في الأسواق المحلية والعالمية.",
    openGraph: {
      type: "website",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      siteName: seo.siteNameAr || "نمايا",
      images: [
        {
          url: seo.defaultOgImageUrl || "/images/og-default.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: SITE_URL,
      languages: { ar: SITE_URL, en: SITE_URL, "x-default": SITE_URL },
    },
    verification: {
      google: seo.googleVerification || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blocks = await getContentBlocks(["settings.website"]);
  const siteSettings = blocks["settings.website"] ?? {};

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${poppins.variable} ${notoKufiArabic.variable} font-[family-name:var(--font-poppins)] antialiased`}>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        <SiteSettingsProvider initialSettings={siteSettings}>
          <AccentColorInjector />
          <LanguageProvider>
            <UserAuthProvider>
              <LayoutShell>{children}</LayoutShell>
            </UserAuthProvider>
          </LanguageProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
