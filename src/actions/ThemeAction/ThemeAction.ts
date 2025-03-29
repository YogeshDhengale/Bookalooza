import { AppDispatch } from "@/store/store";
import { themeSliceActions } from "@/store/ThemeSlice/ThemeSlice";
import {
  type_ai_help_themes,
  type_theme_without_items,
} from "@/types/ThemeTypes";
import axios from "axios";

interface themes_without_items_response {
  data: type_theme_without_items[];
  success: boolean;
}

interface theme_ai_help_response {
  data: type_ai_help_themes[];
  success: boolean;
}


export function fetchAllThemes() {
  return async (dispatch: AppDispatch) => {
    try {
      const filter = { sortBy: "name ASC" };
      const response = await axios.get<themes_without_items_response>(
        "/designer/themes/withoutItems",
        {
          params: { filter: JSON.stringify(filter) },
          responseType: "json",
        }
      );

      const { data, success } = response.data;
      if (!success) return;

      const nameMap = new Map<string, type_theme_without_items[]>();
      const trendingThemes: type_theme_without_items[] = [];
      const popularThemes: type_theme_without_items[] = [];
      const allThemes: type_theme_without_items[] = [];

      for (const theme of data) {
        if (["Preface", "Last page", "Back page", "Background"].includes(theme.name)) {
          nameMap.set(theme.name, [...(nameMap.get(theme.name) || []), theme]);
        } else {
          allThemes.push(theme);
          if (theme.trending) trendingThemes.push(theme);
          if (theme.popular) popularThemes.push(theme);
        }
      }

      dispatch(
        themeSliceActions.fetchThemes({
          allThemes,
          trendingThemes,
          popularThemes,
          preface: nameMap.get("Preface") ?? [],
          lastPage: nameMap.get("Last page") ?? [],
          backPage: nameMap.get("Back page") ?? [],
          backgrounds: nameMap.get("Background") ?? [],
        })
      );
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };
}


export function fetchAllAiHelp() {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<theme_ai_help_response>("/designer/storylines/withoutItems");

      const { data, success } = response.data;
      if (success) {
        dispatch(themeSliceActions.fetchAiThemes(data));
      }
    } catch (error) {
      console.error("Error fetching AI help:", error);
    }
  };
}
