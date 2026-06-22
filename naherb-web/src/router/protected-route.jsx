import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'

export function ProtectedRoute({ children, roles }) {
  const user = useAuthStore((state) => state.user)
  const authReady = useAuthStore((state) => state.authReady)
  const location = useLocation()

  if (!authReady) {
    return <p className="text-center text-stone-500">Đang kiểm tra phiên đăng nhập...</p>
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate replace to="/" />
  }

  return children
}
