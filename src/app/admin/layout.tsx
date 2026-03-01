import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminShell from "@/components/admin/AdminShell";
import { SessionProvider } from "next-auth/react";
import { AdminLanguageProvider } from "@/context/AdminLanguageContext";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headerList = await headers();
  const pathname = headerList.get("x-next-url") || headerList.get("x-invoke-path") || "";

  // Login page: render without sidebar
  if (!session || pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <SessionProvider session={session}>
      <AdminLanguageProvider>
        <AdminShell>
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader
              userName={session.user?.name}
              userEmail={session.user?.email}
            />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </AdminShell>
      </AdminLanguageProvider>
    </SessionProvider>
  );
}
