import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Bell, Calendar, ChevronRight } from 'lucide-react'
import { useApp } from '../../../app/providers/AppContext'
import { COMPANIES, PROVIDER_APPOINTMENTS } from '../../../app/data/mockData'
import { StatusBadge } from '../../../shared/components/ui/Badge'
import { SkeletonList } from '../../../shared/components/ui/Skeleton'

// Mock: provider owns first 2 companies, consistent with ProviderCompanies
const MY_COMPANIES = COMPANIES.slice(0, 2)

export function ProviderDashboard() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [loading, setLoading] = useState(true)
  const [unreadNotifications] = useState(2) // Mock unread count

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  const firstName = user.name.split(' ')[0]
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const confirmedAppts = PROVIDER_APPOINTMENTS.filter(
    (a) => a.status === 'confirmed',
  ).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const todayStr =
    confirmedAppts[0]?.date ?? new Date().toISOString().split('T')[0]
  const upcomingAppts = confirmedAppts
    .filter((a) => a.date === todayStr)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 border-b border-[#F0F0F0]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#2C2C2C] font-semibold text-2xl mb-1">
              Hola, {firstName}
            </h1>
            <p className="text-[#6B7280] text-sm capitalize">{today}</p>
          </div>
          <button
            onClick={() => navigate('/provider/notifications')}
            className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center relative hover:bg-[#E8E8E8] transition-colors mr-2"
          >
            <Bell size={22} className="text-[#2C2C2C]" />
            {unreadNotifications > 0 && (
              <div className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E94C59] flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold leading-none">
                  {unreadNotifications}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Businesses overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2C2C2C] font-medium">Tus negocios</h2>
            <button
              onClick={() => navigate('/provider/companies')}
              className="text-sm text-[#6B7280] hover:text-[#2C2C2C] transition-colors"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {MY_COMPANIES.map((company) => (
              <div
                key={company.id}
                onClick={() => navigate(`/provider/companies/${company.id}`)}
                className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#D1D5DB] hover:shadow-sm transition-all cursor-pointer"
              >
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C] truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{company.category}</p>
                </div>
                <ChevronRight size={16} className="text-[#9CA3AF] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#2C2C2C] font-medium">Citas de hoy</h2>
            <button
              onClick={() => navigate('/provider/appointments')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-[#E8E8E8] transition-colors"
              title="Ver todas las citas del día"
            >
              <Calendar size={16} className="text-[#6B7280]" />
            </button>
          </div>

          {loading ? (
            <SkeletonList count={3} />
          ) : upcomingAppts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#9CA3AF] text-sm">No hay citas programadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 bg-white border border-[#E5E7EB] rounded-2xl hover:border-[#D1D5DB] hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => navigate(`/provider/appointments/${appt.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      {appt.serviceName}
                    </p>
                    <StatusBadge status={appt.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <span>{appt.time}</span>
                    <span>{appt.providerName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
