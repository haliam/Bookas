import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TopBar } from '../../../shared/components/navigation/TopBar'
import { Input } from '../../../shared/components/ui/Input'
import { Button } from '../../../shared/components/ui/Button'
import { SERVICES } from '../../../app/data/mockData'

const CATEGORIES = [
  'Masaje',
  'Aromaterapia',
  'Meditación',
  'Corte',
  'Afeitado',
  'Coloración',
  'Yoga',
  'Pilates',
  'Pack',
  'Otro',
]
const DURATIONS = [15, 30, 45, 60, 75, 90, 120]

export function CreateService() {
  const navigate = useNavigate()
  const { serviceId } = useParams<{ serviceId: string }>()
  const existingService = serviceId
    ? SERVICES.find((s) => s.id === serviceId)
    : undefined
  const isEditing = Boolean(existingService)

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: existingService?.name ?? '',
    category: existingService?.category ?? '',
    duration: existingService?.duration ?? 60,
    price: existingService ? String(existingService.price) : '',
    description: existingService?.description ?? '',
  })

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    navigate(-1)
  }

  const isValid = form.name && form.category && form.price

  return (
    <div className="min-h-screen bg-white">
      <TopBar
        title={isEditing ? 'Editar servicio' : 'Nuevo servicio'}
        back
        light
      />

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.05)] flex flex-col gap-4">
          <h4 className="text-[#111827]">Información básica</h4>
          <Input
            label="Nombre del servicio *"
            placeholder="Ej: Masaje Relajante 60min"
            value={form.name}
            onChange={set('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#374151]">Categoría *</label>
            <select
              value={form.category}
              onChange={set('category')}
              className="w-full h-12 bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl px-4 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#E0E0E0]"
            >
              <option value="">Seleccionar categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#374151]">Descripción</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Describe el servicio al cliente..."
              className="w-full h-24 bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-4 text-sm text-[#2C2C2C] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#E0E0E0] resize-none"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
          <h4 className="text-[#111827] mb-3">Duración</h4>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setForm((prev) => ({ ...prev, duration: d }))}
                className={`h-10 px-4 rounded-xl text-sm font-medium transition-all ${
                  form.duration === d
                    ? 'bg-[#2C2C2C] text-white'
                    : 'bg-[#FAFAFA] text-[#6B7280] border border-[#F0F0F0]'
                }`}
              >
                {d < 60
                  ? `${d}min`
                  : `${d / 60}h${d % 60 > 0 ? ` ${d % 60}min` : ''}`}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
          <h4 className="text-[#111827] mb-3">Precio</h4>
          <div className="relative">
            <Input
              label="Precio (€) *"
              type="number"
              placeholder="0.00"
              value={form.price}
              onChange={set('price')}
              iconLeft={<span className="text-[#9CA3AF] font-medium">€</span>}
            />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2">
            💡 El cliente verá este precio antes de reservar. IVA no incluido.
          </p>
        </div>

        {/* Availability */}
        <div className="bg-[#FAFAFA] rounded-2xl p-4 border border-[#F0F0F0]">
          <p className="text-xs text-[#6B7280]">
            📅 La disponibilidad se calculará automáticamente según los horarios
            de tu negocio. Puedes ajustar franjas específicas desde el panel de
            horarios.
          </p>
        </div>

        {/* CTA */}
        <Button
          fullWidth
          size="lg"
          loading={loading}
          disabled={!isValid}
          onClick={handleSave}
        >
          {isEditing ? 'Guardar cambios' : 'Guardar servicio'}
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
