import { NextRequest, NextResponse } from "next/server";
import { getContentBlocks, updateContentBlock } from "@/lib/content";
import { revalidatePath, revalidateTag } from "next/cache";
import { validateBody } from "@/lib/validation";
import { bankOptionsSchema } from "@/lib/schemas/content-block";
import { requireAdmin } from "@/lib/admin-guard";
import { logAuditEvent } from "@/lib/audit-log";
import { getClientIp } from "@/lib/rate-limit";

const DEFAULT_BANKS = {
  banks: [
    { value: "SABB", en: "SABB Bank", ar: "بنك ساب" },
    { value: "SNB", en: "Saudi National Bank (SNB)", ar: "البنك الأهلي السعودي" },
    { value: "ALRAJHI", en: "Al Rajhi Bank", ar: "مصرف الراجحي" },
    { value: "RIYADH", en: "Riyad Bank", ar: "بنك الرياض" },
    { value: "ALINMA", en: "Alinma Bank", ar: "مصرف الإنماء" },
    { value: "ALBILAD", en: "Bank AlBilad", ar: "بنك البلاد" },
    { value: "ALJAZIRA", en: "Bank AlJazira", ar: "بنك الجزيرة" },
    { value: "BSF", en: "Banque Saudi Fransi", ar: "البنك السعودي الفرنسي" },
    { value: "ANB", en: "Arab National Bank", ar: "البنك العربي الوطني" },
    { value: "SIB", en: "Saudi Investment Bank", ar: "البنك السعودي للاستثمار" },
    { value: "GIB", en: "Gulf International Bank", ar: "بنك الخليج الدولي" },
    { value: "EMIRATES_NBD", en: "Emirates NBD", ar: "الإمارات دبي الوطني" },
    { value: "ADCB", en: "Abu Dhabi Commercial Bank", ar: "بنك أبوظبي التجاري" },
    { value: "QNB", en: "Qatar National Bank", ar: "بنك قطر الوطني" },
    { value: "NBK", en: "National Bank of Kuwait", ar: "بنك الكويت الوطني" },
    { value: "CIB", en: "Commercial International Bank", ar: "البنك التجاري الدولي" },
    { value: "OTHER", en: "Other", ar: "أخرى" },
  ],
};

export async function GET() {
  const blocks = await getContentBlocks(["withdrawal.bankOptions"]);
  const data = (blocks["withdrawal.bankOptions"] ?? DEFAULT_BANKS) as { banks: typeof DEFAULT_BANKS.banks };
  // Always sort "OTHER" to the end
  data.banks = [...data.banks.filter((b) => b.value !== "OTHER"), ...data.banks.filter((b) => b.value === "OTHER")];
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { admin, error: authError } = await requireAdmin(request);
  if (authError) return authError;

  const { data, error } = await validateBody(request, bankOptionsSchema);
  if (error) return error;

  await updateContentBlock("withdrawal.bankOptions", data);

  await logAuditEvent({
    adminId: admin.sub,
    adminEmail: admin.email,
    action: "settings-change",
    resource: "ContentBlock:withdrawal.bankOptions",
    details: JSON.stringify({ count: data.banks.length }),
    ip: getClientIp(request),
  });

  revalidatePath("/");
  revalidateTag("content-blocks", "default");
  revalidateTag("admin-bank-options", "default");
  return NextResponse.json({ success: true });
}
