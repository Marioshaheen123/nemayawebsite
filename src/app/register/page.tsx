import RegisterPage from "@/components/RegisterPage";
import { getContentBlock } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Register() {
  const [registerText, ageOptions, countryOptions, callTimeOptions] = await Promise.all([
    getContentBlock<any>("auth.registerText"),
    getContentBlock<any>("auth.ageOptions"),
    getContentBlock<any>("auth.countryOptions"),
    getContentBlock<any>("auth.callTimeOptions"),
  ]);

  return (
    <RegisterPage
      registerText={registerText}
      ageOptions={ageOptions}
      countryOptions={countryOptions}
      callTimeOptions={callTimeOptions}
    />
  );
}
