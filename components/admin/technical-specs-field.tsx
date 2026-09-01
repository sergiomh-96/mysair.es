"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Cpu, GripVertical } from "lucide-react"

export interface TechnicalSpecEntry {
  title: string
  items: string // Multi-line text with auto dash - prefix
}

interface TechnicalSpecsFieldProps {
  name: string
  label?: string
  description?: string
  initialValue?: unknown
  addButtonText?: string
  emptyText?: string
}

function ensureDashes(text: string): string {
  if (!text) return ""
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trimStart()
      if (!trimmed) return ""
      if (trimmed.startsWith("-")) {
        // Ensure space after dash: "-Texto" -> "- Texto"
        return trimmed.startsWith("- ") ? trimmed : `- ${trimmed.slice(1).trimStart()}`
      }
      return `- ${trimmed}`
    })
    .join("\n")
}

function parseInitialSpecs(value: unknown): TechnicalSpecEntry[] {
  if (!value) return []

  // If already parsed object { "Alimentación": ["230V", "50Hz"], "Material": "Aluminio" }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).map(([k, v]) => {
      let itemsText = ""
      if (Array.isArray(v)) {
        itemsText = v.map((item) => `- ${String(item).replace(/^-\s*/, "")}`).join("\n")
      } else if (typeof v === "string") {
        const lines = v.split("\n").map((l) => l.trim()).filter(Boolean)
        if (lines.length > 1) {
          itemsText = lines.map((l) => (l.startsWith("-") ? l : `- ${l}`)).join("\n")
        } else if (v.includes(",")) {
          itemsText = v.split(",").map((s) => `- ${s.trim()}`).join("\n")
        } else {
          itemsText = v.startsWith("-") ? v : `- ${v}`
        }
      } else {
        itemsText = `- ${String(v)}`
      }
      return {
        title: k,
        items: itemsText,
      }
    })
  }

  // If array of { title, value } or string
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>
        const title = String(obj.title || obj.name || obj.key || "Especificación")
        const val = obj.items || obj.value || obj.description || ""
        let itemsText = ""
        if (Array.isArray(val)) {
          itemsText = val.map((v) => `- ${String(v).replace(/^-\s*/, "")}`).join("\n")
        } else {
          itemsText = String(val)
            .split("\n")
            .map((l) => (l.trim().startsWith("-") ? l.trim() : `- ${l.trim()}`))
            .join("\n")
        }
        return { title, items: itemsText }
      }
      return { title: "Especificación", items: `- ${String(item)}` }
    })
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "{}" || trimmed === "[]") return []
    try {
      const parsed = JSON.parse(trimmed)
      return parseInitialSpecs(parsed)
    } catch {
      return [{ title: "General", items: `- ${trimmed}` }]
    }
  }

  return []
}

export function TechnicalSpecsField({
  name,
  label = "Especificaciones técnicas",
  description = "Define cada especificación con título y sus detalles (el guion - se autogenera en cada línea)",
  initialValue,
  addButtonText = "Añadir bloque de especificaciones",
  emptyText = "No hay especificaciones técnicas añadidas.",
}: TechnicalSpecsFieldProps) {
  const [entries, setEntries] = useState<TechnicalSpecEntry[]>(() => parseInitialSpecs(initialValue))

  useEffect(() => {
    setEntries(parseInitialSpecs(initialValue))
  }, [initialValue])

  function addEntry() {
    setEntries((prev) => [...prev, { title: "", items: "- " }])
  }

  function updateEntry(index: number, key: keyof TechnicalSpecEntry, val: string) {
    setEntries((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: val }
      return updated
    })
  }

  function removeEntry(index: number) {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, idx: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const value = target.value

      // Find beginning of the current line
      const lineStart = value.lastIndexOf("\n", start - 1) + 1
      const currentLine = value.slice(lineStart, start).trim()

      // If pressing enter on an empty bullet line, remove bullet
      if (currentLine === "-" || currentLine === "- ") {
        const newValue = value.slice(0, lineStart) + value.slice(end)
        updateEntry(idx, "items", newValue)
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = lineStart
        }, 0)
        return
      }

      // Automatically insert newline with dash prefix
      const newValue = value.substring(0, start) + "\n- " + value.substring(end)
      updateEntry(idx, "items", newValue)

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3
      }, 0)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>, idx: number) => {
    if (!e.target.value.trim()) {
      updateEntry(idx, "items", "- ")
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = 2
      }, 0)
    }
  }

  const handleBlur = (idx: number) => {
    // Clean up on blur: ensure each non-empty line starts with "- "
    setEntries((prev) => {
      const updated = [...prev]
      const currentItems = updated[idx]?.items
      if (currentItems) {
        updated[idx] = { ...updated[idx], items: ensureDashes(currentItems) }
      }
      return updated
    })
  }

  // Serialize to an Object where each key has array of items
  const serializedObject: Record<string, string[]> = {}
  entries.forEach((e) => {
    const title = e.title.trim()
    if (title) {
      const lines = e.items
        .split("\n")
        .map((l) => l.trim().replace(/^-\s*/, "").trim())
        .filter(Boolean)
      if (lines.length > 0) {
        serializedObject[title] = lines
      }
    }
  })

  const serializedValue = JSON.stringify(serializedObject)

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-blue-600" />
            {label}
          </Label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          {entries.length} {entries.length === 1 ? "especificación" : "especificaciones"}
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 bg-white py-4 text-center">
          <p className="text-xs text-slate-400">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className="group relative rounded-md border border-slate-200 bg-white p-3 shadow-2xs transition-colors hover:border-slate-300 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <div className="text-slate-300 cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                      Título / Característica
                    </span>
                    <Input
                      placeholder="Ej: Alimentación, Caudal máximo, Nivel sonoro, Material..."
                      value={entry.title}
                      onChange={(e) => updateEntry(idx, "title", e.target.value)}
                      className="h-8 text-xs font-semibold bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(idx)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 self-end"
                  title="Eliminar especificación"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 pl-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Detalles y valores (un guion por cada línea, autogenerado)
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Pulsa Enter para nueva línea con guion
                  </span>
                </div>
                <Textarea
                  placeholder={`- 230V AC ±10% / 50 Hz\n- Consumo en reposo: < 0.5W\n- Fusible térmico integrado`}
                  value={entry.items}
                  onChange={(e) => updateEntry(idx, "items", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onFocus={(e) => handleFocus(e, idx)}
                  onBlur={() => handleBlur(idx)}
                  rows={3}
                  className="text-xs font-mono bg-slate-50/50 focus:bg-white leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addEntry}
        className="w-full text-xs font-medium text-blue-600 border-blue-200 bg-white hover:bg-blue-50/60 gap-1.5 h-8"
      >
        <Plus className="h-3.5 w-3.5" />
        {addButtonText}
      </Button>
    </div>
  )
}
