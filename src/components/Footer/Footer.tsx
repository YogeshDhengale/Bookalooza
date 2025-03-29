import React from "react";
import Section from "../Section/Section";
import LogoWithBrandName from "../LogoWithBrandName/LogoWithBrandName";
import { Link } from "react-router";
import { CONTACT_INFO, SocialMedia } from "@/lib/constantsValue";
import WhatsApp from "./WhatsApp";
import { Label } from "../ui/label";

const Links = [
  {
    title: "Explore",
    links: [
      {
        title: "About Us",
        link: "/about-us",
      },
      {
        title: "Contact Us",
        link: "/contact-us",
      },
      {
        title: "Shop with us",
        link: "/bookstore",
      },
      {
        title: "Pricing and Royalties",
        link: "/pricing-royalties",
      },
      {
        title: "Frequently Asked Questions",
        link: "/frequently-asked-questions",
      },
    ],
  },
  {
    title: "Quick Links",
    links: [
      {
        title: "Terms and Conditions",
        link: "/terms-and-conditions",
      },
      {
        title: "Refund and Cancellations",
        link: "/refund-cancellation",
      },
      {
        title: "Shipping Policy",
        link: "/shipping-policy",
      },
      {
        title: "Privacy Policies",
        link: "/privacy-policy",
      },
      {
        title: "School Login",
        link: "/school-ui/login",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full h-full bg-white py-6">
      <Section>
        <div className="container mx-auto w-full space-y-10">
          <div className="flex items-center justify-center w-full">
            <LogoWithBrandName />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4">
            {Links.map((item) => {
              return (
                <div className="space-y-4" key={item.title}>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <ul className="space-y-3 text-app-primary text-lg font-medium">
                    {item.links.map((link) => (
                      <li key={link.link}>
                        <Link to={link.link}>{link.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Contact Us</h3>
              <div className="space-y-3">
                {CONTACT_INFO.map((item) => {
                  return (
                    <div key={item.title} className="flex flex-col">
                      <p className="text-lg text-app-primary font-semibold">
                        {item.title}
                      </p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col"
                      >
                        {typeof item.linkText === "string"
                          ? item.linkText
                          : item.linkText?.map((link) => (
                              <div key={link}>
                                <p>{link}</p>
                              </div>
                            ))}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-2 xl:col-span-1">
              <ul className="mb-10 flex items-center justify-center flex-wrap gap-2 text-muted-foreground">
                {SocialMedia.map((item) => {
                  return (
                    <li className="font-medium" key={item.link}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="flex size-12 items-center justify-center rounded-full bg-app transition-colors hover:text-primary [&_svg]:w-6 [&_svg]:h-6">
                          <item.icon color="#fff" />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="grid gap-2">
                <Label className="text-app-dark text-lg text-center">
                  Get Exclusive Deals On WhatsApp
                </Label>
                <Link
                  to="https://www.whatsapp.com/channel/0029Vak6zGaAe5VwdHcBmx0a"
                  target="_blank"
                  className="primary-button flex items-center justify-center gap-2 w-full"
                >
                  <WhatsApp color="#fff" className="w-6 h-6" /> Follow Now
                </Link>
              </div>
            </div>
          </div>
          <div className="!mt-24 flex flex-col flex-wrap justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p className="w-full text-center">
              © 2025 Bookalooza. All rights reserved.
            </p>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
