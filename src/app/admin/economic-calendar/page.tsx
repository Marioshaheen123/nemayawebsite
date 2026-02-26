import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Economic Calendar Editor — Nemaya Admin" };

export default function EconomicCalendarEditorPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Economic Calendar Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit the content blocks used on the Economic Calendar page.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Page Content
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="economicCalendar.i18n"
            title="Economic Calendar i18n Strings"
            description="All UI labels, filter names, column headers, and date/time strings (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="economicCalendar.sampleData"
            title="Sample / Seed Data"
            description="Array of sample economic events shown when live data is unavailable."
          />
          <ContentBlockEditor
            blockKey="economicCalendar.currencyToCountry"
            title="Currency to Country Map"
            description='Mapping of currency codes to country codes for flag display. Example: {"USD": "US", "EUR": "EU"}'
          />
        </div>
      </section>
    </div>
  );
}
