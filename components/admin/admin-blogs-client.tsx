"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Globe,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  FileCode,
  Layers,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { upsertBlog, deleteBlog, bulkImportBlogs } from "@/lib/actions/admin-blogs"
import { BulkExcelImport } from "./bulk-excel-import"
import { MediaPickerModal } from "./storage/media-picker-modal"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Section = {
  id: string
  level: "h2" | "h3"
  title: string
  content: string
}

export type Blog = {
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
  route_type: string
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function renderSectionHtml(content: string) {
  if (!content) return ""
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return content.replace(/\n/g, "<br/>")
  }
  return content
    .replace(/\[cite:\s*\d+\]/g, "")
    .replace(/<TableOfContents\s*\/?>/gi, "")
    .replace(/<HighlightBox>([\s\S]*?)<\/HighlightBox>/gi, '<div class="bg-blue-50/80 border-l-4 border-blue-500 rounded-r-lg p-4 my-4 text-blue-950 font-medium text-sm leading-relaxed">$1</div>')
    .replace(/<FAQAccordion>([\s\S]*?)<\/FAQAccordion>/gi, '<div class="space-y-3 my-6">$1</div>')
    .replace(/<FAQItem\s+question=["']([^"']+)["']>([\s\S]*?)<\/FAQItem>/gi, '<details class="group bg-slate-50 border border-slate-200 rounded-lg p-3.5 transition-colors [&_summary::-webkit-details-marker]:hidden"><summary class="flex items-center justify-between font-semibold text-slate-800 cursor-pointer select-none text-base"><span>$1</span><span class="text-blue-600 transition group-open:rotate-180">▾</span></summary><div class="mt-2.5 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-2.5">$2</div></details>')
}

export function parseHtmlBlog(html: string) {
  // 1. Clean cite markers [cite: 1]
  const cleaned = html.replace(/\[cite:\s*\d+\]/g, "")

  // 2. Extract h1
  let extractedTitle = ""
  const h1Match = cleaned.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    extractedTitle = h1Match[1].replace(/<[^>]+>/g, "").trim()
  }

  const generatedSlug = slugify(extractedTitle)

  // 3. Extract content before first <h2>
  let preH2 = ""
  const firstH2Index = cleaned.search(/<h2[^>]*>/i)
  if (firstH2Index !== -1) {
    preH2 = cleaned.substring(0, firstH2Index)
  } else {
    preH2 = cleaned
  }

  // Remove h1, comments and TableOfContents
  preH2 = preH2.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "")
  preH2 = preH2.replace(/<!--[\s\S]*?-->/g, "")
  preH2 = preH2.replace(/<TableOfContents\s*\/?>/gi, "")

  // Extract excerpt from first <p>
  let extractedExcerpt = ""
  const pMatch = preH2.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (pMatch) {
    extractedExcerpt = pMatch[1].replace(/<[^>]+>/g, "").trim()
  }

  const introContent = preH2.trim()

  // 4. Extract sections: find all <h2> and <h3> tags
  const extractedSections: Section[] = []
  const headingRegex = /<(h[23])(?:\s+id=["']([^"']*)["'])?[^>]*>([\s\S]*?)<\/\1>/gi
  const matches: { level: "h2" | "h3"; idAttr: string; title: string; startIndex: number; endIndex: number }[] = []
  let m: RegExpExecArray | null
  while ((m = headingRegex.exec(cleaned)) !== null) {
    matches.push({
      level: m[1].toLowerCase() as "h2" | "h3",
      idAttr: m[2] || "",
      title: m[3].replace(/<[^>]+>/g, "").trim(),
      startIndex: m.index,
      endIndex: m.index + m[0].length,
    })
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i]
    const nextStart = (i + 1 < matches.length) ? matches[i + 1].startIndex : cleaned.length
    let sectionBody = cleaned.substring(cur.endIndex, nextStart).trim()
    sectionBody = sectionBody.replace(/<TableOfContents\s*\/?>/gi, "").trim()

    extractedSections.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `sec-${i + 1}`,
      level: cur.level,
      title: cur.title,
      content: sectionBody,
    })
  }

  return {
    title: extractedTitle,
    slug: generatedSlug,
    excerpt: extractedExcerpt,
    content: introContent,
    sections: extractedSections,
  }
}

export function generateHtmlFromStructured(data: {
  title: string
  content?: string
  excerpt?: string
  sections: Section[]
}): string {
  let out = ""
  if (data.title) {
    out += `<h1>${data.title}</h1>\n\n`
  }
  if (data.excerpt) {
    out += `<p>${data.excerpt}</p>\n\n`
  }
  if (data.content && data.content !== data.excerpt) {
    out += `${data.content}\n\n`
  }
  out += `<!-- Inyección del Índice -->\n<TableOfContents />\n\n`
  data.sections.forEach((s) => {
    const slug = slugify(s.title)
    out += `<${s.level} id="${slug}">${s.title}</${s.level}>\n`
    if (s.content) {
      out += `${s.content}\n\n`
    }
  })
  return out.trim()
}

// Section editor component (controlled)
function SectionEditor({
  sections,
  onChange,
}: {
  sections: Section[]
  onChange: (sections: Section[]) => void
}) {
  function addSection(level: "h2" | "h3") {
    onChange([...sections, { id: crypto.randomUUID(), level, title: "", content: "" }])
  }

  function updateSection(id: string, field: keyof Section, value: string) {
    onChange(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  function removeSection(id: string) {
    onChange(sections.filter((s) => s.id !== id))
  }

  function moveSection(id: string, dir: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id)
    if (dir === "up" && idx === 0) return
    if (dir === "down" && idx === sections.length - 1) return
    const next = [...sections]
    const swap = dir === "up" ? idx - 1 : idx + 1
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Auto-generated TOC preview */}
      {sections.filter((s) => s.level === "h2" && s.title).length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Índice generado automáticamente (H2)
          </p>
          <ol className="space-y-1">
            {sections
              .filter((s) => s.level === "h2" && s.title)
              .map((s, i) => (
                <li key={s.id} className="text-sm text-blue-600 flex items-center gap-1.5">
                  <span className="text-slate-400 text-xs">{i + 1}.</span>
                  {s.title}
                </li>
              ))}
          </ol>
        </div>
      )}

      {sections.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-lg">
          No hay secciones. Añade una sección H2/H3 o sube un archivo .html para generarlas automáticamente.
        </p>
      )}

      {sections.map((section, idx) => (
        <div
          key={section.id}
          className={`border rounded-lg p-3 space-y-2.5 transition-colors ${
            section.level === "h2" ? "border-blue-200 bg-blue-50/20" : "border-slate-200 bg-slate-50/30 ml-4"
          }`}
        >
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs font-mono font-bold ${
                section.level === "h2" ? "border-blue-400 text-blue-700 bg-blue-50" : "border-slate-400 text-slate-600 bg-slate-50"
              }`}
            >
              {section.level.toUpperCase()}
            </Badge>
            <Input
              placeholder={`Título del apartado ${section.level.toUpperCase()}`}
              value={section.title}
              onChange={(e) => updateSection(section.id, "title", e.target.value)}
              className="flex-1 h-8 text-sm font-semibold bg-white"
            />
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => moveSection(section.id, "up")}
                disabled={idx === 0}
                title="Subir posición"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => moveSection(section.id, "down")}
                disabled={idx === sections.length - 1}
                title="Bajar posición"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => removeSection(section.id)}
                title="Eliminar sección"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Texto o HTML de esta sección..."
            value={section.content}
            onChange={(e) => updateSection(section.id, "content", e.target.value)}
            rows={4}
            className="text-xs font-mono leading-relaxed bg-white border-slate-200"
          />
        </div>
      ))}

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSection("h2")}
          className="gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Añadir H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSection("h3")}
          className="gap-1.5 text-slate-600 border-slate-200 hover:bg-slate-50 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Añadir H3
        </Button>
      </div>
    </div>
  )
}

function normalizeSections(raw: unknown): Section[] {
  if (!raw || !Array.isArray(raw)) return []
  return raw.map((s: Record<string, unknown>) => ({
    id: String(s.id ?? crypto.randomUUID()),
    level: ((s.level ?? s.type ?? "h2") as string).toLowerCase() === "h3" ? "h3" : "h2",
    title: String(s.title ?? ""),
    content: String(s.content ?? ""),
  }))
}

export function AdminBlogsClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [ogImageUrl, setOgImageUrl] = useState("")
  const [error, setError] = useState("")

  // View mode and structured form states
  const [viewMode, setViewMode] = useState<"structured" | "html">("structured")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [summary, setSummary] = useState("")
  const [sections, setSections] = useState<Section[]>([])
  const [rawHtml, setRawHtml] = useState("")
  const [showHtmlPreview, setShowHtmlPreview] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Route type configuration states
  const [routeTypeSelect, setRouteTypeSelect] = useState<"blogs" | "blog" | "root" | "custom">("blogs")
  const [customRoutePrefix, setCustomRoutePrefix] = useState<string>("")

  const effectiveRouteType =
    routeTypeSelect === "custom"
      ? customRoutePrefix.trim().replace(/^\/+|\/+$/g, "").toLowerCase() || "root"
      : routeTypeSelect

  const previewSlug = slug || "tu-articulo"
  const previewUrl =
    effectiveRouteType === "root"
      ? `https://mysair.es/${previewSlug}`
      : `https://mysair.es/${effectiveRouteType}/${previewSlug}`

  function openNew() {
    setEditing(null)
    setTitle("")
    setSlug("")
    setExcerpt("")
    setContent("")
    setSummary("")
    setSections([])
    setRawHtml("")
    setImageUrl("")
    setOgImageUrl("")
    setRouteTypeSelect("blogs")
    setCustomRoutePrefix("")
    setError("")
    setViewMode("structured")
    setShowHtmlPreview(false)
    setDialog(true)
  }

  function openEdit(b: Blog) {
    setEditing(b)
    setTitle(b.title)
    setSlug(b.slug)
    setExcerpt(b.excerpt ?? "")
    setContent(b.content ?? "")
    setSummary(b.summary ?? "")
    const norm = normalizeSections(b.sections)
    setSections(norm)
    const gen = generateHtmlFromStructured({
      title: b.title,
      excerpt: b.excerpt ?? "",
      content: b.content ?? "",
      sections: norm,
    })
    setRawHtml(gen)
    setImageUrl(b.image_url ?? "")
    setOgImageUrl(b.og_image ?? "")

    // Initialize route type
    const rt = b.route_type || "blogs"
    if (rt === "blogs" || rt === "blog") {
      setRouteTypeSelect(rt)
      setCustomRoutePrefix("")
    } else if (rt === "root" || rt === "" || rt === "/") {
      setRouteTypeSelect("root")
      setCustomRoutePrefix("")
    } else {
      setRouteTypeSelect("custom")
      setCustomRoutePrefix(rt)
    }

    setError("")
    setViewMode("structured")
    setShowHtmlPreview(false)
    setDialog(true)
  }

  function handleHtmlFileLoad(file: File) {
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      toast.error("Por favor selecciona un archivo con extensión .html o .htm")
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || ""
      setRawHtml(text)
      const parsed = parseHtmlBlog(text)
      if (parsed.title) setTitle(parsed.title)
      if (parsed.slug) setSlug(parsed.slug)
      if (parsed.excerpt) setExcerpt(parsed.excerpt)
      if (parsed.content) setContent(parsed.content)
      if (parsed.sections && parsed.sections.length > 0) {
        setSections(parsed.sections)
      }
      toast.success(`Archivo HTML cargado: "${parsed.title || file.name}" (${parsed.sections.length} secciones detectadas)`)
    }
    reader.readAsText(file)
  }

  function handleSwitchView(mode: "structured" | "html") {
    if (mode === "html") {
      if (!rawHtml.trim() && (title || sections.length > 0)) {
        const gen = generateHtmlFromStructured({
          title,
          excerpt,
          content,
          sections,
        })
        setRawHtml(gen)
      }
    } else {
      if (rawHtml.trim()) {
        const parsed = parseHtmlBlog(rawHtml)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.slug) setSlug(parsed.slug)
        if (parsed.excerpt) setExcerpt(parsed.excerpt)
        if (parsed.content) setContent(parsed.content)
        if (parsed.sections && parsed.sections.length > 0) {
          setSections(parsed.sections)
        }
      }
    }
    setViewMode(mode)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let currentTitle = title
    let currentSlug = slug
    let currentExcerpt = excerpt
    let currentContent = content
    let currentSections = sections

    // If currently in HTML view and rawHtml has text, ensure latest HTML is parsed before saving
    if (viewMode === "html" && rawHtml.trim()) {
      const parsed = parseHtmlBlog(rawHtml)
      if (parsed.title) currentTitle = parsed.title
      if (parsed.slug) currentSlug = parsed.slug || slugify(parsed.title)
      if (parsed.excerpt) currentExcerpt = parsed.excerpt
      if (parsed.content) currentContent = parsed.content
      if (parsed.sections && parsed.sections.length > 0) currentSections = parsed.sections
    }

    const fd = new FormData(e.currentTarget)
    fd.set("title", currentTitle)
    fd.set("slug", currentSlug)
    fd.set("excerpt", currentExcerpt)
    fd.set("content", currentContent)
    fd.set("sections", JSON.stringify(currentSections))
    fd.set("route_type", effectiveRouteType)

    startTransition(async () => {
      try {
        await upsertBlog(fd)
        setDialog(false)
        toast.success(editing ? "Artículo actualizado correctamente" : "Artículo creado correctamente")
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar"
        setError(msg)
        toast.error(msg)
      }
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      try {
        await deleteBlog(deleteId)
        toast.success("Artículo eliminado correctamente")
        setDeleteId(null)
        router.refresh()
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar"
        toast.error(msg)
      }
    })
  }

  // Format date for input[type=date]
  function toDateInputValue(dateStr: string | null | undefined) {
    if (!dateStr) return new Date().toISOString().split("T")[0]
    return new Date(dateStr).toISOString().split("T")[0]
  }

  const blogTemplateHeaders = [
    "title",
    "slug",
    "excerpt",
    "summary",
    "author",
    "category",
    "tags",
    "published",
    "featured",
    "reading_time",
    "route_type",
    "image_url",
    "seccion_1_nivel",
    "seccion_1_titulo",
    "seccion_1_contenido",
    "seccion_2_nivel",
    "seccion_2_titulo",
    "seccion_2_contenido",
    "seccion_3_nivel",
    "seccion_3_titulo",
    "seccion_3_contenido",
    "seccion_4_nivel",
    "seccion_4_titulo",
    "seccion_4_contenido",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "canonical_url",
  ]

  const blogTemplateSampleData = [
    {
      title: "Guía de Eficiencia Energética en Sistemas de Climatización por Zonas",
      slug: "guia-eficiencia-climatizacion-zonas",
      excerpt: "Descubre cómo reducir el consumo energético hasta un 30% mediante zonificación inteligente y difusión optimizada.",
      summary: "La zonificación y la selección correcta de difusores permiten un ahorro significativo y mejor confort térmico.",
      author: "Equipo Técnico MYSAir",
      category: "Eficiencia Energética",
      tags: "HVAC, Zonificación, Ahorro Energético, Difusión",
      published: true,
      featured: true,
      reading_time: 5,
      route_type: "blogs",
      image_url: "https://mysair.es/images/blog/eficiencia-zonas.jpg",
      seccion_1_nivel: "H2",
      seccion_1_titulo: "1. Principios de la Zonificación Inteligente",
      seccion_1_contenido: "La zonificación permite adaptar la climatización a las necesidades reales de cada estancia, evitando climatizar espacios desocupados.",
      seccion_2_nivel: "H3",
      seccion_2_titulo: "1.1 Ahorro Energético y Reducción de Huella de Carbono",
      seccion_2_contenido: "Estudios demuestran que un control independiente por zonas reduce hasta un 30% el consumo eléctrico frente a sistemas sin zonificar.",
      seccion_3_nivel: "H2",
      seccion_3_titulo: "2. Selección del Sistema de Difusión Adecuado",
      seccion_3_contenido: "La correcta elección de difusores y rejillas garantiza una impulsión sin corrientes molestas y una mezcla de aire homogénea.",
      seccion_4_nivel: "H3",
      seccion_4_titulo: "2.1 Difusores Lineales y Rejillas Motorizadas",
      seccion_4_contenido: "Los modelos motorizados con pasarela Modbus permiten una regulación de caudal milimétrica y silenciosa.",
      meta_title: "Eficiencia Energética en Climatización | MYSAir",
      meta_description: "Aprende las claves para optimizar tus sistemas de aire acondicionado y ahorrar energía.",
      meta_keywords: "climatizacion, zonificacion, rejillas, difusores, ahorro energetico",
      canonical_url: "https://mysair.es/blogs/guia-eficiencia-climatizacion-zonas",
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">{initialBlogs.length} artículos en total</p>
        </div>
        <div className="flex items-center gap-2.5">
          <BulkExcelImport
            title="Importación Masiva de Artículos de Blog"
            description="Sube un archivo Excel (.xlsx/.csv) para crear o actualizar artículos de blog de forma masiva"
            templateFilename="plantilla_blogs_mysair"
            templateHeaders={blogTemplateHeaders}
            templateSampleData={blogTemplateSampleData}
            onImport={async (rows) => {
              const res = await bulkImportBlogs(rows)
              router.refresh()
              return res
            }}
            triggerLabel="Importar Excel"
          />
          <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-2xs">
            <Plus className="h-4 w-4" /> Nuevo artículo
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destacado</TableHead>
              <TableHead>Publicación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBlogs.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-slate-400 py-10">No hay artículos</TableCell></TableRow>
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
                  {(() => {
                    const rt = b.route_type
                    const isRoot = rt === "root" || rt === "" || rt === "/"
                    const isBlog = rt === "blog"
                    const isBlogs = rt === "blogs" || !rt

                    if (isRoot) {
                      return (
                        <span
                          className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-700 border-emerald-200"
                          title="Directo bajo el dominio principal (raíz)"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          / (raíz)
                        </span>
                      )
                    }
                    if (isBlog) {
                      return (
                        <span className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-md border bg-purple-50 text-purple-700 border-purple-200">
                          /blog
                        </span>
                      )
                    }
                    if (isBlogs) {
                      return (
                        <span className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                          /blogs
                        </span>
                      )
                    }
                    return (
                      <span className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-md border bg-amber-50 text-amber-700 border-amber-200">
                        /{rt}
                      </span>
                    )
                  })()}
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
                  <div className="flex justify-end gap-1 items-center">
                    {(() => {
                      const isRoot = b.route_type === "root" || b.route_type === "" || b.route_type === "/"
                      const href = isRoot ? `/${b.slug}` : `/${b.route_type || "blogs"}/${b.slug}`
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          title={`Ver en ${href}`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )
                    })()}
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
        <DialogContent className="max-w-6xl sm:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header with Title and View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editing ? "Editar artículo" : "Nuevo artículo"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {viewMode === "structured"
                  ? "Modo Estructurado: gestiona contenido, pestañas y secciones H2/H3"
                  : "Modo HTML: sube o edita el artículo directamente en código .html"}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".html,.htm"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleHtmlFileLoad(file)
                  e.target.value = ""
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs font-semibold gap-1.5 text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 shadow-2xs"
              >
                <Upload className="h-3.5 w-3.5" />
                Subir archivo .html
              </Button>

              {/* View Switcher Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSwitchView("structured")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all",
                    viewMode === "structured"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Vista Estructurada
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchView("html")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all",
                    viewMode === "html"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  Vista HTML
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-3">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <input type="hidden" name="sections" value={JSON.stringify(sections)} />

            {/* VISTA HTML */}
            {viewMode === "html" && (
              <div className="space-y-4 pt-1 animate-in fade-in-50 duration-150">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const file = e.dataTransfer.files?.[0]
                    if (file) handleHtmlFileLoad(file)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30"
                  )}
                >
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2.5 bg-white rounded-full border border-slate-200 shadow-2xs">
                      <FileCode className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Arrastra y suelta tu archivo <span className="font-mono text-blue-600 font-bold">.html</span> aquí o haz clic para seleccionarlo
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        El sistema extraerá automáticamente el título (h1), extracto y dividirá cada sección (h2 y h3).
                      </p>
                    </div>
                  </div>
                </div>

                {/* HTML Editor Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white text-slate-700 font-mono">
                      {rawHtml ? `${rawHtml.length} caracteres` : "Editor HTML vacío"}
                    </Badge>
                    {sections.length > 0 && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                        {sections.length} secciones reconocidas
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                      className="h-7 text-xs text-slate-700 hover:bg-white gap-1"
                    >
                      {showHtmlPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showHtmlPreview ? "Ver Código" : "Vista Previa"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!rawHtml.trim()}
                      onClick={() => {
                        navigator.clipboard?.writeText(rawHtml)
                        toast.success("Código HTML copiado al portapapeles")
                      }}
                      className="h-7 text-xs text-slate-700 hover:bg-white gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copiar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const gen = generateHtmlFromStructured({ title, excerpt, content, sections })
                        setRawHtml(gen)
                        toast.success("HTML actualizado desde los campos estructurados")
                      }}
                      className="h-7 text-xs bg-white text-slate-700 hover:bg-slate-50 gap-1 border-slate-300"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Regenerar desde Estructurado
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!rawHtml.trim()}
                      onClick={() => {
                        handleSwitchView("structured")
                        toast.success("HTML convertido a secciones estructuradas")
                      }}
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1 font-semibold shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Convertir a Vista Estructurada
                    </Button>
                  </div>
                </div>

                {/* Editor / Preview Area */}
                {showHtmlPreview ? (
                  <div className="border border-slate-200 rounded-lg p-6 bg-white min-h-[380px] max-h-[550px] overflow-y-auto prose prose-slate max-w-none shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: renderSectionHtml(rawHtml) }} />
                  </div>
                ) : (
                  <Textarea
                    value={rawHtml}
                    onChange={(e) => setRawHtml(e.target.value)}
                    placeholder={`<h1>Título del artículo</h1>\n<p>Párrafo de introducción...</p>\n<TableOfContents />\n\n<h2 id="seccion-1">1. Título de la sección</h2>\n<p>Texto o listas de la sección...</p>`}
                    rows={17}
                    className="font-mono text-xs leading-relaxed bg-slate-900 text-slate-100 focus:bg-slate-950 focus:text-white border-slate-700 rounded-lg p-3 resize-y"
                  />
                )}
              </div>
            )}

            {/* VISTA ESTRUCTURADA */}
            <div className={viewMode === "structured" ? "block space-y-4 pt-1" : "hidden"}>
              {/* Informative Banner with Upload Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/70 border border-blue-200/80 rounded-lg px-3.5 py-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs text-blue-900 font-medium">
                  <FileCode className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>
                    ¿Tienes el artículo en HTML? Sube tu archivo <strong className="font-mono font-bold">.html</strong> para rellenar títulos y secciones automáticamente, o cambia a la <strong>Vista HTML</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs font-semibold text-blue-700 bg-white border-blue-200 hover:bg-blue-50 shadow-2xs gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Subir .html
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSwitchView("html")}
                    className="h-7 text-xs text-blue-700 hover:bg-blue-100/60"
                  >
                    Ir a Vista HTML →
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="contenido" className="mt-2">
                <TabsList className="mb-4">
                  <TabsTrigger value="contenido">Contenido</TabsTrigger>
                  <TabsTrigger value="secciones">
                    Secciones {sections.length > 0 && `(${sections.length})`}
                  </TabsTrigger>
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
                      <Input
                        name="title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value)
                          if (!slug || slug === slugify(title)) {
                            setSlug(slugify(e.target.value))
                          }
                        }}
                        placeholder="Ej: Rejillas de Ventilación Antirretorno para Baño"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Slug *</Label>
                      <Input
                        name="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="ej: rejillas-ventilacion-antirretorno-bano"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Extracto</Label>
                    <Textarea
                      name="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={2}
                      placeholder="Breve descripción del artículo que se mostrará en las tarjetas..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Introducción / Contenido principal</Label>
                    <Textarea
                      name="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={5}
                      placeholder="Texto introductorio del artículo previo a las secciones..."
                      className="text-xs font-mono leading-relaxed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Resumen</Label>
                    <Textarea
                      name="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={3}
                      placeholder="Resumen que se mostrará al final del artículo en caja destacada..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label>URL imagen principal</Label>
                        <MediaPickerModal onSelect={setImageUrl} triggerLabel="Storage" />
                      </div>
                      <Input
                        name="image_url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Autor</Label>
                      <Input name="author" defaultValue={editing?.author ?? "MYSAir"} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Categoría</Label>
                      <Input name="category" defaultValue={editing?.category ?? ""} placeholder="Ej: Guías Técnicas, Difusión..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Etiquetas (separadas por comas)</Label>
                      <Input name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} placeholder="HVAC, Rejillas, Ventilación" />
                    </div>
                  </div>
                </TabsContent>

                {/* SECCIONES */}
                <TabsContent value="secciones" className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm text-blue-700 font-medium">Editor de secciones estructuradas</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Cada sección corresponde a un encabezado H2 o H3 del artículo. El índice se genera automáticamente a partir de los H2.
                    </p>
                  </div>
                  <SectionEditor sections={sections} onChange={setSections} />
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
                    <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Globe className="h-4 w-4" /> Open Graph (Redes Sociales)
                    </p>
                    <div className="space-y-1.5">
                      <Label>OG Título</Label>
                      <Input name="og_title" defaultValue={editing?.og_title ?? ""} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>OG Descripción</Label>
                      <Textarea name="og_description" defaultValue={editing?.og_description ?? ""} rows={2} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label>OG Imagen URL</Label>
                        <MediaPickerModal onSelect={setOgImageUrl} triggerLabel="Storage" />
                      </div>
                      <Input name="og_image" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} placeholder="https://..." />
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
                  {/* CONFIGURACIÓN DE RUTA / URL */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div>
                      <Label className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-blue-600" />
                        Ruta y URL del artículo
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Define la estructura de URL donde estará accesible el artículo. Puede publicarse directamente bajo el dominio principal o con una ruta personalizada.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-700">Tipo de Ruta</Label>
                        <Select
                          value={routeTypeSelect}
                          onValueChange={(val: "blogs" | "blog" | "root" | "custom") => setRouteTypeSelect(val)}
                        >
                          <SelectTrigger className="font-mono text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blogs">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-blue-600">/blogs/xxxx</span>
                                <span className="text-slate-500 text-xs">(Estándar)</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="blog">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-purple-600">/blog/xxxx</span>
                                <span className="text-slate-500 text-xs">(Singular)</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="root">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-emerald-600">/xxxx</span>
                                <span className="text-emerald-700 text-xs font-medium">(Dominio principal / raíz)</span>
                              </span>
                            </SelectItem>
                            <SelectItem value="custom">
                              <span className="flex items-center gap-2">
                                <span className="font-semibold text-amber-600">Ruta personalizada...</span>
                                <span className="text-slate-500 text-xs">(Prefijo a medida)</span>
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {routeTypeSelect === "custom" && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium text-slate-700">Prefijo de ruta personalizado</Label>
                          <div className="flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus-within:ring-2 focus-within:ring-blue-500">
                            <span className="text-slate-400 font-mono select-none">https://mysair.es/</span>
                            <input
                              type="text"
                              value={customRoutePrefix}
                              onChange={(e) => setCustomRoutePrefix(e.target.value)}
                              placeholder="guias, novedades..."
                              className="border-0 p-0 h-5 font-mono text-xs text-slate-900 bg-transparent focus:outline-hidden focus:ring-0 flex-1 ml-0.5"
                            />
                            <span className="text-slate-400 font-mono select-none">/</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Letras, números y guiones. Dejar vacío equivale al dominio principal.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Previsualización en tiempo real de la URL */}
                    <div
                      className={cn(
                        "p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors",
                        effectiveRouteType === "root"
                          ? "bg-emerald-50/80 border-emerald-200"
                          : effectiveRouteType === "blog"
                          ? "bg-purple-50/80 border-purple-200"
                          : effectiveRouteType === "blogs"
                          ? "bg-blue-50/80 border-blue-200"
                          : "bg-amber-50/80 border-amber-200"
                      )}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                          URL resultante del artículo
                        </span>
                        <div className="font-mono text-xs font-semibold text-slate-900 truncate">
                          {previewUrl}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {effectiveRouteType === "root" ? (
                          <Badge className="bg-emerald-600 text-white text-[11px] hover:bg-emerald-700 font-normal">
                            Dominio Principal
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-white text-[11px] text-slate-700 font-mono">
                            /{effectiveRouteType}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
            <DialogFooter className="mt-5 border-t border-slate-100 pt-3">
              <Button type="button" variant="outline" onClick={() => setDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-2xs">
                {isPending ? "Guardando..." : "Guardar artículo"}
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
