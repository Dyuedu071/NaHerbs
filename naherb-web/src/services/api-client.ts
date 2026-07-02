import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { clearCsrfToken, getCsrfToken } from "./csrf";

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (method && ["post", "put", "patch", "delete"].includes(method)) {
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

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _csrfRetry?: boolean;
};

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

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (method && ["post", "put", "patch", "delete"].includes(method)) {
      clearCsrfToken();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const method = originalRequest?.method?.toLowerCase();
    const isMutation = !!method && ["post", "put", "patch", "delete"].includes(method);

    if (
      error.response?.status === 403 &&
      originalRequest &&
      isMutation &&
      !originalRequest._csrfRetry
    ) {
      originalRequest._csrfRetry = true;
      clearCsrfToken();
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers["X-XSRF-TOKEN"] = csrfToken;
        return AXIOS_INSTANCE(originalRequest);
      }
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/google") ||
        originalRequest.url?.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

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
        await AXIOS_INSTANCE.post("/auth/refresh");
        isRefreshing = false;
        processQueue(null);
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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
    source.cancel("Query was cancelled");
  };

  return promise;
};
