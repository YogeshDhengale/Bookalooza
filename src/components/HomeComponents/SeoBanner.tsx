import React from "react";
import Section from "../Section/Section";
import SeoBannerImage from "@/assets/images/seobanner.png";
import Container from "../Container/Container";
import CreateButton from "../CreateButton/CreateButton";

const SeoBanner = () => {
  return (
    <Section className="p-0">
      <div className="relative">
        <img
          src={SeoBannerImage}
          width={1909}
          height={437}
          className="w-full object-cover object-right bg-slate-300 h-56 md:h-auto"
          loading="lazy"
          alt="banner"
        />
        <div className="absolute bottom-5 md:bottom-6 right-0 me-[8vw]">
          <CreateButton />
        </div>
      </div>
      <Container className="px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2 text-xl">
          <div>
            If you're an aspiring storyteller, Bookalooza is the ultimate
            platform to help you{" "}
            <b>
              <em>write, publish, and earn—all</em>
            </b>{" "}
            for free. Struggling to find tools for{" "}
            <b>
              <em>book writing for children,</em>
            </b>{" "}
            an intuitive book{" "}
            <b>
              <em>writing platform for writers</em>
            </b>
            , or guidance on how to write books online? Bookalooza has you
            covered!
          </div>
          <div>
            With amazing in-built tools, umpteen themes and templates, and the
            ability to{" "}
            <b>
              <em>earn money through book</em>
            </b>{" "}
            writing, Bookalooza ensures your passion turns into published works
            loved by readers worldwide. Plus, by writing your book on
            Bookalooza,you can earn{" "}
            <b>
              <em>10% royalty for a lifetime</em>
            </b>
            —because your creativity deserves recognition and reward.
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default SeoBanner;
