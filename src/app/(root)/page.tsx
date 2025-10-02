import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import ImageUpload from "@/components/FileUpload";
import { db } from "@/db";
import { books } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
const Home = async () => {
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(10)) as Book[];

  return (
    <>
      {latestBooks[0] && (
        <BookOverview
          {...latestBooks[0]}
          userId={session?.user?.id as string}
        />
      )}
      <ImageUpload />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Home;
