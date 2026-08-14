'use client'

import { useState } from 'react'
import {
  PopupNotification,
  createPopup,
  updatePopup,
  deletePopup,
  togglePopupField,
} from '@/lib/actions/popup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Edit2,
  Trash2,
  Bell,
  LayoutTemplate,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react'

interface PopupManagerProps {
  initialPopups: PopupNotification[]
}

export function PopupManager({ initialPopups }: PopupManagerProps) {
  const [popups, setPopups] = useState<PopupNotification[]>(initialPopups)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPopup, setEditingPopup] = useState<PopupNotification | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [showAsPopup, setShowAsPopup] = useState(true)
  const [showAsBanner, setShowAsBanner] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxViews, setMaxViews] = useState(1)
  const [intervalMinutes, setIntervalMinutes] = useState(0)

  const openCreateModal = () => {
    setEditingPopup(null)
    setTitle('')
    setDescription('')
    setImageUrl('')
    setLinkUrl('')
    setIsActive(true)
    setShowAsPopup(true)
    setShowAsBanner(false)
    setStartDate('')
    setEndDate('')
    setMaxViews(1)
    setIntervalMinutes(0)
    setIsFormOpen(true)
  }

  const openEditModal = (popup: PopupNotification) => {
    setEditingPopup(popup)
    setTitle(popup.title)
    setDescription(popup.description)
    setImageUrl(popup.image_url || '')
    setLinkUrl(popup.link_url || '')
    setIsActive(popup.is_active)
    setShowAsPopup(popup.show_as_popup)
    setShowAsBanner(popup.show_as_banner)
    setStartDate(popup.start_date ? popup.start_date.slice(0, 16) : '')
    setEndDate(popup.end_date ? popup.end_date.slice(0, 16) : '')
    setMaxViews(popup.max_views ?? 1)
    setIntervalMinutes(popup.interval_minutes ?? 0)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload: Partial<PopupNotification> = {
        title,
        description,
        image_url: imageUrl || null,
        link_url: linkUrl || null,
        is_active: isActive,
        show_as_popup: showAsPopup,
        show_as_banner: showAsBanner,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        max_views: Number(maxViews),
        interval_minutes: Number(intervalMinutes),
      }

      if (editingPopup) {
        const updated = await updatePopup(editingPopup.id, payload)
        setPopups((prev) => prev.map((p) => (p.id === editingPopup.id ? updated : p)))
      } else {
        const created = await createPopup(payload)
        setPopups((prev) => [created, ...prev])
      }

      setIsFormOpen(false)
    } catch (error) {
      alert('Error guardando la notificación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este aviso?')) return

    try {
      await deletePopup(id)
      setPopups((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const handleToggle = async (
    id: string,
    field: 'is_active' | 'show_as_popup' | 'show_as_banner',
    currentValue: boolean
  ) => {
    const nextVal = !currentValue
    setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: nextVal } : p)))

    try {
      await togglePopupField(id, field, nextVal)
    } catch (error) {
      // Revert if error
      setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: currentValue } : p)))
      alert('Error actualizando el estado')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Popups y Avisos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configura ventanas emergentes y barras de aviso superiores para los visitantes.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          <span>Crear Aviso / Popup</span>
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {popups.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No hay notificaciones creadas.</p>
            <p className="text-slate-400 text-sm mt-1">
              Haz clic en "Crear Aviso / Popup" para añadir una nueva.
            </p>
          </div>
        ) : (
          popups.map((popup) => (
            <div
              key={popup.id}
              className={`bg-white rounded-xl border transition-all p-5 ${
                popup.is_active ? 'border-slate-200 shadow-sm' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{popup.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        popup.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {popup.is_active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactivo
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2">{popup.description}</p>

                  {popup.link_url && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <a href={popup.link_url} target="_blank" rel="noreferrer" className="hover:underline">
                        Botón "Acceder": {popup.link_url}
                      </a>
                    </div>
                  )}

                  {/* Display Mode Toggles */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handleToggle(popup.id, 'show_as_popup', popup.show_as_popup)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md border transition-colors ${
                        popup.show_as_popup
                          ? 'bg-purple-50 text-purple-700 border-purple-300 font-semibold'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      Ventana Emergente: {popup.show_as_popup ? 'SI' : 'NO'}
                    </button>

                    <button
                      onClick={() => handleToggle(popup.id, 'show_as_banner', popup.show_as_banner)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md border transition-colors ${
                        popup.show_as_banner
                          ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      Barra Superior: {popup.show_as_banner ? 'SI' : 'NO'}
                    </button>

                    <button
                      onClick={() => handleToggle(popup.id, 'is_active', popup.is_active)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md border transition-colors ${
                        popup.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      Estado: {popup.is_active ? 'Publicado' : 'Borrador'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(popup)}
                    className="gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(popup.id)}
                    className="gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingPopup ? 'Editar Notificación' : 'Nueva Notificación'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Título de la Notificación *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Oferta Especial o Aviso Importante"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Descripción (Texto a mostrar en la barra o emergente) *
                </label>
                <Textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe aquí el contenido descriptivo..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Enlace del Botón "Acceder" (Opcional)
                </label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Ej: https://mysair.es/contacto o /productos"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Si se especifica, se agregará un botón "Acceder" con este enlace.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  URL de Imagen (Opcional, para la ventana emergente)
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ej: /images/popup-promo.jpg"
                />
              </div>

              {/* Display Options */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <label className="block text-sm font-bold text-slate-800">
                  Modo de Visualización (Selecciona uno o ambos)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:bg-slate-100/50">
                    <input
                      type="checkbox"
                      checked={showAsPopup}
                      onChange={(e) => setShowAsPopup(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm block">
                        Ventana Emergente (Modal)
                      </span>
                      <span className="text-xs text-slate-500">
                        Pop-up en el centro de la pantalla
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white border rounded-lg cursor-pointer hover:bg-slate-100/50">
                    <input
                      type="checkbox"
                      checked={showAsBanner}
                      onChange={(e) => setShowAsBanner(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 text-sm block">
                        Barra Superior (Banner)
                      </span>
                      <span className="text-xs text-slate-500">
                        Barra azul/roja bajo el menú de navegación
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Status & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Vistas Máximas por Usuario (0 = Ilimitado)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={maxViews}
                    onChange={(e) => setMaxViews(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Intervalo entre Vistas (minutos, 0 = 1 vez)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Fecha de Inicio (Opcional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Fecha de Fin (Opcional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_active_check"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="is_active_check" className="text-sm font-semibold text-slate-800 cursor-pointer">
                  Publicar aviso inmediatamente (Activo)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Guardando...' : editingPopup ? 'Guardar Cambios' : 'Crear Aviso'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
