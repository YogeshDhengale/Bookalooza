import Consts from "@/lib/consts";
import { cn } from "@/lib/utils";
import React from "react";

const LogoWithBrandName = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center space-y-1",
        className
      )}
    >
      <img
        alt="bookalooza"
        src={Consts.logo}
        width={24}
        height={24}
        className="w-10 object-contain"
        loading="lazy"
      />
      <img
        src={Consts.brandNameImage}
        alt="Bookalooza"
        height={24}
        width={120}
        loading="lazy"
      />
    </div>
  );
};

export default LogoWithBrandName;
