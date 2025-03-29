import React from "react";
import Lottie from "react-lottie-player";
import earningAnimation from "@/assets/lotties/earnings-wallet.json";
import CreateButton from "@/components/CreateButton/CreateButton";

const EarningEmpty = () => {
  return (
    <div className="p-4 rounded-lg flex-1 overflow-auto relative border border-app-dark">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 text-center">
      <Lottie animationData={earningAnimation} loop play className="size-40" />
      <p>No earnings yet! Publish a book and start earning.</p>
      <CreateButton />
    </div>
    </div>
  );
};

export default EarningEmpty;
