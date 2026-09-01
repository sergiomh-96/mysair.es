"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Video, AlertTriangle, Copy } from "lucide-react"
import { upsertProduct, deleteProduct, upsertProductVideo, deleteProductVideo, bulkImportProducts, duplicateProduct } from "@/lib/actions/admin-products"
import { useRouter } from "next/navigation"
import { DocumentListField } from "./document-list-field"
import { StringListField } from "./string-list-field"
import { SpecListField } from "./spec-list-field"
import { TechnicalSpecsField } from "./technical-specs-field"
import { BulkExcelImport } from "./bulk-excel-import"
import { toast } from "sonner"

type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  category: string
  subcategory: string | null
  is_featured: boolean
  is_active: boolean
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
        toast.success(editingProduct ? "Producto actualizado correctamente" : "Producto creado correctamente")
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar el producto"
        setError(msg)
        toast.error(msg)
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
        toast.success("Video guardado correctamente")
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar video"
        setError(msg)
        toast.error(msg)
      }
    })
  }

  async function handleDelete() {
    if (!deleteDialog) return
    startTransition(async () => {
      try {
        if (deleteDialog.type === "product") {
          await deleteProduct(deleteDialog.id)
          toast.success("Producto eliminado")
        } else {
          await deleteProductVideo(deleteDialog.id)
          toast.success("Video eliminado")
        }
        setDeleteDialog(null)
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar"
        setError(msg)
        toast.error(msg)
      }
    })
  }

  async function handleDuplicateProduct(id: number) {
    startTransition(async () => {
      try {
        const res = await duplicateProduct(id)
        toast.success(`Producto duplicado: ${res.name}`)
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al duplicar el producto"
        toast.error(msg)
      }
    })
  }

  const productTemplateHeaders = [
    "name",
    "slug",
    "category",
    "subcategory",
    "description",
    "is_featured",
    "is_active",
    "sort_order",
    "stl_model_url",
    "image_url",
    "variants",
    "dimensions",
    "colors",
    "fixation_types",
    "insulation_types",
    "lines_vias",
    "communication_types",
    "technical_specs",
    "ficha_tecnica_url",
    "manual_instalador_url",
    "manual_usuario_url",
  ]

  const productTemplateSampleData = [
    {
      name: "Rejilla Lineal MS201V",
      slug: "ms201v",
      category: "air_diffusion",
      subcategory: "grilles",
      description: "Rejilla lineal de difusión de aire continuo de alta eficiencia arquitectónica.",
      is_featured: true,
      is_active: true,
      sort_order: 1,
      stl_model_url: "https://mysair.es/models/ms201v.stl",
      image_url: '["https://mysair.es/images/ms201v-1.jpg", "https://mysair.es/images/ms201v-2.jpg"]',
      variants: '[{"name":"MS201V-V1","description":"1 Vía"},{"name":"MS201V-V2","description":"2 Vías"}]',
      dimensions: '[{"name":"200x100 mm","description":"150-300 m³/h"}]',
      colors: '[{"name":"Blanco RAL 9010","hex_color":"#FFFFFF"}]',
      fixation_types: '[{"name":"Clips ocultos","description":"Montaje en techo continuo"}]',
      insulation_types: '[{"name":"Termoacústico 10mm","description":"Clase 0"}]',
      lines_vias: '[{"name":"1 Vía","description":"Impulsión lineal"}]',
      communication_types: '[{"name":"Modbus RTU","description":"RS-485"}]',
      technical_specs: '{"Alimentacion":"230V AC - 50Hz","Material":"Aluminio extruido","Nivel sonoro":"< 25 dB(A)"}',
      ficha_tecnica_url: '[{"name":"Ficha Técnica MS201V - ES","url":"https://drive.google.com/open?id=XXXX"}]',
      manual_instalador_url: '[{"name":"Manual Instalador v2","url":"https://drive.google.com/open?id=YYYY"}]',
      manual_usuario_url: '[{"name":"Guía Rápida","url":"https://drive.google.com/open?id=ZZZZ"}]',
    },
    {
      name: "Central de Control MS-CC7",
      slug: "ms-cc7",
      category: "smart_systems",
      subcategory: "zoning",
      description: "Central inteligente de zonificación para hasta 7 zonas independientes.",
      is_featured: false,
      is_active: true,
      sort_order: 2,
      stl_model_url: "",
      image_url: '["https://mysair.es/images/ms-cc7.jpg"]',
      variants: '[{"name":"MS-CC7-WIFI","description":"Conexión WiFi y App"}]',
      dimensions: '[{"name":"220x160 mm","description":"Caja carril DIN"}]',
      colors: '[{"name":"Gris Industrial","hex_color":"#4B5563"}]',
      fixation_types: '[{"name":"Carril DIN","description":"Montaje en cuadro eléctrico"}]',
      insulation_types: '[]',
      lines_vias: '[]',
      communication_types: '[{"name":"WiFi / Modbus / Zigbee","description":"Integración domótica completa"}]',
      technical_specs: '{"Alimentacion":"24V DC / 230V AC","Consumo maximo":"15W","Salidas reles":"7 salidas a 230V"}',
      ficha_tecnica_url: '[{"name":"Ficha Técnica MS-CC7","url":"https://drive.google.com/..."}]',
      manual_instalador_url: '[{"name":"Manual de Puesta en Marcha","url":"https://drive.google.com/..."}]',
      manual_usuario_url: '[]',
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} productos en total</p>
        </div>
        <div className="flex items-center gap-2.5">
          <BulkExcelImport
            title="Importación Masiva de Productos"
            description="Sube un archivo Excel (.xlsx/.csv) para crear o actualizar productos de forma masiva"
            templateFilename="plantilla_productos_mysair"
            templateHeaders={productTemplateHeaders}
            templateSampleData={productTemplateSampleData}
            onImport={async (rows) => {
              const res = await bulkImportProducts(rows)
              router.refresh()
              return res
            }}
            triggerLabel="Importar Excel"
          />
          <Button onClick={openNewProduct} className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-2xs">
            <Plus className="h-4 w-4" /> Nuevo producto
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-16 text-center">Nº Orden</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-slate-400 py-10">No hay productos</TableCell></TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id} className="hover:bg-slate-50">
                <TableCell className="text-center font-mono font-semibold text-xs text-slate-600 bg-slate-50/50">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                    {p.sort_order ?? 0}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm font-mono">{p.slug}</TableCell>
                <TableCell>
                  {p.is_featured ? <Badge className="bg-blue-100 text-blue-700 text-xs">Sí</Badge> : <span className="text-slate-400 text-xs">No</span>}
                </TableCell>
                <TableCell>
                  {p.is_active !== false ? <Badge className="bg-green-100 text-green-700 text-xs">Sí</Badge> : <Badge className="bg-red-100 text-red-700 text-xs">No</Badge>}
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDuplicateProduct(p.id)} title="Duplicar producto" disabled={isPending}>
                      <Copy className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditProduct(p)} title="Editar producto">
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDeleteDialog({ type: "product", id: p.id })} title="Eliminar producto">
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
        <DialogContent className="max-w-5xl sm:max-w-5xl md:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                  <div className="space-y-1.5">
                    <Label>Activo (en catálogo)</Label>
                    <Select name="is_active" defaultValue={editingProduct?.is_active !== false ? "true" : "false"}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Sí (Activo)</SelectItem>
                        <SelectItem value="false">No (Descatalogado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <StringListField
                    name="image_url"
                    label="Imágenes del producto"
                    description="URLs de imágenes para la galería del producto"
                    initialValue={editingProduct?.image_url}
                    placeholder="https://... o /images/products/..."
                    addButtonText="Añadir imagen"
                    emptyText="No hay imágenes añadidas."
                    isImage={true}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>URL modelo STL (3D)</Label>
                  <Input name="stl_model_url" defaultValue={editingProduct?.stl_model_url ?? ""} placeholder="https://.../model.stl" />
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-5">
                <SpecListField
                  name="variants"
                  label="Variantes y Modelos"
                  description="Variantes del producto con nombre/código y descripción detallada"
                  initialValue={editingProduct?.variants}
                  nameLabel="Título / Modelo"
                  namePlaceholder="Ej: MS201V-V4"
                  valueLabel="Descripción / Función"
                  valuePlaceholder="Ej: Central de clima 7 zonas"
                  addButtonText="Añadir variante / modelo"
                />

                <SpecListField
                  name="dimensions"
                  label="Dimensiones disponibles"
                  description="Medidas y formatos disponibles del producto"
                  initialValue={editingProduct?.dimensions}
                  nameLabel="Dimensión / Formato"
                  namePlaceholder="Ej: 200 x 100 mm o Ø 150 mm"
                  valueLabel="Caudal / Detalle"
                  valuePlaceholder="Ej: 150 - 300 m³/h"
                  addButtonText="Añadir dimensión"
                />

                <SpecListField
                  name="colors"
                  label="Colores y Acabados"
                  description="Paleta de colores disponibles con selector visual"
                  initialValue={editingProduct?.colors}
                  nameLabel="Nombre del color"
                  namePlaceholder="Ej: Blanco lacado RAL 9010"
                  valueLabel="Color HEX"
                  valuePlaceholder="Ej: #FFFFFF"
                  isColor={true}
                  addButtonText="Añadir color"
                />

                <SpecListField
                  name="fixation_types"
                  label="Tipos de Fijación"
                  description="Sistemas de fijación y montaje disponibles"
                  initialValue={editingProduct?.fixation_types}
                  nameLabel="Tipo de fijación"
                  namePlaceholder="Ej: Fijación por clips ocultos"
                  valueLabel="Descripción / Aplicación"
                  valuePlaceholder="Ej: Recomendado para techos continuos de yeso"
                  addButtonText="Añadir tipo de fijación"
                />

                <SpecListField
                  name="insulation_types"
                  label="Tipos de Aislamiento"
                  description="Opciones de aislamiento térmico y acústico"
                  initialValue={editingProduct?.insulation_types}
                  nameLabel="Tipo de aislamiento"
                  namePlaceholder="Ej: Aislamiento termoacústico 10 mm"
                  valueLabel="Descripción"
                  valuePlaceholder="Ej: Espuma elastomérica ignífuga clase 0"
                  addButtonText="Añadir tipo de aislamiento"
                />

                <SpecListField
                  name="lines_vias"
                  label="Líneas / Vías de Difusión"
                  description="Opciones de vías de impulsión o retorno"
                  initialValue={editingProduct?.lines_vias}
                  nameLabel="Número de vías"
                  namePlaceholder="Ej: 1 Vía / 2 Vías"
                  valueLabel="Descripción"
                  valuePlaceholder="Ej: Impulsión bidireccional de aire"
                  addButtonText="Añadir opción de vías"
                />

                <SpecListField
                  name="communication_types"
                  label="Tipos de Comunicación"
                  description="Protocolos y conexiones inteligentes soportadas"
                  initialValue={editingProduct?.communication_types}
                  nameLabel="Protocolo / Conexión"
                  namePlaceholder="Ej: Modbus RTU / RS-485 / Zigbee"
                  valueLabel="Descripción"
                  valuePlaceholder="Ej: Integración domótica directa con BMS"
                  addButtonText="Añadir tipo de comunicación"
                />

                <TechnicalSpecsField
                  name="technical_specs"
                  label="Especificaciones Técnicas"
                  description="Características técnicas del producto (un guion - por cada especificación)"
                  initialValue={editingProduct?.technical_specs}
                  addButtonText="Añadir bloque de especificaciones"
                />
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <DocumentListField
                  name="ficha_tecnica_url"
                  label="Ficha técnica"
                  description="Documentos de ficha técnica disponibles para descarga"
                  initialValue={editingProduct?.ficha_tecnica_url}
                  nameFieldPlaceholder="Ej: Ficha Técnica MS201V - ES"
                  addButtonText="Añadir ficha técnica"
                />

                <DocumentListField
                  name="manual_instalador_url"
                  label="Manual de instalador"
                  description="Manuales de instalación y puesta en marcha"
                  initialValue={editingProduct?.manual_instalador_url}
                  nameFieldPlaceholder="Ej: Manual Instalador v2.1"
                  addButtonText="Añadir manual de instalador"
                />

                <DocumentListField
                  name="manual_usuario_url"
                  label="Manual de usuario"
                  description="Guías y manuales de usuario final"
                  initialValue={editingProduct?.manual_usuario_url}
                  nameFieldPlaceholder="Ej: Guía de Usuario - ES"
                  addButtonText="Añadir manual de usuario"
                />

                <DocumentListField
                  name="bim_url"
                  label="Modelos BIM / Revit"
                  description="Archivos BIM / Revit para arquitectos e ingenieros"
                  initialValue={editingProduct?.bim_url}
                  nameFieldPlaceholder="Ej: Archivo BIM RFA / IFC"
                  addButtonText="Añadir archivo BIM"
                />

                <DocumentListField
                  name="cad_url"
                  label="Archivos CAD / DWG"
                  description="Planos 2D y 3D en formato DWG / DXF"
                  initialValue={editingProduct?.cad_url}
                  nameFieldPlaceholder="Ej: Plano CAD 2D/3D (DWG)"
                  addButtonText="Añadir archivo CAD"
                />
              </TabsContent>
            </Tabs>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <DialogFooter className="mt-4 gap-2 flex-wrap">
              {editingProduct && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const prodId = editingProduct.id
                    setProductDialog(false)
                    handleDuplicateProduct(prodId)
                  }}
                  disabled={isPending}
                  className="mr-auto gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs font-semibold"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicar producto
                </Button>
              )}
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
        <DialogContent className="sm:max-w-2xl w-full">
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
