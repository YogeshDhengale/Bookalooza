import React, { useState } from "react"
import { SidebarIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { isUserLoggedIn } from "@/lib/utils"
import { useAppSelector } from "@/hooks/reduxHooks"
import CartLink from "../NavBar/Navigation/CartLink"
import NotificationLink from "../NavBar/Navigation/Notification"
import UserMenu from "../NavBar/Navigation/UserMenu"
import { Link } from "react-router"

function BookNavbar() {
  const { toggleSidebar } = useSidebar()
    const [isLoggedIn, setLoggedIn] = useState(isUserLoggedIn());
    const { user, isUserFetched } = useAppSelector((state) => state.user);
  return (
    <header className="flex justify-between sticky top-0 z-50 w-full items-center border-b bg-background bg-canvas-header text-white">
      <div className="flex h-[--header-height] items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex items-center space-x-3">
          {(isLoggedIn || user?.userId) ? (
            <>
              <CartLink />
              <NotificationLink />
              <UserMenu />
            </>
          ) : (
            <Link to="/sign-in">Login</Link>
          )}
        </div>
    </header>
  )
}

export default BookNavbar;