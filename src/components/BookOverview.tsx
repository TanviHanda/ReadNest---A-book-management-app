// React import not required in Next.js automatic JSX runtime
import Image from "next/image";
import BookCover from "./BookCover";
import BorrowBook from "./BorrowBook";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/auth";
import { Suspense } from "react";
import { hasUserBorrowedBook } from "@/lib/actions/utils";

const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
}: Book) => {
  const session = await auth();
  let user: typeof users.$inferSelect | null = null;
  let alreadyBorrowed = false;

  if (session?.user?.id) {
    [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    // Check if user has already borrowed this book
    if (user) {
      alreadyBorrowed = await hasUserBorrowedBook(user.id, id);
    }
  }

  const isAvailable = availableCopies > 0;
  const isApproved = user?.status === "APPROVED";
  const borrowingEligibility = {
    isEligible: isAvailable && isApproved && !alreadyBorrowed,
    // Provide the correct reason when not eligible. If eligible, leave message empty.
    message: alreadyBorrowed
      ? "You have already borrowed this book."
      : !isAvailable
        ? "Book is not available for borrowing."
        : !isApproved
          ? "Your account is not approved for borrowing books."
          : "",
  };
  console.log("userId, borrowingEligibility", user?.id, borrowingEligibility);

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>
        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>
          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        <Suspense fallback={<div>Loading...</div>}>
          {user && (
            <BorrowBook
              bookId={id}
              userId={user.id}
              borrowingEligibility={borrowingEligibility}
              alreadyBorrowed={alreadyBorrowed}
            />
          )}
        </Suspense>
      </div>
      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />
          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;
