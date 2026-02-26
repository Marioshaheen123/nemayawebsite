import VerifyNumberPage from "@/components/VerifyNumberPage";
import { getContentBlock } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function VerifyNumber() {
  const verifyNumberText = await getContentBlock<any>("auth.verifyNumberText");

  return <VerifyNumberPage verifyNumberText={verifyNumberText} />;
}
