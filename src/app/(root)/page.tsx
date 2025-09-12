import BookOverview from "@/components/BookOverview"
import BookList from "@/components/BookList"
import { sampleBooks } from "@/constants"

const Home = () => {
  return (
    <>
    <BookOverview {...sampleBooks[0]}/>
    <BookList
      title="Latest Books"
      books={sampleBooks}
      containerClassName="mt-26"
    />
    </>
  )
}
export default Home