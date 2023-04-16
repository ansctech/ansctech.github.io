import {GET_UNITS, DELETE_UNITS, POST_UNITS, PUT_UNITS, UPDATE_STATE_UNITS} from '../../constants/Masters/Units';


export const getUnits = (data) => templateActions(GET_UNITS, data);
export const postUnits = (data) => templateActions(POST_UNITS, data);
export const putUnits = (data) => templateActions(PUT_UNITS, data);
export const deleteUnits = (data) => templateActions(DELETE_UNITS, data);
export const updateStateUnits = (data) => templateActions(UPDATE_STATE_UNITS, data);




//---------------------> TEMPLATE ACTIONS
export const templateActions = (type, payload) => {
    return {type, payload}
}