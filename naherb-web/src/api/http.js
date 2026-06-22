import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15_000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let csrfRequest
let refreshRequest
let authHandlers = {
  onRefreshed: () => {},
  onSessionExpired: () => {},
}

export function configureAuthHandlers(handlers) {
  authHandlers = { ...authHandlers, ...handlers }
}

export function ensureCsrf() {
  const hasCookie = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('XSRF-TOKEN='))

  if (hasCookie) {
    return Promise.resolve()
  }

  csrfRequest ??= api.get('/auth/csrf').finally(() => {
    csrfRequest = undefined
  })
  return csrfRequest
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase()
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    await ensureCsrf()
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const requestUrl = originalRequest?.url || ''
    const isAuthRequest = ['/auth/login', '/auth/register', '/auth/refresh']
      .some((path) => requestUrl.includes(path))

    if (
      error.response?.status !== 401
      || !originalRequest
      || originalRequest._retry
      || isAuthRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      refreshRequest ??= api.post('/auth/refresh')
        .then(({ data }) => {
          authHandlers.onRefreshed(data)
          return data
        })
        .finally(() => {
          refreshRequest = undefined
        })

      await refreshRequest
      return api(originalRequest)
    } catch (refreshError) {
      authHandlers.onSessionExpired()
      return Promise.reject(refreshError)
    }
  },
)

export function getApiError(error, fallback = 'Có lỗi xảy ra, vui lòng thử lại') {
  return error.response?.data?.message || fallback
}
