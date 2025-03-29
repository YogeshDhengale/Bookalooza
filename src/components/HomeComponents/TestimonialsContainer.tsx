import React from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import shahwaiz from "@/assets/images/1.webp";
import eshita from "@/assets/images/2.webp";
import drishti from "@/assets/images/3.webp";
import sadhna from "@/assets/images/4.webp";
import parash from "@/assets/images/5.webp";
import riza from "@/assets/images/6.webp";
import saanvika from "@/assets/images/7.webp";
import aaradhya from "@/assets/images/8.webp";
import harsha from "@/assets/images/9.webp";
import aradhya2 from "@/assets/images/10.webp";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Link } from "react-router";

const testimonials = [
  {
    name: "Shahwaiz Ansari",
    designation: "Author",
    book: "Freedom Struggle",
    text: "I realized it's a great platform that helps children nurture their talent for writing and authorship.",
    rotate: "5.349deg",
    img: shahwaiz,
  },
  {},
  {},
  {
    name: "Eshita E",
    designation: "Author",
    book: "The Almighty God",
    text: "Bookalooza makes writing a book incredibly easy and accessible for everyone.",
    rotate: "-3.349deg",
    img: eshita,
  },
  {},
  {
    name: "Drishti Sharma",
    designation: "Author",
    book: "अच्छी आदतें: सफलता की कुंजी",
    text: "My first book came true thanks to Bookalooza—my ultimate author companion!",
    rotate: "3.349deg",
    img: drishti,
  },
  {},
  {},
  {
    name: "Sadhna Gautam",
    designation: "Author",
    book: "This is Called Life",
    text: "Bookalooza is a true platform for the children to show their talent...Thank you, Bookalooza.",
    rotate: "-15.349deg",
    img: sadhna,
  },
  {},
  {
    name: "Parash Kashyap Kachari",
    designation: "Author",
    book: "The Saviour",
    text: "This is my first time writing about God, and I’m excited to share it with you all.",
    rotate: "10.349deg",
    img: parash,
  },
  {},
  {},
  {
    name: "Riza Khan",
    designation: "Author",
    book: "Ouija Board and The Mysterious Portal",
    text: "My experience with Bookalooza was awesome.I faced many problems but all got resolved by Bookalooza.",
    rotate: "-10.349deg",
    img: riza,
  },
  {},
  {
    name: "Saanvika Rao",
    designation: "Author",
    book: "Ambition & Dream",
    text: "It's really an amazing experience for me. I will never forget this journey with Bookalooza.",
    rotate: "-4.349deg",
    img: saanvika,
  },
  {},
  {},
  {
    name: "Aaradhya Chhabra",
    designation: "Author",
    book: "The Haunted Library",
    text: "Bookalooza is such a great platform for writing a book. Now I am an author. It is just possible because of Bookalooza.",
    rotate: "4.349deg",
    img: aaradhya,
  },
  {},
  {},
  {
    name: "Harsha K",
    designation: "Author",
    book: "Lord Shiva Stories",
    text: "This has been an incredible experience, and I've been thinking about writing a book for many years.",
    rotate: "5.349deg",
    img: harsha,
  },
  {},
  {
    name: "Aradhya Singh",
    designation: "Author",
    book: "Covid 19",
    text: "It's a really great app, and I will love and enjoy writing on Bookalooza.👍😀",
    rotate: "-5.349deg",
    img: aradhya2,
  },
];

const ITEMS = [...testimonials, ...testimonials];

const TestimonialsContainer = () => {
  return (
    <Section className="overflow-hidden">
      <Container className="pb-20">
        <div className="max-w-[44rem] mx-auto my-10">
          <h2 className="font-serif mb-12 text-7xl md:text-9xl leading-[1.2] text-center font-bold">
            WHAT OUR STAR AUTHORS ARE SAYING
          </h2>
          <Link
            to="/testimonials"
            className="absolute z-10 -translate-x-1/2 left-1/2 bottom-20 bg-white border border-app-dark rounded-full font-bold text-lg leading-[1.2] w-max px-8 py-4 shadow-md"
          >
            View Testimonials
          </Link>
        </div>
      </Container>
      <div className="absolute top-0 h-full w-full left-0">
        <div className="h-full overflow-hidden">
          <div className="flex flex-col animate-scrollY">
            {ITEMS.map((e, idx) => (
              <TestimonialCard card={e} key={idx} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const TestimonialCard = ({ card, idx }) => {
  return (
    <div
      key={idx}
      className={`flex w-full min-h-40 p-4 ${
        idx % 2 === 0 ? "justify-start" : "justify-end"
      }`}
    >
      {card?.text && (
        <div
          className="bg-testimonial-card max-w-80 md:max-w-96 rounded-xl p-5 text-white shadow-lg transform"
          style={{ transform: `rotate(${card.rotate})` }}
        >
          <h2 className="mb-4 text-xl font-light">{card?.text}</h2>
          <div className="flex gap-4">
            <Avatar className="w-20 h-20 ring-4 ring-gray-300">
              <AvatarImage
                className="border-gray-300"
                src={card.img}
                alt={card.name}
                loading="lazy"
                width={50}
                height={50}
              />
            </Avatar>
            <div className="space-y-2">
              <h4 className="m-0 text-lg font-semibold mb-2">{card.name}</h4>
              <Separator className="w-full bg-white" />
              <p className="text-base font-semibold">{card.book}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsContainer;
