import React from "react";
import SignUpBgImage from "@/assets/images/signup-background.svg";
import SignUpSparkle from "@/assets/images/signup-background-stars.svg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-[calc(100svh-56px)] lg:grid-cols-2">
      <div className="relative hidden bg-sign-up lg:flex items-center justify-center">
        <img
          src={SignUpBgImage}
          width={400}
          height={400}
          alt="bg"
          loading="lazy"
        />
        <img
          src={SignUpSparkle}
          width={400}
          height={400}
          alt="bg-stars"
          loading="lazy"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
