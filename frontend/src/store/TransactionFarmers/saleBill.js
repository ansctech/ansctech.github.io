import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  saleBill: [],
  selectSaleBill: {},
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "salebill",
  loaded: false,
};

const saleBillSlice = createSlice({
  name: "saleBill",
  initialState,
  reducers: {
    // Action to update sale bill
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const saleBillActions = saleBillSlice.actions;

export default saleBillSlice.reducer;
