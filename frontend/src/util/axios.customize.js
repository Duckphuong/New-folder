import axiosLib from 'axios';

const axios = axiosLib.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const authData = JSON.parse(localStorage.getItem('authData'));

        config.headers.Authorization = `Bearer ${authData?.access_token || ''}`;

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response && response.data) return response.data;
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        console.log(error);
        if (error?.response?.data) {
            return error?.response?.data;
        }
        return Promise.reject(error);
    }
);

export default axios;
