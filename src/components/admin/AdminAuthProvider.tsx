"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  /** Fetch wrapper that auto-refreshes token on 401 */
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isLoading: true,
  logout: async () => {},
  adminFetch: async () => new Response(),
});

export function AdminAuthProvider({
  children,
  serverAdmin,
}: {
  children: ReactNode;
  serverAdmin?: AdminUser | null;
}) {
  const [admin, setAdmin] = useState<AdminUser | null>(serverAdmin ?? null);
  const refreshingRef = useRef<Promise<boolean> | null>(null);

  // Silently refresh access token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/auth/refresh", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.admin) setAdmin(data.admin);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Auto-refresh token every 12 minutes (access token expires at 15min)
  useEffect(() => {
    if (!admin) return;
    const interval = setInterval(
      () => {
        refreshToken();
      },
      12 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [admin, refreshToken]);

  const logout = async () => {
    await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      credentials: "same-origin",
    });
    setAdmin(null);
    window.location.href = "/admin/login";
  };

  // Fetch wrapper: adds CSRF header + retries on 401 with token refresh
  const adminFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const headers = new Headers(options.headers);
      headers.set("X-Requested-With", "XMLHttpRequest");
      if (
        !headers.has("Content-Type") &&
        options.body &&
        typeof options.body === "string"
      ) {
        headers.set("Content-Type", "application/json");
      }

      const doFetch = () =>
        fetch(url, { ...options, headers, credentials: "same-origin" });

      const res = await doFetch();

      // On 401, try to refresh token once and retry
      if (res.status === 401) {
        // Deduplicate concurrent refreshes
        if (!refreshingRef.current) {
          refreshingRef.current = refreshToken().finally(() => {
            refreshingRef.current = null;
          });
        }
        const refreshed = await refreshingRef.current;
        if (refreshed) {
          return doFetch();
        }
        // Refresh failed — redirect to login
        window.location.href = "/admin/login";
      }

      return res;
    },
    [refreshToken]
  );

  return (
    <AdminAuthContext.Provider
      value={{ admin, isLoading: false, logout, adminFetch }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
