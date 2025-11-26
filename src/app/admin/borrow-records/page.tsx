import {
  getAllBorrowRecords,
  getBorrowRecordsStats,
} from "@/lib/admin/actions/borrow-records";
import { BorrowRecordsTable } from "@/components/admin/BorrowRecordsTable";
import { StatCard } from "@/components/admin/StatCard";
import { redirect } from "next/navigation";

const BorrowRecordsPage = async () => {
  const [recordsResult, statsResult] = await Promise.all([
    getAllBorrowRecords(),
    getBorrowRecordsStats(),
  ]);

  if (!recordsResult.success || !statsResult.success) {
    redirect("/admin");
  }

  const stats = statsResult.data ?? {
    total: 0,
    borrowed: 0,
    overdue: 0,
    returned: 0,
  };
  const records = recordsResult.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Borrow Records Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and manage all book borrowing activities
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Records"
          value={stats.total}
          icon="📋"
          className="hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Currently Borrowed"
          value={stats.borrowed}
          icon="📖"
          className="hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdue}
          icon="⚠️"
          className="hover:shadow-lg transition-shadow"
        />
        <StatCard
          title="Returned Books"
          value={stats.returned}
          icon="✓"
          className="hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Borrow Records Table */}
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-7">
          <h2 className="text-xl font-semibold">All Borrow Records</h2>
        </div>
        <div className="w-full overflow-hidden">
          <BorrowRecordsTable data={records} />
        </div>
      </section>
    </div>
  );
};

export default BorrowRecordsPage;
