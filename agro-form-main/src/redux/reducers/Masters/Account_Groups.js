import {UPDATE_STATE_ACCOUNT_GROUPS} from '../../constants/Masters/Account_Groups';


const initialState = {
    accountGroups: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
}

const accountGroups = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE_ACCOUNT_GROUPS:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}


export default accountGroups;
