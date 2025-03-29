import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { themeSliceReducer } from "./ThemeSlice/ThemeSlice";
import { bookSliceReducer } from "./BooksSlice/BooksSlice";
import { alertSliceReducer } from "./Alert/Alert";
import { userInitialState, userSliceReducer } from "./UsersSlice/UserSlice";
import { orderInitialState, orderSliceReducer } from "./OrderSlice/OrderSlice";
import { bankInitialState, bankSliceReducer } from "./BankSlice/BankSlice";
import { earningInitialState, earningSliceReducer } from "./EarningSlice/EarningSlice";

// Combine all reducers
const appReducer = combineReducers({
  alert: alertSliceReducer,
  bank: bankSliceReducer,
  books: bookSliceReducer,
  orders: orderSliceReducer,
  themes: themeSliceReducer,
  user: userSliceReducer,
  earning: earningSliceReducer
});

// Root reducer to handle global reset
const rootReducer = (state: any, action: any) => {
    if (action.type === "RESET_STORE") {
      return {
        ...state,
        bank: bankInitialState,  // Reset bank-related data if needed
        orders: orderInitialState, // Reset orders
        user: userInitialState,  // Reset user state
        earning: earningInitialState,  // Reset earning state
      };
    }
    return appReducer(state, action);
  };

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
