import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";

const page = () => {
  return (
    <div>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>logout</Button>
      </form>

      <BookList title="Borrowed Books" books={sampleBooks} />
    </div>
  );
};

export default page;
