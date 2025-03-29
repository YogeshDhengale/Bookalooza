import { type_theme_slice_state } from "@/types/ThemeTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: type_theme_slice_state = {
  allThemes: [],
  isFetched: false,
  trendingThemes: [],
  popularThemes: [],
  preface: [],
  lastPage: [],
  backPage: [],
  backgrounds: [],
  aiThemes: [],
  isAiThemesFetched: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    fetchThemes: (state, action: PayloadAction<Partial<type_theme_slice_state>>) => {
      state.isFetched = true;
      Object.assign(state, action.payload);
    },
    fetchAiThemes: (state, action: PayloadAction<typeof initialState.aiThemes>) => {
      state.isAiThemesFetched = true;
      state.aiThemes = action.payload;
    },
    updateThemes: (state, action: PayloadAction<Partial<type_theme_slice_state>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const themeSliceReducer = themeSlice.reducer;
export const themeSliceActions = themeSlice.actions;
