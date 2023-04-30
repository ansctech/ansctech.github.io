import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState =
  JSON.parse(localStorage.getItem("agroCurrentClient")) || {};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    // Action to update client details
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => ({}),
  },
});

export const clientActions = clientSlice.actions;

export default clientSlice.reducer;
