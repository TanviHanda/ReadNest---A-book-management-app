"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  approveAccountRequest,
  rejectAccountRequest,
} from "@/lib/admin/actions/account-requests";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

dayjs.extend(relativeTime);

interface AccountRequest {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED" | null;
  createdAt: Date | null;
}

interface AccountRequestsTableProps {
  data: AccountRequest[];
}

export function AccountRequestsTable({ data }: AccountRequestsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const handleApprove = async (userId: string, userName: string) => {
    setProcessingId(userId);
    try {
      const result = await approveAccountRequest(userId);
      if (result.success) {
        toast.success("Account Approved!", {
          description: `${userName}'s account has been approved successfully.`,
        });
        router.refresh();
      } else {
        toast.error("Approval Failed", {
          description: result.error || "Failed to approve account",
        });
      }
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    setProcessingId(userId);
    try {
      const result = await rejectAccountRequest(userId);
      if (result.success) {
        toast.success("Account Rejected", {
          description: `${userName}'s account has been rejected.`,
        });
        router.refresh();
      } else {
        toast.error("Rejection Failed", {
          description: result.error || "Failed to reject account",
        });
      }
    } catch {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const columns: ColumnDef<AccountRequest>[] = [
    {
      accessorKey: "fullName",
      header: "Applicant",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
            {row.getValue<string>("fullName").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {row.getValue("fullName")}
            </div>
            <div className="text-xs text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "universityId",
      header: "University ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg inline-block">
          {row.getValue("universityId")}
        </div>
      ),
    },
    {
      accessorKey: "universityCard",
      header: "ID Card",
      cell: ({ row }) => {
        const cardUrl = row.getValue("universityCard") as string;
        return (
          <a
            href={cardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>View card</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="group-hover:underline">View Card</span>
          </a>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date | null;
        if (!date) return <span className="text-gray-400">-</span>;
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {dayjs(date).format("MMM DD, YYYY")}
            </div>
            <div className="text-xs text-gray-500">{dayjs(date).fromNow()}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userId = row.original.id;
        const userName = row.original.fullName;
        const isProcessing = processingId === userId;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApprove(userId, userName)}
              disabled={isProcessing}
              className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <title>Loading</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-1">✓ Approve</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleReject(userId, userName)}
              disabled={isProcessing}
              className="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <title>Loading</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-1">✕ Reject</span>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <title>Search</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          placeholder="Search by name or email..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-left">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 w-full font-semibold text-xs uppercase tracking-wider text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
                              : "flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-gray-700"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!header.column.getCanSort()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() && (
                            <Image
                              src="/icons/admin/caret-down.svg"
                              alt="sort"
                              width={14}
                              height={14}
                              className={`transition-all duration-200 ${
                                header.column.getIsSorted() === "asc"
                                  ? "rotate-180 opacity-100"
                                  : header.column.getIsSorted() === "desc"
                                    ? "opacity-100"
                                    : "opacity-40 group-hover:opacity-70"
                              }`}
                            />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <title>No requests</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          No pending account requests
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          All caught up! No new requests to review.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
