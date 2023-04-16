import {GET_MONEY_RECEPIT, UPDATE_MONEY_RECEPIT, POST_MONEY_RECEPIT, DELETE_MONEY_RECEPIT, PUT_MONEY_RECEPIT} from '../../constants/Transactions_Customers/Money_Recepit';


export const getMoneyRecepit = (data) => templateActions(GET_MONEY_RECEPIT, data);
export const postMoneyRecepit = (data) => templateActions(POST_MONEY_RECEPIT, data);
export const putMoneyRecepit = (data) => templateActions(PUT_MONEY_RECEPIT, data);
export const deleteMoneyRecepit = (data) => templateActions(DELETE_MONEY_RECEPIT, data);
export const updateMoneyRecepit = (data) => templateActions(UPDATE_MONEY_RECEPIT, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}