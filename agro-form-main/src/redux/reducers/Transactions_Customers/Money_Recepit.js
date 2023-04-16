import {UPDATE_MONEY_RECEPIT} from '../../constants/Transactions_Customers/Money_Recepit';


const initialState = {
    moneyRecepit: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
}

const moneyRecepit = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_MONEY_RECEPIT:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}


export default moneyRecepit;
