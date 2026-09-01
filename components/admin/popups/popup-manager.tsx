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
  ImageIcon,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Calendar,
  Eye,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { MediaPickerModal } from '../storage/media-picker-modal'

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
        toast.success("Aviso actualizado correctamente")
      } else {
        const created = await createPopup(payload)
        setPopups((prev) => [created, ...prev])
        toast.success("Aviso creado correctamente")
      }

      setIsFormOpen(false)
    } catch {
      toast.error('Error guardando la notificación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este aviso?')) return

    try {
      await deletePopup(id)
      setPopups((prev) => prev.filter((p) => p.id !== id))
      toast.success("Aviso eliminado correctamente")
    } catch {
      toast.error('Error al eliminar')
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
      if (field === 'is_active') {
        toast.success(nextVal ? "Aviso activado (Visible)" : "Aviso desactivado (Pausado)")
      } else if (field === 'show_as_popup') {
        toast.success(nextVal ? "Ventana emergente activada" : "Ventana emergente desactivada")
      } else {
        toast.success(nextVal ? "Barra superior activada" : "Barra superior desactivada")
      }
    } catch {
      // Revert if error
      setPopups((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: currentValue } : p)))
      toast.error('Error actualizando el estado')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Popups y Avisos</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {popups.length} configurados
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configura ventanas emergentes y barras de aviso superiores para los visitantes.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-2xs">
          <Plus className="h-4 w-4" />
          <span>Crear Aviso / Popup</span>
        </Button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {popups.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
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
                popup.is_active
                  ? 'border-slate-200 shadow-xs'
                  : 'border-slate-200 opacity-75 bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Image Thumbnail to the left */}
                <div className="w-full md:w-32 h-28 md:h-28 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative group">
                  {popup.image_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={popup.image_url}
                        alt={popup.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                      <a
                        href={popup.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Ver imagen
                      </a>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 gap-1 text-center p-2">
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                      <span className="text-[10px] text-slate-400">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{popup.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        popup.is_active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {popup.is_active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactivo / Pausado
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
                      Ventana Emergente: {popup.show_as_popup ? 'SÍ' : 'NO'}
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
                      Barra Superior: {popup.show_as_banner ? 'SÍ' : 'NO'}
                    </button>
                  </div>
                </div>

                {/* Direct Actions (including activate/deactivate button) */}
                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 self-stretch md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Direct Toggle Button */}
                  <Button
                    variant={popup.is_active ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleToggle(popup.id, 'is_active', popup.is_active)}
                    className={`w-full sm:w-auto md:w-36 justify-center gap-1.5 text-xs font-semibold ${
                      popup.is_active
                        ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {popup.is_active ? (
                      <>
                        <ToggleRight className="h-4 w-4 text-emerald-600" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4" />
                        Activar aviso
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto md:w-36 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(popup)}
                      className="gap-1 text-xs flex-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(popup.id)}
                      className="gap-1 text-xs px-2.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal (Widened 50% to max-w-4xl / max-w-5xl) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl sm:max-w-4xl md:max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 my-8 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingPopup ? 'Editar Notificación' : 'Nueva Notificación'}
                  </h2>
                  <p className="text-xs text-slate-500">Configura el diseño, ubicación y programación</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Título de la Notificación *
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Oferta Especial o Aviso Importante"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      URL de la Imagen
                    </label>
                    <MediaPickerModal onSelect={setImageUrl} triggerLabel="Storage" />
                  </div>
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/banner.jpg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
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

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  URL del Enlace (Opcional - Añade un botón "Acceder")
                </label>
                <Input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://mysair.es/productos/... o enlace externo"
                />
              </div>

              {/* Formatos de visualización */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Formatos de Visualización
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={showAsPopup}
                      onChange={(e) => setShowAsPopup(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Ventana Emergente</p>
                      <p className="text-slate-500 text-[11px]">Modal central en pantalla</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={showAsBanner}
                      onChange={(e) => setShowAsBanner(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Barra Superior</p>
                      <p className="text-slate-500 text-[11px]">Cinta de aviso en cabecera</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800">Publicado y Activo</p>
                      <p className="text-slate-500 text-[11px]">Visible para visitantes</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Programación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Fecha de Inicio (Opcional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Fecha de Fin (Opcional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : editingPopup
                    ? 'Guardar Cambios'
                    : 'Crear Notificación'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
