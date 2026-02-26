import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Contact Page Editor — Nemaya Admin" };

export default function ContactEditorPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Page Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit the content blocks used on the Contact page.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Contact Page Content
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="contact.i18n"
            title="Contact i18n Strings"
            description="All labels, field placeholders, validation messages, and button text for the contact form (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="contact.totalSteps"
            title="Total Steps"
            description="Number of steps in the multi-step contact form. Example: 3"
          />
        </div>
      </section>
    </div>
  );
}
