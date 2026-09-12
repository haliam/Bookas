---
title: Bookas – Frontend Implementation Plan
description: Step-by-step plan to wire the Bookas frontend to the BookPro API, replacing all mock data.
version: 1.0.0
date: 2026-06-06
author: Haliam Perez
---

# Frontend Implementation Plan

**Goal:** Replace all mock data with real API calls while keeping existing screens and design language intact.
**Approach:** Phase by phase — each phase is independently shippable and testable.

---

## Phase 1 — Foundation (API layer + auth state)

_No screen changes. Pure plumbing. Unblocks everything else._

### 1.1 Create `src/api/` folder

One file per domain, each exporting typed async functions:

```
src/api/
  client.ts       ← shared fetch wrapper
  auth.ts         ← login, register, forgotPassword, resetPassword, refreshToken
  users.ts        ← getProfile, updateProfile
  companies.ts    ← getMyCompanies, create, update, getTypes
  services.ts     ← getByCompany, create, update, delete
  appointments.ts ← asProvider, getById, updateStatus, getAvailableSlots
```

### 1.2 `client.ts` responsibilities

- Read `accessToken` from localStorage
- Attach `Authorization: Bearer` header on every request
- On `401` → call `POST /api/v1/auth/refresh-token` → retry once
- On retry failure → clear tokens + redirect to `/login`
- Parse error body into typed `ApiError` and throw it

### 1.3 Expand `AppContext`

Add to existing context:

- `accessToken`, `refreshToken`, `userId` (persisted to localStorage)
- `login(email, password)` action
- `register(data)` action
- `logout()` action (clears tokens, redirects to `/`)

### 1.4 Route guard

Wrap `/provider/*` routes so unauthenticated users are redirected to `/login`.

---

## Phase 2 — Auth screens

_Wire existing Login/Register/ForgotPassword UI to real API. Zero design changes._

| Step | File                 | Change                                                                   |
| ---- | -------------------- | ------------------------------------------------------------------------ |
| 2.1  | `Login.tsx`          | Call `auth.login()`, store tokens, navigate to `/provider`               |
| 2.2  | `Register.tsx`       | Call `auth.register()`, on success navigate to `/onboarding-provider`    |
| 2.3  | `ForgotPassword.tsx` | Call `auth.forgotPassword()`, show success message                       |
| 2.4  | `routes.tsx`         | Remove `Onboarding` route (`RoleSwitchLanding` route removed 2026-09-12) |

---

## Phase 3 — Companies & Services

_Core provider setup. After this, a provider can fully manage their business._

| Step | File                | Change                                                                                    |
| ---- | ------------------- | ----------------------------------------------------------------------------------------- |
| 3.1  | `Companies.tsx`     | Replace `MY_COMPANIES` mock → `companies.getMyCompanies()`                                |
| 3.2  | `CreateCompany.tsx` | Wire form → `companies.create()` / `companies.update()` · load company types for selector |
| 3.3  | `Services.tsx`      | Replace mock → `services.getByCompany(companyId)`                                         |
| 3.4  | `CreateService.tsx` | Wire form → `services.create()` / `services.update()`                                     |
| 3.5  | `Services.tsx`      | Add delete button + confirmation → `services.delete()`                                    |

---

## Phase 4 — Appointments

_Daily-use core flow. After this, the app is functionally complete for MVP._

| Step | File                            | Change                                                                              |
| ---- | ------------------------------- | ----------------------------------------------------------------------------------- |
| 4.1  | `ProviderAppointments.tsx`      | Replace mock → `appointments.asProvider()`, keep existing filter tabs               |
| 4.2  | `ProviderAppointmentDetail.tsx` | Load from `appointments.getById(id)`                                                |
| 4.3  | `ProviderAppointmentDetail.tsx` | Add Confirm / Reject / Complete actions → `appointments.updateStatus()`             |
| 4.4  | `Dashboard.tsx`                 | Filter today's appointments from `appointments.asProvider()` result                 |
| 4.5  | `Calendar.tsx`                  | Derive appointment dots from same `appointments.asProvider()` call (no new request) |

---

## Phase 5 — Profile & settings

| Step | File                   | Change                                                                    |
| ---- | ---------------------- | ------------------------------------------------------------------------- |
| 5.1  | `ProviderProfile.tsx`  | Load from `users.getProfile()` on mount, save via `users.updateProfile()` |
| 5.2  | `AppContext`           | Replace `defaultUser` with real profile from API after login              |
| 5.3  | `ProviderSettings.tsx` | Keep as local-only stub for now                                           |

---

## Phase 6 — Polish & cleanup

_Quality gate before calling MVP done._

| Step | What                                                                                  |
| ---- | ------------------------------------------------------------------------------------- |
| 6.1  | Add global error toast — Sonner is already installed, wire `ApiError` messages to it  |
| 6.2  | Add loading skeletons to all API-driven lists (pattern already exists in `Dashboard`) |
| 6.3  | Add empty states to Companies, Services, Appointments when API returns `[]`           |
| 6.4  | Delete `mockData.ts` once all imports are removed                                     |
| 6.5  | Responsive layout — add desktop Sidebar, hide BottomNav on `md+`                      |

---

## Deferred — post MVP

These have no API backing yet. Keep screens as stubs, hide from nav.

| Feature             | Blocker                                      |
| ------------------- | -------------------------------------------- |
| Working Hours       | Needs new API endpoints                      |
| Block Time Slots    | Needs new API endpoints                      |
| Notifications       | Needs new API endpoints                      |
| Reports / Analytics | Needs new API endpoints                      |
| Payments            | API ready (UC-35–40) — needs UX design first |
| Google Login        | API ready (UC-03) — low priority             |

---

## Sequencing rationale

```
Phase 1 (foundation) → Phase 2 (login works) → Phase 3 (company/services work)
  → Phase 4 (appointments work) → Phase 5 (profile) → Phase 6 (polish)
```

Each phase can be code-reviewed and merged independently. The app remains functional
(using mock data) until each phase lands, so nothing is broken mid-development.
