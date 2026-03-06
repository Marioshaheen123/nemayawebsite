import { NextResponse } from "next/server";
import { getContentBlocks } from "@/lib/content";

const DEFAULTS = {
  accentColor: "#057e33",
  accentColorDark: "#046b2b",
  gradientFrom: "#0a7f35",
  gradientVia: "#12a544",
  gradientTo: "#3ec95e",
  gradientHoverFrom: "#086b2c",
  gradientHoverVia: "#0e8e3a",
  gradientHoverTo: "#34b552",
  mainLogo: "/images/nemayalogo.png",
  smallLogo: "/images/small logo.png",
};

export async function GET() {
  const blocks = await getContentBlocks(["settings.website"]);
  const data = blocks["settings.website"];
  return NextResponse.json({ ...DEFAULTS, ...data });
}
