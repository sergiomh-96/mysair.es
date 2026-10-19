function parseProductImageItem(item) {
  if (!item) return { url: "", alt: "" }
  if (typeof item === "object" && item !== null) {
    return {
      url: typeof item.url === "string" ? item.url : "",
      alt: typeof item.alt === "string" ? item.alt : "",
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
      } catch {}
    }
    return { url: trimmed, alt: "" }
  }
  return { url: String(item), alt: "" }
}

function normalizeProductImages(value) {
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

// Test cases
console.log("Test 1 (array of strings):", normalizeProductImages(["https://test.com/a.jpg", "https://test.com/b.jpg"]))
console.log("Test 2 (array of objects):", normalizeProductImages([{ url: "https://test.com/a.jpg", alt: "Custom Alt" }]))
console.log("Test 3 (array of json strings from pg):", normalizeProductImages(['{"url":"https://test.com/a.jpg","alt":"Custom Alt"}']))
console.log("Test 4 (single string):", normalizeProductImages("https://test.com/a.jpg"))
console.log("Test 5 (null/undefined):", normalizeProductImages(null))
