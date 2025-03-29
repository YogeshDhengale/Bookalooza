import React from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import creativeVideo from "@/assets/video/craetive.webm";
import AthourVideo from "@/assets/video/AthourVideo.webm";
import CreateButton from "../CreateButton/CreateButton";

const CreativeContainer = () => {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          <div className="flex items-center justify-center size-full">
            <div className="size-fit">
              <div className="size-fit shadow-[0_0_40px_-4px_#000000ad] rounded-xl fle items-center justify-center">
                <video
                  className="w-full aspect-video rounded-xl border border-gray-200 outline outline-[14px] outline-[#ffffff54]"
                  preload="auto"
                  playsInline
                  datatype="video/webm"
                  width="auto"
                  height="auto"
                  loop
                  autoPlay
                  muted
                  style={{ width: "100%", height: "100%" }}
                >
                  <source type="video/webm" src={creativeVideo} />
                </video>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center size-full">
            <div className="flex items-center justify-center gap-4">
              <video
                className="aspect-square w-full max-w-96"
                preload="auto"
                playsInline
                datatype="video"
                width="auto"
                height="auto"
                autoPlay
                loop
                muted
                style={{ width: "100%", height: "100%" }}
              >
                <source type="video/webm" src={AthourVideo} />
              </video>
            </div>
            <p className="text-lg mb-6">
              Writing a book is now super easy with{" "}
              <b>Bookalooza’s online book-writing platform!</b> Thousands of
              young writers like you have already become published authors, and
              now it’s your turn to write and publish a book effortlessly. Just
              type your story, format it with simple tools, add pictures to make
              it exciting, and publish it with a click. <b>The best part?</b>{" "}
              You start earning royalties on every book sale—just like a real
              author! Ready to begin your journey to becoming a{" "}
              <b>successful young writer?</b>
            </p>
          <CreateButton cta={"Write Your Book Now!"} />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CreativeContainer;
