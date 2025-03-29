import React from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import { Skeleton } from "../ui/skeleton";

const EditorChoiceSkelton = () => {
  return (
    <Section className={"bg-editor-choice"}>
      <Container>
        <div className="mb-8 text-center">
          <Skeleton className="h-8 w-64 mx-auto" />
        </div>

        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-full rounded-md overflow-hidden shadow-xl shadow-purple-900/20 bg-slate-200/20"
            >
              <Skeleton className="w-full aspect-[154/227]" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default EditorChoiceSkelton;
