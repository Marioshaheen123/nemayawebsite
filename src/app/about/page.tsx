import type { Metadata } from "next";
import Header from "@/components/Header";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import { getLayoutData, getContentBlocks, getBlogArticlesBilingual } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    titleAr: "عن نمايا",
    descriptionAr: "تعرف على شركة نمايا المالية ورؤيتنا في عالم الاستثمار والتداول",
    path: "/about",
  });
}

export default async function About() {
  const { headerData, footerData } = await getLayoutData();

  // Batch-fetch all about content blocks in a single query
  const blocks = await getContentBlocks([
    "about.heroContent", "about.redefiningBadge", "about.redefiningContent", "about.stats",
    "about.visionBadge", "about.visionTitle", "about.visionCards", "about.visionImages",
    "about.missionTitle", "about.valuesBadge", "about.valuesHeading", "about.values",
    "about.valuesImage", "about.securityBadge", "about.securityContent",
    "about.bridgingContent", "about.bridgingImage",
    "about.blogSectionBadge", "about.blogSectionHeading", "blog.sectionData",
  ]);
  const blogData = await getBlogArticlesBilingual();

  const heroContent = blocks["about.heroContent"];
  const redefiningBadge = blocks["about.redefiningBadge"];
  const redefiningContent = blocks["about.redefiningContent"];
  const stats = blocks["about.stats"];
  const visionBadge = blocks["about.visionBadge"];
  const visionTitle = blocks["about.visionTitle"];
  const visionCards = blocks["about.visionCards"];
  const visionImages = blocks["about.visionImages"];
  const missionTitle = blocks["about.missionTitle"];
  const valuesBadge = blocks["about.valuesBadge"];
  const valuesHeading = blocks["about.valuesHeading"];
  const values = blocks["about.values"];
  const valuesImage = blocks["about.valuesImage"];
  const securityBadge = blocks["about.securityBadge"];
  const securityContent = blocks["about.securityContent"];
  const bridgingContent = blocks["about.bridgingContent"];
  const bridgingImage = blocks["about.bridgingImage"];
  const blogSectionBadge = blocks["about.blogSectionBadge"];
  const blogSectionHeading = blocks["about.blogSectionHeading"];
  const blogSectionData = blocks["blog.sectionData"];

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
