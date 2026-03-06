import type { Metadata } from "next";
import VerifyEmailPage from "@/components/VerifyEmailPage";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VerifyEmail() {
  const verifyEmailText = await getContentBlock<any>("auth.verifyEmailText");

  return <VerifyEmailPage verifyEmailText={verifyEmailText} />;
}
