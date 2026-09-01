"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const BUCKET_NAME = "media"

export interface StorageFileItem {
  id: string
  name: string
  isFolder: boolean
  path: string
  size?: number
  updatedAt?: string
  mimeType?: string
  url?: string
}

/**
 * Ensures the target public bucket exists.
 */
async function ensureBucket() {
  const supabase = await createServerClient()
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === BUCKET_NAME || b.id === BUCKET_NAME)

  if (!exists) {
    try {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 25 * 1024 * 1024, // 25MB
        allowedMimeTypes: ["image/*", "application/pdf", "video/*", "model/*", "application/octet-stream"],
      })
    } catch {
      // Ignore if cannot create, might fallback to contact-attachments or existing
    }
  }
}

/**
 * List files and folders inside a given path in the bucket.
 */
export async function listStorageItems(currentPath = ""): Promise<{
  items: StorageFileItem[]
  allFolders: string[]
}> {
  await ensureBucket()
  const supabase = await createServerClient()

  const cleanPath = currentPath.replace(/^\/+|\/+$/g, "")

  // List objects in current path
  const { data: objects, error } = await supabase.storage.from(BUCKET_NAME).list(cleanPath, {
    limit: 200,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  })

  if (error) {
    // If bucket doesn't exist yet, return empty list
    return { items: [], allFolders: [""] }
  }

  // Find all folders in the bucket for dropdown selection (recursively or root level)
  const allFoldersSet = new Set<string>([""])

  const scanFolders = async (prefix = "", depth = 0) => {
    if (depth > 4) return
    const { data } = await supabase.storage.from(BUCKET_NAME).list(prefix, { limit: 100 })
    if (data) {
      for (const obj of data) {
        if (!obj.id && obj.name && !obj.name.includes(".")) {
          const folderPath = prefix ? `${prefix}/${obj.name}` : obj.name
          allFoldersSet.add(folderPath)
          await scanFolders(folderPath, depth + 1)
        }
      }
    }
  }

  try {
    await scanFolders("", 0)
  } catch {}

  const items: StorageFileItem[] = (objects || [])
    .filter((obj) => obj.name !== ".emptyFolderPlaceholder" && obj.name !== ".keep")
    .map((obj) => {
      // In Supabase storage, folders have obj.id === null or no metadata mimetype
      const isFolder = !obj.id || (!obj.metadata?.mimetype && !obj.name.includes("."))
      const itemPath = cleanPath ? `${cleanPath}/${obj.name}` : obj.name

      let url: string | undefined = undefined
      if (!isFolder) {
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(itemPath)
        url = publicUrlData?.publicUrl
      }

      return {
        id: obj.id || itemPath,
        name: obj.name,
        isFolder,
        path: itemPath,
        size: obj.metadata?.size,
        updatedAt: obj.updated_at || obj.created_at || undefined,
        mimeType: obj.metadata?.mimetype,
        url,
      }
    })

  // Sort folders first, then files alphabetically
  items.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1
    return a.name.localeCompare(b.name)
  })

  return {
    items,
    allFolders: Array.from(allFoldersSet).sort(),
  }
}

/**
 * Create a new folder by creating a placeholder file.
 */
export async function createFolder(parentPath: string, folderName: string) {
  await ensureBucket()
  const supabase = await createServerClient()

  const cleanName = folderName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-|-$/g, "")

  if (!cleanName) {
    throw new Error("El nombre de la carpeta no es válido.")
  }

  const cleanParent = parentPath.replace(/^\/+|\/+$/g, "")
  const newFolderPath = cleanParent ? `${cleanParent}/${cleanName}` : cleanName
  const placeholderPath = `${newFolderPath}/.emptyFolderPlaceholder`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(placeholderPath, new Uint8Array(0), {
    contentType: "text/plain",
    upsert: true,
  })

  if (error) {
    throw new Error(`Error al crear la carpeta: ${error.message}`)
  }

  revalidatePath("/admin/multimedia")
  return { path: newFolderPath, name: cleanName }
}

/**
 * Rename a folder by copying all objects to the new folder prefix and deleting the old ones.
 */
export async function renameFolder(oldFolderPath: string, newFolderName: string) {
  await ensureBucket()
  const supabase = await createServerClient()

  const cleanOld = oldFolderPath.replace(/^\/+|\/+$/g, "")
  const cleanName = newFolderName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-|-$/g, "")

  if (!cleanOld) throw new Error("Carpeta de origen no válida.")
  if (!cleanName) throw new Error("El nuevo nombre de la carpeta no es válido.")

  const parentParts = cleanOld.split("/")
  parentParts.pop()
  const parentPath = parentParts.join("/")
  const cleanNew = parentPath ? `${parentPath}/${cleanName}` : cleanName

  if (cleanOld === cleanNew) return { path: cleanNew }

  // List all files in old folder recursively
  const getAllFiles = async (prefix: string): Promise<string[]> => {
    const { data } = await supabase.storage.from(BUCKET_NAME).list(prefix, { limit: 500 })
    let filePaths: string[] = []
    if (data) {
      for (const item of data) {
        const itemPath = `${prefix}/${item.name}`
        if (!item.id && !item.name.includes(".")) {
          const sub = await getAllFiles(itemPath)
          filePaths = filePaths.concat(sub)
        } else {
          filePaths.push(itemPath)
        }
      }
    }
    return filePaths
  }

  const files = await getAllFiles(cleanOld)

  if (files.length === 0) {
    // If empty folder, just create new placeholder and remove old
    await supabase.storage.from(BUCKET_NAME).upload(`${cleanNew}/.emptyFolderPlaceholder`, new Uint8Array(0), { upsert: true })
    await supabase.storage.from(BUCKET_NAME).remove([`${cleanOld}/.emptyFolderPlaceholder`])
  } else {
    for (const filePath of files) {
      const relative = filePath.substring(cleanOld.length + 1)
      const newFilePath = `${cleanNew}/${relative}`
      await supabase.storage.from(BUCKET_NAME).move(filePath, newFilePath)
    }
  }

  revalidatePath("/admin/multimedia")
  return { path: cleanNew }
}

/**
 * Delete a folder and all its contents recursively.
 */
export async function deleteFolder(folderPath: string) {
  await ensureBucket()
  const supabase = await createServerClient()

  const cleanPath = folderPath.replace(/^\/+|\/+$/g, "")
  if (!cleanPath) throw new Error("No se puede eliminar la carpeta raíz.")

  const getAllFiles = async (prefix: string): Promise<string[]> => {
    const { data } = await supabase.storage.from(BUCKET_NAME).list(prefix, { limit: 500 })
    let filePaths: string[] = []
    if (data) {
      for (const item of data) {
        const itemPath = `${prefix}/${item.name}`
        if (!item.id && !item.name.includes(".")) {
          const sub = await getAllFiles(itemPath)
          filePaths = filePaths.concat(sub)
        } else {
          filePaths.push(itemPath)
        }
      }
    }
    return filePaths
  }

  const files = await getAllFiles(cleanPath)
  // Also include the folder placeholder if any
  files.push(`${cleanPath}/.emptyFolderPlaceholder`)

  if (files.length > 0) {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(files)
    if (error) throw new Error(`Error al eliminar contenido: ${error.message}`)
  }

  revalidatePath("/admin/multimedia")
  return { success: true }
}

/**
 * Upload a file with custom name into a specific folder.
 */
export async function uploadStorageFile(
  folderPath: string,
  customFileName: string,
  formData: FormData
): Promise<{ url: string; path: string; name: string }> {
  await ensureBucket()
  const supabase = await createServerClient()

  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No se ha seleccionado ningún archivo.")
  }

  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, "")
  const originalName = file.name

  // Extract extension
  const ext = originalName.includes(".") ? originalName.split(".").pop()?.toLowerCase() : "jpg"
  let cleanName = (customFileName || originalName.replace(/\.[^/.]+$/, ""))
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-|-$/g, "")

  if (!cleanName) {
    cleanName = `img-${Date.now()}`
  }

  const finalFileName = `${cleanName}.${ext}`
  const finalFilePath = cleanFolder ? `${cleanFolder}/${finalFileName}` : finalFileName

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(finalFilePath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  })

  if (error) {
    throw new Error(`Error al subir el archivo: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(finalFilePath)

  revalidatePath("/admin/multimedia")
  return {
    url: publicUrlData.publicUrl,
    path: finalFilePath,
    name: finalFileName,
  }
}

/**
 * Delete a single file.
 */
export async function deleteStorageFile(filePath: string) {
  await ensureBucket()
  const supabase = await createServerClient()

  const cleanPath = filePath.replace(/^\/+|\/+$/g, "")
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([cleanPath])

  if (error) {
    throw new Error(`Error al eliminar archivo: ${error.message}`)
  }

  revalidatePath("/admin/multimedia")
  return { success: true }
}
