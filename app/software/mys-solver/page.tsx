"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, Trash2, ExternalLink, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import dynamic from "next/dynamic"
import Link from "next/link"

const PDFReportGenerator = dynamic(
  () => import("@/components/pdf-report-generator").then((mod) => mod.PDFReportGenerator),
  {
    ssr: false,
    loading: () => (
      <Button disabled size="lg">
        Cargando...
      </Button>
    ),
  },
)

const provincias = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Gerona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "La Coruña",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lérida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Orense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
]

const tiposVivienda = [
  "Unifamiliar",
  "Piso",
  "Duplex",
  "Ático",
  "Bajo",
  "Chalet",
  "Adosado",
  "Local Comercial",
  "Oficina",
]

const tiposAislamiento = [
  { value: "malo", label: "Malo" },
  { value: "medio", label: "Medio" },
  { value: "bueno", label: "Bueno" },
]

const marcasMaquina = [
  "Daikin",
  "Baxi",
  "Fujitsu",
  "Gree",
  "Haier",
  "Hisense",
  "Hitachi",
  "LG",
  "Midea",
  "Kaysun",
  "Mitsubishi Electric",
  "Mitsubishi Heavy",
  "Panasonic",
  "Samsung",
  "Toshiba",
  "Giatsu",
  "Daitsu",
  "Bosch",
  "Airwell",
  "EAS Electric",
  "Ekokai",
  "General Electric",
  "Carrier",
]

const provinciaToZonaClimatica: Record<string, string> = {
  Álava: "D",
  Albacete: "D",
  Alicante: "B",
  Almería: "A",
  Asturias: "C",
  Ávila: "D",
  Badajoz: "C",
  Barcelona: "C",
  Burgos: "D",
  Cáceres: "C",
  Cádiz: "A",
  Cantabria: "C",
  Castellón: "B",
  "Ciudad Real": "C",
  Córdoba: "B",
  Cuenca: "D",
  Gerona: "C",
  Granada: "C",
  Guadalajara: "D",
  Guipúzcoa: "C",
  Huelva: "B",
  Huesca: "D",
  "Islas Baleares": "B",
  Jaén: "C",
  "La Coruña": "C",
  "La Rioja": "D",
  "Las Palmas": "A",
  León: "D",
  Lérida: "D",
  Lugo: "D",
  Madrid: "C",
  Málaga: "A",
  Murcia: "B",
  Navarra: "D",
  Orense: "D",
  Palencia: "D",
  Pontevedra: "C",
  Salamanca: "D",
  "Santa Cruz de Tenerife": "A",
  Segovia: "D",
  Sevilla: "B",
  Soria: "E",
  Tarragona: "C",
  Teruel: "E",
  Toledo: "C",
  Valencia: "B",
  Valladolid: "D",
  Vizcaya: "C",
  Zamora: "D",
  Zaragoza: "D",
}

const cargaTermicaValues: Record<string, Record<string, number>> = {
  A: { malo: 80, medio: 60, bueno: 45 },
  B: { malo: 90, medio: 70, bueno: 50 },
  C: { malo: 100, medio: 75, bueno: 55 },
  D: { malo: 110, medio: 85, bueno: 60 },
  E: { malo: 120, medio: 95, bueno: 70 },
}

interface Diffuser {
  id: number
  modelo_difusor: string
  referencia: string
  area_efectiva: number
  product_slug: string // Changed from slug to product_slug to match database schema
}

interface Room {
  id: string
  nombre: string
  superficie: string
  altura: string
  cargaTermica: string
  velocidadTerminal: string
  difusorSeleccionado: string
}

interface VMCRoom {
  id: string
  tipoLocal: string
}

export default function MySolverPage() {
  const [referencia, setReferencia] = useState("")
  const [provincia, setProvincia] = useState("")
  const [tipoVivienda, setTipoVivienda] = useState("")
  const [tipoAislamiento, setTipoAislamiento] = useState("")
  const [cliente, setCliente] = useState("")
  const [fecha, setFecha] = useState<Date>(new Date())

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      nombre: "",
      superficie: "",
      altura: "2.5",
      cargaTermica: "",
      velocidadTerminal: "3.0",
      difusorSeleccionado: "",
    },
  ])

  const [marcaMaquina, setMarcaMaquina] = useState("")
  const [modeloMaquina, setModeloMaquina] = useState("")
  const [potenciaEquipo, setPotenciaEquipo] = useState("")
  const [caudalMaquina, setCaudalMaquina] = useState("")

  const [roomDiffusers, setRoomDiffusers] = useState<Record<string, Diffuser[]>>({})

  const [usandoMarcaPersonalizada, setUsandoMarcaPersonalizada] = useState(false)

  const [mostrarVMC, setMostrarVMC] = useState(false)
  const [vmcRooms, setVmcRooms] = useState<VMCRoom[]>([])

  const getDefaultCargaTermica = (): string => {
    if (!provincia || !tipoAislamiento) return ""

    const zonaClimatica = provinciaToZonaClimatica[provincia]
    if (!zonaClimatica) return ""

    const cargaTermica = cargaTermicaValues[zonaClimatica]?.[tipoAislamiento]
    return cargaTermica ? cargaTermica.toString() : ""
  }

  useEffect(() => {
    const defaultCarga = getDefaultCargaTermica()
    if (defaultCarga) {
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          cargaTermica: defaultCarga,
        })),
      )
    }
  }, [provincia, tipoAislamiento])

  useEffect(() => {
    const updateDiffusersForRooms = async () => {
      const newRoomDiffusers: Record<string, Diffuser[]> = {}

      for (const room of rooms) {
        const areaEfectiva = calcularAreaEfectiva(room)
        if (areaEfectiva > 0) {
          const diffusers = await fetchClosestDiffusers(areaEfectiva)
          newRoomDiffusers[room.id] = diffusers
        } else {
          newRoomDiffusers[room.id] = []
        }
      }

      setRoomDiffusers(newRoomDiffusers)
    }

    updateDiffusersForRooms()
  }, [rooms.map((r) => `${r.id}-${r.superficie}-${r.cargaTermica}-${r.velocidadTerminal}-${caudalMaquina}`).join(",")])

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      nombre: "",
      superficie: "",
      altura: "2.5",
      cargaTermica: getDefaultCargaTermica(),
      velocidadTerminal: "3.0",
      difusorSeleccionado: "",
    }
    setRooms([...rooms, newRoom])
  }

  const removeRoom = (id: string) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((room) => room.id !== id))
    }
  }

  const updateRoom = (id: string, field: keyof Room, value: string) => {
    setRooms(rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room)))
  }

  const calcularCargaTermicaTotal = (): number => {
    return rooms.reduce((total, room) => {
      if (room.superficie && room.cargaTermica) {
        return total + Number.parseFloat(room.superficie) * Number.parseFloat(room.cargaTermica)
      }
      return total
    }, 0)
  }

  const calcularCaudalEstancia = (room: Room): number => {
    if (!caudalMaquina || !room.superficie || !room.cargaTermica) return 0

    const cargaTermicaEstancia = Number.parseFloat(room.superficie) * Number.parseFloat(room.cargaTermica)
    const cargaTermicaTotal = calcularCargaTermicaTotal()

    if (cargaTermicaTotal === 0) return 0

    const porcentaje = cargaTermicaEstancia / cargaTermicaTotal
    return porcentaje * Number.parseFloat(caudalMaquina)
  }

  const calcularAreaEfectiva = (room: Room): number => {
    const caudalEstancia = calcularCaudalEstancia(room)
    if (!caudalEstancia || !room.velocidadTerminal) return 0

    const velocidad = Number.parseFloat(room.velocidadTerminal)
    if (velocidad === 0) return 0

    return caudalEstancia / (3600 * velocidad)
  }

  const fetchClosestDiffusers = async (areaEfectiva: number): Promise<Diffuser[]> => {
    if (areaEfectiva <= 0) return []

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error } = await supabase
        .from("diffusers")
        .select("id, modelo_difusor, referencia, area_efectiva, product_slug")
        .order("area_efectiva", { ascending: true })

      if (error || !data) {
        console.error("Error fetching diffusers:", error)
        return []
      }

      const rangeMin = areaEfectiva * 0.96 // -4%
      const rangeMax = areaEfectiva * 1.04 // +4%

      const filtered = data
        .filter((d) => d.area_efectiva >= rangeMin && d.area_efectiva <= rangeMax)
        .sort((a, b) => {
          const slugA = a.product_slug || ""
          const slugB = b.product_slug || ""

          if (slugA !== slugB) {
            return slugA.localeCompare(slugB)
          }

          const anchoA = Number.parseInt(a.referencia.split("-")[1] || "0", 10)
          const anchoB = Number.parseInt(b.referencia.split("-")[1] || "0", 10)

          return anchoA - anchoB
        })

      return filtered
    } catch (err) {
      console.error("Error:", err)
      return []
    }
  }

  const detectarTipoLocal = (nombre: string): string => {
    const nombreLower = nombre.toLowerCase().trim()

    // Dormitorio Principal
    if (
      nombreLower.includes("dormitorio principal") ||
      nombreLower.includes("dormitorio matrimonio") ||
      nombreLower.includes("suite") ||
      nombreLower.includes("master")
    ) {
      return "Dormitorio Principal"
    }

    // Cocina
    if (nombreLower.includes("cocina")) {
      return "Cocina"
    }

    // Aseo (debe ir antes de Baño para detectar correctamente)
    if (nombreLower.includes("aseo")) {
      return "Aseo"
    }

    // Baño
    if (nombreLower.includes("baño") || nombreLower.includes("wc")) {
      return "Baño"
    }

    // Lavadero
    if (nombreLower.includes("lavadero") || nombreLower.includes("lavandería")) {
      return "Lavadero"
    }

    // Salón/Comedor/Despacho
    if (
      nombreLower.includes("salón") ||
      nombreLower.includes("salon") ||
      nombreLower.includes("comedor") ||
      nombreLower.includes("despacho") ||
      nombreLower.includes("sala") ||
      nombreLower.includes("living") ||
      nombreLower.includes("estar")
    ) {
      return "Salón/Comedor/Despacho"
    }

    // Dormitorio secundario (debe ir después de dormitorio principal)
    if (
      nombreLower.includes("dormitorio") ||
      nombreLower.includes("habitación") ||
      nombreLower.includes("habitacion")
    ) {
      return "Dormitorio secundario"
    }

    // Default
    return "Salón/Comedor/Despacho"
  }

  useEffect(() => {
    setVmcRooms((prevVmcRooms) => {
      return rooms.map((room) => {
        const existingVmcRoom = prevVmcRooms.find((vr) => vr.id === room.id)
        if (existingVmcRoom) {
          const currentRoom = rooms.find((r) => r.id === room.id)
          if (currentRoom && currentRoom.nombre !== room.nombre) {
            return {
              id: room.id,
              tipoLocal: detectarTipoLocal(room.nombre),
            }
          }
          return existingVmcRoom
        }
        return {
          id: room.id,
          tipoLocal: detectarTipoLocal(room.nombre),
        }
      })
    })
  }, [rooms.map((r) => `${r.id}-${r.nombre}`).join(",")])

  const updateVmcRoomTipoLocal = (id: string, tipoLocal: string) => {
    setVmcRooms((prevVmcRooms) =>
      prevVmcRooms.map((vmcRoom) => (vmcRoom.id === id ? { ...vmcRoom, tipoLocal } : vmcRoom)),
    )
  }

  const getVMCData = (tipoLocal: string) => {
    return vmcCaudalConfig[tipoLocal] || { caudal: 0, tipo: "Impulsión" as const }
  }

  const calcularCaudalImpulsion = (): number => {
    return vmcRooms.reduce((total, vmcRoom) => {
      const vmcData = getVMCData(vmcRoom.tipoLocal)
      return vmcData.tipo === "Impulsión" ? total + vmcData.caudal : total
    }, 0)
  }

  const calcularCaudalExtraccion = (): number => {
    return vmcRooms.reduce((total, vmcRoom) => {
      const vmcData = getVMCData(vmcRoom.tipoLocal)
      return vmcData.tipo === "Extracción" ? total + vmcData.caudal : total
    }, 0)
  }

  const calcularCaudalPromedio = (): number => {
    const impulsion = calcularCaudalImpulsion()
    const extraccion = calcularCaudalExtraccion()
    return (impulsion + extraccion) / 2
  }

  const obtenerEquipoRecomendado = (): string => {
    const promedio = calcularCaudalPromedio()
    if (promedio < 150) return "INC150A"
    if (promedio >= 150 && promedio < 250) return "INC250A"
    return "INC500A"
  }

  const obtenerSlugProducto = (equipo: string): string => {
    const slugMap: Record<string, string> = {
      INC150A: "inc150a",
      INC250A: "inc250a",
      INC500A: "inc500a",
    }
    return slugMap[equipo] || "inc150a"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">MYS Solver 2.0</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto text-pretty">
              Herramienta profesional de cálculo para instalaciones climáticas
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Datos de Instalación - Takes 8 columns */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Datos de la Instalación</CardTitle>
                <CardDescription>Complete los datos básicos del proyecto para comenzar el cálculo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Referencia Instalación */}
                  <div className="space-y-2">
                    <Label htmlFor="referencia" className="text-xs">
                      Referencia Instalación
                    </Label>
                    <Input
                      id="referencia"
                      className="text-xs"
                      placeholder="Ej: INST-2025-001"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </div>

                  {/* Provincia */}
                  <div className="space-y-2">
                    <Label htmlFor="provincia" className="text-xs">
                      Provincia
                    </Label>
                    <Select value={provincia} onValueChange={setProvincia}>
                      <SelectTrigger id="provincia" className="text-xs">
                        <SelectValue placeholder="Selecciona una provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {provincias.map((prov) => (
                          <SelectItem key={prov} value={prov}>
                            {prov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Vivienda */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo-vivienda" className="text-xs">
                      Tipo de Vivienda
                    </Label>
                    <Select value={tipoVivienda} onValueChange={setTipoVivienda}>
                      <SelectTrigger id="tipo-vivienda" className="text-xs">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposVivienda.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo-aislamiento" className="text-xs">
                      Tipo de Aislamiento
                    </Label>
                    <Select value={tipoAislamiento} onValueChange={setTipoAislamiento}>
                      <SelectTrigger id="tipo-aislamiento" className="text-xs">
                        <SelectValue placeholder="Selecciona el aislamiento" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposAislamiento.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cliente */}
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-xs">
                      Cliente
                    </Label>
                    <Input
                      id="cliente"
                      className="text-xs"
                      placeholder="Nombre del cliente"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                    />
                  </div>

                  {/* Fecha */}
                  <div className="space-y-2">
                    <Label className="text-xs">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent text-xs"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fecha ? format(fecha, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fecha}
                          onSelect={(date) => date && setFecha(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen y Equipo - Takes 4 columns */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-lg my-[-7px]">Resumen y Equipo</CardTitle>
                <CardDescription className="text-xs">Datos del sistema de climatización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0 my-[-7.5px]">
                {/* Total Carga Térmica */}
                <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200 py-0">
                  <Label className="text-[9px] text-blue-700 font-medium">Carga Térmica Total</Label>
                  <div className="text-lg font-bold text-blue-900 my-[-2px]">
                    {calcularCargaTermicaTotal().toFixed(0)} W
                  </div>
                  <div className="text-[9px] text-blue-600">{(calcularCargaTermicaTotal() / 1000).toFixed(2)} kW</div>
                </div>

                {/* Marca Máquina */}
                <div className="space-y-0.5">
                  <Label htmlFor="marca-maquina" className="text-[10px]">
                    Marca Máquina A/C
                  </Label>
                  {!usandoMarcaPersonalizada ? (
                    <Select
                      value={marcaMaquina}
                      onValueChange={(value) => {
                        if (value === "otra") {
                          setUsandoMarcaPersonalizada(true)
                          setMarcaMaquina("")
                        } else {
                          setMarcaMaquina(value)
                        }
                      }}
                    >
                      <SelectTrigger id="marca-maquina" className="text-xs h-7">
                        <SelectValue placeholder="Selecciona una marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcasMaquina.map((marca) => (
                          <SelectItem key={marca} value={marca} className="text-xs">
                            {marca}
                          </SelectItem>
                        ))}
                        <SelectItem value="otra" className="text-xs font-medium text-blue-600">
                          Otra marca...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex gap-1">
                      <Input
                        id="marca-maquina"
                        className="text-xs h-7"
                        placeholder="Escribe la marca..."
                        value={marcaMaquina}
                        onChange={(e) => setMarcaMaquina(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs bg-transparent"
                        onClick={() => {
                          setUsandoMarcaPersonalizada(false)
                          setMarcaMaquina("")
                        }}
                      >
                        ↩
                      </Button>
                    </div>
                  )}
                </div>

                {/* Modelo Máquina */}
                <div className="space-y-0.5">
                  <Label htmlFor="modelo-maquina" className="text-[10px]">
                    Modelo Máquina A/C
                  </Label>
                  <Input
                    id="modelo-maquina"
                    className="text-xs h-7"
                    placeholder="Ej: FTXM35N"
                    value={modeloMaquina}
                    onChange={(e) => setModeloMaquina(e.target.value)}
                  />
                </div>

                {/* Potencia Equipo */}
                <div className="space-y-0.5">
                  <Label htmlFor="potencia-equipo" className="text-[10px]">
                    Potencia Equipo (kW)
                  </Label>
                  <Input
                    id="potencia-equipo"
                    className="text-xs h-7"
                    type="number"
                    placeholder="0"
                    value={potenciaEquipo}
                    onChange={(e) => setPotenciaEquipo(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Caudal Máquina */}
                <div className="space-y-0.5">
                  <Label htmlFor="caudal-maquina" className="text-[10px]">
                    Caudal Máquina (m³/h)
                  </Label>
                  <Input
                    id="caudal-maquina"
                    className="text-xs h-7"
                    type="number"
                    placeholder="0"
                    value={caudalMaquina}
                    onChange={(e) => setCaudalMaquina(e.target.value)}
                    min="0"
                    step="1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-2xl">Estancias de la Vivienda</CardTitle>
              <CardDescription>Añade las estancias con su superficie y altura</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-[18%] p-2">Estancia</TableHead>
                    <TableHead className="w-[7%] p-2">{"Superficie (m²)"}</TableHead>
                    <TableHead className="w-[6%] p-2">Altura (m)</TableHead>
                    <TableHead className="w-[8%] p-2">Carga Térmica (W/m²)</TableHead>
                    <TableHead className="w-[9%] p-2">Carga Térmica Total (W)</TableHead>
                    <TableHead className="w-[8%] p-2">Caudal (m³/h)</TableHead>
                    <TableHead className="w-[8%] p-2">Vel. Salida Aire (m/s)</TableHead>
                    <TableHead className="w-[16%] p-2">Impulsión</TableHead>
                    <TableHead className="w-[5%] p-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id} className="text-xs">
                      <TableCell className="p-1">
                        <Input
                          className="h-8 text-xs"
                          placeholder="Ej: Salón..."
                          value={room.nombre}
                          onChange={(e) => updateRoom(room.id, "nombre", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 text-xs text-center"
                          type="number"
                          placeholder="0"
                          value={room.superficie}
                          onChange={(e) => updateRoom(room.id, "superficie", e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="2.5"
                          value={room.altura}
                          onChange={(e) => updateRoom(room.id, "altura", e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 text-xs text-center"
                          type="number"
                          placeholder="0"
                          value={room.cargaTermica}
                          onChange={(e) => updateRoom(room.id, "cargaTermica", e.target.value)}
                          min="0"
                          step="1"
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="px-2 py-1 rounded text-center font-medium text-xs bg-blue-50 text-blue-900">
                          {room.superficie && room.cargaTermica
                            ? (Number.parseFloat(room.superficie) * Number.parseFloat(room.cargaTermica)).toFixed(0)
                            : "0"}
                        </div>
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="px-2 py-1 bg-blue-50 rounded text-center font-medium text-blue-900 text-xs">
                          {calcularCaudalEstancia(room).toFixed(1)}
                        </div>
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 text-xs text-center"
                          type="number"
                          placeholder="3.0"
                          value={room.velocidadTerminal}
                          onChange={(e) => updateRoom(room.id, "velocidadTerminal", e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Select
                          value={room.difusorSeleccionado}
                          onValueChange={(value) => updateRoom(room.id, "difusorSeleccionado", value)}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-[10px]">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            {roomDiffusers[room.id]?.length > 0 ? (
                              roomDiffusers[room.id].map((diffuser) => (
                                <SelectItem key={diffuser.id} value={diffuser.id.toString()} className="text-xs">
                                  {diffuser.modelo_difusor} - {diffuser.referencia} ({diffuser.area_efectiva.toFixed(4)}{" "}
                                  m²)
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled className="text-xs">
                                No disponible
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoom(room.id)}
                          disabled={rooms.length === 1}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Button onClick={addRoom} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Estancia
              </Button>
              <PDFReportGenerator
                referencia={referencia}
                provincia={provincia}
                tipoVivienda={tipoVivienda}
                tipoAislamiento={tipoAislamiento}
                cliente={cliente}
                fecha={fecha}
                rooms={rooms}
                marcaMaquina={marcaMaquina}
                modeloMaquina={modeloMaquina}
                potenciaEquipo={potenciaEquipo}
                caudalMaquina={caudalMaquina}
                cargaTermicaTotal={calcularCargaTermicaTotal()}
              />
            </div>
          </CardContent>
        </Card>

        {/* VMC Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Cálculo VMC (Ventilación Mecánica Controlada)</CardTitle>
                <CardDescription>Calcula la ventilación necesaria para cada estancia</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="vmc-toggle" className="text-sm font-medium cursor-pointer">
                  {mostrarVMC ? "Ocultar VMC" : "Mostrar VMC"}
                </Label>
                <Switch id="vmc-toggle" checked={mostrarVMC} onCheckedChange={setMostrarVMC} />
              </div>
            </div>
          </CardHeader>
          {mostrarVMC && (
            <CardContent className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="w-[25%] p-2">Estancia</TableHead>
                      <TableHead className="w-[20%] p-2">Tipo de Local</TableHead>
                      <TableHead className="w-[15%] p-2">Superficie (m²)</TableHead>
                      <TableHead className="w-[20%] p-2">Caudal de renovación (m³/h)</TableHead>
                      <TableHead className="w-[20%] p-2">Impulsión/Extracción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.map((room) => {
                      const vmcRoom = vmcRooms.find((vr) => vr.id === room.id)
                      const vmcData = getVMCData(vmcRoom?.tipoLocal || "")
                      return (
                        <TableRow key={room.id} className="text-xs">
                          <TableCell className="p-2">
                            <div className="px-3 py-2 text-sm">{room.nombre || "Sin nombre"}</div>
                          </TableCell>
                          <TableCell className="p-2">
                            <Select
                              value={vmcRoom?.tipoLocal || ""}
                              onValueChange={(value) => updateVmcRoomTipoLocal(room.id, value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposLocal.map((tipo) => (
                                  <SelectItem key={tipo} value={tipo} className="text-xs">
                                    {tipo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="px-3 py-2 text-sm text-center font-medium">{room.superficie || "0"} m²</div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="px-3 py-2 text-sm text-center font-medium bg-green-50 text-green-900 rounded">
                              {vmcData.caudal} m³/h
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div
                              className={`px-3 py-2 text-sm text-center font-medium rounded ${
                                vmcData.tipo === "Impulsión"
                                  ? "bg-blue-50 text-blue-900"
                                  : "bg-orange-50 text-orange-900"
                              }`}
                            >
                              {vmcData.tipo}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              {rooms.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay estancias añadidas. Añade estancias en la sección superior para calcular la VMC.
                </div>
              )}

              {rooms.length > 0 && (
                <div className="space-y-6 mt-8">
                  {/* Resumen de Caudales */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resumen VMC</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-[-50px] my-[-80px]">
                      {/* Caudal Total Impulsión */}
                      <Card className="bg-blue-50 border-blue-200 my-[100px]">
                        <CardContent className="p-4">
                          <div className="text-xs text-blue-700 font-medium mb-1">Caudal Total Impulsión</div>
                          <div className="text-2xl font-bold text-blue-900">{calcularCaudalImpulsion()} m³/h</div>
                        </CardContent>
                      </Card>

                      {/* Caudal Total Extracción */}
                      <Card className="bg-blue-50 border-blue-200 my-[100px]">
                        <CardContent className="p-4">
                          <div className="text-xs text-orange-700 font-medium mb-1">Caudal Total Extracción</div>
                          <div className="text-2xl font-bold text-orange-900">{calcularCaudalExtraccion()} m³/h</div>
                        </CardContent>
                      </Card>

                      {/* Caudal Promediado */}
                      <Card className="bg-green-50 border-green-200 my-[100px]">
                        <CardContent className="p-4">
                          <div className="text-xs text-green-700 font-medium mb-1">Caudal Promediado</div>
                          <div className="text-2xl font-bold text-green-900">
                            {calcularCaudalPromedio().toFixed(1)} m³/h
                          </div>
                        </CardContent>
                      </Card>

                      {/* Equipo Recomendado */}
                      <Card className="bg-purple-50 border-purple-200 my-[100px]">
                        <CardContent className="p-4">
                          <div className="text-xs text-purple-700 font-medium mb-1">Equipo Recomendado</div>
                          <div className="text-2xl font-bold text-purple-900 mb-2">{obtenerEquipoRecomendado()}</div>
                          <Link href={`/productos/${obtenerSlugProducto(obtenerEquipoRecomendado())}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs h-7 bg-white hover:bg-purple-50"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver Producto
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Datos Informativos */}
                  <Card className="bg-gray-50 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-base">Datos Informativos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Cálculo según <span className="font-semibold">Documento Básico HS 3 del CTE (DB-HS 3)</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Doble flujo con recuperación <span className="font-semibold">≥ 70%</span> (CTE HE 1)
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Ruido: <span className="font-semibold">≤ 30 dB(A)</span> en dormitorios
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* VMC report generation buttons */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                      <FileText className="h-4 w-4" />
                      Generar Informe VMC
                    </Button>
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-card"
                    >
                      <FileText className="h-4 w-4" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-file-text h-4 w-4"
                      >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                      Generar Informe VMC + Climatización
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  )
}

const tiposLocal = [
  "Dormitorio Principal",
  "Dormitorio secundario",
  "Salón/Comedor/Despacho",
  "Cocina",
  "Baño",
  "Aseo",
  "Lavadero",
]

const vmcCaudalConfig: Record<
  string,
  {
    caudal: number
    tipo: "Impulsión" | "Extracción"
  }
> = {
  "Salón/Comedor/Despacho": { caudal: 40, tipo: "Impulsión" },
  "Dormitorio Principal": { caudal: 30, tipo: "Impulsión" },
  "Dormitorio secundario": { caudal: 20, tipo: "Impulsión" },
  Cocina: { caudal: 50, tipo: "Extracción" },
  Baño: { caudal: 25, tipo: "Extracción" },
  Aseo: { caudal: 15, tipo: "Extracción" },
  Lavadero: { caudal: 15, tipo: "Extracción" },
}
