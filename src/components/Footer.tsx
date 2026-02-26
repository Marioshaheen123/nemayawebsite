"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

interface FooterProps {
  footerQuickLinks: any;
  footerSupportLinks: any;
  footerSocialIcons: any;
  footerLabels: any;
  footerContactInfo: any;
}

export default function Footer({ footerQuickLinks, footerSupportLinks, footerSocialIcons, footerLabels, footerContactInfo }: FooterProps) {
  const { lang } = useLang();
  const t = footerLabels[lang];
  const qLinks = footerQuickLinks[lang];
  const sLinks = footerSupportLinks[lang];

  return (
    <footer className="relative min-h-[475px]">
      {/* Background */}
      <Image
        src="/images/footer-bg.jpg"
        alt=""
        fill
        className="object-cover object-top"
      />

      <div className="relative z-10 max-w-[1440px] 2xl:max-w-[1640px] mx-auto px-4 md:px-[52px] xl:px-[80px] 2xl:px-[120px]">
        {/* Main footer content */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pt-[50px] md:pt-[80px] pb-[50px] md:pb-[80px]"
        >
          {/* Brand */}
          <div>
            <a
              href="#"
              className="flex items-center gap-[7px] mb-[19px]"
            >
              <Image
                src="/images/nemayalogo.png"
                alt="Namaya for Investment"
                width={225}
                height={52}
                className="brightness-0 invert"
              />
            </a>
            <p className="text-[#c5c5c5] text-[16px] xl:text-[18px] leading-[1.4] mb-[25px]">
              {t.brandDesc}
            </p>
            <div className="flex justify-between md:justify-start gap-[10px] pt-[6px]">
              {footerSocialIcons.map((icon: any, i: number) => (
                <a
                  key={i}
                  href={icon.href}
                  className="w-[52px] h-[52px] md:w-[35px] md:h-[35px] rounded-full bg-[rgba(18,149,61,0.4)] flex items-center justify-center hover:bg-[rgba(18,149,61,0.7)] transition-colors"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={16}
                    height={16}
                    className="w-[24px] h-[24px] md:w-[16px] md:h-[16px]"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-[24px] xl:text-[28px] leading-[28.8px] mb-[30px]">
              {t.quickLinks}
            </h3>
            <ul className="flex flex-col gap-[10px]">
              {qLinks.map((link: any) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#c5c5c5] text-[16px] xl:text-[18px] leading-[1.4] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-[24px] xl:text-[28px] leading-[28.8px] mb-[30px]">
              {t.support}
            </h3>
            <ul className="flex flex-col gap-[10px]">
              {sLinks.map((link: any) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#c5c5c5] text-[16px] xl:text-[18px] leading-[1.4] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-[24px] xl:text-[28px] leading-[28.8px] mb-[30px]">
              {t.contact}
            </h3>
            <div className="flex flex-col gap-[15px] mb-[20px]">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/phone-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                <a
                  href={`tel:${footerContactInfo.phone}`}
                  className="text-[#c5c5c5] text-[16px] leading-[24px] hover:text-white transition-colors"
                  dir="ltr"
                >
                  {footerContactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/email-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                <a
                  href={`mailto:${footerContactInfo.email}`}
                  className="text-[#c5c5c5] text-[16px] leading-[24px] underline hover:text-white transition-colors"
                  dir="ltr"
                >
                  {footerContactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(74,111,138,0.3)] py-[25px]">
          <p className="text-white text-[14px] leading-[25.2px] text-center">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
