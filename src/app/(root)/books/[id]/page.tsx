// React import not required in Next.js automatic JSX runtime
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { books } from "@/db/schema";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";

// Generate static params for all books (for SEO and static generation)
export async function generateStaticParams() {
  const allBooks = await db.select({ id: books.id }).from(books);

  return allBooks.map((book) => ({
    id: book.id,
  }));
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  return (
    <>
      {/* Render static book overview; user-specific actions are client-only */}
      <BookOverview {...bookDetails} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={`${line.slice(0, 20)}-${i}`}>{line}</p>
              ))}
            </div>
          </section>
        </div>
        {/* SIMILAR */}
      </div>
    </>
  );
};

export default Page;
