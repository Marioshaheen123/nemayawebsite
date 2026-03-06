"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/homepage": { title: "Homepage", subtitle: "Manage all homepage sections" },
  "/admin/homepage/hero": { title: "Hero Section", subtitle: "Main banner headline, subtitle, CTA, and images" },
  "/admin/homepage/benefits": { title: "Benefits Section", subtitle: "Feature list with icons and descriptions" },
  "/admin/homepage/carousel": { title: "Carousel Section", subtitle: "Benefit cards with images" },
  "/admin/homepage/how-it-works": { title: "How It Works", subtitle: "Step-by-step process with bullets" },
  "/admin/homepage/pricing": { title: "Pricing Section", subtitle: "Plans, prices, and feature comparison" },
  "/admin/homepage/blog": { title: "Blog Section", subtitle: "Section heading and latest articles" },
  "/admin/homepage/faq": { title: "FAQ Section", subtitle: "Frequently asked questions" },
  "/admin/videos": { title: "Videos", subtitle: "Manage all video content" },
  "/admin/videos/labels": { title: "Video Labels", subtitle: "Page-level labels and text" },
  "/admin/videos/new": { title: "New Video", subtitle: "Create a new video" },
  "/admin/about": { title: "About", subtitle: "Manage about page sections" },
  "/admin/about/hero": { title: "About Hero", subtitle: "Main banner headline and subtitle" },
  "/admin/about/redefining": { title: "Redefining Investment", subtitle: "Company intro, paragraphs, and statistics" },
  "/admin/about/vision": { title: "Vision", subtitle: "Vision statement, cards, and images" },
  "/admin/about/mission": { title: "Mission", subtitle: "Mission statement" },
  "/admin/about/values": { title: "Values", subtitle: "Core values, heading, and background image" },
  "/admin/about/security": { title: "Security & Compliance", subtitle: "Security section title and paragraphs" },
  "/admin/about/bridging": { title: "Bridging Global Markets", subtitle: "Content, CTA, and image" },
  "/admin/about/blog-section": { title: "About Blog Section", subtitle: "Blog section heading and badge" },
  "/admin/trading-platforms": { title: "Trading Platforms", subtitle: "Manage platform page content" },
  "/admin/account-types": { title: "Account Types", subtitle: "Manage account type plans and benefits" },
  "/admin/account-types/new": { title: "New Plan", subtitle: "Create a new account type plan" },
  "/admin/account-types/settings": { title: "Page Settings", subtitle: "Account types page hero title and heading" },
  "/admin/blog": { title: "Blog", subtitle: "Manage all blog articles" },
  "/admin/blog/new": { title: "New Article", subtitle: "Create a new blog article" },
  "/admin/islamic-rulings": { title: "Islamic Rulings", subtitle: "Manage sections, questions, and answers" },
  "/admin/faq-page": { title: "FAQ Page", subtitle: "Manage FAQ categories, questions, and page content" },
  "/admin/privacy-policy": { title: "Privacy Policy", subtitle: "Manage privacy policy sections and content" },
  "/admin/terms": { title: "Terms & Conditions", subtitle: "Manage terms and conditions sections and content" },
  "/admin/footer": { title: "Footer", subtitle: "Manage footer labels, links, contact info, and social icons" },
  "/admin/payments": { title: "Payment Settings", subtitle: "Configure payment providers and deposit amounts" },
  "/admin/withdrawal-settings": { title: "Withdrawal Settings", subtitle: "Configure trading hours for withdrawal requests" },
  "/admin/website-settings": { title: "Website Settings", subtitle: "Accent color, logos, and content management" },
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Dynamic video edit pages: /admin/videos/[id]
  if (/^\/admin\/videos\/[^/]+$/.test(pathname) && pathname !== "/admin/videos/new" && pathname !== "/admin/videos/labels") {
    return { title: "Edit Video", subtitle: "Update video details" };
  }
  // Dynamic account type edit pages: /admin/account-types/[id]
  if (/^\/admin\/account-types\/[^/]+$/.test(pathname) && pathname !== "/admin/account-types/new" && pathname !== "/admin/account-types/settings") {
    return { title: "Edit Plan", subtitle: "Update account type plan details and benefits" };
  }
  // Dynamic blog edit pages: /admin/blog/[id]
  if (/^\/admin\/blog\/[^/]+$/.test(pathname) && pathname !== "/admin/blog/new") {
    return { title: "Edit Article", subtitle: "Update article content" };
  }
  return { title: "Admin", subtitle: "" };
}

export default function AdminTopBar() {
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  const page = getPageTitle(pathname);

  return (
    <header className="h-[64px] bg-white border-b border-[#e8ecf1] px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-[18px] font-semibold text-[#2e263d] leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-[12px] text-[#6b7280]">{page.subtitle}</p>
        )}
      </div>

      {admin && (
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-full bg-accent/10 flex items-center justify-center text-accent text-[13px] font-semibold">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-medium text-[#2e263d] leading-tight">{admin.name}</p>
            <p className="text-[11px] text-[#6b7280]">{admin.email}</p>
          </div>
        </div>
      )}
    </header>
  );
}
