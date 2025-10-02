"use server";

import { db } from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/actions/utils";
import { revalidatePath } from "next/cache";

export const createBook = async (params: BookParams) => {
  await requireAdmin();

  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();
    console.log("newBook is:", newBook);

    revalidatePath("/admin/books");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export async function updateBook(
  bookId: string,
  data: Partial<BookParams>
) {
  await requireAdmin();

  try {
    const updatedBook = await db
      .update(books)
      .set(data)
      .where(eq(books.id, bookId))
      .returning();

    revalidatePath("/admin/books");
    revalidatePath(`/books/${bookId}`);
    return { success: true, data: JSON.parse(JSON.stringify(updatedBook[0])) };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteBook(bookId: string) {
  await requireAdmin();

  try {
    await db.delete(books).where(eq(books.id, bookId));

    revalidatePath("/admin/books");
    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getAllBooksForAdmin() {
  await requireAdmin();

  try {
    const allBooks = await db.select().from(books).orderBy(books.createdAt);

    return { success: true, data: allBooks };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, error: "Failed to fetch books", data: [] };
  }
}
