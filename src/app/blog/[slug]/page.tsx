import Header from "@/components/Header";
import BlogArticlePage from "@/components/BlogArticlePage";
import Footer from "@/components/Footer";

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="bg-white">
      <Header />
      <BlogArticlePage slug={slug} />
      <Footer />
    </main>
  );
}
