import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  businessEntity: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "entity",
  loaded: false,
};

const businessEntitySlice = createSlice({
  name: "businessEntity",
  initialState,
  reducers: {
    // Action to update account groups
    update: (state, { payload }) => ({ ...state, ...payload }),
  },
});

export const businessEntityActions = businessEntitySlice.actions;

export default businessEntitySlice.reducer;
