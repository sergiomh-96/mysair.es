"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Video, AlertTriangle } from "lucide-react"
import { upsertProduct, deleteProduct, upsertProductVideo, deleteProductVideo } from "@/lib/actions/admin-products"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  category: string
  subcategory: string | null
  is_featured: boolean
  sort_order: number
  stl_model_url: string | null
  image_url: unknown
  dimensions: unknown
  fixation_types: unknown
  variants: unknown
  colors: unknown
  insulation_types: unknown
  lines_vias: unknown
  technical_specs: unknown
  communication_types: unknown
  manual_instalador_url: unknown
  manual_usuario_url: unknown
  bim_url: unknown
  cad_url: unknown
  ficha_tecnica_url: unknown
  product_videos: ProductVideo[]
}

type ProductVideo = {
  id: number
  product_id: number
  title: string
  youtube_url: string
  description: string | null
  sort_order: number
}

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [products, setProducts] = useState(initialProducts)
  const [productDialog, setProductDialog] = useState(false)
  const [videoDialog, setVideoDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ type: "product" | "video"; id: number } | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingVideo, setEditingVideo] = useState<{ video: ProductVideo | null; productId: number } | null>(null)
  const [error, setError] = useState("")

  function openNewProduct() {
    setEditingProduct(null)
    setError("")
    setProductDialog(true)
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p)
    setError("")
    setProductDialog(true)
  }

  function openNewVideo(productId: number) {
    setEditingVideo({ video: null, productId })
    setVideoDialog(true)
  }

  function openEditVideo(video: ProductVideo) {
    setEditingVideo({ video, productId: video.product_id })
    setVideoDialog(true)
  }

  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await upsertProduct(fd)
        setProductDialog(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar")
      }
    })
  }

  async function handleVideoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await upsertProductVideo(fd)
        setVideoDialog(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar video")
      }
    })
  }

  async function handleDelete() {
    if (!deleteDialog) return
    startTransition(async () => {
      try {
        if (deleteDialog.type === "product") await deleteProduct(deleteDialog.id)
        else await deleteProductVideo(deleteDialog.id)
        setDeleteDialog(null)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al eliminar")
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} productos en total</p>
        </div>
        <Button onClick={openNewProduct} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="h-4 w-4" /> Nuevo producto
        </Button>
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-slate-400 py-10">No hay productos</TableCell></TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm font-mono">{p.slug}</TableCell>
                <TableCell>
                  {p.is_featured ? <Badge className="bg-blue-100 text-blue-700 text-xs">Sí</Badge> : <span className="text-slate-400 text-xs">No</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">{p.product_videos?.length ?? 0}</span>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openNewVideo(p.id)}>
                      <Video className="h-3.5 w-3.5 text-slate-400" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditProduct(p)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDeleteDialog({ type: "product", id: p.id })}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Product Dialog */}
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductSubmit}>
            {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
            <Tabs defaultValue="general" className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="files">Archivos</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input name="name" defaultValue={editingProduct?.name} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input name="slug" defaultValue={editingProduct?.slug} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Categoría *</Label>
                    <Input name="category" defaultValue={editingProduct?.category} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subcategoría</Label>
                    <Input name="subcategory" defaultValue={editingProduct?.subcategory ?? ""} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Descripción</Label>
                  <Textarea name="description" defaultValue={editingProduct?.description ?? ""} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Orden</Label>
                    <Input name="sort_order" type="number" defaultValue={editingProduct?.sort_order ?? 0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Destacado</Label>
                    <Select name="is_featured" defaultValue={editingProduct?.is_featured ? "true" : "false"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>URLs de imágenes (JSON array)</Label>
                  <Textarea name="image_url" defaultValue={editingProduct?.image_url ? JSON.stringify(editingProduct.image_url) : "[]"} rows={2} className="font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label>URL modelo STL</Label>
                  <Input name="stl_model_url" defaultValue={editingProduct?.stl_model_url ?? ""} />
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-4">
                {[
                  { name: "dimensions", label: "Dimensiones (JSON)" },
                  { name: "variants", label: "Variantes (JSON)" },
                  { name: "colors", label: "Colores (JSON)" },
                  { name: "fixation_types", label: "Tipos de fijación (JSON)" },
                  { name: "insulation_types", label: "Tipos de aislamiento (JSON)" },
                  { name: "lines_vias", label: "Líneas/Vías (JSON)" },
                  { name: "communication_types", label: "Comunicaciones (JSON)" },
                  { name: "technical_specs", label: "Especificaciones técnicas (JSON)" },
                ].map(({ name, label }) => (
                  <div key={name} className="space-y-1.5">
                    <Label>{label}</Label>
                    <Textarea
                      name={name}
                      defaultValue={editingProduct?.[name as keyof Product] ? JSON.stringify(editingProduct[name as keyof Product]) : ""}
                      rows={2}
                      className="font-mono text-xs"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                {[
                  { name: "ficha_tecnica_url", label: "Ficha técnica (JSON)" },
                  { name: "manual_instalador_url", label: "Manual instalador (JSON)" },
                  { name: "manual_usuario_url", label: "Manual usuario (JSON)" },
                  { name: "bim_url", label: "BIM (JSON)" },
                  { name: "cad_url", label: "CAD (JSON)" },
                ].map(({ name, label }) => (
                  <div key={name} className="space-y-1.5">
                    <Label>{label}</Label>
                    <Textarea
                      name={name}
                      defaultValue={editingProduct?.[name as keyof Product] ? JSON.stringify(editingProduct[name as keyof Product]) : ""}
                      rows={2}
                      className="font-mono text-xs"
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setProductDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo?.video ? "Editar video" : "Añadir video"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            {editingVideo?.video && <input type="hidden" name="id" value={editingVideo.video.id} />}
            <input type="hidden" name="product_id" value={editingVideo?.productId} />
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input name="title" defaultValue={editingVideo?.video?.title} required />
            </div>
            <div className="space-y-1.5">
              <Label>URL YouTube *</Label>
              <Input name="youtube_url" defaultValue={editingVideo?.video?.youtube_url} placeholder="https://youtube.com/watch?v=..." required />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea name="description" defaultValue={editingVideo?.video?.description ?? ""} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Orden</Label>
              <Input name="sort_order" type="number" defaultValue={editingVideo?.video?.sort_order ?? 0} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVideoDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este {deleteDialog?.type === "product" ? "producto" : "video"}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
