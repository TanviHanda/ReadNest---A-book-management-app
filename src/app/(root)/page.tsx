import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import ImageUpload from "@/components/ImageUpload";
import { sampleBooks } from "@/constants";

const Home = () => {
  return (
    <>
      <BookOverview {...sampleBooks[0]} />
      <ImageUpload />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-20"
      />
    </>
  );
};
export default Home;
