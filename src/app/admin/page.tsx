import { Suspense } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivities } from "@/components/admin/RecentActivities";
import {
  getDashboardStats,
  getRecentActivities,
} from "@/lib/admin/actions/dashboard";
import { getCurrentUser } from "@/lib/actions/utils";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const [statsResult, activitiesResult] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(10),
  ]);

  const stats = statsResult.success ? statsResult.data : null;
  const activities = activitiesResult.success ? activitiesResult.data : [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.fullName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your library today.
        </p>
      </div>

      {/* Statistics Grid */}
      {stats ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon="📚"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Currently Borrowed"
            value={stats.borrowedBooks}
            icon="📖"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Available Books"
            value={stats.availableBooks}
            icon="✅"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="✓"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingRequests}
            icon="⏳"
            className="hover:shadow-lg transition-shadow"
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-center text-gray-500">Unable to load statistics</p>
        </div>
      )}

      {/* Recent Activities */}
      <Suspense
        fallback={
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <p className="text-center text-gray-500 py-8">Loading...</p>
          </div>
        }
      >
        <RecentActivities activities={activities} />
      </Suspense>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/books"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📚</span>
            <span className="font-medium text-gray-700">Manage Books</span>
          </a>
          <a
            href="/admin/users"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">👥</span>
            <span className="font-medium text-gray-700">Manage Users</span>
          </a>
          <a
            href="/admin/books/new"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span className="font-medium text-gray-700">Add New Book</span>
          </a>
          <a
            href="/admin/config"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <span className="font-medium text-gray-700">Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
