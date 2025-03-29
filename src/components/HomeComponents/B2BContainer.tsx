import React from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import b2bImage from "@assets/images/b2b.jpeg";
import b2bImage1 from "@assets/images/Image-1.jpg";
import b2bImage2 from "@assets/images/Image-2.jpg";
import b2bImage3 from "@assets/images/Image-3.jpg";
import b2bImage4 from "@assets/images/Image-4.jpg";
import b2bImage5 from "@assets/images/Image-5.jpg";

const CAROUSAL_ITEMS = [
  {
    img: b2bImage,
  },
  {
    img: b2bImage1,
  },
  {
    img: b2bImage2,
  },
  {
    img: b2bImage3,
  },
  {
    img: b2bImage4,
  },
  {
    img: b2bImage5,
  },
];

const ITEMS = [
  "Get in touch with us for exclusive school deals",
  <>
    Schedule a{" "}
    <b>
      <em>FREE Creative Storytelling Workshop</em>
    </b>{" "}
    for your students
  </>,
  <>Watch your students write, publish, and earn through their books</>,
  "Celebrate their stories and share their achievements",
];

const B2BContainer = () => {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 rounded-xl w-full ring-2 ring-app overflow-hidden aspect-[3/4]">
            <div
              className="animate-scroll p-4 h-full w-full min-w-max"
              style={
                {
                  "--duration": "23s",
                  "--delay": "0s",
                  "--iteration-count": "infinite",
                } as React.CSSProperties
              }
            >
              <div className="flex h-full w-full min-w-max box-border space-x-4 ">
                {[...CAROUSAL_ITEMS, ...CAROUSAL_ITEMS].map((item, idx) => {
                  return (
                    <div key={idx} className="h-full w-[calc(100%-2rem)] rounded-md overflow-hidden aspect-[3/4] ring ring-slate-300">
                      <img src={item.img} width={296} height={395} alt="Carousel item" className="w-full bg-slate-50 object-contain" loading="lazy" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="font-bold text-4xl">Exclusive Deals for Schools!</h2>
            <div className="space-y-2">
              <h3 className="text-app font-medium text-3xl">
                Partner with Bookalooza. Create Star Authors!
              </h3>
              <p className="text-lg">
                Partner with us to get{" "}
                <b>
                  <em>special discounts</em>
                </b>{" "}
                for your school and a{" "}
                <b>
                  <em>FREE workshop</em>
                </b>{" "}
                on the art of creative storytelling. Let's help your students
                turn their ideas into incredible books and showcase their
                talent.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-app font-medium text-3xl">
                Here's how it works:
              </h3>
              <ul className="my-2 text-xl ms-2">
                {ITEMS.map((item, index) => (
                  <li
                    className={cn(
                      "opacity-0 p-1  ease-out transition-all animate-fade-right"
                    )}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      transitionDelay: `${index * 0.25}s`,
                      animationTimeline: "view()",
                      animationRange: "entry 100% cover 30%",
                    }}
                    key={index}
                  >
                    {index + 1}. {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Button className="rounded-full p-6 text-xl text-app shadow-md bg-[#6f2f871a] border border-app hover:bg-app hover:text-white">
                Enquire Now!
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
export default B2BContainer;
