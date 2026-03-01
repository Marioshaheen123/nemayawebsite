import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Navigation & Footer Editor — Nemaya Admin" };

export default function NavigationEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navigation &amp; Footer Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit the bilingual label content for the site header and footer. Navigation
          link items (href, order, dropdowns) are managed separately via the NavItem
          table.
        </p>
      </div>

      {/* Header */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Header
        </h2>
        <ContentBlockEditor
          blockKey="navigation.headerCta"
          title="Header CTA"
          description="Text and href for the call-to-action button displayed in the site header (EN/AR)."
        />
      </section>

      {/* Footer */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Footer
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="navigation.footerLabels"
            title="Footer Labels"
            description="Section headings, copyright text, disclaimer, and link labels in the footer (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="navigation.footerContactInfo"
            title="Footer Contact Info"
            description="Email address, phone number, and office address shown in the footer (EN/AR)."
          />
        </div>
      </section>

      {/* Info box */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Note:</strong> To edit navigation link labels, hrefs, order, or dropdown
        structure, use the <strong>NavItem</strong> table (coming soon via a dedicated
        Nav Editor page).
      </div>
    </div>
  );
}
