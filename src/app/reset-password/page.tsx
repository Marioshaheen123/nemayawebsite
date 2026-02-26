import ResetPasswordPage from "@/components/ResetPasswordPage";
import { getContentBlock } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ResetPassword() {
  const resetPasswordText = await getContentBlock<any>("auth.resetPasswordText");

  return <ResetPasswordPage resetPasswordText={resetPasswordText} />;
}
