import React from "react";
import { type_static_contentItem } from "@/types/StaticScreenTypes";

const StaticContent = ({ title, description }: type_static_contentItem) => {
  return (
    <div className="static-content-wrapper">
        <div className="space-y-2">
      {title}
        </div>
      <div className="space-y-2">
        {description?.map((item, idx) => (
          <React.Fragment key={idx}>{item}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StaticContent;
