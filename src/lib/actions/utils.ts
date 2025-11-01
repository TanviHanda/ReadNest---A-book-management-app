"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, borrowRecords, books, systemConfig } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

/**
 * Get the current authenticated user with full details
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return user[0] || null;
}

/**
 * Check if user is an admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.status === "BANNED") {
    throw new Error("Your account has been banned");
  }

  if (user.status === "PENDING") {
    throw new Error("Your account is pending approval, Please wait for a day or contact admin if urge");
  }

  if (user.status === "REJECTED") {
    throw new Error("Your account has been rejected");
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}


/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== "ADMIN") {
    throw new Error("Admin privileges required");
  }

  return user;
}

/**
 * Get system configuration value
 */
export async function getSystemConfig(key: string): Promise<string | null> {
  const config = await db
    .select()
    .from(systemConfig)
    .where(eq(systemConfig.key, key))
    .limit(1);

  return config[0]?.value || null;
}

/**
 * Get max books allowed to borrow (default: 5)
 */
export async function getMaxBooksAllowed(): Promise<number> {
  const value = await getSystemConfig("max_books_allowed");
  return value ? parseInt(value, 10) : 5;
}

/**
 * Check user's current borrow quota
 */
export async function getUserBorrowQuota(userId: string) {
  const maxBooks = await getMaxBooksAllowed();

  // Get count of currently borrowed books
  const borrowed = await db
    .select({ count: count() })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED")
      )
    );

  const currentlyBorrowed = borrowed[0]?.count || 0;

  return {
    maxBooks,
    currentlyBorrowed,
    remaining: maxBooks - currentlyBorrowed,
    canBorrow: currentlyBorrowed < maxBooks,
  };
}

/**
 * Get user's borrowed books with details
 */
export async function getUserBorrowedBooks(userId: string) {
  const borrowed = await db
    .select({
      id: borrowRecords.id,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
      },
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, userId))
    .orderBy(borrowRecords.borrowDate);

  return borrowed;
}

/**
 * Get all books with pagination
 */
export async function getAllBooks(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [booksList, totalCount] = await Promise.all([
    db.select().from(books).limit(limit).offset(offset),
    db.select({ count: count() }).from(books),
  ]);

  return {
    books: booksList,
    total: totalCount[0]?.count || 0,
    page,
    limit,
    totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
  };
}

/**
 * Get book by ID
 */
export async function getBookById(bookId: string) {
  const book = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId))
    .limit(1);

  return book[0] || null;
}

/**
 * Check if book is available for borrowing
 */
export async function isBookAvailable(bookId: string) {
  const book = await getBookById(bookId);
  return book && book.availableCopies > 0;
}

/**
 * Check if user has already borrowed a specific book
 */
export async function hasUserBorrowedBook(userId: string, bookId: string) {
  const record = await db
    .select()
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.status, "BORROWED")
      )
    )
    .limit(1);

  return record.length > 0;
}
