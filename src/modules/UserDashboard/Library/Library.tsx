import React, { Suspense, useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import { fetchAllUsersBooks } from "@/actions/BookAction/BookAction";
import TabsController from "@/components/TabsController/TabsController";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const LibraryBookListing = React.lazy(
  () =>
    import("@/components/UserDashboardComponents/Library/LibraryBookListing")
);

const tabs = [
  { title: "Draft", value: "draft" },
  { title: "Review", value: "review" },
  { title: "Published", value: "published" },
];

const Library: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publishedBooks, reviewBooks, draftBooks, isUserBooksFetched } =
    useAppSelector((state) => state.books);
  const { user } = useAppSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

  useEffect(() => {
    if (!isUserBooksFetched && user?.userId) {
      fetchAllUsersBooks(dispatch, user?.userId);
    }
  }, [dispatch, isUserBooksFetched, user?.userId]);

  const activeTabIndex = useMemo(
    () => tabs.findIndex((tab) => tab.value === activeTab),
    [activeTab]
  );

  return (
    <DashboardLayout title="Library" subtitle="Manage all your books here.">
      <div className="space-y-6">
        <TabsController tabs={tabs} handelActiveTabChange={setActiveTab} />
      </div>
      <div className="size-full flex-1 relative overflow-hidden border border-app-dark p-3 mt-6 rounded-lg">
        <div
          className="w-[300%] h-full absolute top-0 left-0 flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${activeTabIndex * (100 / tabs.length)}%)`,
          }}
        >
          <Suspense
            fallback={
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <Skeleton key={idx} className="w-full h-56" />
                ))}
              </div>
            }
          >
            <LibraryBookListing books={draftBooks} />
            <LibraryBookListing books={reviewBooks} />
            <LibraryBookListing books={publishedBooks} />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Library;
