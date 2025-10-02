"use client";

import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { returnBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { useState } from "react";

dayjs.extend(relativeTime);

interface BorrowedBook {
  id: string;
  borrowDate: Date;
  dueDate: string;
  returnDate: string | null;
  status: "BORROWED" | "RETURNED";
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    coverColor: string;
  };
}

interface BorrowedBooksListProps {
  books: BorrowedBook[];
  showReturnButton?: boolean;
}

export function BorrowedBooksList({
  books,
  showReturnButton = false,
}: BorrowedBooksListProps) {
  const router = useRouter();
  const [returningId, setReturningId] = useState<string | null>(null);

  const handleReturn = async (borrowRecordId: string) => {
    setReturningId(borrowRecordId);
    try {
      const result = await returnBook(borrowRecordId);
      if (result.success) {
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch {
      alert("Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const isOverdue = (dueDate: string) => {
    return dayjs().isAfter(dayjs(dueDate));
  };

  return (
    <div className="grid gap-4">
      {books.map((item) => {
        const overdue = item.status === "BORROWED" && isOverdue(item.dueDate);

        return (
          <div
            key={item.id}
            className={`flex gap-4 p-4 border rounded-lg ${
              overdue ? "border-red-300 bg-red-50" : ""
            }`}
          >
            <div className="relative w-24 h-32 flex-shrink-0">
              <Image
                src={item.book.coverUrl}
                alt={item.book.title}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{item.book.title}</h3>
              <p className="text-gray-600 text-sm">by {item.book.author}</p>
              <p className="text-gray-500 text-sm mt-1">
                <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                  {item.book.genre}
                </span>
              </p>

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Borrowed:</span>{" "}
                  {dayjs(item.borrowDate).format("MMM D, YYYY")}
                </p>

                {item.status === "BORROWED" ? (
                  <p
                    className={
                      overdue ? "text-red-600 font-semibold" : "text-gray-600"
                    }
                  >
                    <span className="font-medium">Due:</span>{" "}
                    {dayjs(item.dueDate).format("MMM D, YYYY")}
                    {overdue && " (OVERDUE)"}
                  </p>
                ) : (
                  <p className="text-green-600">
                    <span className="font-medium">Returned:</span>{" "}
                    {item.returnDate
                      ? dayjs(item.returnDate).format("MMM D, YYYY")
                      : "N/A"}
                  </p>
                )}
              </div>

              {showReturnButton && item.status === "BORROWED" && (
                <button
                  type="button"
                  onClick={() => handleReturn(item.id)}
                  disabled={returningId === item.id}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {returningId === item.id ? "Returning..." : "Return Book"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
