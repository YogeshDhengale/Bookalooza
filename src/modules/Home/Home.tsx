import ChooseThemeContainer from "@/components/HomeComponents/ChooseThemeContainer";
import EditorChoiceSkelton from "@/components/HomeComponents/EditorChoiceSkelton";
import TestimonialsContainer from "@/components/HomeComponents/TestimonialsContainer";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";

const HeroSection = React.lazy(
  () => import("@/components/HomeComponents/HeroSection")
);
const EditorChoice = React.lazy(
  () => import("@/components/HomeComponents/EditorChoice")
);
const SeoBanner = React.lazy(
  () => import("@/components/HomeComponents/SeoBanner")
);
const B2BContainer = React.lazy(
  () => import("@/components/HomeComponents/B2BContainer")
);
const StarAuthors = React.lazy(() => import("@/components/HomeComponents/StarAuthors"));

const CreativeContainer = React.lazy(
  () => import("@/components/HomeComponents/CreativeContainer")
);


function Home() {  
  return (
    <div className="">
      <Suspense
        fallback={
          <Skeleton className="rounded bg-purple-200 w-full h-screen" />
        }
      >
        <HeroSection />
      </Suspense>
      <CreativeContainer />
      <Suspense
        fallback={
          <EditorChoiceSkelton />
        }
      >
        <EditorChoice />
      </Suspense>
      <Suspense
        fallback={
          <Skeleton className="rounded bg-purple-200 w-full h-screen" />
        }
      >
        <SeoBanner />
      </Suspense>
      <ChooseThemeContainer />
      <Suspense
        fallback={
          <Skeleton className="rounded bg-purple-200 w-full h-screen" />
        }
      >
        <B2BContainer />
      </Suspense>
      <Suspense
        fallback={
          <Skeleton className="rounded bg-purple-200 w-full h-screen" />
        }
      >
        <StarAuthors />
      </Suspense>
      <TestimonialsContainer />
    </div>
  );
}

export default Home;
