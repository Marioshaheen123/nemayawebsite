import type { Metadata } from "next";
import VerifyCodePage from "@/components/VerifyCodePage";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VerifyCode() {
  const verifyCodeText = await getContentBlock<any>("auth.verifyCodeText");

  return <VerifyCodePage verifyCodeText={verifyCodeText} />;
}
