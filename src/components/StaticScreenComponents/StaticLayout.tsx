import React, { Children } from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import Lottie from "react-lottie-player";
import { Separator } from "../ui/separator";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { type_static_contentItem } from "@/types/StaticScreenTypes";
import StaticContent from "./StaticContent";

interface StaticLayoutProps {
  title: string;
  description: string | React.ReactNode;
  animation: any;
  content: type_static_contentItem[];
}

const StaticLayout = ({
  title,
  description,
  animation,
  content,
}: StaticLayoutProps) => {
  return (
    <Section className="bg-app-static min-h-[calc(100svh-56px)] py-6">
      <Container className="mb-6">
        <BreadCrumb />
      </Container>
      <Container className="bg-white rounded-xl p-6 md:p-10">
        <div className="flex justify-between items-start gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-app mb-6">
              {title}
            </h1>
            <p className="text-lg leading-relaxed">{description}</p>
          </div>
          <div className="hidden md:block flex-shrink-0 w-full max-w-56 max-h-56">
            <Lottie loop play animationData={animation} />
          </div>
        </div>
        <Separator className="w-full !mt-4" />
        <div className="space-y-9">
          {content.map((item, idx) => (
            <StaticContent key={idx} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default StaticLayout;
