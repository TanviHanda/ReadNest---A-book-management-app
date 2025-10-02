import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllBooksForAdmin, deleteBook } from "@/lib/admin/actions/book";
import { BooksTable } from "@/components/admin/BooksTable";
import { redirect } from "next/navigation";

const Page = async () => {
  const result = await getAllBooksForAdmin();

  if (!result.success) {
    redirect("/admin");
  }

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>
      <div className="mt-7 w-full overflow-hidden">
        <BooksTable
          data={result.data}
          onEdit={(book) => {
            // TODO: Implement edit modal or redirect to edit page
            console.log("Edit book:", book);
          }}
          onDelete={async (bookId) => {
            // TODO: Add confirmation dialog
            await deleteBook(bookId);
          }}
        />
      </div>
    </section>
  );
};

export default Page;
