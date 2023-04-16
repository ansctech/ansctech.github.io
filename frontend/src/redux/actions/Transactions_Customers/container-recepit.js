import {GET_CONTAINER_RECEPIT, POST_CONTAINER_RECEPIT, DELETE_CONTAINER_RECEPIT, UPDATE_CONTAINER_RECEPIT_STATE} from '../../constants/Transactions_Customers/container-recepit';


export const getContainerRecepit = (data) => templateActions(GET_CONTAINER_RECEPIT, data);
export const postContainerRecepit = (data) => templateActions(POST_CONTAINER_RECEPIT, data);
export const deleteContainerRecepit = (data) => templateActions(DELETE_CONTAINER_RECEPIT, data);
export const updateContainerRecepitState = (data) => templateActions(UPDATE_CONTAINER_RECEPIT_STATE, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}