import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/db";
import { books } from "@/db/schema";

const Home = async () => {
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(10)) as Book[];

  return (
    <>
      {latestBooks[0] && <BookOverview {...latestBooks[0]} />}
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Home;
