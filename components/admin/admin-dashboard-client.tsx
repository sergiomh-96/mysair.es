"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Users,
  Eye,
  Clock,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  BookOpen,
  MessageSquare,
  FileText,
  Bell,
  ArrowLeftRight,
  ExternalLink,
  Smartphone,
  Monitor,
  Globe,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
} from "recharts"
import {
  AnalyticsDashboardData,
  AnalyticsPeriod,
  getAnalyticsData,
} from "@/lib/actions/admin-analytics"
import { cn } from "@/lib/utils"

interface AdminDashboardClientProps {
  initialData: AnalyticsDashboardData
  entityCounts: {
    products: number
    blogs: number
    messages: number
    docs: number
    popups: number
    redirects: number
  }
}

export function AdminDashboardClient({
  initialData,
  entityCounts,
}: AdminDashboardClientProps) {
  const [data, setData] = useState<AnalyticsDashboardData>(initialData)
  const [period, setPeriod] = useState<AnalyticsPeriod>(initialData.period)
  const [isPending, startTransition] = useTransition()

  function handlePeriodChange(newPeriod: AnalyticsPeriod) {
    setPeriod(newPeriod)
    startTransition(async () => {
      const refreshed = await getAnalyticsData(newPeriod)
      setData(refreshed)
    })
  }

  const kpis = [
    {
      title: "Visitas Totales",
      value: data.kpis.totalViews.value,
      change: data.kpis.totalViews.change,
      trend: data.kpis.totalViews.trend,
      subtitle: `${data.kpis.totalViews.targetToday?.toLocaleString("es-ES") ?? 0} media diaria`,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
      barColor: "bg-blue-600",
      progress: 74,
    },
    {
      title: "Visitantes Únicos",
      value: data.kpis.uniqueVisitors.value,
      change: data.kpis.uniqueVisitors.change,
      trend: data.kpis.uniqueVisitors.trend,
      subtitle: `${data.kpis.uniqueVisitors.targetToday?.toLocaleString("es-ES") ?? 0} usuarios/día`,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      barColor: "bg-emerald-600",
      progress: 62,
    },
    {
      title: "Páginas por Sesión",
      value: data.kpis.pageviewsPerSession.value,
      change: data.kpis.pageviewsPerSession.change,
      trend: data.kpis.pageviewsPerSession.trend,
      subtitle: "Interacción media",
      icon: FileSpreadsheet,
      color: "text-violet-600",
      bg: "bg-violet-50",
      barColor: "bg-violet-600",
      progress: 85,
    },
    {
      title: "Tiempo Medio de Visita",
      value: data.kpis.avgDuration.value,
      change: data.kpis.avgDuration.change,
      trend: data.kpis.avgDuration.trend,
      subtitle: "Duración de sesión",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      barColor: "bg-amber-600",
      progress: 58,
    },
  ]

  const entities = [
    {
      title: "Productos",
      value: entityCounts.products,
      icon: Package,
      href: "/admin/productos",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Catálogo y fichas",
    },
    {
      title: "Artículos de Blog",
      value: entityCounts.blogs,
      icon: BookOpen,
      href: "/admin/blogs",
      color: "text-violet-600",
      bg: "bg-violet-50",
      description: "Publicaciones técnicas",
    },
    {
      title: "Documentación",
      value: entityCounts.docs,
      icon: FileText,
      href: "/admin/documentacion",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Manuales y enlaces",
    },
    {
      title: "Mensajes",
      value: entityCounts.messages,
      icon: MessageSquare,
      href: "/admin/mensajes",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Consultas recibidas",
    },
    {
      title: "Popups y Avisos",
      value: entityCounts.popups,
      icon: Bell,
      href: "/admin/popups",
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: "Banners y notificaciones",
    },
    {
      title: "Redirecciones",
      value: entityCounts.redirects,
      icon: ArrowLeftRight,
      href: "/admin/redirects",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "URLs 301/302 gestionadas",
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Control</h1>
            <Badge variant="outline" className="text-xs bg-white text-slate-600 border-slate-200">
              <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
              MYSAir Admin
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Analítica de tráfico, rendimiento de páginas y gestión de contenidos
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          {(
            [
              { id: "7d", label: "7 días" },
              { id: "30d", label: "30 días" },
              { id: "90d", label: "90 días" },
              { id: "12m", label: "12 meses" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => handlePeriodChange(t.id)}
              disabled={isPending}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                period === t.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card
            key={idx}
            className="border-slate-200/80 shadow-xs hover:shadow-md transition-all bg-white relative overflow-hidden group"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {kpi.title}
              </span>
              <div className={cn("p-2 rounded-xl transition-colors", kpi.bg)}>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {kpi.value}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                    kpi.change >= 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-red-50 text-red-700 border border-red-200/60"
                  )}
                >
                  {kpi.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {kpi.change >= 0 ? `+${kpi.change}%` : `${kpi.change}%`}
                </span>
              </div>

              {/* Progress bar indicator */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", kpi.barColor)}
                    style={{ width: `${kpi.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 text-right">{kpi.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Performance Overview */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Tendencia de Visitas y Usuarios
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Evolución de páginas vistas y visitantes únicos en el periodo seleccionado
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Visitas
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Usuarios
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white rounded-lg p-2.5 shadow-xl text-xs space-y-1 border border-slate-700 font-sans">
                            <p className="font-semibold text-slate-300 border-b border-slate-700 pb-1">{label}</p>
                            <p className="text-blue-300 flex items-center justify-between gap-4">
                              <span>Visitas:</span>
                              <span className="font-mono font-bold text-white">
                                {Number(payload[0]?.value).toLocaleString("es-ES")}
                              </span>
                            </p>
                            <p className="text-cyan-300 flex items-center justify-between gap-4">
                              <span>Usuarios:</span>
                              <span className="font-mono font-bold text-white">
                                {Number(payload[1]?.value).toLocaleString("es-ES")}
                              </span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                  />
                  <Bar
                    dataKey="visitors"
                    fill="#38bdf8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={16}
                    opacity={0.7}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic & Devices Overview */}
        <Card className="border-slate-200/80 shadow-xs bg-white flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              Distribución Geográfica
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Procedencia principal de los visitantes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="space-y-3">
              {data.countries.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="text-sm">{c.flag}</span>
                      {c.country}
                    </span>
                    <span className="font-mono text-slate-500 font-semibold">{c.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Devices breakdown */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                Dispositivos
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {data.devices.map((d, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-center mb-1 text-slate-400">
                      {d.device.includes("Escritorio") ? (
                        <Monitor className="h-3.5 w-3.5 text-blue-600" />
                      ) : d.device.includes("Móvil") ? (
                        <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Monitor className="h-3.5 w-3.5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800 font-mono">{d.percentage}%</p>
                    <p className="text-[10px] text-slate-500 truncate">{d.device.split(" ")[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Products Table */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Páginas y Fichas Más Visitadas
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Contenidos con mayor número de consultas y retención
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-normal text-slate-600">
            Top {data.topPages.length} páginas
          </Badge>
        </CardHeader>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-semibold text-slate-700 text-xs">Página / Sección</TableHead>
              <TableHead className="font-semibold text-slate-700 text-xs">Tipo</TableHead>
              <TableHead className="font-semibold text-slate-700 text-xs text-right">Visitas</TableHead>
              <TableHead className="font-semibold text-slate-700 text-xs text-right">% Tráfico</TableHead>
              <TableHead className="font-semibold text-slate-700 text-xs text-right">Tendencia</TableHead>
              <TableHead className="w-12 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topPages.map((page, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/60 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{page.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{page.path}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] font-medium bg-slate-100 text-slate-700">
                    {page.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-bold text-slate-800">
                  {page.views.toLocaleString("es-ES")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${page.percentage * 2.5}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{page.percentage}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-md",
                      page.change >= 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    )}
                  >
                    {page.change >= 0 ? "+" : ""}
                    {page.change}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={page.path}
                    target="_blank"
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors inline-block"
                    title="Ver página"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Content Management Quick Access */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">Gestión de Secciones y Contenido</h2>
          <p className="text-xs text-slate-500">Acceso directo a la edición de cada sección de la web</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                  <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-105", item.bg)}>
                    <item.icon className={cn("h-4 w-4", item.color)} />
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-extrabold text-slate-900 font-mono">{item.value}</p>
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Administrar <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
