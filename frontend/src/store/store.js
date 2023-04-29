import { configureStore } from "@reduxjs/toolkit";
import accountGroupsReducer from "./Masters/accountGroups";
import businessEntityReducer from "./Masters/businessEntity";
import customerGroupsReducer from "./Masters/customerGroups";
import vegetablesReducer from "./Masters/vegetables";
import unitsReducer from "./Masters/units";
import saleRecordReducer from "./TransactionCustomers/saleRecord";
import userReducer from "./Authentication/user";
import containerReturnReducer from "./TransactionCustomers/containerReturn";
import moneyReceiptReducer from "./TransactionCustomers/moneyReceipt";

const store = configureStore({
  reducer: {
    accountGroupsReducer,
    businessEntityReducer,
    customerGroupsReducer,
    vegetablesReducer,
    unitsReducer,
    saleRecordReducer,
    userReducer,
    moneyReceiptReducer,
    containerReturnReducer,
  },
});

export default store;
