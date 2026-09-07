"use client"

import { useState, useEffect, useTransition, useRef, useMemo } from "react"
import {
  StorageFileItem,
  StorageBucketItem,
  listStorageBuckets,
  listStorageItems,
  createFolder,
  renameFolder,
  deleteFolder,
  uploadStorageFile,
  bulkUploadStorageFiles,
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
  FolderOpen,
  FolderPlus,
  Upload,
  ChevronRight,
  ChevronDown,
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
  FolderTree,
} from "lucide-react"
import { toast } from "sonner"

interface TreeNode {
  name: string
  path: string
  fullPath: string
  children: TreeNode[]
}

function buildFolderTree(folderPaths: string[]): TreeNode {
  const root: TreeNode = {
    name: "Raíz",
    path: "",
    fullPath: "",
    children: [],
  }

  const sortedPaths = Array.from(new Set(folderPaths.filter(Boolean))).sort()

  for (const p of sortedPaths) {
    const parts = p.split("/").filter(Boolean)
    let current = root
    let accumulatedPath = ""

    for (const part of parts) {
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part
      let child = current.children.find((c) => c.name === part)
      if (!child) {
        child = {
          name: part,
          path: part,
          fullPath: accumulatedPath,
          children: [],
        }
        current.children.push(child)
      }
      current = child
    }
  }

  return root
}

function FolderTreeNodeItem({
  node,
  currentPath,
  expandedFolders,
  toggleExpand,
  onSelectFolder,
  onCreateSubfolder,
  onRenameFolder,
  onDeleteFolder,
  level = 0,
}: {
  node: TreeNode
  currentPath: string
  expandedFolders: Set<string>
  toggleExpand: (path: string) => void
  onSelectFolder: (path: string) => void
  onCreateSubfolder: (path: string) => void
  onRenameFolder: (path: string, name: string) => void
  onDeleteFolder: (path: string) => void
  level?: number
}) {
  const isSelected = currentPath === node.fullPath
  const hasChildren = node.children.length > 0
  const isExpanded = expandedFolders.has(node.fullPath)

  return (
    <div className="select-none">
      <div
        className={`group flex items-center justify-between gap-1 py-1.5 px-2 rounded-lg text-xs cursor-pointer transition-all ${
          isSelected
            ? "bg-blue-600 text-white font-semibold shadow-2xs"
            : "text-slate-700 hover:bg-slate-200/70"
        }`}
        style={{ paddingLeft: `${Math.max(8, level * 14 + 8)}px` }}
        onClick={() => onSelectFolder(node.fullPath)}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.fullPath)
              }}
              className={`p-0.5 rounded transition-colors ${
                isSelected
                  ? "text-blue-200 hover:text-white hover:bg-blue-700"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-300/40"
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          {isSelected ? (
            <FolderOpen className="h-3.5 w-3.5 text-blue-100 shrink-0 fill-blue-200/30" />
          ) : isExpanded ? (
            <FolderOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          )}

          <span className="truncate font-medium" title={node.name}>
            {node.name}
          </span>
        </div>

        {/* Action icons on hover */}
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0 ${
            isSelected ? "text-blue-100" : "text-slate-400"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onCreateSubfolder(node.fullPath)}
            className={`p-1 rounded ${
              isSelected ? "hover:text-white hover:bg-blue-700" : "hover:text-blue-600 hover:bg-blue-50"
            }`}
            title="Nueva subcarpeta"
          >
            <FolderPlus className="h-3 w-3" />
          </button>
          {node.fullPath !== "" && (
            <>
              <button
                type="button"
                onClick={() => onRenameFolder(node.fullPath, node.name)}
                className={`p-1 rounded ${
                  isSelected ? "hover:text-white hover:bg-blue-700" : "hover:text-blue-600 hover:bg-blue-50"
                }`}
                title="Renombrar"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteFolder(node.fullPath)}
                className={`p-1 rounded ${
                  isSelected ? "hover:text-white hover:bg-red-600" : "hover:text-red-600 hover:bg-red-50"
                }`}
                title="Eliminar"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="space-y-0.5 mt-0.5">
          {node.children.map((child) => (
            <FolderTreeNodeItem
              key={child.fullPath}
              node={child}
              currentPath={currentPath}
              expandedFolders={expandedFolders}
              toggleExpand={toggleExpand}
              onSelectFolder={onSelectFolder}
              onCreateSubfolder={onCreateSubfolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

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

  // Tree expansion state
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([""]))

  // Dialog states
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [createFolderParent, setCreateFolderParent] = useState(currentPath)
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

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [isUploadingDrop, setIsUploadingDrop] = useState(false)
  const dropZoneInputRef = useRef<HTMLInputElement>(null)

  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

  // Drag & Drop Handlers for central area
  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const next = prev - 1
      if (next <= 0) {
        setIsDragging(false)
        return 0
      }
      return next
    })
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)

    const droppedFiles = Array.from(e.dataTransfer.files || []).filter((f) => f.size > 0)
    if (droppedFiles.length === 0) return

    await processDroppedFiles(droppedFiles)
  }

  async function processDroppedFiles(files: File[]) {
    if (files.length === 0) return
    setIsUploadingDrop(true)
    const targetPath = currentPath
    const folderDisplay = targetPath ? `/${targetPath}` : "la raíz"
    const toastId = toast.loading(`Subiendo ${files.length} archivo(s) a ${folderDisplay}...`)

    try {
      const formData = new FormData()
      for (const file of files) {
        formData.append("files", file)
      }

      const res = await bulkUploadStorageFiles(targetPath, formData, currentBucket)
      toast.success(`¡${res.count} archivo(s) subido(s) con éxito!`, { id: toastId })
      await loadData(currentPath, currentBucket)

      if (pickerMode && onSelectFile && res.uploaded.length > 0) {
        onSelectFile(res.uploaded[0].url)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al subir los archivos"
      toast.error(msg, { id: toastId })
    } finally {
      setIsUploadingDrop(false)
    }
  }

  // Auto-expand ancestors when currentPath changes
  useEffect(() => {
    if (currentPath) {
      const parts = currentPath.split("/").filter(Boolean)
      const toExpand: string[] = [""]
      let acc = ""
      for (const part of parts) {
        acc = acc ? `${acc}/${part}` : part
        toExpand.push(acc)
      }
      setExpandedFolders((prev) => {
        const next = new Set(prev)
        toExpand.forEach((p) => next.add(p))
        return next
      })
    }
  }, [currentPath])

  function toggleExpand(path: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

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

  // Build tree from allFolders
  const folderTree = useMemo(() => buildFolderTree(allFolders), [allFolders])

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
  function openCreateFolder(parent = currentPath) {
    setCreateFolderParent(parent)
    setNewFolderName("")
    setCreateFolderOpen(true)
  }

  function handleCreateFolderSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newFolderName.trim()) return

    startTransition(async () => {
      try {
        await createFolder(createFolderParent, newFolderName, currentBucket)
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

  function openRenameFolder(path: string, name: string) {
    setFolderToRename(path)
    setRenamedFolderName(name)
    setRenameFolderOpen(true)
  }

  function handleRenameFolderSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!renamedFolderName.trim() || !folderToRename) return

    startTransition(async () => {
      try {
        await renameFolder(folderToRename, renamedFolderName, currentBucket)
        toast.success(`Carpeta renombrada a "${renamedFolderName}"`)
        setRenameFolderOpen(false)
        setFolderToRename("")
        setRenamedFolderName("")
        await loadData(currentPath, currentBucket)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al renombrar la carpeta"
        toast.error(msg)
      }
    })
  }

  function openDeleteFolder(path: string) {
    setFolderToDelete(path)
    setDeleteFolderOpen(true)
  }

  function handleDeleteFolderSubmit() {
    if (!folderToDelete) return
    startTransition(async () => {
      try {
        await deleteFolder(folderToDelete, currentBucket)
        toast.success(`Carpeta eliminada`)
        setDeleteFolderOpen(false)
        setFolderToDelete("")
        if (currentPath === folderToDelete || currentPath.startsWith(`${folderToDelete}/`)) {
          setCurrentPath("")
        } else {
          await loadData(currentPath, currentBucket)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar la carpeta"
        toast.error(msg)
      }
    })
  }

  // File Delete Actions
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
    <div className="flex flex-col gap-3 h-full">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs shrink-0">
        {/* Bucket Switcher & Search */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          {buckets.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
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

          {/* Search Box */}
          <div className="relative w-full sm:w-64 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Buscar archivo en carpeta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-slate-50/50 border-slate-200"
            />
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openCreateFolder(currentPath)}
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
            title="Recargar Storage"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Vertical Tree & Center/Right Files Area */}
      <div className="flex-1 flex flex-col md:flex-row rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs min-h-[520px]">
        {/* LEFT VERTICAL SIDEBAR: FOLDER TREE */}
        <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/70 p-3 flex flex-col gap-2 shrink-0 overflow-y-auto max-h-[220px] md:max-h-none">
          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="h-3.5 w-3.5 text-blue-600" />
              Estructura de Carpetas
            </span>
            <button
              type="button"
              onClick={() => openCreateFolder("")}
              className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
              title="Crear carpeta en la raíz"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 overflow-y-auto flex-1 pr-0.5">
            <FolderTreeNodeItem
              node={folderTree}
              currentPath={currentPath}
              expandedFolders={expandedFolders}
              toggleExpand={toggleExpand}
              onSelectFolder={(path) => setCurrentPath(path)}
              onCreateSubfolder={(path) => openCreateFolder(path)}
              onRenameFolder={(path, name) => openRenameFolder(path, name)}
              onDeleteFolder={(path) => openDeleteFolder(path)}
              level={0}
            />
          </div>
        </div>

        {/* CENTER & RIGHT CONTENT AREA: FILES VIEW (DRAG & DROP ZONE) */}
        <div
          className="relative flex-1 flex flex-col min-w-0 bg-white overflow-y-auto"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* DRAG & DROP FULL OVERLAY */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-blue-600/10 backdrop-blur-[2px] border-2 border-dashed border-blue-600 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg mb-3 animate-bounce">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-blue-950 mb-1">
                Suelta aquí los archivos para subirlos
              </h3>
              <p className="text-xs text-blue-700 font-medium max-w-sm">
                Se subirán directamente a la carpeta:{" "}
                <span className="font-bold underline font-mono">/{currentPath || "raíz"}</span>
              </p>
              <span className="mt-2.5 text-[11px] bg-white text-blue-800 px-3 py-1 rounded-full font-semibold border border-blue-200 shadow-2xs">
                Imágenes (PNG, JPG, WebP, SVG), PDFs, Planos y Modelos 3D
              </span>
            </div>
          )}

          {/* Hidden multi-file input for clicking dropzone */}
          <input
            ref={dropZoneInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length > 0) {
                processDroppedFiles(files)
              }
              e.target.value = ""
            }}
            accept="image/*,application/pdf,video/*,model/*,.dwg,.dxf,.rvt,.rfa,.stl,.step,.stp"
          />

          {/* Breadcrumbs & Active Folder Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/30 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => navigateToSegment(-1)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold transition-colors ${
                  currentPath === ""
                    ? "text-blue-700 bg-blue-100/70 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Raíz</span>
              </button>

              {pathSegments.map((segment, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => navigateToSegment(idx)}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      idx === pathSegments.length - 1
                        ? "text-blue-700 bg-blue-100/70 font-bold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {segment}
                  </button>
                </div>
              ))}
            </div>

            {/* Folder stats & quick actions */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>
                {fileItems.length} {fileItems.length === 1 ? "archivo" : "archivos"}
                {folderItems.length > 0 && ` · ${folderItems.length} subcarpetas`}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => dropZoneInputRef.current?.click()}
                disabled={isUploadingDrop}
                className="h-7 px-2.5 text-xs text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100 font-semibold gap-1.5"
              >
                <Upload className="h-3 w-3" />
                {isUploadingDrop ? "Subiendo..." : "Arrastrar o Subir"}
              </Button>
            </div>
          </div>

          {/* Subfolders Quick Chips (if current folder has subfolders) */}
          {folderItems.length > 0 && (
            <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Folder className="h-3 w-3 text-slate-400" /> Subcarpetas:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {folderItems.map((f) => (
                  <button
                    key={f.path}
                    type="button"
                    onClick={() => setCurrentPath(f.path)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all shadow-2xs"
                  >
                    <Folder className="h-3 w-3 text-blue-500 fill-blue-50" />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Files Display */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Quick Drag & Drop Bar when files exist */}
            {fileItems.length > 0 && (
              <div
                onClick={() => dropZoneInputRef.current?.click()}
                className="mb-4 rounded-xl border border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/30 px-4 py-2.5 text-center cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 text-slate-600 text-xs font-medium min-w-0">
                  <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">
                    <span className="font-semibold text-slate-800">Arrastra archivos aquí</span> o haz clic para subir a{" "}
                    <span className="font-mono text-blue-600 font-semibold">/{currentPath || "raíz"}</span>
                  </span>
                </div>
                <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-medium shrink-0 group-hover:border-blue-200 group-hover:text-blue-600">
                  Múltiples archivos permitidos
                </span>
              </div>
            )}

            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600">Cargando archivos...</p>
              </div>
            ) : fileItems.length === 0 ? (
              <div
                onClick={() => dropZoneInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 p-12 text-center my-6 cursor-pointer transition-all flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  Arrastra y suelta tus archivos aquí
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  O haz clic para seleccionar archivos desde tu equipo para subirlos a{" "}
                  <span className="font-mono font-semibold text-blue-600">/{currentPath || "raíz"}</span>
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-2xs pointer-events-none"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Seleccionar archivos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                {fileItems.map((item) => {
                  const isImage =
                    item.mimeType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(item.name)
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
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
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
            )}
          </div>
        </div>
      </div>

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
                  {fileToReplace?.url &&
                  (fileToReplace.mimeType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(fileToReplace.name)) ? (
                    <img src={fileToReplace.url} alt="Actual" className="w-full h-full object-contain" />
                  ) : (
                    <FileText className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate" title={fileToReplace?.name}>
                  {fileToReplace?.name}
                </p>
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
              Ubicación: <span className="font-semibold text-slate-800">/{createFolderParent || "raíz"}</span>
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
