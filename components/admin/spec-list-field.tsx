"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Sliders, GripVertical } from "lucide-react"

export interface SpecItem {
  name: string
  description: string
  extraKey?: string
}

interface SpecListFieldProps {
  name: string
  label: string
  description?: string
  initialValue?: unknown
  nameLabel?: string
  namePlaceholder?: string
  valueLabel?: string
  valuePlaceholder?: string
  addButtonText?: string
  emptyText?: string
  isColor?: boolean
}

function parseInitialValue(value: unknown, isColor?: boolean): SpecItem[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .filter((item): item is unknown => Boolean(item))
      .map((item) => {
        if (typeof item === "string") {
          return { name: item, description: "" }
        }
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>
          const name = String(obj.name || obj.title || obj.label || obj.key || "")
          const desc = isColor
            ? String(obj.hex_color || obj.description || obj.value || "")
            : String(obj.description || obj.value || obj.val || "")
          return {
            name,
            description: desc,
          }
        }
        return { name: "", description: "" }
      })
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed || trimmed === "[]") return []
    try {
      const parsed = JSON.parse(trimmed)
      return parseInitialValue(parsed, isColor)
    } catch {
      return [{ name: trimmed, description: "" }]
    }
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Record<string, unknown>).map(([k, v]) => ({
      name: k,
      description: typeof v === "string" ? v : JSON.stringify(v),
    }))
  }

  return []
}

export function SpecListField({
  name,
  label,
  description,
  initialValue,
  nameLabel = "Nombre / Título",
  namePlaceholder = "Ej: MS201V-V4 o 2 Vías",
  valueLabel = "Descripción / Valor",
  valuePlaceholder = "Ej: Central de clima 7 zonas",
  addButtonText = "Añadir opción",
  emptyText = "No hay elementos configurados.",
  isColor = false,
}: SpecListFieldProps) {
  const [items, setItems] = useState<SpecItem[]>(() => parseInitialValue(initialValue, isColor))

  useEffect(() => {
    setItems(parseInitialValue(initialValue, isColor))
  }, [initialValue, isColor])

  function addItem() {
    setItems((prev) => [...prev, { name: "", description: isColor ? "#ffffff" : "" }])
  }

  function updateItem(index: number, key: keyof SpecItem, val: string) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: val }
      return updated
    })
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Serialize to array of { name, description } (or { name, hex_color } if isColor)
  const serializedValue = JSON.stringify(
    items
      .map((i) => {
        if (isColor) {
          return { name: i.name.trim(), hex_color: i.description.trim() }
        }
        return { name: i.name.trim(), description: i.description.trim() }
      })
      .filter((i) => i.name.length > 0 || (isColor ? (i as any).hex_color?.length > 0 : (i as any).description?.length > 0))
  )

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-blue-600" />
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
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-md border border-slate-200 bg-white p-2.5 shadow-2xs transition-colors hover:border-slate-300"
            >
              <div className="hidden sm:flex items-center text-slate-300 cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {nameLabel}
                  </span>
                  <Input
                    placeholder={namePlaceholder}
                    value={item.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                    className="h-8 text-xs bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-7 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {valueLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isColor && (
                      <input
                        type="color"
                        value={item.description.startsWith("#") ? item.description : "#ffffff"}
                        onChange={(e) => updateItem(idx, "description", e.target.value)}
                        className="h-8 w-8 rounded border border-slate-200 p-0.5 cursor-pointer shrink-0"
                      />
                    )}
                    <Input
                      placeholder={valuePlaceholder}
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="h-8 text-xs bg-slate-50/50 focus:bg-white flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(idx)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 self-end sm:self-center mt-4 sm:mt-0"
                title="Eliminar elemento"
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
