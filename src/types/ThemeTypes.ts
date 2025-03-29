import { types_server_data } from "./Types";

export interface type_theme_without_items extends types_server_data {
  name: string;
  trending?: boolean;
  popular?: boolean;
  displayImage?: string;
  updateDate: number;
  usedCount: number;
}

export interface type_ai_help_themes extends types_server_data {
  theme: string;
}

export interface type_theme_slice_state {
  allThemes?: type_theme_without_items[];
  isFetched: boolean;
  trendingThemes: type_theme_without_items[];
  popularThemes: type_theme_without_items[];
  preface: type_theme_without_items[];
  lastPage: type_theme_without_items[];
  backPage: type_theme_without_items[];
  backgrounds: type_theme_without_items[];
  aiThemes: type_ai_help_themes[];
  isAiThemesFetched: boolean;
}
