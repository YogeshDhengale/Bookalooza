import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Maximize2 } from "lucide-react";
import React from "react";

function CanvasFooter() {
  return (
    <footer className="sticky bottom-0 flex justify-end gap-4 p-2">
      <div className="w-48 flex items-center justify-center">
        <Slider
          // value={[Math.round(scale * 100)]}
          // onValueChange={(e) => canvasStore.updateScale(e[0] / 100)}
          max={500}
          min={50}
          step={1}
          aria-label="zoom"
        />
        {/* <span className="ml-2">{Math.round(scale * 100)}% </span> */}
      </div>
      <Button
        variant="ghost"
        className="p-3"
        name="fullscreen"
        aria-label="fullscreen"
      >
        <Maximize2 />
      </Button>
    </footer>
  );
}
export default CanvasFooter;
