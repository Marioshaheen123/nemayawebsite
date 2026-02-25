import Header from "@/components/Header";
import FinancialAssetDetailPage from "@/components/FinancialAssetDetailPage";
import Footer from "@/components/Footer";

export default async function FinancialAssetDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="bg-white">
      <Header />
      <FinancialAssetDetailPage slug={slug} />
      <Footer />
    </main>
  );
}
