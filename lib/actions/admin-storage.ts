"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const DEFAULT_BUCKET = "images"

export interface StorageBucketItem {
  id: string
  name: string
  isPublic: boolean
}

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
async function ensureBucket(bucketName = DEFAULT_BUCKET) {
  const supabase = await createServerClient()
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === bucketName || b.id === bucketName)

    if (!exists && bucketName === DEFAULT_BUCKET) {
      await supabase.storage.createBucket(DEFAULT_BUCKET, {
        public: true,
        fileSizeLimit: 25 * 1024 * 1024, // 25MB
        allowedMimeTypes: ["image/*", "application/pdf", "video/*", "model/*", "application/octet-stream"],
      })
    }
  } catch {
    // Ignore if bucket creation not permitted
  }
}

/**
 * List all available storage buckets in Supabase.
 */
export async function listStorageBuckets(): Promise<StorageBucketItem[]> {
  const supabase = await createServerClient()
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error || !buckets || buckets.length === 0) {
      return [
        { id: "images", name: "images", isPublic: true },
        { id: "media", name: "media", isPublic: true },
        { id: "contact-attachments", name: "contact-attachments", isPublic: true },
      ]
    }
    const list = buckets.map((b) => ({
      id: b.id || b.name,
      name: b.name || b.id,
      isPublic: b.public ?? true,
    }))
    // Ensure "images" is sorted first if present
    list.sort((a, b) => {
      if (a.name === "images") return -1
      if (b.name === "images") return 1
      return a.name.localeCompare(b.name)
    })
    return list
  } catch {
    return [{ id: "images", name: "images", isPublic: true }]
  }
}

/**
 * Helper to check if an object returned by Supabase Storage is a folder.
 */
function isFolderItem(obj: { id?: string | null; name: string; metadata?: Record<string, unknown> | null }): boolean {
  if (!obj.id || obj.id === null) return true
  if (!obj.metadata || obj.metadata === null) return true
  if (!obj.metadata.mimetype && !obj.name.includes(".")) return true
  return false
}

/**
 * List files and folders inside a given path in the specified bucket.
 */
export async function listStorageItems(
  currentPath = "",
  bucketName = DEFAULT_BUCKET
): Promise<{
  items: StorageFileItem[]
  allFolders: string[]
  currentBucket: string
}> {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()

  const cleanPath = currentPath.replace(/^\/+|\/+$/g, "")
  const targetBucket = bucketName || DEFAULT_BUCKET

  // List objects in current path
  const { data: objects, error } = await supabase.storage.from(targetBucket).list(cleanPath || undefined, {
    limit: 250,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  })

  if (error) {
    console.warn(`[admin-storage] Error listing path "${cleanPath}" in bucket "${targetBucket}":`, error.message)
    return { items: [], allFolders: [""], currentBucket: targetBucket }
  }

  // Scan all existing folders recursively in the bucket for the folder dropdown
  const allFoldersSet = new Set<string>([""])

  const scanFolders = async (prefix = "", depth = 0) => {
    if (depth > 5) return
    try {
      const { data } = await supabase.storage.from(targetBucket).list(prefix || undefined, { limit: 150 })
      if (data) {
        for (const obj of data) {
          if (isFolderItem(obj)) {
            const folderPath = prefix ? `${prefix}/${obj.name}` : obj.name
            allFoldersSet.add(folderPath)
            await scanFolders(folderPath, depth + 1)
          }
        }
      }
    } catch {
      // Continue scanning
    }
  }

  try {
    await scanFolders("", 0)
  } catch {}

  const items: StorageFileItem[] = (objects || [])
    .filter((obj) => obj.name !== ".emptyFolderPlaceholder" && obj.name !== ".keep")
    .map((obj) => {
      const isFolder = isFolderItem(obj)
      const itemPath = cleanPath ? `${cleanPath}/${obj.name}` : obj.name

      let url: string | undefined = undefined
      if (!isFolder) {
        const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(itemPath)
        url = publicUrlData?.publicUrl
      }

      return {
        id: obj.id || itemPath,
        name: obj.name,
        isFolder,
        path: itemPath,
        size: (obj.metadata as { size?: number })?.size,
        updatedAt: obj.updated_at || obj.created_at || undefined,
        mimeType: (obj.metadata as { mimetype?: string })?.mimetype,
        url,
      }
    })

  // Sort folders first, then files alphabetically
  items.sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  })

  return {
    items,
    allFolders: Array.from(allFoldersSet).sort(),
    currentBucket: targetBucket,
  }
}

/**
 * Create a new folder by creating a placeholder file.
 */
export async function createFolder(parentPath: string, folderName: string, bucketName = DEFAULT_BUCKET) {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

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

  const { error } = await supabase.storage.from(targetBucket).upload(placeholderPath, new Uint8Array(0), {
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
export async function renameFolder(oldFolderPath: string, newFolderName: string, bucketName = DEFAULT_BUCKET) {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

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
    const { data } = await supabase.storage.from(targetBucket).list(prefix, { limit: 500 })
    let filePaths: string[] = []
    if (data) {
      for (const item of data) {
        const itemPath = `${prefix}/${item.name}`
        if (isFolderItem(item)) {
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
    await supabase.storage.from(targetBucket).upload(`${cleanNew}/.emptyFolderPlaceholder`, new Uint8Array(0), { upsert: true })
    await supabase.storage.from(targetBucket).remove([`${cleanOld}/.emptyFolderPlaceholder`])
  } else {
    for (const filePath of files) {
      const relative = filePath.substring(cleanOld.length + 1)
      const newFilePath = `${cleanNew}/${relative}`
      await supabase.storage.from(targetBucket).move(filePath, newFilePath)
    }
  }

  revalidatePath("/admin/multimedia")
  return { path: cleanNew }
}

/**
 * Delete a folder and all its contents recursively.
 */
export async function deleteFolder(folderPath: string, bucketName = DEFAULT_BUCKET) {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

  const cleanPath = folderPath.replace(/^\/+|\/+$/g, "")
  if (!cleanPath) throw new Error("No se puede eliminar la carpeta raíz.")

  const getAllFiles = async (prefix: string): Promise<string[]> => {
    const { data } = await supabase.storage.from(targetBucket).list(prefix, { limit: 500 })
    let filePaths: string[] = []
    if (data) {
      for (const item of data) {
        const itemPath = `${prefix}/${item.name}`
        if (isFolderItem(item)) {
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
  files.push(`${cleanPath}/.emptyFolderPlaceholder`)

  if (files.length > 0) {
    const { error } = await supabase.storage.from(targetBucket).remove(files)
    if (error) throw new Error(`Error al eliminar contenido: ${error.message}`)
  }

  revalidatePath("/admin/multimedia")
  return { success: true }
}

/**
 * Upload a file with custom name into a specific folder and bucket.
 */
export async function uploadStorageFile(
  folderPath: string,
  customFileName: string,
  formData: FormData,
  bucketName = DEFAULT_BUCKET
): Promise<{ url: string; path: string; name: string }> {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

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

  const { error } = await supabase.storage.from(targetBucket).upload(finalFilePath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  })

  if (error) {
    throw new Error(`Error al subir el archivo: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(finalFilePath)

  revalidatePath("/admin/multimedia")
  return {
    url: publicUrlData.publicUrl,
    path: finalFilePath,
    name: finalFileName,
  }
}

/**
 * Replace an existing file in storage by overwriting its content (upsert: true).
 * This preserves the exact file path and public URL.
 */
export async function replaceStorageFile(
  filePath: string,
  formData: FormData,
  bucketName = DEFAULT_BUCKET
): Promise<{ url: string; path: string; name: string }> {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No se ha seleccionado ningún archivo de reemplazo.")
  }

  const cleanPath = filePath.replace(/^\/+|\/+$/g, "")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error } = await supabase.storage.from(targetBucket).upload(cleanPath, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  })

  if (error) {
    throw new Error(`Error al reemplazar el archivo: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(cleanPath)

  revalidatePath("/admin/multimedia")
  return {
    url: publicUrlData.publicUrl,
    path: cleanPath,
    name: cleanPath.split("/").pop() || cleanPath,
  }
}

/**
 * Delete a single file from storage.
 */
export async function deleteStorageFile(filePath: string, bucketName = DEFAULT_BUCKET) {
  await ensureBucket(bucketName)
  const supabase = await createServerClient()
  const targetBucket = bucketName || DEFAULT_BUCKET

  const cleanPath = filePath.replace(/^\/+|\/+$/g, "")
  const { error } = await supabase.storage.from(targetBucket).remove([cleanPath])

  if (error) {
    throw new Error(`Error al eliminar archivo: ${error.message}`)
  }

  revalidatePath("/admin/multimedia")
  return { success: true }
}

