import { create } from 'zustand'
import {
  api,
  configureAuthHandlers,
  ensureCsrf,
  getApiError,
} from '../api/http'

let initialization

export const useAuthStore = create((set, get) => ({
  user: null,
  authReady: false,
  loading: false,
  error: null,

  initialize: () => {
    if (get().authReady) {
      return Promise.resolve()
    }
    if (initialization) {
      return initialization
    }

    initialization = (async () => {
      try {
        await ensureCsrf()
        const { data } = await api.get('/auth/me')
        set({ user: data })
      } catch (error) {
        const isUnauthenticated = error.response?.status === 401
        set({
          user: null,
          error: isUnauthenticated ? null : getApiError(error, 'Không thể kết nối tới máy chủ'),
        })
      } finally {
        set({ authReady: true })
        initialization = undefined
      }
    })()

    return initialization
  },

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', credentials)
      set({ user: data, authReady: true })
      return data
    } catch (error) {
      const message = getApiError(error, 'Đăng nhập không thành công')
      set({ user: null, error: message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  register: async (form) => {
    set({ loading: true, error: null })
    try {
      await api.post('/auth/register', form)
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      set({ user: data, authReady: true })
      return data
    } catch (error) {
      set({ error: getApiError(error, 'Đăng ký không thành công') })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      await api.post('/auth/logout')
    } catch (error) {
      set({ error: getApiError(error, 'Đăng xuất không thành công') })
    } finally {
      set({ user: null, authReady: true, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

configureAuthHandlers({
  onRefreshed: (user) => useAuthStore.setState({
    user,
    authReady: true,
    error: null,
  }),
  onSessionExpired: () => useAuthStore.setState({
    user: null,
    authReady: true,
  }),
})
