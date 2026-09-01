"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ExternalLink, FileText, GripVertical } from "lucide-react"
import { MediaPickerModal } from "./storage/media-picker-modal"

export interface DocumentItem {
  name: string
  url: string
}

interface DocumentListFieldProps {
  name: string
  label: string
  description?: string
  initialValue?: unknown
  nameFieldPlaceholder?: string
  urlFieldPlaceholder?: string
  addButtonText?: string
  emptyText?: string
}

function parseInitialValue(value: unknown): DocumentItem[] {
  if (!value) return []
  
  if (Array.isArray(value)) {
    return value
      .filter((item): item is unknown => Boolean(item))
      .map((item) => {
        if (typeof item === "string") {
          return { name: "Documento", url: item }
        }
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>
          return {
            name: String(obj.name || obj.title || obj.label || "Documento"),
            url: String(obj.url || obj.href || obj.link || ""),
          }
        }
        return { name: "Documento", url: "" }
      })
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "[]") return []
    try {
      const parsed = JSON.parse(trimmed)
      return parseInitialValue(parsed)
    } catch {
      // If it's just a raw single URL
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return [{ name: "Documento", url: trimmed }]
      }
      return []
    }
  }

  return []
}

export function DocumentListField({
  name,
  label,
  description,
  initialValue,
  nameFieldPlaceholder = "Ej: Ficha técnica - Español (PDF)",
  urlFieldPlaceholder = "https://drive.google.com/... o enlace de descarga",
  addButtonText = "Añadir enlace",
  emptyText = "No hay documentos adjuntos.",
}: DocumentListFieldProps) {
  const [items, setItems] = useState<DocumentItem[]>(() => parseInitialValue(initialValue))

  // Update if initialValue changes externally
  useEffect(() => {
    setItems(parseInitialValue(initialValue))
  }, [initialValue])

  function addItem() {
    setItems((prev) => [...prev, { name: "", url: "" }])
  }

  function updateItem(index: number, key: keyof DocumentItem, val: string) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: val }
      return updated
    })
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Filter out completely empty items when serializing to JSON
  const serializedValue = JSON.stringify(
    items
      .map((i) => ({ name: i.name.trim(), url: i.url.trim() }))
      .filter((i) => i.name.length > 0 || i.url.length > 0)
  )

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
      {/* Hidden input storing the valid JSON array */}
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-blue-600" />
            {label}
          </Label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          {items.length} {items.length === 1 ? "archivo" : "archivos"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 bg-white py-4 text-center">
          <p className="text-xs text-slate-400">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-md border border-slate-200 bg-white p-2.5 shadow-2xs transition-colors hover:border-slate-300"
            >
              <div className="hidden sm:flex items-center text-slate-300 cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <Input
                    placeholder={nameFieldPlaceholder}
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    className="h-8 text-xs bg-slate-50/50 focus:bg-white"
                  />
                </div>
                  <div className="sm:col-span-7 flex items-center gap-1.5">
                    <Input
                      placeholder={urlFieldPlaceholder}
                      value={item.url}
                      onChange={(e) => updateItem(idx, "url", e.target.value)}
                      className="h-8 text-xs font-mono bg-slate-50/50 focus:bg-white flex-1"
                    />
                    <MediaPickerModal
                      onSelect={(url) => {
                        updateItem(idx, "url", url)
                        if (!item.name) {
                          const filename = url.split("/").pop() || "Documento"
                          updateItem(idx, "name", filename)
                        }
                      }}
                      triggerLabel="Storage"
                      triggerVariant="ghost"
                      className="h-8 px-2 text-slate-500 hover:text-blue-600"
                    />
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                        title="Abrir enlace"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(idx)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 self-end sm:self-center"
                title="Eliminar documento"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full text-xs font-medium text-blue-600 border-blue-200 bg-white hover:bg-blue-50/60 gap-1.5 h-8"
      >
        <Plus className="h-3.5 w-3.5" />
        {addButtonText}
      </Button>
    </div>
  )
}
