import {
  getAllBorrowRecords,
  getBorrowRecordsStats,
} from "@/lib/admin/actions/borrow-records";
import { BorrowRecordsTable } from "@/components/admin/BorrowRecordsTable";
import Image from "next/image";

const BorrowRecordsPage = async () => {
  const [recordsResult, statsResult] = await Promise.all([
    getAllBorrowRecords(),
    getBorrowRecordsStats(),
  ]);

  if (!recordsResult.success || !statsResult.success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load borrow records. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = statsResult.data ?? {
    total: 0,
    borrowed: 0,
    overdue: 0,
    returned: 0,
  };
  const records = recordsResult.data ?? [];

  return (
    <div className="admin-container min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header with Gradient */}
      <div className="admin-header relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Image
                src="/icons/admin/receipt.svg"
                alt="records"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Borrow Records Management
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Track and manage all book borrowing activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards with Gradients and Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
        {/* Total Records Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/admin/receipt.svg"
                  alt="total"
                  width={28}
                  height={28}
                  className="brightness-0 invert"
                />
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-blue-600">
                  ALL TIME
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Total Records
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">
                Complete borrowing history
              </p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        </div>

        {/* Currently Borrowed Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                <Image
                  src="/icons/admin/bookmark.svg"
                  alt="borrowed"
                  width={28}
                  height={28}
                  className="brightness-0 invert"
                />
                {stats.borrowed > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    !
                  </div>
                )}
              </div>
              <div className="bg-purple-50 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-purple-600">
                  ACTIVE
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Currently Borrowed
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-1">
                {stats.borrowed}
              </p>
              <p className="text-xs text-gray-500">Books with readers now</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        </div>

        {/* Overdue Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                <Image
                  src="/icons/warning.svg"
                  alt="overdue"
                  width={28}
                  height={28}
                  className="brightness-0 invert"
                />
                {stats.overdue > 0 && (
                  <div className="absolute -top-2 -right-2 animate-ping bg-red-400 rounded-full w-4 h-4"></div>
                )}
              </div>
              <div className="bg-red-50 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-red-600">
                  URGENT
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Overdue Books
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-1">
                {stats.overdue}
              </p>
              <p className="text-xs text-gray-500">Needs immediate attention</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
        </div>

        {/* Returned Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/icons/tick.svg"
                  alt="returned"
                  width={28}
                  height={28}
                  className="brightness-0 invert"
                />
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-xs font-semibold text-green-600">
                  SUCCESS
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Returned Books
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-1">
                {stats.returned}
              </p>
              <p className="text-xs text-gray-500">Successfully completed</p>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
        </div>
      </div>

      {/* Borrow Records Table */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Image
                  src="/icons/admin/receipt.svg"
                  alt="table"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  All Borrow Records
                </h2>
                <p className="text-sm text-gray-500">
                  Complete transaction history
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <BorrowRecordsTable data={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowRecordsPage;
