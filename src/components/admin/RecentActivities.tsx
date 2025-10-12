interface Activity {
  id: string;
  userName: string;
  bookTitle: string;
  status: "BORROWED" | "RETURNED";
  borrowDate: Date | string;
  returnDate: Date | string | null;
  dueDate: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activities
        </h3>
        <p className="text-center text-gray-500 py-8">No recent activities</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activities
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                activity.status === "BORROWED"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {activity.status === "BORROWED" ? "📚" : "✓"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.userName}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {activity.status === "BORROWED" ? "borrowed" : "returned"}{" "}
                <span className="font-medium">"{activity.bookTitle}"</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(
                  new Date(
                    activity.status === "BORROWED"
                      ? activity.borrowDate
                      : activity.returnDate || activity.borrowDate,
                  ),
                )}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.status === "BORROWED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {activity.status === "BORROWED" ? "Borrowed" : "Returned"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
