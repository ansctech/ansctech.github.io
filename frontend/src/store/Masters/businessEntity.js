import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  businessEntity: [],
  entityTypes: { loaded: false, entityTypes: [] },
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
    clear: () => initialState,
  },
});

export const businessEntityActions = businessEntitySlice.actions;

export default businessEntitySlice.reducer;
