export interface ProductImageItem {
  url: string
  alt: string
}

export function parseProductImageItem(item: unknown): ProductImageItem {
  if (!item) return { url: "", alt: "" }

  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>
    return {
      url: typeof obj.url === "string" ? obj.url : "",
      alt: typeof obj.alt === "string" ? obj.alt : "",
    }
  }

  if (typeof item === "string") {
    const trimmed = item.trim()
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (parsed && typeof parsed === "object") {
          return {
            url: typeof parsed.url === "string" ? parsed.url : "",
            alt: typeof parsed.alt === "string" ? parsed.alt : "",
          }
        }
      } catch {
        // Fall back to plain string
      }
    }
    return { url: trimmed, alt: "" }
  }

  return { url: String(item), alt: "" }
}

export function normalizeProductImages(value: unknown): ProductImageItem[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map(parseProductImageItem).filter((img) => img.url.length > 0)
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "[]") return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map(parseProductImageItem).filter((img) => img.url.length > 0)
      }
      return [parseProductImageItem(parsed)].filter((img) => img.url.length > 0)
    } catch {
      return [parseProductImageItem(trimmed)].filter((img) => img.url.length > 0)
    }
  }
  return []
}

export function getAutoProductAlt(
  productName: string,
  index: number = 0,
  total: number = 1
): string {
  const cleanName = productName?.trim() || ""
  if (!cleanName) return ""
  if (total <= 1 && index === 0) {
    return cleanName
  }
  return `${cleanName} - Imagen ${index + 1}`
}

export function getProductMainImage(
  imageUrl: unknown,
  fallback = "/placeholder.svg?height=200&width=300"
): { url: string; alt: string } {
  const images = normalizeProductImages(imageUrl)
  if (images.length > 0) {
    return images[0]
  }
  return { url: fallback, alt: "" }
}
