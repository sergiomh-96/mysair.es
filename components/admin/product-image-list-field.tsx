"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Tag,
  RotateCcw,
} from "lucide-react"
import { MediaPickerModal } from "./storage/media-picker-modal"
import {
  normalizeProductImages,
  ProductImageItem,
  getAutoProductAlt,
} from "@/lib/utils/product-image"

interface ProductImageListFieldProps {
  name?: string
  label?: string
  description?: string
  initialValue?: unknown
  productName?: string
}

function initItemsWithAutoAlt(
  initialValue: unknown,
  productName: string
): ProductImageItem[] {
  const normalized = normalizeProductImages(initialValue)
  return normalized.map((item, idx) => ({
    url: item.url,
    alt:
      item.alt && item.alt.trim().length > 0
        ? item.alt
        : getAutoProductAlt(productName, idx, normalized.length),
  }))
}

export function ProductImageListField({
  name = "image_url",
  label = "Imágenes y atributos ALT",
  description = "Gestiona las imágenes del producto y define el atributo ALT para posicionamiento SEO y accesibilidad.",
  initialValue,
  productName = "",
}: ProductImageListFieldProps) {
  const [items, setItems] = useState<ProductImageItem[]>(() =>
    initItemsWithAutoAlt(initialValue, productName)
  )

  useEffect(() => {
    setItems(initItemsWithAutoAlt(initialValue, productName))
  }, [initialValue, productName])

  function addItem(url = "") {
    setItems((prev) => {
      const nextIndex = prev.length
      const autoAlt = getAutoProductAlt(productName, nextIndex, nextIndex + 1)
      return [...prev, { url, alt: autoAlt }]
    })
  }

  function updateItem(index: number, patch: Partial<ProductImageItem>) {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...patch }
      return updated
    })
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return
    setItems((prev) => {
      const updated = [...prev]
      const temp = updated[index]
      updated[index] = updated[targetIndex]
      updated[targetIndex] = temp
      return updated
    })
  }

  // Serialized for form submission
  const serializedValue = JSON.stringify(
    items
      .map((i) => ({ url: i.url.trim(), alt: i.alt.trim() }))
      .filter((i) => i.url.length > 0)
  )

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <input type="hidden" name={name} value={serializedValue} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            {label}
          </Label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MediaPickerModal
            onSelect={(url) => addItem(url)}
            triggerLabel="Subir o elegir foto"
            triggerVariant="outline"
            className="h-8 px-3 text-xs text-blue-700 bg-blue-50/90 border-blue-200 hover:bg-blue-100 font-semibold gap-1.5 shadow-2xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addItem("")}
            className="h-8 px-2.5 text-xs text-slate-700 bg-white hover:bg-slate-50 gap-1 shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            URL manual
          </Button>
          <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
            {items.length} {items.length === 1 ? "foto" : "fotos"}
          </span>
        </div>
      </div>

      {/* Images List */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white py-6 text-center space-y-1">
          <ImageIcon className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs font-medium text-slate-500">No hay imágenes añadidas a este producto.</p>
          <p className="text-[11px] text-slate-400">Pulsa "Subir o elegir foto" o "URL manual" para comenzar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const autoAlt = getAutoProductAlt(productName, idx, items.length)
            const isCustomized =
              item.alt.trim().length > 0 && item.alt.trim() !== autoAlt.trim()

            return (
              <div
                key={idx}
                className="group relative rounded-lg border border-slate-200 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail Preview */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.alt || `Preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLElement).style.display = "none"
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                    )}
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.2 rounded font-mono font-medium">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Inputs area */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row 1: Image URL */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                          URL de la imagen
                          {idx === 0 && (
                            <span className="bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded text-[10px]">
                              Foto de portada
                            </span>
                          )}
                        </label>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            Ver <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          placeholder="https://... o /images/..."
                          value={item.url}
                          onChange={(e) => updateItem(idx, { url: e.target.value })}
                          className="h-8 text-xs font-mono bg-slate-50/50 focus:bg-white flex-1"
                        />
                        <MediaPickerModal
                          onSelect={(url) => updateItem(idx, { url })}
                          triggerLabel={item.url ? "Cambiar" : "Elegir"}
                          triggerVariant="outline"
                          className="h-8 px-2.5 text-xs text-slate-600 hover:text-blue-600 shrink-0"
                        />
                      </div>
                    </div>

                    {/* Row 2: ALT Attribute */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-blue-600" />
                          <span>Texto alternativo (Atributo ALT)</span>
                          {isCustomized ? (
                            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              Personalizado
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-normal bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              Asignado automáticamente
                            </span>
                          )}
                        </label>
                        {isCustomized && autoAlt && (
                          <button
                            type="button"
                            onClick={() => updateItem(idx, { alt: autoAlt })}
                            className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
                            title="Restablecer al texto asignado automáticamente"
                          >
                            <RotateCcw className="h-3 w-3" /> Restablecer a automático
                          </button>
                        )}
                      </div>
                      <Input
                        value={item.alt}
                        onChange={(e) => updateItem(idx, { alt: e.target.value })}
                        placeholder={autoAlt || "Descripción de la imagen para Google..."}
                        className={`h-8 text-xs bg-white transition-colors ${
                          isCustomized
                            ? "border-blue-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            : "border-slate-200 text-slate-800"
                        }`}
                      />
                      <p className="text-[10px] text-slate-400">
                        {isCustomized ? (
                          <span className="text-blue-700 font-medium">
                            ✓ Usando texto personalizado ({item.alt.length} caracteres) en lugar del asignado automáticamente.
                          </span>
                        ) : (
                          <span>
                            Texto asignado por defecto:{" "}
                            <strong className="text-slate-600 font-medium">"{autoAlt}"</strong>. Si lo modificas, se usará tu nuevo texto.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Move & Delete) */}
                  <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      title="Mover arriba"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === items.length - 1}
                      title="Mover abajo"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeItem(idx)}
                      title="Eliminar imagen"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
