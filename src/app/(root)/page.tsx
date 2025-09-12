import BookList from "@/components/BookList"
import BookOverview from "@/components/BookOverview"
import { sampleBooks } from "@/constants"

const Home = () => {
  return (
    <>
    <BookOverview {...sampleBooks[0]}/>

    <BookList
      title="Latest Books"
      books={sampleBooks}
      containerClassName="mt-20"
    />
    </>
  )
}
export default Home