import LoginPage from "@/components/LoginPage";
import { getContentBlock } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Login() {
  const loginText = await getContentBlock<any>("auth.loginText");

  return <LoginPage loginText={loginText} />;
}
