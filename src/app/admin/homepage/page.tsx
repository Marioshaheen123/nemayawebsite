import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Homepage Editor — Nemaya Admin" };

export default function HomepageEditorPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit all bilingual content blocks used on the homepage.
        </p>
      </div>

      {/* Hero */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Hero Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="homepage.heroContent"
            title="Hero Content"
            description="Main heading, subheading, and CTA button text (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.heroImages"
            title="Hero Images"
            description="Background and foreground image URLs used in the hero."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Benefits Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="homepage.benefitsBadge"
            title="Benefits Badge"
            description="Small badge label above the benefits heading (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.benefitsHeading"
            title="Benefits Heading"
            description="Main heading for the benefits section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.benefitsFeatures"
            title="Benefits Feature Cards"
            description="Array of feature cards with icon, title, and description (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.benefitsCtaText"
            title="Benefits CTA Text"
            description="Call-to-action button label in the benefits section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.benefitsImages"
            title="Benefits Images"
            description="Image URLs displayed alongside the benefits features."
          />
        </div>
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Carousel Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="homepage.carouselBadge"
            title="Carousel Badge"
            description="Small badge label above the carousel heading (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.carouselHeading"
            title="Carousel Heading"
            description="Main heading for the carousel section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.carouselCards"
            title="Carousel Cards"
            description="Array of cards with title, description, and optional image (EN/AR)."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          How It Works Section
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="homepage.howItWorksBadge"
            title="How It Works Badge"
            description="Small badge label above the section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.howItWorksContent"
            title="How It Works Content"
            description="Step-by-step content with headings and descriptions (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="homepage.howItWorksImage"
            title="How It Works Image"
            description="Illustration or screenshot image URL."
          />
        </div>
      </section>

      {/* Pricing Labels */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Pricing Labels
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="pricing.sectionBadge"
            title="Pricing Section Badge"
            description="Small badge above the pricing section heading (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="pricing.sectionHeading"
            title="Pricing Section Heading"
            description="Main heading for the pricing / account types section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="pricing.viewAllLabel"
            title="View All Label"
            description="Label for the &ldquo;View all&rdquo; / &ldquo;See more&rdquo; CTA (EN/AR)."
          />
        </div>
      </section>

      {/* Blog Labels */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Blog Labels
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="blog.sectionData"
            title="Blog Section Data"
            description="Section badge, heading, and CTA label for the homepage blog preview (EN/AR)."
          />
        </div>
      </section>

      {/* FAQ Labels */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          FAQ Labels
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="faq.homepageFaqBadge"
            title="FAQ Badge"
            description="Small badge label above the FAQ section (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="faq.homepageFaqHeading"
            title="FAQ Heading"
            description="Main heading for the homepage FAQ section (EN/AR)."
          />
        </div>
      </section>
    </div>
  );
}
