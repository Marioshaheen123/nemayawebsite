import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "@/components/LoginPage";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Login() {
  const loginText = await getContentBlock<any>("auth.loginText");

  return (
    <Suspense>
      <LoginPage loginText={loginText} />
    </Suspense>
  );
}
