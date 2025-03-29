// components/NavLink.tsx
import React from "react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface props {
  link:
    | {
        name: string;
        link: string;
        items?: undefined;
      }
    | {
        name: string;
        items: {
          name: string;
          link: string;
        }[];
        link?: undefined;
      };
  className?: string;
}

const NavLink = ({ link, className }: props) => {
  if (link.link) {
    return (
      <Link
        to={link.link}
        className={cn(
          "p-0 text-sm font-medium hover:border-fuchsia-900 border-b-2 border-transparent",
          className
        )}
      >
        {link.name}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
        <span
          className={cn(
            "text-app-primary flex items-center gap-1 p-0 text-sm font-medium hover:border-app-primary border-b-2 border-transparent",
            className
          )}
        >
          {link.name} <ChevronDown className="text-app-primary w-4 h-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max min-w-28 bg-white !m-0 p-2 rounded-md shadow-md border border-gray-200">
        {link.items?.map((item) => (
          <DropdownMenuItem
            key={item.link}
            className="px-2 py-1 text-app-primary flex items-center gap-1 bg-white text-sm font-medium hover:bg-orange-300 rounded-sm border-b-2 border-transparent"
          >
            <Link to={item.link}>{item.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavLink;
