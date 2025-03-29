import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function FontsTool() {
  return (
    <>
    {/* Font family */}
    <div className="space-y-2">
      <label className="text-sm font-medium">Font</label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="helvetica">Helvetica</SelectItem>
        </SelectContent>
      </Select>
    </div>
    {/* Font Size */}
    <div className="space-y-2">
        <label className="text-sm font-medium">Font Size</label>
        <Input type="number" defaultValue="12" className="w-full" />
      </div>
    </>

  );
}

export default FontsTool;
