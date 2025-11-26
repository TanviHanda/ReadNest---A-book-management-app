import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import BookForm from "@/components/admin/forms/BookForm";
import { db } from "@/db";
import { books } from "@/db/schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EditBookPage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Fetch the book data
  const bookData = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookData.length) {
    redirect("/admin/books");
  }

  const book = bookData[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-dark-400">Edit Book</h1>
        <p className="text-slate-500 mt-1">
          Update the details for &quot;{book.title}&quot;
        </p>
      </div>

      <section className="w-full max-w-2xl">
        <BookForm type="update" book={book as Book} />
      </section>
    </div>
  );
};

export default EditBookPage;
