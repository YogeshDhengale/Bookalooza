import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Redo2, Trash2, Undo2 } from "lucide-react";

function CanvasNavbar() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 w-full overflow-hidden flex shrink-0 items-center gap-2 border-b bg-background p-2">
      {!isMobile && <SidebarTrigger className="-ml-1" />}
      <Separator orientation="vertical" />
      <Button size="sm" variant="ghost" className="p-2" name="undo" aria-label="undo">
        <Undo2 />
      </Button>
      <Button size="sm" variant="ghost" className="p-2" name="redo" aria-label="redo">
        <Redo2 />
      </Button>
      <Separator orientation="vertical" />
      <Button size="sm" variant="ghost" className="p-2" name="copy" aria-label="copy">
        <Copy />
      </Button>
      <Button size="sm" variant="ghost" className="p-2" name="delete" aria-label="delete">
        <Trash2 />
      </Button>
    </header>
  );
}

export default CanvasNavbar;
