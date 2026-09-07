"use client"

import { useState, useTransition, useEffect, useMemo, useRef } from "react"
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
import { Plus, Pencil, Trash2, Video, AlertTriangle, Copy, Search, X } from "lucide-react"
import { upsertProduct, deleteProduct, upsertProductVideo, deleteProductVideo, bulkImportProducts, duplicateProduct } from "@/lib/actions/admin-products"
import { useRouter } from "next/navigation"
import { DocumentListField } from "./document-list-field"
import { StringListField } from "./string-list-field"
import { SpecListField } from "./spec-list-field"
import { TechnicalSpecsField } from "./technical-specs-field"
import { BulkExcelImport } from "./bulk-excel-import"
import { toast } from "sonner"

const STANDARD_CATEGORIES: { id: string; label: string }[] = [
  { id: "air_diffusion", label: "Difusión de Aire (air_diffusion)" },
  { id: "smart_systems", label: "Sistemas Inteligentes (smart_systems)" },
  { id: "vmc", label: "Ventilación y VMC (vmc)" },
]

const STANDARD_SUBCATEGORIES: Record<string, { id: string; label: string }[]> = {
  air_diffusion: [
    { id: "grilles", label: "Rejillas (grilles)" },
    { id: "diffusers", label: "Difusores (diffusers)" },
    { id: "plenums", label: "Plenums (plenums)" },
    { id: "linear_diffusers", label: "Difusores Lineales (linear_diffusers)" },
    { id: "circular_diffusers", label: "Difusores Circulares (circular_diffusers)" },
    { id: "nozzles", label: "Toberas (nozzles)" },
    { id: "dampers", label: "Compuertas de Regulación (dampers)" },
    { id: "accessories", label: "Accesorios (accessories)" },
  ],
  smart_systems: [
    { id: "control_units", label: "Centrales de Control (control_units)" },
    { id: "thermostats", label: "Termostatos y Sondas (thermostats)" },
    { id: "gateways", label: "Pasarelas de Comunicación (gateways)" },
    { id: "actuators", label: "Compuertas Motorizadas y Motores (actuators)" },
    { id: "communication_modules", label: "Módulos de Expansión / Web (communication_modules)" },
    { id: "accessories", label: "Accesorios (accessories)" },
  ],
  vmc: [
    { id: "heat_recovery", label: "Recuperadores de Calor (heat_recovery)" },
    { id: "recovery", label: "Recuperación (recovery)" },
    { id: "residential", label: "VMC Residencial (residential)" },
    { id: "commercial", label: "VMC Comercial / Industrial (commercial)" },
    { id: "filtration", label: "Filtración (filtration)" },
    { id: "decentralized", label: "VMC Descentralizada (decentralized)" },
    { id: "hybrid", label: "Sistemas Híbridos (hybrid)" },
    { id: "accessories", label: "Accesorios (accessories)" },
  ],
}

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
  const submitIntentRef = useRef<"save" | "saveAndClose">("save")
  const [products, setProducts] = useState(initialProducts)
  const [productDialog, setProductDialog] = useState(false)
  const [videoDialog, setVideoDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ type: "product" | "video"; id: number } | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingVideo, setEditingVideo] = useState<{ video: ProductVideo | null; productId: number } | null>(null)
  const [error, setError] = useState("")

  const [categorySelect, setCategorySelect] = useState<string>("air_diffusion")
  const [customCategory, setCustomCategory] = useState<string>("")
  const [subcategorySelect, setSubcategorySelect] = useState<string>("__none__")
  const [customSubcategory, setCustomSubcategory] = useState<string>("")

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const availableCategories = useMemo(() => {
    const map = new Map<string, string>()
    STANDARD_CATEGORIES.forEach((c) => map.set(c.id, c.label))
    products.forEach((p) => {
      if (p.category && !map.has(p.category)) {
        map.set(p.category, `${p.category} (existente)`)
      }
    })
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }))
  }, [products])

  const effectiveCategory = categorySelect === "__custom__" ? customCategory.trim() : categorySelect

  const availableSubcategories = useMemo(() => {
    const map = new Map<string, string>()
    const standardForCat = STANDARD_SUBCATEGORIES[effectiveCategory] || []
    standardForCat.forEach((s) => map.set(s.id, s.label))

    products.forEach((p) => {
      if ((p.category === effectiveCategory || !effectiveCategory) && p.subcategory && !map.has(p.subcategory)) {
        map.set(p.subcategory, `${p.subcategory} (existente)`)
      }
    })
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }))
  }, [products, effectiveCategory])

  // Filtered products list based on search and filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = p.name?.toLowerCase().includes(q)
        const slugMatch = p.slug?.toLowerCase().includes(q)
        const catMatch = p.category?.toLowerCase().includes(q)
        const subMatch = p.subcategory?.toLowerCase().includes(q)
        const descMatch = p.description?.toLowerCase().includes(q)
        if (!nameMatch && !slugMatch && !catMatch && !subMatch && !descMatch) {
          return false
        }
      }

      // Category filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false
      }

      // Status filter
      if (statusFilter === "active" && p.is_active === false) return false
      if (statusFilter === "inactive" && p.is_active !== false) return false
      if (statusFilter === "featured" && !p.is_featured) return false

      return true
    })
  }, [products, searchQuery, categoryFilter, statusFilter])

  function openNewProduct() {
    submitIntentRef.current = "save"
    setEditingProduct(null)
    setCategorySelect("air_diffusion")
    setCustomCategory("")
    setSubcategorySelect("__none__")
    setCustomSubcategory("")
    setError("")
    setProductDialog(true)
  }

  function openEditProduct(p: Product) {
    submitIntentRef.current = "save"
    setEditingProduct(p)
    setError("")

    const existingCat = p.category || "air_diffusion"
    const catMatchesKnown = availableCategories.some((c) => c.id === existingCat)
    if (catMatchesKnown) {
      setCategorySelect(existingCat)
      setCustomCategory("")
    } else {
      setCategorySelect("__custom__")
      setCustomCategory(existingCat)
    }

    const existingSub = p.subcategory || ""
    if (!existingSub) {
      setSubcategorySelect("__none__")
      setCustomSubcategory("")
    } else {
      const subMatchesKnown = availableSubcategories.some((s) => s.id === existingSub)
      if (subMatchesKnown) {
        setSubcategorySelect(existingSub)
        setCustomSubcategory("")
      } else {
        setSubcategorySelect("__custom__")
        setCustomSubcategory(existingSub)
      }
    }

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
    const isEdit = Boolean(editingProduct)
    const intent = submitIntentRef.current

    startTransition(async () => {
      try {
        const saved = await upsertProduct(fd)
        if (saved) {
          setEditingProduct(saved)
          setProducts((prev) => {
            const idx = prev.findIndex((p) => p.id === saved.id)
            if (idx >= 0) {
              const copy = [...prev]
              copy[idx] = saved
              return copy
            }
            return [...prev, saved]
          })
        }

        // Only close if it was creating a new product or if "Guardar y cerrar" was clicked
        const shouldClose = !isEdit || intent === "saveAndClose"
        if (shouldClose) {
          setProductDialog(false)
        }

        toast.success(isEdit ? "Producto guardado correctamente" : "Producto creado correctamente")
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
          <p className="text-slate-500 text-sm mt-1">
            {products.length} productos en total
            {filteredProducts.length !== products.length && ` (mostrando ${filteredProducts.length})`}
          </p>
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

      {/* Search & Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre, slug, categoría o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs bg-slate-50/50 focus:bg-white border-slate-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 rounded-full"
              title="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Selects */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200 w-[190px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {availableCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs bg-slate-50/50 border-slate-200 w-[145px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Descatalogados</SelectItem>
              <SelectItem value="featured">Destacados</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
              className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Limpiar filtros
            </Button>
          )}

          <div className="text-xs text-slate-400 pl-1 font-medium shrink-0">
            {filteredProducts.length} de {products.length}
          </div>
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
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-400 py-12">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-700 text-sm">No se encontraron productos</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                        ? "Prueba a cambiar el término de búsqueda o restablecer los filtros."
                        : "No hay productos registrados."}
                    </p>
                    {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setCategoryFilter("all")
                          setStatusFilter("all")
                        }}
                        className="text-xs mt-1"
                      >
                        Limpiar búsqueda y filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredProducts.map((p) => (
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
                    <Select
                      value={categorySelect}
                      onValueChange={(val) => {
                        setCategorySelect(val)
                        if (val !== "__custom__") {
                          setCustomCategory("")
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="__custom__" className="text-blue-600 font-medium">
                          + Otra categoría personalizada...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {categorySelect === "__custom__" && (
                      <Input
                        placeholder="Identificador de la categoría (ej: nueva_categoria)..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="mt-1.5"
                        required
                      />
                    )}
                    <input
                      type="hidden"
                      name="category"
                      value={categorySelect === "__custom__" ? customCategory.trim() : categorySelect}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Subcategoría</Label>
                    <Select
                      value={subcategorySelect}
                      onValueChange={(val) => {
                        setSubcategorySelect(val)
                        if (val !== "__custom__") {
                          setCustomSubcategory("")
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Seleccionar subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">-- Ninguna subcategoría --</SelectItem>
                        {availableSubcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="__custom__" className="text-blue-600 font-medium">
                          + Otra subcategoría personalizada...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {subcategorySelect === "__custom__" && (
                      <Input
                        placeholder="Identificador de la subcategoría (ej: nueva_subcategoria)..."
                        value={customSubcategory}
                        onChange={(e) => setCustomSubcategory(e.target.value)}
                        className="mt-1.5"
                      />
                    )}
                    <input
                      type="hidden"
                      name="subcategory"
                      value={
                        subcategorySelect === "__none__"
                          ? ""
                          : subcategorySelect === "__custom__"
                          ? customSubcategory.trim()
                          : subcategorySelect
                      }
                    />
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
            <DialogFooter className="mt-4 gap-2 flex-wrap items-center">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductDialog(false)}
              >
                {editingProduct ? "Cerrar" : "Cancelar"}
              </Button>
              {editingProduct && (
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    submitIntentRef.current = "saveAndClose"
                  }}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  {isPending && submitIntentRef.current === "saveAndClose" ? "Guardando..." : "Guardar y cerrar"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => {
                  submitIntentRef.current = "save"
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending && submitIntentRef.current === "save"
                  ? "Guardando..."
                  : editingProduct
                  ? "Guardar"
                  : "Crear producto"}
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
