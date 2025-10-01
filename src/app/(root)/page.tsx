import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import ImageUpload from "@/components/FileUpload";
import { sampleBooks } from "@/constants";
import { db } from "@/db";
import { users } from "@/db/schema";
const Home = async () => {
  let result = [];
  try {
    result = await db.select().from(users);
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
