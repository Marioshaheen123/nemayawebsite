import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import WebsiteSettingsEditor from "@/components/admin/editors/WebsiteSettingsEditor";

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

export default async function WebsiteSettingsPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["settings.website"]);
      return { ...DEFAULTS, ...blocks["settings.website"] };
    },
    "admin-website-settings",
    ["admin-website-settings"]
  );
  return (
    <div className="space-y-6">
      <WebsiteSettingsEditor initialData={data} />
    </div>
  );
}
