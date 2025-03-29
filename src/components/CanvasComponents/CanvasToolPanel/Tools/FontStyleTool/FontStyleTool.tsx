import React from 'react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from 'lucide-react';

function FontStyleTool() {
  return (
    <div className="space-y-2">
        <label className="text-sm font-medium">Style</label>
        <div className="flex gap-2">
          <ToggleGroup type={"multiple"} defaultValue={["bold"]}>
            <ToggleGroupItem value="bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
  )
}

export default FontStyleTool