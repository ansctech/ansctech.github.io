import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getContainerReturn, updateContainerReturnState} from '../../actions/Transactions_Farmers/container-return';
import {GET_CONTAINER_RETURN, POST_CONTAINER_RETURN, DELETE_CONTAINER_RETURN} from '../../../redux/constants/Transactions_Farmers/container-return';



export function* getContainerReturnSaga() {
    yield takeEvery(GET_CONTAINER_RETURN, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `containerReturn`,
            });
            yield put(updateContainerReturnState({containerReturn: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postContainerReturnSaga() {
    yield takeEvery(POST_CONTAINER_RETURN, function* ({payload}) {
        yield put(updateContainerReturnState({isLoading: true}));
        try {
            const data = yield call(service, {
                method: 'post',
                url: `containerReturn`,
                data: payload
            });
            yield put(getContainerReturn());
            yield put(updateContainerReturnState({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateContainerReturnState({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteContainerReturnSaga() {
    yield takeEvery(DELETE_CONTAINER_RETURN, function* ({payload}) {
        yield put(updateContainerReturnState({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `containerReturn/` + payload,
            });
            yield put(getContainerReturn());
        } catch (err) {
            yield put(updateContainerReturnState({tableLoader: false}));
            console.log(err);
        }
    });
}





export default function* rootSaga() {
    yield all([
        fork(getContainerReturnSaga),
        fork(postContainerReturnSaga),
        fork(deleteContainerReturnSaga),
    ]);
};