import React, { FC } from "react";
import DashboardHeading from "./DashboardHeading";
import { Separator } from "../ui/separator";

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  btnCTA?: string;
  onClick?: () => void;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ title, subtitle, children, btnCTA, onClick }) => (
  <>
    <DashboardHeading title={title} subtitle={subtitle} btnCTA={btnCTA} onClick={onClick}  />
    <Separator className="w-full" />
    <div className="p-2 h-full flex flex-col flex-1 md:p-4">{children}</div>
  </>
);

export default DashboardLayout;
