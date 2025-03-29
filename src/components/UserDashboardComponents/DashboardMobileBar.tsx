import { USER_DASHBOARD_SIDEBAR } from "@/lib/constantsValue";
import { cn } from "@/lib/utils";
import React from "react";
import { Link, useLocation } from "react-router";

const DashboardMobileBar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className="fixed bottom-3 left-0 z-10 w-full px-4 md:hidden">
      <div className="w-full">
        <div className="flex items-center justify-start w-full overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          <div className="flex items-center gap-2 p-2 bg-sidebar w-max justify-between rounded-full">
            {USER_DASHBOARD_SIDEBAR.map((item) => {
              const isActive = location.pathname === `/user/${item.url}` || (location.pathname === "/user" && item.name === "Dashboard");
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className={cn(
                    "text-white flex flex-col items-center justify-center p-2 rounded-full min-w-12",
                    isActive && "bg-sidebar-accent"
                  )}
                  aria-label={item.name}
                >
                  <item.icon className="size-6" />
                  <span className="text-xs mt-1 hidden">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileBar;
