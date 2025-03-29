import { cn } from "@/lib/utils";
import React from "react";

const SectionHeading = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "text-4xl text-center font-bold text-white",
        className
      )}
    >
      {title}
    </h2>
  );
};

export default SectionHeading;
