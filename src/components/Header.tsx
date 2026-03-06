"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import { useUserAuth } from "@/context/UserAuthContext";

interface HeaderProps {
  headerNavItems: any;
  headerCta: any;
}

export default function Header({ headerNavItems, headerCta }: HeaderProps) {
  const { mainLogo } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const { lang, toggleLang } = useLang();
  const { user, isLoggedIn } = useUserAuth();
  // Filter out items that have children with actual entries, and strip empty children arrays
  const rawItems = headerNavItems[lang] || [];
  const items = rawItems.map((item: any) => ({
    ...item,
    children: item.children?.length > 0 ? item.children : undefined,
  }));
  const buttons = headerCta[lang];

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
    <header className="relative z-50">
      <nav className="bg-white border-b border-black/5 w-full px-4 md:px-[50px] xl:px-[80px] 2xl:px-[120px] flex items-center h-[58px] md:h-[72px] xl:h-[82px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-[7px] shrink-0">
          <Image src={mainLogo} alt="Namaya for Investment" width={200} height={46} className="w-[100px] md:w-[160px] xl:w-[190px] h-auto" />
        </a>

        <div className="flex-1" />

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          {items.map((item: any) => (
            <li
              key={item.label}
              className="px-[14px] relative"
              onMouseEnter={item.children ? () => setOpenDropdown(item.label) : undefined}
              onMouseLeave={item.children ? () => setOpenDropdown(null) : undefined}
            >
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 text-[#001005] text-[15px] xl:text-[16px] font-medium leading-[22.5px] py-[20px] hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.label}
                    <Image src="/images/nav-arrow.svg" alt="" width={14} height={24} className="brightness-0" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 bg-white border border-black/10 rounded-[10px] py-[8px] min-w-[180px] shadow-lg">
                      {item.children.map((child: any) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="block px-[20px] py-[10px] text-[#001005] text-[14px] font-medium hover:bg-black/5 hover:text-primary transition-colors"
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
                  className="flex items-center gap-1 text-[#001005] text-[15px] xl:text-[16px] font-medium leading-[22.5px] py-[20px] hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        {/* CTA Buttons + Lang Toggle */}
        <div className="hidden lg:flex items-center gap-2 pl-5">
          {isLoggedIn && user ? (
            <Link
              href="/personal-area"
              className="flex items-center gap-[10px] rounded-full px-[14px] py-[6px] bg-black/5 hover:bg-black/10 transition-all"
            >
              <div className="w-[32px] h-[32px] rounded-full bg-site-gradient flex items-center justify-center text-white text-[13px] font-semibold overflow-hidden">
                {user.avatar && user.avatar !== "/images/avatar-placeholder.png" && user.avatar !== "" ? (
                  <Image src={user.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <>{user.firstName[0]}{user.lastName[0]}</>
                )}
              </div>
              <span className="text-[#001005] text-[13px] font-medium">
                {user.firstName} {user.lastName}
              </span>
            </Link>
          ) : (
            <>
              <a
                href="/register"
                className="rounded-full px-[24px] py-[10px] text-[#001005] text-[13px] font-semibold border border-[#001005]/20 hover:bg-black/5 transition-all"
              >
                {buttons.signup}
              </a>
              <a
                href="/login"
                className="cta-gradient rounded-full px-[24px] py-[10px] text-white text-[13px] font-semibold"
              >
                {buttons.login}
              </a>
            </>
          )}
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-[6px] rounded-full px-[14px] py-[9px] text-[#001005]/80 text-[13px] font-medium hover:text-[#001005] hover:bg-black/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {lang === "en" ? "العربية" : "EN"}
          </button>
        </div>

        {/* Mobile CTA + Menu */}
        <div className="flex lg:hidden items-center gap-3">
          {isLoggedIn && user ? (
            <Link href="/personal-area" className="w-[30px] h-[30px] rounded-full bg-site-gradient flex items-center justify-center text-white text-[10px] font-semibold overflow-hidden">
              {user.avatar && user.avatar !== "/images/avatar-placeholder.png" && user.avatar !== "" ? (
                <Image src={user.avatar} alt="avatar" width={30} height={30} className="w-full h-full object-cover" unoptimized />
              ) : (
                <>{user.firstName[0]}{user.lastName[0]}</>
              )}
            </Link>
          ) : (
            <a
              href="/login"
              className="cta-gradient rounded-[5px] px-3 py-[6px] text-white text-[10px] font-semibold leading-[15px] capitalize"
            >
              {buttons.login}
            </a>
          )}
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="block w-[35px] h-[4px] bg-[#001005] rounded-[3px]" />
            <span className="block w-[35px] h-[4px] bg-[#001005] rounded-[3px]" />
            <span className="block w-[35px] h-[4px] bg-[#001005] rounded-[3px]" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white rounded-b-[10px] mx-0 px-5 pb-5 shadow-lg">
          {items.map((item: any) => (
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
                className="flex items-center justify-between text-[#001005] text-[15px] font-medium py-3 border-b border-black/10 cursor-pointer"
              >
                {item.label}
                {item.children && (
                  <Image
                    src="/images/nav-arrow.svg"
                    alt=""
                    width={14}
                    height={24}
                    className={`brightness-0 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </a>
              {item.children && openDropdown === item.label && (
                <div className="pl-4 border-b border-black/10">
                  {item.children.map((child: any) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className="block text-[#001005]/80 text-[14px] font-medium py-2.5 hover:text-primary transition-colors"
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
              className="flex items-center gap-[6px] rounded-full px-4 py-3 text-[#001005]/80 text-sm font-medium border border-[#001005]/20 hover:bg-black/5 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {lang === "en" ? "العربية" : "EN"}
            </button>
            {isLoggedIn && user ? (
              <Link href="/personal-area" className="cta-gradient flex items-center gap-2 rounded-full px-6 py-3 text-white text-sm font-semibold">
                <div className="w-[24px] h-[24px] rounded-full bg-white/30 flex items-center justify-center text-[10px] overflow-hidden">
                  {user.avatar && user.avatar !== "/images/avatar-placeholder.png" && user.avatar !== "" ? (
                    <Image src={user.avatar} alt="avatar" width={24} height={24} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <>{user.firstName[0]}{user.lastName[0]}</>
                  )}
                </div>
                {user.firstName} {user.lastName}
              </Link>
            ) : (
              <>
                <a href="/register" className="rounded-full px-6 py-3 text-[#001005] text-sm font-semibold border border-[#001005]/20 hover:bg-black/5 transition-all">
                  {buttons.signup}
                </a>
                <a href="/login" className="cta-gradient rounded-full px-6 py-3 text-white text-sm font-semibold">
                  {buttons.login}
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
