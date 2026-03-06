import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordPage from "@/components/ResetPasswordPage";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPassword() {
  const resetPasswordText = await getContentBlock<any>("auth.resetPasswordText");

  return (
    <Suspense>
      <ResetPasswordPage resetPasswordText={resetPasswordText} />
    </Suspense>
  );
}
