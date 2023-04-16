import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getMoneyRecepit, updateMoneyRecepit} from '../../actions/Transactions_Customers/Money_Recepit';
import {GET_MONEY_RECEPIT, POST_MONEY_RECEPIT, DELETE_MONEY_RECEPIT, PUT_MONEY_RECEPIT} from '../../../redux/constants/Transactions_Customers/Money_Recepit';



export function* getMoneyRecepitSaga() {
    yield takeEvery(GET_MONEY_RECEPIT, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `moneyRecepit`,
            });
            yield put(updateMoneyRecepit({moneyRecepit: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postMoneyRecepitSaga() {
    yield takeEvery(POST_MONEY_RECEPIT, function* ({payload}) {
        yield put(updateMoneyRecepit({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `moneyRecepit`,
                data: payload
            });
            yield put(getMoneyRecepit());
            yield put(updateMoneyRecepit({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateMoneyRecepit({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putMoneyRecepitSaga() {
    yield takeEvery(PUT_MONEY_RECEPIT, function* ({payload}) {
        yield put(updateMoneyRecepit({isLoading: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `moneyRecepit/` + payload.id,
                data: payload
            });
            yield put(getMoneyRecepit());
            yield put(updateMoneyRecepit({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateMoneyRecepit({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteMoneyRecepitSaga() {
    yield takeEvery(DELETE_MONEY_RECEPIT, function* ({payload}) {
        yield put(updateMoneyRecepit({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `moneyRecepit/` + payload,
            });
            yield put(getMoneyRecepit());
        } catch (err) {
            yield put(updateMoneyRecepit({tableLoader: false}));
            console.log(err);
        }
    });
}





export default function* rootSaga() {
    yield all([
        fork(getMoneyRecepitSaga),
        fork(postMoneyRecepitSaga),
        fork(putMoneyRecepitSaga),
        fork(deleteMoneyRecepitSaga),
    ]);
};