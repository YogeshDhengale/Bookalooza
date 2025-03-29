import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { NAV_LINKS } from "@/lib/constantsValue";
import { EqualIcon } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Link } from "react-router"; // Correct import
import Logo from "../Logo";

interface NavLinkProps {
  name: string;
  link?: string;
  items?: { name: string; link: string }[];
}

interface MobileNavLinkProps {
  link: NavLinkProps;
  closeDrawer: () => void;
}

const MobileNavigation: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Use useCallback to prevent unnecessary re-renders
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Open menu"
          className="p-1 [&_svg]:size-8 md:hidden"
        >
          <EqualIcon className="text-app-primary" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="bg-background rounded-t-lg">
          <DrawerTitle className="flex items-center justify-center space-x-2 text-app-primary text-xl">
            <Logo />{" "}
            <Link to="/" onClick={closeDrawer}>
              Bookalooza
            </Link>
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-auto p-6 pb-10 bg-background">
          <nav className="flex flex-col text-app-primary space-y-3">
            {NAV_LINKS.map((link) => (
              <MobileNavLink
                key={link.name}
                link={link}
                closeDrawer={closeDrawer}
              />
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const MobileNavLink: React.FC<MobileNavLinkProps> = React.memo(
  ({ link, closeDrawer }) => {
    if (link.link) {
      return (
        <Link
          to={link.link}
          className="p-0 text-base hover:border-fuchsia-900 border-b-2 border-transparent"
          onClick={closeDrawer} // Close drawer on link click
        >
          {link.name}
        </Link>
      );
    }

    return (
      <div className="flex flex-col space-y-3">
        <h4 className="text-base font-medium">{link.name}</h4>
        <div className="flex flex-col space-y-2 pl-4">
          {link.items?.map((subLink) => (
            <MobileNavLink
              key={subLink.name}
              link={subLink}
              closeDrawer={closeDrawer}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default MobileNavigation;
