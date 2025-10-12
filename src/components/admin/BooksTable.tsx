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
import { toast } from "sonner";
import { deleteBook } from "@/lib/admin/actions/book";

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
    // TODO: Implement edit modal or redirect to edit page
    console.log("Edit book:", book);
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

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
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "genre",
      header: "Genre",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number;
        return <div>{rating}/5</div>;
      },
    },
    {
      accessorKey: "totalCopies",
      header: "Total Copies",
    },
    {
      accessorKey: "availableCopies",
      header: "Available",
      cell: ({ row }) => {
        const available = row.getValue("availableCopies") as number;
        const total = row.getValue("totalCopies") as number;
        const isLow = available < total * 0.3;
        return (
          <div className={isLow ? "text-red-600 font-semibold" : ""}>
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
            <button
              type="button"
              onClick={() => handleEdit(book)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isDeleting}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(book.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
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
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="px-3 py-2 border rounded-md w-full max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-2"
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
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
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
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
