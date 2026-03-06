import type { Metadata } from "next";
import VerifyNumberPage from "@/components/VerifyNumberPage";
import { getContentBlock } from "@/lib/content";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VerifyNumber() {
  const verifyNumberText = await getContentBlock<any>("auth.verifyNumberText");

  return <VerifyNumberPage verifyNumberText={verifyNumberText} />;
}
