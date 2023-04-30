import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  containerReturn: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "container-return",
  loaded: false,
};

const containerReturnSlice = createSlice({
  name: "containerReturn",
  initialState,
  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const containerReturnActions = containerReturnSlice.actions;

export default containerReturnSlice.reducer;
