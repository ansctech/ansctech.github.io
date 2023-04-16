import {UPDATE_CONTAINER_RECEPIT_STATE} from '../../constants/Transactions_Customers/container-recepit';


const initialState = {
    containerRecepit: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
}

const containerRecepit = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CONTAINER_RECEPIT_STATE:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}


export default containerRecepit;
