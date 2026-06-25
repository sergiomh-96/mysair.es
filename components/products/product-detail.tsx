"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Wind, Settings, Star, ArrowLeft, ChevronLeft, ChevronRight, FileText, Download, Wrench, Box, Building, Palette, Package, Ruler, ScanIcon, Shield, LucideAlignJustify as LucideAlignJustifyIcon, Radio, Hash, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { ProductVideos } from "./product-videos"
import { STLViewer } from "./stl-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cable as Cube } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { SolicitarPresupuestoBtn } from "./solicitar-presupuesto-btn"

interface DocumentLink {
  name: string
  url: string
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  image_url: string[]
  technical_specs: any
  is_featured: boolean
  is_active: boolean
  stl_model_url?: string
  ficha_tecnica?: DocumentLink[]
  manual_usuario?: DocumentLink[]
  manual_instalador?: DocumentLink[]
  cad?: DocumentLink[]
  bim?: DocumentLink[]
  ficha_tecnica_url?: string | DocumentLink[]
  manual_usuario_url?: string | DocumentLink[]
  manual_instalador_url?: string | DocumentLink[]
  cad_url?: string | DocumentLink[]
  bim_url?: string | DocumentLink[]
  colors?: Array<{ name: string; hex_color: string; code: string }>
  variants?: Array<{ name: string; description: string; code?: string }>
  dimensions?: Array<{ name: string; width?: number; height?: number; depth?: number; unit?: string; code?: string }>
  fixation_types?: Array<{ name: string; description: string; code: string }>
  insulation_types?: Array<{ name: string; description: string; code: string }>
  lines_vias?: Array<{ name: string; description: string; code: string }>
  communication_types?: Array<{ name: string; description: string; code: string }>
}

interface ProductVideo {
  id: number
  title: string
  youtube_url: string
  description?: string
  sort_order: number
}

interface ProductDetailProps {
  product: Product
  videos?: ProductVideo[]
}

function normalizeDocuments(
  newFormat: DocumentLink[] | undefined,
  oldFormat: string | DocumentLink[] | undefined,
  defaultName: string,
): DocumentLink[] | undefined {
  if (newFormat && newFormat.length > 0) {
    return newFormat
  }

  if (oldFormat) {
    if (Array.isArray(oldFormat)) {
      return oldFormat.length > 0 ? oldFormat : undefined
    }
    if (typeof oldFormat === "string" && oldFormat.trim() !== "") {
      return [{ name: defaultName, url: oldFormat }]
    }
  }

  return undefined
}

export function ProductDetail({ product, videos = [] }: ProductDetailProps) {
  const { t } = useI18n()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedDimension, setSelectedDimension] = useState<string>("")
  const [selectedFixationType, setSelectedFixationType] = useState<string>("")
  const [selectedInsulation, setSelectedInsulation] = useState<string>("")
  const [selectedLinesVias, setSelectedLinesVias] = useState<string>("")
  const [selectedCommunication, setSelectedCommunication] = useState<string>("")

  const fichaTecnica = normalizeDocuments(product.ficha_tecnica, product.ficha_tecnica_url, t("products.detail.ficha"))
  const manualUsuario = normalizeDocuments(product.manual_usuario, product.manual_usuario_url, t("products.detail.manual_user"))
  const manualInstalador = normalizeDocuments(
    product.manual_instalador,
    product.manual_instalador_url,
    t("products.detail.manual_inst"),
  )
  const cadFiles = normalizeDocuments(product.cad, product.cad_url, t("products.detail.cad"))
  const bimFiles = normalizeDocuments(product.bim, product.bim_url, t("products.detail.bim"))

  const images = Array.isArray(product.image_url) ? product.image_url : [product.image_url].filter(Boolean)

  const productReference = useMemo(() => {
    const parts: string[] = []

    if (selectedVariant && product.variants) {
      const variant = product.variants.find((v) => v.name === selectedVariant)
      if (variant) parts.push(variant.name)
    }

    if (selectedDimension && product.dimensions) {
      const dimension = product.dimensions.find((d) => d.name === selectedDimension)
      if (dimension) parts.push(dimension.name)
    }

    if (selectedFixationType && product.fixation_types) {
      const fixation = product.fixation_types.find((f) => f.name === selectedFixationType)
      if (fixation?.code) parts.push(fixation.code)
    }

    if (selectedLinesVias && product.lines_vias) {
      const line = product.lines_vias.find((l) => l.name === selectedLinesVias)
      if (line?.code) parts.push(line.code)
    }

    if (selectedInsulation && product.insulation_types) {
      const insulation = product.insulation_types.find((i) => i.name === selectedInsulation)
      if (insulation?.code) parts.push(insulation.code)
    }

    if (selectedColor && product.colors) {
      const color = product.colors.find((c) => c.name === selectedColor)
      if (color?.code) parts.push(color.code)
    }

    if (selectedCommunication && product.communication_types) {
      const comm = product.communication_types.find((c) => c.name === selectedCommunication)
      if (comm?.name) {
        parts.push(comm.name)
      }
    }

    return parts.length > 0 ? parts.join(" ") : null
  }, [
    selectedVariant,
    selectedDimension,
    selectedFixationType,
    selectedLinesVias,
    selectedInsulation,
    selectedCommunication,
    selectedColor,
    product,
  ])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "air_diffusion":
        return Wind
      case "smart_systems":
        return Settings
      default:
        return Wind
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "air_diffusion":
        return t("products.detail.cat_air")
      case "smart_systems":
        return t("products.detail.cat_smart")
      default:
        return category
    }
  }

  const getSubcategoryName = (subcategory: string) => {
    const names: Record<string, string> = {
      grilles: t("products.filters.sub_grilles") || "Rejillas",
      diffusers: t("products.filters.sub_diffusers") || "Difusores",
      dampers: t("products.filters.sub_dampers") || "Compuertas",
      zoning: t("products.filters.sub_zoning") || "Zonificación",
      controls: t("products.filters.sub_controls") || "Controles",
    }
    return names[subcategory] || subcategory
  }

  const CategoryIcon = getCategoryIcon(product.category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/productos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("products.detail.back")}
          </Link>
        </Button>

        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            {t("nav.home")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/productos" className="hover:text-blue-600">
            {t("nav.products")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image Carousel & 3D Viewer */}
        <div className="space-y-4">
          {product.stl_model_url ? (
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t("products.detail.images")}
                </TabsTrigger>
                <TabsTrigger value="3d" className="flex items-center gap-2">
                  <Cube className="h-4 w-4" />
                  {t("products.detail.model_3d")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="images" className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  {product.is_featured && (
                    <Badge className="absolute top-4 left-4 z-10 bg-blue-600">
                      <Star className="h-3 w-3 mr-1" />
                      {t("products.detail.featured")}
                    </Badge>
                  )}
                  {product.is_active === false && (
                    <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                      {t("products.detail.discontinued")}
                    </Badge>
                  )}

                  <img
                    src={images[currentImageIndex] || "/placeholder.svg?height=500&width=500"}
                    alt={`${product.name} - ${t("products.detail.images")} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg?height=80&width=80"}
                          alt={`${product.name} - Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {images.length > 1 && (
                  <div className="text-center text-sm text-gray-500">
                    {currentImageIndex + 1} {t("common.of") || "de"} {images.length}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="3d">
                <STLViewer stlUrl={product.stl_model_url} />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-blue-600">
                    <Star className="h-3 w-3 mr-1" />
                    {t("products.detail.featured")}
                  </Badge>
                )}
                {product.is_active === false && (
                  <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                    {t("products.detail.discontinued")}
                  </Badge>
                )}

                <img
                  src={images[currentImageIndex] || "/placeholder.svg?height=500&width=500"}
                  alt={`${product.name} - ${t("products.detail.images")} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg?height=80&width=80"}
                        alt={`${product.name} - Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <div className="text-center text-sm text-gray-500">
                  {currentImageIndex + 1} {t("common.of") || "de"} {images.length}
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CategoryIcon className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">{getSubcategoryName(product.subcategory)}</Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">{product.name}</h1>

            <p className="text-xl text-gray-600 text-pretty">{product.description}</p>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            {/* Variant Options */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Package className="h-4 w-4" />
                  {t("products.detail.variant")}
                </label>
                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("products.detail.select_variant")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant, index) => (
                      <SelectItem key={index} value={variant.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{variant.name}</div>
                          {variant.description && <div className="text-xs text-gray-500">{variant.description}</div>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Dimension Options */}
            {product.dimensions && product.dimensions.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Ruler className="h-4 w-4" />
                  {t("products.detail.dimensions")}
                </label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger className="w-full [&>span]:whitespace-normal [&>span]:text-left [&>span]:line-clamp-2">
                    <SelectValue placeholder={t("products.detail.select_dimensions")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.dimensions.map((dimension, index) => (
                      <SelectItem key={index} value={dimension.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{dimension.name}</div>
                          {(dimension.width || dimension.height || dimension.depth) && (
                            <div className="text-xs text-gray-500">
                              {dimension.width && `${dimension.width}${dimension.unit || "mm"}`}
                              {dimension.height && ` × ${dimension.height}${dimension.unit || "mm"}`}
                              {dimension.depth && ` × ${dimension.depth}${dimension.unit || "mm"}`}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Fixation Type Options */}
            {product.fixation_types && product.fixation_types.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ScanIcon className="h-4 w-4" />
                  {t("products.detail.fixation")}
                </label>
                <Select value={selectedFixationType} onValueChange={setSelectedFixationType}>
                  <SelectTrigger className="w-full [&>span]:whitespace-normal [&>span]:text-left [&>span]:line-clamp-2">
                    <SelectValue placeholder={t("products.detail.select_fixation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.fixation_types.map((fixationType, index) => (
                      <SelectItem key={index} value={fixationType.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{fixationType.name}</div>
                          {fixationType.description && (
                            <div className="text-xs text-gray-500">{fixationType.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Insulation Types dropdown */}
            {product.insulation_types && product.insulation_types.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Shield className="h-4 w-4" />
                  {t("products.detail.insulation")}
                </label>
                <Select value={selectedInsulation} onValueChange={setSelectedInsulation}>
                  <SelectTrigger className="w-full [&>span]:whitespace-normal [&>span]:text-left [&>span]:line-clamp-2">
                    <SelectValue placeholder={t("products.detail.select_insulation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.insulation_types.map((insulation, index) => (
                      <SelectItem key={index} value={insulation.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{insulation.name}</div>
                          {insulation.description && (
                            <div className="text-xs text-gray-500">{insulation.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Lines/Vias dropdown */}
            {product.lines_vias && product.lines_vias.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <LucideAlignJustifyIcon className="h-4 w-4" />
                  {t("products.detail.vias")}
                </label>
                <Select value={selectedLinesVias} onValueChange={setSelectedLinesVias}>
                  <SelectTrigger className="w-full [&>span]:whitespace-normal [&>span]:text-left [&>span]:line-clamp-2">
                    <SelectValue placeholder={t("products.detail.select_vias")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.lines_vias.map((line, index) => (
                      <SelectItem key={index} value={line.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{line.name}</div>
                          {line.description && <div className="text-xs text-gray-500">{line.description}</div>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Communication Types dropdown */}
            {product.communication_types && product.communication_types.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Radio className="h-4 w-4" />
                  {t("products.detail.communication")}
                </label>
                <Select value={selectedCommunication} onValueChange={setSelectedCommunication}>
                  <SelectTrigger className="w-full [&>span]:whitespace-normal [&>span]:text-left [&>span]:line-clamp-2">
                    <SelectValue placeholder={t("products.detail.select_communication")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.communication_types.map((comm, index) => (
                      <SelectItem key={index} value={comm.name}>
                        <div className="space-y-1">
                          <div className="font-medium">{comm.name}</div>
                          {comm.description && <div className="text-xs text-gray-500">{comm.description}</div>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Palette className="h-4 w-4" />
                  {t("products.detail.color")}
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("products.detail.select_color")} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color, index) => (
                      <SelectItem key={index} value={color.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex_color }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <SolicitarPresupuestoBtn productSlug={product.slug} />

          {productReference && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Hash className="h-4 w-4 text-blue-600" />
                  {t("products.detail.reference")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg font-semibold text-blue-900">{productReference}</p>
              </CardContent>
            </Card>
          )}

          {/* Category Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                {getCategoryName(product.category)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {product.category === "air_diffusion"
                  ? t("products.detail.cat_air_desc")
                  : t("products.detail.cat_smart_desc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Technical Specifications */}
      {product.technical_specs && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>{t("products.detail.specs")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.technical_specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, " ")}:</span>
                    <span className="text-gray-600 text-right">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Text Block for ma35 */}
      {product.slug === "ma35" && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed text-pretty">
                La solución definitiva para techos continuos. Nuestro difusor lineal oculto actúa como una rejilla lineal de aire acondicionado altamente estética, haciendo que la climatización pase desapercibida a la vista sin perder potencia de soplado. Es ideal para combinarlo con su correspondiente plenum para difusor lineal, asegurando una distribución acústicamente aislada y un flujo de aire constante en proyectos arquitectónicos premium.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Technical Documentation */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("products.detail.docs")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Ficha Técnica */}
              {fichaTecnica && fichaTecnica.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{t("products.detail.ficha")}</span>
                      <Badge variant="secondary" className="ml-2">
                        {fichaTecnica.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-4">
                    {fichaTecnica.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2" />
                            {t("products.detail.download")}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Manual Usuario */}
              {manualUsuario && manualUsuario.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{t("products.detail.manual_user")}</span>
                      <Badge variant="secondary" className="ml-2">
                        {manualUsuario.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-4">
                    {manualUsuario.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2" />
                            {t("products.detail.download")}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Manual Instalador */}
              {manualInstalador && manualInstalador.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">{t("products.detail.manual_inst")}</span>
                      <Badge variant="secondary" className="ml-2">
                        {manualInstalador.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-4">
                    {manualInstalador.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2" />
                            {t("products.detail.download")}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* CAD */}
              {cadFiles && cadFiles.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Box className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">{t("products.detail.cad")}</span>
                      <Badge variant="secondary" className="ml-2">
                        {cadFiles.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-4">
                    {cadFiles.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2" />
                            {t("products.detail.download")}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* BIM */}
              {bimFiles && bimFiles.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium">{t("products.detail.bim")}</span>
                      <Badge variant="secondary" className="ml-2">
                        {bimFiles.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200 [&[data-state=open]]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-4">
                    {bimFiles.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <span className="text-sm text-gray-700">{doc.name}</span>
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-4 w-4 mr-2" />
                            {t("products.detail.download")}
                          </a>
                        </Button>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {!fichaTecnica && !manualUsuario && !manualInstalador && !cadFiles && !bimFiles && (
                <p className="text-gray-500 text-center py-8">
                  No hay documentación técnica disponible para este producto.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* YouTube Videos Section */}
      <ProductVideos videos={videos} />
    </div>
  )
}
