import React from "react";
import { Link } from "react-router";
import SectionHeading from "../SectionHeading/SectionHeading";
import Container from "../Container/Container";
import Section from "../Section/Section";

const books = Array.from({ length: 6 }); // Avoid recreating array on each render

const EditorChoice = () => {
  return (
    <Section className="h-max overflow-hidden bg-editor-choice">
      <Container>
        <SectionHeading title="Editor's Choice: Top Books" />
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {books.map((_, index) => (
            <Link
              key={index}
              to="/details"
              className="w-full h-full rounded-md overflow-hidden shadow-xl shadow-slate-500 block bg-slate-200"
            >
              <img
                src="https://www.bookalooza.com/designer/storage/books/674b4ef84dcca07210d9aeba/szzb86mn.png"
                alt="Book Cover"
                loading="lazy"
                width={154}
                height={227}
                className="w-full object-contain hover:scale-125 ease-in-out transition-transform duration-700"
              />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default React.memo(EditorChoice);
