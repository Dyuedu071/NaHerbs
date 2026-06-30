import axios, { AxiosRequestConfig } from 'axios';
import { clearCsrfToken, getCsrfToken } from './csrf';

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      config.headers = config.headers ?? {};
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor tự động Refresh Token khi gặp lỗi 401 (Access Token hết hạn)
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
      clearCsrfToken();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Chỉ thực hiện refresh khi trả về lỗi 401 và request chưa được thử lại lần nào (_retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tránh lặp vô hạn nếu API refresh hoặc login trả về 401
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // Nếu đang có một tiến trình refresh token đang chạy, xếp hàng các request sau vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API làm mới token (Backend tự động ghi đè Cookie mới)
        await AXIOS_INSTANCE.post('/auth/refresh');
        isRefreshing = false;
        processQueue(null);

        // Thực hiện lại request gốc ban đầu với Cookie mới
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Nếu refresh thất bại (Refresh Token hết hạn sau 7 ngày), chuyển hướng về trang đăng nhập
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Custom instance cho Orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
