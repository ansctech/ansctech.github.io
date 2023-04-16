import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getVegetables, updateStateVegetables} from '../../actions/Masters/Vegetables';
import {GET_VEGETABLES, DELETE_VEGETABLES, PUT_VEGETABLES, POST_VEGETABLES} from '../../constants/Masters/Vegetables';



export function* getVegetableSaga() {
    yield takeEvery(GET_VEGETABLES, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `vegetable`,
            });
            yield put(updateStateVegetables({vegetable: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postVegetableSaga() {
    yield takeEvery(POST_VEGETABLES, function* ({payload}) {
        yield put(updateStateVegetables({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `vegetable`,
                data: payload
            });
            yield put(getVegetables());
            yield put(updateStateVegetables({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateVegetables({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putVegetableSaga() {
    yield takeEvery(PUT_VEGETABLES, function* ({payload}) {
        yield put(updateStateVegetables({isLoading: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `vegetable/${payload.id}`,
                data: payload
            });
            yield put(getVegetables());
            yield put(updateStateVegetables({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateVegetables({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteVegetableSaga() {
    yield takeEvery(DELETE_VEGETABLES, function* ({payload}) {
        yield put(updateStateVegetables({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `vegetable/${payload}`,
            });
            yield put(getVegetables());
            yield put(updateStateVegetables({tableLoader: false}));
        } catch (err) {
            yield put(updateStateVegetables({tableLoader: false}));
            console.log(err);
        }
    });
}




export default function* rootSaga() {
    yield all([
        fork(getVegetableSaga),
        fork(postVegetableSaga),
        fork(putVegetableSaga),
        fork(deleteVegetableSaga)
    ]);
};