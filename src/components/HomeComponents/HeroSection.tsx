import React, { useEffect } from "react";
import heroVideo from "@/assets/video/hero.webm";
import heroPoster from "@/assets/images/hero.png";
import { Button } from "../ui/button";

const HeroSection = () => {
  useEffect(() => {
    const videoPreload = document.createElement("link");
    videoPreload.rel = "preload";
    videoPreload.as = "fetch";
    videoPreload.href = heroVideo;
    videoPreload.type = "video/webm";
    videoPreload.crossOrigin = "anonymous"; // Add if needed
    document.head.appendChild(videoPreload);
  
    return () => {
      document.head.removeChild(videoPreload); // Cleanup
    };
  }, []);
  
  return (
    <section className="w-full relative">
      <video
        width={1024}
        height={320}
        loop
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={heroPoster}
        disableRemotePlayback
        className="w-full h-auto aspect-video object-cover"
      >
        <source src={heroVideo} type="video/webm"/>
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-[40vw] right-[36vw]">
        <Button
          variant="outline"
          className="rounded-full p-[2.5vw] text-[2.5vw]"
          size="lg"
        >
          Get Started Now!
        </Button>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
