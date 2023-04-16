import {UPDATE_STATE_VEGETABLES} from '../../constants/Masters/Vegetables';


const initialState = {
    vegetable: [],
    isModal: false,
    isLoading: false,
    tableLoader: true,
};

const vegetables = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STATE_VEGETABLES:
            return {
                ...state,
                ...action.payload
            }
        default: return state;
    }
};


export default vegetables;
