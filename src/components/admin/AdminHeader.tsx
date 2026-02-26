"use client";

import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function AdminHeader({ userName, userEmail }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-sm text-gray-500">Welcome back</h2>
      </div>
      <div className="flex items-center gap-4">
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
