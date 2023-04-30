import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  moneyReceipt: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "money-receipt",
  loaded: false,
};

const moneyReceiptSlice = createSlice({
  name: "moneyReceipt",
  initialState,
  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const moneyReceiptActions = moneyReceiptSlice.actions;

export default moneyReceiptSlice.reducer;
