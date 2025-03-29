import { type_bank_account, type_bank_account_slice_state } from "@/types/BankTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: type_bank_account_slice_state = {
  bankAccounts: [],
  isBankAccountFetched: false,
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    fetchUserBank: (state, action) => {
      state.bankAccounts = action.payload;
      state.isBankAccountFetched = true;
    },
    addBankAccount: (state, action: PayloadAction<type_bank_account>) => {
      state.bankAccounts.push(action.payload);
    },
    deleteBankAccount: (state, action: PayloadAction<string>) => {
      const index = state.bankAccounts.findIndex((account) => account.id === action.payload);
      if (index !== -1) state.bankAccounts.splice(index, 1); // More efficient than filtering
    },
  },
});

export const bankInitialState = initialState;
export const bankSliceReducer = bankSlice.reducer;
export const bankSliceActions = bankSlice.actions;
