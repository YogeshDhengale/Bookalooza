
import { type_order, type_order_slice_state } from '@/types/OrderTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: type_order_slice_state = {
  orders: [],
  order: null,
  isOrderFetched: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrders: (state, action: PayloadAction<type_order[]>) => {
      state.orders = action.payload;
      state.isOrderFetched = true;
    },
    fetchOrder: (state, action: PayloadAction<type_order>) => {
      state.order = action.payload;
    }
  },
});

export const orderInitialState = initialState;
export const orderSliceReducer = orderSlice.reducer;
export const orderSliceActions = orderSlice.actions;
