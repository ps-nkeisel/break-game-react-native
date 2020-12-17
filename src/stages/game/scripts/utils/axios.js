
import config from '../config'
import axios from 'axios'

import Store from '@/store';



const instance = axios.create({
    baseURL: config.baseURL,
    timeout: 5000
});

instance.interceptors.request.use(function (config) {
    const token = Store.getState().user.token;
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

export default instance;
