import React from "react";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import CreateButton from "../CreateButton/CreateButton";

const content = [
  <>
    Welcome to Bookalooza, the ultimate self-publishing AI platform where young
    minds turn their stories into real books! If you’ve ever dreamed of becoming
    an author, this is your chance. <b>Why should you join Bookalooza?</b>{" "}
    Because we make writing fun, easy, and rewarding!
  </>,
  <>
    With in-built templates, customizable color, font styles, and headings, and
    even a speech-to-text feature for days when you don’t feel like typing,
    writing a book has never been this simple. Our AI support guides you every
    step of the way, making the process completely hassle-free. Need help with
    editing? Our proofreading services have got you covered. Plus, your book
    gets listed on Amazon and Flipkart, reaching readers everywhere!
  </>,
  <>
    And that’s not all—your journey doesn’t end with publishing. We feature
    young authors on our exclusive podcast, streamed live on YouTube and social
    media. With exciting themes and creative tools, Bookalooza is where young
    writers become published authors and even earn royalties from their books!
  </>,
  <CreateButton cta="Start writing today" />,
  <strong>Your story deserves to be told!</strong>,
];

const ContentContainer = () => {
  return (
    <Section>
      <Container>
        <SectionHeading
          title="Welcome to Bookalooza"
          className="text-app-dark"
        />
        <div className="space-y-6 mb-4">
          {content.map((item, idx) => (
            <p key={idx} className="text-xl h-fit text-center">
              {item}
            </p>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ContentContainer;
