"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";

interface NavItem {
  label: string;
  hasDropdown: boolean;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems: { en: NavItem[]; ar: NavItem[] } = {
  en: [
    { label: "Home", hasDropdown: false, href: "/" },
    {
      label: "Tools Center",
      hasDropdown: true,
      href: "#",
      children: [
        { label: "Videos", href: "/videos" },
        { label: "Economic Calendar", href: "/economic-calendar" },
      ],
    },
    { label: "About", hasDropdown: false, href: "/about" },
    { label: "Trading Platforms", hasDropdown: true, href: "/trading-platforms" },
    { label: "Blog", hasDropdown: false, href: "/blog" },
  ],
  ar: [
    { label: "الرئيسية", hasDropdown: false, href: "/" },
    {
      label: "أدوات التداول",
      hasDropdown: true,
      href: "#",
      children: [
        { label: "فيديو", href: "/videos" },
        { label: "التقويم الاقتصادي", href: "/economic-calendar" },
      ],
    },
    { label: "عن نمايا", hasDropdown: false, href: "/about" },
    { label: "منصات التداول", hasDropdown: true, href: "/trading-platforms" },
    { label: "مدونة", hasDropdown: false, href: "/blog" },
  ],
};

const cta = {
  en: { signup: "Sign up", login: "Log in" },
  ar: { signup: "سجل", login: "تسجيل الدخول" },
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const { lang, toggleLang } = useLang();
  const items = navItems[lang];
  const buttons = cta[lang];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="bg-[#001005] w-full px-4 md:px-[50px] xl:px-[80px] 2xl:px-[120px] flex items-center h-[69px] md:h-[100px] xl:h-[110px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-[7px] shrink-0">
          <Image src="/images/nemayalogo.png" alt="Namaya for Investment" width={260} height={60} className="brightness-0 invert w-[130px] md:w-[225px] xl:w-[260px] h-auto" />
        </a>

        <div className="flex-1" />

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          {items.map((item) => (
            <li
              key={item.label}
              className="px-[14px] relative"
              ref={item.children ? dropdownRef : undefined}
            >
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 text-white text-[15px] xl:text-[16px] font-medium leading-[22.5px] py-[38px] hover:text-[#b0f127] transition-colors cursor-pointer"
                  >
                    {item.label}
                    <Image src="/images/nav-arrow.svg" alt="" width={14} height={24} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-[#001005] border border-white/10 rounded-[10px] py-[8px] min-w-[180px] shadow-lg">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="block px-[20px] py-[10px] text-white text-[14px] font-medium hover:bg-white/10 hover:text-[#b0f127] transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-white text-[15px] xl:text-[16px] font-medium leading-[22.5px] py-[38px] hover:text-[#b0f127] transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <Image src="/images/nav-arrow.svg" alt="" width={14} height={24} />
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Buttons + Lang Toggle */}
        <div className="hidden lg:flex items-center gap-2 pl-5">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-[6px] rounded-full px-[14px] py-[9px] text-white/80 text-[13px] font-medium hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {lang === "en" ? "العربية" : "EN"}
          </button>
          <a
            href="/register"
            className="rounded-full px-[24px] py-[10px] text-white text-[13px] font-semibold border border-white/20 hover:bg-white/10 transition-all"
          >
            {buttons.signup}
          </a>
          <a
            href="/login"
            className="rounded-full px-[24px] py-[10px] bg-[#12953d] text-white text-[13px] font-semibold hover:bg-[#0e7a31] transition-all"
          >
            {buttons.login}
          </a>
        </div>

        {/* Mobile CTA + Menu */}
        <div className="flex lg:hidden items-center gap-3">
          <a
            href="/login"
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
            <div key={item.label}>
              <a
                href={item.children ? undefined : item.href}
                onClick={
                  item.children
                    ? (e) => {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === item.label ? null : item.label);
                      }
                    : undefined
                }
                className="flex items-center justify-between text-white text-[15px] font-medium py-3 border-b border-white/10 cursor-pointer"
              >
                {item.label}
                {item.children && (
                  <Image
                    src="/images/nav-arrow.svg"
                    alt=""
                    width={14}
                    height={24}
                    className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </a>
              {item.children && openDropdown === item.label && (
                <div className="pl-4 border-b border-white/10">
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="block text-white/80 text-[14px] font-medium py-2.5 hover:text-[#b0f127] transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-[6px] rounded-full px-4 py-3 text-white/80 text-sm font-medium border border-white/20 hover:bg-white/10 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {lang === "en" ? "العربية" : "EN"}
            </button>
            <a href="/register" className="rounded-full px-6 py-3 text-white text-sm font-semibold border border-white/20 hover:bg-white/10 transition-all">
              {buttons.signup}
            </a>
            <a href="/login" className="rounded-full px-6 py-3 bg-[#12953d] text-white text-sm font-semibold hover:bg-[#0e7a31] transition-all">
              {buttons.login}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
