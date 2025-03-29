import React, { useEffect } from "react";
import { fetchAllUsersBooks } from "@/actions/BookAction/BookAction";
import AchievementCard from "@/components/UserDashboardComponents/Achievement/AchievementCard";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks"; // Merged custom hooks

const Achievements: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publishedBooks, isUserBooksFetched, userId } = useAppSelector(
    ({ books, user }) => ({
      publishedBooks: books.publishedBooks,
      isUserBooksFetched: books.isUserBooksFetched,
      userId: user?.user?.userId,
    })
  );

  useEffect(() => {
    if (!isUserBooksFetched && userId) {
      fetchAllUsersBooks(dispatch, userId);
    }
  }, [dispatch, isUserBooksFetched, userId]);

  return (
    <DashboardLayout
      title="Achievements"
      subtitle="See all your achievements here!"
    >
      <p className="text-muted-foreground">
        Hello, Star Author! Congratulations on publishing your books.
      </p>
      <div className="border border-app-dark p-3 rounded-lg mt-4 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-3 overflow-auto">
          {publishedBooks.map((book) => (
            <AchievementCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default React.memo(Achievements);
