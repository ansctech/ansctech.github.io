import {GET_CUSTOMER_GROUPS, DELETE_CUSTOMER_GROUPS, POST_CUSTOMER_GROUPS, PUT_CUSTOMER_GROUPS, UPDATE_STATE_CUSTOMER_GROUPS} from '../../constants/Masters/Customer_Groups';


export const getCustomerGroups = (data) => templateActions(GET_CUSTOMER_GROUPS, data);
export const postCustomerGroups = (data) => templateActions(POST_CUSTOMER_GROUPS, data);
export const putCustomerGroups = (data) => templateActions(PUT_CUSTOMER_GROUPS, data);
export const deleteCustomerGroups = (data) => templateActions(DELETE_CUSTOMER_GROUPS, data);
export const updateStateCustomerGroups = (data) => templateActions(UPDATE_STATE_CUSTOMER_GROUPS, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}

