import { useNavigate } from 'react-router'
import { Plus, Settings } from 'lucide-react'
import { COMPANIES } from '../../../app/data/mockData'
import { Button } from '../../../shared/components/ui/Button'
import { EmptyState } from '../../../shared/components/ui/EmptyState'
import { TopBar } from '../../../shared/components/navigation/TopBar'

// Mock: provider owns first 2 companies
const MY_COMPANIES = COMPANIES.slice(0, 2)

export function ProviderCompanies() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <TopBar
        title="Mis negocios"
        light
        rightAction={
          <Button
            size="sm"
            onClick={() => navigate('/provider/companies/create')}
            iconLeft={<Plus size={15} />}
          >
            Añadir
          </Button>
        }
      />

      <div className="px-5 py-4">
        {MY_COMPANIES.length === 0 ? (
          <EmptyState
            emoji="🏢"
            title="Sin negocios"
            description="Crea tu primer negocio para empezar a recibir reservas"
            cta={{
              label: 'Crear negocio',
              onClick: () => navigate('/provider/companies/create'),
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {MY_COMPANIES.map((company) => (
              <div
                key={company.id}
                className="bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#F0F0F0]"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/provider/companies/${company.id}`)}
                >
                  <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {company.verified && (
                      <div className="bg-[#2C2C2C] text-white text-[10px] px-2 py-1 rounded-full">
                        ✓ Verificado
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/provider/companies/${company.id}/edit`)
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <Settings size={14} className="text-[#2C2C2C]" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-medium drop-shadow-lg">
                      {company.name}
                    </p>
                    <p className="text-white/90 text-xs drop-shadow-lg">
                      {company.category}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4">
                  <div className="flex items-center justify-around py-3 border-y border-[#F0F0F0] mb-4">
                    {[
                      { value: '12', label: 'Servicios' },
                      { value: company.reviewCount, label: 'Reseñas' },
                      { value: company.rating, label: 'Rating ⭐' },
                    ].map(({ value, label }, i) => (
                      <div
                        key={label}
                        className={`text-center ${i < 2 ? 'border-r border-[#F0F0F0] pr-6' : ''}`}
                      >
                        <p className="font-semibold text-[#2C2C2C] text-sm">
                          {value}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/provider/companies/${company.id}/services`)
                      }
                      className="flex-1 h-10 rounded-xl bg-[#2C2C2C] text-white text-sm font-medium hover:bg-[#1F1F1F] transition-colors"
                    >
                      Ver servicios
                    </button>
                    <button
                      onClick={() => navigate('/provider/appointments')}
                      className="flex-1 h-10 rounded-xl bg-white border border-[#F0F0F0] text-[#2C2C2C] text-sm hover:bg-[#FAFAFA] transition-colors"
                    >
                      Citas
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new company */}
            <button
              onClick={() => navigate('/provider/companies/create')}
              className="w-full h-24 border-2 border-dashed border-[#E0E0E0] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#9CA3AF] hover:bg-[#FAFAFA] transition-colors"
            >
              <Plus size={20} className="text-[#9CA3AF]" />
              <span className="text-sm">Añadir otro negocio</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
