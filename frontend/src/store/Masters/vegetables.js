import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vegetables: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "items",
  loaded: false,
};

const vegetablesSlice = createSlice({
  name: "vegetables",
  initialState,
  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const vegetablesActions = vegetablesSlice.actions;

export default vegetablesSlice.reducer;
