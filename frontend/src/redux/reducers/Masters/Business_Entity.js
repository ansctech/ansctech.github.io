import {UPDATE_STATE_BUSINESS_ENTITY} from '../../constants/Masters/Business_Entity';


const initialState = {
    businessEntity: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
};

const businessEntity = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE_BUSINESS_ENTITY:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
};


export default businessEntity;