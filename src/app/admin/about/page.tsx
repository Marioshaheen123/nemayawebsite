import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "About Page Editor — Nemaya Admin" };

export default function AboutEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About Page Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit all bilingual content blocks used on the About page.
        </p>
      </div>

      {/* Hero */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Hero Section
        </h2>
        <ContentBlockEditor
          blockKey="about.heroContent"
          title="Hero Content"
          description="Page hero heading, subheading, and background details (EN/AR)."
        />
      </section>

      {/* Redefining */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Redefining Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.redefiningBadge"
            title="Redefining Badge"
            description="Small badge above the redefining section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.redefiningContent"
            title="Redefining Content"
            description="Heading, body copy, and CTA for the redefining section (EN/AR)."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Stats
        </h2>
        <ContentBlockEditor
          blockKey="about.stats"
          title="Stats"
          description="Array of stat items with value and label (EN/AR)."
        />
      </section>

      {/* Vision */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Vision Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.visionBadge"
            title="Vision Badge"
            description="Small badge above the vision section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.visionTitle"
            title="Vision Title"
            description="Main heading for the vision section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.visionCards"
            title="Vision Cards"
            description="Array of vision/pillar cards with icon, title, and description (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.visionImages"
            title="Vision Images"
            description="Image URLs used in the vision section collage."
          />
        </div>
      </section>

      {/* Mission */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Mission Section
        </h2>
        <ContentBlockEditor
          blockKey="about.missionTitle"
          title="Mission Title"
          description="Heading and body copy for the mission section (EN/AR)."
        />
      </section>

      {/* Values */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Values Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.valuesBadge"
            title="Values Badge"
            description="Small badge above the values section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.valuesHeading"
            title="Values Heading"
            description="Main heading for the values section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.values"
            title="Values"
            description="Array of value items with title and description (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.valuesImage"
            title="Values Image"
            description="Background or decorative image URL for the values section."
          />
        </div>
      </section>

      {/* Security */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Security Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.securityBadge"
            title="Security Badge"
            description="Small badge above the security section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.securityContent"
            title="Security Content"
            description="Heading, body, and feature list for the security section (EN/AR)."
          />
        </div>
      </section>

      {/* Bridging */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Bridging Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.bridgingContent"
            title="Bridging Content"
            description="Heading, subheading, and body copy for the bridging section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.bridgingImage"
            title="Bridging Image"
            description="Image URL used in the bridging section."
          />
        </div>
      </section>

      {/* Blog Section Labels */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Blog Section Labels
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="about.blogSectionBadge"
            title="Blog Section Badge"
            description="Small badge above the blog section on the About page (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="about.blogSectionHeading"
            title="Blog Section Heading"
            description="Heading for the blog preview section on the About page (EN/AR)."
          />
        </div>
      </section>
    </div>
  );
}
