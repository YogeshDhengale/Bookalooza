import React, { useEffect } from "react";
import SectionHeading from "../SectionHeading/SectionHeading";
import { fetchAllThemes } from "@/actions/ThemeAction/ThemeAction";
import { type_theme_without_items } from "@/types/ThemeTypes";
import CreateButton from "../CreateButton/CreateButton";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const ChooseThemeContainer = () => {
  const dispatch = useAppDispatch();
  const { isFetched, allThemes } = useAppSelector(
    (state) => state.themes
  );

  useEffect(() => {
    if (!isFetched) dispatch(fetchAllThemes());
  }, [dispatch, isFetched]);

  const middle = Math.ceil(allThemes.length / 2);

  const firstHalf = allThemes.slice(0, Math.ceil(middle));
  const secondHalf = allThemes.slice(Math.ceil(middle));

  return (
    <section className="py-8 w-full">
      <SectionHeading title="Choose Your Theme" className="text-app-dark p-6" />
      <div className="overflow-hidden w-full my-6">
        <div
          className="animate-scroll overflow-hidden p-4 h-full w-full min-w-max"
          style={
            {
              "--duration": "90s",
              "--delay": "0s",
              "--iteration-count": "infinite",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full min-w-max box-border space-x-6">
            {[...firstHalf, ...firstHalf].map((theme, idx) => (
              <ImageCard key={idx} theme={theme} />
            ))}
          </div>
        </div>
        <div
          className="animate-scroll-reverse overflow-hidden p-4 h-full w-full min-w-max"
          style={
            {
              "--duration": "90s",
              "--delay": "0s",
              "--iteration-count": "infinite",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full min-w-max box-border space-x-6">
            {[...secondHalf, ...secondHalf].map((theme, idx) => (
              <ImageCard key={idx} theme={theme} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <CreateButton />
      </div>
    </section>
  );
};

const ImageCard = ({ theme }: { theme: type_theme_without_items }) => {
  return (
    <div className="h-fit w-fit shadow-lg rounded-lg">
      <img
        className="object-contain rounded-lg ring-8 ring-gray-500/10"
        src={theme.displayImage}
        alt={theme.name}
        width={152}
        height={176}
        loading="lazy"
      />
    </div>
  );
};

export default React.memo(ChooseThemeContainer);
