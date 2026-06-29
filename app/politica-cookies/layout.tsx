import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Política de Cookies | MYSAir",
  description: "Información detallada sobre el uso de cookies en el sitio web oficial de MYSAir.",
}

export default function PoliticaCookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
