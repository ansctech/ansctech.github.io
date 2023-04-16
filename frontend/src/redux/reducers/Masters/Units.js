import {UPDATE_STATE_UNITS} from '../../constants/Masters/Units';


const initialState = {
    units: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
};

const units = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE_UNITS:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
};


export default units;