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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertTriangle,
} from "lucide-react";
import { deleteBook } from "@/lib/admin/actions/book";
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

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date | null;
}

interface BooksTableProps {
  data: Book[];
}

export function BooksTable({ data }: BooksTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (book: Book) => {
    router.push(`/admin/books/${book.id}/edit`);
  };

  const handleDelete = async (bookId: string) => {
    setDeletingId(bookId);
    try {
      const result = await deleteBook(bookId);

      if (result.success) {
        toast.success("Book deleted successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete book");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the book");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Book>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/books/${row.original.id}`}
          className="font-medium text-dark-400 hover:text-primary-admin hover:underline transition-colors"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <div className="text-slate-600">{row.getValue("author")}</div>
      ),
    },
    {
      accessorKey: "genre",
      header: "Genre",
      cell: ({ row }) => (
        <div className="text-slate-600">{row.getValue("genre")}</div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return (
          <div className="flex items-center gap-1">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{rating}/5</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalCopies",
      header: "Total Copies",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("totalCopies")}
        </div>
      ),
    },
    {
      accessorKey: "availableCopies",
      header: "Available",
      cell: ({ row }) => {
        const available = row.getValue("availableCopies") as number;
        const total = row.getValue("totalCopies") as number;
        const isLow = available < total * 0.3;
        return (
          <div
            className={`text-center font-semibold ${isLow ? "text-red-600" : "text-green-600"}`}
          >
            {available}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const book = row.original;
        const isDeleting = deletingId === book.id;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(book)}
              disabled={isDeleting}
              className="h-8 gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                  className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-7 w-7 text-red-600" />
                  </div>
                  <AlertDialogTitle className="text-center">
                    Delete Book
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-dark-400">
                      "{book.title}"
                    </span>
                    ? This action cannot be undone and will permanently remove
                    the book from the library.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center gap-3">
                  <AlertDialogCancel className="min-w-[100px]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(book.id)}
                    className="min-w-[100px] bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
      {/* Search Filter */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="pl-9 bg-white border-slate-200"
        />
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
                  No books found.
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
