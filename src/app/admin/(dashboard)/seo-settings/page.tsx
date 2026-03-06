import { getContentBlocks } from "@/lib/content";
import { cached } from "@/lib/admin-cache";
import SeoSettingsEditor from "@/components/admin/editors/SeoSettingsEditor";

export default async function SeoSettingsPage() {
  const data = await cached(
    async () => {
      const blocks = await getContentBlocks(["seo.global"]);
      return blocks["seo.global"] ?? {};
    },
    "admin-seo-settings",
    ["admin-seo-settings"]
  );
  return (
    <div className="space-y-6">
      <SeoSettingsEditor initialData={data} />
    </div>
  );
}
