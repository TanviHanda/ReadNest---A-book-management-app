import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import ImageUpload from "@/components/ImageUpload";
import { sampleBooks } from "@/constants";
import { db } from "@/db";
import { users } from "@/db/schema";
const Home = async () => {
  let result = [];
  try {
    // Attempt to fetch users; if the DB is unavailable this will throw and
    // we'll fall back to an empty array so the page can still render.
    // Keep the query but guard it to avoid runtime crashes in dev.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result = await db.select().from(users);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    // Log a helpful error so you can inspect connection problems without
    // the entire page failing.
    // eslint-disable-next-line no-console
    console.error("DB query failed:", err);
    result = [];
  }

  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <ImageUpload />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Home;
