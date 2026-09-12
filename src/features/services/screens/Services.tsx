import { useNavigate, useParams } from 'react-router'
import { Plus, Clock, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { COMPANIES, SERVICES } from '../../../app/data/mockData'
import type { Service } from '../../../app/data/model/service.types'
import { TopBar } from '../../../shared/components/navigation/TopBar'
import { Button } from '../../../shared/components/ui/Button'
import { EmptyState } from '../../../shared/components/ui/EmptyState'
import { useState } from 'react'

export function ProviderServices() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const company = COMPANIES.find((c) => c.id === id) || COMPANIES[0]
  const [services, setServices] = useState(() =>
    SERVICES.filter((s) => s.companyId === (id || 'c1')),
  )

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const groupedByCategory = services.reduce(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(s)
      return acc
    },
    {} as Record<string, typeof services>,
  )

  return (
    <div className="min-h-screen bg-white">
      <TopBar
        title="Servicios"
        subtitle={company.name}
        back
        light
        rightAction={
          <Button
            size="sm"
            onClick={() =>
              navigate(`/provider/companies/${id}/services/create`)
            }
            iconLeft={<Plus size={15} />}
          >
            Nuevo
          </Button>
        }
      />

      <div className="px-5 py-4">
        {services.length === 0 ? (
          <EmptyState
            emoji="⚙️"
            title="Sin servicios"
            description="Añade tu primer servicio para que los clientes puedan reservar"
            cta={{
              label: 'Crear servicio',
              onClick: () =>
                navigate(`/provider/companies/${id}/services/create`),
            }}
          />
        ) : (
          <>
            {/* Summary */}
            <div className="bg-[#FAFAFA] rounded-2xl p-4 mb-4 border border-[#F0F0F0] flex">
              <div className="flex-1 text-center">
                <p className="font-semibold text-[#2C2C2C] text-lg">
                  {services.length}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Servicios</p>
              </div>
              <div className="w-px bg-[#E0E0E0]" />
              <div className="flex-1 text-center">
                <p className="font-semibold text-[#2C2C2C] text-lg">
                  {Math.min(...services.map((s) => s.price))}–
                  {Math.max(...services.map((s) => s.price))}€
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Rango precio</p>
              </div>
              <div className="w-px bg-[#E0E0E0]" />
              <div className="flex-1 text-center">
                <p className="font-semibold text-[#2C2C2C] text-lg">
                  {Math.round(
                    services.reduce((sum, s) => sum + s.duration, 0) /
                      services.length,
                  )}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Min. promedio</p>
              </div>
            </div>

            {/* Services by category */}
            <div className="flex flex-col gap-5">
              {Object.entries(groupedByCategory).map(
                ([category, catServices]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <p className="text-xs text-[#6B7280] font-medium">
                        {category}
                      </p>
                      <span className="text-[10px] bg-[#2C2C2C] text-white px-1.5 py-0.5 rounded-full">
                        {catServices.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {catServices.map((service) => (
                        <div
                          key={service.id}
                          className="bg-[#FAFAFA] rounded-2xl p-4 border border-[#F0F0F0] hover:bg-[#F5F5F5] transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2C2C2C]">
                                {service.name}
                              </p>
                              <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Clock size={11} className="text-[#9CA3AF]" />
                                  <span className="text-xs text-[#6B7280]">
                                    {service.duration} min
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-[#2C2C2C]">
                                  {service.price}€
                                </span>
                                <span className="text-[10px] bg-[#2C2C2C] text-white px-1.5 py-0.5 rounded-full">
                                  Activo
                                </span>
                              </div>
                            </div>
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === service.id
                                      ? null
                                      : service.id,
                                  )
                                }
                                className="w-8 h-8 rounded-xl bg-white border border-[#F0F0F0] flex items-center justify-center hover:bg-[#FAFAFA] transition-colors"
                              >
                                <MoreVertical
                                  size={15}
                                  className="text-[#6B7280]"
                                />
                              </button>
                              {activeMenu === service.id && (
                                <div className="absolute right-0 top-10 z-10 bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden min-w-[140px]">
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#2C2C2C] hover:bg-[#FAFAFA]"
                                    onClick={() => {
                                      setActiveMenu(null)
                                      navigate(
                                        `/provider/companies/${id}/services/${service.id}/edit`,
                                      )
                                    }}
                                  >
                                    <Edit2 size={14} /> Editar
                                  </button>
                                  <button
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#E94C59] hover:bg-[#FEF2F2] border-t border-[#F0F0F0]"
                                    onClick={() => {
                                      setActiveMenu(null)
                                      setDeleteTarget(service)
                                    }}
                                  >
                                    <Trash2 size={14} /> Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Add more */}
            <button
              onClick={() =>
                navigate(`/provider/companies/${id}/services/create`)
              }
              className="w-full h-16 mt-4 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex items-center justify-center gap-2 text-[#9CA3AF] text-sm hover:bg-[#FAFAFA] transition-colors"
            >
              <Plus size={18} /> Añadir servicio
            </button>
          </>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl p-6">
            <h3 className="text-[#111827] font-semibold mb-2">
              ¿Eliminar servicio?
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Esta acción eliminará <strong>{deleteTarget.name}</strong>. Los
              clientes ya no podrán reservarlo.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
