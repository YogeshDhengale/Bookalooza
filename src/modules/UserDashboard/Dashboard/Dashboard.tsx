import React from "react";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import Lottie from "react-lottie-player";
import writingIcon from "@/assets/lotties/writing.json";
import readingIcon from "@/assets/lotties/reading.json";
import piggyBank from "@/assets/lotties/piggy-bank.json";

const dashboardCards = [
  {
    title: "Start Writing",
    description: "Create your book now",
    link: "/create",
    animation: writingIcon,
  },
  {
    title: "Start Reading",
    description: "Take a look at Bookstore",
    link: "/create",
    animation: readingIcon,
  },
  {
    title: "Your Total Earnings",
    description: "RS. 0.00",
    link: "/create",
    animation: piggyBank,
  },
];

const DashboardCard = ({
  title,
  description,
  link,
  animation,
}: {
  title: string;
  description: string;
  link: string;
  animation: any;
}) => (
  <Link
    to={link}
    className="bg-[#f4e0ff] p-4 w-full flex flex-col md:flex-row items-start md:items-center gap-4 rounded-lg"
  >
    <div className="size-20 rounded-full bg-white p-4">
      <Lottie loop play animationData={animation} />
    </div>
    <div>
      <h3 className="text-lg text-app font-semibold">{title}</h3>
      <div className="flex items-center gap-4">
        <p>{description}</p>
        <div className="size-6 rounded-full flex items-center justify-center bg-app">
          <ChevronRight color="#fff" />
        </div>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  return (
    <DashboardLayout title="Your Dashboard" subtitle="Welcome to your dashboard">
      <div className="space-y-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
