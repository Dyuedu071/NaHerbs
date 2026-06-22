import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="text-center">
      <h1 className="text-6xl font-bold text-herb-700">404</h1>
      <p className="mt-4 text-stone-500">Trang bạn tìm không tồn tại.</p>
      <Link className="mt-6 inline-block font-semibold text-herb-600 hover:underline" to="/">
        Về trang chủ
      </Link>
    </section>
  )
}
