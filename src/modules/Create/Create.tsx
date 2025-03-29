import {
  fetchAllAiHelp,
  fetchAllThemes,
} from "@/actions/ThemeAction/ThemeAction";
import BreadCrumb from "@/components/BreadCrumb/BreadCrumb";
import Container from "@/components/Container/Container";
import ThemeCard from "@/components/CreateComponents/ThemeCard";
import Section from "@/components/Section/Section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo } from "react";

function Create() {
  const dispatch = useAppDispatch();
  const {
    isFetched,
    allThemes,
    aiThemes,
    trendingThemes,
    popularThemes,
    isAiThemesFetched,
  } = useAppSelector((state) => state.themes);

  const specialThemes = useMemo(
    () => [
      {
        title: "Trending Themes",
        themes: trendingThemes,
        className: "bg-theme-selection-2",
      },
      {
        title: "Popular Themes",
        themes: popularThemes,
        className: "bg-theme-selection",
      },
    ],
    [trendingThemes, popularThemes]
  );

  useEffect(() => {
    if (!isFetched) dispatch(fetchAllThemes());
  }, [isFetched, dispatch]);

  useEffect(() => {
    if (!isAiThemesFetched) dispatch(fetchAllAiHelp());
  }, [isAiThemesFetched, dispatch]);

  const AllAiThemes = useMemo(
    () => new Set(aiThemes.map((i) => i.theme.toLowerCase())),
    [aiThemes]
  );

  return (
    <div>
      <Container className="p-6">
        <BreadCrumb />
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Choose a theme for your book
        </h1>
      </Container>

      {specialThemes.map(({ title, themes, className }) => (
        <Section key={title} className="p-6">
          <Container className={cn("rounded-3xl py-6 px-4 md:px-6", className)}>
            <h2 className="text-2xl text-white font-bold text-center">
              {title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isAi={AllAiThemes.has(theme.name.toLowerCase())}
                />
              ))}
            </div>
          </Container>
        </Section>
      ))}
      <Section className="p-6">
        <Container
          className={cn(
            "rounded-3xl py-6 px-4 h-full flex flex-col items-center",
            "bg-theme-selection-3"
          )}
        >
          <h2 className="text-2xl text-white font-bold text-center">
            All themes
          </h2>
          <ScrollArea className="h-svh rounded-lg p-3 w-full bg-white">
            <div className="grid grid-cols-2 h-full md:grid-cols-4 xl:grid-cols-5 gap-4">
              {allThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isAi={AllAiThemes.has(theme.name.toLowerCase())}
                  className="bg-app/5"
                />
              ))}
            </div>
          </ScrollArea>
        </Container>
      </Section>
    </div>
  );
}

export default Create;
