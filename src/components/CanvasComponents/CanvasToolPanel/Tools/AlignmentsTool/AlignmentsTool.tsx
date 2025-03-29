import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import React from 'react'

function AlignmentsTool() {
  return (
    <div className="space-y-2">
        <label className="text-sm font-medium">Alignment</label>
        <div className="flex flex-wrap gap-2">
          <ToggleGroup type={"multiple"} defaultValue={["align-left"]}>
            <ToggleGroupItem value="align-left">
              <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value="align-right">
              <AlignRight />
            </ToggleGroupItem>
            <ToggleGroupItem value="align-center">
              <AlignCenter />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
    </div>
  )
}

export default AlignmentsTool