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

interface BorrowRecord {
  id: string;
  borrowDate: Date;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED";
  userName: string;
  userEmail: string;
  bookTitle: string;
  bookAuthor: string;
  isOverdue: boolean;
}

interface BorrowRecordsTableProps {
  data: BorrowRecord[];
}

export function BorrowRecordsTable({ data }: BorrowRecordsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<BorrowRecord>[] = [
    {
      accessorKey: "userName",
      header: "Borrower",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
            {row.getValue<string>("userName").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {row.getValue("userName")}
            </div>
            <div className="text-xs text-gray-500">
              {row.original.userEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "bookTitle",
      header: "Book",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <div className="font-semibold text-gray-900 truncate">
            {row.getValue("bookTitle")}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>by</span>
            <span className="font-medium">{row.original.bookAuthor}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "borrowDate",
      header: "Borrow Date",
      cell: ({ row }) => {
        const date = row.getValue("borrowDate") as Date;
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {dayjs(date).format("MMM DD, YYYY")}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(date).format("h:mm A")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = row.getValue("dueDate") as string;
        const isOverdue = row.original.isOverdue;
        return (
          <div className="text-sm">
            <div
              className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}
            >
              {dayjs(date).format("MMM DD, YYYY")}
            </div>
            {isOverdue && (
              <div className="text-xs text-red-500 font-semibold">
                Past due!
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "returnDate",
      header: "Return Date",
      cell: ({ row }) => {
        const date = row.getValue("returnDate") as string | null;
        return date ? (
          <div className="text-sm">
            <div className="font-medium text-green-600">
              {dayjs(date).format("MMM DD, YYYY")}
            </div>
            <div className="text-xs text-gray-500">
              {dayjs(date).format("h:mm A")}
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm font-medium">
            Not returned
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const isOverdue = row.original.isOverdue;

        let displayStatus = status;
        let colors = "";
        let icon = "";

        if (isOverdue) {
          displayStatus = "OVERDUE";
          colors =
            "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md";
          icon = "⚠️";
        } else if (status === "BORROWED") {
          colors =
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md";
          icon = "📖";
        } else if (status === "RETURNED") {
          colors =
            "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md";
          icon = "✓";
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${colors} transition-all duration-200 hover:scale-105`}
          >
            <span>{icon}</span>
            <span>{displayStatus}</span>
          </span>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        if (value === "overdue") return row.original.isOverdue;
        return row.getValue(id) === value.toUpperCase();
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
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
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
            placeholder="Search by borrower name..."
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(event.target.value)
            }
            className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 text-sm font-medium cursor-pointer hover:border-blue-300"
          >
            <option value="all">🔍 All Status</option>
            <option value="borrowed">📖 Borrowed</option>
            <option value="returned">✓ Returned</option>
            <option value="overdue">⚠️ Overdue</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Dropdown</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-left">
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 w-full font-semibold text-xs uppercase tracking-wider text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
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
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
                          <title>No records</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          No borrow records found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your filters
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
