import type { Metadata } from "next";
import { Poppins, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import { LayoutShell } from "@/components/LayoutShell";

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

export const metadata: Metadata = {
  title: "Namaya - Invest Now in Intelligence",
  description:
    "Be smart and invest in your assets with peace of mind. Namaya is your secure Saudi platform for trading in the local and global markets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${notoKufiArabic.variable} font-[family-name:var(--font-poppins)] antialiased`}>
        <LanguageProvider>
          <UserAuthProvider>
            <LayoutShell>{children}</LayoutShell>
          </UserAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
