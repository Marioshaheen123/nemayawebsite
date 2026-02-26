"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Home,
  Info,
  FileText,
  Video,
  HelpCircle,
  CreditCard,
  TrendingUp,
  Monitor,
  Mail,
  Calendar,
  Menu,
  Shield,
  FileCheck,
  BookOpen,
  Lock,
  ImageIcon,
  Settings,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Homepage", icon: Home, href: "/admin/homepage" },
  { label: "About Page", icon: Info, href: "/admin/about" },
  { label: "Blog Articles", icon: FileText, href: "/admin/blog" },
  { label: "Videos", icon: Video, href: "/admin/videos" },
  { label: "FAQ", icon: HelpCircle, href: "/admin/faq" },
  { label: "Account Types", icon: CreditCard, href: "/admin/account-types" },
  { label: "Financial Assets", icon: TrendingUp, href: "/admin/financial-assets" },
  { label: "Trading Platforms", icon: Monitor, href: "/admin/trading-platforms" },
  { label: "Contact Page", icon: Mail, href: "/admin/contact" },
  { label: "Economic Calendar", icon: Calendar, href: "/admin/economic-calendar" },
  { label: "Navigation & Footer", icon: Menu, href: "/admin/navigation" },
  { label: "Privacy Policy", icon: Shield, href: "/admin/privacy-policy" },
  { label: "Terms & Conditions", icon: FileCheck, href: "/admin/terms" },
  { label: "Islamic Rulings", icon: BookOpen, href: "/admin/islamic-rulings" },
  { label: "Auth Pages", icon: Lock, href: "/admin/auth-pages" },
  { label: "Images Library", icon: ImageIcon, href: "/admin/images" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0e314c] text-white flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#12953d] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span className="text-lg font-bold">Nemaya Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {sidebarItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-white/40">
        Nemaya Backoffice v1.0
      </div>
    </aside>
  );
}
