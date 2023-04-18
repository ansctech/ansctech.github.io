import { configureStore } from "@reduxjs/toolkit";
import accountGroupsReducer from "./Masters/accountGroups";
import businessEntityReducer from "./Masters/businessEntity";
import customerGroupsReducer from "./Masters/customerGroups";
import vegetablesReducer from "./Masters/vegetables";
import unitsReducer from "./Masters/units";
import saleRecordReducer from "./TransactionCustomers/saleRecord";

const store = configureStore({
  reducer: {
    accountGroupsReducer,
    businessEntityReducer,
    customerGroupsReducer,
    vegetablesReducer,
    unitsReducer,
    saleRecordReducer,
  },
});

export default store;
