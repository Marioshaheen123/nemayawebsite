import type { Metadata } from "next";
import Header from "@/components/Header";
import EconomicDevelopmentArticlePage from "@/components/EconomicDevelopmentArticlePage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getLayoutData, getContentBlockSafe, getEconomicDevelopmentsBilingual } from "@/lib/content";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const revalidate = 120;

export async function generateStaticParams() {
  const articles = await prisma.economicDevelopment.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.economicDevelopment.findFirst({ where: { slug } });
  if (!article) return { title: "Not Found" };
  return buildMetadata({
    titleAr: article.metaTitleAr || article.titleAr,
    descriptionAr: article.metaDescriptionAr || article.excerptAr,
    path: `/economic-developments/${slug}`,
    ogImageUrl: article.ogImageUrl || article.imageUrl,
    type: "article",
    publishedTime: article.createdAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    keywords: article.keywords || undefined,
  });
}

export default async function EconomicDevelopmentArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { headerData, footerData } = await getLayoutData();
  const [data, article] = await Promise.all([
    getEconomicDevelopmentsBilingual(),
    prisma.economicDevelopment.findFirst({ where: { slug } }),
  ]);

  return (
    <main className="bg-white">
      {article && (
        <>
          <JsonLd data={articleJsonLd({
            title: article.titleAr,
            description: article.excerptAr,
            url: `${SITE_URL}/economic-developments/${slug}`,
            imageUrl: article.imageUrl,
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
          })} />
          <JsonLd data={breadcrumbJsonLd([
            { name: "الرئيسية", url: SITE_URL },
            { name: "التطورات الاقتصادية", url: `${SITE_URL}/economic-developments` },
            { name: article.titleAr, url: `${SITE_URL}/economic-developments/${slug}` },
          ])} />
        </>
      )}
      <Header {...headerData} />
      <EconomicDevelopmentArticlePage
        slug={slug}
        articles={data.articles}
        suggested={data.suggested}
      />
      <Footer {...footerData} />
    </main>
  );
}
