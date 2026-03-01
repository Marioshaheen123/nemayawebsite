import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

interface PageHeroBannerProps {
  title: string;
  subtitle?: string;
}

export default function PageHeroBanner({ title, subtitle }: PageHeroBannerProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  return (
    <section className="relative bg-[#001005] pt-[69px] md:pt-[100px] xl:pt-[110px]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/blog-hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-80"
        />
      </div>
      <div
        dir={isAr ? "rtl" : undefined}
        className={`relative max-w-7xl mx-auto px-6 py-[30px] ${
          subtitle ? "md:py-[50px]" : "md:py-[40px]"
        }`}
      >
        <h1 className={`text-white text-[40px] md:text-[55px] xl:text-[65px] font-extrabold leading-[1.3]${subtitle ? " mb-[16px]" : ""}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] max-w-[680px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
