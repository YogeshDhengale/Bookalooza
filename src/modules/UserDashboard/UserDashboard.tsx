import React from "react";
import { Outlet, useLocation } from "react-router";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardMobileBar from "@/components/UserDashboardComponents/DashboardMobileBar";
import DashboardSidebar from "@/components/UserDashboardComponents/DashboardSidebar";
import { processPath } from "@/lib/utils";

const UserDashboard: React.FC = () => {
  const location = useLocation();
  const paths = processPath(location.pathname);

  return (
    <Section className="bg-app-static p-4 md:py-6">
      <Container className="space-y-3">
        <BreadCrumb links={paths} />
        <SidebarProvider className="flex items-start min-h-full bg-white rounded-2xl overflow-hidden">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-h-[calc(100lvh-85px)] max-h-[calc(100lvh-85px)] overflow-auto p-4">
            <Outlet />
          </div>
        </SidebarProvider>
      </Container>
      <DashboardMobileBar />
    </Section>
  );
};

export default React.memo(UserDashboard);