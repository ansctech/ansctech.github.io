import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {updateStateAccountGroups, getAccountGroups} from '../../actions/Masters/Account_Groups';
import {GET_ACCOUNT_GROUPS, DELETE_ACCOUNT_GROUPS, PUT_ACCOUNT_GROUPS, POST_ACCOUNT_GROUPS} from '../../constants/Masters/Account_Groups';


export function* getAccountGroupSaga() {
    yield takeEvery(GET_ACCOUNT_GROUPS, function* ({payload}) {
        try {
            const data = yield call(service, {
                url: `account`,
                method: 'get',
            });
            yield put(updateStateAccountGroups({accountGroups: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postAccountGroupSaga() {
    yield takeEvery(POST_ACCOUNT_GROUPS, function* ({payload}) {
        yield put(updateStateAccountGroups({isLoading: true}));
        try {
            yield call(service, {
                url: `account`,
                method: 'post',
                data: payload
            });
            yield put(getAccountGroups());
            yield put(updateStateAccountGroups({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateAccountGroups({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putAccountGroupSaga() {
    yield takeEvery(PUT_ACCOUNT_GROUPS, function* ({payload}) {
        yield put(updateStateAccountGroups({isLoading: true}));
        try {
            yield call(service, {
                url: `account/${payload.id}`,
                method: 'put',
                data: payload
            });
            yield put(getAccountGroups());
            yield put(updateStateAccountGroups({isModal: false}));
        } catch (err) {
            yield put(updateStateAccountGroups({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteAccountGroupSaga() {
    yield takeEvery(DELETE_ACCOUNT_GROUPS, function* ({payload}) {
        yield put(updateStateAccountGroups({tableLoader: true}));
        try {
            yield call(service, {
                url: `account/${payload}`,
                method: 'delete',
            });
            yield put(getAccountGroups());
            yield put(updateStateAccountGroups({tableLoader: false}));
        } catch (err) {
            yield put(updateStateAccountGroups({tableLoader: false}));
            console.log(err);
        }
    });
}



export default function* rootSaga() {
    yield all([
        fork(getAccountGroupSaga),
        fork(postAccountGroupSaga),
        fork(putAccountGroupSaga),
        fork(deleteAccountGroupSaga)
    ]);
};