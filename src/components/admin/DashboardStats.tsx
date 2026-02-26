"use client";

import {
  FileText,
  Video,
  HelpCircle,
  CreditCard,
  TrendingUp,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    blogCount: number;
    videoCount: number;
    faqCount: number;
    planCount: number;
    assetCount: number;
    imageCount: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { label: "Blog Articles", value: stats.blogCount, icon: FileText, color: "bg-blue-50 text-blue-600" },
    { label: "Videos", value: stats.videoCount, icon: Video, color: "bg-purple-50 text-purple-600" },
    { label: "FAQ Questions", value: stats.faqCount, icon: HelpCircle, color: "bg-amber-50 text-amber-600" },
    { label: "Account Plans", value: stats.planCount, icon: CreditCard, color: "bg-green-50 text-green-600" },
    { label: "Financial Assets", value: stats.assetCount, icon: TrendingUp, color: "bg-red-50 text-red-600" },
    { label: "Site Images", value: stats.imageCount, icon: ImageIcon, color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
