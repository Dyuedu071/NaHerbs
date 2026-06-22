import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'

export default function App() {
  const user = useAuthStore((state) => state.user)
  const initialize = useAuthStore((state) => state.initialize)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link className="text-xl font-bold text-herb-700" to="/">
            NaHerb
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <NavLink className="hover:text-herb-600" to="/">
              Trang chủ
            </NavLink>
            {user ? (
              <>
                <NavLink className="hover:text-herb-600" to="/dashboard">
                  {user.name}
                </NavLink>
                <button className="rounded-lg bg-stone-100 px-3 py-2 hover:bg-stone-200" onClick={logout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavLink className="rounded-lg bg-herb-600 px-3 py-2 text-white hover:bg-herb-700" to="/login">
                Đăng nhập
              </NavLink>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <Outlet />
      </main>
    </div>
  )
}
