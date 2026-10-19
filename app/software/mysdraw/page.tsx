"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Flame,
  Wind,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  Play,
  Sparkles,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Tablet,
  Laptop,
  ShieldCheck,
  FileSpreadsheet,
  Calculator,
  ArrowRight,
  Video,
  Award,
  BookOpen,
} from "lucide-react"

export default function MysDrawLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const tutorials = [
    {
      id: "tut-1",
      title: "Introducción y Primeros Pasos en MYSDRAW Online",
      description: "Aprende a registrarte gratis, crear un nuevo proyecto e introducir los parámetros iniciales de la vivienda o local comercial.",
      duration: "04:30 min",
      category: "Básico",
      badgeColor: "bg-blue-100 text-blue-800",
      youtubeUrl: "https://www.youtube.com/@mysair/featured",
    },
    {
      id: "tut-2",
      title: "Cálculo de Suelo Radiante y Refrescante (UNE-EN 1264)",
      description: "Configuración paso a paso de potencias térmicas, circuitos, dimensionado de colectores y separación de tubos según normativa.",
      duration: "08:15 min",
      category: "Suelo Radiante",
      badgeColor: "bg-amber-100 text-amber-800",
      youtubeUrl: "https://www.youtube.com/@mysair/featured",
    },
    {
      id: "tut-3",
      title: "Diseño de Red de Conductos y Selección de Difusión",
      description: "Dimensionado automático según caudales, cargas térmicas por estancia y selección directa de difusores y rejillas del catálogo MYSAir.",
      duration: "07:45 min",
      category: "Conductos",
      badgeColor: "bg-cyan-100 text-cyan-800",
      youtubeUrl: "https://www.youtube.com/@mysair/featured",
    },
    {
      id: "tut-4",
      title: "Instalaciones VMC con Recuperación de Calor (CTE DB-HS3)",
      description: "Cálculo de caudales mínimos por locales secos/húmedos, diseño de ramales de impulsión y extracción, y lista de material requerida.",
      duration: "06:20 min",
      category: "VMC",
      badgeColor: "bg-emerald-100 text-emerald-800",
      youtubeUrl: "https://www.youtube.com/@mysair/featured",
    },
    {
      id: "tut-5",
      title: "Generación de Informes Técnicos en PDF y Presupuesto PVP",
      description: "Cómo exportar el informe completo con planos zonificados, tablas de tramos, fichas técnicas y presupuesto de materiales al instante.",
      duration: "05:10 min",
      category: "Informes",
      badgeColor: "bg-purple-100 text-purple-800",
      youtubeUrl: "https://www.youtube.com/@mysair/featured",
    },
  ]

  const faqs = [
    {
      q: "¿MYSDRAW Online es totalmente gratuito?",
      a: "Sí, el acceso y registro a MYSDRAW Online es 100% gratuito para ingenierías, instaladores y profesionales del sector HVAC. No requiere tarjeta de crédito ni periodos de prueba limitados.",
    },
    {
      q: "¿Necesito instalar algún programa en mi ordenador?",
      a: "No. MYSDRAW Online funciona 100% en la nube desde cualquier navegador web moderno (Chrome, Edge, Firefox, Safari). Olvídate de instalar software pesado o gestionar licencias por equipo.",
    },
    {
      q: "¿Puedo utilizarlo desde una tablet o en obra?",
      a: "Sí, MYSDRAW Online está completamente adaptado para tablets y dispositivos táctiles. Esto te permite revisar planos, ajustar cálculos o mostrar el proyecto a tu cliente tanto en la oficina como en la propia obra.",
    },
    {
      q: "¿Qué normativas técnicas aplica el software en sus cálculos?",
      a: "El software incorpora los estándares normativos vigentes: la norma UNE-EN 1264 para el cálculo y dimensionado de suelos radiantes y refrescantes, y el Código Técnico de la Edificación (CTE DB-HS3) para el cálculo de caudales mínimos de ventilación mecánica controlada (VMC).",
    },
    {
      q: "¿Qué tipo de informe genera el programa?",
      a: "Genera automáticamente un dossier técnico completo en formato PDF listo para entregar. Incluye: dimensionado general de la instalación, planos con carga térmica por zona y caudal asignado, tablas de dimensionado por tramos, fichas técnicas oficiales de los componentes MYSAir y presupuesto PVP desglosado.",
    },
    {
      q: "¿Dónde puedo ver los videotutoriales de formación?",
      a: "Disponemos de una serie de videotutoriales paso a paso accesibles en esta misma página y en el canal oficial de YouTube de MYSAir (@mysair). Te guiarán desde el registro inicial hasta el cálculo de proyectos complejos.",
    },
    {
      q: "¿Cómo empiezo a utilizar MYSDRAW Online?",
      a: "Solo tienes que hacer clic en los botones de registro gratuito o acceder a www.mysdraw.es, crear tu cuenta en menos de 1 minuto y comenzar a diseñar tu primer proyecto de climatización, suelo radiante o VMC.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background decorative grid & glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-medium backdrop-blur-md shadow-inner animate-pulse">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Nuevas funcionalidades: Suelo Radiante UNE-EN 1264 & VMC DB-HS3</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Diseña, Calcula y Presupuesta tus Instalaciones HVAC con{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                MYSDRAW Online
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              El software <strong>100% en la nube y gratuito</strong> para ingenierías e instaladores.
              Centraliza el cálculo de redes de conductos, suelo radiante/refrescante y ventilación VMC en una sola herramienta ágil, sin descargas y accesible desde PC o tablet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 px-8 py-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                  <span>Registrarse Gratis y Empezar</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200 px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <a href="#videotutoriales">
                  <Play className="mr-2 h-4 w-4 text-cyan-400 fill-cyan-400/20" />
                  <span>Ver Videotutoriales</span>
                </a>
              </Button>
            </div>

            {/* Value Checkmarks */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Online y Gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Sin descargas ni instalaciones</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Compatible con Tablets (Oficina y Obra)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Normas UNE-EN 1264 & CTE DB-HS3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Informes PDF con Presupuesto PVP</span>
              </div>
            </div>
          </div>

          {/* Interactive Software Mockup / Preview Showcase */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-slate-900/60 shadow-2xl backdrop-blur-xl border border-blue-500/30">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                {/* Window Top Bar */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-3 text-xs font-medium text-slate-400 hidden sm:inline-block">
                      https://www.mysdraw.es — Panel de Diseño & Cálculo HVAC
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                      En Línea (Cloud v2.0)
                    </Badge>
                  </div>
                </div>

                {/* Simulated App Workspace */}
                <div className="p-4 sm:p-6 bg-slate-900/90 space-y-6">
                  {/* Workspace Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-left">
                      <span className="text-[11px] text-slate-400 block font-medium">Instalación Climatización</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        Red de Conductos
                      </span>
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-left">
                      <span className="text-[11px] text-slate-400 block font-medium">Suelo Radiante / Refrescante</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        UNE-EN 1264
                      </span>
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3 text-left">
                      <span className="text-[11px] text-slate-400 block font-medium">Ventilación Mecánica VMC</span>
                      <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        CTE DB-HS3
                      </span>
                    </div>
                    <div className="bg-blue-900/40 border border-blue-600/40 rounded-lg p-3 text-left">
                      <span className="text-[11px] text-blue-300 block font-medium">Documentación Oficial</span>
                      <span className="text-sm font-bold text-blue-200 flex items-center gap-1 mt-0.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        Informe & Presupuesto
                      </span>
                    </div>
                  </div>

                  {/* Visual Blueprint / Layout Representation */}
                  <div className="relative rounded-xl border border-slate-700 bg-slate-950 p-4 sm:p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf810_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left: Zone & Thermal Load */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 sm:p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Zonificación & Cargas
                          </span>
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                            Cálculo Activo
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between p-2 rounded bg-slate-800/60 border border-slate-700/50">
                            <span className="text-slate-300 font-medium">Salón-Comedor (32 m²)</span>
                            <span className="font-bold text-amber-400">2.720 W | 410 m³/h</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-slate-800/60 border border-slate-700/50">
                            <span className="text-slate-300 font-medium">Dormitorio Ppal (16 m²)</span>
                            <span className="font-bold text-amber-400">1.280 W | 195 m³/h</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-slate-800/60 border border-slate-700/50">
                            <span className="text-slate-300 font-medium">Dormitorios 2 y 3 (24 m²)</span>
                            <span className="font-bold text-amber-400">1.920 W | 290 m³/h</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Potencia Total Req:</span>
                          <span className="text-sm font-extrabold text-blue-400">5.92 kW</span>
                        </div>
                      </div>

                      {/* Center: System Diagram / Pipe & Duct View */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 sm:p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                              Dimensionado de Tramos
                            </span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                              UNE-EN 1264 OK
                            </span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="p-2 rounded bg-blue-950/40 border border-blue-900/60">
                              <div className="flex justify-between text-blue-200 font-medium">
                                <span>Colector Suelo Radiante</span>
                                <span>6 Circuitos</span>
                              </div>
                              <span className="text-[11px] text-slate-400">Paso tubo: 15 cm | L. total: 412 m</span>
                            </div>
                            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-900/60">
                              <div className="flex justify-between text-cyan-200 font-medium">
                                <span>Red Conductos Climatización</span>
                                <span>Caudal: 895 m³/h</span>
                              </div>
                              <span className="text-[11px] text-slate-400">Compuertas motorizadas + Difusión MYSAir</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 rounded bg-emerald-950/40 border border-emerald-900/60 text-xs">
                          <div className="flex justify-between text-emerald-200 font-medium">
                            <span>VMC Recuperador CTE DB-HS3</span>
                            <span>INC150A (150 m³/h)</span>
                          </div>
                          <span className="text-[11px] text-slate-400">Equilibrado de caudales secos/húmedos</span>
                        </div>
                      </div>

                      {/* Right: Instant PDF & PVP Summary */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 sm:p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                              Dossier & Presupuesto
                            </span>
                            <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                              Listo en 1 clic
                            </span>
                          </div>
                          <div className="space-y-2 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Planos con carga y caudales</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Tablas de tramos y tuberías</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Fichas técnicas y homologaciones</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Presupuesto PVP desglosado</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800">
                          <a
                            href="https://www.mysdraw.es"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                          >
                            <span>Abrir Programa en www.mysdraw.es</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Metrics / Highlights Bar */}
      <section className="bg-white border-b border-slate-200 py-10 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">-70% Tiempo</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Menos tiempo de cálculo y dimensionado en cada proyecto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Normativa</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Cálculo preciso según normas UNE-EN 1264 y CTE DB-HS3.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex-shrink-0">
                <Tablet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">100% Online</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Sin descargas. Accesible desde PC, Mac y tablet en obra.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">0€ Gratuito</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Acceso completo sin coste de licencia para profesionales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features & Capabilities Section */}
      <section id="funcionalidades" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-3 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-blue-200">
              Funcionalidades de MYSDRAW Online
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Una Solución Integral para el Diseño de Instalaciones HVAC
            </h2>
            <p className="text-lg text-slate-600 mt-4 leading-relaxed">
              MYSDRAW continúa evolucionando para ofrecer la herramienta más completa del mercado.
              Diseña, calcula y genera informes técnicos normativos desde una única pantalla.
            </p>
          </div>

          {/* Feature Tabs */}
          <Tabs defaultValue="suelo-radiante" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-slate-200/80 p-1.5 rounded-xl border border-slate-300 max-w-3xl w-full grid grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger
                  value="suelo-radiante"
                  className="py-3 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                >
                  <Flame className="w-4 h-4 mr-1.5 text-amber-500" />
                  Suelo Radiante
                </TabsTrigger>
                <TabsTrigger
                  value="conductos"
                  className="py-3 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                >
                  <Wind className="w-4 h-4 mr-1.5 text-cyan-500" />
                  Red de Conductos
                </TabsTrigger>
                <TabsTrigger
                  value="vmc"
                  className="py-3 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                >
                  <Layers className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Ventilación VMC
                </TabsTrigger>
                <TabsTrigger
                  value="informes"
                  className="py-3 text-xs sm:text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                >
                  <FileText className="w-4 h-4 mr-1.5 text-purple-500" />
                  Informes & PDF
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Suelo Radiante UNE-EN 1264 */}
            <TabsContent value="suelo-radiante" className="focus:outline-none">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                    <Flame className="w-4 h-4 text-amber-600" />
                    Norma UNE-EN 1264
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    Cálculo y Dimensionado de Suelo Radiante y Refrescante
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Diseña sistemas de calefacción y refrigeración radiante garantizando el confort térmico y el cumplimiento estricto de la norma <strong>UNE-EN 1264</strong>. Obtén automáticamente todos los datos clave para el replanteo y montaje:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Potencia térmica:</strong> Cálculo exacto en calefacción y refrigeración por estancia.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Caudales de circuito:</strong> Caudal necesario para el equilibrado hidráulico perfecto.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Número de circuitos:</strong> Determinación óptima de lazos para no superar caídas de presión.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Longitudes de tubería:</strong> Metraje exacto por circuito para minimizar retales en obra.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensionado de colectores:</strong> Selección del número de vías y equilibrado por zona.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Paso entre tubos:</strong> Distancia óptima entre tuberías según tipo de solera y carga.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
                      <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                        Calcular Suelo Radiante Ahora
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <span className="text-xs text-slate-500">Incluye información técnica lista para el desarrollo del proyecto</span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <span className="text-xs font-bold text-amber-900 uppercase">Resumen de Circuito Radiante</span>
                    <Badge variant="outline" className="text-amber-800 border-amber-400 bg-amber-100">
                      UNE-EN 1264
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Potencia Calefacción Total</span>
                      <span className="text-sm font-bold text-amber-600">6.48 kW</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Potencia Refrigeración Total</span>
                      <span className="text-sm font-bold text-blue-600">4.92 kW</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Colectores de Distribución</span>
                      <span className="text-sm font-bold text-slate-900">2 Colectores (7 + 5 vías)</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Longitud Total de Tubería</span>
                      <span className="text-sm font-bold text-slate-900">745 metros</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Paso de Tubo Habitual</span>
                      <span className="text-sm font-bold text-slate-900">10 / 15 / 20 cm</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
                    💡 Todos los datos se transfieren automáticamente a la memoria técnica y al presupuesto de colectores y accesorios.
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Red de Conductos y Climatización */}
            <TabsContent value="conductos" className="focus:outline-none">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200">
                    <Wind className="w-4 h-4 text-cyan-600" />
                    Climatización por Zonas
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    Dimensionado de Red de Conductos y Elementos de Difusión
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Calcula la potencia térmica necesaria de cada estancia y diseña la red de conductos ajustando el caudal de aire y las velocidades de impulsión sin ruidos ni pérdidas excesivas:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Potencia requerida:</strong> Cálculo por proyecto y por cada zona climatizada.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Red según caudal:</strong> Dimensionado de secciones de conducto por velocidad de aire.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Planos con carga térmica:</strong> Asignación gráfica de potencia y caudal por estancia.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Tablas por tramos:</strong> Dimensiones, pérdida de carga y caudales desglosados tramo a tramo.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Catálogo oficial MYSAir:</strong> Inserción directa de difusores, rejillas y compuertas motorizadas.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Presupuesto PVP automático:</strong> Precios actualizados del sistema de zonas y difusión.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
                      <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                        Diseñar Red de Conductos
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <span className="text-xs text-slate-500">Selección directa de componentes de difusión MYSAir</span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-200">
                    <span className="text-xs font-bold text-cyan-900 uppercase">Resumen Red de Conductos</span>
                    <Badge variant="outline" className="text-cyan-800 border-cyan-400 bg-cyan-100">
                      Difusión MYSAir
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-cyan-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Caudal Total de la Máquina</span>
                      <span className="text-sm font-bold text-cyan-700">1.150 m³/h</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-cyan-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Zonas Climatizadas</span>
                      <span className="text-sm font-bold text-slate-900">5 Zonas Independientes</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-cyan-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Elementos de Difusión</span>
                      <span className="text-sm font-bold text-slate-900">Rejillas lineales motorizadas</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-cyan-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Velocidad Máx. Aire</span>
                      <span className="text-sm font-bold text-emerald-600">3.2 m/s (Silencioso)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-500/10 rounded-xl text-xs text-cyan-900 font-medium leading-relaxed">
                    💨 Planos y tablas de dimensionado listos para imprimir y entregar a los montadores de conductos.
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: VMC CTE DB-HS3 */}
            <TabsContent value="vmc" className="focus:outline-none">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Código Técnico de la Edificación
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    Cálculo de Instalaciones de VMC con Recuperación de Calor
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Diseña sistemas de ventilación mecánica controlada de doble flujo conforme a los caudales mínimos exigidos por el <strong>CTE DB-HS3</strong>:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Caudales normativos CTE:</strong> Cálculo automático en locales secos (impulsión) y húmedos (extracción).</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Diseño de ramales:</strong> Trazado equilibrado de impulsión y extracción con conductos termoplásticos o rígidos.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Selección de recuperador:</strong> Recomendación del equipo óptimo (INC150A, INC250A, INC500A) según caudal promedio.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Lista de materiales:</strong> Genera automáticamente la lista de tubos, distribuidores, plenum, bocas y filtros.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensionado completo:</strong> Diámetros y pérdidas de presión de la red de ventilación.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Información para montaje:</strong> Datos técnicos listos para que los operarios instalen sin dudas en obra.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
                      <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                        Calcular Sistema VMC
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <span className="text-xs text-slate-500">Conforme a las exigencias de calidad de aire interior del CTE</span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <span className="text-xs font-bold text-emerald-900 uppercase">Cálculo VMC CTE DB-HS3</span>
                    <Badge variant="outline" className="text-emerald-800 border-emerald-400 bg-emerald-100">
                      Doble Flujo
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Caudal Impulsión (Locales Secos)</span>
                      <span className="text-sm font-bold text-emerald-700">144 m³/h</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Caudal Extracción (Locales Húmedos)</span>
                      <span className="text-sm font-bold text-emerald-700">140 m³/h</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Recuperador Recomendado</span>
                      <span className="text-sm font-bold text-slate-900">MYSAir INC150A</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200/60 shadow-sm flex justify-between items-center">
                      <span className="text-xs text-slate-600 font-medium">Despiece de Material</span>
                      <span className="text-sm font-bold text-slate-900">100% Desglosado</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-xl text-xs text-emerald-900 font-medium leading-relaxed">
                    🌱 Asegura la máxima eficiencia energética y calidad de aire en viviendas Passivhaus y de alta eficiencia.
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Informes en PDF & Presupuesto */}
            <TabsContent value="informes" className="focus:outline-none">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                    <FileText className="w-4 h-4 text-purple-600" />
                    Documentación Técnica Profesional
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    Generación Automática de Informes Técnicos y Presupuestos PVP
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed">
                    Al terminar tus cálculos, MYSDRAW genera al instante un dossier técnico en formato PDF con el que impresionar a tus clientes y presentar a la dirección facultativa:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Dimensionado general:</strong> Resumen integral de los parámetros del proyecto.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Planos con cargas térmicas:</strong> Representación visual de potencias y caudales por zona.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Tablas de tramos:</strong> Detalle de secciones, presiones y longitudes por circuito.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Fichas técnicas y certificados:</strong> Documentación oficial de los equipos MYSAir seleccionados.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Presupuesto PVP desglosado:</strong> Valoración económica automática del sistema de zonas y difusión.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Marca blanca y profesional:</strong> Documentos limpios y listos para firmar y entregar.</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
                      <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                        Probar Generador de Informes
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <span className="text-xs text-slate-500">Descarga en PDF listo para imprimir o enviar por email</span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-200">
                    <span className="text-xs font-bold text-purple-900 uppercase">Dossier de Proyecto</span>
                    <Badge variant="outline" className="text-purple-800 border-purple-400 bg-purple-100">
                      PDF Listo
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-purple-200/60 shadow-sm flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Memoria de Cálculo de Climatización</span>
                        <span className="text-slate-500">Cargas térmicas y caudales asignados</span>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-purple-200/60 shadow-sm flex items-center gap-3">
                      <FileSpreadsheet className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Planilla de Materiales y Tramos</span>
                        <span className="text-slate-500">Despiece de conductos, rejillas y circuitos</span>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-purple-200/60 shadow-sm flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">Presupuesto PVP Detallado</span>
                        <span className="text-slate-500">Tarifas oficiales actualizadas de MYSAir</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded-xl text-xs text-purple-900 font-medium leading-relaxed">
                    📑 Ahorra horas de redacción de memorias técnicas y presupuestos comerciales.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Comparison: Traditional vs MYSDRAW Online */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">
              ¿Por qué elegir MYSDRAW Online frente al método tradicional?
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Compara la agilidad de una plataforma moderna en la nube frente a hojas de cálculo o programas complejos de escritorio.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 sm:p-5 text-sm font-bold">Aspecto</th>
                  <th className="p-4 sm:p-5 text-sm font-bold text-slate-300">Métodos Tradicionales / Hojas Excel</th>
                  <th className="p-4 sm:p-5 text-sm font-bold text-cyan-400 bg-slate-800">MYSDRAW Online (Gratis)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Instalación y Licencia</td>
                  <td className="p-4 sm:p-5 text-slate-600">Instaladores pesados, costes anuales o dongles USB</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ 100% en la nube, sin instalaciones y 0€ de coste
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Acceso desde Tablet en Obra</td>
                  <td className="p-4 sm:p-5 text-slate-600">Imposible o requiere equipos portátiles dedicados</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ Totalmente táctil y adaptado a tablets
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Cálculo de Suelo Radiante</td>
                  <td className="p-4 sm:p-5 text-slate-600">Cálculos manuales propensos a errores de dimensionado</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ Automatizado bajo norma UNE-EN 1264
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Ventilación VMC DB-HS3</td>
                  <td className="p-4 sm:p-5 text-slate-600">Verificación de caudales en tablas externas del CTE</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ Caudales automáticos y lista de material
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Catálogo de Difusión Integrado</td>
                  <td className="p-4 sm:p-5 text-slate-600">Consultar catálogos PDF en papel o webs de fabricantes</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ Catálogo oficial MYSAir integrado en el flujo
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-900">Generación de Presupuesto PVP</td>
                  <td className="p-4 sm:p-5 text-slate-600">Copiar códigos y precios a un software externo</td>
                  <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/40">
                    ✓ Presupuesto PVP y dossier técnico al instante en PDF
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section id="videotutoriales" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                Academia & Formación
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Videotutoriales Oficiales de MYSDRAW
              </h2>
              <p className="text-slate-300 text-base sm:text-lg mt-3">
                Aprende a sacarle el máximo partido al software en cuestión de minutos.
                Disponemos de videotutoriales prácticos para guiarte en cada tipo de instalación.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs sm:text-sm font-semibold gap-2"
              >
                <a href="https://www.youtube.com/@mysair/featured" target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 text-red-400 fill-red-400" />
                  <span>Canal de YouTube @mysair</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </Button>
            </div>
          </div>

          {/* Tutorials Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tut, index) => (
              <div
                key={tut.id}
                className="group bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-blue-900/20"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <a
                    href={tut.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-video bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 overflow-hidden group-hover:brightness-105 transition-all"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf815_1px,transparent_1px)] [background-size:12px_12px]" />
                    
                    {/* Badge top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tut.badgeColor}`}>
                        {tut.category}
                      </span>
                    </div>

                    {/* Tutorial number watermark */}
                    <div className="absolute bottom-2 left-4 text-5xl font-black text-slate-800/60 select-none">
                      0{index + 1}
                    </div>

                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                        <Play className="w-6 h-6 ml-0.5 fill-white" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[11px] text-slate-300 font-mono">
                      {tut.duration}
                    </div>
                  </a>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors text-base leading-snug">
                      {tut.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {tut.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Videotutorial paso a paso</span>
                  <a
                    href={tut.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
                  >
                    <span>Ver Tutorial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}

            {/* Extra Card: Training & Support */}
            <div className="bg-gradient-to-br from-blue-900/60 via-slate-800/80 to-slate-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">¿Necesitas formación personalizada o ayuda con un proyecto?</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Nuestro equipo de ingenieros técnicos de MYSAir puede asesorarte en el estudio de tu instalación o resolver cualquier consulta técnica.
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <Button asChild className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm">
                  <Link href="/contacto">
                    Contactar con Asistencia Técnica
                  </Link>
                </Button>
                <p className="text-[11px] text-center text-slate-400">Atención personalizada para profesionales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start in 3 Steps */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-3 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-blue-200">
              Rápido y Sencillo
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Empieza a Diseñar en 3 Simples Pasos
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Sin procesos de alta engorrosos ni instalaciones de software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Regístrate Gratis en www.mysdraw.es</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Entra en la plataforma web oficial y crea tu cuenta profesional en menos de un minuto. Sin tarjetas ni compromisos.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.mysdraw.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Ir a www.mysdraw.es
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Crea tu Proyecto y Calcula</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Introduce las zonas de la vivienda, selecciona el módulo (conductos, suelo radiante o VMC) y obtén el dimensionado normativo en segundos.
              </p>
              <div className="pt-2">
                <span className="text-xs text-slate-500">Cálculos automáticos UNE-EN 1264 & CTE DB-HS3</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Descarga tu Informe & Presupuesto</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Obtén con un clic el dossier en PDF con los planos de cargas, dimensionado por tramos, fichas técnicas y presupuesto PVP listo para entregar.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-emerald-600">Documento profesional listo para cliente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-3 bg-slate-100 text-slate-800 border-slate-200">
              Preguntas Frecuentes
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Todo lo que necesitas saber sobre MYSDRAW Online
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Resolvemos las dudas más habituales sobre la plataforma.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Conversion CTA Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
            🚀 Acceso 100% Gratuito
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Empieza a diseñar tus proyectos HVAC con MYSDRAW Online
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Únete a cientos de ingenierías e instaladores que ya reducen sus tiempos de cálculo, eliminan errores y entregan proyectos impecables.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-base font-bold bg-white text-blue-900 hover:bg-slate-100 shadow-xl px-9 py-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <a href="https://www.mysdraw.es" target="_blank" rel="noopener noreferrer">
                <span>Crear Cuenta Gratis en www.mysdraw.es</span>
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base font-semibold border-white/30 bg-white/10 hover:bg-white/20 text-white px-8 py-6 rounded-xl backdrop-blur-sm"
            >
              <Link href="/contacto">
                Contactar con Soporte MYSAir
              </Link>
            </Button>
          </div>

          <p className="text-xs text-blue-200/80 pt-4">
            Disponible 24/7 en la nube • Sin descargas • Compatible con PC, Mac y tablet
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
