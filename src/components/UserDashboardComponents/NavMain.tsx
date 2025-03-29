import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { USER_DASHBOARD_SIDEBAR } from "@/lib/constantsValue";
import { Link, useLocation } from "react-router";

//isActive={item.isActive}

const NavMain = () => {
  const location = useLocation();
  return (
    <SidebarMenu className="py-3">
      {USER_DASHBOARD_SIDEBAR.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton
            asChild
            className="text-base font-medium p-6"
            isActive={location.pathname === `/user/${item.url}` || (location.pathname === "/user" && item.name === "Dashboard")}
          >
            <Link to={item.url}>
              <item.icon className="!font-normal" />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavMain;
