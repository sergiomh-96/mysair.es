"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import {
  StorageFileItem,
  StorageBucketItem,
  listStorageBuckets,
  listStorageItems,
  createFolder,
  renameFolder,
  deleteFolder,
  uploadStorageFile,
  replaceStorageFile,
  deleteStorageFile,
} from "@/lib/actions/admin-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Folder,
  FolderPlus,
  Upload,
  ChevronRight,
  Home,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
  Eye,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Database,
  Layers,
} from "lucide-react"
import { toast } from "sonner"

interface StorageManagerProps {
  onSelectFile?: (url: string) => void
  initialPath?: string
  initialBucket?: string
  pickerMode?: boolean
}

export function StorageManager({
  onSelectFile,
  initialPath = "",
  initialBucket = "images",
  pickerMode = false,
}: StorageManagerProps) {
  const [currentBucket, setCurrentBucket] = useState(initialBucket)
  const [buckets, setBuckets] = useState<StorageBucketItem[]>([])
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [items, setItems] = useState<StorageFileItem[]>([])
  const [allFolders, setAllFolders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Dialog states
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const [renameFolderOpen, setRenameFolderOpen] = useState(false)
  const [folderToRename, setFolderToRename] = useState<string>("")
  const [renamedFolderName, setRenamedFolderName] = useState("")

  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string>("")

  const [deleteFileOpen, setDeleteFileOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<StorageFileItem | null>(null)

  // Replace dialog state
  const [replaceFileOpen, setReplaceFileOpen] = useState(false)
  const [fileToReplace, setFileToReplace] = useState<StorageFileItem | null>(null)
  const [newReplacementFile, setNewReplacementFile] = useState<File | null>(null)
  const [newReplacementPreview, setNewReplacementPreview] = useState<string | null>(null)

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadTargetFolder, setUploadTargetFolder] = useState(currentPath)
  const [customFileName, setCustomFileName] = useState("")

  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  // Load items when currentPath or currentBucket changes
  async function loadData(path = currentPath, bucket = currentBucket) {
    setLoading(true)
    try {
      const [bucketsList, data] = await Promise.all([
        listStorageBuckets(),
        listStorageItems(path, bucket),
      ])
      setBuckets(bucketsList)
      setItems(data.items)
      setAllFolders(data.allFolders)
    } catch {
      toast.error("Error al cargar los archivos del Storage")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(currentPath, currentBucket)
    setUploadTargetFolder(currentPath)
  }, [currentPath, currentBucket])

  // Breadcrumbs helper
  const pathSegments = currentPath ? currentPath.split("/").filter(Boolean) : []

  function navigateToSegment(index: number) {
    if (index === -1) {
      setCurrentPath("")
    } else {
      const target = pathSegments.slice(0, index + 1).join("/")
      setCurrentPath(target)
    }
  }

  // Folder Actions
  function handleCreateFolderSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolderName.trim()) return

    startTransition(async () => {
      try {
        await createFolder(currentPath, newFolderName, currentBucket)
        toast.success(`Carpeta "${newFolderName}" creada correctamente`)
        setCreateFolderOpen(false)
        setNewFolderName("")
        await loadData(currentPath, currentBucket)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al crear la carpeta"
        toast.error(msg)
      }
    })
  }

  function handleRenameFolderSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!renamedFolderName.trim()) return

    startTransition(async () => {
      try {
        await renameFolder(folderToRename, renamedFolderName, currentBucket)
        toast.success(`Carpeta renombrada a "${renamedFolderName}"`)
        setRenameFolderOpen(false)
        if (currentPath === folderToRename || currentPath.startsWith(folderToRename + "/")) {
          const parent = folderToRename.split("/").slice(0, -1).join("/")
          setCurrentPath(parent ? `${parent}/${renamedFolderName}` : renamedFolderName)
        } else {
          await loadData(currentPath, currentBucket)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al renombrar la carpeta"
        toast.error(msg)
      }
    })
  }

  function handleDeleteFolderSubmit() {
    startTransition(async () => {
      try {
        await deleteFolder(folderToDelete, currentBucket)
        toast.success(`Carpeta y contenidos eliminados`)
        setDeleteFolderOpen(false)
        if (currentPath === folderToDelete || currentPath.startsWith(folderToDelete + "/")) {
          const parent = folderToDelete.split("/").slice(0, -1).join("/")
          setCurrentPath(parent)
        } else {
          await loadData(currentPath, currentBucket)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar la carpeta"
        toast.error(msg)
      }
    })
  }

  // File Actions
  function handleDeleteFileSubmit() {
    if (!fileToDelete) return
    startTransition(async () => {
      try {
        await deleteStorageFile(fileToDelete.path, currentBucket)
        toast.success(`Archivo "${fileToDelete.name}" eliminado`)
        setDeleteFileOpen(false)
        setFileToDelete(null)
        await loadData(currentPath, currentBucket)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar el archivo"
        toast.error(msg)
      }
    })
  }

  // Replace Actions
  function handleReplaceFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setNewReplacementFile(file)
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => setNewReplacementPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setNewReplacementPreview(null)
    }
  }

  function handleReplaceFileSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fileToReplace || !newReplacementFile) {
      toast.error("Selecciona un archivo de reemplazo")
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("file", newReplacementFile)

        const res = await replaceStorageFile(fileToReplace.path, formData, currentBucket)
        toast.success(`Archivo "${res.name}" reemplazado con éxito`)

        setReplaceFileOpen(false)
        setFileToReplace(null)
        setNewReplacementFile(null)
        setNewReplacementPreview(null)

        await loadData(currentPath, currentBucket)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al reemplazar el archivo"
        toast.error(msg)
      }
    })
  }

  // Upload Actions
  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadFile(file)
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-|-$/g, "")
    setCustomFileName(baseName)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => setUploadPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setUploadPreview(null)
    }
  }

  function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!uploadFile) {
      toast.error("Selecciona un archivo para subir")
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("file", uploadFile)

        const res = await uploadStorageFile(uploadTargetFolder, customFileName, formData, currentBucket)
        toast.success(`Archivo "${res.name}" subido con éxito`)

        setUploadOpen(false)
        setUploadFile(null)
        setUploadPreview(null)
        setCustomFileName("")

        if (pickerMode && onSelectFile) {
          onSelectFile(res.url)
        } else {
          if (uploadTargetFolder !== currentPath) {
            setCurrentPath(uploadTargetFolder)
          } else {
            await loadData(currentPath, currentBucket)
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al subir el archivo"
        toast.error(msg)
      }
    })
  }

  function copyToClipboard(url?: string) {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiedPath(url)
    toast.success("URL copiada al portapapeles")
    setTimeout(() => setCopiedPath(null), 2000)
  }

  // Filtered items
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const folderItems = filteredItems.filter((i) => i.isFolder)
  const fileItems = filteredItems.filter((i) => !i.isFolder)

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Left Side: Bucket Switcher & Breadcrumbs */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {/* Bucket Switcher */}
          {buckets.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
              <Database className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <select
                value={currentBucket}
                onChange={(e) => {
                  setCurrentBucket(e.target.value)
                  setCurrentPath("")
                }}
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {buckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    Bucket: {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => navigateToSegment(-1)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                currentPath === ""
                  ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Raíz</span>
            </button>

            {pathSegments.map((segment, idx) => (
              <div key={idx} className="flex items-center gap-1 shrink-0">
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => navigateToSegment(idx)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    idx === pathSegments.length - 1
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  {segment}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCreateFolderOpen(true)}
            className="gap-1.5 text-xs font-semibold bg-white text-slate-700 border-slate-300 hover:bg-slate-50 h-8"
          >
            <FolderPlus className="h-3.5 w-3.5 text-blue-600" />
            Nueva Carpeta
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              setUploadTargetFolder(currentPath)
              setUploadOpen(true)
            }}
            className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white h-8 shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Subir Archivo
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => loadData(currentPath, currentBucket)}
            disabled={loading}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800"
            title="Recargar"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Search Bar & Stats */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Buscar en esta carpeta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-white border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>
            {folderItems.length} carpetas · {fileItems.length} archivos
          </span>
        </div>
      </div>

      {/* Content View */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Cargando contenidos del Storage...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            {searchQuery ? "No se encontraron resultados" : "Carpeta vacía"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No hay elementos que coincidan con "${searchQuery}"`
              : "No hay archivos ni subcarpetas aquí. Puedes crear una carpeta o subir una imagen."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateFolderOpen(true)}
              className="text-xs gap-1.5"
            >
              <FolderPlus className="h-3.5 w-3.5 text-blue-600" />
              Crear Carpeta
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setUploadTargetFolder(currentPath)
                setUploadOpen(true)
              }}
              className="text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="h-3.5 w-3.5" />
              Subir Archivo
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* FOLDERS IN LIST FORMAT */}
          {folderItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5 text-blue-600" />
                <span>Carpetas ({folderItems.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {folderItems.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => setCurrentPath(item.path)}
                    className="group flex items-center justify-between gap-2.5 bg-white rounded-xl border border-slate-200 px-3.5 py-2.5 shadow-2xs hover:shadow-xs hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Folder className="h-4 w-4 fill-blue-100" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">Carpeta</p>
                      </div>
                    </div>

                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFolderToRename(item.path)
                          setRenamedFolderName(item.name)
                          setRenameFolderOpen(true)
                        }}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Renombrar carpeta"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFolderToDelete(item.path)
                          setDeleteFolderOpen(true)
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Eliminar carpeta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILES IN GRID FORMAT */}
          {fileItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>Archivos ({fileItems.length})</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {fileItems.map((item) => {
                  const isImage = item.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(item.name)
                  const isPdf = item.mimeType === "application/pdf" || item.name.endsWith(".pdf")

                  return (
                    <div
                      key={item.path}
                      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      {/* Thumbnail / Preview */}
                      <div
                        className="relative aspect-4/3 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100 cursor-pointer"
                        onClick={() => {
                          if (pickerMode && onSelectFile && item.url) {
                            onSelectFile(item.url)
                          } else if (isImage && item.url) {
                            setPreviewImage(item.url)
                          }
                        }}
                      >
                        {isImage && item.url ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : isPdf ? (
                          <div className="flex flex-col items-center justify-center gap-1 text-red-500">
                            <FileText className="h-8 w-8" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
                            <FileText className="h-8 w-8" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Archivo</span>
                          </div>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          {pickerMode && onSelectFile && item.url && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectFile(item.url!)
                              }}
                              className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Seleccionar
                            </Button>
                          )}

                          {isImage && item.url && !pickerMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPreviewImage(item.url!)
                              }}
                              className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors"
                              title="Vista previa"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFileToReplace(item)
                              setNewReplacementFile(null)
                              setNewReplacementPreview(null)
                              setReplaceFileOpen(true)
                            }}
                            className="p-1.5 rounded-lg bg-white/90 text-blue-700 hover:bg-white hover:text-blue-800 transition-colors"
                            title="Reemplazar archivo"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>

                          {item.url && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(item.url)
                              }}
                              className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors"
                              title="Copiar URL"
                            >
                              {copiedPath === item.url ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}

                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition-colors"
                              title="Abrir en pestaña nueva"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Info Footer */}
                      <div className="p-2.5 flex items-center justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatFileSize(item.size)}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setFileToReplace(item)
                              setNewReplacementFile(null)
                              setNewReplacementPreview(null)
                              setReplaceFileOpen(true)
                            }}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Reemplazar archivo"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFileToDelete(item)
                              setDeleteFileOpen(true)
                            }}
                            className="p-1 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar archivo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REPLACE FILE DIALOG */}
      <Dialog open={replaceFileOpen} onOpenChange={setReplaceFileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Reemplazar Imagen / Archivo
            </DialogTitle>
            <DialogDescription className="text-xs">
              Selecciona un nuevo archivo para sustituir{" "}
              <span className="font-semibold text-slate-800">{fileToReplace?.name}</span>. Se conservará la misma URL pública.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReplaceFileSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {/* Current Version */}
              <div className="text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Actual</span>
                <div className="aspect-4/3 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1">
                  {fileToReplace?.url && (fileToReplace.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(fileToReplace.name)) ? (
                    <img src={fileToReplace.url} alt="Actual" className="w-full h-full object-contain" />
                  ) : (
                    <FileText className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate" title={fileToReplace?.name}>{fileToReplace?.name}</p>
              </div>

              {/* New Version */}
              <div className="text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Nueva Versión</span>
                <div
                  onClick={() => replaceInputRef.current?.click()}
                  className={`aspect-4/3 rounded-lg overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors p-1 ${
                    newReplacementPreview
                      ? "bg-white border-blue-400"
                      : "bg-blue-50/40 border-blue-300 hover:bg-blue-50/70"
                  }`}
                >
                  {newReplacementPreview ? (
                    <img src={newReplacementPreview} alt="Nueva" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 p-2 text-blue-600">
                      <Upload className="h-6 w-6" />
                      <span className="text-[10px] font-semibold">Seleccionar archivo</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-blue-600 font-medium truncate" title={newReplacementFile?.name}>
                  {newReplacementFile ? newReplacementFile.name : "Ningún archivo elegido"}
                </p>
              </div>
            </div>

            <input
              ref={replaceInputRef}
              type="file"
              className="hidden"
              onChange={handleReplaceFileSelected}
              accept="image/*,application/pdf,video/*"
            />

            <div className="rounded-lg bg-blue-50/60 p-2.5 border border-blue-100 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                La imagen anterior será sustituida en el Storage. Todos los productos, catálogos y páginas que usan esta URL se actualizarán automáticamente.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReplaceFileOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !newReplacementFile}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                {isPending ? "Reemplazando..." : "Confirmar Reemplazo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE FOLDER DIALOG */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FolderPlus className="h-5 w-5 text-blue-600" />
              Crear Nueva Carpeta
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubicación: <span className="font-semibold text-slate-800">/{currentPath || "raíz"}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateFolderSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre de la carpeta</Label>
              <Input
                placeholder="ej: productos, rejillas, descargas..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                className="text-xs"
              />
              <p className="text-[11px] text-slate-400">
                Se formateará automáticamente en minúsculas y sin espacios.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateFolderOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !newFolderName.trim()}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? "Creando..." : "Crear Carpeta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RENAME FOLDER DIALOG */}
      <Dialog open={renameFolderOpen} onOpenChange={setRenameFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit2 className="h-5 w-5 text-blue-600" />
              Renombrar Carpeta
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRenameFolderSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nuevo nombre</Label>
              <Input
                value={renamedFolderName}
                onChange={(e) => setRenamedFolderName(e.target.value)}
                autoFocus
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRenameFolderOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !renamedFolderName.trim()}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? "Renombrando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE FOLDER CONFIRMATION DIALOG */}
      <Dialog open={deleteFolderOpen} onOpenChange={setDeleteFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-base">
              <AlertTriangle className="h-5 w-5" />
              ¿Eliminar carpeta y sus contenidos?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Estás a punto de eliminar la carpeta <span className="font-semibold text-slate-800">/{folderToDelete}</span>.
              Todos los archivos y subcarpetas que contenga serán eliminados permanentemente del Storage.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteFolderOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleDeleteFolderSubmit}
              className="text-xs"
            >
              {isPending ? "Eliminando..." : "Sí, Eliminar Carpeta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE FILE CONFIRMATION DIALOG */}
      <Dialog open={deleteFileOpen} onOpenChange={setDeleteFileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-base">
              <AlertTriangle className="h-5 w-5" />
              ¿Eliminar archivo?
            </DialogTitle>
            <DialogDescription className="text-xs">
              ¿Seguro que deseas eliminar <span className="font-semibold text-slate-800">{fileToDelete?.name}</span>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteFileOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleDeleteFileSubmit}
              className="text-xs"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPLOAD FILE DIALOG */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Upload className="h-5 w-5 text-blue-600" />
              Subir Archivo al Storage
            </DialogTitle>
            <DialogDescription className="text-xs">
              Selecciona el archivo, elige la carpeta de destino y personaliza su nombre.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2">
            {/* Folder Destination Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Carpeta de destino</Label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Raíz (/)</option>
                {allFolders
                  .filter((f) => Boolean(f))
                  .map((folder) => (
                    <option key={folder} value={folder}>
                      📁 /{folder}
                    </option>
                  ))}
              </select>
            </div>

            {/* File Drop / Select Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                uploadFile
                  ? "border-blue-400 bg-blue-50/30"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelected}
                accept="image/*,application/pdf,video/*"
              />

              {uploadPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-blue-600 font-medium">Clic para cambiar archivo</p>
                </div>
              ) : uploadFile ? (
                <div className="flex flex-col items-center gap-1 text-slate-700">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <p className="text-xs font-medium">{uploadFile.name}</p>
                  <p className="text-[10px] text-slate-400">{formatFileSize(uploadFile.size)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Haz clic para seleccionar o arrastra un archivo
                  </p>
                  <p className="text-[10px] text-slate-400">Imágenes (PNG, JPG, WebP), PDF, etc.</p>
                </div>
              )}
            </div>

            {/* Custom Filename Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nombre del archivo (sin extensión)</Label>
              <Input
                placeholder="ej: rejilla-lineal-blanco"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Se guardará con la extensión original del archivo seleccionado.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || !uploadFile}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                {isPending ? "Subiendo..." : "Subir al Storage"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* FULL PREVIEW MODAL */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-2 bg-slate-950 border-slate-800">
          {previewImage && (
            <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={previewImage}
                alt="Vista previa"
                className="max-h-[80vh] w-auto object-contain mx-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
