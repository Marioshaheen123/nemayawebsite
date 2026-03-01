import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Trading Platforms Editor — Nemaya Admin" };

export default function TradingPlatformsEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trading Platforms Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit the content blocks used on the Trading Platforms page.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Page Content
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="tradingPlatforms.content"
            title="Trading Platforms Content"
            description="Hero heading, subheading, features list, platform tabs, and CTA text (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="tradingPlatforms.mockupImage"
            title="Platform Mockup Image"
            description="URL of the platform mockup / screenshot image displayed on the page."
          />
          <ContentBlockEditor
            blockKey="tradingPlatforms.checkIcon"
            title="Check Icon"
            description="SVG source or URL for the check / tick icon used in feature lists."
          />
        </div>
      </section>
    </div>
  );
}
