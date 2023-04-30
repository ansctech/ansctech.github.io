import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  saleRecord: [],
  selectSaleRecord: {},
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "salerecord",
  loaded: false,
};

const saleRecordSlice = createSlice({
  name: "saleRecord",
  initialState,
  reducers: {
    // Action to update account groups
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const saleRecordActions = saleRecordSlice.actions;

export default saleRecordSlice.reducer;
