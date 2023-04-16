import {UPDATE_SALE_RECORD_STATE} from '../../constants/Transactions_Customers/Sale_Record';


const initialState = {
    saleRecord: [],
    selectSaleRecord: {},
    selectTableLoader: false,
    isModal: false,
    isLoading: false,
    tableLoader: true,
}

const saleRecord = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SALE_RECORD_STATE:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
}


export default saleRecord;
