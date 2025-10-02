"use client";

import { useState, useEffect } from "react";
import { useQueryStates } from "nuqs";
import BookCard from "./BookCard";
import { Button } from "./ui/button";
import { getLibraryBooks } from "@/lib/actions/library";
import { librarySearchParams } from "@/app/(root)/library/searchParams";

interface LibraryBooksProps {
  initialBooks: Book[];
  pagination: {
    page: number;
    limit: number;
    totalBooks: number;
    totalPages: number;
    hasMore: boolean;
  };
}

const LibraryBooks = ({ initialBooks, pagination: initialPagination }: LibraryBooksProps) => {
  const [{ search, genre, sortBy }, setSearchParams] = useQueryStates(
    librarySearchParams,
    {
      shallow: false,
    }
  );
  
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset books when filters change
  useEffect(() => {
    setBooks(initialBooks);
    setPagination(initialPagination);
  }, [initialBooks, initialPagination]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = pagination.page + 1;

    try {
      const result = await getLibraryBooks({
        search,
        genre,
        sortBy,
        page: nextPage,
        limit: pagination.limit,
      });

      if (result.success && result.data) {
        // Append new books to existing ones
        setBooks((prev) => [...prev, ...result.data.books]);
        setPagination(result.data.pagination);
        
        // Update URL with new page number
        setSearchParams({ page: nextPage });
      }
    } catch (error) {
      console.error("Error loading more books:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-light-100 mb-2">
            No books found
          </h3>
          <p className="text-light-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Books Grid */}
      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>

      {/* Pagination Info and Load More */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <p className="text-light-400 text-sm">
          Showing {books.length} of {pagination.totalBooks} books
        </p>

        {pagination.hasMore && (
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="w-full sm:w-auto px-8"
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LibraryBooks;
