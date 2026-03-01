"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
}

interface UserAuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (accountNumber: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USER: UserProfile = {
  firstName: "Doe",
  lastName: "John",
  mobile: "+1 415 628 9432",
  email: "mmmm369@gmail.com",
  id: "A839274615",
  dateOfBirth: "11/01/2000",
  address: "742 Evergreen Terrace",
  city: "San Mateo",
  postalCode: "94401",
  country: "United States",
  profession: "Designer",
  additionalPhone: "+1 650 332 1189",
  annualIncome: "Less than 50,000",
  avatar: "/images/avatar-placeholder.png",
};

// Accept any non-empty credentials for mock
const MOCK_ACCOUNT = "123456";
const MOCK_PASSWORD = "password";

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => false,
  logout: () => {},
});

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nemaya_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("nemaya_user");
      }
    }
  }, []);

  const login = (accountNumber: string, password: string): boolean => {
    // Mock: accept specific credentials or any non-empty ones
    if (
      (accountNumber === MOCK_ACCOUNT && password === MOCK_PASSWORD) ||
      (accountNumber.length > 0 && password.length > 0)
    ) {
      setUser(MOCK_USER);
      localStorage.setItem("nemaya_user", JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nemaya_user");
  };

  return (
    <UserAuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
