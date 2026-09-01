"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

interface SolicitarPresupuestoBtnProps {
  productName?: string
  productSlug?: string
  variant?: string
  dimension?: string
  vias?: string
  color?: string
  insulation?: string
  communication?: string
  reference?: string
  hasVariants?: boolean
}

export function SolicitarPresupuestoBtn({
  productName,
  productSlug,
  variant,
  dimension,
  vias,
  color,
  insulation,
  communication,
  reference,
  hasVariants = false,
}: SolicitarPresupuestoBtnProps) {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)

  // Clear warning when user selects a variant
  useEffect(() => {
    if (variant) {
      setShowWarning(false)
    }
  }, [variant])

  const handleClick = () => {
    if (hasVariants && !variant) {
      setShowWarning(true)
      return
    }

    setShowWarning(false)
    const params = new URLSearchParams()
    params.set("tipo", "quote")

    const name = productName || productSlug || "Artículo"
    const details: string[] = []

    if (variant) details.push(`- Variante / Modelo: ${variant}`)
    if (dimension) details.push(`- Dimensión: ${dimension}`)
    if (vias) details.push(`- Vías: ${vias}`)
    if (color) details.push(`- Color / Acabado: ${color}`)
    if (insulation) details.push(`- Aislamiento: ${insulation}`)
    if (communication) details.push(`- Comunicación: ${communication}`)
    if (reference) details.push(`- Referencia: ${reference}`)

    const message = `Hola, solicito precio del siguiente artículo: ${name}${
      details.length > 0 ? `\n${details.join("\n")}` : ""
    }`

    params.set("mensaje", message)
    if (productSlug) params.set("interes", productSlug)

    router.push(`/contacto?${params.toString()}`)
  }

  return (
    <div className="w-full my-4 space-y-2">
      {showWarning && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold rounded-lg shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Seleccione una variante</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-5 rounded-lg text-center shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 text-base uppercase tracking-wider cursor-pointer select-none"
      >
        Solicitar Presupuesto Ahora
      </button>
    </div>
  )
}
