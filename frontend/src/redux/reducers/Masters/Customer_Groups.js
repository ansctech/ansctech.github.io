import {UPDATE_STATE_CUSTOMER_GROUPS} from '../../constants/Masters/Customer_Groups';


const initialState = {
    customerGroups: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
};

const customerGroups = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE_CUSTOMER_GROUPS:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
};


export default customerGroups;