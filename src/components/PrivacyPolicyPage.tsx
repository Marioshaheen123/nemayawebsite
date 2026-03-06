"use client";

import { useLang } from "@/context/LanguageContext";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import type { Bilingual, LegalSection } from "@/data/types";

interface PrivacyPolicyPageProps {
  heroTitle: Bilingual<string>;
  sections: Bilingual<LegalSection[]>;
}

export default function PrivacyPolicyPage({ heroTitle, sections }: PrivacyPolicyPageProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const data = sections[lang];

  return (
    <>
      <PageHeroBanner
        title={heroTitle[lang]}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: "/" },
          { label: heroTitle[lang] },
        ]}
      />

      {/* Content */}
      <section className="bg-white py-[40px] md:py-[60px] xl:py-[64px]">
        <div
          dir={isAr ? "rtl" : undefined}
          className="max-w-[840px] mx-auto flex flex-col gap-[40px]"
        >
          {data.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-[#0e314c] text-[24px] md:text-[30px] font-bold leading-[1.3] mb-[16px]">
                {sIdx + 1}. {section.title}
              </h2>
              <div className="flex flex-col gap-[12px]">
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[#6084a4] text-[15px] md:text-[16px] leading-[1.6]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
