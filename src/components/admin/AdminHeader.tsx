"use client";

import { LogOut, User, Globe } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAdminLang } from "@/context/AdminLanguageContext";

interface AdminHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  const { adminLang, setAdminLang } = useAdminLang();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-sm text-gray-500">Welcome back</h2>
      </div>
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          <Globe className="w-3.5 h-3.5 text-gray-400 ml-2 mr-1" />
          <button
            onClick={() => setAdminLang("en")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              adminLang === "en"
                ? "bg-[#0e314c] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setAdminLang("ar")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              adminLang === "ar"
                ? "bg-[#0e314c] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            AR
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-[#0e314c] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-gray-900">{userName || "Admin"}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
