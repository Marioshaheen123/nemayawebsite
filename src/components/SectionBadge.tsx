"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

export default function SectionBadge({
  label,
  labelAr,
}: {
  label: string;
  labelAr?: string;
}) {
  const { smallLogo } = useSiteSettings();
  const { lang } = useLang();
  const displayLabel = lang === "ar" && labelAr ? labelAr : label;

  return (
    <div className="inline-flex items-center gap-2 bg-[#f9f9f9] border border-[#cacceb] rounded-full px-[23px] py-[5px]">
      <Image src={smallLogo} alt="" width={15} height={18} />
      <span className="text-[#0e314c] text-[14px] leading-[21px]">
        {displayLabel}
      </span>
    </div>
  );
}
