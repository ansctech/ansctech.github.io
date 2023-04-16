import {all} from 'redux-saga/effects';
import units from "./Masters/Units";
import vegetables from "./Masters/Vegetables";
import accountGroups from "./Masters/Account_Groups";
import businessEntity from "./Masters/Business_Entity";
import customerGroups from "./Masters/Customer_Groups";
import saleRecord from './Transactions_Customers/Sale_Record';
import moneyRecepit from './Transactions_Customers/Money_Recepit';
import containerReturn from './Transactions_Farmers/container-return';
import containerRecepit from './Transactions_Customers/container-recepit';


export default function* rootSaga(getState) {
    yield all([
        units(),
        vegetables(),
        saleRecord(),
        moneyRecepit(),
        accountGroups(),
        businessEntity(),
        customerGroups(),
        containerReturn(),
        containerRecepit(),
    ]);
};