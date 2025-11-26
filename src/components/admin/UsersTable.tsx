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
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { banUser, approveUser, rejectUser } from "@/lib/admin/actions/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Ban,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BANNED" | null;
  role: "USER" | "ADMIN" | null;
  lastActivityDate: string | null;
  createdAt: Date | null;
}

interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (
    userId: string,
    action: "ban" | "approve" | "reject",
  ) => {
    setLoadingAction(`${userId}-${action}`);
    try {
      let result: { success: boolean; data?: unknown; error?: string };
      if (action === "ban") result = await banUser(userId);
      else if (action === "approve") result = await approveUser(userId);
      else result = await rejectUser(userId);

      if (result.success) {
        const messages = {
          ban: "User has been banned",
          approve: "User has been approved",
          reject: "User has been rejected",
        };
        toast.success(messages[action]);
        router.refresh();
      } else {
        toast.error(result.error || "Action failed");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred");
    } finally {
      setLoadingAction(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-dark-400">
          {row.getValue("fullName")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-slate-600">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "universityId",
      header: "University ID",
      cell: ({ row }) => (
        <div className="font-mono text-slate-600">
          {row.getValue("universityId")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colors: Record<string, string> = {
          PENDING: "bg-amber-100 text-amber-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          BANNED: "bg-slate-800 text-white",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || ""}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <span
            className={
              role === "ADMIN"
                ? "font-semibold text-primary-admin"
                : "text-slate-600"
            }
          >
            {role}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "ADMIN") {
          return (
            <span className="text-slate-400 text-sm italic">Protected</span>
          );
        }

        const isLoading = (action: string) =>
          loadingAction === `${user.id}-${action}`;

        return (
          <div className="flex gap-2">
            {user.status !== "APPROVED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(user.id, "approve")}
                disabled={loadingAction !== null}
                className="h-8 gap-1 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {isLoading("approve") ? "..." : "Approve"}
              </Button>
            )}

            {user.status !== "REJECTED" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingAction !== null}
                    className="h-8 gap-1 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                      <AlertTriangle className="h-7 w-7 text-orange-600" />
                    </div>
                    <AlertDialogTitle className="text-center">
                      Reject User
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      Are you sure you want to reject{" "}
                      <span className="font-semibold text-dark-400">
                        {user.fullName}
                      </span>
                      ? They will not be able to access the library.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center gap-3">
                    <AlertDialogCancel className="min-w-[100px]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(user.id, "reject")}
                      className="min-w-[100px] bg-orange-600 hover:bg-orange-700"
                    >
                      Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {user.status !== "BANNED" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingAction !== null}
                    className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    Ban
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                      <ShieldAlert className="h-7 w-7 text-red-600" />
                    </div>
                    <AlertDialogTitle className="text-center">
                      Ban User
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      Are you sure you want to ban{" "}
                      <span className="font-semibold text-dark-400">
                        {user.fullName}
                      </span>
                      ? This will permanently prevent them from accessing the
                      library.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center gap-3">
                    <AlertDialogCancel className="min-w-[100px]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(user.id, "ban")}
                      className="min-w-[100px] bg-red-600 hover:bg-red-700"
                    >
                      Ban User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Filter by name..."
            value={
              (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("fullName")?.setFilterValue(e.target.value)
            }
            className="pl-9 bg-white border-slate-200"
          />
        </div>
        <select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table
              .getColumn("status")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-admin focus:ring-offset-2"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-slate-700"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-2 hover:text-primary-admin transition-colors"
                            : "flex items-center gap-2"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        disabled={!header.column.getCanSort()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
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
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-slate-600">
          Page{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of <span className="font-medium">{table.getPageCount()}</span>
        </span>
      </div>
    </div>
  );
}
