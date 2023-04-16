import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getSaleRecord, updateSaleRecordState, getSelectSaleRecord} from '../../actions/Transactions_Customers/Sale_Record';
import {GET_SALE_RECORD, POST_SALE_RECORD, DELETE_SALE_RECORD, PUT_SALE_RECORD, GET_SELECT_SALE_RECORD} from '../../../redux/constants/Transactions_Customers/Sale_Record';



export function* getSaleRecordSaga() {
    yield takeEvery(GET_SALE_RECORD, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `saleRecord`,
            });
            yield put(updateSaleRecordState({saleRecord: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* getSelectSaleRecordSaga() {
    yield takeEvery(GET_SELECT_SALE_RECORD, function* ({payload}) {
        yield put(updateSaleRecordState({selectTableLoader: true}));
        try {
            const data = yield call(service, {
                method: 'get',
                url: `saleRecord/` + payload,
            });
            yield put(updateSaleRecordState({selectSaleRecord: data, selectTableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postSaleRecordSaga() {
    yield takeEvery(POST_SALE_RECORD, function* ({payload}) {
        yield put(updateSaleRecordState({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `saleRecord`,
                data: payload
            });
            yield put(getSaleRecord());
            yield put(updateSaleRecordState({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateSaleRecordState({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putSaleRecordSaga() {
    yield takeEvery(PUT_SALE_RECORD, function* ({payload}) {
        yield put(updateSaleRecordState({selectTableLoader: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `saleRecord/` + payload.data.id,
                data: payload.data
            });
            yield put(getSelectSaleRecord(payload.pageId));
            yield put(updateSaleRecordState({selectTableLoader: false}));
        } catch (err) {
            yield put(updateSaleRecordState({selectTableLoader: false}));
            console.log(err);
        }
    });
}

export function* deleteSaleRecordSaga() {
    yield takeEvery(DELETE_SALE_RECORD, function* ({payload}) {
        yield put(updateSaleRecordState({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `saleRecord/` + payload,
            });
            yield put(getSaleRecord());
        } catch (err) {
            yield put(updateSaleRecordState({tableLoader: false}));
            console.log(err);
        }
    });
}




export default function* rootSaga() {
    yield all([
        fork(getSaleRecordSaga),
        fork(getSelectSaleRecordSaga),
        fork(putSaleRecordSaga),
        fork(postSaleRecordSaga),
        fork(deleteSaleRecordSaga)
    ]);
};