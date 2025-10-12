"use server";

import { db } from "@/db";
import { books, borrowRecords, users } from "@/db/schema";
import { count, eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";

export async function getDashboardStats() {
  await requireAdmin();

  try {
    // Get total books count
    const [{ value: totalBooks }] = await db
      .select({ value: count() })
      .from(books);

    // Get total available copies
    const [{ totalAvailable }] = await db
      .select({
        totalAvailable: sql<number>`sum(${books.availableCopies})`,
      })
      .from(books);

    // Get currently borrowed books count
    const [{ value: borrowedBooks }] = await db
      .select({ value: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    // Get total users count
    const [{ value: totalUsers }] = await db
      .select({ value: count() })
      .from(users);

    // Get pending approval requests
    const [{ value: pendingRequests }] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.status, "PENDING"));

    // Get active users (approved)
    const [{ value: activeUsers }] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.status, "APPROVED"));

    return {
      success: true,
      data: {
        totalBooks,
        borrowedBooks,
        availableBooks: Number(totalAvailable) || 0,
        totalUsers,
        pendingRequests,
        activeUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard statistics",
    };
  }
}

export async function getRecentActivities(limit = 10) {
  await requireAdmin();

  try {
    const activities = await db
      .select({
        id: borrowRecords.id,
        userName: users.fullName,
        bookTitle: books.title,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(limit);

    return {
      success: true,
      data: activities,
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return {
      success: false,
      error: "Failed to fetch recent activities",
      data: [],
    };
  }
}

export async function getBorrowingTrends(days = 30) {
  await requireAdmin();

  try {
    const trends = await db
      .select({
        date: sql<string>`DATE(${borrowRecords.borrowDate})`,
        borrowed: count(),
      })
      .from(borrowRecords)
      .where(
        sql`${borrowRecords.borrowDate} >= NOW() - INTERVAL '${sql.raw(days.toString())} days'`
      )
      .groupBy(sql`DATE(${borrowRecords.borrowDate})`)
      .orderBy(sql`DATE(${borrowRecords.borrowDate})`);

    return {
      success: true,
      data: trends,
    };
  } catch (error) {
    console.error("Error fetching borrowing trends:", error);
    return {
      success: false,
      error: "Failed to fetch borrowing trends",
      data: [],
    };
  }
}
