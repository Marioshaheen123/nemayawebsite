"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface UserProfile {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  id: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  profession: string;
  additionalPhone: string;
  annualIncome: string;
  avatar: string;
  documents: Record<string, { url: string; fileName: string; uploadedAt: string; face?: string }>;
}

interface UserAuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (accountNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (patch: Partial<UserProfile>) => void;
}

const DEFAULT_PROFILE: Omit<UserProfile, "firstName" | "lastName" | "email" | "id"> = {
  mobile: "",
  dateOfBirth: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  profession: "",
  additionalPhone: "",
  annualIncome: "",
  avatar: "",
  documents: {},
};

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => ({ success: false }),
  logout: () => {},
  updateUser: () => {},
});

async function fetchFullProfile(): Promise<Partial<UserProfile> | null> {
  try {
    const res = await fetch("/api/user/profile");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cookie on mount
  useEffect(() => {
    fetch("/api/user/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (data.user) {
          // Session is valid — fetch full profile from DB
          const fullProfile = await fetchFullProfile();
          const local = (() => { try { const s = localStorage.getItem("nemaya_user"); return s ? JSON.parse(s) : {}; } catch { return {}; } })();

          const profile: UserProfile = {
            ...DEFAULT_PROFILE,
            // Use local documents cache (not stored in server profile endpoint)
            documents: local.documents || {},
            // Server profile takes priority
            ...(fullProfile || {}),
            // Ensure core fields from auth
            firstName: fullProfile?.firstName || data.user.firstName || "",
            lastName: fullProfile?.lastName || data.user.lastName || "",
            email: fullProfile?.email || data.user.email || "",
            id: fullProfile?.id || data.user.id || "",
          };
          setUser(profile);
          localStorage.setItem("nemaya_user", JSON.stringify(profile));
        } else {
          localStorage.removeItem("nemaya_user");
        }
      })
      .catch(() => {
        // Offline — fall back to localStorage
        const stored = localStorage.getItem("nemaya_user");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem("nemaya_user");
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (accountNumber: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/user/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      // After login, fetch full profile from DB
      const fullProfile = await fetchFullProfile();

      const profile: UserProfile = {
        ...DEFAULT_PROFILE,
        ...(fullProfile || {}),
        firstName: fullProfile?.firstName || data.user.firstName || "",
        lastName: fullProfile?.lastName || data.user.lastName || "",
        email: fullProfile?.email || data.user.email || "",
        id: fullProfile?.id || data.user.id || "",
      };
      setUser(profile);
      localStorage.setItem("nemaya_user", JSON.stringify(profile));
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  }, []);

  const logout = useCallback(() => {
    fetch("/api/user/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    localStorage.removeItem("nemaya_user");
  }, []);

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("nemaya_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, logout, updateUser }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
