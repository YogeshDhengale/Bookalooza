import { type_earning_slice_state } from "@/types/EarningTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: type_earning_slice_state = {
    earnings: [],
    isEarningsFetched: false,
    transferredEarnings: [],
    isTransferredEarningsFetched: false,
};

const earningSlice = createSlice({
  name: "earning",
  initialState,
  reducers: {
    fetchEarnings: (state, action) => {
      state.earnings = action.payload;
      state.isEarningsFetched = true;
    },
    fetchTransferredEarnings: (state, action) => {
      state.transferredEarnings = action.payload;
      state.isTransferredEarningsFetched = true;
    }
  },
});

export const earningInitialState = initialState;
export const earningSliceReducer = earningSlice.reducer;
export const earningSliceActions = earningSlice.actions;
 