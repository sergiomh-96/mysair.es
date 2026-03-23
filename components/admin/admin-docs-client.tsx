"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, ExternalLink, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react"
import { addDocLink, deleteDocLink, toggleDocLink } from "@/lib/actions/admin-docs"

type DocLink = {
  id: number
  name: string
  url: string
  description: string | null
  type: string
  is_active: boolean
  created_at: string
}

export function AdminDocsClient({ initialLinks }: { initialLinks: DocLink[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [addDialog, setAddDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [error, setError] = useState("")

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await addDocLink(fd)
        setAddDialog(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al añadir enlace")
      }
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteDocLink(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  async function handleToggle(id: number, current: boolean) {
    startTransition(async () => {
      await toggleDocLink(id, !current)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentación</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona los enlaces de documentación</p>
        </div>
        <Button onClick={() => { setError(""); setAddDialog(true) }} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" /> Añadir enlace
        </Button>
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLinks.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-10">No hay enlaces de documentación</TableCell></TableRow>
            )}
            {initialLinks.map((link) => (
              <TableRow key={link.id} className="hover:bg-slate-50">
                <TableCell>
                  <p className="font-medium text-slate-900">{link.name}</p>
                  {link.description && <p className="text-xs text-slate-400 mt-0.5">{link.description}</p>}
                </TableCell>
                <TableCell>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1 max-w-xs truncate">
                    {link.url} <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">{link.type}</Badge>
                </TableCell>
                <TableCell>
                  <button onClick={() => handleToggle(link.id, link.is_active)} className="flex items-center gap-1.5 text-sm">
                    {link.is_active
                      ? <><ToggleRight className="h-5 w-5 text-emerald-500" /><span className="text-emerald-600">Activo</span></>
                      : <><ToggleLeft className="h-5 w-5 text-slate-400" /><span className="text-slate-400">Inactivo</span></>
                    }
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDeleteId(link.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir enlace</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre *</Label>
              <Input name="name" placeholder="Ej: Manual de instalación" required />
            </div>
            <div className="space-y-1.5">
              <Label>URL *</Label>
              <Input name="url" type="url" placeholder="https://..." required />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea name="description" rows={2} placeholder="Descripción opcional..." />
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Input name="type" defaultValue="documentation" placeholder="documentation, manual, guide..." />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Añadiendo..." : "Añadir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" /> Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">¿Estás seguro de que quieres eliminar este enlace?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
