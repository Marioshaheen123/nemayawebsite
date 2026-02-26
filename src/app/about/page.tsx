import Header from "@/components/Header";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getBlogArticlesBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function About() {
  const [
    headerData,
    footerData,
    heroContent,
    redefiningBadge,
    redefiningContent,
    stats,
    visionBadge,
    visionTitle,
    visionCards,
    visionImages,
    missionTitle,
    valuesBadge,
    valuesHeading,
    values,
    valuesImage,
    securityBadge,
    securityContent,
    bridgingContent,
    bridgingImage,
    blogSectionBadge,
    blogSectionHeading,
    blogSectionData,
    blogData,
  ] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getContentBlock("about.heroContent"),
    getContentBlock("about.redefiningBadge"),
    getContentBlock("about.redefiningContent"),
    getContentBlock("about.stats"),
    getContentBlock("about.visionBadge"),
    getContentBlock("about.visionTitle"),
    getContentBlock("about.visionCards"),
    getContentBlock("about.visionImages"),
    getContentBlock("about.missionTitle"),
    getContentBlock("about.valuesBadge"),
    getContentBlock("about.valuesHeading"),
    getContentBlock("about.values"),
    getContentBlock("about.valuesImage"),
    getContentBlock("about.securityBadge"),
    getContentBlock("about.securityContent"),
    getContentBlock("about.bridgingContent"),
    getContentBlock("about.bridgingImage"),
    getContentBlock("about.blogSectionBadge"),
    getContentBlock("about.blogSectionHeading"),
    getContentBlock("blog.sectionData"),
    getBlogArticlesBilingual(),
  ]);

  // Build bilingual blog articles for the about page (first 3)
  const blogArticles = {
    en: (blogData.articles.en as any[]).slice(0, 3),
    ar: (blogData.articles.ar as any[]).slice(0, 3),
  };

  const blogReadMoreLabel = (blogSectionData as any).readMoreLabel;

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <AboutPage
        heroContent={heroContent}
        redefiningBadge={redefiningBadge}
        redefiningContent={redefiningContent}
        stats={stats}
        visionBadge={visionBadge}
        visionTitle={visionTitle}
        visionCards={visionCards}
        visionImages={visionImages}
        missionTitle={missionTitle}
        valuesBadge={valuesBadge}
        valuesHeading={valuesHeading}
        values={values}
        valuesImage={valuesImage}
        securityBadge={securityBadge}
        securityContent={securityContent}
        bridgingContent={bridgingContent}
        bridgingImage={bridgingImage}
        blogSectionBadge={blogSectionBadge}
        blogSectionHeading={blogSectionHeading}
        blogArticles={blogArticles}
        blogReadMoreLabel={blogReadMoreLabel}
      />
      <Footer {...footerData} />
    </main>
  );
}
