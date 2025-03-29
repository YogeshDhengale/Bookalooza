import React, { useState } from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import SectionHeading from "../SectionHeading/SectionHeading";
import { TEAM_MEMBERS } from "@/lib/constantsValue";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const OurTeamContainer = () => {
  return (
    <Section>
      <Container>
        <SectionHeading title="Our Team" className="text-app-dark" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </Container>
    </Section>
  );
};

const MemberCard = ({ member }) => {
  const tabs = Object.keys(member.details);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <article
      className="aspect-[413/553] relative text-white"
      style={{ perspective: "3000px" }}
      onClick={() => {
        setIsFlipped((p) => !p);
      }}
    >
      <div
        className={cn(
          "relative size-full transition-all duration-700 transform-3d",
          isFlipped && "transform-rotateY"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute size-full flex items-center justify-center rounded-3xl p-4 bg-team-card"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative size-full rounded-2xl overflow-hidden border border-app">
            <img
              src={member.image}
              alt={member.name}
              className="h-full max-w-none object-contain"
              loading="lazy"
            />
            <div className="space-y-1 absolute size-max p-3 bottom-[5%] left-[5%] rounded-xl bg-[#430e6be6]">
              <h4 className="text-xl font-bold">{member.name}</h4>
              <p className="text-base font-semibold italic">
                {member.designation}
              </p>
            </div>
          </div>
        </div>
        {/* card back */}
        <div
          className="absolute size-full flex items-center justify-center rounded-3xl p-4 bg-team-card"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative size-full rounded-2xl overflow-hidden flex gap-6 flex-col">
            <div className="bg-[#430e6b] border border-app h-2/5 rounded-xl relative overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                className="member-card-image"
              />
              <div className="absolute w-3/5 h-full p-4 flex justify-between items-end flex-col text-white top-0 right-0 z-10">
                <div className="space-y-2 text-end">
                  <h5 className="text-2xl font-bold">{member.name}</h5>
                  <p className="text-lg italic">{member.designation}</p>
                </div>
                <div className="flex gap-3 h-max">
                  {tabs.map((tab) => (
                    <Button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                      }}
                      className={cn(
                        "flex-1 p-2 bg-app/50 rounded-md text-base capitalize hover:bg-white hover:text-app",
                        activeTab === tab && "bg-white text-app"
                      )}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-3/5 text-white flex flex-col px-6">
              <ul className="list-disc">
                {member.details[activeTab].map((item, index) => (
                  <li
                    key={index}
                    className="text-base font-normal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default OurTeamContainer;
