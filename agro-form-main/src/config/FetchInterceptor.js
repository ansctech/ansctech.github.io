import axios from 'axios'
import {API_BASE_URL} from './AppConfig'
import {notification} from 'antd';

const service = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000
})


// API response interceptor
service.interceptors.response.use( (response) => {
    return response.data
}, (error) => {

    let notificationParam = {
        message: ''
    }

    // API response error message

    if (error.response.status === 404) {
        notificationParam.message = 'Not Found'
    }
    if (error.response.status === 500) {
        notificationParam.message = 'Internal Server Error'
    }
    if (error.response.status === 508) {
        notificationParam.message = 'Time Out'
    }
    notification.error(notificationParam)

    return Promise.reject(error);
});

export default service;