import axios from 'axios';

var loader = document.getElementsByClassName('overlay-loader')[0];

const api = axios.create({
    baseURL: 'https://appcore.dlivrd.io/',
    // baseURL: 'http://11.11.12.29:8000/',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

api.interceptors.request.use(function (config) {

    const token = localStorage.getItem("session_id");

    if (token) {
        config.headers.Session =  token;
    }
    loader.style.visibility = 'visible';

    return config;
});


api.interceptors.response.use(
    response => {
        loader.style.visibility = 'hidden';
        if (response.status === 200 || response.status === 201) {
            return Promise.resolve(response);
        }
    },
    error => {
        loader.style.visibility = 'hidden';
        return Promise.reject(error);
    }
);


export default api;