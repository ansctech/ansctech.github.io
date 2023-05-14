import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  containerBalance: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "container-balance",
  loaded: false,
};

const containerBalanceSlice = createSlice({
  name: "containerBalance",
  initialState,
  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const containerBalanceActions = containerBalanceSlice.actions;

export default containerBalanceSlice.reducer;
