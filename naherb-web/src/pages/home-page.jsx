import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'

export function HomePage() {
  const user = useAuthStore((state) => state.user)

  return (
    <section className="rounded-3xl bg-herb-900 px-8 py-16 text-white shadow-xl sm:px-14">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-herb-100">NaHerb</p>
      <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
        Nền tảng thảo mộc bắt đầu từ một cấu trúc an toàn.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-herb-100">
        React chỉ giữ thông tin hiển thị của người dùng. JWT được trình duyệt bảo vệ trong HttpOnly cookie.
      </p>
      <Link
        className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-herb-700 hover:bg-herb-50"
        to={user ? '/dashboard' : '/login'}
      >
        {user ? 'Mở dashboard' : 'Bắt đầu'}
      </Link>
    </section>
  )
}
