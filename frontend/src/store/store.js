import { configureStore } from "@reduxjs/toolkit";
import accountGroupsReducer from "./Masters/accountGroups";
import businessEntityReducer from "./Masters/businessEntity";
import customerGroupsReducer from "./Masters/customerGroups";
import vegetablesReducer from "./Masters/vegetables";
import unitsReducer from "./Masters/units";
import saleRecordReducer from "./TransactionCustomers/saleRecord";
import userReducer from "./Authentication/user";
import clientReducer from "./Authentication/client";
import containerBalanceReducer from "./TransactionCustomers/containerBalance";
import containerReturnReducer from "./TransactionCustomers/containerReturn";
import moneyReceiptReducer from "./TransactionCustomers/moneyReceipt";
import saleBillReducer from "./TransactionFarmers/saleBill";

const store = configureStore({
  reducer: {
    accountGroupsReducer,
    businessEntityReducer,
    customerGroupsReducer,
    vegetablesReducer,
    unitsReducer,
    saleRecordReducer,
    userReducer,
    clientReducer,
    moneyReceiptReducer,
    containerReturnReducer,
    containerBalanceReducer,
    saleBillReducer,
  },
});

export default store;
