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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, AlertTriangle, Globe, ChevronDown, ChevronUp, X } from "lucide-react"
import { upsertBlog, deleteBlog } from "@/lib/actions/admin-blogs"

type Section = {
  id: string
  level: "h2" | "h3"
  title: string
  content: string
}

type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  sections: Section[] | null
  summary: string | null
  image_url: string | null
  author: string
  category: string | null
  tags: string[]
  published: boolean
  featured: boolean
  reading_time: number | null
  route_type: "blogs" | "blog"
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  created_at: string
}

// Section editor component
function SectionEditor({ initialSections }: { initialSections: Section[] }) {
  const [sections, setSections] = useState<Section[]>(initialSections)

  function addSection(level: "h2" | "h3") {
    setSections(prev => [...prev, { id: crypto.randomUUID(), level, title: "", content: "" }])
  }

  function updateSection(id: string, field: keyof Section, value: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function removeSection(id: string) {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  function moveSection(id: string, dir: "up" | "down") {
    const idx = sections.findIndex(s => s.id === id)
    if (dir === "up" && idx === 0) return
    if (dir === "down" && idx === sections.length - 1) return
    const next = [...sections]
    const swap = dir === "up" ? idx - 1 : idx + 1
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setSections(next)
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />

      {/* Auto-generated TOC preview */}
      {sections.filter(s => s.level === "h2" && s.title).length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Indice generado automáticamente</p>
          <ol className="space-y-1">
            {sections.filter(s => s.level === "h2" && s.title).map((s, i) => (
              <li key={s.id} className="text-sm text-blue-600 flex items-center gap-1.5">
                <span className="text-slate-400 text-xs">{i + 1}.</span>
                {s.title}
              </li>
            ))}
          </ol>
        </div>
      )}

      {sections.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
          No hay secciones. Añade una sección H2 o H3.
        </p>
      )}

      {sections.map((section, idx) => (
        <div key={section.id} className={`border rounded-lg p-3 space-y-2 ${section.level === "h2" ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-slate-50/30 ml-4"}`}>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs font-mono ${section.level === "h2" ? "border-blue-400 text-blue-700" : "border-slate-400 text-slate-600"}`}>
              {section.level.toUpperCase()}
            </Badge>
            <Input
              placeholder={`Título del apartado ${section.level.toUpperCase()}`}
              value={section.title}
              onChange={e => updateSection(section.id, "title", e.target.value)}
              className="flex-1 h-8 text-sm font-medium"
            />
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveSection(section.id, "up")} disabled={idx === 0}>
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => moveSection(section.id, "down")} disabled={idx === sections.length - 1}>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600" onClick={() => removeSection(section.id)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Texto explicativo de esta sección..."
            value={section.content}
            onChange={e => updateSection(section.id, "content", e.target.value)}
            rows={3}
            className="text-sm resize-none"
          />
        </div>
      ))}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={() => addSection("h2")} className="gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50">
          <Plus className="h-3.5 w-3.5" /> Añadir H2
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => addSection("h3")} className="gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" /> Añadir H3
        </Button>
      </div>
    </div>
  )
}

// Normalize sections from DB (may use "type" instead of "level")
function normalizeSections(raw: any[] | null | undefined): Section[] {
  if (!raw || !Array.isArray(raw)) return []
  return raw.map(s => ({
    id: s.id ?? crypto.randomUUID(),
    level: (s.level ?? s.type ?? "h2") as "h2" | "h3",
    title: s.title ?? "",
    content: s.content ?? "",
  }))
}

export function AdminBlogsClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [error, setError] = useState("")

  function openNew() { setEditing(null); setError(""); setDialog(true) }
  function openEdit(b: Blog) { setEditing(b); setError(""); setDialog(true) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await upsertBlog(fd)
        setDialog(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar")
      }
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      await deleteBlog(deleteId)
      setDeleteId(null)
      router.refresh()
    })
  }

  // Format date for input[type=date]
  function toDateInputValue(dateStr: string | null | undefined) {
    if (!dateStr) return new Date().toISOString().split("T")[0]
    return new Date(dateStr).toISOString().split("T")[0]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">{initialBlogs.length} artículos en total</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" /> Nuevo artículo
        </Button>
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Publicación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBlogs.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-slate-400 py-10">No hay artículos</TableCell></TableRow>
            )}
            {initialBlogs.map((b) => (
              <TableRow key={b.id} className="hover:bg-slate-50">
                <TableCell>
                  <p className="font-medium text-slate-900 max-w-xs truncate">{b.title}</p>
                  <p className="text-xs text-slate-400 font-mono">{b.slug}</p>
                </TableCell>
                <TableCell>
                  {b.category && <Badge variant="outline" className="text-xs">{b.category}</Badge>}
                </TableCell>
                <TableCell>
                  {b.published
                    ? <Badge className="bg-emerald-100 text-emerald-700 text-xs">Publicado</Badge>
                    : <Badge className="bg-slate-100 text-slate-600 text-xs">Borrador</Badge>}
                </TableCell>
                <TableCell>
                  {b.featured ? <Badge className="bg-amber-100 text-amber-700 text-xs">Sí</Badge> : <span className="text-slate-400 text-xs">No</span>}
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {b.published_at
                    ? new Date(b.published_at).toLocaleDateString("es-ES")
                    : new Date(b.created_at).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(b)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDeleteId(b.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Blog Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Tabs defaultValue="contenido" className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="contenido">Contenido</TabsTrigger>
                <TabsTrigger value="secciones">Secciones</TabsTrigger>
                <TabsTrigger value="seo">
                  <Globe className="h-3.5 w-3.5 mr-1.5" />SEO
                </TabsTrigger>
                <TabsTrigger value="opciones">Opciones</TabsTrigger>
              </TabsList>

              {/* CONTENIDO */}
              <TabsContent value="contenido" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Título *</Label>
                    <Input name="title" defaultValue={editing?.title} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Slug *</Label>
                    <Input name="slug" defaultValue={editing?.slug} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Extracto</Label>
                  <Textarea name="excerpt" defaultValue={editing?.excerpt ?? ""} rows={2} placeholder="Breve descripción del artículo..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Introducción / Contenido principal</Label>
                  <Textarea name="content" defaultValue={editing?.content} rows={6} placeholder="Texto introductorio del artículo..." className="text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label>Resumen</Label>
                  <Textarea name="summary" defaultValue={editing?.summary ?? ""} rows={3} placeholder="Resumen que se mostrará al final del artículo..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>URL imagen principal</Label>
                    <Input name="image_url" defaultValue={editing?.image_url ?? ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Autor</Label>
                    <Input name="author" defaultValue={editing?.author ?? "MYSAir"} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Categoría</Label>
                    <Input name="category" defaultValue={editing?.category ?? ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Etiquetas (separadas por comas)</Label>
                    <Input name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} />
                  </div>
                </div>
              </TabsContent>

              {/* SECCIONES */}
              <TabsContent value="secciones" className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-medium">Editor de secciones</p>
                  <p className="text-xs text-blue-600 mt-1">Añade secciones H2 y H3. El índice se generará automáticamente a partir de los títulos H2.</p>
                </div>
                <SectionEditor initialSections={normalizeSections(editing?.sections)} />
              </TabsContent>

              {/* SEO */}
              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Meta título</Label>
                  <Input name="meta_title" defaultValue={editing?.meta_title ?? ""} placeholder="Título para motores de búsqueda (max 60 chars)" />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta descripción</Label>
                  <Textarea name="meta_description" defaultValue={editing?.meta_description ?? ""} rows={2} placeholder="Descripción para motores de búsqueda (max 160 chars)" />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta keywords</Label>
                  <Input name="meta_keywords" defaultValue={editing?.meta_keywords ?? ""} placeholder="palabra1, palabra2, palabra3..." />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5"><Globe className="h-4 w-4" /> Open Graph (Redes Sociales)</p>
                  <div className="space-y-1.5">
                    <Label>OG Título</Label>
                    <Input name="og_title" defaultValue={editing?.og_title ?? ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>OG Descripción</Label>
                    <Textarea name="og_description" defaultValue={editing?.og_description ?? ""} rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>OG Imagen URL</Label>
                    <Input name="og_image" defaultValue={editing?.og_image ?? ""} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>URL Canónica</Label>
                  <Input name="canonical_url" defaultValue={editing?.canonical_url ?? ""} placeholder="https://mysair.es/blogs/..." />
                </div>
              </TabsContent>

              {/* OPCIONES */}
              <TabsContent value="opciones" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                    <Select name="published" defaultValue={editing?.published ? "true" : "false"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Publicado</SelectItem>
                        <SelectItem value="false">Borrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Destacado</Label>
                    <Select name="featured" defaultValue={editing?.featured ? "true" : "false"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Fecha de publicación</Label>
                    <Input
                      name="published_at"
                      type="date"
                      defaultValue={toDateInputValue(editing?.published_at ?? editing?.created_at)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tiempo de lectura (minutos)</Label>
                    <Input name="reading_time" type="number" defaultValue={editing?.reading_time ?? ""} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Ruta</Label>
                  <Select name="route_type" defaultValue={editing?.route_type ?? "blogs"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blogs">/blogs/xxxx</SelectItem>
                      <SelectItem value="blog">/blog/xxxx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Guardando..." : "Guardar"}
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
          <p className="text-sm text-slate-600">¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.</p>
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
