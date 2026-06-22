import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { DashboardPage } from '../pages/dashboard-page'
import { HomePage } from '../pages/home-page'
import { LoginPage } from '../pages/login-page'
import { NotFoundPage } from '../pages/not-found-page'
import { RegisterPage } from '../pages/register-page'
import { ProtectedRoute } from './protected-route'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
