import { lazy } from 'react'
import type { RouteObject } from 'react-router'
const ForgotPassword = lazy(() =>
  import('./screens/ForgotPassword').then((m) => ({
    default: m.ForgotPassword,
  })),
)
const Login = lazy(() =>
  import('./screens/Login').then((m) => ({ default: m.Login })),
)
const Register = lazy(() =>
  import('./screens/Register').then((m) => ({ default: m.Register })),
)

export const authRoutes: RouteObject[] = [
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/forgot-password', Component: ForgotPassword },
]
