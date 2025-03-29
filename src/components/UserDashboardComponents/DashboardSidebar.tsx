import React, { useMemo } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import NavMain from "./NavMain";
import { getAuthorFallback } from "@/lib/utils";
import { useAppSelector } from "@/hooks/reduxHooks";


const DashboardSidebar = ({
    ...props
}: React.ComponentProps<typeof Sidebar>) => {
    const sidebarStyles = useMemo(() => ({
       "--sidebar-width": "17rem",
     } as React.CSSProperties), []);

    const {user} = useAppSelector((state) => state.user)

  return (
    <Sidebar
      {...props}
      collapsible="none"
      className="min-h-[calc(100lvh-85px)] hidden md:flex text-white"
      style={sidebarStyles}
    >
      <SidebarHeader className="p-4 border-b-2">
        <div className="flex items-center justify-center gap-3">
          <Avatar className="size-10 rounded-lg">
            <AvatarImage src={user?.photoURL} alt={user?.fullName} />
            <AvatarFallback className="rounded-lg bg-app text-white">{getAuthorFallback(user?.fullName)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-lg leading-tight">
            <span className="truncate font-semibold">{user?.fullName}</span>
            <span className="truncate text-sm">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
