// components/UserMenu.tsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router";
import { logout } from "@/actions/UserAction/UserAction";
import { getAuthorFallback } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const handleLogOut = () => {
    logout(dispatch, navigate);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <div className="flex items-center gap-2">
          <Avatar className="bg-fuchsia-700">
            <AvatarImage src={user?.photoURL} alt={user?.fullName} />
            <AvatarFallback className="bg-purple-800 text-white">
              {getAuthorFallback(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="items-center gap-1 p-0 text-sm font-medium hidden xl:flex">
            <span className="capitalize">{user?.fullName}</span>
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max min-w-28 bg-white !m-0 p-2 rounded-md shadow-md border border-gray-200">
        <DropdownMenuItem className="px-2 py-1 flex items-center gap-1 bg-white text-sm font-medium hover:bg-orange-300 rounded-sm border-b-2 border-transparent">
          <Link to="/user" className="flex gap-1 items-center">
            <UserRound className="w-4 h-4" /> My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1 flex items-center gap-1 bg-white text-sm font-medium hover:bg-orange-300 rounded-sm border-b-2 border-transparent">
          <Link to="/change-password" className="flex gap-1 items-center">
            <KeyRound className="w-4 h-4" /> Change Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogOut}
          className="px-2 py-1 flex items-center gap-1 bg-white text-sm font-medium hover:bg-orange-300 rounded-sm border-b-2 border-transparent"
        >
          <LogOut className="w-4 h-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
