import { getDashboardStats } from "@/lib/content";
import DashboardStats from "@/components/admin/DashboardStats";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your website content</p>
      </div>
      <DashboardStats stats={stats} />
    </div>
  );
}
