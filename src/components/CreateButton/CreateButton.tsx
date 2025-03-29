import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router";

const CreateButton = ({
  cta = "Create Your Book Now",
  className,
}: {
  cta?: string;
  className?: string;
}) => {
  return (
    <Link to={`${window.location}newbook`} target="_blank" className={cn("primary-button", className)}>
      {cta}
    </Link>
  );
};

export default CreateButton;
