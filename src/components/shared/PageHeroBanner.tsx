import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeroBanner({ title, subtitle, breadcrumbs }: PageHeroBannerProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  return (
    <section className="relative bg-[#001005] pt-[40px] md:pt-[50px] xl:pt-[55px]">
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
        className={`relative max-w-7xl mx-auto px-6 py-[20px] ${
          subtitle ? "md:py-[30px]" : "md:py-[25px]"
        }`}
      >
        <h1 className={`text-white text-[30px] md:text-[40px] xl:text-[48px] font-extrabold leading-[1.3]${subtitle ? " mb-[12px]" : ""}`}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#c5c5c5] text-[16px] md:text-[18px] leading-[1.5] max-w-[680px]">
            {subtitle}
          </p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mt-[12px] flex items-center gap-[8px] text-[13px] md:text-[14px]">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-[8px]">
                {i > 0 && <span className="text-[#c5c5c5] select-none">/</span>}
                {item.href ? (
                  <Link href={item.href} className="text-[#c5c5c5] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-accent font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
