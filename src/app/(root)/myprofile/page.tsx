import {
  requireAuth,
  getUserBorrowedBooks,
  getUserBorrowQuota,
} from "@/lib/actions/utils";
import { BorrowedBooksList } from "@/components/BorrowedBooksList";
import { LogoutButton } from "@/components/LogoutButton";
import { logout } from "@/lib/actions/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const MyProfilePage = async () => {
  const user = await requireAuth();
  const borrowedBooks = await getUserBorrowedBooks(user.id);
  const quota = await getUserBorrowQuota(user.id);

  // Separate active and returned books
  const activeBooks = borrowedBooks.filter((b) => b.status === "BORROWED");
  const returnedBooks = borrowedBooks.filter((b) => b.status === "RETURNED");

  return (
    <div className="w-full p-6 space-y-8">
      {/* User Profile Header */}
      <section className="bg-white rounded-2xl p-7 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{user.fullName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">University ID: {user.universityId}</p>
          </div>
          <LogoutButton onLogout={logout} />
        </div>

        {/* Borrow Quota Display */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">Borrowing Status</h3>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-3xl font-bold text-blue-600">
                {quota.currentlyBorrowed}
              </span>
              <span className="text-gray-600"> / {quota.maxBooks}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Books Currently Borrowed</p>
              {quota.canBorrow ? (
                <p className="text-sm text-green-600">
                  You can borrow {quota.remaining} more book
                  {quota.remaining !== 1 ? "s" : ""}
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  Borrowing limit reached. Please return a book first.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Currently Borrowed Books */}
      <section className="bg-white rounded-2xl p-7 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Currently Borrowed Books</h2>
        {activeBooks.length > 0 ? (
          <BorrowedBooksList books={activeBooks} showReturnButton />
        ) : (
          <p className="text-gray-500 py-4">
            You haven't borrowed any books yet.
          </p>
        )}
      </section>

      {/* Borrow History */}
      <section className="bg-white rounded-2xl p-7 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Borrow History</h2>
        {returnedBooks.length > 0 ? (
          <BorrowedBooksList books={returnedBooks} showReturnButton={false} />
        ) : (
          <p className="text-gray-500 py-4">No borrowing history yet.</p>
        )}
      </section>
    </div>
  );
};

export default MyProfilePage;
