import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import service from "../../../config/FetchInterceptor";
import {updateStateBusinessEntity, getBusinessEntity} from '../../actions/Masters/Business_Entity';
import {GET_BUSINESS_ENTITY, DELETE_BUSINESS_ENTITY, PUT_BUSINESS_ENTITY, POST_BUSINESS_ENTITY} from '../../constants/Masters/Business_Entity';


export function* getBusinessEntitySaga() {
    yield takeEvery(GET_BUSINESS_ENTITY, function* ({payload}) {
        try {
            const data = yield call(service, {
                method: 'get',
                url: `business`,
            });
            yield put(updateStateBusinessEntity({businessEntity: data, tableLoader: false}));
        } catch (err) {
            console.log(err);
        }
    });
}

export function* postBusinessEntitySaga() {
    yield takeEvery(POST_BUSINESS_ENTITY, function* ({payload}) {
        yield put(updateStateBusinessEntity({isLoading: true}));
        try {
            yield call(service, {
                method: 'post',
                url: `business`,
                data: payload
            });
            yield put(getBusinessEntity());
            yield put(updateStateBusinessEntity({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateStateBusinessEntity({isLoading: false}));
            console.log(err);
        }
    });
}

export function* putBusinessEntitySaga() {
    yield takeEvery(PUT_BUSINESS_ENTITY, function* ({payload}) {
        yield put(updateStateBusinessEntity({isLoading: true}));
        try {
            yield call(service, {
                method: 'put',
                url: `business/${payload.id}`,
                data: payload
            });
            yield put(getBusinessEntity());
            yield put(updateStateBusinessEntity({isLoading: false, isModal: false}));
        } catch (err) {
            yield put(updateStateBusinessEntity({isLoading: false}));
            console.log(err);
        }
    });
}

export function* deleteBusinessEntitySaga() {
    yield takeEvery(DELETE_BUSINESS_ENTITY, function* ({payload}) {
        yield put(updateStateBusinessEntity({tableLoader: true}));
        try {
            yield call(service, {
                method: 'delete',
                url: `business/${payload}`,
            });
            yield put(getBusinessEntity());
            yield put(updateStateBusinessEntity({tableLoader: false}));
        } catch (err) {
            yield put(updateStateBusinessEntity({tableLoader: false}));
            console.log(err);
        }
    });
}



export default function* rootSaga() {
    yield all([
        fork(getBusinessEntitySaga),
        fork(postBusinessEntitySaga),
        fork(putBusinessEntitySaga),
        fork(deleteBusinessEntitySaga)
    ]);
};