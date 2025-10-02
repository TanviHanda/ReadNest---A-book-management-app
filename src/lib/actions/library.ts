'use server'

import { db } from "@/db";
import { books } from "@/db/schema";
import { and, asc, count, desc, ilike, or, type SQL } from "drizzle-orm";

export interface LibraryFilters {
  search?: string;
  genre?: string;
  sortBy?: "newest" | "oldest" | "highestRated" | "available";
  page?: number;
  limit?: number;
}

export const getLibraryBooks = async (filters: LibraryFilters = {}) => {
  const {
    search = "",
    genre = "",
    sortBy = "newest",
    page = 1,
    limit = 12,
  } = filters;

  try {
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(books.title, `%${search}%`),
          ilike(books.author, `%${search}%`)
        )
      );
    }

    if (genre) {
      conditions.push(ilike(books.genre, `%${genre}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    let orderByClause: SQL;
    switch (sortBy) {
      case "oldest":
        orderByClause = asc(books.createdAt);
        break;
      case "highestRated":
        orderByClause = desc(books.rating);
        break;
      case "available":
        orderByClause = desc(books.availableCopies);
        break;
      case "newest":
      default:
        orderByClause = desc(books.createdAt);
        break;
    }

    // Get books with filters using proper Drizzle pagination
    const booksData = (await db
      .select()
      .from(books)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset)) as Book[];

    // Get total count for pagination using Drizzle's count function
    const [{ value: totalBooks }] = await db
      .select({ value: count() })
      .from(books)
      .where(whereClause);

    const totalPages = Math.ceil(totalBooks / limit);
    const hasMore = page < totalPages;

    return {
      success: true,
      data: {
        books: booksData,
        pagination: {
          page,
          limit,
          totalBooks,
          totalPages,
          hasMore,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching library books:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching books.",
    };
  }
};

export const getGenres = async () => {
  try {
    // Get distinct genres from books
    const genresData = await db
      .selectDistinct({ genre: books.genre })
      .from(books);

    const genres = genresData.map((g) => g.genre);

    return {
      success: true,
      data: genres,
    };
  } catch (error) {
    console.error("Error fetching genres:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching genres.",
    };
  }
};
