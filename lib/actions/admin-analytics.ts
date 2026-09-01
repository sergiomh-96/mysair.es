"use server"

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
        targetToday: Math.round(totalViewsSum / days),
      },
      uniqueVisitors: {
        value: uniqueVisitorsFormatted,
        rawValue: totalVisitorsSum,
        change: +8.4,
        trend: "up",
        targetToday: Math.round(totalVisitorsSum / days),
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
 * Fetch analytics data. If GA4 credentials are configured, calls GA4 Data API.
 * Otherwise returns structured demo data.
 */
export async function getAnalyticsData(period: AnalyticsPeriod = "30d"): Promise<AnalyticsDashboardData> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const credentialsJson = process.env.GA4_CREDENTIALS

  if (propertyId && credentialsJson) {
    try {
      // Future integration with Google Analytics Data API:
      // const analyticsClient = new BetaAnalyticsDataClient({ credentials: JSON.parse(credentialsJson) });
      // const [response] = await analyticsClient.runReport({ ... });
      // return formatGA4Response(response, period);
    } catch (err) {
      console.warn("GA4 Data API call failed, falling back to demo data:", err)
    }
  }

  return getDemoAnalyticsData(period)
}
