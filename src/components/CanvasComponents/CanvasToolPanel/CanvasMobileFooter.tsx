import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NavItem, PANEL_ITEMS } from "@/lib/constantsValue";

function CanvasMobileFooter() {
  const [activeItem, setActiveItem] = React.useState<NavItem>(PANEL_ITEMS[0]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulate a 3-second delay
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null; // Simulate the loading state
  }
  return (
    <div className="w-dvw h-max box-border bottom-0 gap-4 bg-slate-200 p-2">
      <Drawer>
        <div className="w-full overflow-auto flex gap-4 bg-white rounded-sm p-2">
          {PANEL_ITEMS.map((item: NavItem) => (
            <DrawerTrigger  asChild onClick={() => setActiveItem(item)}>
              <Button
                variant="ghost"
                className="flex flex-col text-sm h-12 items-center gap-1 p-2 "
              >
                <item.icon />
                {item.title}
              </Button>
            </DrawerTrigger>
          ))}
        </div>
        <DrawerContent className="h-[calc(100dvh-100px)]">
          <DrawerHeader className="gap-3.5 border-b p-4 bg-white rounded-t-lg">
            <DrawerTitle>{activeItem.title}</DrawerTitle>
            {activeItem.component.Header &&
              React.createElement(activeItem.component.Header)}
          </DrawerHeader>
          <activeItem.component />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default CanvasMobileFooter;
