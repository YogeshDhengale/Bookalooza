import { createSlice } from "@reduxjs/toolkit";

const initialState: { loading: boolean; error: boolean } = {
  loading: false,
  error: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    loading: (state, action) => {
      state.loading = action.payload;
    },
    error: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const alertSliceReducer = alertSlice.reducer;
export const alertSliceActions = alertSlice.actions;
