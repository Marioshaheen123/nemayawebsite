import { cookies } from "next/headers";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { COOKIE_NAME } from "@/lib/admin-auth";

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return { id: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const adminFromToken = token ? decodeJwtPayload(token) : null;

  return (
    <AdminAuthProvider serverAdmin={adminFromToken}>
      <div style={{ zoom: 1 }}>{children}</div>
    </AdminAuthProvider>
  );
}
