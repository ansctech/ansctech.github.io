import {GET_CONTAINER_RETURN, POST_CONTAINER_RETURN, DELETE_CONTAINER_RETURN, UPDATE_CONTAINER_RETURN_STATE} from '../../constants/Transactions_Farmers/container-return';


export const getContainerReturn = (data) => templateActions(GET_CONTAINER_RETURN, data);
export const postContainerReturn = (data) => templateActions(POST_CONTAINER_RETURN, data);
export const deleteContainerReturn = (data) => templateActions(DELETE_CONTAINER_RETURN, data);
export const updateContainerReturnState = (data) => templateActions(UPDATE_CONTAINER_RETURN_STATE, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}