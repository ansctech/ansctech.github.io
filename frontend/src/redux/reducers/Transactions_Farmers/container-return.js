import {UPDATE_CONTAINER_RETURN_STATE} from '../../constants/Transactions_Farmers/container-return';


const initialState = {
    containerReturn: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
}

const containerReturn = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CONTAINER_RETURN_STATE:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}


export default containerReturn;
