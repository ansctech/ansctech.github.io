import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = JSON.parse(localStorage.getItem("agroCurrentUser")) || {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to update user details
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => ({}),
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
