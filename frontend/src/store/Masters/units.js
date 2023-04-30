import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  units: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "container",
  loaded: false,
};

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {
    // Action to update account groups
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const unitsActions = unitsSlice.actions;

export default unitsSlice.reducer;
