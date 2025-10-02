'use server'

import { db } from "@/db";
import { books, borrowRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { requireAuth, getUserBorrowQuota } from "./utils";


export const borrowBook = async (params: BorrowBookParams) => {
    const { bookId, userId } = params;

    try{
        // Verify authentication
        const user = await requireAuth();
        
        if (user.id !== userId) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        // Check user's borrow quota
        const quota = await getUserBorrowQuota(userId);
        
        if (!quota.canBorrow) {
            return {
                success: false,
                error: `You have reached your borrowing limit of ${quota.maxBooks} books. Please return a book before borrowing another.`,
            };
        }

        // Check if book exists and is available
        const bookRows = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        if (!bookRows.length) {
            return { success: false, error: "Book not found." };
        }

        const currentAvailable = bookRows[0].availableCopies;

        if (currentAvailable <= 0) {
            return { success: false, error: "Book is not available for borrowing." };
        }

        // Update available copies
        const newAvailable = currentAvailable - 1;
        const updated = await db
            .update(books)
            .set({ availableCopies: newAvailable })
            .where(eq(books.id, bookId))
            .returning({ availableCopies: books.availableCopies });

        if (!updated.length) {
            return {
                success: false,
                error: "Failed to reserve the book for borrowing.",
            };
        }

        const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

        const record = await db
            .insert(borrowRecords)
            .values({ userId, bookId, dueDate, status: "BORROWED" })
            .returning();

        if (!record.length) {
            // Restore availableCopies
            try {
                await db.update(books).set({ availableCopies: currentAvailable }).where(eq(books.id, bookId));
            } catch (restoreErr) {
                console.error("Failed to restore availableCopies:", restoreErr);
            }

            return {
                success: false,
                error: "Failed to create borrow record.",
            };
        }

        return { success: true, data: record[0] };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred while borrowing the book."
        };
    }
}

export const returnBook = async (borrowRecordId: string) => {
    try {
        const user = await requireAuth();

        // Get borrow record
        const record = await db
            .select()
            .from(borrowRecords)
            .where(eq(borrowRecords.id, borrowRecordId))
            .limit(1);

        if (!record.length) {
            return { success: false, error: "Borrow record not found." };
        }

        if (record[0].userId !== user.id && user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized." };
        }

        if (record[0].status === "RETURNED") {
            return { success: false, error: "Book already returned." };
        }

        // Update borrow record
        await db
            .update(borrowRecords)
            .set({ 
                status: "RETURNED",
                returnDate: dayjs().format("YYYY-MM-DD")
            })
            .where(eq(borrowRecords.id, borrowRecordId));

        // Increment available copies
        const currentBook = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, record[0].bookId))
            .limit(1);

        if (currentBook.length) {
            await db
                .update(books)
                .set({ availableCopies: currentBook[0].availableCopies + 1 })
                .where(eq(books.id, record[0].bookId));
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred while returning the book."
        };
    }
}