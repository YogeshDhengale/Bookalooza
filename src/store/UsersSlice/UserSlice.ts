import { type_user_slice_state } from "@/types/UsersTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: type_user_slice_state = {
  user: null,
  isUserFetched: false,
  startAuthors: [],
  isStartAuthorFetched: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchStartAuthors: (state, action) => {
      state.startAuthors = action.payload;
      state.isStartAuthorFetched = true;
    },
    fetchProfile: (state, action) => {
      state.user = action.payload;
      state.isUserFetched = true;
    }
  },
});

export const userInitialState = initialState;
export const userSliceReducer = userSlice.reducer;
export const userSliceActions = userSlice.actions;
 