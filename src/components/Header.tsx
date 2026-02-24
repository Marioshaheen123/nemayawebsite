"use client";

import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const navItems = {
  en: [
    { label: "Home", hasDropdown: false },
    { label: "Trading Tools Center", hasDropdown: true },
    { label: "About", hasDropdown: false },
    { label: "Trading Platforms", hasDropdown: true },
    { label: "Blog", hasDropdown: false },
  ],
  ar: [
    { label: "الصفحة الرئيسية", hasDropdown: false },
    { label: "مركز أدوات التداول", hasDropdown: true },
    { label: "عن نمايا", hasDropdown: false },
    { label: "منصات التداول", hasDropdown: true },
    { label: "مدونة", hasDropdown: false },
  ],
};

const cta = {
  en: { signup: "Sign up", login: "Log in" },
  ar: { signup: "سجل", login: "تسجيل الدخول" },
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggleLang } = useLang();
  const items = navItems[lang];
  const buttons = cta[lang];

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="bg-[#001005] w-full px-4 md:px-[50px] flex items-center h-[69px] md:h-[100px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-[7px] shrink-0">
          <Image src="/images/nemayalogo.png" alt="Namaya for Investment" width={225} height={52} className="brightness-0 invert w-[130px] md:w-[225px] h-auto" />
        </a>

        <div className="flex-1" />

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          {items.map((item) => (
            <li key={item.label} className="px-[14px]">
              <a
                href="#"
                className="flex items-center gap-1 text-white text-[15px] font-medium leading-[22.5px] py-[38px] hover:text-[#b0f127] transition-colors"
              >
                {item.label}
                {item.hasDropdown && (
                  <Image src="/images/nav-arrow.svg" alt="" width={14} height={24} />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons + Lang Toggle */}
        <div className="hidden lg:flex items-center gap-3 pl-5">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="border border-white/30 rounded-[5px] px-[16px] py-[15.5px] text-white text-[14px] font-semibold leading-[21px] hover:bg-white/10 transition-colors"
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a
            href="#"
            className="border border-[#12953d] rounded-[5px] px-[34px] py-[15.5px] text-white text-[14px] font-semibold leading-[21px] capitalize hover:bg-[#12953d] transition-colors"
          >
            {buttons.signup}
          </a>
          <a
            href="#"
            className="bg-[#12953d] rounded-[5px] px-[33px] py-[15.5px] text-white text-[14px] font-semibold leading-[21px] capitalize hover:bg-[#0e7a31] transition-colors"
          >
            {buttons.login}
          </a>
        </div>

        {/* Mobile CTA + Menu */}
        <div className="flex lg:hidden items-center gap-3">
          <a
            href="#"
            className="bg-[#12953d] rounded-[5px] px-3 py-[6px] text-white text-[10px] font-semibold leading-[15px] capitalize"
          >
            {buttons.login}
          </a>
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="block w-[35px] h-[4px] bg-white rounded-[3px]" />
            <span className="block w-[35px] h-[4px] bg-white rounded-[3px]" />
            <span className="block w-[35px] h-[4px] bg-white rounded-[3px]" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#001005] rounded-b-[10px] mx-0 px-5 pb-5">
          {items.map((item) => (
            <a
              key={item.label}
              href="#"
              className="block text-white text-[15px] font-medium py-3 border-b border-white/10"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleLang}
              className="border border-white/30 rounded-[5px] px-4 py-3 text-white text-sm font-semibold"
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
            <a href="#" className="border border-[#12953d] rounded-[5px] px-6 py-3 text-white text-sm font-semibold">
              {buttons.signup}
            </a>
            <a href="#" className="bg-[#12953d] rounded-[5px] px-6 py-3 text-white text-sm font-semibold">
              {buttons.login}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
