import React from "react";
import OurTeamContainer from "@/components/AboutUsComponents/OurTeamContainer"
import ContentContainer from "@/components/AboutUsComponents/ContentContainer";
import HeroSection from "@/components/AboutUsComponents/HeroSection";

function AboutUs() {
  return (
    <div>
      <HeroSection />
      <ContentContainer />
      <OurTeamContainer />
    </div>
  );
}

export default AboutUs;
