---
title: Bookas – Screens Checklist
description: Development checklist of the application's UI screens, cross-referenced to use cases in use-cases.md.
version: 1.0.0
date: 2026-09-12
author: Haliam Perez
---

# Screens

Verified against the actual routes registered in [routes.tsx](../../src/app/routes.tsx) and the per-feature `*-routes.tsx` files, not just the use-cases document. See [use-cases.md](./use-cases.md) for full use-case detail and the navigation diagram.

## ✅ Completed

- [x] **Landing** — `/` — Related: UC-005 — Entry point / marketing splash — Action: go to Login or Register
- [x] **Login** — `/login` — Related: UC-002 — Authenticate an existing user — Action: submit credentials → lands on Dashboard
- [x] **Register** — `/register` — Related: UC-001 — Create a new account (react-hook-form + zod validation) — Action: submit form → lands on Provider Onboarding
- [x] **Forgot Password** — `/forgot-password` — Related: UC-004 — Request/perform password reset — Action: submit email
- [x] **Onboarding** — `/onboarding` — Related: UC-005 — Generic intro/carousel — Action: continue
- [x] **Provider Onboarding** — `/provider/onboarding` — Related: UC-005c — Minimal setup guiding a new provider to create a company — Action: continue to Create Company
- [x] **Offline** — `/offline` — Related: UC-005d — Shown when connectivity is lost — Action: retry
- [x] **Dashboard** — `/provider` — Related: UC-005e — Provider's landing screen after login: overview across all of their businesses, today's appointments, notifications — Action: pick a business, open an appointment, or go to Companies
- [x] **Business Home** — `/provider/companies/:id` — Related: UC-005f — Detail view for one specific business (today's/weekly stats, quick nav to Calendar/Services/Clients/Reviews) — Action: navigate into that business's Calendar, Services, Clients, or Reviews
- [x] **Companies (list)** — `/provider/companies` — Related: UC-009 — View all companies owned by the provider — Action: create/edit a company
- [x] **Create Company** — `/provider/companies/create` — Related: UC-008 — Create a new company — Action: submit company details
- [x] **Edit Company** — `/provider/companies/:id/edit` — Related: UC-010 — Edit an existing company (reuses Create Company screen) — Action: submit changes
- [x] **Services (list)** — `/provider/companies/:id/services` — Related: UC-013 — View services offered by a company — Action: create a service
- [x] **Create Service** — `/provider/companies/:id/services/create` — Related: UC-014 — Add a new service/offering — Action: submit service details
- [x] **Edit Service** — `/provider/companies/:id/services/:serviceId/edit` — Related: UC-015 — Edit an existing service (reuses Create Service screen, prefilled) — Action: submit changes
- [x] **Delete Service (confirmation)** — inline on Services list — Related: UC-016 — Remove a service — Action: confirm deletion
- [x] **Provider Appointments (list)** — `/provider/appointments` — Related: UC-030 — View all appointments for the provider — Action: open an appointment
- [x] **Provider Appointment Detail** — `/provider/appointments/:id` — Related: UC-030b, UC-031 — View/manage a single appointment — Action: accept/confirm/reject
- [x] **Calendar** — `/provider/calendar` — Related: UC-017 — Visualize schedule — Action: navigate to Hours/Block Time
- [x] **Hours** — `/provider/hours` — Related: UC-018 — Configure recurring working hours — Action: save hours
- [x] **Block Time** — `/provider/block-time` — Related: UC-019, UC-020 — Block/unblock specific time slots — Action: save blocked slots
- [x] **Notifications** — `/provider/notifications` — Related: UC-037 — View provider notifications — Action: mark read / open related item
- [x] **Provider Profile** — `/provider/profile` — Related: UC-006, UC-007 — View/edit the provider's own profile — Action: save changes
- [x] **Provider Settings** — `/provider/settings` — Related: UC-038, UC-039 — App/account settings — Action: change a setting
- [x] **Reports** — `/provider/reports` — Related: UC-040, UC-041 — Analytics/reports dashboard — Action: view a report

## ⚠️ Partially completed

- [ ] **Clients** — `/provider/clients` — Related: (no dedicated UC yet) — Placeholder route currently renders the Companies screen; no real Clients screen exists.
- [ ] **Reviews** — `/provider/reviews` — Related: (no dedicated UC yet) — Placeholder route currently renders the Reports screen; no real Reviews screen exists.

## ⬜ Pending

- [ ] **Company Search** — Related: UC-012 — Customer-facing search for companies/providers
- [ ] **Service/Company Details (customer view)** — Related: UC-021 — Customer views a company's services and available slots
- [ ] **Select Tickets / Time Slot** — Related: UC-021 — Customer picks an available slot
- [ ] **Book Appointment / Checkout** — Related: UC-022 — Customer confirms and books an appointment
- [ ] **My Appointments (customer)** — Related: UC-023, UC-028, UC-029 — Customer views upcoming/past appointments
- [ ] **Appointment Details (customer)** — Related: UC-024 — Customer views a single appointment
- [ ] **Reschedule Appointment (customer)** — Related: UC-025 — Customer updates an appointment
- [ ] **Cancel Appointment (customer)** — Related: UC-026, UC-027 — Customer cancels/deletes an appointment
- [ ] **Payment / Checkout** — Related: UC-032, UC-033 — Process a payment for a booking
- [ ] **Payment Methods** — Related: UC-036 — Add/view saved payment methods
- [ ] **Payment History** — Related: UC-035 — View past payments and refunds
- [ ] **Delete Company confirmation** — Related: UC-011 — No API yet; needs a decision on whether to implement or restrict
- [ ] **Google Login** — Related: UC-003 — No social-auth entry point implemented

## Status summary

| Status                 | Count |
| ---------------------- | ----- |
| ✅ Completed           | 23    |
| ⚠️ Partially completed | 2     |
| ⬜ Pending             | 13    |

## Consistency check: Use Cases ↔ Screens ↔ Navigation

- Every screen listed as "Completed" above has a matching entry and route in [use-cases.md](./use-cases.md) and appears in that document's navigation diagram — no orphaned "completed" screens found.
- The previously orphaned Role Switch Landing screen/route (UC-005b) was removed from the codebase on 2026-09-12, since nothing navigated to it and it had no clear owner.
- Every "Pending" item corresponds to a `[NOT IMPLEMENTED]` use case in use-cases.md — no pending screens were invented without a backing use case.
- `Dashboard.tsx` was resolved on 2026-09-12: it is now the `/provider` index screen (UC-005e), and `BusinessHome.tsx` was repurposed from a single hardcoded company into the per-business detail screen at `/provider/companies/:id` (UC-005f).
- UC-015/016 (Edit/Delete Service) were resolved on 2026-09-12: Edit reuses `CreateService.tsx` prefilled via `:serviceId`, and Delete is an inline confirmation on the Services list. Both are frontend-only (no persistence — a page refresh restores the deleted service) since there's no backing API yet.
- The `Clients` and `Reviews` placeholder routes have no dedicated use cases yet; if real Clients/Reviews features are planned, add use cases for them before building dedicated screens.
