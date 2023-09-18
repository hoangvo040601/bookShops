import axios from 'axios';
import { router } from 'next/router';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const isBrowser = typeof window !== 'undefined';
let getFetchToken;

if (isBrowser) {
  getFetchToken = window.localStorage.getItem('access_token');
} else {
  // Xử lý lưu trữ phía máy chủ
}

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const handleRefreshToken = async () => {
  try {
    const res = await instance.get('/api/v1/auth/refresh');
    if (res && res.data) {
      return res.data.access_token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const NO_RETRY_HEADER = 'x-no-retry'

instance.defaults.headers.common['Authorization'] = `Bearer ${getFetchToken}`;

instance.interceptors.request.use(function (config) {
  // Làm một số việc trước khi gửi yêu cầu
  return config;
}, function (error) {
  // Xử lý lỗi yêu cầu
  return Promise.reject(error);
});

// Thêm một interceptor cho phản hồi
instance.interceptors.response.use(function (response) {
  // Bất kỳ mã trạng thái nào trong khoảng 2xx sẽ gây kích hoạt hàm này
  // Xử lý dữ liệu phản hồi
  return response && response.data ? response.data : response;
}, async function (error) {
  // Bất kỳ mã trạng thái nào nằm ngoài khoảng 2xx sẽ gây kích hoạt hàm này
  // Xử lý lỗi phản hồi
  if (error.config && error.response && +error.response.status === 401 && !error.config.headers[NO_RETRY_HEADER]) {
    const access_token = await handleRefreshToken();
    error.config.headers[NO_RETRY_HEADER] = 'true' 
    if (access_token) {
      error.config.headers['Authorization'] = `Bearer ${access_token}`;
      localStorage.setItem('access_token', access_token);
      return instance.request(error.config);
    }
    if(error.config && error.response && +error.response.status === 400 && error.config.url==='/api/v1/auth/refresh'){
      router.push('/login')
    }
  }
  return error?.response?.data ?? Promise.reject(error);
});

export default instance;