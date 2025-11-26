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
        <div className="flex items-center gap-2">
          <div className="bg-light-300 text-primary-admin w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {row.getValue<string>("userName").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-900">
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
          <div className="font-semibold text-sm text-gray-900 truncate">
            {row.getValue("bookTitle")}
          </div>
          <div className="text-xs text-gray-500">
            by {row.original.bookAuthor}
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
          <div className="text-sm text-gray-900">
            {dayjs(date).format("MMM DD, YYYY")}
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
              <div className="text-xs text-red-600 font-semibold">Past due</div>
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
          <div className="text-sm font-medium text-green-600">
            {dayjs(date).format("MMM DD, YYYY")}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not returned</span>
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
        let bgColor = "";
        let textColor = "";

        if (isOverdue) {
          displayStatus = "OVERDUE";
          bgColor = "bg-red-100";
          textColor = "text-red-800";
        } else if (status === "BORROWED") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-800";
        } else if (status === "RETURNED") {
          bgColor = "bg-green-100";
          textColor = "text-green-800";
        }

        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {displayStatus}
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
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <input
            placeholder="Search by borrower name..."
            value={
              (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("userName")?.setFilterValue(event.target.value)
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-admin focus:border-transparent transition-all text-sm"
          />
        </div>

        <select
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-admin focus:border-transparent bg-white text-sm font-medium cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-light-300 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? "flex items-center gap-1 font-semibold text-gray-700 hover:text-primary-admin transition-colors"
                            : "flex items-center gap-1 font-semibold text-gray-700"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-xs text-gray-400">
                            {header.column.getIsSorted() === "asc"
                              ? "↑"
                              : header.column.getIsSorted() === "desc"
                                ? "↓"
                                : "⇅"}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-light-300/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
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
                <td colSpan={columns.length} className="text-center py-8">
                  <p className="text-gray-500">No borrow records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
