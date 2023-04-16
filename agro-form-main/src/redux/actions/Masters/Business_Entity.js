import {GET_BUSINESS_ENTITY, DELETE_BUSINESS_ENTITY, POST_BUSINESS_ENTITY, PUT_BUSINESS_ENTITY, UPDATE_STATE_BUSINESS_ENTITY} from '../../constants/Masters/Business_Entity';


export const getBusinessEntity = (data) => templateActions(GET_BUSINESS_ENTITY, data);
export const postBusinessEntity = (data) => templateActions(POST_BUSINESS_ENTITY, data);
export const putBusinessEntity = (data) => templateActions(PUT_BUSINESS_ENTITY, data);
export const deleteBusinessEntity = (data) => templateActions(DELETE_BUSINESS_ENTITY, data);
export const updateStateBusinessEntity = (data) => templateActions(UPDATE_STATE_BUSINESS_ENTITY, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}