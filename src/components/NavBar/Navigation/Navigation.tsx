// components/Navigation.tsx
import React from "react";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";
import { NAV_LINKS } from "@/lib/constantsValue";

const Navigation = () => (
  <div className="hidden md:flex items-center gap-4 uppercase">
    {NAV_LINKS.map((link) => (
      <NavLink
        key={link.name}
        link={link}
        className={cn(link.link === "/contact" && "hidden lg:block")}
      />
    ))}
  </div>
);

export default Navigation;