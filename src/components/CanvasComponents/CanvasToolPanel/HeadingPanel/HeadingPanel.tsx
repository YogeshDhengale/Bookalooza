import { Input } from "@/components/ui/input";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import React from "react";
import AlignmentsTool from "../Tools/AlignmentsTool/AlignmentsTool";
import ColorsTool from "../Tools/ColorsTool/ColorsTool";
import FontsTool from "../Tools/FontsTool/FontsTool";
import FontStyleTool from "../Tools/FontStyleTool/FontStyleTool";

const HeadingPanel = () => {
  return (
    <SidebarContent className="bg-white">
      <SidebarGroup className="px-0">
        <SidebarGroupContent className="space-y-3 p-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text</label>
            <Input
              type="text"
              placeholder="Type you text here"
              className="w-full"
            />
          </div>

          {/* Font style */}
          <FontsTool />
          <FontStyleTool />

          {/* Alignment */}
          <AlignmentsTool />

          {/* Color Picker */}
          <ColorsTool />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

HeadingPanel.Header = () => {
  return <></>;
};

export default HeadingPanel;
