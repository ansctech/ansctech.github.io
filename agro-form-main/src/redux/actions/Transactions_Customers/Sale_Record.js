import {GET_SALE_RECORD, POST_SALE_RECORD, PUT_SALE_RECORD, DELETE_SALE_RECORD, UPDATE_SALE_RECORD_STATE, GET_SELECT_SALE_RECORD} from '../../constants/Transactions_Customers/Sale_Record';


export const getSaleRecord = (data) => templateActions(GET_SALE_RECORD, data);
export const getSelectSaleRecord = (data) => templateActions(GET_SELECT_SALE_RECORD, data);
export const postSaleRecord = (data) => templateActions(POST_SALE_RECORD, data);
export const putSaleRecord = (data) => templateActions(PUT_SALE_RECORD, data);
export const deleteSaleRecord = (data) => templateActions(DELETE_SALE_RECORD, data);
export const updateSaleRecordState = (data) => templateActions(UPDATE_SALE_RECORD_STATE, data);



//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}