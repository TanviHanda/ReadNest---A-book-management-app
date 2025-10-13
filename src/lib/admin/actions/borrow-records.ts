"use server";

import { db } from "@/db";
import { borrowRecords, books, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";

export async function getAllBorrowRecords() {
  await requireAdmin();

  try {
    const records = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        userName: users.fullName,
        userEmail: users.email,
        bookTitle: books.title,
        bookAuthor: books.author,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate));

    // Calculate if overdue
    const recordsWithOverdue = records.map((record) => {
      const isOverdue =
        record.status === "BORROWED" &&
        new Date(record.dueDate) < new Date();
      return {
        ...record,
        isOverdue,
      };
    });

    return { success: true, data: recordsWithOverdue };
  } catch (error) {
    console.error("Error fetching borrow records:", error);
    return { success: false, error: "Failed to fetch borrow records" };
  }
}

export async function getBorrowRecordsStats() {
  await requireAdmin();

  try {
    const [totalRecords] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(borrowRecords);

    const [currentlyBorrowed] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    const [overdue] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.status, "BORROWED"),
          sql`${borrowRecords.dueDate} < CURRENT_DATE`
        )
      );

    return {
      success: true,
      data: {
        total: totalRecords.count || 0,
        borrowed: currentlyBorrowed.count || 0,
        overdue: overdue.count || 0,
        returned: (totalRecords.count || 0) - (currentlyBorrowed.count || 0),
      },
    };
  } catch (error) {
    console.error("Error fetching borrow records stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}
