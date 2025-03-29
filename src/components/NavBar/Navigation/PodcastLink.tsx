// components/PodcastLink.tsx
import React from "react";
import { Link } from "react-router";
import podcastIcon from "@/assets/icons/icon-podcast.png";

const PodcastLink = () => (
  <Link
    to="https://docs.google.com/forms/d/e/1FAIpQLSdTbzzmWvphJ6EnT1FeAKtoghJmWOk-DG2mFAF8i1vm0WNIag/viewform"
    target="_blank"
    className="flex items-center gap-1 p-0 text-sm font-medium"
  >
    <img
      src={podcastIcon}
      alt="podcast"
      className="w-10 mix-blend-multiply bg-transparent"
    />
    <span className="text-sm hidden xl:block">Book Podcast</span>
  </Link>
);

export default PodcastLink;
