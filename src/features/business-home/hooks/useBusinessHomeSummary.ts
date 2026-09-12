import { PROVIDER_APPOINTMENTS } from '../../../app/data/mockData'

/** Derives today's/pending/weekly appointment stats for a single business's home screen. */
export function useBusinessHomeSummary(companyId: string) {
  const companyAppts = PROVIDER_APPOINTMENTS.filter(
    (a) => a.companyId === companyId,
  )

  const confirmedAppts = companyAppts
    .filter((a) => a.status === 'confirmed')
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    )
  const todayStr =
    confirmedAppts[0]?.date ?? new Date().toISOString().split('T')[0]

  const todayAppts = companyAppts.filter(
    (a) => a.date === todayStr && a.status !== 'cancelled',
  )
  const pendingTodayAppts = todayAppts.filter((a) => a.status === 'pending')

  const pendingAppts = companyAppts.filter((a) => a.status === 'pending')
  const pendingDetailPath =
    pendingAppts.length === 1
      ? `/provider/appointments/${pendingAppts[0].id}`
      : '/provider/appointments'

  const weekReservationsCount = companyAppts.filter(
    (a) => a.status !== 'cancelled',
  ).length

  return {
    todayReservationsCount: todayAppts.length,
    pendingTodayCount: pendingTodayAppts.length,
    pendingCount: pendingAppts.length,
    pendingDetailPath,
    weekReservationsCount,
  }
}
