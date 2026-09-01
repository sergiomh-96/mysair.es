"use server"

import { BetaAnalyticsDataClient } from "@google-analytics/data"

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12m"

export interface KPIStat {
  value: number | string
  change: number // percentage variation (+12.5, -3.2, etc.)
  trend: "up" | "down" | "neutral"
  rawValue: number
  targetToday?: number
}

export interface AnalyticsKPIs {
  totalViews: KPIStat
  uniqueVisitors: KPIStat
  pageviewsPerSession: KPIStat
  avgDuration: KPIStat
}

export interface TrendDataPoint {
  date: string
  label: string
  views: number
  visitors: number
}

export interface TopPageItem {
  path: string
  title: string
  category: string
  views: number
  percentage: number
  uniqueViews: number
  change: number
}

export interface CountryItem {
  country: string
  code: string
  flag: string
  views: number
  percentage: number
}

export interface DeviceItem {
  device: string
  percentage: number
  views: number
}

export interface AnalyticsDashboardData {
  period: AnalyticsPeriod
  source: "ga4" | "demo"
  kpis: AnalyticsKPIs
  trend: TrendDataPoint[]
  topPages: TopPageItem[]
  countries: CountryItem[]
  devices: DeviceItem[]
  updatedAt: string
}

const COUNTRY_FLAGS: Record<string, string> = {
  ES: "🇪🇸",
  PT: "🇵🇹",
  FR: "🇫🇷",
  MX: "🇲🇽",
  US: "🇺🇸",
  GB: "🇬🇧",
  DE: "🇩🇪",
  IT: "🇮🇹",
  CO: "🇨🇴",
  AR: "🇦🇷",
  CL: "🇨🇱",
  PE: "🇵🇪",
}

function getPeriodDays(period: AnalyticsPeriod): number {
  if (period === "7d") return 7
  if (period === "30d") return 30
  if (period === "90d") return 90
  return 365
}

function getGA4Client(): { client: BetaAnalyticsDataClient; propertyId: string } | null {
  const propertyId = process.env.GA4_PROPERTY_ID?.replace(/^properties\//, "")
  if (!propertyId) return null

  // Option 1: Direct JSON credentials string
  if (process.env.GA4_CREDENTIALS) {
    try {
      const credentials = JSON.parse(process.env.GA4_CREDENTIALS)
      return {
        client: new BetaAnalyticsDataClient({ credentials }),
        propertyId,
      }
    } catch {
      // ignore
    }
  }

  // Option 2: Email & Private Key
  const clientEmail = process.env.GA4_CLIENT_EMAIL
  let privateKey = process.env.GA4_PRIVATE_KEY

  if (clientEmail && privateKey) {
    // Handle escaped newlines in env variables
    privateKey = privateKey.replace(/\\n/g, "\n")
    return {
      client: new BetaAnalyticsDataClient({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
      }),
      propertyId,
    }
  }

  return null
}

/**
 * Generates realistic deterministic baseline data for demo mode
 */
function getDemoAnalyticsData(period: AnalyticsPeriod): AnalyticsDashboardData {
  const now = new Date()
  const trendPoints: TrendDataPoint[] = []

  let days = 7
  if (period === "30d") days = 30
  if (period === "90d") days = 90
  if (period === "12m") days = 12

  if (period === "12m") {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const currentMonth = now.getMonth()
    for (let i = 11; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12
      const baseViews = 3800 + Math.sin(i * 0.8) * 1200 + ((12 - i) * 180)
      const visitors = Math.round(baseViews * 0.62)
      trendPoints.push({
        date: `2025-${String(monthIdx + 1).padStart(2, "0")}`,
        label: monthNames[monthIdx],
        views: Math.round(baseViews),
        visitors,
      })
    }
  } else {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      const baseMultiplier = isWeekend ? 0.65 : 1.15
      const variation = Math.sin(i * 1.3) * 45 + (days - i) * 3
      const views = Math.max(120, Math.round((280 + variation) * baseMultiplier))
      const visitors = Math.round(views * 0.68)

      trendPoints.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("es-ES", {
          day: "numeric",
          month: days > 14 ? "numeric" : "short",
        }),
        views,
        visitors,
      })
    }
  }

  const totalViewsSum = trendPoints.reduce((acc, p) => acc + p.views, 0)
  const totalVisitorsSum = trendPoints.reduce((acc, p) => acc + p.visitors, 0)
  const avgViewsPerSession = +(totalViewsSum / (totalVisitorsSum || 1)).toFixed(2)

  const topPages: TopPageItem[] = [
    {
      path: "/",
      title: "Inicio | MYSAir Climatización",
      category: "Página Principal",
      views: Math.round(totalViewsSum * 0.34),
      uniqueViews: Math.round(totalVisitorsSum * 0.36),
      percentage: 34,
      change: +14.2,
    },
    {
      path: "/productos",
      title: "Catálogo de Productos y Difusión",
      category: "Catálogo",
      views: Math.round(totalViewsSum * 0.22),
      uniqueViews: Math.round(totalVisitorsSum * 0.21),
      percentage: 22,
      change: +8.7,
    },
    {
      path: "/productos/ms201v",
      title: "Rejilla Lineal MS201V",
      category: "Ficha Producto",
      views: Math.round(totalViewsSum * 0.12),
      uniqueViews: Math.round(totalVisitorsSum * 0.11),
      percentage: 12,
      change: +21.4,
    },
    {
      path: "/compatibilidad",
      title: "Tabla de Compatibilidad de Equipos",
      category: "Herramientas",
      views: Math.round(totalViewsSum * 0.09),
      uniqueViews: Math.round(totalVisitorsSum * 0.08),
      percentage: 9,
      change: -2.3,
    },
    {
      path: "/documentacion",
      title: "Centro de Documentación Técnica",
      category: "Documentación",
      views: Math.round(totalViewsSum * 0.08),
      uniqueViews: Math.round(totalVisitorsSum * 0.08),
      percentage: 8,
      change: +5.1,
    },
    {
      path: "/blogs",
      title: "Blog & Novedades Técnicas",
      category: "Blog",
      views: Math.round(totalViewsSum * 0.06),
      uniqueViews: Math.round(totalVisitorsSum * 0.07),
      percentage: 6,
      change: +11.8,
    },
    {
      path: "/contacto",
      title: "Contacto y Solicitud de Presupuesto",
      category: "Contacto",
      views: Math.round(totalViewsSum * 0.05),
      uniqueViews: Math.round(totalVisitorsSum * 0.05),
      percentage: 5,
      change: +18.9,
    },
    {
      path: "/software",
      title: "Software de Selección y Cálculo",
      category: "Software",
      views: Math.round(totalViewsSum * 0.04),
      uniqueViews: Math.round(totalVisitorsSum * 0.04),
      percentage: 4,
      change: +3.4,
    },
  ]

  const countries: CountryItem[] = [
    { country: "España", code: "ES", flag: "🇪🇸", views: Math.round(totalViewsSum * 0.76), percentage: 76 },
    { country: "Portugal", code: "PT", flag: "🇵🇹", views: Math.round(totalViewsSum * 0.09), percentage: 9 },
    { country: "Francia", code: "FR", flag: "🇫🇷", views: Math.round(totalViewsSum * 0.06), percentage: 6 },
    { country: "México", code: "MX", flag: "🇲🇽", views: Math.round(totalViewsSum * 0.04), percentage: 4 },
    { country: "Otros países", code: "GL", flag: "🌐", views: Math.round(totalViewsSum * 0.05), percentage: 5 },
  ]

  const devices: DeviceItem[] = [
    { device: "Escritorio (PC/Mac)", percentage: 58, views: Math.round(totalViewsSum * 0.58) },
    { device: "Móvil (iOS/Android)", percentage: 38, views: Math.round(totalViewsSum * 0.38) },
    { device: "Tablet", percentage: 4, views: Math.round(totalViewsSum * 0.04) },
  ]

  const totalViewsFormatted = totalViewsSum.toLocaleString("es-ES")
  const uniqueVisitorsFormatted = totalVisitorsSum.toLocaleString("es-ES")

  return {
    period,
    source: "demo",
    kpis: {
      totalViews: {
        value: totalViewsFormatted,
        rawValue: totalViewsSum,
        change: +12.5,
        trend: "up",
        targetToday: Math.round(totalViewsSum / (days || 1)),
      },
      uniqueVisitors: {
        value: uniqueVisitorsFormatted,
        rawValue: totalVisitorsSum,
        change: +8.4,
        trend: "up",
        targetToday: Math.round(totalVisitorsSum / (days || 1)),
      },
      pageviewsPerSession: {
        value: avgViewsPerSession.toFixed(1),
        rawValue: avgViewsPerSession,
        change: +3.2,
        trend: "up",
      },
      avgDuration: {
        value: "2m 45s",
        rawValue: 165,
        change: +9.1,
        trend: "up",
      },
    },
    trend: trendPoints,
    topPages,
    countries,
    devices,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Fetch real analytics data from GA4 Data API.
 */
async function fetchRealGA4Data(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  period: AnalyticsPeriod
): Promise<AnalyticsDashboardData> {
  const days = getPeriodDays(period)
  const property = `properties/${propertyId}`

  const startDate = `${days}daysAgo`
  const endDate = "today"
  const prevStartDate = `${days * 2}daysAgo`
  const prevEndDate = `${days + 1}daysAgo`

  // 1. Current Period KPIs & Prev Period KPIs
  const [kpiReport] = await client.runReport({
    property,
    dateRanges: [
      { startDate, endDate, name: "current" },
      { startDate: prevStartDate, endDate: prevEndDate, name: "previous" },
    ],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "userEngagementDuration" },
    ],
  })

  const currentTotals = kpiReport.rows?.find((r) => r.dimensionValues?.[0]?.value === "current") || kpiReport.rows?.[0]
  const prevTotals = kpiReport.rows?.find((r) => r.dimensionValues?.[0]?.value === "previous")

  const currentViews = Number(currentTotals?.metricValues?.[0]?.value || 0)
  const currentUsers = Number(currentTotals?.metricValues?.[1]?.value || 0)
  const currentSessions = Number(currentTotals?.metricValues?.[2]?.value || 1)
  const currentDurationSec = Number(currentTotals?.metricValues?.[3]?.value || 0)

  const prevViews = Number(prevTotals?.metricValues?.[0]?.value || 0)
  const prevUsers = Number(prevTotals?.metricValues?.[1]?.value || 0)
  const prevSessions = Number(prevTotals?.metricValues?.[2]?.value || 1)
  const prevDurationSec = Number(prevTotals?.metricValues?.[3]?.value || 0)

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return 0
    return +(((curr - prev) / prev) * 100).toFixed(1)
  }

  const viewsChange = calcChange(currentViews, prevViews)
  const usersChange = calcChange(currentUsers, prevUsers)
  const pagesPerSession = +(currentViews / (currentSessions || 1)).toFixed(2)
  const prevPagesPerSession = +(prevViews / (prevSessions || 1)).toFixed(2)
  const ppsChange = calcChange(pagesPerSession, prevPagesPerSession)

  const avgDuration = Math.round(currentDurationSec / (currentSessions || 1))
  const prevAvgDuration = Math.round(prevDurationSec / (prevSessions || 1))
  const durationChange = calcChange(avgDuration, prevAvgDuration)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // 2. Trend (Timeseries)
  const [trendReport] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
  })

  const trend: TrendDataPoint[] = (trendReport.rows || []).map((row) => {
    const rawDate = row.dimensionValues?.[0]?.value || "" // YYYYMMDD
    const y = rawDate.slice(0, 4)
    const m = rawDate.slice(4, 6)
    const d = rawDate.slice(6, 8)
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d))

    return {
      date: `${y}-${m}-${d}`,
      label: dateObj.toLocaleDateString("es-ES", {
        day: "numeric",
        month: days > 14 ? "numeric" : "short",
      }),
      views: Number(row.metricValues?.[0]?.value || 0),
      visitors: Number(row.metricValues?.[1]?.value || 0),
    }
  })

  // 3. Top Pages
  const [pagesReport] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  })

  const topPages: TopPageItem[] = (pagesReport.rows || []).map((row) => {
    const path = row.dimensionValues?.[0]?.value || "/"
    const title = row.dimensionValues?.[1]?.value || path
    const views = Number(row.metricValues?.[0]?.value || 0)
    const uniqueViews = Number(row.metricValues?.[1]?.value || 0)
    const percentage = currentViews > 0 ? +((views / currentViews) * 100).toFixed(1) : 0

    let category = "General"
    if (path === "/") category = "Página Principal"
    else if (path.startsWith("/productos")) category = "Catálogo"
    else if (path.startsWith("/blogs") || path.startsWith("/blog")) category = "Blog"
    else if (path.startsWith("/contacto")) category = "Contacto"
    else if (path.startsWith("/documentacion")) category = "Documentación"
    else if (path.startsWith("/compatibilidad")) category = "Herramientas"
    else if (path.startsWith("/software")) category = "Software"

    return {
      path,
      title,
      category,
      views,
      uniqueViews,
      percentage,
      change: 0,
    }
  })

  // 4. Countries
  const [countriesReport] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "country" }, { name: "countryId" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 6,
  })

  const countries: CountryItem[] = (countriesReport.rows || []).map((row) => {
    const country = row.dimensionValues?.[0]?.value || "Desconocido"
    const code = (row.dimensionValues?.[1]?.value || "GL").toUpperCase()
    const views = Number(row.metricValues?.[0]?.value || 0)
    const percentage = currentViews > 0 ? +((views / currentViews) * 100).toFixed(1) : 0
    const flag = COUNTRY_FLAGS[code] || "🌐"

    return {
      country,
      code,
      flag,
      views,
      percentage,
    }
  })

  // 5. Devices
  const [devicesReport] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  })

  const devices: DeviceItem[] = (devicesReport.rows || []).map((row) => {
    const rawDevice = row.dimensionValues?.[0]?.value?.toLowerCase() || "desktop"
    const views = Number(row.metricValues?.[0]?.value || 0)
    const percentage = currentViews > 0 ? +((views / currentViews) * 100).toFixed(1) : 0

    let deviceName = "Escritorio (PC/Mac)"
    if (rawDevice === "mobile") deviceName = "Móvil (iOS/Android)"
    if (rawDevice === "tablet") deviceName = "Tablet"

    return {
      device: deviceName,
      percentage,
      views,
    }
  })

  return {
    period,
    source: "ga4",
    kpis: {
      totalViews: {
        value: currentViews.toLocaleString("es-ES"),
        rawValue: currentViews,
        change: viewsChange,
        trend: viewsChange >= 0 ? "up" : "down",
        targetToday: Math.round(currentViews / (days || 1)),
      },
      uniqueVisitors: {
        value: currentUsers.toLocaleString("es-ES"),
        rawValue: currentUsers,
        change: usersChange,
        trend: usersChange >= 0 ? "up" : "down",
        targetToday: Math.round(currentUsers / (days || 1)),
      },
      pageviewsPerSession: {
        value: pagesPerSession.toFixed(1),
        rawValue: pagesPerSession,
        change: ppsChange,
        trend: ppsChange >= 0 ? "up" : "down",
      },
      avgDuration: {
        value: formatDuration(avgDuration),
        rawValue: avgDuration,
        change: durationChange,
        trend: durationChange >= 0 ? "up" : "down",
      },
    },
    trend,
    topPages,
    countries,
    devices,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Fetch analytics data. If GA4 credentials are configured, calls GA4 Data API.
 * Otherwise returns structured demo data.
 */
export async function getAnalyticsData(period: AnalyticsPeriod = "30d"): Promise<AnalyticsDashboardData> {
  const ga4 = getGA4Client()

  if (ga4) {
    try {
      return await fetchRealGA4Data(ga4.client, ga4.propertyId, period)
    } catch (err) {
      console.warn("[GA4 Data API] Error fetching analytics data, using fallback:", err)
    }
  }

  return getDemoAnalyticsData(period)
}
