import Header from "@/components/Header";
import BlogArticlePage from "@/components/BlogArticlePage";
import Footer from "@/components/Footer";
import { getHeaderData, getFooterData, getContentBlock, getBlogArticlesBilingual } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [headerData, footerData, blogData, moreArticlesCards] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getBlogArticlesBilingual(),
    getContentBlock("blog.moreArticlesCards"),
  ]);

  return (
    <main className="bg-white">
      <Header {...headerData} />
      <BlogArticlePage
        slug={slug}
        blogArticles={blogData.articles}
        suggestedArticles={blogData.suggested}
        moreArticlesCards={moreArticlesCards}
      />
      <Footer {...footerData} />
    </main>
  );
}
