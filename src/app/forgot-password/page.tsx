import ForgotPasswordPage from "@/components/ForgotPasswordPage";
import { getContentBlock } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ForgotPassword() {
  const forgotPasswordText = await getContentBlock<any>("auth.forgotPasswordText");

  return <ForgotPasswordPage forgotPasswordText={forgotPasswordText} />;
}
