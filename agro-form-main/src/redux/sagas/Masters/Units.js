import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {getUnits, updateStateUnits} from '../../actions/Masters/Units';
import {GET_UNITS, DELETE_UNITS, PUT_UNITS, POST_UNITS} from '../../constants/Masters/Units';


export function* getUnitSaga() {
    yield takeEvery(GET_UNITS, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `units`,
            });
            yield put(updateStateUnits({units: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postUnitSaga() {
    yield takeEvery(POST_UNITS, function* ({payload}) {
        yield put(updateStateUnits({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `units`,
                data: payload
            });
            yield put(getUnits());
            yield put(updateStateUnits({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateUnits({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putUnitSaga() {
    yield takeEvery(PUT_UNITS, function* ({payload}) {
        yield put(updateStateUnits({isLoading: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `units/${payload.id}`,
                data: payload
            });
            yield put(getUnits());
            yield put(updateStateUnits({isModal: false, isLoading: false}));
        } catch (err) {
            yield put(updateStateUnits({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteUnitSaga() {
    yield takeEvery(DELETE_UNITS, function* ({payload}) {
        yield put(updateStateUnits({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `units/${payload}`,
            });
            yield put(getUnits());
            yield put(updateStateUnits({tableLoader: false}));
        } catch (err) {
            yield put(updateStateUnits({tableLoader: false}));
            console.log(err);
        }
    });
}



export default function* rootSaga() {
    yield all([
        fork(getUnitSaga),
        fork(postUnitSaga),
        fork(putUnitSaga),
        fork(deleteUnitSaga)
    ]);
};