import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const isBrowser = typeof window !== 'undefined';
let getFetchToken;

if (isBrowser) {
  getFetchToken = window.localStorage.getItem('access_token');
} else {
  // Handle server-side storage
}

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

instance.defaults.headers.common = {'Authorization': `Bearer ${ getFetchToken }`}

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response && response.data ? response.data : response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return error?.response?.data ?? Promise.reject(error);
});

export default instance;