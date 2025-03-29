import React from "react";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import animation from "@/assets/lotties/frequently-asked-questions.json";
import Lottie from "react-lottie-player";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router";

const content = [
  {
    title: "What is Bookalooza?",
    description: [
      "Bookalooza is an online platform that allows young children to write, publish, and earn a 10% royalty through selling their books. We provide all the tools and resources needed to help young authors bring their stories to life.",
    ],
  },
  {
    title: "How can the child start writing a book on Bookalooza?",
    description: [
      "The child can easily start writing by signing up on our website. Creating a book is free, and our user-friendly platform will guide them through the writing and publishing process.",
    ],
  },
  {
    title:
      "How can I create a custom background and use special fonts for my book?",
    description: [
      "You can choose from over 200+ themes and use unlimited backgrounds available on our website for your book. However, you can't add your own fonts or graphics to the platform.",
    ],
  },
  {
    title:
      "What are the costs associated with publishing a book on Bookalooza?",
    description: [
      "While creating a book on Bookalooza is free, there is a fee for ordering a hard copy or printed copy of the book. Once you place an order, we handle the printing and delivery.",
    ],
  },
  {
    title: "How can my child earn money through Bookalooza?",
    description: [
      "Young authors earn a 10% royalty on each book sold. Apart from our Bookstore, their books are also listed on popular platforms like Amazon and Flipkart to increase reach and sales potential.",
    ],
  },
  {
    title: "What is the Star Podcast?",
    description: [
      "The Star Podcast features interviews with Star Authors who have written books on Bookalooza. It's a great way to celebrate our young authors' achievements and share their stories with a wider audience.",
    ],
  },
  {
    title: "What is the Voice of Leadership Podcast?",
    description: [
      "The Voice of Leadership Podcast features interviews with school principals. This podcast aims to highlight the insights and leadership experiences of educational leaders.",
    ],
  },
  {
    title: "How can I order a printed copy of my child's book?",
    description: [
      "Once your child's book is complete, you can place an order for a printed copy through our website. We will handle the printing and ship the book to your specified address.",
    ],
  },
  {
    title: "Where can I find the books written by star authors?",
    description: [
      "Books written by our star authors are listed in our Bookstore and other major online retailers like Amazon and Flipkart, making it easy for readers to purchase and enjoy these books.",
    ],
  },
  {
    title: "What are the hours of operation for Bookalooza customer support?",
    description: [
      "Our customer support team is available Monday to Friday from 9.30 AM to 6 PM. You can also reach us via email at info@bookalooza.com.",
    ],
  },
  {
    title:
      "How does Bookalooza support young authors throughout the writing process?",
    description: [
      "We provide a variety of resources, including writing guides, editing tools, and a supportive community. Our goal is to make the writing and publishing process as smooth and enjoyable as possible for young authors. To do this, you can follow our WhatsApp channel. We update everything on our WhatsApp channel.",
    ],
  },
  {
    title: "Why can’t I log into my account?",
    description: [
      "It could be a network or internet issue. Try logging in again.",
    ],
  },
  {
    title: "How do I update my profile?",
    description: [
      <>
        Go to{" "}
        <b>
          <Link to="/user/profile">“MY PROFILE”</Link>
        </b>{" "}
        in{" "}
        <b>
          <Link to="/user/dashboard">“MY ACCOUNT”</Link>
        </b>{" "}
        to update your Name, Email, School Name, or Profile Picture.
      </>,
    ],
  },
  {
    title: "Why isn’t my book showing in the bookstore?",
    description: [
      "It takes 24-48 hours for a book to be reviewed and appear in the BookStore.",
    ],
  },
  {
    title: "How do I remove or edit a book that I published by mistake?",
    description: [
      "Once a book is sent for review and published, the author cannot remove it. If you want to edit a book that is still in drafts, go to MY LIBRARY and make changes before sending it for review.",
    ],
  },
  {
    title: "Can I cancel my order, and will I get a refund?",
    description: [
      "The order can't be canceled once the book is set for printing. If delivery is delayed, you will receive a refund according to our policies.",
    ],
  },
  {
    title: "How do I earn and redeem my Author Royalty?",
    description: [
      "To collect your royalties, enter your bank details in the 'BANK DETAILS' section of 'MY ACCOUNT.' For more information, check the Pricing & Royalties Page.",
    ],
  },
  {
    title: "How do I market and sell my book?",
    description: [
      "A social media poster will be automatically created for your published book. Share it on social media to promote your book. You can also show your book through your WhatsApp status and other digital marketing mediums.",
    ],
  },
  {
    title:
      "What should I write about? How long does it take to publish? When will I get my certificate?",
    description: [
      "Based on the theme you choose, you can write about anything you like. A book of around 24-32 pages is a good length. Once you submit your book, it takes 24-48 hours to review and publish it. After your book is published, you'll receive a certificate, which you can find in the 'My Achievements' section of your dashboard.",
    ],
  },
  {
    title: "What are the refund and cancellation policies for Bookalooza?",
    description: [
      "If you’re using Bookalooza and face any of these issues, you’re eligible for a full refund:",
      "1. The site is down for more than 3 days without notice.",
      "2. Your access to the site has been canceled without prior warning.",
      "3. We can’t deliver the printed book within 45 days after publication.",
      "Please note that authors under 18 must register through their parents or guardians. We reserve the right to reject a book, deactivate a user account, or return any ordered book copies at our discretion.",
      <>
        For any refund or cancellation queries, please contact us at{" "}
        <a href="mailto:info@bookalooza.com">info@bookalooza.com</a>.
      </>,
    ],
  },
  {
    title: "How long will it take for my order to be delivered?",
    description: [
      "After you place your order, it will typically be dispatched within 8 to 10 business days. Delivery usually takes 15-21 business days, depending on your location and shipping option. Once your item is shipped, you will receive an email with a tracking number, allowing you to monitor its progress.",
      <>
        Please note that delivery times are estimates and may vary due to
        shipping company delays. For any questions or concerns about your order,
        please contact us at{" "}
        <a href="mailto:info@bookalooza.com">info@bookalooza.com</a>.
      </>,
    ],
  },
];

function FAQ() {
  return (
    <Section className="bg-app-static min-h-[calc(100svh-56px)] py-6">
      <Container className="mb-6">
        <BreadCrumb />
      </Container>
      <Container className="bg-white rounded-xl p-6 md:p-10">
        <div className="flex justify-between items-start gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-app mb-6">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="hidden md:block flex-shrink-0 w-full max-w-56 max-h-56">
            <Lottie loop play animationData={animation} />
          </div>
        </div>
        <Separator className="w-full !mt-4" />
        <Accordion type="single" collapsible className="w-full space-y-6">
          {content.map((item, idx) => (
            <AccordionItem value={`item-${idx}`} className="border-0" key={idx}>
              <AccordionTrigger className="text-xl bg-app text-white p-3 rounded-lg">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="border border-app rounded-lg p-3 [&_a]:text-app [&_a]:underline [&_a]:decoration-app [&_a]:decoration-1 [&_a]:underline-offset-2">
                {item.description.map((item, idx) => (
                  <p key={idx} className="text-lg md:text-base text-app-text">
                    {item}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}

export default FAQ;
