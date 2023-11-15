import axios from 'axios';
import AuthService from '../services/auth.service';
import { API_URL } from "../helpers/utils";

const instance = axios.create({
    baseURL: API_URL,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    }
});
instance.interceptors.request.use(
    config => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            config.headers['Authorization'] = `Bearer ${user.token}`;
        }
        return config;
    }
);

instance.interceptors.response.use((response) => {
    const { code, auto } = response.data;
    if (code === 401) {
        if (auto === 'yes') {
            console.log('get new token using refresh token')
        }
    }
    return response
}, error => {
    if (error && error.response) {
        const { status, statusText } = error.response;
        if (status === 401 && statusText === "Unauthorized") {
            const userAuth = JSON.parse(localStorage.getItem('user'));
            if (userAuth) {
                var data = {
                    accessToken: userAuth.token,
                    refreshToken: userAuth.refreshToken
                }
                AuthService.refreshToken(data).then((response) => {
                    console.log("refresh token", response);
                    if (response.data) {
                        localStorage.setItem("user", JSON.stringify(response.data));
                        instance.headers['Authorization'] = `Bearer ${response.data.token}`;
                    }
                }).catch(() => {
        
                });
            }
        }
    }
    return Promise.reject(error)

})

const client = () => {
    return {
        get: (url, options = {}) => instance.get(url, { ...options }),
        post: (url, data, options = {}) => instance.post(url, data, { ...options }),
        postForm: (url, data, options = {}) => instance.postForm(url, data, { ...options }),
        put: (url, data, options = {}) => instance.put(url, data, { ...options }),
        delete: (url, options = {}) => instance.delete(url, { ...options }),
        getExport: (url, options = {
            responseType: 'blob'
        }) => instance.get(url, { ...options }),
        postExport: (url, data, options = {
            responseType: 'blob'
        }) => instance.post(url, data, { ...options }),

    };
};

export default client;
