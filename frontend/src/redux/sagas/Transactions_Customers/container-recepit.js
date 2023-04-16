import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getContainerRecepit, updateContainerRecepitState} from '../../actions/Transactions_Customers/container-recepit';
import {GET_CONTAINER_RECEPIT, POST_CONTAINER_RECEPIT, DELETE_CONTAINER_RECEPIT} from '../../../redux/constants/Transactions_Customers/container-recepit';



export function* getContainerRecepitSaga() {
    yield takeEvery(GET_CONTAINER_RECEPIT, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `containerRecepit`,
            });
            yield put(updateContainerRecepitState({containerRecepit: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postContainerRecepitSaga() {
    yield takeEvery(POST_CONTAINER_RECEPIT, function* ({payload}) {
        yield put(updateContainerRecepitState({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `containerRecepit`,
                data: payload
            });
            yield put(getContainerRecepit());
            yield put(updateContainerRecepitState({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateContainerRecepitState({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteContainerRecepitSaga() {
    yield takeEvery(DELETE_CONTAINER_RECEPIT, function* ({payload}) {
        yield put(updateContainerRecepitState({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `containerRecepit/` + payload,
            });
            yield put(getContainerRecepit());
        } catch (err) {
            yield put(updateContainerRecepitState({tableLoader: false}));
            console.log(err);
        }
    });
}





export default function* rootSaga() {
    yield all([
        fork(getContainerRecepitSaga),
        fork(postContainerRecepitSaga),
        fork(deleteContainerRecepitSaga),
    ]);
};