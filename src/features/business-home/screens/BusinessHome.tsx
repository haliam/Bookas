import { useParams } from 'react-router'
import { COMPANIES } from '../../../app/data/mockData'
import { TopBar } from '../../../shared/components/navigation/TopBar'
import { TodaySummary } from '../components/TodaySummary'
import { PendingActions } from '../components/PendingActions'
import { BusinessNavigation } from '../components/BusinessNavigation'
import { WeeklySummary } from '../components/WeeklySummary'
import { useBusinessHomeSummary } from '../hooks/useBusinessHomeSummary'

export function BusinessHome() {
  const { id } = useParams<{ id: string }>()
  // Fallback keeps the screen usable if an unknown id slips through until real API-backed lookups exist
  const company = COMPANIES.find((c) => c.id === id) ?? COMPANIES[0]

  const {
    todayReservationsCount,
    pendingTodayCount,
    pendingCount,
    pendingDetailPath,
    weekReservationsCount,
  } = useBusinessHomeSummary(company.id)

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto">
      <TopBar back="/provider" title={company.name} light />
      <TodaySummary
        reservationsCount={todayReservationsCount}
        pendingCount={pendingTodayCount}
      />
      <PendingActions count={pendingCount} detailPath={pendingDetailPath} />
      <BusinessNavigation
        servicesPath={`/provider/companies/${company.id}/services`}
      />
      <WeeklySummary
        reservationsCount={weekReservationsCount}
        rating={company.rating}
        reviewCount={company.reviewCount}
      />
    </div>
  )
}
