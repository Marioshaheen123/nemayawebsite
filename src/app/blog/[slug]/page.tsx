import type { Metadata } from "next";
import Header from "@/components/Header";
import BlogArticlePage from "@/components/BlogArticlePage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getLayoutData, getContentBlocks, getBlogArticlesBilingual } from "@/lib/content";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export const revalidate = 120;

export async function generateStaticParams() {
  const articles = await prisma.blogArticle.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.blogArticle.findFirst({ where: { slug } });
  if (!article) return { title: "Not Found" };
  return buildMetadata({
    titleAr: article.metaTitleAr || article.titleAr,
    descriptionAr: article.metaDescriptionAr || article.excerptAr,
    path: `/blog/${slug}`,
    ogImageUrl: article.ogImageUrl || article.imageUrl,
    type: "article",
    publishedTime: article.createdAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    keywords: article.keywords || undefined,
  });
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { headerData, footerData } = await getLayoutData();
  const [blogData, blocks, article] = await Promise.all([
    getBlogArticlesBilingual(),
    getContentBlocks(["blog.moreArticlesCards"]),
    prisma.blogArticle.findFirst({ where: { slug } }),
  ]);

  return (
    <main className="bg-white">
      {article && (
        <>
          <JsonLd data={articleJsonLd({
            title: article.titleAr,
            description: article.excerptAr,
            url: `${SITE_URL}/blog/${slug}`,
            imageUrl: article.imageUrl,
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
          })} />
          <JsonLd data={breadcrumbJsonLd([
            { name: "الرئيسية", url: SITE_URL },
            { name: "المدونة", url: `${SITE_URL}/blog` },
            { name: article.titleAr, url: `${SITE_URL}/blog/${slug}` },
          ])} />
        </>
      )}
      <Header {...headerData} />
      <BlogArticlePage
        slug={slug}
        blogArticles={blogData.articles}
        suggestedArticles={blogData.suggested}
        moreArticlesCards={blocks["blog.moreArticlesCards"] || {}}
      />
      <Footer {...footerData} />
    </main>
  );
}
