import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {updateStateCustomerGroups, getCustomerGroups} from '../../actions/Masters/Customer_Groups';
import {GET_CUSTOMER_GROUPS, DELETE_CUSTOMER_GROUPS, PUT_CUSTOMER_GROUPS, POST_CUSTOMER_GROUPS} from '../../constants/Masters/Customer_Groups';


export function* getCustomerGroupSaga() {
    yield takeEvery(GET_CUSTOMER_GROUPS, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `customer`,
            });
            yield put(updateStateCustomerGroups({customerGroups: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postCustomerGroupSaga() {
    yield takeEvery(POST_CUSTOMER_GROUPS, function* ({payload}) {
        yield put(updateStateCustomerGroups({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `customer`,
                data: payload
            });
            yield put(getCustomerGroups());
            yield put(updateStateCustomerGroups({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateCustomerGroups({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putCustomerGroupSaga() {
    yield takeEvery(PUT_CUSTOMER_GROUPS, function* ({payload}) {
        yield put(updateStateCustomerGroups({isLoading: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `customer/${payload.id}`,
                data: payload
            });
            yield put(getCustomerGroups());
            yield put(updateStateCustomerGroups({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateCustomerGroups({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteCustomerGroupSaga() {
    yield takeEvery(DELETE_CUSTOMER_GROUPS, function* ({payload}) {
        yield put(updateStateCustomerGroups({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `customer/${payload}`,
            });
            yield put(getCustomerGroups());
            yield put(updateStateCustomerGroups({tableLoader: false}));
        } catch (err) {
            yield put(updateStateCustomerGroups({tableLoader: false}));
            console.log(err);
        }
    });
}


export default function* rootSaga() {
    yield all([
        fork(getCustomerGroupSaga),
        fork(postCustomerGroupSaga),
        fork(putCustomerGroupSaga),
        fork(deleteCustomerGroupSaga)
    ]);
};