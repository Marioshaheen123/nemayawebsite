import type { Metadata } from "next";
import PersonalAreaPage from "@/components/PersonalAreaPage";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function PersonalArea() {
  return <PersonalAreaPage />;
}
