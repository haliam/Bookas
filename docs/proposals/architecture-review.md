# Architecture Review & Feature-Based Restructuring Proposal

Date: 2026-08-20

## 1. Context

The app is currently organized by **audience/technical layer** (`screens/public`, `screens/provider`, `screens/extra`, `components/business-home`) rather than by **domain feature**. Screens mix data selection, filtering/sorting/pagination, form state, and JSX in a single file (e.g. `ProviderAppointments.tsx`, `CreateCompany.tsx`). Data access has no boundary — screens import the static `mockData.ts` module directly. There is no `hooks/`, `api/`, or `types/` layer.

This is fine at the current size, but will not scale as the customer-facing booking flow and real API integration are added.

## 2. Key problems identified

- No vertical slicing / feature-based organization.
- Business/derived logic (today's appointments, pending redirects, filter/group/paginate) lives inside screen components instead of hooks.
- No data-access boundary — screens depend directly on the mock data module.
- Domain types (`Company`, `Service`, `Appointment`) are bundled with mock fixtures instead of owning their own module.
- `routes.tsx` is a single flat, eagerly-imported list that will keep growing.
- No premature over-abstraction — the risk is under-structuring, not over-engineering, so the fix is low-risk and incremental.

## 3. Proposed architecture

- **Feature-based (vertical slice) organization**: group by domain (`appointments`, `companies`, `services`, `scheduling`, `auth`, etc.), each owning its screens, local components, hooks, types, and data-access functions.
- **Colocation over premature sharing**: keep feature-specific code inside the feature; promote to `shared/` only when reused across ≥2 features (mirrors what `components/business-home` already does well).
- **Thin data-access boundary per feature** (`api/`): wraps the mock arrays today (`getAppointments()`, `getCompany(id)`); swappable for real HTTP calls later without touching screens.
- **Custom hooks for derived/business logic**: e.g. `useAppointmentsList(filter)`, `useCreateCompanyForm()`, extracted from screens for testability and reuse.
- **Domain types own their module** per feature, separate from mock fixtures.
- **`components/ui`, navigation, and layouts stay untouched** — they are legitimate shared layers.
- **No global state library needed yet**; introduce server-state tooling (e.g. React Query) only once real API calls replace mock data, keeping it separate from `AppContext`'s client/session state.
- **Per-feature route tables** composed in `app/routes.tsx`, enabling future `React.lazy` code-splitting.

## 4. Proposed folder structure

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx                 # composes route objects from each feature
│   ├── providers/
│   │   └── AppContext.tsx
│   └── layouts/
│       └── ProviderLayout.tsx
├── features/
│   ├── auth/                      # Login, Register, ForgotPassword
│   ├── onboarding/                # Onboarding, ProviderOnboarding, Offline
│   ├── business-home/             # already close to this shape today
│   │   ├── screens/BusinessHome.tsx
│   │   ├── components/
│   │   └── hooks/useBusinessHomeSummary.ts
│   ├── appointments/
│   │   ├── screens/ (ProviderAppointments, ProviderAppointmentDetail)
│   │   ├── components/
│   │   ├── hooks/useAppointmentsList.ts
│   │   ├── model/appointment.types.ts
│   │   └── api/appointments.api.ts
│   ├── companies/
│   │   ├── screens/ (Companies, CreateCompany)
│   │   ├── hooks/useCreateCompanyForm.ts
│   │   ├── model/company.types.ts
│   │   └── api/companies.api.ts
│   ├── services/
│   │   ├── screens/ (Services, CreateService)
│   │   ├── model/service.types.ts
│   │   └── api/services.api.ts
│   ├── scheduling/                # Calendar, Hours, BlockTime
│   ├── notifications/
│   ├── reports/
│   ├── settings-profile/          # ProviderProfile, ProviderSettings
│   └── landing/
├── shared/
│   ├── components/
│   │   ├── ui/                    # unchanged shadcn/Radix kit
│   │   ├── navigation/            # BottomNav, TopBar
│   │   └── figma/ImageWithFallback.tsx
│   └── lib/                       # e.g. formatDayLabel and other extracted helpers
└── styles/
```

## 5. Implementation phases

### Phase 1 — Foundation (no behavior change)

- Create `src/features/` and `src/shared/` directories.
- Move `components/ui`, `components/navigation`, `components/figma` to `shared/components/*` (path/import updates only).
- Move `context/AppContext.tsx` to `app/providers/AppContext.tsx`.
- Split `data/mockData.ts` types into per-domain `model/*.types.ts` files (kept re-exported from a compat module initially to avoid breaking imports in one pass).

### Phase 2 — Migrate features one at a time

For each feature (`business-home`, `appointments`, `companies`, `services`, `scheduling`, `notifications`, `reports`, `settings-profile`, `auth`, `onboarding`, `landing`):

- Move its screen(s) and private components into `features/<name>/screens` and `features/<name>/components`.
- Introduce `features/<name>/api/*.api.ts` wrapping the relevant mock arrays.
- Update imports in `routes.tsx`.
- Verify the app builds and routes still resolve after each feature move (incremental, low-risk commits).

### Phase 3 — Extract business logic into hooks

- `useAppointmentsList(filter)`: filtering, sorting, grouping-by-date, and pagination logic currently inline in `ProviderAppointments.tsx`.
- `useBusinessHomeSummary()`: today/pending/weekly derivations currently inline in `BusinessHome.tsx`.
- `useCreateCompanyForm()`: multi-step form state/validation currently inline in `CreateCompany.tsx`.
- Apply the same pattern to remaining screens with non-trivial local logic (`Companies`, `Services`, `Dashboard`).

### Phase 4 — Route table decomposition

- Move route definitions into each feature (`features/<name>/routes.tsx`), composed by `app/routes.tsx`.
- Evaluate `React.lazy` per feature route to enable code-splitting.

### Phase 5 — Data-layer readiness

- Once a real backend is available, replace mock-array reads inside `api/*.api.ts` with actual HTTP calls, without touching screens or hooks.
- Introduce a server-state library (e.g. React Query) at this point, keeping it isolated from `AppContext`'s client/session state.

Each phase is independently shippable and reversible; no phase requires a big-bang rewrite.
