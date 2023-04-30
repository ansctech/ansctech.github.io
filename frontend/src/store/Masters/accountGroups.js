import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  accountGroups: [],
  isModal: false,
  tableLoader: true,
  url: "accgroup",
  loaded: false,
};

const accountGroupsSlice = createSlice({
  name: "Account_Groups",
  initialState,
  reducers: {
    // Action to update account groups
    update: (state, { payload }) => ({ ...state, ...payload }),
    clear: () => initialState,
  },
});

export const accountGroupsActions = accountGroupsSlice.actions;

export default accountGroupsSlice.reducer;
