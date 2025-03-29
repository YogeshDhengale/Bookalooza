import { Button } from "@/components/ui/button";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import AlignmentsTool from "../Tools/AlignmentsTool/AlignmentsTool";
import ColorsTool from "../Tools/ColorsTool/ColorsTool";
import FontsTool from "../Tools/FontsTool/FontsTool";
import FontStyleTool from "../Tools/FontStyleTool/FontStyleTool";

const TextPanel = () => {
  return (
    <SidebarContent className="bg-white">
      <SidebarGroup className="px-0">
        <SidebarGroupContent className="space-y-3 p-3">
          <div className="space-y-2">
            <div className="items-center space-x-2">
              <label htmlFor="hindi" className="text-sm font-medium">
                हिन्दी:
              </label>
              <Checkbox id="hindi" />
            </div>
          </div>

          {/* Font style */}
          <FontsTool />
          <FontStyleTool />

          {/* Alignment */}
          <AlignmentsTool />

          {/* Color Picker */}
          <ColorsTool />

          {/* Add Textbox Button */}
          <TextPanel.Header />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

TextPanel.Header = () => {
  return (
    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
      Add Textbox
    </Button>
  );
};

export default TextPanel;
