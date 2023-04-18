import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerGroups: [],
  isModal: false,
  isLoading: false,
  tableLoader: true,
  url: "custgroup",
  loaded: false,
};

const customerGroupsSlice = createSlice({
  name: "customerGroups",
  initialState,
  reducers: {
    update: (state, { payload }) => ({ ...state, ...payload }),
  },
});

export const customerGroupsActions = customerGroupsSlice.actions;

export default customerGroupsSlice.reducer;
