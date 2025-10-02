"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
  alreadyBorrowed?: boolean;
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
  alreadyBorrowed = false,
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrowBook = async () => {
    if (!isEligible) {
      toast.error(message);
      return;
    }
    setBorrowing(true);
    try {
      const result = await borrowBook({ userId, bookId });

      if (result.success) {
        // show success toast first so user sees feedback, then navigate
        toast.success("Book borrowed successfully.");

        // give the toast a moment to appear before navigating
        router.push("/myprofile");
      }

      // If the server returned success: false, show the error
      if (!result.success && result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("An error occurred while borrowing the book.");
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <div>
      <Button
        className="book-overview_btn"
        onClick={handleBorrowBook}
        disabled={borrowing || alreadyBorrowed || !isEligible}
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-500">
          {borrowing
            ? "Borrowing..."
            : alreadyBorrowed
              ? "Borrowed"
              : "Borrow Book"}
        </p>
      </Button>
    </div>
  );
};

export default BorrowBook;
