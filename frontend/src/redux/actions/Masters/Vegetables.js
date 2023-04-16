import {GET_VEGETABLES, DELETE_VEGETABLES, POST_VEGETABLES, PUT_VEGETABLES, UPDATE_STATE_VEGETABLES} from '../../constants/Masters/Vegetables';


export const getVegetables = (data) => templateActions(GET_VEGETABLES, data);
export const postVegetables = (data) => templateActions(POST_VEGETABLES, data);
export const putVegetables = (data) => templateActions(PUT_VEGETABLES, data);
export const deleteVegetables = (data) => templateActions(DELETE_VEGETABLES, data);
export const updateStateVegetables = (data) => templateActions(UPDATE_STATE_VEGETABLES, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}