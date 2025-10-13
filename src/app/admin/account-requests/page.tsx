import {
  getAllAccountRequests,
  getAccountRequestsStats,
} from "@/lib/admin/actions/account-requests";
import { AccountRequestsTable } from "@/components/admin/AccountRequestsTable";
import Image from "next/image";

const AccountRequestsPage = async () => {
  const [requestsResult, statsResult] = await Promise.all([
    getAllAccountRequests(),
    getAccountRequestsStats(),
  ]);

  if (!requestsResult.success || !statsResult.success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load account requests. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = statsResult.data ?? {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  };
  const requests = requestsResult.data ?? [];

  return (
    <div className="admin-container min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header with Gradient */}
      <div className="admin-header relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Image
                src="/icons/admin/user.svg"
                alt="requests"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Account Requests
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Review and approve new user registrations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 px-6">
        {/* Pending Requests Card */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-500 p-2.5 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <title>Pending</title>
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <div className="bg-amber-100 px-2.5 py-1 rounded-md">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                  NEEDS ACTION
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Pending Requests
              </p>
              <p className="text-5xl font-bold text-gray-900">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500">Awaiting your review</p>
            </div>
          </div>
          <div className="h-1 bg-amber-500"></div>
        </div>

        {/* Approved Card */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-500 p-2.5 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <title>Approved</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="bg-emerald-100 px-2.5 py-1 rounded-md">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                  APPROVED
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Approved Accounts
              </p>
              <p className="text-5xl font-bold text-emerald-600">
                {stats.approved}
              </p>
              <p className="text-xs text-gray-500">Active users</p>
            </div>
          </div>
          <div className="h-1 bg-emerald-500"></div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-red-500 p-2.5 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <title>Rejected</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="bg-red-100 px-2.5 py-1 rounded-md">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                  REJECTED
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Rejected Accounts
              </p>
              <p className="text-5xl font-bold text-red-600">
                {stats.rejected}
              </p>
              <p className="text-xs text-gray-500">Not approved</p>
            </div>
          </div>
          <div className="h-1 bg-red-500"></div>
        </div>

        {/* Total Card */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-indigo-500 p-2.5 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <title>Total</title>
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="bg-indigo-100 px-2.5 py-1 rounded-md">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  TOTAL
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Requests
              </p>
              <p className="text-5xl font-bold text-indigo-600">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">All time registrations</p>
            </div>
          </div>
          <div className="h-1 bg-indigo-500"></div>
        </div>
      </div>

      {/* Account Requests Table */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Image
                  src="/icons/admin/user.svg"
                  alt="table"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pending Requests
                </h2>
                <p className="text-sm text-gray-500">
                  Review and take action on new registrations
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <AccountRequestsTable data={requests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRequestsPage;
