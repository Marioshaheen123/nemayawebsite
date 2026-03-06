"use client";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

const HOMEPAGE_SECTIONS = [
  { label: "Hero", id: "hero" },
  { label: "Benefits", id: "benefits" },
  { label: "Carousel", id: "carousel" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
  { label: "Blog", id: "blog" },
  { label: "FAQ", id: "faq" },
];

const VIDEO_ITEMS = [
  { label: "All Videos", href: "/admin/videos" },
  { label: "Page Labels", href: "/admin/videos/labels" },
];

const ABOUT_SECTIONS = [
  { label: "Hero", id: "hero" },
  { label: "Redefining", id: "redefining" },
  { label: "Vision", id: "vision" },
  { label: "Mission", id: "mission" },
  { label: "Values", id: "values" },
  { label: "Security", id: "security" },
  { label: "Bridging", id: "bridging" },
  { label: "Blog Section", id: "blog-section" },
];

const ACCOUNT_TYPE_ITEMS = [
  { label: "All Plans", href: "/admin/account-types" },
  { label: "New Plan", href: "/admin/account-types/new" },
  { label: "Page Settings", href: "/admin/account-types/settings" },
];

const FINANCIAL_ASSET_ITEMS = [
  { label: "All Assets", href: "/admin/financial-assets" },
  { label: "New Asset", href: "/admin/financial-assets/new" },
];

const BLOG_ITEMS = [
  { label: "Blog Articles", href: "/admin/blog", isHeader: true },
  { label: "All Articles", href: "/admin/blog" },
  { label: "New Article", href: "/admin/blog/new" },
  { label: "Economic News", href: "/admin/economic-developments", isHeader: true },
  { label: "All Articles", href: "/admin/economic-developments" },
  { label: "New Article", href: "/admin/economic-developments/new" },
];

export default function AdminSidebar() {
  const { mainLogo } = useSiteSettings();
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const isHomepageSection = pathname.startsWith("/admin/homepage");
  const isVideosSection = pathname.startsWith("/admin/videos");
  const isAboutSection = pathname.startsWith("/admin/about");
  const isTradingPlatforms = pathname.startsWith("/admin/trading-platforms");
  const isSocialMedia = pathname.startsWith("/admin/social-media");
  const isCustomerReviews = pathname.startsWith("/admin/customer-reviews");
  const isAccountTypes = pathname.startsWith("/admin/account-types");
  const isFinancialAssets = pathname.startsWith("/admin/financial-assets");
  const isBlogSection = pathname.startsWith("/admin/blog") || pathname.startsWith("/admin/economic-developments");
  const isIslamicRulings = pathname.startsWith("/admin/islamic-rulings");
  const isFaqPage = pathname.startsWith("/admin/faq-page");
  const isPrivacyPolicy = pathname.startsWith("/admin/privacy-policy");
  const isTerms = pathname.startsWith("/admin/terms");
  const isDepositWithdrawal = pathname.startsWith("/admin/deposit-withdrawal-policy");
  const isWebsiteVerification = pathname.startsWith("/admin/website-verification");
  const isSecurityReliability = pathname.startsWith("/admin/security-reliability");
  const isFooter = pathname.startsWith("/admin/footer");
  const isPaymentsSection = pathname.startsWith("/admin/payments") || pathname.startsWith("/admin/crypto-deposit") || pathname.startsWith("/admin/withdrawal-settings") || pathname.startsWith("/admin/bank-options");
  const isCrmSection = pathname.startsWith("/admin/users") || pathname.startsWith("/admin/transactions") || pathname.startsWith("/admin/contact-requests") || pathname.startsWith("/admin/documents");
  const isWebsiteSettings = pathname.startsWith("/admin/website-settings");
  const isSeoSettings = pathname.startsWith("/admin/seo-settings");
  const [homepageOpen, setHomepageOpen] = useState(isHomepageSection);
  const [videosOpen, setVideosOpen] = useState(isVideosSection);
  const [aboutOpen, setAboutOpen] = useState(isAboutSection);
  const [accountTypesOpen, setAccountTypesOpen] = useState(isAccountTypes);
  const [financialAssetsOpen, setFinancialAssetsOpen] = useState(isFinancialAssets);
  const [blogOpen, setBlogOpen] = useState(isBlogSection);
  const [paymentsOpen, setPaymentsOpen] = useState(isPaymentsSection);
  const [crmOpen, setCrmOpen] = useState(isCrmSection);

  return (
    <aside className="w-[260px] bg-white border-r border-[#e8ecf1] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#e8ecf1]">
        <Link href="/admin">
          <Image
            src={mainLogo}
            alt="Nemaya Admin"
            width={150}
            height={40}
            className="h-[34px] w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {/* Website Settings */}
        <Link
          href="/admin/website-settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-[13.5px] font-medium transition-colors ${
            isWebsiteSettings
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Website Settings
        </Link>

        {/* SEO Settings */}
        <Link
          href="/admin/seo-settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-[13.5px] font-medium transition-colors ${
            isSeoSettings
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          SEO Settings
        </Link>

        {/* Homepage dropdown */}
        <button
          onClick={() => setHomepageOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isHomepageSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Homepage
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${homepageOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {homepageOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {HOMEPAGE_SECTIONS.map((section) => {
              const href = `/admin/homepage/${section.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={section.id}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {section.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Videos dropdown */}
        <button
          onClick={() => setVideosOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isVideosSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Videos
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${videosOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {videosOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {VIDEO_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* About dropdown */}
        <button
          onClick={() => setAboutOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isAboutSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            About
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {aboutOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {ABOUT_SECTIONS.map((section) => {
              const href = `/admin/about/${section.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={section.id}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {section.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Trading Platforms - single link */}
        <Link
          href="/admin/trading-platforms"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isTradingPlatforms
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Trading Platforms
        </Link>

        {/* Social Media - single link */}
        <Link
          href="/admin/social-media"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isSocialMedia
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          Social Media
        </Link>

        {/* Customer Reviews - single link */}
        <Link
          href="/admin/customer-reviews"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isCustomerReviews
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Customer Reviews
        </Link>

        {/* Account Types dropdown */}
        <button
          onClick={() => setAccountTypesOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isAccountTypes
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Account Types
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${accountTypesOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {accountTypesOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {ACCOUNT_TYPE_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Financial Assets dropdown */}
        <button
          onClick={() => setFinancialAssetsOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isFinancialAssets
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Financial Assets
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${financialAssetsOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {financialAssetsOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {FINANCIAL_ASSET_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Blog dropdown */}
        <button
          onClick={() => setBlogOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isBlogSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Blog
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${blogOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {blogOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {BLOG_ITEMS.map((item: any, i: number) => {
              if (item.isHeader) {
                return (
                  <div
                    key={item.label + i}
                    className={`px-3 pt-[10px] pb-[4px] text-[11px] font-semibold uppercase tracking-wider text-[#a0a5af] ${i > 0 ? "mt-1 border-t border-[#e8ecf1] pt-[10px]" : ""}`}
                  >
                    {item.label}
                  </div>
                );
              }
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href + i}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Islamic Rulings - single link */}
        <Link
          href="/admin/islamic-rulings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isIslamicRulings
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Islamic Rulings
        </Link>

        {/* FAQ Page - single link */}
        <Link
          href="/admin/faq-page"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isFaqPage
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          FAQ Page
        </Link>

        {/* Privacy Policy - single link */}
        <Link
          href="/admin/privacy-policy"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isPrivacyPolicy
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Privacy Policy
        </Link>

        {/* Terms & Conditions - single link */}
        <Link
          href="/admin/terms"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isTerms
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Terms & Conditions
        </Link>

        {/* Deposit & Withdrawal Policy */}
        <Link
          href="/admin/deposit-withdrawal-policy"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isDepositWithdrawal
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Deposit & Withdrawal
        </Link>

        {/* Website Verification */}
        <Link
          href="/admin/website-verification"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isWebsiteVerification
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Website Verification
        </Link>

        {/* Security & Reliability */}
        <Link
          href="/admin/security-reliability"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isSecurityReliability
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Security & Reliability
        </Link>

        {/* Footer - single link */}
        <Link
          href="/admin/footer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors ${
            isFooter
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="15" x2="21" y2="15" />
          </svg>
          Footer
        </Link>

        {/* Payments dropdown */}
        <button
          onClick={() => setPaymentsOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isPaymentsSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Payments
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${paymentsOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {paymentsOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {[
              { label: "Payment Providers", href: "/admin/payments" },
              { label: "Crypto Deposit", href: "/admin/crypto-deposit" },
              { label: "Bank Options", href: "/admin/bank-options" },
              { label: "Withdrawal Settings", href: "/admin/withdrawal-settings" },
            ].map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* CRM dropdown */}
        <button
          onClick={() => setCrmOpen((p) => !p)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-0.5 text-[13.5px] font-medium transition-colors cursor-pointer ${
            isCrmSection
              ? "bg-accent/10 text-accent"
              : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
          }`}
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            CRM
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${crmOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {crmOpen && (
          <div className="ml-4 border-l border-[#e8ecf1] pl-2 mb-1">
            {[
              { label: "Users", href: "/admin/users" },
              { label: "Transactions", href: "/admin/transactions" },
              { label: "Contact Requests", href: "/admin/contact-requests" },
              { label: "Documents", href: "/admin/documents" },
            ].map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg mb-0.5 text-[13px] font-medium transition-colors ${
                    active
                      ? "bg-accent/10 text-accent"
                      : "text-[#6b7280] hover:bg-[#f4f5fa] hover:text-[#2e263d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#e8ecf1]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-colors w-full cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
