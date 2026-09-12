import { lazy } from 'react'
import type { RouteObject } from 'react-router'
const ProviderDashboard = lazy(() =>
  import('./screens/Dashboard').then((m) => ({
    default: m.ProviderDashboard,
  })),
)
const BusinessHome = lazy(() =>
  import('./screens/BusinessHome').then((m) => ({ default: m.BusinessHome })),
)

export const businessHomeProviderRoutes: RouteObject[] = [
  { index: true, Component: ProviderDashboard },
  { path: 'companies/:id', Component: BusinessHome },
]
