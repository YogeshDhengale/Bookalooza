import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Link, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Slash } from "lucide-react";

const BreadCrumb = ({links}: {links?: {title: string, link: string}[]}) => {
  const navigate = useNavigate();
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base text-app-dark">
        <BreadcrumbItem>
          <BreadcrumbLink asChild onClick={() => navigate(-1)}>
            <div className="flex gap-2 items-center justify-center ">
              <ChevronLeft className="h-4 w-4" />
              Back
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="hover:opacity-80">
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {
          links?.map((item) => <React.Fragment key={item.link}>
            <BreadcrumbSeparator>
          <ChevronRight />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={item.link} className="hover:opacity-80">
              {item.title}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
          </React.Fragment>)
        }
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
