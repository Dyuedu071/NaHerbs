import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/http'
import { useAuthStore } from '../stores/auth-store'

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const navigate = useNavigate()
  const location = useLocation()
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    try {
      await login({
        email: form.get('email'),
        password: form.get('password'),
      })
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setMessage(getApiError(error, 'Đăng nhập không thành công'))
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <h1 className="text-2xl font-bold text-herb-900">Đăng nhập</h1>
      <p className="mt-2 text-sm text-stone-500">JWT sẽ không được trả về cho mã JavaScript.</p>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Email
          <input
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-herb-500 focus:ring-2 focus:ring-herb-100"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="block text-sm font-medium">
          Mật khẩu
          <input
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-herb-500 focus:ring-2 focus:ring-herb-100"
            name="password"
            required
            type="password"
          />
        </label>

        {message && <p className="text-sm text-red-600">{message}</p>}
        <button
          className="w-full rounded-xl bg-herb-600 px-4 py-3 font-semibold text-white hover:bg-herb-700 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Chưa có tài khoản?{' '}
        <Link className="font-semibold text-herb-600 hover:underline" to="/register">
          Đăng ký
        </Link>
      </p>
    </section>
  )
}
