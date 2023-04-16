import {UPDATE_STATE_ACCOUNT_GROUPS, DELETE_ACCOUNT_GROUPS, GET_ACCOUNT_GROUPS, POST_ACCOUNT_GROUPS, PUT_ACCOUNT_GROUPS} from '../../constants/Masters/Account_Groups';


export const getAccountGroups = (data) => templateActions(GET_ACCOUNT_GROUPS, data);
export const postAccountGroups = (data) => templateActions(POST_ACCOUNT_GROUPS, data);
export const putAccountGroups = (data) => templateActions(PUT_ACCOUNT_GROUPS, data);
export const deleteAccountGroups = (data) => templateActions(DELETE_ACCOUNT_GROUPS, data);
export const updateStateAccountGroups = (data) => templateActions(UPDATE_STATE_ACCOUNT_GROUPS, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}