"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Wind, ExternalLink, Info } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"

interface Diffuser {
  id: number
  modelo_difusor: string
  referencia: string
  alto: number
  ancho: number
  area_efectiva: number
  coeficiente_kp: number
  product_slug: string | null
  image_url: string | null
  subcategory: string | null // Added subcategory field
}

function calcularPerdidaCarga(difusor: Diffuser, velocidadAire: number, caudal: number): number {
  const modelo = difusor.modelo_difusor.toLowerCase()
  const kp = difusor.coeficiente_kp

  // Type 1: Rejilla, Tobera, Multitobera
  if (modelo.includes("rejilla") || modelo.includes("tobera") || modelo.includes("multitobera")) {
    return (kp * 1.2 * Math.pow(velocidadAire, 2)) / 2
  }

  // Type 3: Compuerta
  if (modelo.includes("compuerta")) {
    const velocidadCalculada = caudal / (3600 * difusor.area_efectiva)
    return kp * 0.5 * 1.2 * Math.pow(velocidadCalculada, 2)
  }

  // Type 2: Difusor lineal, circular, radial, rotacional (default)
  return kp * 1.2 * Math.pow(velocidadAire, 2)
}

function calcularNivelSonoro(caudal: number, perdidaCarga: number): number {
  // Formula: -33 + 10*log(Caudal) + 30*log(Perdida de Carga)
  // Using Math.log10 for base-10 logarithm
  return -33 + 10 * Math.log10(caudal) + 30 * Math.log10(perdidaCarga)
}

export function DiffuserSelector() {
  const [caudal, setCaudal] = useState<string>("")
  const [velocidad, setVelocidad] = useState<string>("")
  const [areaCalculada, setAreaCalculada] = useState<number | null>(null)
  const [resultados, setResultados] = useState<Diffuser[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Rejillas",
    "Rejillas Motor",
    "Difusores Lineales",
    "Difusores Circulares",
    "Difusores Cuadrados",
    "Difusores Rotacionales",
    "Difusores Radiales",
    "Toberas",
    "Multitoberas",
    "Compuertas",
  ])

  const diffuserCategories = [
    "Rejillas",
    "Rejillas Motor",
    "Difusores Lineales",
    "Difusores Circulares",
    "Difusores Cuadrados",
    "Difusores Rotacionales",
    "Difusores Radiales",
  ]

  const otherCategories = ["Toberas", "Multitoberas", "Compuertas"]

  const categories = [...diffuserCategories, ...otherCategories]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const calcularYBuscar = async () => {
    const caudalNum = Number.parseFloat(caudal)
    const velocidadNum = Number.parseFloat(velocidad)

    if (isNaN(caudalNum) || isNaN(velocidadNum) || caudalNum <= 0 || velocidadNum <= 0) {
      alert("Por favor, introduce valores válidos para caudal y velocidad")
      return
    }

    // Calculate effective area: AreaEfectiva = Caudal / (3600 * Velocidad)
    const areaEfectiva = caudalNum / (3600 * velocidadNum)
    setAreaCalculada(areaEfectiva)

    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()

      const { data, error } = await supabase
        .from("diffusers")
        .select("*")
        .in("subcategory", selectedCategories)
        .order("area_efectiva", { ascending: true })

      if (error) {
        console.error("Error fetching diffusers:", error)
        alert("Error al buscar difusores en la base de datos")
        return
      }

      if (!data || data.length === 0) {
        setResultados([])
        return
      }

      const minArea = areaEfectiva * 0.94
      const maxArea = areaEfectiva * 1.06

      const filtered = data.filter((d) => d.area_efectiva >= minArea && d.area_efectiva <= maxArea)

      const sorted = filtered.sort((a, b) => {
        const slugA = (a.product_slug || "").toLowerCase()
        const slugB = (b.product_slug || "").toLowerCase()

        if (slugA !== slugB) {
          return slugA.localeCompare(slugB)
        }

        return a.ancho - b.ancho
      })

      setResultados(sorted)
    } catch (err) {
      console.error("Error:", err)
      alert("Error al procesar la búsqueda")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (areaCalculada !== null && caudal && velocidad) {
      calcularYBuscar()
    }
  }, [selectedCategories])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          <CardTitle className="text-2xl">Cálculo de Difusión</CardTitle>
        </div>
        <CardDescription className="text-base">Calcula la difusión adecuada para tu instalación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side: Input fields */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caudal">Caudal (m³/h)</Label>
              <Input
                id="caudal"
                type="number"
                placeholder="Ej: 500"
                value={caudal}
                onChange={(e) => setCaudal(e.target.value)}
                min="0"
                step="1"
              />
            </div>
            <div className="my-0 py-2 space-y-0.5">
              <Label htmlFor="velocidad">Velocidad del Aire (m/s)</Label>
              <Input
                id="velocidad"
                type="number"
                placeholder="Ej: 2.5"
                value={velocidad}
                onChange={(e) => setVelocidad(e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <Button onClick={calcularYBuscar} disabled={loading} className="w-full py-6 my-6">
              <Wind className="h-4 w-4 mr-2" />
              {loading ? "Calculando..." : "Calcular y Buscar"}
            </Button>
          </div>

          {/* Center: Category filters */}
          <div className="lg:col-span-5 border rounded-lg p-4 bg-gray-50 py-px px-4 my-0">
            <Label className="text-base font-semibold mb-3 block">Filtrar por Categorías</Label>
            <div className="grid grid-cols-2 gap-6">
              {/* Left column: Rejillas and Difusores */}
              <div className="space-y-3">
                {diffuserCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              {/* Right column: Toberas, Multitoberas, Compuertas */}
              <div className="space-y-3">
                {otherCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Image */}
          <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
            <img
              src="/images/design-mode/rejilla%20medidas.png"
              alt="Sistema de difusión de aire"
              className="max-w-xs max-h-64 object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Calculated Area Display */}
        {areaCalculada !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">Área Efectiva Calculada:</p>
            <p className="text-2xl font-bold text-blue-900">{areaCalculada.toFixed(4)} m²</p>
            <p className="text-xs text-blue-600 mt-1">Fórmula: Caudal / (3600 × Velocidad)</p>
          </div>
        )}

        {/* Results Table */}
        {resultados.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Difusores Recomendados</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead className="w-14 text-xs">Imagen</TableHead>
                      <TableHead className="w-20 text-xs">Slug</TableHead>
                      <TableHead className="w-28 text-xs">Modelo</TableHead>
                      <TableHead className="w-24 text-xs">Referencia</TableHead>
                      <TableHead className="text-right w-16 text-xs">Alto (mm)</TableHead>
                      <TableHead className="text-right w-16 text-xs">Ancho (mm)</TableHead>
                      <TableHead className="text-right w-20 text-xs">Área Ef. (m²)</TableHead>
                      <TableHead className="text-right w-20 text-xs">Pérdida (Pa)</TableHead>
                      <TableHead className="text-right w-20 text-xs">Sonoro (dB)</TableHead>
                      <TableHead className="text-center w-24 text-xs">Producto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((difusor) => {
                      const perdidaCarga = calcularPerdidaCarga(
                        difusor,
                        Number.parseFloat(velocidad),
                        Number.parseFloat(caudal),
                      )
                      const nivelSonoro = calcularNivelSonoro(Number.parseFloat(caudal), perdidaCarga)

                      return (
                        <TableRow key={difusor.id}>
                          <TableCell className="p-2">
                            {difusor.image_url ? (
                              <div className="relative w-12 h-12">
                                <Image
                                  src={difusor.image_url || "/placeholder.svg"}
                                  alt={difusor.modelo_difusor}
                                  fill
                                  className="object-cover rounded"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <Wind className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium uppercase text-xs p-2">
                            {difusor.product_slug || "-"}
                          </TableCell>
                          <TableCell className="font-medium text-xs p-2">{difusor.modelo_difusor}</TableCell>
                          <TableCell className="text-xs p-2">{difusor.referencia}</TableCell>
                          <TableCell className="text-right text-xs p-2">{difusor.alto}</TableCell>
                          <TableCell className="text-right text-xs p-2">{difusor.ancho}</TableCell>
                          <TableCell className="text-right text-xs p-2">{difusor.area_efectiva.toFixed(4)}</TableCell>
                          <TableCell className="text-right text-xs p-2">{perdidaCarga.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-xs p-2">{nivelSonoro.toFixed(1)}</TableCell>
                          <TableCell className="text-center p-2">
                            {difusor.product_slug ? (
                              <Link href={`/productos/${difusor.product_slug}`}>
                                <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs h-7 px-2">
                                  Ver
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Informative disclaimer text below the results table */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Los datos mostrados son a modo informativo. Consulte las fichas técnicas para verificar la selección
                correcta de su difusión.
              </p>
            </div>
          </div>
        )}

        {areaCalculada !== null && resultados.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            {selectedCategories.length === 0
              ? "Por favor, selecciona al menos una categoría para ver resultados."
              : "No se encontraron difusores que coincidan con los criterios seleccionados."}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
