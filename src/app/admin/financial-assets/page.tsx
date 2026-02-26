import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, TrendingUp, Edit } from "lucide-react";

export const metadata = { title: "Financial Assets — Nemaya Admin" };

export default async function FinancialAssetsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const assets = await prisma.financialAsset.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          instruments: true,
          advantages: true,
          faqs: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Assets</h1>
          <p className="text-gray-500 mt-1">
            {assets.length} asset{assets.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/financial-assets/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Asset
          </Button>
        </Link>
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No financial assets yet.</p>
            <Link href="/admin/financial-assets/new">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create First Asset
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                {/* Image */}
                {asset.imageUrl && (
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={asset.imageUrl}
                      alt={asset.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{asset.nameEn}</h3>
                      <p className="text-sm text-gray-400 font-arabic">{asset.nameAr}</p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                      /{asset.slug}
                    </span>
                  </div>

                  {asset.headlineEn && (
                    <p className="text-sm text-gray-500 line-clamp-2">{asset.headlineEn}</p>
                  )}

                  {/* Counts */}
                  <div className="flex gap-3 text-xs text-gray-400 pt-1">
                    <span>{asset._count.instruments} instruments</span>
                    <span>{asset._count.advantages} advantages</span>
                    <span>{asset._count.faqs} FAQs</span>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link href={`/admin/financial-assets/${asset.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="w-3 h-3 mr-2" />
                      Edit Asset
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
