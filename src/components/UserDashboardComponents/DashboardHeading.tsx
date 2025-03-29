import React, { FC, memo } from "react";
import { Button } from "../ui/button";

interface DashboardHeadingProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
  btnCTA?: string;
}

const DashboardHeading: FC<DashboardHeadingProps> = ({
  title,
  subtitle,
  onClick,
  btnCTA = "Create your book now",
}) => {
  return (
    <div className="flex gap-1 flex-col md:flex-row flex-wrap justify-between w-full h-max">
      <div className="p-2 md:p-4 flex-1">
        <h1 className="text-2xl font-bold text-app">{title}</h1>
        <p className="text-base text-muted-foreground">{subtitle}</p>
      </div>
      {onClick && btnCTA && (
        <div className="flex items-center w-fit mb-4">
          <Button onClick={onClick} className="h-max w-max flex-1">
            {btnCTA}
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(DashboardHeading);
