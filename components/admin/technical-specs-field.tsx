"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Cpu, GripVertical, Braces, Sparkles, Copy, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
        return trimmed.startsWith("- ") ? trimmed : `- ${trimmed.slice(1).trimStart()}`
      }
      return `- ${trimmed}`
    })
    .join("\n")
}

export function parseSpecsJson(
  rawJson: string,
  splitCommas = true
): { entries: TechnicalSpecEntry[]; error?: string } {
  const trimmed = rawJson.trim()
  if (!trimmed) {
    return { entries: [], error: "Introduce o pega el contenido JSON." }
  }

  let parsed: unknown = null
  // 1. Try standard JSON.parse
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    // 2. Fault-tolerant cleanup: remove trailing commas, fix missing closing braces
    try {
      let sanitized = trimmed.replace(/,\s*([\]}])/g, "$1")
      if (sanitized.startsWith("{") && !sanitized.endsWith("}")) {
        sanitized = sanitized.replace(/,\s*$/, "") + "\n}"
      } else if (sanitized.startsWith("[") && !sanitized.endsWith("]")) {
        sanitized = sanitized.replace(/,\s*$/, "") + "\n]"
      }
      parsed = JSON.parse(sanitized)
    } catch {
      // 3. Fallback regex matcher for loose key-value pairs
      try {
        const regex = /["']([^"']+)["']\s*:\s*(?:["']([^"']*)["']|(\[[^\]]*\])|([^,\n}]+))/g
        const obj: Record<string, unknown> = {}
        let match
        let found = false
        while ((match = regex.exec(trimmed)) !== null) {
          found = true
          const key = match[1].trim()
          const val = (match[2] !== undefined ? match[2] : match[3] !== undefined ? match[3] : match[4] || "").trim()
          if (val.startsWith("[") && val.endsWith("]")) {
            try {
              obj[key] = JSON.parse(val)
            } catch {
              obj[key] = val
            }
          } else {
            obj[key] = val
          }
        }
        if (found) {
          parsed = obj
        } else {
          return { entries: [], error: "El formato JSON no es válido. Asegúrate de incluir pares \"clave\": \"valor\"." }
        }
      } catch (err) {
        return { entries: [], error: err instanceof Error ? err.message : "Error al interpretar JSON." }
      }
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return { entries: [], error: "El JSON debe ser un objeto con pares clave-valor (ej: {\"Alimentación\": \"220VAC\"})." }
  }

  const result: TechnicalSpecEntry[] = []

  // Case A: standard object { "Alimentación": "220-240VAC", ... }
  if (!Array.isArray(parsed)) {
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!key) continue
      let itemsStr = ""
      if (Array.isArray(value)) {
        itemsStr = value
          .map((v) => String(v).trim())
          .filter(Boolean)
          .map((v) => (v.startsWith("-") ? v : `- ${v}`))
          .join("\n")
      } else if (typeof value === "string") {
        const strVal = value.trim()
        if (strVal.includes("\n")) {
          itemsStr = strVal
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => (l.startsWith("-") ? l : `- ${l}`))
            .join("\n")
        } else if (splitCommas && strVal.includes(",")) {
          itemsStr = strVal
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => (s.startsWith("-") ? s : `- ${s}`))
            .join("\n")
        } else {
          itemsStr = strVal.startsWith("-") ? strVal : `- ${strVal}`
        }
      } else if (typeof value === "number" || typeof value === "boolean") {
        itemsStr = `- ${String(value)}`
      } else if (value && typeof value === "object") {
        itemsStr = Object.entries(value)
          .map(([subK, subV]) => `- ${subK}: ${String(subV)}`)
          .join("\n")
      }

      if (!itemsStr) itemsStr = "- "
      result.push({
        title: key.trim(),
        items: itemsStr,
      })
    }
  } else {
    // Case B: array of objects [ { title: "...", items: "..." }, ... ]
    for (const item of parsed) {
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>
        const title = String(obj.title || obj.name || obj.key || obj.caracteristica || "").trim()
        const rawVal = obj.items || obj.value || obj.valor || obj.detalles || ""
        let itemsStr = ""
        if (Array.isArray(rawVal)) {
          itemsStr = rawVal.map((v) => `- ${String(v).replace(/^-\s*/, "")}`).join("\n")
        } else if (typeof rawVal === "string") {
          if (splitCommas && rawVal.includes(",")) {
            itemsStr = rawVal.split(",").map((s) => s.trim()).filter(Boolean).map((s) => `- ${s}`).join("\n")
          } else {
            itemsStr = rawVal.split("\n").map((l) => `- ${l.trim().replace(/^-\s*/, "")}`).join("\n")
          }
        }
        if (title) {
          result.push({ title, items: itemsStr || "- " })
        }
      }
    }
  }

  if (result.length === 0) {
    return { entries: [], error: "No se encontraron especificaciones o características válidas en el JSON." }
  }

  return { entries: result }
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
  description = "Define cada especificación con título y sus detalles, o pega un bloque JSON para generarlas automáticamente",
  initialValue,
  addButtonText = "Añadir bloque de especificaciones",
  emptyText = "No hay especificaciones técnicas añadidas.",
}: TechnicalSpecsFieldProps) {
  const [entries, setEntries] = useState<TechnicalSpecEntry[]>(() => parseInitialSpecs(initialValue))
  const [showJsonPanel, setShowJsonPanel] = useState(false)
  const [jsonInput, setJsonInput] = useState("")
  const [splitCommas, setSplitCommas] = useState(true)
  const [jsonError, setJsonError] = useState("")
  const [jsonSuccess, setJsonSuccess] = useState("")

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

  function handleApplyJson(mode: "replace" | "append") {
    setJsonError("")
    setJsonSuccess("")

    const { entries: newEntries, error } = parseSpecsJson(jsonInput, splitCommas)
    if (error || !newEntries || newEntries.length === 0) {
      setJsonError(error || "Error al procesar el JSON.")
      toast.error(error || "Error al procesar el JSON.")
      return
    }

    if (mode === "replace") {
      setEntries(newEntries)
      toast.success(`${newEntries.length} especificaciones cargadas y separadas correctamente`)
      setJsonSuccess(`✓ Se han reemplazado y separado ${newEntries.length} características.`)
    } else {
      setEntries((prev) => [...prev, ...newEntries])
      toast.success(`${newEntries.length} especificaciones añadidas correctamente`)
      setJsonSuccess(`✓ Se han añadido ${newEntries.length} características a las existentes.`)
    }
  }

  function handleGenerateJsonFromCurrent() {
    const currentObj: Record<string, unknown> = {}
    entries.forEach((e) => {
      const t = e.title.trim()
      if (!t) return
      const lines = e.items
        .split("\n")
        .map((l) => l.replace(/^-\s*/, "").trim())
        .filter(Boolean)
      if (lines.length > 1) {
        currentObj[t] = lines.join(", ")
      } else {
        currentObj[t] = lines[0] || ""
      }
    })
    const generated = JSON.stringify(currentObj, null, 2)
    setJsonInput(generated)
    setJsonError("")
    setJsonSuccess("✓ JSON generado a partir de las especificaciones actuales.")
    toast.success("JSON actual cargado en el editor")
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
    <div className="space-y-3.5 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
      <input type="hidden" name={name} value={serializedValue} />

      {/* Header section with JSON toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-blue-600" />
            {label}
          </Label>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {entries.length} {entries.length === 1 ? "especificación" : "especificaciones"}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowJsonPanel(!showJsonPanel)}
            className={cn(
              "text-xs font-semibold gap-1.5 transition-colors h-7 px-2.5",
              showJsonPanel
                ? "bg-blue-50 text-blue-700 border-blue-300 shadow-2xs"
                : "text-slate-700 bg-white hover:bg-slate-50 border-slate-200"
            )}
            title="Importar especificaciones introduciendo formato JSON"
          >
            <Braces className="h-3.5 w-3.5 text-blue-600" />
            {showJsonPanel ? "Ocultar entrada JSON" : "Introducir en JSON"}
          </Button>
        </div>
      </div>

      {/* JSON Input / Importer Panel */}
      {showJsonPanel && (
        <div className="rounded-md border border-blue-200 bg-blue-50/30 p-3.5 space-y-3 shadow-2xs animate-in fade-in-50 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Braces className="h-4 w-4 text-blue-600" />
                Campo para introducir especificaciones en formato JSON
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Pega tu código JSON. El programa separará automáticamente los títulos/características y sus detalles/valores:
              </p>
            </div>
            {entries.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateJsonFromCurrent}
                className="h-6 px-2 text-[11px] text-blue-700 hover:bg-blue-100/60 shrink-0 font-medium"
                title="Generar y cargar el JSON de las especificaciones actuales"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiar actual a JSON
              </Button>
            )}
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value)
              if (jsonError) setJsonError("")
              if (jsonSuccess) setJsonSuccess("")
            }}
            placeholder={`{\n  "Alimentación": "220 - 240VAC",\n  "Frecuencia": "50Hz",\n  "Aislamiento": "Clase I",\n  "Temperatura de funcionamiento": "0ºC - 52ºC",\n  "Conexión de salidas": "7x Motor 12VDC 1A",\n  "Conexiónes": "1x puerto termostatos, 1x puerto modbus, 1x puerto comunicación con otros módulos MYSAir, 1x puerto módulo KNX "\n}`}
            rows={7}
            className="font-mono text-xs bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 leading-relaxed resize-y shadow-2xs"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-100">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={splitCommas}
                onChange={(e) => setSplitCommas(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>Separar valores con comas (<code className="font-mono text-[10px]">,</code>) en varios puntos con guion</span>
            </label>

            <div className="flex items-center gap-1.5 ml-auto">
              {jsonInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setJsonInput("")
                    setJsonError("")
                    setJsonSuccess("")
                  }}
                  className="h-7 text-xs text-slate-500 hover:text-slate-700"
                >
                  Limpiar
                </Button>
              )}
              {entries.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!jsonInput.trim()}
                  onClick={() => handleApplyJson("append")}
                  className="h-7 text-xs border-blue-300 text-blue-700 bg-white hover:bg-blue-50"
                  title="Añadir estas especificaciones sin borrar las actuales"
                >
                  Añadir a las existentes
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={!jsonInput.trim()}
                onClick={() => handleApplyJson("replace")}
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1.5 shadow-2xs"
                title="Separar títulos y detalles del JSON e importarlos"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Separar e importar JSON
              </Button>
            </div>
          </div>

          {jsonError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2.5 py-1.5 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
              <span>{jsonError}</span>
            </div>
          )}

          {jsonSuccess && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2.5 py-1.5 flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
              <span>{jsonSuccess}</span>
            </div>
          )}
        </div>
      )}

      {/* List of specification blocks */}
      {entries.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 bg-white py-6 text-center space-y-2.5">
          <p className="text-xs text-slate-400">{emptyText}</p>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="text-xs text-slate-600 h-7"
            >
              <Plus className="h-3 w-3 mr-1" />
              Añadir bloque manual
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowJsonPanel(true)
              }}
              className="text-xs text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 h-7"
            >
              <Braces className="h-3 w-3 mr-1" />
              Pegar en formato JSON
            </Button>
          </div>
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
