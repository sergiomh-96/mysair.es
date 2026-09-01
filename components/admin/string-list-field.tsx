"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Image as ImageIcon, ExternalLink, GripVertical } from "lucide-react"
import { MediaPickerModal } from "./storage/media-picker-modal"

interface StringListFieldProps {
  name: string
  label: string
  description?: string
  initialValue?: unknown
  placeholder?: string
  addButtonText?: string
  emptyText?: string
  isImage?: boolean
}

function parseInitialValue(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean)
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "[]") return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean)
      }
    } catch {
      return [trimmed]
    }
  }
  return []
}

export function StringListField({
  name,
  label,
  description,
  initialValue,
  placeholder = "https://ejemplo.com/imagen.webp o /images/...",
  addButtonText = "Añadir URL manual",
  emptyText = "No hay elementos en la lista.",
  isImage = true,
}: StringListFieldProps) {
  const [items, setItems] = useState<string[]>(() => parseInitialValue(initialValue))

  useEffect(() => {
    setItems(parseInitialValue(initialValue))
  }, [initialValue])

  function addItem(url = "") {
    setItems((prev) => [...prev, url])
  }

  function updateItem(index: number, val: string) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = val
      return updated
    })
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const serializedValue = JSON.stringify(
    items.map((i) => i.trim()).filter((i) => i.length > 0)
  )

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            {isImage ? <ImageIcon className="h-4 w-4 text-blue-600" /> : null}
            {label}
          </Label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          {items.length} {items.length === 1 ? "elemento" : "elementos"}
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
              className="group relative flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-2xs transition-colors hover:border-slate-300"
            >
              <div className="text-slate-300 cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>

              {isImage && item && (
                <div className="h-8 w-8 rounded border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = "none"
                    }}
                  />
                </div>
              )}

              <Input
                placeholder={placeholder}
                value={item}
                onChange={(e) => updateItem(idx, e.target.value)}
                className="h-8 text-xs font-mono bg-slate-50/50 focus:bg-white flex-1"
              />

              {isImage && (
                <MediaPickerModal
                  onSelect={(url) => updateItem(idx, url)}
                  triggerLabel="Cambiar"
                  triggerVariant="ghost"
                  className="h-8 px-2 text-slate-500 hover:text-blue-600"
                />
              )}

              {item && (
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                  title="Abrir enlace"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(idx)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {isImage && (
          <MediaPickerModal
            onSelect={(url) => addItem(url)}
            triggerLabel="Elegir o Subir al Storage"
            triggerVariant="outline"
            className="flex-1 text-xs font-semibold text-blue-700 bg-blue-50/60 border-blue-200 hover:bg-blue-100/70 h-8"
          />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addItem("")}
          className={`${isImage ? "shrink-0" : "w-full"} text-xs font-medium text-slate-600 border-slate-200 bg-white hover:bg-slate-50 gap-1.5 h-8`}
        >
          <Plus className="h-3.5 w-3.5" />
          {addButtonText}
        </Button>
      </div>
    </div>
  )
}
