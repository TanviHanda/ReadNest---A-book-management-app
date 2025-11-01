import {
  getUserBorrowedBooks,
  getUserBorrowQuota,
  requireUser,
} from "@/lib/actions/utils";
import { BorrowedBooksList } from "@/components/BorrowedBooksList";
import { LogoutButton } from "@/components/LogoutButton";
import { logout } from "@/lib/actions/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "APPROVED":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      };
    case "PENDING":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending Review",
      };
    case "REJECTED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Application Rejected",
      };
    case "BANNED":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Account Banned",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: status,
      };
  }
};

const MyProfilePage = async () => {
  const user = await requireUser();
  const borrowedBooks = await getUserBorrowedBooks(user.id);
  const quota = await getUserBorrowQuota(user.id);

  // Separate active and returned books
  const activeBooks = borrowedBooks.filter((b) => b.status === "BORROWED");
  const returnedBooks = borrowedBooks.filter((b) => b.status === "RETURNED");

  const statusStyle = getStatusBadgeStyle(user.status || "APPROVED");
  const isApproved = user.status === "APPROVED";

  return (
    <div className="w-full p-6 space-y-8">
      {/* User Profile Header */}
      <section className="bg-white rounded-2xl p-7 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
            </div>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">University ID: {user.universityId}</p>
          </div>
          <LogoutButton onLogout={logout} />
        </div>

        {/* Status Alert for Non-Approved Users */}
        {!isApproved && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">
              {user.status === "PENDING" &&
                "Your account is pending review. You cannot borrow or return books until your application is approved."}
              {user.status === "REJECTED" &&
                "Your application has been rejected. Please contact the library administrator for more information."}
              {user.status === "BANNED" &&
                "Your account has been banned. You cannot borrow or return books. Please contact the administrator."}
            </p>
          </div>
        )}

        {/* Borrow Quota Display */}
        <div
          className={`mt-6 p-4 rounded-lg ${isApproved ? "bg-blue-50" : "bg-gray-50"}`}
        >
          <h3 className="font-semibold text-lg mb-2">Borrowing Status</h3>
          <div className="flex items-center gap-4">
            <div>
              <span
                className={`text-3xl font-bold ${isApproved ? "text-blue-600" : "text-gray-400"}`}
              >
                {quota.currentlyBorrowed}
              </span>
              <span className="text-gray-600"> / {quota.maxBooks}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Books Currently Borrowed</p>
              {isApproved ? (
                quota.canBorrow ? (
                  <p className="text-sm text-green-600">
                    You can borrow {quota.remaining} more book
                    {quota.remaining !== 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    Borrowing limit reached. Please return a book first.
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-500">
                  Borrowing disabled until account is approved
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
          <BorrowedBooksList
            books={activeBooks}
            showReturnButton={isApproved}
          />
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
