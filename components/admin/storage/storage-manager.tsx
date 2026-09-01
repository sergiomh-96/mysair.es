"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import {
  StorageFileItem,
  listStorageItems,
  createFolder,
  renameFolder,
  deleteFolder,
  uploadStorageFile,
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
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

interface StorageManagerProps {
  onSelectFile?: (url: string) => void
  initialPath?: string
  pickerMode?: boolean
}

export function StorageManager({
  onSelectFile,
  initialPath = "",
  pickerMode = false,
}: StorageManagerProps) {
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

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadTargetFolder, setUploadTargetFolder] = useState(currentPath)
  const [customFileName, setCustomFileName] = useState("")

  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load items when currentPath changes
  async function loadData(path = currentPath) {
    setLoading(true)
    try {
      const data = await listStorageItems(path)
      setItems(data.items)
      setAllFolders(data.allFolders)
    } catch {
      toast.error("Error al cargar los archivos del Storage")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(currentPath)
    setUploadTargetFolder(currentPath)
  }, [currentPath])

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
        await createFolder(currentPath, newFolderName)
        toast.success(`Carpeta "${newFolderName}" creada correctamente`)
        setCreateFolderOpen(false)
        setNewFolderName("")
        await loadData(currentPath)
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
        await renameFolder(folderToRename, renamedFolderName)
        toast.success(`Carpeta renombrada a "${renamedFolderName}"`)
        setRenameFolderOpen(false)
        if (currentPath === folderToRename || currentPath.startsWith(folderToRename + "/")) {
          // If we were inside the renamed folder, navigate up
          const parent = folderToRename.split("/").slice(0, -1).join("/")
          setCurrentPath(parent ? `${parent}/${renamedFolderName}` : renamedFolderName)
        } else {
          await loadData(currentPath)
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
        await deleteFolder(folderToDelete)
        toast.success(`Carpeta y contenidos eliminados`)
        setDeleteFolderOpen(false)
        if (currentPath === folderToDelete || currentPath.startsWith(folderToDelete + "/")) {
          const parent = folderToDelete.split("/").slice(0, -1).join("/")
          setCurrentPath(parent)
        } else {
          await loadData(currentPath)
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
        await deleteStorageFile(fileToDelete.path)
        toast.success(`Archivo "${fileToDelete.name}" eliminado`)
        setDeleteFileOpen(false)
        setFileToDelete(null)
        await loadData(currentPath)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar el archivo"
        toast.error(msg)
      }
    })
  }

  // Upload Actions
  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadFile(file)
    // Suggest clean slug filename without extension
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

        const res = await uploadStorageFile(uploadTargetFolder, customFileName, formData)
        toast.success(`Imagen "${res.name}" subida con éxito`)

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
            await loadData(currentPath)
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 flex-wrap text-sm">
          <button
            type="button"
            onClick={() => navigateToSegment(-1)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              currentPath === ""
                ? "bg-slate-100 text-slate-800"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Raíz (Storage)</span>
          </button>

          {pathSegments.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <button
                type="button"
                onClick={() => navigateToSegment(idx)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  idx === pathSegments.length - 1
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {segment}
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCreateFolderOpen(true)}
            className="gap-1.5 text-xs font-semibold bg-white text-slate-700 border-slate-300 hover:bg-slate-50 h-8"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-500" />
            <span>Nueva Carpeta</span>
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
            <span>Subir Imagen</span>
          </Button>
        </div>
      </div>

      {/* Sub-toolbar: Current folder management + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {currentPath && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigateToSegment(pathSegments.length - 2)}
                className="h-8 text-xs font-medium text-slate-600 hover:bg-slate-100 gap-1.5 px-2.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Volver</span>
              </Button>

              <div className="h-4 w-px bg-slate-200" />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFolderToRename(currentPath)
                  setRenamedFolderName(pathSegments[pathSegments.length - 1] || "")
                  setRenameFolderOpen(true)
                }}
                className="h-8 text-xs font-medium text-slate-600 hover:text-slate-900 gap-1.5 px-2.5 bg-white border-slate-200"
              >
                <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                <span>Renombrar</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFolderToDelete(currentPath)
                  setDeleteFolderOpen(true)
                }}
                className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5 px-2.5 bg-white border-red-200"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                <span>Eliminar carpeta</span>
              </Button>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-white"
          />
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mb-2" />
          <p className="text-xs">Cargando archivos del Storage...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
          <Folder className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">Esta carpeta está vacía</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">
            Crea una nueva subcarpeta o pulsa en &quot;Subir Imagen&quot; para añadir contenido.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredItems.map((item) => {
            if (item.isFolder) {
              return (
                <div
                  key={item.path}
                  onClick={() => setCurrentPath(item.path)}
                  className="group relative flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xs transition-all cursor-pointer text-center"
                >
                  <div className="p-3 rounded-xl bg-amber-100/70 group-hover:bg-amber-200/80 text-amber-600 mb-2 transition-colors">
                    <Folder className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1 w-full" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Carpeta</span>
                </div>
              )
            }

            // Image / File card
            const isImage = item.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name)

            return (
              <div
                key={item.path}
                className="group relative flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
                  {isImage && item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                      <FileText className="h-8 w-8 text-slate-300 mb-1" />
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {item.name.split(".").pop()}
                      </span>
                    </div>
                  )}

                  {/* Overlay buttons on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    {isImage && item.url && (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImage(item.url || null)
                        }}
                        className="h-7 w-7 p-0 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow"
                        title="Previsualizar"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(item.url)
                      }}
                      className="h-7 w-7 p-0 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow"
                      title="Copiar enlace público"
                    >
                      {copiedPath === item.url ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFileToDelete(item)
                        setDeleteFileOpen(true)
                      }}
                      className="h-7 w-7 p-0 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-2 space-y-1.5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1 block" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {formatFileSize(item.size)}
                    </span>
                  </div>

                  {/* If in picker mode, provide a Select button */}
                  {pickerMode && onSelectFile && item.url && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onSelectFile(item.url!)}
                      className="w-full h-7 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Seleccionar</span>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 1. Dialog: Create Folder */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <FolderPlus className="h-5 w-5 text-amber-500" />
              <span>Nueva Carpeta</span>
            </DialogTitle>
            <DialogDescription>
              Se creará dentro de: <strong className="text-slate-700">{currentPath ? `/${currentPath}` : "/ (Raíz)"}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nombre de la carpeta *</Label>
              <Input
                placeholder="Ej: rejillas, banners, 2026, fichas..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                required
              />
              <p className="text-[11px] text-slate-400">
                Se formateará automáticamente en minúsculas sin espacios ni caracteres especiales.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateFolderOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || !newFolderName.trim()} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                {isPending ? "Creando..." : "Crear Carpeta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Dialog: Rename Folder */}
      <Dialog open={renameFolderOpen} onOpenChange={setRenameFolderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Edit2 className="h-5 w-5 text-blue-600" />
              <span>Renombrar Carpeta</span>
            </DialogTitle>
            <DialogDescription>
              ¿Deseas renombrar la carpeta <strong>{folderToRename}</strong>? Los enlaces de los archivos dentro de ella se actualizarán a la nueva ruta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameFolderSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nuevo nombre *</Label>
              <Input
                value={renamedFolderName}
                onChange={(e) => setRenamedFolderName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRenameFolderOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || !renamedFolderName.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {isPending ? "Renombrando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Dialog: Delete Folder Confirmation */}
      <Dialog open={deleteFolderOpen} onOpenChange={setDeleteFolderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirmar Eliminación de Carpeta</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-xs">
              Esta acción es irreversible. Se eliminará la carpeta <strong className="text-red-700">/{folderToDelete}</strong> y <strong>todos los archivos contenidos en ella</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            ⚠️ Si algún producto o artículo utiliza imágenes de esta carpeta, dejarán de visualizarse.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteFolderOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleDeleteFolderSubmit} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
              {isPending ? "Eliminando..." : "Sí, Eliminar Carpeta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Dialog: Delete File Confirmation */}
      <Dialog open={deleteFileOpen} onOpenChange={setDeleteFileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5 text-red-600" />
              <span>Eliminar Archivo</span>
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-xs">
              ¿Estás seguro de que deseas eliminar permanentemente el archivo <strong className="text-slate-900">{fileToDelete?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteFileOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleDeleteFileSubmit} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
              {isPending ? "Eliminando..." : "Eliminar Archivo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Dialog: Upload Image with Custom Folder and Name */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Cargar Imagen al Storage</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Elige la carpeta de destino y el nombre del archivo para mantener organizado tu almacenamiento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* File drop / select area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.stl,.pdf"
                onChange={handleFileSelected}
                className="hidden"
              />
              {uploadPreview ? (
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="max-h-36 max-w-full rounded-lg object-contain border border-slate-200 bg-white"
                  />
                  <span className="text-xs font-semibold text-blue-600">
                    Hacer clic para cambiar archivo ({uploadFile?.name})
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Haz clic para seleccionar una imagen de tu equipo
                  </p>
                  <p className="text-[11px] text-slate-400">Soporta JPG, PNG, WEBP, GIF, SVG</p>
                </div>
              )}
            </div>

            {/* Target Folder Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Carpeta de destino *</Label>
              <select
                value={uploadTargetFolder}
                onChange={(e) => setUploadTargetFolder(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value="">/ (Carpeta Raíz)</option>
                {allFolders
                  .filter((f) => f !== "")
                  .map((f) => (
                    <option key={f} value={f}>
                      📁 /{f}
                    </option>
                  ))}
              </select>
            </div>

            {/* Custom File Name Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Nombre personalizado del archivo *</Label>
              <div className="flex items-center gap-1.5">
                <Input
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="Ej: rejilla-lineal-blanco-frontal"
                  className="text-xs font-mono"
                  required
                />
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-2 rounded-lg border border-slate-200">
                  {uploadFile?.name.includes(".") ? `.${uploadFile.name.split(".").pop()?.toLowerCase()}` : ".jpg"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Se guardará como: <code className="text-blue-600 font-mono">/{uploadTargetFolder ? `${uploadTargetFolder}/` : ""}{customFileName || "nombre"}.{uploadFile?.name.split(".").pop() || "jpg"}</code>
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !uploadFile || !customFileName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Subiendo archivo...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    Confirmar y Subir
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. Preview Modal for Full Size Image */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl p-3 bg-black/90 text-white border-0">
          <div className="flex flex-col items-center justify-center p-2">
            {previewImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt="Vista previa"
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            )}
            <div className="mt-3 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(previewImage || undefined)}
                className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar URL
              </Button>
              {previewImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 gap-1.5"
                >
                  <a href={previewImage} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir en pestaña nueva
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
