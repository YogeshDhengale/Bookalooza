import React, { ElementType } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { type LucideIcon } from "lucide-react";

function OptionDropdownMenu({
  Icon,
  options,
}: {
  Icon: LucideIcon;
  options: {
    title: string;
    onClick?: () => void;
    className?: string;
    icon: LucideIcon | ElementType;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-7 w-7 dark:text-white">
          <Icon className="h-7 w-7 rotate-0 scale-100 transition-all" />
          <span className="sr-only">{}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {options.map((opt, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={opt.onClick}
            className={opt.className}
          >
            <opt.icon color="#000" /> {opt.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OptionDropdownMenu;
