import { lazy } from 'react'
import type { RouteObject } from 'react-router'
const CreateService = lazy(() =>
  import('./screens/CreateService').then((m) => ({ default: m.CreateService })),
)
const ProviderServices = lazy(() =>
  import('./screens/Services').then((m) => ({ default: m.ProviderServices })),
)

export const servicesProviderRoutes: RouteObject[] = [
  { path: 'companies/:id/services', Component: ProviderServices },
  { path: 'companies/:id/services/create', Component: CreateService },
  { path: 'companies/:id/services/:serviceId/edit', Component: CreateService },
]
