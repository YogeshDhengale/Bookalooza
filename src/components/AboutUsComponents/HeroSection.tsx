import React from "react";
import AboutBanner from "@/assets/images/aboutUsBanner.webp";
import AboutBannerMobile from "@/assets/images/aboutUsBannerMobile.webp";
import { Link } from "react-router";

const HeroSection = () => {
  return (
    <div className="size-full overflow-hidden relative">
      <picture>
        <source media="(max-width: 768px)" srcSet={AboutBannerMobile} />
        <source media="(min-width: 769px)" srcSet={AboutBanner} />
        <img
          src={AboutBanner}
          alt={AboutBanner}
          width={320}
          height={320}
          className="size-full object-cover max-w-none"
          loading="lazy"
        />
      </picture>
      <div className="absolute size-full top-0 left-0 md:px-[10%] flex flex-col items-center justify-end md:items-start md:justify-center  pb-10 text-white">
        <h1 className="uppercase text-5xl md:text-7xl xl:text-9xl text-center md:text-left leading-tight h-max tracking-tight font-black font-serif flex flex-col">
          <span>Write Smart</span>
          <span>Publish Fast</span> <span>Earn Big</span>
        </h1>
        <Link
          to="/create"
          className="bg-about-btn text-xl md:text-2xl font-bold p-4 mt-6 rounded-full"
        >
          Create Your Book Now!
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
