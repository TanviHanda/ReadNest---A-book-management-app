import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { getLibraryBooks, getGenres } from "@/lib/actions/library";
import LibraryFilters from "@/components/LibraryFilters";
import LibraryBooks from "@/components/LibraryBooks";
import { searchParamsCache } from "./searchParams";

interface LibraryPageProps {
  searchParams: Promise<SearchParams>;
}

const LibraryPage = async ({ searchParams }: LibraryPageProps) => {
  // Parse search params using nuqs
  const { search, genre, sortBy, page } =
    await searchParamsCache.parse(searchParams);

  // Fetch books with filters
  const booksResult = await getLibraryBooks({
    search,
    genre,
    sortBy,
    page,
    limit: 12,
  });

  // Fetch available genres
  const genresResult = await getGenres();

  if (!booksResult.success || !booksResult.data) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bebas-neue text-5xl text-light-100 mb-8">
            Library
          </h1>
          <p className="text-light-400">
            Error loading books. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { books, pagination } = booksResult.data;
  const genres = genresResult.success ? genresResult.data || [] : [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas-neue text-5xl text-light-100 mb-2">
            Library
          </h1>
          <p className="text-light-400">
            Browse our collection of {pagination.totalBooks} books
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Suspense
            fallback={<div className="text-light-400">Loading filters...</div>}
          >
            <LibraryFilters genres={genres} />
          </Suspense>
        </div>

        {/* Books Grid */}
        <Suspense
          fallback={<div className="text-light-400">Loading books...</div>}
        >
          <LibraryBooks initialBooks={books} pagination={pagination} />
        </Suspense>
      </div>
    </div>
  );
};

export default LibraryPage;
