"use client"

import { useState, useTransition } from "react"
import { upsertRedirect, deleteRedirect, toggleRedirect } from "@/lib/actions/admin-redirects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, ArrowLeftRight, ExternalLink, BarChart2 } from "lucide-react"

type Redirect = {
  id: number
  source_path: string
  destination_url: string
  redirect_type: number
  description: string | null
  is_active: boolean
  hit_count: number
  created_at: string
  updated_at: string
}

export function AdminRedirectsClient({ redirects: initial }: { redirects: Redirect[] }) {
  const [redirects, setRedirects] = useState<Redirect[]>(initial)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Redirect | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openNew() {
    setEditing(null)
    setError(null)
    setOpen(true)
  }

  function openEdit(r: Redirect) {
    setEditing(r)
    setError(null)
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await upsertRedirect(fd)
        setOpen(false)
        // Refresh from server via reload
        window.location.reload()
      } catch (err: any) {
        setError(err.message ?? "Error al guardar")
      }
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteRedirect(deleteId)
      setRedirects((prev) => prev.filter((r) => r.id !== deleteId))
      setDeleteId(null)
    })
  }

  async function handleToggle(r: Redirect) {
    startTransition(async () => {
      await toggleRedirect(r.id, !r.is_active)
      setRedirects((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, is_active: !r.is_active } : x))
      )
    })
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Redirecciones</h1>
            <p className="text-sm text-slate-500">{redirects.length} redirección{redirects.length !== 1 ? "es" : ""} configurada{redirects.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva redirección
        </Button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-slate-900">{redirects.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Activas</p>
          <p className="text-2xl font-bold text-green-600">{redirects.filter(r => r.is_active).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Total visitas</p>
          <p className="text-2xl font-bold text-blue-600">{redirects.reduce((acc, r) => acc + (r.hit_count ?? 0), 0)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Ruta origen</TableHead>
              <TableHead className="font-semibold text-slate-700">Destino</TableHead>
              <TableHead className="font-semibold text-slate-700 w-20 text-center">Tipo</TableHead>
              <TableHead className="font-semibold text-slate-700 w-24 text-center">
                <div className="flex items-center justify-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Visitas
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700 w-24 text-center">Estado</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {redirects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No hay redirecciones configuradas. Crea la primera.
                </TableCell>
              </TableRow>
            ) : (
              redirects.map((r) => (
                <TableRow key={r.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <code className="text-sm font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {r.source_path}
                      </code>
                      {r.description && (
                        <p className="text-xs text-slate-400 mt-1">{r.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={r.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline max-w-xs truncate"
                    >
                      <span className="truncate">{r.destination_url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={r.redirect_type === 301 ? "default" : "secondary"}>
                      {r.redirect_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-slate-700">{r.hit_count ?? 0}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={r.is_active}
                      onCheckedChange={() => handleToggle(r)}
                      disabled={isPending}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar redirección" : "Nueva redirección"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div className="space-y-1.5">
              <Label htmlFor="source_path">
                Ruta origen <span className="text-red-500">*</span>
              </Label>
              <Input
                id="source_path"
                name="source_path"
                required
                placeholder="/cloud/descargas_mysair/Catalogo/..."
                defaultValue={editing?.source_path ?? ""}
              />
              <p className="text-xs text-slate-400">Ruta relativa que recibirá la visita, empezando por /</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="destination_url">
                URL destino <span className="text-red-500">*</span>
              </Label>
              <Input
                id="destination_url"
                name="destination_url"
                required
                placeholder="https://drive.google.com/..."
                defaultValue={editing?.destination_url ?? ""}
              />
              <p className="text-xs text-slate-400">URL completa a la que se redirigirá al usuario</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipo de redirección</Label>
                <Select name="redirect_type" defaultValue={String(editing?.redirect_type ?? 301)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 — Permanente</SelectItem>
                    <SelectItem value="302">302 — Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select name="is_active" defaultValue={String(editing?.is_active ?? true)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activa</SelectItem>
                    <SelectItem value="false">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Ej: Tarifa MYSAir 2024 → Google Drive"
                defaultValue={editing?.description ?? ""}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear redirección"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar redirección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La URL dejará de redirigir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
